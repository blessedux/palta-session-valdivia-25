# 📝 Tutorial Paso 02: Crear el Contrato de Registro de Lotes

## 🎯 Objetivo

En este paso, aprenderás a crear un contrato Soroban para registrar y consultar metadatos de lotes de producción. Este contrato:
- Almacena metadatos de lotes de producción
- Permite consultar información de lotes
- Valida datos de entrada
- Se integra con el Smart Wallet creado en el paso anterior

## 📚 Prerequisitos

Antes de comenzar, asegúrate de haber completado:
- ✅ **Paso 01**: Contrato Smart Wallet implementado y compilando correctamente
- ✅ Entender conceptos básicos de storage en Soroban (persistent storage, Maps)

## 🛠️ Paso 1: Agregar el Módulo al Proyecto

### 1.1 Actualizar `src/lib.rs`

Abre `contracts/src/lib.rs` y agrega el módulo `lot_registry`:

```rust
#![no_std]
pub mod wallet;
pub mod lot_registry;  // Agregar esta línea
```

**¿Qué hace?**
- Declara el módulo `lot_registry` que crearemos a continuación

## 💻 Paso 2: Implementar el Contrato de Registro de Lotes

### 2.1 Crear `src/lot_registry.rs`

Crea el archivo `contracts/src/lot_registry.rs` con la siguiente estructura:

```rust
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Env, 
    String as SorobanString, Address, Map, Symbol
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LotMetadata {
    pub lot_id: SorobanString,
    pub production_date: u64,        // Timestamp
    pub batch_number: SorobanString,
    pub quantity: u32,
    pub quality_score: u32,          // 0-100
    pub location: SorobanString,
    pub notes: SorobanString,
    pub registered_by: Address,      // Smart wallet address
}

const LOTS_KEY: Symbol = symbol_short!("LOTS");

#[contract]
pub struct LotRegistry;

#[contractimpl]
impl LotRegistry {
    // Aquí implementaremos las funciones
}
```

**Explicación:**
- `LotMetadata`: Estructura que almacena todos los metadatos de un lote de producción
- `LOTS_KEY`: Clave para almacenar el Map de lotes en el storage persistente
- `LotRegistry`: El contrato principal

### 2.2 Implementar la función `register_lot`

Agrega esta función dentro del `impl LotRegistry`:

```rust
/// Register a new production lot
/// 
/// # Arguments
/// * `lot_id` - Unique identifier for the lot
/// * `production_date` - Timestamp of production date
/// * `batch_number` - Batch number identifier
/// * `quantity` - Quantity of items in the lot
/// * `quality_score` - Quality score (0-100)
/// * `location` - Production location
/// * `notes` - Additional notes
pub fn register_lot(
    env: Env,
    lot_id: SorobanString,
    production_date: u64,
    batch_number: SorobanString,
    quantity: u32,
    quality_score: u32,
    location: SorobanString,
    notes: SorobanString,
) {
    // Get the caller address (the smart wallet contract that invoked this)
    // This will be set by the smart wallet when it calls this function
    let caller = env.current_contract_address();
    
    // Validate quality score
    if quality_score > 100 {
        panic!("Quality score must be between 0 and 100");
    }
    
    let metadata = LotMetadata {
        lot_id: lot_id.clone(),
        production_date,
        batch_number,
        quantity,
        quality_score,
        location,
        notes,
        registered_by: caller,
    };
    
    // Store in persistent storage
    let mut lots: Map<SorobanString, LotMetadata> = env
        .storage()
        .persistent()
        .get(&LOTS_KEY)
        .unwrap_or(Map::new(&env));
    
    lots.set(lot_id.clone(), metadata);
    env.storage().persistent().set(&LOTS_KEY, &lots);
}
```

**¿Qué hace?**
- Obtiene la dirección del contrato que invocó esta función (el smart wallet)
- Valida que el `quality_score` esté entre 0 y 100
- Crea la estructura `LotMetadata` con todos los datos
- Obtiene el Map de lotes del storage persistente (o crea uno nuevo si no existe)
- Agrega el nuevo lote al Map
- Guarda el Map actualizado en el storage

**Conceptos importantes:**
- **Persistent Storage**: Los datos persisten entre invocaciones del contrato
- **Map**: Estructura de datos clave-valor para almacenar múltiples lotes
- **Validation**: Validamos el `quality_score` antes de almacenar

### 2.3 Implementar la función `get_lot`

Esta función permite consultar los metadatos de un lote específico:

```rust
/// Get lot metadata by lot ID
/// 
/// # Arguments
/// * `lot_id` - The unique identifier of the lot
/// 
/// # Returns
/// `Option<LotMetadata>` - The metadata if found, None otherwise
pub fn get_lot(env: Env, lot_id: SorobanString) -> Option<LotMetadata> {
    let lots: Map<SorobanString, LotMetadata> = env
        .storage()
        .persistent()
        .get(&LOTS_KEY)
        .unwrap_or(Map::new(&env));
    
    lots.get(lot_id)
}
```

