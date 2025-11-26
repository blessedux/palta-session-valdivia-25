# 🔐 Smart Wallet Verification Guide

This guide explains how to verify that your passkey-dependent smart wallet is working correctly and can be checked in the Stellar explorer.

## Overview

The verification process ensures:
1. ✅ Passkeys can be created successfully
2. ✅ The passkey public key can be extracted (secp256r1, 65 bytes)
3. ✅ The smart wallet contract can be initialized with the passkey public key
4. ✅ The wallet address (contract ID) can be verified in the Stellar explorer
5. ✅ The stored public key matches what's in the contract

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open the Verification Component

Navigate to `http://localhost:3000` and you'll see the **Smart Wallet & Passkey Verification** component.

### 3. Configure the Contract

Enter your:
- **Wallet Contract ID**: The deployed smart wallet contract ID (e.g., `CAPUILZITFUHBV5XO5ABE3JKWKJKP73J74UGBWQXLBPUAHNW6TRJ6LOL`)
- **Signer Secret Key**: A Stellar account secret key (starts with `S...`) that will pay for the initialization transaction

### 4. Create a Passkey

Click **"1. Create Passkey"**:
- Your browser will prompt you to create a passkey (Touch ID, Face ID, Windows Hello, etc.)
- The passkey public key will be extracted and stored locally
- If extraction fails, you'll see a warning (this is expected in some browsers)

### 5. Initialize the Smart Wallet

Click **"2. Initialize Wallet"**:
- This sends a transaction to initialize the smart wallet contract with your passkey public key
- The transaction will be signed by the provided signer secret key
- You'll see the transaction hash when successful

### 6. Check Wallet Status

Click **"Check Status"** to verify:
- ✅ Wallet is initialized
- ✅ Current nonce
- ✅ Stored public key matches contract public key

### 7. View in Explorer

Use the explorer links to view your contract:
- **Stellar Expert**: View contract details and transactions
- **Stellar Laboratory**: Interact with the contract directly

## What Gets Verified

### Passkey Creation
- ✅ WebAuthn is supported in the browser
- ✅ Passkey credential is created successfully
- ✅ Public key is extracted (or credential ID is stored)

### Wallet Initialization
- ✅ Contract ID is valid
- ✅ Passkey public key is 65 bytes (uncompressed secp256r1)
- ✅ Transaction is submitted and confirmed
- ✅ Wallet storage is updated with the public key

### Contract Verification
- ✅ Wallet is initialized (nonce can be read)
- ✅ Stored public key matches contract public key
- ✅ Contract address is accessible in explorer

## Explorer Links

Once you have a contract ID, you can view it in:

1. **Stellar Expert Explorer**
   ```
   https://stellar.expert/explorer/testnet/contract/{CONTRACT_ID}
   ```

2. **Stellar Laboratory**
   ```
   https://laboratory.stellar.org/?network=testnet#contract&contractId={CONTRACT_ID}
   ```

## Troubleshooting

### "WebAuthn Not Supported"
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure you're using HTTPS (or localhost for development)

### "Public key extraction not fully supported"
- Some browsers don't support `getPublicKey()` yet
- For production, use the `passkey-kit` library
- For testing, the credential ID is stored and can be used for signing

### "Wallet already initialized"
- The contract can only be initialized once
- If you need to reset, deploy a new contract instance

### "Transaction failed"
- Check that your signer account has enough XLM for fees
- Verify the contract ID is correct
- Ensure you're on the correct network (testnet)

## Environment Variables

You can set the contract ID via environment variable:

```bash
# .env.local
NEXT_PUBLIC_WALLET_CONTRACT_ID=CAPUILZITFUHBV5XO5ABE3JKWKJKP73J74UGBWQXLBPUAHNW6TRJ6LOL
```

## Next Steps

After verification:
1. ✅ Test transaction execution with passkey signatures
2. ✅ Implement recovery key functionality
3. ✅ Add multi-signature support
4. ✅ Integrate with your application

## Code Structure

- `components/SmartWalletVerification.tsx` - Main verification component
- `utils/passkeys.ts` - Passkey creation and management
- `utils/smartWallet.ts` - Smart wallet contract interaction
- `contracts/src/wallet.rs` - Smart wallet contract implementation

## Security Notes

⚠️ **Never commit secret keys to version control**
- Use environment variables for sensitive data
- Secret keys should only be used for testing
- In production, use proper key management

✅ **Best Practices**
- Always verify contract addresses in the explorer
- Test on testnet before mainnet
- Keep passkey credentials secure
- Use recovery keys for production wallets

