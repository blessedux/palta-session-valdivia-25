# 📝 Tutorial Paso 04: Integrar Passkeys (WebAuthn)

## 🎯 Objetivo

En este paso, aprenderás a integrar Passkeys (WebAuthn) en tu aplicación para autenticación segura. Implementarás:

- Creación de Passkeys
- Firma de mensajes con secp256r1
- Gestión de credenciales
- Almacenamiento seguro de información

## 📚 Prerequisitos

- ✅ **Paso 03**: Frontend configurado y funcionando
- ✅ Navegador compatible con WebAuthn (Chrome, Firefox, Safari recientes)

## 🛠️ Paso 1: Crear Utilidades de Passkeys

### 1.1 Crear `utils/passkeys.ts`

Crea el archivo `utils/passkeys.ts`:

```typescript
/**
 * Passkey utilities for WebAuthn integration
 * Uses secp256r1 for signature verification (compatible with Soroban)
 */

export interface PasskeyCredential {
  id: string;
  publicKey: ArrayBuffer;
  rawId: ArrayBuffer;
}

/**
 * Create a new Passkey credential
 */
export async function createPasskey(
  username: string
): Promise<PublicKeyCredential> {
  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
    {
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
          alg: -7, // ES256 (secp256r1)
        },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "direct",
    };

  const credential = (await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  })) as PublicKeyCredential;

  if (!credential) {
    throw new Error("Failed to create Passkey");
  }

  return credential;
}

/**
 * Get existing Passkey credential
 */
export async function getPasskey(): Promise<PublicKeyCredential | null> {
  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    timeout: 60000,
    userVerification: "required",
  };

  const credential = (await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
  })) as PublicKeyCredential | null;

  return credential;
}

/**
 * Sign a message with Passkey
 */
export async function signWithPasskey(
  message: ArrayBuffer,
  credentialId: ArrayBuffer
): Promise<ArrayBuffer> {
  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: message,
    allowCredentials: [
      {
        id: credentialId,
        type: "public-key",
      },
    ],
    timeout: 60000,
    userVerification: "required",
  };

  const assertion = (await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
  })) as PublicKeyCredential | null;

  if (!assertion || !assertion.response) {
    throw new Error("Failed to sign with Passkey");
  }

  const response = assertion.response as AuthenticatorAssertionResponse;
  return response.signature;
}

/**
 * Extract public key from Passkey credential
 */
export function extractPublicKey(
  credential: PublicKeyCredential
): ArrayBuffer | null {
  if (credential.response && "getPublicKey" in credential.response) {
    // For creation response
    const attestationResponse =
      credential.response as AuthenticatorAttestationResponse;
    // Extract public key from CBOR-encoded attestation object
    // This is a simplified version - in production, you'd parse the CBOR
    return attestationResponse.getPublicKey();
  }
  return null;
}

/**
 * Store credential ID in localStorage
 */
export function storeCredentialId(credentialId: ArrayBuffer): void {
  const base64Id = btoa(String.fromCharCode(...new Uint8Array(credentialId)));
  localStorage.setItem("passkey_credential_id", base64Id);
}

/**
 * Get stored credential ID from localStorage
 */
export function getStoredCredentialId(): ArrayBuffer | null {
  const base64Id = localStorage.getItem("passkey_credential_id");
  if (!base64Id) return null;

  const binaryString = atob(base64Id);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
```

## 🧪 Paso 2: Probar la Integración

### 2.1 Crear componente de prueba

Crea `components/PasskeyTest.tsx`:

```typescript
import { useState } from "react";
import {
  createPasskey,
  getPasskey,
  storeCredentialId,
  getStoredCredentialId,
} from "@/utils/passkeys";

export default function PasskeyTest() {
  const [status, setStatus] = useState<string>("");
  const [credentialId, setCredentialId] = useState<string | null>(null);

  const handleCreatePasskey = async () => {
    try {
      setStatus("Creating Passkey...");
      const credential = await createPasskey("test-user");

      if (credential.rawId) {
        storeCredentialId(credential.rawId);
        setCredentialId(
          btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        );
        setStatus("Passkey created successfully!");
      }
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleGetPasskey = async () => {
    try {
      setStatus("Getting Passkey...");
      const credential = await getPasskey();

      if (credential) {
        setStatus("Passkey retrieved successfully!");
      } else {
        setStatus("No Passkey found");
      }
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Passkey Integration Test</h2>
      <button onClick={handleCreatePasskey}>Create Passkey</button>
      <button onClick={handleGetPasskey} style={{ marginLeft: "1rem" }}>
        Get Passkey
      </button>
      {credentialId && (
        <div style={{ marginTop: "1rem" }}>
          <p>Credential ID: {credentialId.substring(0, 20)}...</p>
        </div>
      )}
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}
```

### 2.2 Agregar a la página principal

Actualiza `pages/index.tsx`:

```typescript
import PasskeyTest from "@/components/PasskeyTest";

export default function Home() {
  return (
    <>
      {/* ... Head component ... */}
      <main style={{ padding: "2rem" }}>
        <h1>Stellar Smart Wallet</h1>
        <PasskeyTest />
      </main>
    </>
  );
}
```

## ✅ Paso 3: Verificar la Implementación

### 3.1 Checklist

- ✅ `utils/passkeys.ts` creado con todas las funciones
- ✅ Componente de prueba funciona
- ✅ Puedes crear un Passkey
- ✅ Puedes recuperar un Passkey existente
- ✅ Credential ID se almacena en localStorage

## 🚀 Siguiente Paso

**Paso 05**: Versión final lista para producción

```bash
git checkout 05-production-ready
```

Lee: [`04-PRODUCTION_READY.md`](./04-PRODUCTION_READY.md)

