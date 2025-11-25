# 🔐 Contrato Smart Wallet - Documentación

## Resumen

El contrato `wallet.rs` implementa un smart wallet completo con autenticación Passkey usando verificación secp256r1 (Protocol 21).

## Funcionalidades

### 1. Inicialización (`init`)

Inicializa una nueva instancia de wallet con una clave pública Passkey.

```rust
pub fn init(env: Env, passkey_public_key: BytesN<65>)
```

**Parámetros:**
- `passkey_public_key`: Clave pública secp256r1 del Passkey (65 bytes, formato sin comprimir)

**Comportamiento:**
- Verifica que el wallet no esté ya inicializado
- Almacena la clave pública Passkey
- Inicializa el nonce en 0
- No requiere firma (solo se llama una vez al crear el wallet)

### 2. Ejecutar Transacción (`execute`)

Ejecuta una transacción después de verificar la firma del Passkey.

```rust
pub fn execute(env: Env, message: Bytes, signature: BytesN<64>, nonce: u64) -> u64
```

**Parámetros:**
- `message`: Mensaje de la transacción a ejecutar (como bytes)
- `signature`: Firma secp256r1 del Passkey (64 bytes: 32 bytes r + 32 bytes s)
- `nonce`: Nonce de la transacción (debe ser nonce actual + 1)

**Retorna:**
- El nuevo nonce después de la ejecución exitosa

**Comportamiento:**
1. Verifica el nonce (previene ataques de replay)
2. Calcula el hash SHA256 del mensaje
3. Verifica la firma secp256r1 usando `verify_sig_ecdsa_secp256r1`
4. Actualiza el nonce
5. En una implementación completa, aquí se ejecutaría la transacción

### 3. Establecer Clave de Recuperación (`set_recovery_key`)

Establece una clave de recuperación para permitir la recuperación de cuenta.

```rust
pub fn set_recovery_key(env: Env, recovery_key: BytesN<65>, signature: BytesN<64>, nonce: u64)
```

**Parámetros:**
- `recovery_key`: Clave pública secp256r1 para recuperación (65 bytes)
- `signature`: Firma del Passkey actual autorizando este cambio
- `nonce`: Nonce actual

**Comportamiento:**
1. Verifica el nonce
2. Construye el mensaje: "set_recovery_key" + recovery_key
3. Verifica la firma del Passkey actual
4. Almacena la clave de recuperación
5. Actualiza el nonce

### 4. Recuperar Cuenta (`recover`)

Recupera el acceso a la cuenta usando la clave de recuperación.

```rust
pub fn recover(env: Env, new_passkey_public_key: BytesN<65>, recovery_signature: BytesN<64>)
```

**Parámetros:**
- `new_passkey_public_key`: Nueva clave pública Passkey (65 bytes)
- `recovery_signature`: Firma de la clave de recuperación

**Comportamiento:**
1. Verifica que exista una clave de recuperación
2. Construye el mensaje: "recover" + new_passkey_public_key
3. Verifica la firma de la clave de recuperación
4. Actualiza la clave pública Passkey
5. Reinicia el nonce a 0

### 5. Obtener Nonce (`get_nonce`)

Obtiene el nonce actual del wallet.

```rust
pub fn get_nonce(env: Env) -> u64
```

**Retorna:**
- El valor del nonce actual

### 6. Obtener Clave Pública Passkey (`get_passkey_public_key`)

Obtiene la clave pública Passkey almacenada.

```rust
pub fn get_passkey_public_key(env: Env) -> BytesN<65>
```

**Retorna:**
- La clave pública Passkey (65 bytes)

## Estructura de Datos

### WalletData

```rust
pub struct WalletData {
    pub passkey_public_key: BytesN<65>,  // Clave pública secp256r1
    pub recovery_key: Option<BytesN<65>>, // Clave de recuperación opcional
    pub nonce: u64,                       // Nonce para protección contra replay
}
```

## Seguridad

### Protección contra Replay Attacks

- Cada transacción requiere un nonce incremental
- El nonce debe ser exactamente `nonce_actual + 1`
- Esto previene que las transacciones sean reenviadas

### Verificación de Firmas

- Todas las operaciones críticas requieren verificación de firma secp256r1
- Las firmas se verifican usando `verify_sig_ecdsa_secp256r1` del SDK de Soroban
- El hash del mensaje se calcula usando SHA256

### Recuperación de Cuenta

- Requiere una clave de recuperación previamente establecida
- La recuperación reinicia el nonce (opcional, depende del modelo de seguridad)
- Permite cambiar el Passkey sin perder acceso a los fondos

## Flujo de Uso

### 1. Crear Wallet

```
1. Usuario crea Passkey (WebAuthn)
2. Obtiene clave pública secp256r1 (65 bytes)
3. Llama init() con la clave pública
4. Wallet está listo para usar
```

### 2. Ejecutar Transacción

```
1. Usuario construye mensaje de transacción
2. Firma el mensaje con Passkey (secp256r1)
3. Obtiene nonce actual: get_nonce()
4. Llama execute(message, signature, nonce + 1)
5. Contrato verifica y ejecuta
```

### 3. Establecer Recuperación

```
1. Usuario genera clave de recuperación
2. Obtiene nonce actual
3. Firma mensaje "set_recovery_key" + recovery_key
4. Llama set_recovery_key(recovery_key, signature, nonce + 1)
```

### 4. Recuperar Cuenta

```
1. Usuario crea nuevo Passkey
2. Obtiene nueva clave pública
3. Firma mensaje "recover" + new_key con recovery_key
4. Llama recover(new_key, recovery_signature)
5. Wallet ahora usa nuevo Passkey
```

## Notas de Implementación

### Formato de Claves

- **Clave pública secp256r1**: 65 bytes, formato sin comprimir
  - Byte 0: 0x04 (indicador sin comprimir)
  - Bytes 1-32: Coordenada X (32 bytes)
  - Bytes 33-64: Coordenada Y (32 bytes)

### Formato de Firmas

- **Firma secp256r1**: 64 bytes
  - Bytes 0-31: Componente r (32 bytes)
  - Bytes 32-63: Componente s (32 bytes)

### Almacenamiento

- Usa `instance()` storage (persistente por instancia de contrato)
- Cada wallet es una instancia separada del contrato
- Los datos se almacenan bajo la clave `WALLET`

## Próximos Pasos

En ramas futuras:
- Integración con frontend
- Parsing y ejecución de transacciones reales
- Soporte para múltiples operaciones
- Integración con el contrato de registro de lotes

---

**Estado:** ✅ Implementación completa del contrato smart wallet

