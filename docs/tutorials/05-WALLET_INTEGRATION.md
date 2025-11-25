# 📝 Tutorial Paso 05: Integrar Smart Wallet en Frontend

## 🎯 Objetivo

Conectar el frontend con el contrato Smart Wallet, permitiendo:
- Desplegar el contrato wallet
- Inicializar wallets con Passkeys
- Firmar y ejecutar transacciones
- Interactuar con contratos Soroban

## 📚 Prerequisitos

- ✅ **Paso 04**: Passkeys integrados
- ✅ Contratos compilados y desplegados en Futurenet

## 🛠️ Paso 1: Crear Utilidades de Stellar

### 1.1 Crear `utils/stellar.ts`

```typescript
import {
  Contract,
  Networks,
  SorobanRpc,
  xdr,
} from '@stellar/stellar-sdk';
import { signWithPasskey, getStoredCredentialId } from './passkeys';

const networkPassphrase = Networks.FUTURENET;
const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://rpc-futurenet.stellar.org';
const sorobanRpc = new SorobanRpc.Server(rpcUrl);

/**
 * Deploy the Smart Wallet contract
 */
export async function deployWalletContract(
  secretKey: string
): Promise<string> {
  // This would typically be done via CLI, but for frontend:
  // 1. Upload WASM
  // 2. Create contract
  // 3. Return contract ID
  // Implementation depends on your deployment strategy
  throw new Error("Deploy via CLI: soroban contract deploy");
}

/**
 * Initialize a wallet with Passkey public key
 */
export async function initializeWallet(
  contractId: string,
  passkeyPublicKey: ArrayBuffer
): Promise<void> {
  const contract = new Contract(contractId);
  
  // Convert public key to BytesN<65>
  const publicKeyBytes = new Uint8Array(passkeyPublicKey);
  if (publicKeyBytes.length !== 65) {
    throw new Error("Invalid public key length");
  }

  const initFunction = contract.call("init");
  // Implementation would call the contract
}

/**
 * Execute a transaction through the Smart Wallet
 */
export async function executeTransaction(
  contractId: string,
  message: ArrayBuffer,
  signature: ArrayBuffer
): Promise<string> {
  const credentialId = getStoredCredentialId();
  if (!credentialId) {
    throw new Error("No Passkey found");
  }

  const contract = new Contract(contractId);
  
  // Get current nonce
  const nonce = await contract.call("get_nonce");
  
  // Call execute function
  const result = await contract.call("execute", {
    message: Buffer.from(message),
    signature: Buffer.from(signature),
    nonce: nonce + 1,
  });

  return result;
}
```

## 🚀 Siguiente Paso

**Paso 06**: Implementar registro de lotes

```bash
git checkout 06-lot-registration
```

Lee: [`06-LOT_REGISTRATION.md`](./06-LOT_REGISTRATION.md)

