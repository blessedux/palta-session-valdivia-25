# 🥑 Stellar Smart Wallet MVP - Registro de Lotes de Producción

> **Construye un MVP de Smart Wallet para registrar metadata de lotes de producción en Stellar**

Este es un template inicial para construir un **MVP de Smart Wallet** que demuestra el desarrollo de aplicaciones blockchain del mundo real usando las capacidades de contratos inteligentes de Stellar.

## 🎯 Propósito del Proyecto

**Objetivo del MVP:** Construir una aplicación de smart wallet que permita a los usuarios registrar y consultar **metadata de lotes de producción** en la blockchain de Stellar.

### Caso de Uso: Seguimiento de Lotes de Producción

Las empresas necesitan rastrear lotes de producción con metadata (números de lote, fechas, información de calidad, etc.) de manera inmutable y descentralizada. Este MVP demuestra:

- ✅ Creación de smart wallet con Passkeys (secp256r1)
- ✅ Almacenamiento de metadata en la blockchain
- ✅ Trazabilidad inmutable
- ✅ Acceso descentralizado a datos

## 📋 Lo que Construirás

- ✔ **Smart Wallet** - Wallet basada en contratos con autenticación Passkey
- ✔ **Contrato de Registro de Lotes** - Almacena metadata de lotes de producción en la blockchain
- ✔ **Aplicación Frontend** - Interfaz Next.js para gestión de wallet y lotes
- ✔ **Registro de Lotes de Producción** - Registrar lotes con metadata
- ✔ **Interfaz de Consulta de Lotes** - Consultar y mostrar información de lotes

## 🌿 Organización de Ramas

Este repositorio usa ramas para mostrar el progreso del desarrollo. Cada rama representa una etapa del desarrollo:

- **`starting-template`** (actual) - Configuración inicial (solo README, docs, contracts)
- **`01-smart-wallet-contract`** - Implementación del contrato smart wallet
- **`02-lot-registry-contract`** - Contrato de registro de lotes de producción
- **`03-frontend-setup`** - Configuración del proyecto Next.js
- **`04-passkey-integration`** - Autenticación Passkey
- **`05-wallet-integration`** - Integración del smart wallet en frontend
- **`06-lot-registration`** - Funcionalidad de registro de lotes
- **`07-lot-query`** - Interfaz de consulta de lotes
- **`08-production-ready`** - Versión final lista para producción

Ver [docs/BRANCH_ORGANIZATION.md](./docs/BRANCH_ORGANIZATION.md) para información detallada de las ramas.

## 🚀 Inicio Rápido

### Rama Actual: `starting-template`

Esta rama contiene solo:

- ✅ README y documentación
- ✅ Definiciones de contratos (aún no implementados)
- ❌ Sin código frontend
- ❌ Sin implementación

### Próximos Pasos

1. **Revisar los contratos:**

   - `contracts/wallet.rs` - Contrato smart wallet (a implementar)
   - `contracts/lot_registry.rs` - Contrato de registro de lotes (a implementar)

2. **Leer la documentación:**

   - [docs/WALLET_EXPLANATION.md](./docs/WALLET_EXPLANATION.md) - Resumen del proyecto
   - [docs/BRANCH_ORGANIZATION.md](./docs/BRANCH_ORGANIZATION.md) - Estructura de ramas
   - [docs/SMART_WALLET_VS_TRADITIONAL.md](./docs/SMART_WALLET_VS_TRADITIONAL.md) - Explicación de smart wallet

3. **Cambiar a la siguiente rama:**
   ```bash
   git checkout 01-smart-wallet-contract
   ```

## 📚 Documentación

Toda la documentación está en el directorio `docs/`:

- **[docs/README.md](./docs/README.md)** - Índice de documentación
- **[docs/WALLET_EXPLANATION.md](./docs/WALLET_EXPLANATION.md)** - Resumen del proyecto y arquitectura
- **[docs/BRANCH_ORGANIZATION.md](./docs/BRANCH_ORGANIZATION.md)** - Guía de estructura de ramas
- **[docs/SMART_WALLET_VS_TRADITIONAL.md](./docs/SMART_WALLET_VS_TRADITIONAL.md)** - Smart wallet vs wallet tradicional
- **[docs/CONTRACT_DEPLOYMENT.md](./docs/CONTRACT_DEPLOYMENT.md)** - Guía de despliegue de contratos
- **[docs/CONTRACT_EXPLANATION.md](./docs/CONTRACT_EXPLANATION.md)** - Explicación de contratos
- **[docs/ENV_SETUP.md](./docs/ENV_SETUP.md)** - Configuración de entorno

