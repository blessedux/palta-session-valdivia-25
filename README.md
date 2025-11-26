# Stellar Smart Wallet Workshop – De Cero a Prod (Passkeys + Soroban + Next.js)

> **Construye un Smart Wallet completo desde cero y despliégala en producción**

Una guía paso a paso para construir un Smart Wallet funcional usando Passkeys, contratos Soroban y Next.js. Al finalizar, tendrás una aplicación desplegada en Vercel interactuando con la blockchain de Stellar.

## ⭐ Quick Start

```bash
git clone <repository-url>
cd palta-session-valdivia-25
git checkout starting-template
npm install
npm run dev
```

> **Nota:** Si es tu primera vez, sigue los pasos completos en la sección [Comenzar](#-comenzar) para configurar todo correctamente.

## 👤 ¿Para Quién Es Este Workshop?

- **Principiantes** aprendiendo blockchain por primera vez
- **Desarrolladores** familiarizados con React/Next.js
- **Builders** que quieren entender contratos Soroban
- **Cualquiera** explorando Passkeys y autenticación moderna

## 🎯 ¿Qué Estás Construyendo?

Una aplicación web completa que permite:

- ✅ Crear un Smart Wallet usando Passkeys (autenticación sin contraseñas)
- ✅ Registrar metadata de lotes de producción en la blockchain de Stellar (testnet)
- ✅ Consultar y visualizar lotes registrados
- ✅ Interactuar con contratos inteligentes de forma segura
- ✅ Desplegar en Vercel para acceso público

**Resultado Final:** Una plataforma web desplegada y accesible públicamente que demuestra el poder de los Smart Wallets de Stellar.

### 🌐 Ver la Aplicación Desplegada

**Aplicación en Producción:** [🔗 Enlace a la aplicación desplegada](https://your-deployed-app.vercel.app)

> **Nota:** Este enlace será actualizado cuando la aplicación esté desplegada. Los estudiantes pueden ver el resultado final antes de comenzar.

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Browser       │
│   (Passkey)     │
└────────┬────────┘
         │ WebAuthn
         │ secp256r1
         ▼
┌─────────────────┐
│  Smart Wallet   │
│    Contract     │
│  (Soroban)      │
└────────┬────────┘
         │ Verifica firma
         │ Ejecuta transacción
         ▼
┌─────────────────┐
│  Lot Registry   │
│    Contract     │
│  (Soroban)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Stellar       │
│   Blockchain    │
│   (Testnet)     │
└─────────────────┘
```

**Flujo Completo:**

1. Usuario crea Passkey en el navegador
2. Passkey firma transacciones con secp256r1
3. Smart Wallet verifica la firma
4. Smart Wallet invoca Lot Registry
5. Metadata se almacena en la blockchain

## 🎓 ¿Qué Aprenderás?

- ✅ Crear Passkeys con WebAuthn
- ✅ Construir un contrato smart wallet (Soroban)
- ✅ Registrar metadata on-chain
- ✅ Conectar un frontend Next.js a Stellar
- ✅ Desplegar en Vercel
- ✅ Entender Protocol 21 (firmas secp256r1)

## 📋 Prerequisitos

### Conocimientos Básicos

- ✅ Conocimiento básico de JavaScript/TypeScript
- ✅ Familiaridad con React (recomendado)
- ✅ Conceptos básicos de blockchain (recomendado)
- ✅ Uso básico de Git

### Herramientas Necesarias

- ✅ **Node.js** 18+ instalado
- ✅ **Git** instalado
- ✅ **Navegador moderno** con soporte para WebAuthn (Chrome, Firefox, Safari, Edge)
- ✅ **Cuenta de GitHub** (para clonar el repositorio)
- ✅ **Cuenta de Vercel** (gratuita, para despliegue)

### Opcional (pero recomendado)

- ✅ Conocimiento básico de Rust (para entender los contratos)
- ✅ Editor de código (VS Code recomendado)

## 🗺️ El Viaje Completo

| Paso   | Rama                       | Descripción                   | Tutorial                                                            |
| ------ | -------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| **00** | `starting-template`        | Configuración inicial         | Esta rama                                                           |
| **01** | `01-smart-wallet-contract` | Contrato Smart Wallet         | [`00-SMART_WALLET_CONTRACT.md`](./docs/00-SMART_WALLET_CONTRACT.md) |
| **02** | `02-lot-registry-contract` | Contrato de Registro de Lotes | [`01-LOT_REGISTRY_CONTRACT.md`](./docs/01-LOT_REGISTRY_CONTRACT.md) |
| **03** | `03-frontend-setup`        | Configuración Next.js         | [`02-FRONTEND_SETUP.md`](./docs/02-FRONTEND_SETUP.md)               |
| **04** | `04-passkey-integration`   | Integración Passkeys          | [`03-PASSKEY_INTEGRATION.md`](./docs/03-PASSKEY_INTEGRATION.md)     |
| **05** | `05-production-ready`      | Producción y Despliegue       | [`04-PRODUCTION_READY.md`](./docs/04-PRODUCTION_READY.md)           |

## 🚀 Comenzar

### Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd palta-session-valdivia-25
```

### Paso 2: Verificar que Estás en la Rama Correcta

```bash
git checkout starting-template
```

### Paso 3: Explorar la Estructura

Esta rama contiene:

- ✅ **README.md** - Este archivo (guía completa)
- ✅ **docs/** - Toda la documentación y tutoriales
- ✅ **contracts/** - Contratos Soroban (stubs, a implementar)

### Paso 4: Leer los Tutoriales

Todos los tutoriales están disponibles en `docs/`:

- [Tutorial 00: Smart Wallet Contract](./docs/00-SMART_WALLET_CONTRACT.md)
- [Tutorial 01: Lot Registry Contract](./docs/01-LOT_REGISTRY_CONTRACT.md)
- [Tutorial 02: Frontend Setup](./docs/02-FRONTEND_SETUP.md)
- [Tutorial 03: Passkey Integration](./docs/03-PASSKEY_INTEGRATION.md)
- [Tutorial 04: Production Ready](./docs/04-PRODUCTION_READY.md)

### Paso 5: Comenzar con el Primer Paso

```bash
git checkout 01-smart-wallet-contract
```

Luego sigue el tutorial: [`docs/00-SMART_WALLET_CONTRACT.md`](./docs/00-SMART_WALLET_CONTRACT.md)

## 💻 Ejemplos de Código

### Crear un Smart Wallet

```typescript
const response = await walletContract.init({
  passkey_public_key: userPasskeyPublicKey,
});
```

### Registrar un Lote

```typescript
await lotRegistry.register_lot({
  lot_id: "PALTA-001",
  production_date: Date.now(),
  batch_number: "BATCH-2024-01",
  quantity: 1000,
  quality_score: 85,
  location: "Valdivia, Chile",
  notes: "Primera cosecha del año",
});
```

### Consultar un Lote

```typescript
const lot = await lotRegistry.get_lot("PALTA-001");
console.log(lot); // Metadata completa del lote
```

## 📚 Documentación Completa

Toda la documentación está en el directorio `docs/`:

### Guías Principales

- **[docs/README.md](./docs/README.md)** - Índice de documentación
- **[docs/BRANCH_ORGANIZATION.md](./docs/BRANCH_ORGANIZATION.md)** - Guía de estructura de ramas

### Conceptos Técnicos

- **[docs/SMART_WALLET_VS_TRADITIONAL.md](./docs/SMART_WALLET_VS_TRADITIONAL.md)** - Smart wallet vs wallet tradicional
- **[docs/CONTRACT_EXPLANATION.md](./docs/CONTRACT_EXPLANATION.md)** - Explicación de contratos
- **[docs/CONTRACT_DEPLOYMENT.md](./docs/CONTRACT_DEPLOYMENT.md)** - Guía de despliegue de contratos

### Configuración

- **[docs/ENV_SETUP.md](./docs/ENV_SETUP.md)** - Configuración de entorno

### Tutoriales Paso a Paso

- **[docs/00-SMART_WALLET_CONTRACT.md](./docs/00-SMART_WALLET_CONTRACT.md)** - Paso 01
- **[docs/01-LOT_REGISTRY_CONTRACT.md](./docs/01-LOT_REGISTRY_CONTRACT.md)** - Paso 02
- **[docs/02-FRONTEND_SETUP.md](./docs/02-FRONTEND_SETUP.md)** - Paso 03
- **[docs/03-PASSKEY_INTEGRATION.md](./docs/03-PASSKEY_INTEGRATION.md)** - Paso 04
- **[docs/04-PRODUCTION_READY.md](./docs/04-PRODUCTION_READY.md)** - Paso 05

## 🏗️ Estructura del Proyecto

```
stellar-smartwallet/
├── README.md                    # Este archivo
├── docs/                        # 📚 Toda la documentación
│   ├── README.md
│   ├── 00-SMART_WALLET_CONTRACT.md
│   ├── 01-LOT_REGISTRY_CONTRACT.md
│   ├── 02-FRONTEND_SETUP.md
│   ├── 03-PASSKEY_INTEGRATION.md
│   ├── 04-PRODUCTION_READY.md
│   ├── BRANCH_ORGANIZATION.md
│   ├── SMART_WALLET_VS_TRADITIONAL.md
│   ├── CONTRACT_DEPLOYMENT.md
│   ├── CONTRACT_EXPLANATION.md
│   ├── ENV_SETUP.md
│   └── images/                  # 📸 Imágenes y diagramas
└── contracts/                   # 🔷 Contratos Soroban
    ├── wallet.rs                # Contrato smart wallet
    └── lot_registry.rs          # Contrato de registro de lotes
```

## 🐛 Errores Comunes y Soluciones

### "Passkey creation fails in Brave"

**Solución:** Brave requiere configuración adicional. Usa Chrome, Firefox o Safari para desarrollo.

### "Contract ID not found"

**Solución:** Asegúrate de tener `NEXT_PUBLIC_CONTRACT_ID` configurado en `.env.local` con el ID del contrato desplegado.

### "CORS error calling Soroban RPC"

**Solución:** Verifica que estés usando la URL correcta del RPC. Para testnet: `https://rpc-futurenet.stellar.org`

### "WebAuthn not supported in incognito"

**Solución:** WebAuthn requiere contexto seguro. Usa una ventana normal (no incognito) o HTTPS.

### "secp256r1_verify not found"

**Solución:** Asegúrate de usar `soroban-sdk` versión 21.0.0 o superior que soporta Protocol 21.

## 📦 Contratos

### Contrato Smart Wallet (`contracts/src/wallet.rs`)

**Propósito:** Gestiona cuentas de usuario con autenticación Passkey

**Características:**

- Verificación de firma secp256r1 (Protocol 21)
- Recuperación de cuenta
- Ejecución de transacciones
- Abstracción de fees

**Estado:** ✅ Implementado en la rama `01-smart-wallet-contract`

Ver [docs/CONTRACT_EXPLANATION.md](./docs/CONTRACT_EXPLANATION.md) para documentación completa del contrato.

### Contrato de Registro de Lotes (`contracts/src/lot_registry.rs`)

**Propósito:** Almacena metadata de lotes de producción en la blockchain

**Características:**

- Registrar lotes de producción
- Almacenar metadata (ID de lote, fecha, calidad, etc.)
- Consultar información de lotes
- Trazabilidad inmutable

**Estado:** ✅ Implementado en la rama `02-lot-registry-contract`

> **Nota:** Los estudiantes usarán contratos **pre-desplegados** para ahorrar tiempo. El instructor mostrará el proceso de deployment, pero los estudiantes trabajarán con contratos ya desplegados en testnet.

## 🔗 Recursos

### Documentación Oficial

- [Documentación de Stellar Smart Wallet](https://stellar.org/learn/crypto-smart-contract-wallets)
- [Documentación de Soroban](https://soroban.stellar.org/docs)
- [Anuncio de Protocol 21](https://stellar.org/blog/protocol-21-is-live-on-stellar-mainnet)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)

### Herramientas

- [Vercel](https://vercel.com) - Plataforma de despliegue
- [v0](https://v0.dev) - Generador de UI (para UI intuitiva y minimalista)
- [Stellar Laboratory](https://laboratory.stellar.org) - Herramientas de desarrollo

## ✅ Criterios de Éxito

Al completar este workshop, habrás logrado:

- ✅ **Contratos Implementados**: Smart Wallet y Lot Registry funcionando
- ✅ **Frontend Funcional**: Aplicación Next.js con todas las funcionalidades
- ✅ **Autenticación Passkey**: Creación y uso de Passkeys para autenticación
- ✅ **Registro de Lotes**: Capacidad de registrar metadata en la blockchain
- ✅ **Consulta de Lotes**: Interfaz para consultar lotes registrados
- ✅ **UI/UX Pulida**: Interfaz intuitiva y minimalista
- ✅ **Desplegado en Vercel**: Aplicación accesible públicamente
- ✅ **Funcionando en Testnet**: Interactuando con la blockchain real de Stellar

## 🎯 Próximos Pasos

**¿Listo para comenzar?**

1. Lee los tutoriales en `docs/`
2. Cambia a la primera rama: `git checkout 01-smart-wallet-contract`
3. Sigue el tutorial: [`docs/00-SMART_WALLET_CONTRACT.md`](./docs/00-SMART_WALLET_CONTRACT.md)

**¿Preguntas?** Revisa la [documentación](./docs/README.md) o abre un issue.

---

**¡Buena suerte construyendo tu Smart Wallet! 🚀**
