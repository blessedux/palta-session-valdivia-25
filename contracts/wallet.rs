#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Bytes, BytesN, Env, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WalletData {
    pub passkey_public_key: BytesN<65>, // secp256r1 public key (uncompressed: 65 bytes)
    pub recovery_key: Option<BytesN<65>>, // Optional recovery key
    pub nonce: u64, // Transaction nonce for replay protection
}

const WALLET_DATA_KEY: Symbol = symbol_short!("WALLET");

#[contract]
pub struct SmartWallet;

#[contractimpl]
impl SmartWallet {
    /// Initialize a new wallet instance with a Passkey public key
    /// 
    /// # Arguments
    /// * `passkey_public_key` - The secp256r1 public key from the Passkey (65 bytes uncompressed)
    /// 
    /// # Panics
    /// Panics if the wallet is already initialized
    pub fn init(env: Env, passkey_public_key: BytesN<65>) {
        // Check if wallet is already initialized
        if env.storage().instance().has(&WALLET_DATA_KEY) {
            panic!("Wallet already initialized");
        }

        let wallet_data = WalletData {
            passkey_public_key: passkey_public_key.clone(),
            recovery_key: None,
            nonce: 0,
        };

        env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);
    }

    /// Execute a transaction after verifying the Passkey signature
    /// 
    /// # Arguments
    /// * `message` - The transaction message to execute (as bytes)
    /// * `signature` - The secp256r1 signature from the Passkey (64 bytes: r + s)
    /// * `nonce` - The transaction nonce (must be current nonce + 1)
    /// 
    /// # Returns
    /// Returns the new nonce after successful execution
    /// 
    /// # Panics
    /// Panics if signature verification fails or nonce is invalid
    pub fn execute(
        env: Env,
        message: Bytes,
        signature: BytesN<64>,
        nonce: u64,
    ) -> u64 {
        // Load wallet data
        let mut wallet_data: WalletData = env
            .storage()
            .instance()
            .get(&WALLET_DATA_KEY)
            .unwrap_or_else(|| panic!("Wallet not initialized"));

        // Verify nonce (prevent replay attacks)
        if nonce != wallet_data.nonce + 1 {
            panic!("Invalid nonce");
        }

        // Verify secp256r1 signature
        // The signature is 64 bytes: 32 bytes r + 32 bytes s
        // The public key is 65 bytes (uncompressed secp256r1)
        let message_hash = env.crypto().sha256(&message);
        
        // Verify ECDSA secp256r1 signature
        // Note: In Soroban, we use verify_sig_ecdsa_secp256r1
        // The function signature: verify_sig_ecdsa_secp256r1(message_hash, signature, public_key)
        if !env
            .crypto()
            .verify_sig_ecdsa_secp256r1(&message_hash, &signature, &wallet_data.passkey_public_key)
        {
            panic!("Invalid signature");
        }

        // Update nonce
        wallet_data.nonce = nonce;
        env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);

        // At this point, the transaction would be executed
        // For this MVP, we just verify and update nonce
        // In a full implementation, you would parse the message and execute operations
        
        nonce
    }

    /// Set a recovery key for account recovery
    /// 
    /// # Arguments
    /// * `recovery_key` - The secp256r1 public key for recovery (65 bytes)
    /// * `signature` - Signature from the current Passkey authorizing this change
    /// * `nonce` - Current nonce
    pub fn set_recovery_key(
        env: Env,
        recovery_key: BytesN<65>,
        signature: BytesN<64>,
        nonce: u64,
    ) {
        let mut wallet_data: WalletData = env
            .storage()
            .instance()
            .get(&WALLET_DATA_KEY)
            .unwrap_or_else(|| panic!("Wallet not initialized"));

        // Verify nonce
        if nonce != wallet_data.nonce + 1 {
            panic!("Invalid nonce");
        }

        // Create message: "set_recovery_key" + recovery_key
        // Build message bytes
        let prefix = Bytes::from_slice(&env, b"set_recovery_key");
        let key_bytes = Bytes::from_array(&env, recovery_key.to_array());
        let mut message = Bytes::new(&env);
        message.append(&prefix);
        message.append(&key_bytes);
        
        let message_hash = env.crypto().sha256(&message);

        // Verify signature
        if !env
            .crypto()
            .verify_sig_ecdsa_secp256r1(&message_hash, &signature, &wallet_data.passkey_public_key)
        {
            panic!("Invalid signature");
        }

        // Update recovery key and nonce
        wallet_data.recovery_key = Some(recovery_key);
        wallet_data.nonce = nonce;
        env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);
    }

    /// Recover account access using the recovery key
    /// 
    /// # Arguments
    /// * `new_passkey_public_key` - The new Passkey public key (65 bytes)
    /// * `recovery_signature` - Signature from the recovery key
    /// 
    /// # Panics
    /// Panics if no recovery key is set or signature is invalid
    pub fn recover(env: Env, new_passkey_public_key: BytesN<65>, recovery_signature: BytesN<64>) {
        let mut wallet_data: WalletData = env
            .storage()
            .instance()
            .get(&WALLET_DATA_KEY)
            .unwrap_or_else(|| panic!("Wallet not initialized"));

        // Check if recovery key exists
        let recovery_key = wallet_data
            .recovery_key
            .unwrap_or_else(|| panic!("No recovery key set"));

        // Create message: "recover" + new_passkey_public_key
        // Build message bytes
        let prefix = Bytes::from_slice(&env, b"recover");
        let key_bytes = Bytes::from_array(&env, new_passkey_public_key.to_array());
        let mut message = Bytes::new(&env);
        message.append(&prefix);
        message.append(&key_bytes);
        
        let message_hash = env.crypto().sha256(&message);

        // Verify recovery signature
        if !env
            .crypto()
            .verify_sig_ecdsa_secp256r1(&message_hash, &recovery_signature, &recovery_key)
        {
            panic!("Invalid recovery signature");
        }

        // Update Passkey public key
        wallet_data.passkey_public_key = new_passkey_public_key;
        // Reset nonce (optional, depends on security model)
        wallet_data.nonce = 0;
        env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);
    }

    /// Get the current wallet nonce
    /// 
    /// # Returns
    /// The current nonce value
    pub fn get_nonce(env: Env) -> u64 {
        let wallet_data: WalletData = env
            .storage()
            .instance()
            .get(&WALLET_DATA_KEY)
            .unwrap_or_else(|| panic!("Wallet not initialized"));
        
        wallet_data.nonce
    }

    /// Get the Passkey public key
    /// 
    /// # Returns
    /// The Passkey public key (65 bytes)
    pub fn get_passkey_public_key(env: Env) -> BytesN<65> {
        let wallet_data: WalletData = env
            .storage()
            .instance()
            .get(&WALLET_DATA_KEY)
            .unwrap_or_else(|| panic!("Wallet not initialized"));
        
        wallet_data.passkey_public_key
    }
}

#[cfg(test)]
mod test;
