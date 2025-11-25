# 📜 Entendiendo los Contratos

## ¿Qué Contratos Estamos Usando?

Este proyecto utiliza dos contratos Soroban desplegados en Stellar Futurenet:

1. **Smart Wallet Contract** - Gestiona cuentas de usuario con autenticación Passkey
2. **Lot Registry Contract** - Almacena metadata de lotes de producción en la blockchain

## Contrato Smart Wallet

### Estructura del Contrato

El contrato Smart Wallet gestiona cuentas de usuario con las siguientes características:

```rust
// Estructura de datos del wallet
pub struct WalletData {
    pub passkey_public_key: BytesN<33>,  // Clave pública del Passkey
    pub nonce: u64,                      // Nonce para protección contra replay
    pub recovery_key: Option<BytesN<33>>, // Clave de recuperación opcional
}
```

### Funciones Principales

#### `init(passkey_public_key: BytesN<33>)`

**Qué hace:**

- Inicializa un nuevo wallet con una clave pública Passkey
- Establece el nonce inicial en 0
- Almacena la clave pública para verificación de firmas

**Cómo se llama:**

```typescript
// En el frontend
await walletContract.invoke({
  method: "init",
  args: [passkeyPublicKey],
});
```

**Costo:** Tarifa de transacción (pagada por quien firma)

**Quién puede llamar:** Cualquiera (pero solo una vez por wallet)

#### `execute(message: Bytes, signature: BytesN<64>, nonce: u64)`

**Qué hace:**

- Verifica la firma secp256r1 del Passkey
- Verifica que el nonce sea correcto (previene replay attacks)
- Ejecuta la transacción si la verificación es exitosa
- Actualiza el nonce

**Cómo se llama:**

```typescript
// En el frontend
await walletContract.invoke({
  method: "execute",
  args: [message, signature, nonce],
});
```

**Costo:** Tarifa de transacción

**Quién puede llamar:** Cualquiera con una firma válida del Passkey

#### `recover(new_passkey_public_key: BytesN<33>, recovery_signature: BytesN<64>)`

**Qué hace:**

- Permite recuperar acceso a la cuenta usando una clave de recuperación
- Actualiza la clave pública del Passkey

**Costo:** Tarifa de transacción

**Quién puede llamar:** Cualquiera con una firma válida de la clave de recuperación

#### `set_recovery_key(recovery_key: BytesN<33>, signature: BytesN<64>, nonce: u64)`

**Qué hace:**

- Establece una clave de recuperación opcional
- Requiere una firma válida del Passkey actual

**Costo:** Tarifa de transacción

#### `get_nonce() -> u64`

**Qué hace:**

- Obtiene el nonce actual del wallet
- Útil para construir transacciones con el nonce correcto

**Costo:** GRATIS (solo lectura, no requiere transacción)

#### `get_passkey_public_key() -> BytesN<33>`

**Qué hace:**

- Obtiene la clave pública del Passkey almacenada

**Costo:** GRATIS (solo lectura)

---

## Contrato de Registro de Lotes

### Estructura del Contrato

El contrato de registro almacena metadata de lotes de producción:

```rust
// Estructura de metadata de lote
pub struct LotMetadata {
    pub lot_id: Symbol,              // ID único del lote
    pub production_date: u64,        // Fecha de producción (timestamp)
    pub batch_number: String,       // Número de lote
    pub quantity: u32,               // Cantidad
    pub quality_score: u8,            // Puntuación de calidad (0-100)
    pub location: String,             // Ubicación
    pub notes: String,                // Notas adicionales
    pub registered_by: Address,       // Dirección que registró el lote
}
```

### Funciones Principales

#### `register_lot(...)`

**Qué hace:**

- Registra un nuevo lote de producción con toda su metadata
- Valida que el `quality_score` esté entre 0 y 100
- Almacena el lote en el almacenamiento del contrato
- Usa `env.invoker()` para determinar quién registró el lote

**Parámetros:**

- `lot_id`: ID único del lote
- `production_date`: Fecha de producción (timestamp)
- `batch_number`: Número de lote
- `quantity`: Cantidad
- `quality_score`: Puntuación de calidad (0-100)
- `location`: Ubicación
- `notes`: Notas adicionales

**Costo:** Tarifa de transacción

**Quién puede llamar:** Cualquiera que firme la transacción

#### `get_lot(lot_id: Symbol) -> LotMetadata`

**Qué hace:**

- Obtiene la metadata completa de un lote por su ID
- Retorna la estructura `LotMetadata` completa

**Costo:** GRATIS (solo lectura)

**Quién puede llamar:** Cualquiera (lectura pública)

#### `lot_exists(lot_id: Symbol) -> bool`

**Qué hace:**

- Verifica si un lote existe en el registro
- Retorna `true` si existe, `false` si no

**Costo:** GRATIS (solo lectura)

**Quién puede llamar:** Cualquiera

---

## Flujo de Integración Frontend

### Inicializar un Smart Wallet

```
Usuario crea Passkey
    ↓
Frontend extrae clave pública
    ↓
walletContract.init(passkeyPublicKey)
    ↓
Contrato almacena clave pública y nonce = 0
    ↓
Wallet inicializado ✅
```

### Registrar un Lote

```
Usuario llena formulario de registro
    ↓
Frontend construye transacción
    ↓
Passkey firma la transacción (secp256r1)
    ↓
walletContract.execute(message, signature, nonce)
    ↓
Contrato verifica firma y ejecuta
    ↓
lotRegistryContract.register_lot(...)
    ↓
Lote registrado en blockchain ✅
```

### Consultar un Lote

```
Usuario ingresa ID de lote
    ↓
Frontend llama lotRegistryContract.get_lot(lot_id)
    ↓
Contrato retorna metadata del lote
    ↓
Frontend muestra información en UI
```

---

## Experiencia del Workshop

### ¿Por Qué Este Diseño?

1. **Smart Wallet Real:** Usa contratos Soroban reales, no wallets tradicionales
2. **Passkeys Nativos:** Usa secp256r1 directamente, no derivación de claves
3. **Recuperación de Cuenta:** Funcionalidad de recuperación integrada
4. **Registro de Lotes:** Caso de uso práctico y real
5. **Educativo:** Los estudiantes aprenden arquitectura de smart wallets real

### Lo Que Aprenden los Estudiantes

- ✅ Cómo funcionan los smart wallets basados en contratos
- ✅ Cómo verificar firmas secp256r1 con Passkeys
- ✅ Cómo usar nonces para prevenir replay attacks
- ✅ Cómo interactuar con contratos Soroban desde el frontend
- ✅ Cómo registrar y consultar datos en la blockchain
- ✅ La diferencia entre operaciones de lectura y escritura

---

## Próximos Pasos

Después de entender estos contratos, los estudiantes pueden:

- Modificar los contratos para agregar más funcionalidades
- Agregar control de acceso (solo el dueño puede modificar)
- Agregar eventos para rastrear cambios
- Construir contratos más complejos
- Implementar multi-firma
- Agregar límites de gasto

---

**¿Listo para desplegar?** Ver [CONTRACT_DEPLOYMENT.md](./CONTRACT_DEPLOYMENT.md)
