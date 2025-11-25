# 💼 Smart Wallet MVP: Registro de Metadata de Lotes de Producción

## Resumen del Proyecto

Este es un **MVP de Smart Wallet en Stellar** diseñado para registrar y gestionar **metadata de lotes de producción** en la blockchain. Demuestra cómo construir una aplicación del mundo real usando las capacidades de contratos inteligentes de Stellar.

## Lo que Estamos Construyendo

### Funcionalidad Principal

Una aplicación de smart wallet que permite a los usuarios:

1. **Crear una Smart Wallet** usando Passkeys (WebAuthn con secp256r1)
2. **Registrar Metadata de Lotes de Producción** en la blockchain
3. **Consultar y Ver** información de lotes registrados
4. **Gestionar Lotes** a través de la interfaz del smart wallet

### Caso de Uso: Seguimiento de Lotes de Producción

**Problema:** Las empresas necesitan rastrear lotes de producción con metadata (números de lote, fechas, información de calidad, etc.) de manera inmutable.

**Solución:** Usar contratos inteligentes de Stellar para almacenar metadata de lotes en la blockchain, accesible a través de una interfaz de smart wallet.

## Arquitectura

### Smart Wallet (Contrato Soroban)

- **Contrato:** `contracts/wallet.rs`
- **Propósito:** Gestiona cuentas de usuario con autenticación Passkey
- **Características:**
  - Verificación de firma secp256r1 (Protocol 21)
  - Recuperación de cuenta
  - Ejecución de transacciones
  - Abstracción de fees

### Registro de Lotes de Producción (Contrato Soroban)

- **Contrato:** `contracts/lot_registry.rs`
- **Propósito:** Almacena metadata de lotes de producción
- **Características:**
  - Registrar nuevos lotes de producción
  - Almacenar metadata (ID de lote, fecha, datos de calidad, etc.)
  - Consultar información de lotes
  - Actualizar estado del lote

### Aplicación Frontend

- **Framework:** Next.js
- **Propósito:** Interfaz de usuario para gestión de wallet y lotes
- **Características:**
  - Creación y autenticación de Passkeys
  - Interacción con smart wallet
  - Formulario de registro de lotes
  - Interfaz de consulta de lotes

## Cómo Funciona

### 1. Creación de Smart Wallet

```
Usuario → Crear Passkey (WebAuthn)
        → Desplegar Instancia del Contrato Wallet
        → Registrar Passkey con el Contrato
        → Obtener Dirección del Contrato
```

### 2. Registrar Lote de Producción

```
Usuario → Llenar Formulario de Metadata del Lote
        → Firmar Transacción con Passkey (secp256r1)
        → Contrato Wallet Verifica Firma
        → Invocar Contrato de Registro de Lotes
        → Almacenar Metadata en la Blockchain
```

### 3. Consultar Información del Lote

```
Usuario → Ingresar ID del Lote
        → Consultar Contrato de Registro de Lotes
        → Mostrar Metadata
```

## Stack Tecnológico

### Blockchain

- **Red:** Stellar Futurenet
- **Contratos Inteligentes:** Soroban (Rust)
- **Protocolo:** Protocol 21 (soporte secp256r1)

### Frontend

- **Framework:** Next.js 14
- **Lenguaje:** TypeScript
- **Autenticación:** WebAuthn/Passkeys
- **SDK:** @stellar/stellar-sdk

## Estructura de Metadata de Lotes de Producción

```rust
pub struct LotMetadata {
    pub lot_id: String,
    pub production_date: u64,        // Timestamp
    pub batch_number: String,
    pub quantity: u32,
    pub quality_score: u8,           // 0-100
    pub location: String,
    pub notes: String,
    pub registered_by: Address,      // Dirección del smart wallet
}
```

## Etapas de Desarrollo

El proyecto está organizado en ramas que representan diferentes etapas de desarrollo:

1. **`starting-template`** - Configuración inicial (README, docs, contracts)
2. **`01-smart-wallet-contract`** - Implementación del contrato smart wallet
3. **`02-lot-registry-contract`** - Contrato de registro de lotes de producción
4. **`03-frontend-setup`** - Configuración de Next.js e UI básica
5. **`04-passkey-integration`** - Autenticación Passkey
6. **`05-wallet-integration`** - Integración del smart wallet en frontend
7. **`06-lot-registration`** - Funcionalidad de registro de lotes
8. **`07-lot-query`** - Interfaz de consulta de lotes
9. **`08-production-ready`** - Pulido final y despliegue

## Características Clave

### Características del Smart Wallet

- ✅ Autenticación Passkey (secp256r1)
- ✅ Recuperación de cuenta
- ✅ Firma de transacciones
- ✅ Abstracción de fees

### Características del Registro de Lotes

- ✅ Registrar lotes de producción
- ✅ Almacenar metadata en la blockchain
- ✅ Consultar información de lotes
- ✅ Actualizar estado del lote
- ✅ Trazabilidad inmutable

## ¿Por Qué Este MVP?

1. **Caso de uso del mundo real** - El seguimiento de producción es una necesidad empresarial común
2. **Demuestra contratos inteligentes** - Muestra cómo almacenar y consultar datos
3. **Muestra integración de smart wallet** - Usa características de Protocol 21
4. **Educativo** - Los estudiantes aprenden construyendo algo práctico
5. **Escalable** - Puede extenderse con más características

## Próximos Pasos

1. Revisar la estructura de contratos en `contracts/`
2. Cambiar a diferentes ramas para ver el progreso del desarrollo
3. Seguir el README para instrucciones de configuración
4. Desplegar contratos en Futurenet
5. Construir el frontend paso a paso

---

**Este es un MVP listo para producción que demuestra smart wallets de Stellar e interacción con contratos para casos de uso del mundo real.**
