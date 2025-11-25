# 📜 Understanding the Simple Value Contract

## What is This Contract?

The `simple_value.rs` contract is a **shared counter** that lives on the Stellar Futurenet blockchain. Think of it like a whiteboard that everyone in the workshop can read and write to.

## Contract Structure

```rust
// The contract stores ONE number
const DATA_KEY: Symbol = symbol_short!("VALUE");

// Function 1: Read the number
pub fn get_value(env: Env) -> u32 {
    env.storage().instance().get(&DATA_KEY).unwrap_or(0)
}

// Function 2: Update the number
pub fn set_value(env: Env, value: u32) {
    env.storage().instance().set(&DATA_KEY, &value);
}
```

## How It Works

### Storage
- **Type:** Instance storage (shared across all users)
- **Key:** `"VALUE"` (a Symbol)
- **Value:** `u32` (unsigned 32-bit integer: 0 to 4,294,967,295)
- **Default:** `0` if never set

### Why Instance Storage?
- **Shared state** - All students interact with the SAME value
- **Collaborative** - When one student updates it, everyone sees the change
- **Simple** - Perfect for a 2-hour workshop

## Function Details

### `get_value() -> u32`

**What it does:**
- Reads the number stored in the contract
- Returns `0` if nothing has been set yet

**How it's called:**
```typescript
// In the frontend (readContractValue function)
const value = await readContractValue(contractId);
// Returns: number (e.g., 42)
```

**Cost:** FREE (read-only, no transaction)

**Who can call:** Anyone (public read)

**Example:**
```
Student A calls get_value() → Returns 42
Student B calls get_value() → Returns 42 (same value!)
```

### `set_value(value: u32)`

**What it does:**
- Updates the stored number to a new value
- Overwrites the previous value

**How it's called:**
```typescript
// In the frontend (invokeContract function)
await invokeContract({
  contractId: "...",
  method: "set_value",
  args: [100],  // New value
  signerSecretKey: "..."
});
```

**Cost:** Transaction fee (paid by the signer, ~0.00001 XLM)

**Who can call:** Anyone who signs the transaction

**Example:**
```
Initial state: value = 0

Student A calls set_value(42) → value = 42
Student B calls get_value() → Returns 42

Student C calls set_value(100) → value = 100
Student A calls get_value() → Returns 100 (updated!)
```

## Frontend Integration Flow

### Reading the Value

```
User clicks "Refresh Value"
    ↓
ContractPanel.loadValue()
    ↓
readContractValue(contractId)
    ↓
Queries contract storage directly
    ↓
Returns number
    ↓
Displays in UI
```

**Code path:**
1. `ContractPanel.tsx` → `loadValue()`
2. `utils/stellar.ts` → `readContractValue()`
3. Soroban RPC → `getLedgerEntries()`
4. Contract storage → Returns value

### Updating the Value

```
User enters number and clicks "Set Value"
    ↓
ContractPanel.handleSetValue()
    ↓
invokeContract({ method: 'set_value', args: [value] })
    ↓
Build transaction
    ↓
Simulate transaction (get footprint)
    ↓
Sign transaction with wallet
    ↓
Submit to network
    ↓
Poll for result
    ↓
Update UI with success/error
```

**Code path:**
1. `ContractPanel.tsx` → `handleSetValue()`
2. `utils/stellar.ts` → `invokeContract()`
3. Stellar SDK → Build & sign transaction
4. Soroban RPC → Submit transaction
5. Network → Execute contract function
6. Frontend → Display result

## Workshop Experience

### Why This Design?

1. **Simple:** Only 2 functions, easy to understand
2. **Interactive:** Students see real blockchain interaction
3. **Collaborative:** Shared state creates engagement
4. **Fast:** No complex logic, quick transactions
5. **Educational:** Shows reading vs writing, transactions, fees

### What Students Learn

- ✅ How to read contract state (free, no transaction)
- ✅ How to invoke contract functions (requires transaction)
- ✅ How transactions work (signing, fees, confirmation)
- ✅ How to interact with Soroban contracts from frontend
- ✅ The difference between read and write operations

## Real-World Analogy

Think of the contract like a **shared Google Doc**:

- **`get_value()`** = Reading the document (anyone can do it, free)
- **`set_value()`** = Editing the document (requires permission = transaction signature)

But unlike Google Docs:
- The changes are **permanent** (on blockchain)
- Everyone sees the **same version** (shared state)
- Changes are **transparent** (visible on explorer)

## Next Steps

After understanding this contract, students can:
- Modify it to store more data
- Add access control (only owner can set)
- Add events for tracking changes
- Build more complex contracts

---

**Ready to deploy?** See [CONTRACT_DEPLOYMENT.md](./CONTRACT_DEPLOYMENT.md)