**¿Qué hace?**
- Obtiene el Map de lotes del storage
- Busca el lote con el `lot_id` especificado
- Retorna `Some(metadata)` si existe, `None` si no existe

### 2.4 Implementar la función `lot_exists`

Esta función verifica si un lote existe sin cargar todos sus datos:

```rust
/// Check if a lot exists
/// 
/// # Arguments
/// * `lot_id` - The unique identifier of the lot
/// 
/// # Returns
/// `bool` - true if the lot exists, false otherwise
pub fn lot_exists(env: Env, lot_id: SorobanString) -> bool {
    let lots: Map<SorobanString, LotMetadata> = env
        .storage()
        .persistent()
        .get(&LOTS_KEY)
        .unwrap_or(Map::new(&env));
    
    lots.contains_key(lot_id)
}
```

**¿Qué hace?**
- Obtiene el Map de lotes
- Verifica si existe una clave con el `lot_id` especificado
- Retorna `true` si existe, `false` si no existe

### 2.5 Agregar módulo de tests

Crea `src/lot_registry/test.rs`:

```rust
#![cfg(test)]
// Tests will be added in development branches
```

Y agrega al final de `src/lot_registry.rs`:

```rust
#[cfg(test)]
mod test;
```

## 🔨 Paso 3: Compilar el Contrato

### 3.1 Compilar ambos contratos

Desde el directorio `contracts/`, ejecuta:

```bash
soroban contract build
```

**¿Qué esperar?**
- El compilador compilará tanto `wallet.rs` como `lot_registry.rs`
- Si todo está correcto, verás: `✅ Build Complete`
- Si hay errores, el compilador te indicará qué está mal

### 3.2 Verificar la compilación

El comando anterior debería generar:
- Archivos `.wasm` para ambos contratos en `target/wasm32-unknown-unknown/release/`
- Mensajes de compilación exitosa

## ✅ Paso 4: Verificar tu Implementación

### 4.1 Checklist de verificación

Asegúrate de que tu implementación tenga:

- ✅ **Estructura correcta**:
  - `contracts/src/lib.rs` incluye `pub mod lot_registry;`
  - `contracts/src/lot_registry.rs` existe
  - `contracts/src/lot_registry/test.rs` existe

- ✅ **Funciones implementadas**:
  - `register_lot()` - Registra un nuevo lote con validación
  - `get_lot()` - Consulta metadatos de un lote
  - `lot_exists()` - Verifica si un lote existe

- ✅ **Validación implementada**:
  - `quality_score` debe estar entre 0 y 100

- ✅ **Storage correcto**:
  - Usa `persistent()` storage para que los datos persistan
  - Usa `Map` para almacenar múltiples lotes

- ✅ **Compilación exitosa**:
  - El comando `soroban contract build` completa sin errores

### 4.2 Errores comunes y soluciones

**Error: "the trait bound `u8: TryFromVal` is not satisfied"**
- **Solución**: Cambia `quality_score: u8` a `quality_score: u32` en la estructura `LotMetadata`

**Error: "no method named `invoker` found"**
- **Solución**: Usa `env.current_contract_address()` en lugar de `env.invoker()`

**Error: "Map is not found"**
- **Solución**: Asegúrate de importar `Map` desde `soroban_sdk`

## 📖 Conceptos Clave Aprendidos

En este paso aprendiste:

1. **Persistent Storage**: Cómo almacenar datos que persisten entre invocaciones del contrato
2. **Maps en Soroban**: Cómo usar estructuras clave-valor para almacenar múltiples registros
3. **Validación de datos**: Cómo validar datos de entrada antes de almacenarlos
4. **Consultas de datos**: Cómo recuperar y verificar datos almacenados
5. **Integración con Smart Wallet**: Cómo el contrato identifica quién registró el lote

## 🔗 Integración con Smart Wallet

El contrato `LotRegistry` está diseñado para ser invocado por el Smart Wallet:

1. El usuario firma una transacción con su Passkey
2. El Smart Wallet verifica la firma
3. El Smart Wallet invoca `register_lot()` en el contrato `LotRegistry`
4. El `LotRegistry` almacena los metadatos con `registered_by` = dirección del Smart Wallet

**Flujo completo:**
```
Usuario → Passkey (firma) → Smart Wallet (verifica) → Lot Registry (almacena)
```

## 🚀 Siguiente Paso

Una vez que hayas completado este paso y verificado que tu contrato compila correctamente, estás listo para:

**Paso 03**: Configurar el frontend con Next.js

```bash
git checkout 03-frontend-setup
```

Lee el tutorial: [`02-FRONTEND_SETUP.md`](./02-FRONTEND_SETUP.md)

## 📚 Referencias

- [Soroban Storage Documentation](https://soroban.stellar.org/docs/fundamentals-and-concepts/storage)
- [Soroban SDK Map](https://docs.rs/soroban-sdk/latest/soroban_sdk/struct.Map.html)
- [Soroban Contract Types](https://soroban.stellar.org/docs/fundamentals-and-concepts/contract-types)

---

**¿Problemas?** Revisa los errores comunes arriba o consulta la documentación de Soroban.

