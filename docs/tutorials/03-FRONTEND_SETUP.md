# 📝 Tutorial Paso 03: Configurar el Frontend con Next.js

## 🎯 Objetivo

En este paso, aprenderás a configurar un proyecto Next.js con TypeScript para interactuar con los contratos Soroban. Configurarás:
- Proyecto Next.js con TypeScript
- Dependencias necesarias (Stellar SDK, etc.)
- Estructura básica del proyecto
- Configuración de estilos

## 📚 Prerequisitos

Antes de comenzar, asegúrate de haber completado:
- ✅ **Paso 01**: Contrato Smart Wallet implementado
- ✅ **Paso 02**: Contrato de Registro de Lotes implementado
- ✅ Node.js instalado (versión 18 o superior)
- ✅ npm o yarn instalado

## 🛠️ Paso 1: Inicializar el Proyecto Next.js

### 1.1 Crear el proyecto

Desde el directorio raíz del repositorio, ejecuta:

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

O si prefieres crear la estructura manualmente:

```bash
mkdir -p pages components utils styles
```

### 1.2 Crear `package.json`

Crea o actualiza `package.json` con las siguientes dependencias:

```json
{
  "name": "stellar-smartwallet",
  "version": "1.0.0",
  "description": "Stellar Smart Wallet MVP - Production Lot Registry",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@stellar/stellar-sdk": "^11.2.2",
    "@stellar/stellar-sdk-contract": "^11.2.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

**Dependencias importantes:**
- `@stellar/stellar-sdk`: SDK principal de Stellar
- `@stellar/stellar-sdk-contract`: SDK para interactuar con contratos Soroban
- `next`, `react`, `react-dom`: Framework Next.js

### 1.3 Instalar dependencias

```bash
npm install
```

## 📁 Paso 2: Configurar TypeScript

### 2.1 Crear `tsconfig.json`

Crea el archivo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## ⚙️ Paso 3: Configurar Next.js

### 3.1 Crear `next.config.js`

Crea el archivo `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
```

**¿Qué hace?**
- Habilita React Strict Mode
- Configura webpack para manejar dependencias del SDK de Stellar que requieren Node.js

## 🎨 Paso 4: Configurar Estilos

### 4.1 Crear `styles/globals.css`

Crea el archivo `styles/globals.css`:

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}
```

### 4.2 Crear `pages/_app.tsx`

Crea el archivo `pages/_app.tsx`:

```typescript
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## 📄 Paso 5: Crear Página Principal

### 5.1 Crear `pages/index.tsx`

Crea el archivo `pages/index.tsx`:

```typescript
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stellar Smart Wallet - Production Lot Registry</title>
        <meta name="description" content="Smart Wallet MVP for Production Lot Registry" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>Stellar Smart Wallet</h1>
        <p>Production Lot Registry MVP</p>
        <p>Frontend setup complete! Ready for Passkey integration.</p>
      </main>
    </>
  );
}
```

## 🔧 Paso 6: Configurar Variables de Entorno

### 6.1 Crear `.env.local`

Crea el archivo `.env.local` en el directorio raíz:

```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-futurenet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://rpc-futurenet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=
```

**Nota:** Dejarás `NEXT_PUBLIC_CONTRACT_ID` vacío por ahora. Lo llenarás después de desplegar los contratos.

### 6.2 Crear `.env.example`

Crea el archivo `.env.example` como plantilla:

```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-futurenet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://rpc-futurenet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=TU_CONTRACT_ID_AQUI
```

## 📝 Paso 7: Configurar ESLint

### 7.1 Crear `.eslintrc.json`

Crea el archivo `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals"
}
```

## ✅ Paso 8: Verificar la Configuración

### 8.1 Ejecutar el servidor de desarrollo

```bash
npm run dev
```

**¿Qué esperar?**
- El servidor debería iniciar en `http://localhost:3000`
- Deberías ver la página principal con el título "Stellar Smart Wallet"

### 8.2 Checklist de verificación

Asegúrate de que tu configuración tenga:

- ✅ **Estructura de directorios**:
  - `pages/` existe
  - `components/` existe
  - `utils/` existe
  - `styles/` existe

- ✅ **Archivos de configuración**:
  - `package.json` con todas las dependencias
  - `tsconfig.json` configurado
  - `next.config.js` configurado
  - `.env.local` creado

- ✅ **Archivos básicos**:
  - `pages/_app.tsx` existe
  - `pages/index.tsx` existe
  - `styles/globals.css` existe

- ✅ **Servidor funcionando**:
  - `npm run dev` inicia sin errores
  - La página se carga en el navegador

## 🐛 Errores Comunes y Soluciones

**Error: "Module not found: Can't resolve '@stellar/stellar-sdk'"**
- **Solución**: Ejecuta `npm install` para instalar las dependencias

**Error: "Cannot find module 'next'"**
- **Solución**: Asegúrate de estar en el directorio raíz y ejecuta `npm install`

**Error: "webpack error" con dependencias de Node.js**
- **Solución**: Verifica que `next.config.js` tenga la configuración de `webpack.resolve.fallback`

## 📖 Conceptos Clave Aprendidos

En este paso aprendiste:

1. **Configuración de Next.js**: Cómo inicializar y configurar un proyecto Next.js con TypeScript
2. **Dependencias de Stellar**: Qué paquetes necesitas para interactuar con Stellar y Soroban
3. **Variables de entorno**: Cómo configurar variables de entorno para diferentes redes
4. **Estructura del proyecto**: Organización de archivos en un proyecto Next.js

## 🚀 Siguiente Paso

Una vez que hayas completado este paso y verificado que el servidor funciona correctamente, estás listo para:

**Paso 04**: Integrar Passkeys para autenticación

```bash
git checkout 04-passkey-integration
```

Lee el tutorial: [`04-PASSKEY_INTEGRATION.md`](./04-PASSKEY_INTEGRATION.md)

## 📚 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**¿Problemas?** Revisa los errores comunes arriba o consulta la documentación de Next.js.

