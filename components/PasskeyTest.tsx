import React, { useState, useEffect } from 'react';
import {
  createPasskey,
  getPasskey,
  signWithPasskey,
  storeCredentialId,
  getStoredCredentialId,
  removeStoredCredentialId,
  isWebAuthnSupported,
} from '@/utils/passkeys';

export default function PasskeyTest() {
  const [status, setStatus] = useState<string>('');
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Check WebAuthn support on mount
  useEffect(() => {
    setIsSupported(isWebAuthnSupported());
  }, []);

  const handleCreatePasskey = async () => {
    try {
      setStatus('Creating Passkey...');
      const credential = await createPasskey('test-user');
      
      if (credential.rawId) {
        storeCredentialId(credential.rawId);
        const base64Id = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        setCredentialId(base64Id);
        setStatus('✅ Passkey created successfully!');
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGetPasskey = async () => {
    try {
      setStatus('Getting Passkey...');
      const credential = await getPasskey();
      
      if (credential) {
        setStatus('✅ Passkey retrieved successfully!');
      } else {
        setStatus('⚠️ No Passkey found');
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSignMessage = async () => {
    try {
      setStatus('Signing message...');
      const storedId = getStoredCredentialId();
      
      if (!storedId) {
        setStatus('❌ No credential ID found. Please create a Passkey first.');
        return;
      }

      const message = new TextEncoder().encode('Test message to sign');
      const signature = await signWithPasskey(message.buffer, storedId);
      
      setStatus(`✅ Message signed successfully! Signature length: ${signature.signature.byteLength} bytes`);
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearCredential = () => {
    removeStoredCredentialId();
    setCredentialId(null);
    setStatus('Credential ID cleared');
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
    <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px' }}>
      <h2>Passkey Integration Test</h2>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Test Passkey creation, retrieval, and signing functionality
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={handleCreatePasskey}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Create Passkey
        </button>
        
        <button
          onClick={handleGetPasskey}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Get Passkey
        </button>
        
        <button
          onClick={handleSignMessage}
          disabled={!credentialId}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: credentialId ? '#0070f3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: credentialId ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
          }}
        >
          Sign Message
        </button>
        
        <button
          onClick={handleClearCredential}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Clear Credential
        </button>
      </div>

      {credentialId && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p><strong>Credential ID:</strong></p>
          <p style={{ wordBreak: 'break-all', fontSize: '0.9rem', fontFamily: 'monospace' }}>
            {credentialId.substring(0, 50)}...
          </p>
        </div>
      )}

      {status && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p><strong>Status:</strong></p>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}