## 🏗️ Estructura del Proyecto

```
stellar-smartwallet/
├── README.md                    # Este archivo
├── docs/                        # 📚 Toda la documentación
│   ├── README.md
│   ├── WALLET_EXPLANATION.md
│   ├── BRANCH_ORGANIZATION.md
│   ├── SMART_WALLET_VS_TRADITIONAL.md
│   ├── CONTRACT_DEPLOYMENT.md
│   ├── CONTRACT_EXPLANATION.md
│   └── ENV_SETUP.md
└── contracts/                   # 🔷 Contratos Soroban
    ├── wallet.rs                # Contrato smart wallet (a implementar)
    └── lot_registry.rs          # Contrato de registro de lotes (a implementar)
```

## 🎓 Para Estudiantes

### Ruta de Aprendizaje

1. **Comienza aquí** - Cambia a la rama `starting-template`
2. **Sigue las ramas** - Cambia a cada rama en orden (01 → 02 → 03...)
3. **Ve el progreso** - Cada rama agrega nueva funcionalidad
4. **Aprende con ejemplos** - Ve cómo se construye un MVP completo paso a paso

### Lo que Aprenderás

- ✅ Desarrollo de contratos inteligentes en Stellar (Soroban)
- ✅ Arquitectura de smart wallet (Protocol 21)
- ✅ Integración de Passkeys (WebAuthn, secp256r1)
- ✅ Integración frontend-blockchain
- ✅ Desarrollo de MVP del mundo real

## 🔧 Para Instructores

### Configuración de Ramas

1. **Crear ramas en orden:**

   ```bash
   git checkout -b 01-smart-wallet-contract
   # Implementar contrato smart wallet
   git commit -m "Agregar implementación del contrato smart wallet"

   git checkout -b 02-lot-registry-contract
   # Implementar contrato de registro de lotes
   git commit -m "Agregar implementación del contrato de registro de lotes"

   # Continuar para cada etapa...
   ```

2. **Subir todas las ramas:**
   ```bash
   git push origin --all
   ```

### Flujo del Workshop

1. Los estudiantes comienzan en `starting-template`
2. Recorrer cada rama mostrando el progreso
3. Los estudiantes pueden cambiar a cualquier rama para ver esa etapa
4. La rama final (`08-production-ready`) muestra el MVP completo

## 📦 Contratos

### Contrato Smart Wallet (`contracts/wallet.rs`)

**Propósito:** Gestiona cuentas de usuario con autenticación Passkey

**Características:**

- Verificación de firma secp256r1 (Protocol 21)
- Recuperación de cuenta
- Ejecución de transacciones
- Abstracción de fees

**Estado:** ✅ Implementado en la rama `01-smart-wallet-contract`

Ver [docs/WALLET_CONTRACT.md](./docs/WALLET_CONTRACT.md) para documentación completa del contrato.

### Contrato de Registro de Lotes (`contracts/lot_registry.rs`)

**Propósito:** Almacena metadata de lotes de producción en la blockchain

**Características:**

- Registrar lotes de producción
- Almacenar metadata (ID de lote, fecha, calidad, etc.)
- Consultar información de lotes
- Trazabilidad inmutable

**Estado:** ⏳ A implementar en la rama `02-lot-registry-contract`

## 🔗 Recursos

- [Documentación de Stellar Smart Wallet](https://stellar.org/learn/crypto-smart-contract-wallets)
- [Documentación de Soroban](https://soroban.stellar.org/docs)
- [Anuncio de Protocol 21](https://stellar.org/blog/protocol-21-is-live-on-stellar-mainnet)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)

---

**¿Listo para comenzar?** Cambia a la siguiente rama: `git checkout 01-smart-wallet-contract`

**¿Preguntas?** Revisa la [documentación](./docs/README.md) o abre un issue.
