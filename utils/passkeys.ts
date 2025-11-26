/**
 * Passkey utilities for WebAuthn integration
 * Based on passkey-kit approach: https://github.com/kalepail/passkey-kit
 * Uses secp256r1 for signature verification (compatible with Soroban)
 */

export interface PasskeyCredential {
  id: string;
  publicKey: ArrayBuffer;
  rawId: ArrayBuffer;
  response?: AuthenticatorAttestationResponse;
}

export interface PasskeySignature {
  signature: ArrayBuffer;
  authenticatorData: ArrayBuffer;
  clientDataJSON: ArrayBuffer;
  userHandle: ArrayBuffer | null;
}

/**
 * Create a new Passkey credential
 * Based on passkey-kit implementation
 */
export async function createPasskey(username: string): Promise<PublicKeyCredential> {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn is not supported in this browser");
  }

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: {
      name: "Stellar Smart Wallet",
      id: window.location.hostname,
    },
    user: {
      id: new TextEncoder().encode(username),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // ES256 (secp256r1) - required for Soroban
      },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Use platform authenticator (Touch ID, Face ID, etc.)
      userVerification: "required",
      requireResidentKey: false,
    },
    timeout: 60000,
    attestation: "direct",
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential | null;

    if (!credential) {
      throw new Error("Failed to create Passkey");
    }

    return credential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Passkey creation failed: ${error.message}`);
    }
    throw new Error("Passkey creation failed: Unknown error");
  }
}

/**
 * Get existing Passkey credential
 */
export async function getPasskey(): Promise<PublicKeyCredential | null> {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn is not supported in this browser");
  }

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    timeout: 60000,
    userVerification: "required",
  };

  try {
    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential | null;

    return credential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Passkey retrieval failed: ${error.message}`);
    }
    throw new Error("Passkey retrieval failed: Unknown error");
  }
}

/**
 * Sign a message with Passkey
 * Returns the signature and related data needed for verification
 */
