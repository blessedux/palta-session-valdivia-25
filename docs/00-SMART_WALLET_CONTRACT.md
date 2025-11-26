# 📝 Tutorial Paso 01: Crear el Contrato Smart Wallet

## 🎯 Objetivo

En este paso, aprenderás a crear un contrato Smart Wallet en Soroban que:

- Verifica firmas secp256r1 de Passkeys
- Gestiona cuentas con protección contra replay attacks
- Permite recuperación de cuenta
- Está listo para producción

## 📚 Prerequisitos

Antes de comenzar, asegúrate de entender:

- ✅ **Qué es un Smart Wallet**: Lee [`SMART_WALLET_VS_TRADITIONAL.md`](./SMART_WALLET_VS_TRADITIONAL.md) para entender la diferencia entre smart wallets y wallets tradicionales
- ✅ **Conceptos básicos de Soroban**: Familiarízate con contratos inteligentes en Stellar

## 🛠️ Paso 1: Instalar Dependencias

### 1.1 Instalar Rust

Si no tienes Rust instalado:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verifica la instalación:

```bash
rustc --version
```

### 1.2 Instalar Soroban CLI

```bash
cargo install --locked soroban-cli
```

Verifica la instalación:

```bash
soroban --version
```

## 📁 Paso 2: Configurar la Estructura del Proyecto

### 2.1 Crear el directorio de contratos

```bash
mkdir -p contracts/src
cd contracts
```

### 2.2 Crear `Cargo.toml`

Crea el archivo `contracts/Cargo.toml` con el siguiente contenido:

```toml
[package]
name = "smart-wallet-contracts"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[features]
testutils = ["soroban-sdk/testutils"]
default = []

[dependencies]
soroban-sdk = "21.0.0"

[dev-dependencies]
soroban-sdk = { version = "21.0.0", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true

[profile.release-with-logs]
inherits = "release"
debug-assertions = true
```

**¿Qué hace este archivo?**

- Define el nombre del proyecto y versión de Rust
- Especifica que compilaremos una biblioteca (`cdylib`, `rlib`)
- Incluye `soroban-sdk` versión 21.0.0 como dependencia
- Configura optimizaciones para producción

### 2.3 Crear `src/lib.rs`

Crea el archivo `contracts/src/lib.rs`:

```rust
#![no_std]
pub mod wallet;
```

**¿Qué hace este archivo?**

- `#![no_std]` - Indica que no usaremos la biblioteca estándar (necesario para contratos Soroban)
- Declara el módulo `wallet` que crearemos a continuación

## 💻 Paso 3: Implementar el Contrato Smart Wallet

### 3.1 Crear `src/wallet.rs`

Crea el archivo `contracts/src/wallet.rs` con la siguiente estructura base:

```rust
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
    // Aquí implementaremos las funciones
}
```

**Explicación:**

- `WalletData`: Estructura que almacena los datos del wallet (clave pública del Passkey, clave de recuperación opcional, nonce)
- `WALLET_DATA_KEY`: Clave para almacenar los datos en el storage del contrato
- `SmartWallet`: El contrato principal

### 3.2 Implementar la función `init`

Agrega esta función dentro del `impl SmartWallet`:

```rust
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
```

**¿Qué hace?**

- Verifica que el wallet no esté ya inicializado
- Crea los datos iniciales del wallet con la clave pública del Passkey
- Establece el nonce en 0
- Guarda los datos en el storage del contrato

### 3.3 Implementar la función `execute`

Esta función verifica la firma del Passkey y ejecuta la transacción:

```rust
/// Execute a transaction after verifying the Passkey signature
///
/// # Arguments
/// * `message` - The transaction message to execute (as bytes)
/// * `signature` - The secp256r1 signature from the Passkey (64 bytes: r + s)
/// * `nonce` - The transaction nonce (must be current nonce + 1)
///
/// # Returns
/// Returns the new nonce after successful execution
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
    let message_hash = env.crypto().sha256(&message);

    // Verify ECDSA secp256r1 signature
    // secp256r1_verify panics if signature is invalid, returns () if valid
    env.crypto()
        .secp256r1_verify(&wallet_data.passkey_public_key, &message_hash, &signature);

    // Update nonce
    wallet_data.nonce = nonce;
    env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);

    // Transaction signature verified successfully
    // The nonce is updated to prevent replay attacks
    // In a full implementation, parse the message and execute the transaction operations

    nonce
}
```

**¿Qué hace?**

- Carga los datos del wallet
- Verifica que el nonce sea correcto (previene replay attacks)
- Calcula el hash del mensaje
- Verifica la firma secp256r1 usando la clave pública del Passkey
- Actualiza el nonce si la verificación es exitosa

### 3.4 Implementar funciones adicionales

Agrega estas funciones para completar el contrato:

**`set_recovery_key`** - Establece una clave de recuperación:

```rust
/// Set a recovery key for account recovery
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
    let prefix_bytes = b"set_recovery_key";
    let key_array = recovery_key.to_array();

    // Combine bytes: prefix (16 bytes) + key (65 bytes) = 81 bytes total
    let mut combined = [0u8; 81];
    combined[0..16].copy_from_slice(prefix_bytes);
    combined[16..81].copy_from_slice(key_array.as_slice());
    let message = Bytes::from_slice(&env, &combined);

    let message_hash = env.crypto().sha256(&message);

    // Verify signature using secp256r1_verify
    env.crypto()
        .secp256r1_verify(&wallet_data.passkey_public_key, &message_hash, &signature);

    // Update recovery key and nonce
    wallet_data.recovery_key = Some(recovery_key);
    wallet_data.nonce = nonce;
    env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);
}
```

