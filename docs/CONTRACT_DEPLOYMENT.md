# 📜 Contract Deployment Guide

## What the Contract Does

The `simple_value.rs` contract is a **simple key-value store** that allows:

1. **Reading a value** - `get_value()` returns the current stored number (u32)
2. **Setting a value** - `set_value(value: u32)` updates the stored number

Think of it as a **global counter** that anyone with the contract ID can read, but only those who sign transactions can update.

---

## Contract Functions

### `get_value() -> u32`

- **Purpose:** Read the current value stored in the contract
- **Returns:** A number (u32, 0 to 4,294,967,295)
- **Cost:** Free (read-only, no transaction needed)
- **Who can call:** Anyone (public read)

### `set_value(value: u32)`

- **Purpose:** Update the stored value in the contract
- **Parameters:** `value` - a positive number (u32)
- **Returns:** Nothing (void function)
- **Cost:** Requires a transaction fee (paid by the signer)
- **Who can call:** Anyone who signs the transaction (public write)

---

## How Students Will Invoke It

Once deployed, students use the frontend to:

1. **Read the value:**

   - Click "Refresh Value" button
   - Frontend calls `readContractValue(contractId)`
   - This reads the contract's storage directly (no transaction)

2. **Update the value:**
   - Enter a number in the input field
   - Click "Set Value" button
   - Frontend calls `invokeContract({ contractId, method: 'set_value', args: [value] })`
   - This creates, signs, and submits a transaction to the network

---

## Deployment Instructions

### Prerequisites

1. **Install Stellar CLI and Soroban CLI:**

   ```bash
   # Install Rust (if not already installed)
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

   # Install Stellar CLI
   cargo install --locked stellar-cli

   # Install Soroban CLI
   cargo install --locked soroban-cli
   ```

2. **Verify installation:**
   ```bash
   stellar version
   soroban --version
   ```

### Step 1: Set Network to Futurenet

```bash
soroban config network add futurenet \
  --rpc-url https://rpc-futurenet.stellar.org \
  --network-passphrase "Test SDF Future Network ; October 2022"
```

### Step 2: Create a Test Account (if needed)

```bash
# Generate a new keypair
stellar keys generate --global futurenet

# Or use an existing secret key
stellar keys add <key-name> --secret-key <your-secret-key>

# Fund the account (get testnet lumens)
# Visit: https://laboratory.stellar.org/#account-creator?network=futurenet
```

### Step 3: Build the Contract

```bash
cd contracts

# Build the contract
soroban contract build

# This creates: target/wasm32-unknown-unknown/release/simple_value.wasm
```

### Step 4: Deploy the Contract

```bash
# Deploy to Futurenet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/simple_value.wasm \
  --source <your-key-name> \
  --network futurenet
```

**Output will look like:**

```
Contract was deployed with ID: CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJM3Q
```

### Step 5: Save the Contract ID

Copy the Contract ID from the output and:

1. **Add it to your `.env.local`:**

   ```bash
   NEXT_PUBLIC_CONTRACT_ID=CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJM3Q
   ```

2. **Share it with students** - They'll add it to their `.env.local` files

### Step 6: Verify Deployment (Optional)

```bash
# Read the initial value (should be 0)
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <your-key-name> \
  --network futurenet \
  -- get_value

# Set a test value
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <your-key-name> \
  --network futurenet \
  -- set_value \
  -- value 42

# Read it back (should be 42)
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <your-key-name> \
  --network futurenet \
  -- get_value
```

---

## Quick Deployment Script

Create a file `deploy-contract.sh`:

```bash
#!/bin/bash

# Configuration
NETWORK="futurenet"
WASM_PATH="target/wasm32-unknown-unknown/release/simple_value.wasm"
KEY_NAME="workshop-deployer"  # Change to your key name

echo "🔨 Building contract..."
cd contracts
soroban contract build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🚀 Deploying contract to $NETWORK..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm ../$WASM_PATH \
  --source $KEY_NAME \
  --network $NETWORK \
  --output-id)

if [ $? -eq 0 ]; then
    echo "✅ Contract deployed successfully!"
    echo "📋 Contract ID: $CONTRACT_ID"
    echo ""
    echo "Add this to your .env.local:"
    echo "NEXT_PUBLIC_CONTRACT_ID=$CONTRACT_ID"
else
    echo "❌ Deployment failed!"
    exit 1
fi
```

Make it executable and run:

```bash
chmod +x deploy-contract.sh
./deploy-contract.sh
```

---

## Alternative: Deploy via Stellar Laboratory

1. Go to: https://laboratory.stellar.org/#?network=futurenet
2. Navigate to "Soroban" section
3. Upload the compiled `.wasm` file
4. Deploy and copy the Contract ID

---

## Troubleshooting

### "Account not found"

- Fund your account first using the Futurenet faucet
- Visit: https://laboratory.stellar.org/#account-creator?network=futurenet

### "Build failed"

- Make sure you're in the `contracts/` directory
- Ensure Rust toolchain is installed: `rustup target add wasm32-unknown-unknown`

### "Deployment failed"

- Check your account has enough XLM for fees
- Verify network configuration: `soroban config network ls`

---

## For Workshop Instructors

**Before the workshop:**

1. ✅ Deploy the contract to Futurenet
2. ✅ Save the Contract ID
3. ✅ Test it works (read and write)
4. ✅ Share the Contract ID with students (via QR code, slide, or chat)
5. ✅ Students add it to their `.env.local` files

**During the workshop:**

- Students don't need to deploy - they use YOUR deployed contract
- All students interact with the SAME contract (shared state!)
- This makes it fun - everyone can see each other's updates

---

## Contract Storage

The contract stores data in **instance storage**:

- Key: `Symbol("VALUE")`
- Value: `u32` (unsigned 32-bit integer)
- Default: `0` if never set

**Important:** Instance storage is **shared** - all users read/write to the same value. This is intentional for the workshop to create a collaborative experience!

---

## Next Steps

After deployment:

1. Test the contract in the frontend
2. Share Contract ID with students
3. Students configure `.env.local`
4. Everyone can now read/write to the same contract! 🎉
