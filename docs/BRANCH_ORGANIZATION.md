# 🌿 Branch Organization Guide

## Overview

This repository uses branches to represent different stages of development. Students can checkout different branches to see the complete progression from initial setup to production-ready MVP.

## Branch Structure

### `starting-template` (Current Branch)

**Purpose:** Initial starter pack with documentation and contracts only

**Contents:**

- ✅ README.md
- ✅ docs/ (all documentation)
- ✅ contracts/ (smart wallet and lot registry contracts)
- ❌ No frontend code
- ❌ No implementation

**Use Case:** Starting point for the workshop

---

### `01-smart-wallet-contract`

**Purpose:** Smart wallet contract implementation

**Adds:**

- ✅ Complete `contracts/wallet.rs` implementation
- ✅ secp256r1 signature verification
- ✅ Account management functions
- ✅ Recovery mechanisms

**Use Case:** See how the smart wallet contract works

---

### `02-lot-registry-contract`

**Purpose:** Production lot registry contract

**Adds:**

- ✅ Complete `contracts/lot_registry.rs` implementation
- ✅ Lot registration function
- ✅ Lot query functions
- ✅ Metadata storage

**Use Case:** See how the lot registry contract works

---

### `03-frontend-setup`

**Purpose:** Next.js project setup

**Adds:**

- ✅ package.json with dependencies
- ✅ Next.js configuration
- ✅ TypeScript setup
- ✅ Basic project structure
- ✅ Styling setup

**Use Case:** See initial frontend setup

---

### `04-passkey-integration`

**Purpose:** Passkey authentication

**Adds:**

- ✅ `utils/passkeys.ts` with WebAuthn integration
- ✅ Passkey creation
- ✅ secp256r1 signing
- ✅ Credential management

**Use Case:** See how Passkeys are integrated

---

### `05-wallet-integration`

**Purpose:** Smart wallet frontend integration

**Adds:**

- ✅ `utils/stellar.ts` with wallet contract interaction
- ✅ Wallet deployment helpers
- ✅ Transaction signing with Passkeys
- ✅ Contract verification

**Use Case:** See how frontend interacts with smart wallet

---

### `06-lot-registration`

**Purpose:** Lot registration functionality

**Adds:**

- ✅ Lot registration form component
- ✅ Integration with lot registry contract
- ✅ Form validation
- ✅ Transaction handling

**Use Case:** See how lot registration works

---

### `07-lot-query`

**Purpose:** Lot query interface

**Adds:**

- ✅ Lot query component
- ✅ Display lot metadata
- ✅ Search functionality
- ✅ Error handling

**Use Case:** See how to query lot information

---

### `05-production-ready`

**Propósito:** Versión final lista para producción

**Agrega:**

- ✅ Todas las funcionalidades completas
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ UI pulida
- ✅ Configuración de despliegue
- ✅ Actualizaciones de documentación

**Caso de Uso:** Ver el MVP completo y listo para producción

---

## How to Use

### For Students

1. **Start here:**

   ```bash
   git checkout starting-template
   ```

2. **See progress step by step:**

   ```bash
   git checkout 01-smart-wallet-contract
   git checkout 02-lot-registry-contract
   # ... continue through all branches
   ```

3. **Compare branches:**
   ```bash
   git diff starting-template..01-smart-wallet-contract
   ```

### For Instructors

1. **Create branches in order:**

   ```bash
   git checkout -b 01-smart-wallet-contract
   # Make changes, commit
   git checkout -b 02-lot-registry-contract
   # Continue...
   ```

2. **Push all branches:**
   ```bash
   git push origin --all
   ```

## Branch Naming Convention

- `starting-template` - Initial state
- `01-*` through `08-*` - Development stages
- Use descriptive names after the number
- Keep branches focused on one feature/stage

## Best Practices

1. **Each branch should be complete** - Should compile/run on its own
2. **Clear commit messages** - Explain what was added
3. **Update README** - Document what's new in each branch
4. **Test each stage** - Ensure it works before moving to next branch

## Current Branch Status

- ✅ `starting-template` - Ready (README, docs, contracts)
- ⏳ `01-smart-wallet-contract` - To be created
- ⏳ `02-lot-registry-contract` - To be created
- ⏳ `03-frontend-setup` - To be created
- ⏳ `04-passkey-integration` - To be created
- ⏳ `05-wallet-integration` - To be created
- ⏳ `06-lot-registration` - To be created
- ⏳ `07-lot-query` - To be created
- ✅ `05-production-ready` - Versión final lista para producción

---

**Next Step:** Clean up `starting-template` branch to only have README, docs, and contracts.