export async function signWithPasskey(
  message: ArrayBuffer,
  credentialId?: ArrayBuffer
): Promise<PasskeySignature> {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn is not supported in this browser");
  }

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: message,
    timeout: 60000,
    userVerification: "required",
  };

  // If credentialId is provided, use it to allow only that credential
  if (credentialId) {
    publicKeyCredentialRequestOptions.allowCredentials = [
      {
        id: credentialId,
        type: "public-key",
      },
    ];
  }

  try {
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential | null;

    if (!assertion || !assertion.response) {
      throw new Error("Failed to sign with Passkey");
    }

    const response = assertion.response as AuthenticatorAssertionResponse;

    return {
      signature: response.signature,
      authenticatorData: response.authenticatorData,
      clientDataJSON: response.clientDataJSON,
      userHandle: response.userHandle,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Passkey signing failed: ${error.message}`);
    }
    throw new Error("Passkey signing failed: Unknown error");
  }
}

/**
 * Extract secp256r1 public key from Passkey credential
 * Returns the public key in uncompressed format (65 bytes: 0x04 + 64 bytes)
 * 
 * This function extracts the public key from the CBOR-encoded attestation object.
 * The public key is in COSE format and needs to be converted to uncompressed secp256r1.
 */
export async function extractSecp256r1PublicKey(credential: PublicKeyCredential): Promise<Uint8Array | null> {
  if (!credential.response) {
    throw new Error("Credential does not have a response");
  }

  const attestationResponse = credential.response as AuthenticatorAttestationResponse;
  
  try {
    // Try to use getPublicKey() if available (Chrome/Edge)
    if ('getPublicKey' in attestationResponse && typeof attestationResponse.getPublicKey === 'function') {
      const publicKey = await attestationResponse.getPublicKey();
      
      // Handle JWK format (JSON Web Key)
      if (publicKey && typeof publicKey === 'object' && 'x' in publicKey && 'y' in publicKey) {
        const jwk = publicKey as { x: string; y: string };
        // Convert JWK format to uncompressed secp256r1 (0x04 + x + y)
        const x = base64UrlToBytes(jwk.x);
        const y = base64UrlToBytes(jwk.y);
        
        // Ensure x and y are 32 bytes each
        const xPadded = padBytes(x, 32);
        const yPadded = padBytes(y, 32);
        
        // Create uncompressed format: 0x04 + x (32 bytes) + y (32 bytes) = 65 bytes
        const uncompressed = new Uint8Array(65);
        uncompressed[0] = 0x04; // Uncompressed prefix
        uncompressed.set(xPadded, 1);
        uncompressed.set(yPadded, 33);
        
        return uncompressed;
      }
      
      // Handle CryptoKey format - would need to export as JWK first
      if (publicKey instanceof CryptoKey) {
        const jwk = await crypto.subtle.exportKey('jwk', publicKey);
        if (jwk.x && jwk.y) {
          const x = base64UrlToBytes(jwk.x);
          const y = base64UrlToBytes(jwk.y);
          
          const xPadded = padBytes(x, 32);
          const yPadded = padBytes(y, 32);
          
          const uncompressed = new Uint8Array(65);
          uncompressed[0] = 0x04;
          uncompressed.set(xPadded, 1);
          uncompressed.set(yPadded, 33);
          
          return uncompressed;
        }
      }
    }
    
    // Fallback: Parse CBOR attestation object
    // This is a simplified version - for production, use a proper CBOR parser
    const attestationObject = new Uint8Array(attestationResponse.attestationObject);
    
    // For now, return null to indicate we need manual extraction
    // In production, you would parse the CBOR to extract the public key
    console.warn('getPublicKey() not available, need to parse CBOR attestation object');
    return null;
  } catch (error) {
    console.error('Error extracting public key:', error);
    return null;
  }
}

/**
 * Helper: Convert base64url to bytes
 */
function base64UrlToBytes(base64url: string): Uint8Array {
  // Convert base64url to base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  // Decode
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Helper: Pad bytes to specified length
 */
function padBytes(bytes: Uint8Array, length: number): Uint8Array {
  if (bytes.length === length) return bytes;
  if (bytes.length > length) {
    return bytes.slice(bytes.length - length);
  }
  const padded = new Uint8Array(length);
  padded.set(bytes, length - bytes.length);
  return padded;
}

/**
 * Store passkey public key in localStorage
 */
export function storePasskeyPublicKey(publicKey: Uint8Array): void {
  const keyArray = Array.from(publicKey);
  localStorage.setItem('passkey_public_key', JSON.stringify(keyArray));
}

/**
 * Get stored passkey public key from localStorage
 */
export function getStoredPasskeyPublicKey(): Uint8Array | null {
  const stored = localStorage.getItem('passkey_public_key');
  if (!stored) return null;
  
  try {
    const keyArray = JSON.parse(stored);
    return new Uint8Array(keyArray);
  } catch (error) {
    console.error('Failed to parse stored public key:', error);
    return null;
  }
}

/**
 * Store credential ID in localStorage
 */
export function storeCredentialId(credentialId: ArrayBuffer): void {
  const base64Id = btoa(String.fromCharCode(...new Uint8Array(credentialId)));
  localStorage.setItem('passkey_credential_id', base64Id);
}

/**
 * Get stored credential ID from localStorage
 */
export function getStoredCredentialId(): ArrayBuffer | null {
  const base64Id = localStorage.getItem('passkey_credential_id');
  if (!base64Id) return null;
  
  try {
    const binaryString = atob(base64Id);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error("Failed to decode stored credential ID:", error);
    return null;
  }
}

/**
 * Remove stored credential ID from localStorage
 */
export function removeStoredCredentialId(): void {
  localStorage.removeItem('passkey_credential_id');
}

/**
 * Check if WebAuthn is supported
 */
export function isWebAuthnSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.PublicKeyCredential !== 'undefined' &&
         typeof navigator.credentials !== 'undefined';
}

