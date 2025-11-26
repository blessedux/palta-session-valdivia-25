#!/usr/bin/env node
/**
 * Test script to verify smart wallet initialization
 * 
 * This script tests:
 * 1. Contract compilation (WASM file exists)
 * 2. Contract deployment (if contract ID provided)
 * 3. Wallet initialization with a mock passkey public key
 * 
 * Usage:
 *   node test_wallet_init.js [CONTRACT_ID] [SIGNER_SECRET_KEY]
 * 
 * Example:
 *   node test_wallet_init.js CAPUILZITFUHBV5XO5ABE3JKWKJKP73J74UGBWQXLBPUAHNW6TRJ6LOL SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 */

const { Contract, SorobanRpc, nativeToScVal, scValToNative, Keypair, TransactionBuilder, Networks, BASE_FEE } = require('@stellar/stellar-sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const RPC_URL = 'https://soroban-testnet.stellar.org';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;

// Get arguments
const CONTRACT_ID = process.argv[2];
const SIGNER_SECRET_KEY = process.argv[3];

// Initialize servers
const sorobanRpc = new SorobanRpc.Server(RPC_URL);

// Helper to get account info
async function getAccount(publicKey) {
  const response = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
  if (!response.ok) {
    throw new Error(`Failed to load account: ${response.statusText}`);
  }
  const accountData = await response.json();
  return {
    accountId: accountData.account_id,
    sequenceNumber: () => accountData.sequence,
    incrementSequenceNumber: () => {},
  };
}

// Generate a mock passkey public key (65 bytes uncompressed secp256r1)
function generateMockPasskeyPublicKey() {
  const publicKey = new Uint8Array(65);
  publicKey[0] = 0x04; // Uncompressed prefix
  // Fill with test data
  for (let i = 1; i < 65; i++) {
    publicKey[i] = i % 256;
  }
  return publicKey;
}

// Check if wallet is initialized
async function isWalletInitialized(contractId) {
  try {
    const contract = new Contract(contractId);
    const dummyKeypair = Keypair.random();
    
    const transaction = new TransactionBuilder(
      {
        accountId: dummyKeypair.publicKey(),
        sequenceNumber: () => '0',
        incrementSequenceNumber: () => {},
      },
      {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      }
    )
      .addOperation(contract.call('get_nonce'))
      .setTimeout(30)
      .build();

    const simResponse = await sorobanRpc.simulateTransaction(transaction);
    
    if (SorobanRpc.Api.isSimulationError(simResponse)) {
      return false;
    }

    return simResponse.result && simResponse.result.retval !== undefined;
  } catch (error) {
    return false;
  }
}

// Get wallet nonce
async function getWalletNonce(contractId) {
  try {
    const contract = new Contract(contractId);
    const dummyKeypair = Keypair.random();
    
    const transaction = new TransactionBuilder(
      {
        accountId: dummyKeypair.publicKey(),
        sequenceNumber: () => '0',
        incrementSequenceNumber: () => {},
      },
      {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      }
    )
      .addOperation(contract.call('get_nonce'))
      .setTimeout(30)
      .build();

    const simResponse = await sorobanRpc.simulateTransaction(transaction);
    
    if (SorobanRpc.Api.isSimulationError(simResponse)) {
      return null;
    }

    if (simResponse.result && simResponse.result.retval) {
      return scValToNative(simResponse.result.retval);
    }

    return null;
  } catch (error) {
    console.error('Error getting nonce:', error.message);
    return null;
  }
}

// Initialize smart wallet
async function initializeSmartWallet(contractId, passkeyPublicKey, signerSecretKey) {
  try {
    if (passkeyPublicKey.length !== 65) {
      throw new Error('Passkey public key must be 65 bytes (uncompressed secp256r1)');
    }

    const keypair = Keypair.fromSecret(signerSecretKey);
    const account = await getAccount(keypair.publicKey());

    const contract = new Contract(contractId);
    
    // Convert public key to BytesN<65> ScVal
    // For BytesN, we need to use bytes type with the exact length
    const publicKeyScVal = nativeToScVal(
      Buffer.from(passkeyPublicKey),
      { type: 'bytes' }
    );

    // Build transaction
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('init', publicKeyScVal))
      .setTimeout(30)
      .build();

    // Simulate first
    const simResponse = await sorobanRpc.simulateTransaction(transaction);
    
    if (SorobanRpc.Api.isSimulationError(simResponse)) {
      throw new Error(`Simulation error: ${JSON.stringify(simResponse.error)}`);
    }

    // Prepare transaction with footprint
    if (simResponse.transactionData) {
      transaction.sorobanData = simResponse.transactionData.build();
    }

    // Sign
    transaction.sign(keypair);

    // Send
    const sendResponse = await sorobanRpc.sendTransaction(transaction);
    
    // In SDK 11.x, sendTransaction returns a hash string or an error
    if (typeof sendResponse === 'string') {
      // Poll for result
      let status = 'UNKNOWN';
      let result;
      
      while (status === 'UNKNOWN' || status === 'NOT_FOUND') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const getTxResponse = await sorobanRpc.getTransaction(sendResponse);
        status = getTxResponse.status;
        result = getTxResponse;
      }

      if (status === 'SUCCESS') {
        return {
          success: true,
          hash: sendResponse,
        };
      } else {
        throw new Error(`Transaction failed with status: ${status}`);
      }
    } else {
      throw new Error(`Failed to send transaction: ${JSON.stringify(sendResponse)}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

// Main test function
async function testSmartWallet() {
  console.log('🔍 Smart Wallet Contract Test\n');
  console.log('='.repeat(60));
  
  // Step 1: Check WASM file
  console.log('1️⃣ Checking contract compilation...');
  const wasmPath = path.join(__dirname, 'contracts', 'target', 'wasm32v1-none', 'release', 'smart_wallet_contracts.wasm');
  
  if (fs.existsSync(wasmPath)) {
    const stats = fs.statSync(wasmPath);
    console.log(`   ✅ WASM file exists: ${wasmPath}`);
    console.log(`   ✅ Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
  } else {
    console.log(`   ❌ WASM file not found: ${wasmPath}`);
    console.log('   💡 Run: cd contracts && cargo build --target wasm32v1-none --release\n');
    return;
  }
  
  // Step 2: Test contract if ID provided
  if (CONTRACT_ID && SIGNER_SECRET_KEY) {
    console.log('2️⃣ Testing contract initialization...');
    console.log(`   Contract ID: ${CONTRACT_ID}\n`);
    
    // Check if already initialized
    const isInitialized = await isWalletInitialized(CONTRACT_ID);
    
    if (isInitialized) {
      console.log('   ✅ Wallet is already initialized');
      const nonce = await getWalletNonce(CONTRACT_ID);
      console.log(`   ✅ Current nonce: ${nonce !== null ? nonce : 'N/A'}\n`);
    } else {
      console.log('   ⚠️  Wallet is not initialized\n');
      
      // Generate mock passkey public key
      console.log('3️⃣ Generating mock passkey public key...');
      const passkeyPublicKey = generateMockPasskeyPublicKey();
      console.log(`   ✅ Generated: ${Array.from(passkeyPublicKey.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join('')}... (${passkeyPublicKey.length} bytes)\n`);
      
      // Initialize wallet
      console.log('4️⃣ Initializing smart wallet...');
      const result = await initializeSmartWallet(
        CONTRACT_ID,
        passkeyPublicKey,
        SIGNER_SECRET_KEY
      );
      
      if (result.success) {
        console.log(`   ✅ Wallet initialized successfully!`);
        console.log(`   ✅ Transaction hash: ${result.hash}\n`);
        
        // Wait and verify
        console.log('5️⃣ Verifying initialization...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const nonce = await getWalletNonce(CONTRACT_ID);
        if (nonce !== null) {
          console.log(`   ✅ Wallet verified! Nonce: ${nonce}\n`);
        } else {
          console.log(`   ⚠️  Could not verify nonce (may need more time)\n`);
        }
      } else {
        console.log(`   ❌ Failed to initialize: ${result.error}\n`);
      }
    }
    
    // Explorer links
    console.log('6️⃣ Explorer Links:');
    console.log(`   📊 Stellar Expert: https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`);
    console.log(`   📊 Stellar Laboratory: https://laboratory.stellar.org/?network=testnet#contract&contractId=${CONTRACT_ID}\n`);
  } else {
    console.log('2️⃣ Contract testing skipped (no contract ID or signer key provided)');
    console.log('   💡 To test initialization, provide:');
    console.log('      node test_wallet_init.js [CONTRACT_ID] [SIGNER_SECRET_KEY]\n');
  }
  
  console.log('='.repeat(60));
  console.log('✅ Test complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Deploy the contract: soroban contract deploy --wasm contracts/target/wasm32v1-none/release/smart_wallet_contracts.wasm --source YOUR_KEY --network testnet');
  console.log('   2. Initialize with: node test_wallet_init.js [CONTRACT_ID] [SIGNER_SECRET_KEY]');
  console.log('   3. Verify in explorer using the links above');
}

// Run test
testSmartWallet().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

