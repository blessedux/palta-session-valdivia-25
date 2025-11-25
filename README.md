# 🥑 Stellar Smart Wallet MVP - Registro de Lotes de Producción

> **Construye un MVP de Smart Wallet listo para producción y despliégala en Vercel**

Este es un template inicial para construir un **MVP de Smart Wallet** que demuestra el desarrollo de aplicaciones blockchain del mundo real usando las capacidades de contratos inteligentes de Stellar.

## 🎯 ¿Qué Estás Construyendo?

**Tu Objetivo Final:** Desplegar una aplicación web funcional en **Vercel** que permita a los usuarios:

- Crear un Smart Wallet usando Passkeys (autenticación sin contraseñas)
- Registrar metadata de lotes de producción en la blockchain de Stellar (testnet)
- Consultar y visualizar lotes registrados
- Interactuar con contratos inteligentes de forma segura

**Resultado:** Una plataforma web desplegada y accesible públicamente que demuestra el poder de los Smart Wallets de Stellar.

### 🌐 Ver la Aplicación Desplegada

**Aplicación en Producción:** [🔗 Enlace a la aplicación desplegada](https://your-deployed-app.vercel.app)

> **Nota:** Este enlace será actualizado cuando la aplicación esté desplegada. Los estudiantes pueden ver el resultado final antes de comenzar.

## 📖 ¿Qué, Cómo, Por Qué y el Proceso?

### ¿Qué Estamos Construyendo?

Una **aplicación de Smart Wallet** que permite registrar y consultar metadata de lotes de producción en la blockchain de Stellar. Es un MVP (Minimum Viable Product) que demuestra:

- **Smart Wallets** - Wallets basadas en contratos inteligentes (no tradicionales)
- **Autenticación con Passkeys** - Usando WebAuthn y secp256r1 (Protocol 21)
- **Registro On-Chain** - Metadata almacenada de forma inmutable en la blockchain
- **Interfaz Moderna** - Frontend Next.js con UI intuitiva y minimalista

### ¿Cómo Lo Construiremos?

A través de **8 pasos incrementales**, cada uno agregando una funcionalidad específica:

1. **Contrato Smart Wallet** - Implementar el contrato que gestiona cuentas
2. **Contrato de Registro de Lotes** - Implementar el contrato para almacenar metadata
3. **Configuración Frontend** - Setup inicial de Next.js
4. **Integración Passkeys** - Autenticación sin contraseñas
5. **Integración Wallet** - Conectar frontend con el smart wallet
6. **Registro de Lotes** - Funcionalidad para registrar lotes
7. **Consulta de Lotes** - Interfaz para consultar información
8. **Producción y Despliegue** - Pulir UI/UX y desplegar en Vercel

### ¿Por Qué Es Importante?

- **Aprender Smart Contracts** - Entender cómo funcionan los contratos en Stellar (Soroban)
- **Protocol 21** - Experimentar con las nuevas capacidades de Stellar
- **Passkeys** - El futuro de la autenticación web (sin contraseñas)
- **Blockchain Real** - Construir algo que realmente funciona en testnet
- **Despliegue en Producción** - Aprender a llevar aplicaciones blockchain a producción

### El Proceso

Cada paso está en una **rama de Git diferente**. Los estudiantes:

1. Comienzan en `starting-template` (esta rama)
2. Siguen las ramas en orden: `01` → `02` → `03` → ... → `08`
3. Cada rama tiene un tutorial detallado en `docs/tutorials/`
4. Al final, tienen una aplicación completa desplegada en Vercel

> **Nota sobre Contratos:** Para ahorrar tiempo, usaremos contratos **pre-desplegados** en Stellar testnet. El instructor mostrará cómo se despliegan los contratos, pero los estudiantes usarán contratos ya desplegados.

## ✅ Criterios de Éxito

Al completar este workshop, habrás logrado:

- ✅ **Contratos Implementados**: Smart Wallet y Lot Registry funcionando
- ✅ **Frontend Funcional**: Aplicación Next.js con todas las funcionalidades
- ✅ **Autenticación Passkey**: Creación y uso de Passkeys para autenticación
- ✅ **Registro de Lotes**: Capacidad de registrar metadata en la blockchain
- ✅ **Consulta de Lotes**: Interfaz para consultar lotes registrados
- ✅ **UI/UX Pulida**: Interfaz intuitiva y minimalista (usando v0)
- ✅ **Desplegado en Vercel**: Aplicación accesible públicamente
- ✅ **Funcionando en Testnet**: Interactuando con la blockchain real de Stellar

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:

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

### Paso 01: Contrato Smart Wallet

**Rama:** `01-smart-wallet-contract`  
**Qué aprendes:** Implementar un contrato Soroban que gestiona cuentas con autenticación Passkey  
**Resultado:** Contrato compilado y listo para desplegar

### Paso 02: Contrato de Registro de Lotes

**Rama:** `02-lot-registry-contract`  
**Qué aprendes:** Implementar un contrato para almacenar metadata en la blockchain  
**Resultado:** Segundo contrato compilado

### Paso 03: Configuración Frontend

**Rama:** `03-frontend-setup`  
**Qué aprendes:** Configurar proyecto Next.js con TypeScript y dependencias de Stellar  
**Resultado:** Proyecto Next.js funcionando localmente

### Paso 04: Integración Passkeys

**Rama:** `04-passkey-integration`  
**Qué aprendes:** Implementar creación y uso de Passkeys con WebAuthn  
**Resultado:** Usuarios pueden crear Passkeys en el navegador

### Paso 05: Integración Smart Wallet

**Rama:** `05-wallet-integration`  
**Qué aprendes:** Conectar frontend con contratos Soroban y smart wallet  
**Resultado:** Frontend puede interactuar con el smart wallet

### Paso 06: Registro de Lotes

**Rama:** `06-lot-registration`  
**Qué aprendes:** Implementar formulario y lógica para registrar lotes  
**Resultado:** Usuarios pueden registrar lotes en la blockchain

### Paso 07: Consulta de Lotes

**Rama:** `07-lot-query`  
**Qué aprendes:** Implementar interfaz para consultar lotes registrados  
**Resultado:** Usuarios pueden ver lotes registrados

### Paso 08: Producción y Despliegue

**Rama:** `08-production-ready`  
**Qué aprendes:** Pulir UI/UX, manejo de errores, y desplegar en Vercel  
**Resultado:** Aplicación desplegada y accesible públicamente 🎉

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
- **`08-production-ready`** - Versión final lista para producción y despliegue

Ver [docs/BRANCH_ORGANIZATION.md](./docs/BRANCH_ORGANIZATION.md) para información detallada de las ramas.

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

Todos los tutoriales están disponibles en `docs/tutorials/`:

- [Tutorial 01: Smart Wallet Contract](./docs/tutorials/01-SMART_WALLET_CONTRACT.md)
- [Tutorial 02: Lot Registry Contract](./docs/tutorials/02-LOT_REGISTRY_CONTRACT.md)
- [Tutorial 03: Frontend Setup](./docs/tutorials/03-FRONTEND_SETUP.md)
- [Tutorial 04: Passkey Integration](./docs/tutorials/04-PASSKEY_INTEGRATION.md)
- [Tutorial 05: Wallet Integration](./docs/tutorials/05-WALLET_INTEGRATION.md)
- [Tutorial 06: Lot Registration](./docs/tutorials/06-LOT_REGISTRATION.md)
- [Tutorial 07: Lot Query](./docs/tutorials/07-LOT_QUERY.md)
- [Tutorial 08: Production Ready](./docs/tutorials/08-PRODUCTION_READY.md)

### Paso 5: Comenzar con el Primer Paso

```bash
git checkout 01-smart-wallet-contract
```

Luego sigue el tutorial: [`docs/tutorials/01-SMART_WALLET_CONTRACT.md`](./docs/tutorials/01-SMART_WALLET_CONTRACT.md)

## 📚 Documentación Completa

Toda la documentación está en el directorio `docs/`:

### Guías Principales

- **[docs/README.md](./docs/README.md)** - Índice de documentación
- **[docs/WALLET_EXPLANATION.md](./docs/WALLET_EXPLANATION.md)** - Resumen del proyecto y arquitectura
- **[docs/BRANCH_ORGANIZATION.md](./docs/BRANCH_ORGANIZATION.md)** - Guía de estructura de ramas

### Conceptos Técnicos

- **[docs/SMART_WALLET_VS_TRADITIONAL.md](./docs/SMART_WALLET_VS_TRADITIONAL.md)** - Smart wallet vs wallet tradicional
- **[docs/CONTRACT_EXPLANATION.md](./docs/CONTRACT_EXPLANATION.md)** - Explicación de contratos
- **[docs/CONTRACT_DEPLOYMENT.md](./docs/CONTRACT_DEPLOYMENT.md)** - Guía de despliegue de contratos

### Configuración

- **[docs/ENV_SETUP.md](./docs/ENV_SETUP.md)** - Configuración de entorno

### Tutoriales Paso a Paso

- **[docs/tutorials/](./docs/tutorials/)** - Todos los tutoriales detallados (01-08)

## 🏗️ Estructura del Proyecto

```
stellar-smartwallet/
├── README.md                    # Este archivo
├── docs/                        # 📚 Toda la documentación
│   ├── README.md
│   ├── tutorials/               # Tutoriales paso a paso (01-08)
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

### Ruta de Aprendizaje Recomendada

1. **Lee este README completo** - Entiende el objetivo y el proceso
2. **Explora la documentación** - Familiarízate con los conceptos
3. **Sigue las ramas en orden** - `01` → `02` → `03` → ... → `08`
4. **Lee cada tutorial** - Cada rama tiene un tutorial detallado
5. **Construye paso a paso** - No te saltes pasos
6. **Despliega tu aplicación** - Al final, tendrás algo desplegado en Vercel

### Lo que Aprenderás

- ✅ Desarrollo de contratos inteligentes en Stellar (Soroban)
- ✅ Arquitectura de smart wallet (Protocol 21)
- ✅ Integración de Passkeys (WebAuthn, secp256r1)
- ✅ Integración frontend-blockchain
- ✅ Desarrollo de MVP del mundo real
- ✅ Despliegue en producción (Vercel)

## 🔧 Para Instructores

### Antes del Workshop

1. **Desplegar contratos en testnet:**

   - Desplegar Smart Wallet contract
   - Desplegar Lot Registry contract
   - Obtener los Contract IDs

2. **Preparar información:**

   - Contract IDs para compartir con estudiantes
   - Enlace a la aplicación desplegada (si existe)
   - Variables de entorno de ejemplo

3. **Verificar ramas:**
   - Todas las ramas están actualizadas
   - Los tutoriales están completos
   - El flujo es claro

### Durante el Workshop

1. **Explicar el objetivo final** - Vercel deployment desde el inicio
2. **Mostrar contratos desplegados** - Explicar el proceso de deployment
3. **Guiar paso a paso** - Seguir las ramas en orden
4. **Enfocarse en UX al final** - Usar v0 para UI intuitiva y minimalista
5. **Ayudar con despliegue** - Asegurar que todos desplieguen en Vercel

### Flujo del Workshop

1. Los estudiantes comienzan en `starting-template`
2. Recorrer cada rama mostrando el progreso
3. Los estudiantes pueden cambiar a cualquier rama para ver esa etapa
4. La rama final (`08-production-ready`) muestra el MVP completo desplegado

## 📦 Contratos

### Contrato Smart Wallet (`contracts/wallet.rs`)

**Propósito:** Gestiona cuentas de usuario con autenticación Passkey

**Características:**

- Verificación de firma secp256r1 (Protocol 21)
- Recuperación de cuenta
- Ejecución de transacciones
- Abstracción de fees

**Estado:** ⏳ A implementar en la rama `01-smart-wallet-contract`

### Contrato de Registro de Lotes (`contracts/lot_registry.rs`)

**Propósito:** Almacena metadata de lotes de producción en la blockchain

**Características:**

- Registrar lotes de producción
- Almacenar metadata (ID de lote, fecha, calidad, etc.)
- Consultar información de lotes
- Trazabilidad inmutable

**Estado:** ⏳ A implementar en la rama `02-lot-registry-contract`

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

---

## 🎯 Próximos Pasos

**¿Listo para comenzar?**

1. Lee los tutoriales en `docs/tutorials/`
2. Cambia a la primera rama: `git checkout 01-smart-wallet-contract`
3. Sigue el tutorial: [`docs/tutorials/01-SMART_WALLET_CONTRACT.md`](./docs/tutorials/01-SMART_WALLET_CONTRACT.md)

**¿Preguntas?** Revisa la [documentación](./docs/README.md) o abre un issue.

---

**¡Buena suerte construyendo tu Smart Wallet! 🚀**