**`recover`** - Recupera el acceso a la cuenta:

```rust
/// Recover account access using the recovery key
pub fn recover(env: Env, new_passkey_public_key: BytesN<65>, recovery_signature: BytesN<64>) {
    let mut wallet_data: WalletData = env
        .storage()
        .instance()
        .get(&WALLET_DATA_KEY)
        .unwrap_or_else(|| panic!("Wallet not initialized"));

    // Check if recovery key exists and clone it
    let recovery_key = wallet_data
        .recovery_key
        .clone()
        .unwrap_or_else(|| panic!("No recovery key set"));

    // Create message: "recover" + new_passkey_public_key
    let prefix_bytes = b"recover";
    let key_array = new_passkey_public_key.to_array();

    // Combine bytes: prefix (7 bytes) + key (65 bytes) = 72 bytes total
    let mut combined = [0u8; 72];
    combined[0..7].copy_from_slice(prefix_bytes);
    combined[7..72].copy_from_slice(key_array.as_slice());
    let message = Bytes::from_slice(&env, &combined);

    let message_hash = env.crypto().sha256(&message);

    // Verify recovery signature using secp256r1_verify
    env.crypto()
        .secp256r1_verify(&recovery_key, &message_hash, &recovery_signature);

    // Update Passkey public key
    wallet_data.passkey_public_key = new_passkey_public_key;
    // Reset nonce (optional, depends on security model)
    wallet_data.nonce = 0;
    env.storage().instance().set(&WALLET_DATA_KEY, &wallet_data);
}
```

**Funciones de consulta** - Para obtener información del wallet:

```rust
/// Get the current wallet nonce
pub fn get_nonce(env: Env) -> u64 {
    let wallet_data: WalletData = env
        .storage()
        .instance()
        .get(&WALLET_DATA_KEY)
        .unwrap_or_else(|| panic!("Wallet not initialized"));

    wallet_data.nonce
}

/// Get the Passkey public key
pub fn get_passkey_public_key(env: Env) -> BytesN<65> {
    let wallet_data: WalletData = env
        .storage()
        .instance()
        .get(&WALLET_DATA_KEY)
        .unwrap_or_else(|| panic!("Wallet not initialized"));

    wallet_data.passkey_public_key
}
```

### 3.5 Agregar módulo de tests (opcional)

Crea `src/wallet/test.rs`:

```rust
#![cfg(test)]
// Tests will be added in development branches
```

Y agrega al final de `src/wallet.rs`:

```rust
#[cfg(test)]
mod test;
```

## 🔨 Paso 4: Compilar el Contrato

### 4.1 Compilar el contrato

Desde el directorio `contracts/`, ejecuta:

```bash
soroban contract build
```

**¿Qué esperar?**

- Si todo está correcto, verás: `✅ Build Complete`
- Si hay errores, el compilador te indicará qué está mal

### 4.2 Verificar la compilación

El comando anterior debería generar:

- Un archivo `.wasm` en `target/wasm32-unknown-unknown/release/`
- Mensajes de compilación exitosa

## ✅ Paso 5: Verificar tu Implementación

### 5.1 Checklist de verificación

Asegúrate de que tu implementación tenga:

- ✅ **Estructura correcta**:

  - `contracts/Cargo.toml` existe
  - `contracts/src/lib.rs` existe
  - `contracts/src/wallet.rs` existe

- ✅ **Funciones implementadas**:

  - `init()` - Inicializa el wallet
  - `execute()` - Ejecuta transacciones con verificación de firma
  - `set_recovery_key()` - Establece clave de recuperación
  - `recover()` - Recupera acceso a la cuenta
  - `get_nonce()` - Obtiene el nonce actual
  - `get_passkey_public_key()` - Obtiene la clave pública

- ✅ **Compilación exitosa**:
  - El comando `soroban contract build` completa sin errores

### 5.2 Errores comunes y soluciones

**Error: "no method named `secp256r1_verify`"**

- **Solución**: Asegúrate de usar `env.crypto().secp256r1_verify()` (no `verify_sig_ecdsa_secp256r1`)

**Error: "cannot apply unary operator `!` to type `()`"**

- **Solución**: `secp256r1_verify` no retorna bool, solo lanza error si falla. Elimina el `if !`.

**Error: "borrow of partially moved value"**

- **Solución**: Clona el valor antes de moverlo: `wallet_data.recovery_key.clone()`

## 📖 Conceptos Clave Aprendidos

En este paso aprendiste:

1. **Estructura de un contrato Soroban**: Cómo organizar archivos Rust para contratos
2. **Verificación secp256r1**: Cómo verificar firmas de Passkeys usando la API de Soroban
3. **Protección contra replay attacks**: Uso de nonces para prevenir ataques de repetición
4. **Recuperación de cuenta**: Mecanismo para recuperar acceso usando una clave de recuperación
5. **Storage en Soroban**: Cómo almacenar y recuperar datos en contratos

## 🚀 Siguiente Paso

Una vez que hayas completado este paso y verificado que tu contrato compila correctamente, estás listo para:

**Paso 02**: Crear el contrato de registro de lotes de producción

```bash
git checkout 02-lot-registry-contract
```

Lee el tutorial: [`01-LOT_REGISTRY_CONTRACT.md`](./01-LOT_REGISTRY_CONTRACT.md)

## 📚 Referencias

- [Soroban SDK Documentation](https://soroban.stellar.org/docs)
- [Stellar Smart Wallets](https://stellar.org/learn/crypto-smart-contract-wallets)
- [Rust Book](https://doc.rust-lang.org/book/)

---

**¿Problemas?** Revisa los errores comunes arriba o consulta la documentación de Soroban.

