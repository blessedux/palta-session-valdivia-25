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
 * Extract public key from Passkey credential
 * Returns the public key in uncompressed format (65 bytes: 0x04 + 64 bytes)
 */
export async function extractPublicKey(credential: PublicKeyCredential): Promise<Uint8Array> {
  if (!credential.response) {
    throw new Error("Credential does not have a response");
  }

  const attestationResponse = credential.response as AuthenticatorAttestationResponse;
  
  // Get the public key from the attestation object
  // The public key is in COSE format and needs to be converted to uncompressed format
  const publicKey = await attestationResponse.getPublicKey();
  
  if (!publicKey) {
    throw new Error("Failed to extract public key from credential");
  }

  // The public key from getPublicKey() is in JWK format
  // We need to convert it to uncompressed secp256r1 format (65 bytes)
  // This is a simplified version - in production you'd parse the CBOR attestation object
  // For now, we'll use the credential ID as a reference
  // In a real implementation, you'd parse the attestation object to get the actual public key
  
  // Note: This is a placeholder - in production you'd need to:
  // 1. Parse the CBOR attestation object
  // 2. Extract the public key from the COSE format
  // 3. Convert to uncompressed secp256r1 format (0x04 + x + y)
  
  throw new Error("Public key extraction from attestation object not fully implemented. Use passkey-kit for production.");
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

