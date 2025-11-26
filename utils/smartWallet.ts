import {
  Contract,
  SorobanRpc,
  Keypair,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';

// Import stellar utilities
const RPC_URL = 'https://soroban-testnet.stellar.org';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;

// Initialize Soroban RPC server
export const sorobanRpc = new SorobanRpc.Server(RPC_URL);

// Helper to get account info (using fetch for SSR compatibility)
async function getAccount(publicKey: string) {
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

/**
 * Initialize a Smart Wallet contract with a Passkey public key
 * 
 * @param contractId - The Smart Wallet contract ID
 * @param passkeyPublicKey - The secp256r1 public key (65 bytes uncompressed) from Passkey
 * @param signerSecretKey - Secret key to sign the initialization transaction
 * @returns Transaction hash
 */
export async function initializeSmartWallet(
  contractId: string,
  passkeyPublicKey: Uint8Array,
  signerSecretKey: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    if (passkeyPublicKey.length !== 65) {
      throw new Error('Passkey public key must be 65 bytes (uncompressed secp256r1)');
    }

    const keypair = Keypair.fromSecret(signerSecretKey);
    const account = await getAccount(keypair.publicKey());

    const contract = new Contract(contractId);
    
    // Convert public key to BytesN<65> ScVal
    const publicKeyScVal = nativeToScVal(Array.from(passkeyPublicKey), { type: 'bytes' });

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
    // In SDK 11.x, we manually set the soroban data
    if (simResponse.transactionData) {
      (transaction as any).sorobanData = simResponse.transactionData.build();
    }

    // Sign
    transaction.sign(keypair);

    // Send
    const sendResponse = await sorobanRpc.sendTransaction(transaction);
    
    // In SDK 11.x, sendTransaction returns a hash string or an error
    if (typeof sendResponse === 'string') {
      // Poll for result
      let status: string = 'UNKNOWN';
      let result;
      
      while (status === 'UNKNOWN' || status === 'NOT_FOUND') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const getTxResponse = await sorobanRpc.getTransaction(sendResponse);
        status = getTxResponse.status as string;
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
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Get the current nonce from the Smart Wallet contract
 * 
 * @param contractId - The Smart Wallet contract ID
 * @returns Current nonce or null if error
 */
export async function getWalletNonce(contractId: string): Promise<number | null> {
  try {
    const contract = new Contract(contractId);
    
    // Create a dummy keypair for read-only calls (won't be used for signing)
    const dummyKeypair = Keypair.random();
    let dummyAccount;
    try {
      dummyAccount = await getAccount(dummyKeypair.publicKey());
    } catch {
      // If account doesn't exist, create a minimal account object
      dummyAccount = {
        accountId: dummyKeypair.publicKey(),
        sequenceNumber: () => '0',
        incrementSequenceNumber: () => {},
      } as any;
    }

    // Build a read-only transaction (simulate only)
    const transaction = new TransactionBuilder(dummyAccount as any, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('get_nonce'))
      .setTimeout(30)
      .build();

    // Simulate the transaction (read-only, no signing needed)
    const simResponse = await sorobanRpc.simulateTransaction(transaction);
    
    if (SorobanRpc.Api.isSimulationError(simResponse)) {
      console.error('Simulation error getting nonce:', simResponse.error);
      return null;
    }

    // Extract return value from simulation
    if (simResponse.result && simResponse.result.retval) {
      const nonce = scValToNative(simResponse.result.retval) as number;
      return nonce;
    }

    return null;
  } catch (error: any) {
    console.error('Error getting wallet nonce:', error);
    return null;
  }
}

/**
 * Get the Passkey public key from the Smart Wallet contract
 * 
 * @param contractId - The Smart Wallet contract ID
 * @returns Passkey public key (65 bytes) or null if error
 */
export async function getPasskeyPublicKey(contractId: string): Promise<Uint8Array | null> {
  try {
    const contract = new Contract(contractId);
    
    // Create a dummy keypair for read-only calls
    const dummyKeypair = Keypair.random();
    let dummyAccount;
    try {
      dummyAccount = await getAccount(dummyKeypair.publicKey());
    } catch {
      dummyAccount = {
        accountId: dummyKeypair.publicKey(),
        sequenceNumber: () => '0',
        incrementSequenceNumber: () => {},
      } as any;
    }

    // Build a read-only transaction (simulate only)
    const transaction = new TransactionBuilder(dummyAccount as any, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('get_passkey_public_key'))
      .setTimeout(30)
      .build();

    // Simulate the transaction (read-only, no signing needed)
    const simResponse = await sorobanRpc.simulateTransaction(transaction);
    
    if (SorobanRpc.Api.isSimulationError(simResponse)) {
      console.error('Simulation error getting public key:', simResponse.error);
      return null;
    }

    // Extract return value from simulation
    if (simResponse.result && simResponse.result.retval) {
      const publicKeyArray = scValToNative(simResponse.result.retval) as number[];
      return new Uint8Array(publicKeyArray);
    }

    return null;
  } catch (error: any) {
    console.error('Error getting passkey public key:', error);
    return null;
  }
}

/**
 * Check if the Smart Wallet is initialized
 * 
 * @param contractId - The Smart Wallet contract ID
 * @returns true if initialized, false otherwise
 */
export async function isWalletInitialized(contractId: string): Promise<boolean> {
  try {
    const nonce = await getWalletNonce(contractId);
    return nonce !== null;
  } catch (error) {
    return false;
  }
}

