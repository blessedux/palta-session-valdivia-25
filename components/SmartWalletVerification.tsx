'use client';

import { useState, useEffect } from 'react';
import {
  createPasskey,
  extractSecp256r1PublicKey,
  signWithPasskey,
  storeCredentialId,
  getStoredCredentialId,
  storePasskeyPublicKey,
  getStoredPasskeyPublicKey,
  isWebAuthnSupported,
} from '@/utils/passkeys';
import {
  initializeSmartWallet,
  getWalletNonce,
  getPasskeyPublicKey,
  isWalletInitialized,
} from '@/utils/smartWallet';
import { Keypair } from '@stellar/stellar-sdk';

interface SmartWalletVerificationProps {
  contractId?: string;
  signerSecretKey?: string;
}

export default function SmartWalletVerification({
  contractId: propContractId,
  signerSecretKey: propSignerSecretKey,
}: SmartWalletVerificationProps) {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [contractId, setContractId] = useState(propContractId || '');
  const [signerSecretKey, setSignerSecretKey] = useState(propSignerSecretKey || '');
  const [walletStatus, setWalletStatus] = useState<{
    initialized: boolean;
    nonce: number | null;
    storedPublicKey: string | null;
    contractPublicKey: string | null;
  } | null>(null);
  const [passkeyCreated, setPasskeyCreated] = useState(false);

  // Check WebAuthn support
  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    setIsSupported(isWebAuthnSupported());
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredPasskeyPublicKey();
    if (stored) {
      setPasskeyCreated(true);
    }
    
    // Try to get contract ID from env
    if (!contractId && typeof window !== 'undefined') {
      const envContractId = process.env.NEXT_PUBLIC_WALLET_CONTRACT_ID;
      if (envContractId) {
        setContractId(envContractId);
      }
    }
  }, [contractId]);

  const bytesToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleCreatePasskey = async () => {
    setIsLoading(true);
    setStatus('Creating Passkey...');
    try {
      const username = `user_${Date.now()}`;
      const credential = await createPasskey(username);
      
      if (!credential.rawId) {
        throw new Error('Failed to get credential ID');
      }

      // Extract public key
      const publicKey = await extractSecp256r1PublicKey(credential);
      
      if (!publicKey) {
        // If extraction fails, we need to use a workaround
        // For testing, we can generate a mock key based on credential ID
        setStatus('⚠️ Public key extraction not fully supported. Using credential ID as reference.');
        setStatus('💡 In production, use passkey-kit library for proper extraction.');
        
        // Store credential ID for later use
        storeCredentialId(credential.rawId);
        setPasskeyCreated(true);
        setIsLoading(false);
        return;
      }

      // Store credential ID and public key
      storeCredentialId(credential.rawId);
      storePasskeyPublicKey(publicKey);
      setPasskeyCreated(true);

      setStatus(`✅ Passkey created! Public key: ${bytesToHex(publicKey.slice(0, 20))}... (${publicKey.length} bytes)`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeWallet = async () => {
    if (!contractId) {
      setStatus('❌ Please provide a contract ID');
      return;
    }

    if (!signerSecretKey) {
      setStatus('❌ Please provide a signer secret key');
      return;
    }

    setIsLoading(true);
    setStatus('Initializing Smart Wallet...');
    try {
      const stored = getStoredPasskeyPublicKey();
      if (!stored) {
        throw new Error('No Passkey public key found. Please create a Passkey first.');
      }

      if (stored.length !== 65) {
        throw new Error(`Invalid public key length: ${stored.length} (expected 65)`);
      }

      const result = await initializeSmartWallet(
        contractId,
        stored,
        signerSecretKey
      );

      if (result.success) {
        setStatus(`✅ Smart Wallet initialized! Transaction: ${result.hash}`);
        // Check wallet status
        await checkWalletStatus();
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWalletStatus = async () => {
    if (!contractId) return;

    try {
      const initialized = await isWalletInitialized(contractId);
      const nonce = initialized ? await getWalletNonce(contractId) : null;
      const contractPublicKey = initialized ? await getPasskeyPublicKey(contractId) : null;
      const storedPublicKey = getStoredPasskeyPublicKey();

      setWalletStatus({
        initialized,
        nonce,
        storedPublicKey: storedPublicKey ? bytesToHex(storedPublicKey) : null,
        contractPublicKey: contractPublicKey ? bytesToHex(contractPublicKey) : null,
      });
    } catch (error: any) {
      console.error('Error checking wallet status:', error);
    }
  };

  const getExplorerLink = (contractId: string) => {
    return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
  };

  const getLaboratoryLink = (contractId: string) => {
    return `https://laboratory.stellar.org/?network=testnet#contract&contractId=${contractId}`;
  };

  if (!isSupported) {
    return (
      <div style={{ padding: '2rem', border: '1px solid #ff6b6b', borderRadius: '8px', backgroundColor: '#ffe0e0' }}>
        <h2>⚠️ WebAuthn Not Supported</h2>
        <p>Your browser does not support WebAuthn/Passkeys. Please use a modern browser like Chrome, Firefox, or Safari.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', margin: '1rem 0', maxWidth: '800px' }}>
      <h2>🔐 Smart Wallet & Passkey Verification</h2>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Verify that your passkey-dependent smart wallet is working correctly
      </p>

      {/* Configuration */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0 }}>Configuration</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
            Wallet Contract ID:
          </label>
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Enter contract ID (e.g., CAPUILZITFUHBV5XO5ABE3JKWKJKP73J74UGBWQXLBPUAHNW6TRJ6LOL)"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
            Signer Secret Key (for initialization):
          </label>
            <input
              type="password"
              value={signerSecretKey}
              onChange={(e) => setSignerSecretKey(e.target.value)}
              placeholder="Enter secret key (starts with S...)"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          onClick={handleCreatePasskey}
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {isLoading ? 'Loading...' : '1. Create Passkey'}
        </button>
        
        <button
          onClick={handleInitializeWallet}
          disabled={isLoading || !contractId || !signerSecretKey || !passkeyCreated}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: (!contractId || !signerSecretKey || !passkeyCreated) ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!contractId || !signerSecretKey || !passkeyCreated) ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {isLoading ? 'Loading...' : '2. Initialize Wallet'}
        </button>
        
        <button
          onClick={checkWalletStatus}
          disabled={isLoading || !contractId}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: !contractId ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !contractId ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          Check Status
        </button>
      </div>

      {/* Status Messages */}
      {status && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('⚠️') ? '#fff3cd' : '#f8d7da',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{status}</pre>
        </div>
      )}

      {/* Wallet Status */}
      {walletStatus && (
        <div style={{ padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '4px', marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Wallet Status:</h3>
          <p><strong>Initialized:</strong> {walletStatus.initialized ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Nonce:</strong> {walletStatus.nonce !== null ? walletStatus.nonce : 'N/A'}</p>
          {walletStatus.storedPublicKey && (
            <p><strong>Stored Public Key:</strong> {walletStatus.storedPublicKey.slice(0, 40)}...</p>
          )}
          {walletStatus.contractPublicKey && (
            <p><strong>Contract Public Key:</strong> {walletStatus.contractPublicKey.slice(0, 40)}...</p>
          )}
          {walletStatus.storedPublicKey && walletStatus.contractPublicKey && (
            <p>
              <strong>Keys Match:</strong>{' '}
              {walletStatus.storedPublicKey === walletStatus.contractPublicKey ? '✅ Yes' : '❌ No'}
            </p>
          )}
        </div>
      )}

      {/* Explorer Links */}
      {contractId && (
        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>🔍 View in Explorer:</h3>
          <p>
            <a href={getExplorerLink(contractId)} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
              Stellar Expert Explorer
            </a>
          </p>
          <p>
            <a href={getLaboratoryLink(contractId)} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
              Stellar Laboratory
            </a>
          </p>
        </div>
      )}

      {!contractId && (
        <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <p>⚠️ Please set the Wallet Contract ID above or set NEXT_PUBLIC_WALLET_CONTRACT_ID environment variable</p>
        </div>
      )}
    </div>
  );
}

