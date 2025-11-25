# 🌿 Guía de Organización de Ramas

## Resumen

Este repositorio usa ramas para representar diferentes etapas de desarrollo. Los estudiantes pueden cambiar a diferentes ramas para ver la progresión completa desde la configuración inicial hasta un MVP listo para producción.

## Estructura de Ramas

### `starting-template` (Rama Actual)

**Propósito:** Paquete inicial con solo documentación y contratos

**Contenido:**

- ✅ README.md
- ✅ docs/ (toda la documentación)
- ✅ contracts/ (contratos smart wallet y registro de lotes)
- ❌ Sin código frontend
- ❌ Sin implementación

**Caso de Uso:** Punto de partida para el workshop

---

### `01-smart-wallet-contract`

**Propósito:** Implementación del contrato smart wallet

**Agrega:**

- ✅ Implementación completa de `contracts/wallet.rs`
- ✅ Verificación de firma secp256r1
- ✅ Funciones de gestión de cuenta
- ✅ Mecanismos de recuperación

**Caso de Uso:** Ver cómo funciona el contrato smart wallet

---

### `02-lot-registry-contract`

**Propósito:** Contrato de registro de lotes de producción

**Agrega:**

- ✅ Implementación completa de `contracts/lot_registry.rs`
- ✅ Función de registro de lotes
- ✅ Funciones de consulta de lotes
- ✅ Almacenamiento de metadata

**Caso de Uso:** Ver cómo funciona el contrato de registro de lotes

---

### `03-frontend-setup`

**Propósito:** Configuración del proyecto Next.js

**Agrega:**

- ✅ package.json con dependencias
- ✅ Configuración de Next.js
- ✅ Configuración de TypeScript
- ✅ Estructura básica del proyecto
- ✅ Configuración de estilos

**Caso de Uso:** Ver configuración inicial del frontend

---

### `04-passkey-integration`

**Propósito:** Autenticación Passkey

**Agrega:**

- ✅ `utils/passkeys.ts` con integración WebAuthn
- ✅ Creación de Passkeys
- ✅ Firma secp256r1
- ✅ Gestión de credenciales

**Caso de Uso:** Ver cómo se integran los Passkeys

---

### `05-wallet-integration`

**Propósito:** Integración del smart wallet en frontend

**Agrega:**

- ✅ `utils/stellar.ts` con interacción del contrato wallet
- ✅ Helpers de despliegue de wallet
- ✅ Firma de transacciones con Passkeys
- ✅ Verificación de contratos

**Caso de Uso:** Ver cómo el frontend interactúa con el smart wallet

---

### `06-lot-registration`

**Propósito:** Funcionalidad de registro de lotes

**Agrega:**

- ✅ Componente de formulario de registro de lotes
- ✅ Integración con contrato de registro de lotes
- ✅ Validación de formularios
- ✅ Manejo de transacciones

**Caso de Uso:** Ver cómo funciona el registro de lotes

---

### `07-lot-query`

**Propósito:** Interfaz de consulta de lotes

**Agrega:**

- ✅ Componente de consulta de lotes
- ✅ Mostrar metadata de lotes
- ✅ Funcionalidad de búsqueda
- ✅ Manejo de errores

**Caso de Uso:** Ver cómo consultar información de lotes

---

### `08-production-ready`

**Propósito:** Versión final lista para producción

**Agrega:**

- ✅ Todas las características completas
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Pulido de UI
- ✅ Configuración de despliegue
- ✅ Actualizaciones de documentación

**Caso de Uso:** Ver el MVP completo y listo para producción

---

## Cómo Usar

### Para Estudiantes

1. **Comienza aquí:**

   ```bash
   git checkout starting-template
   ```

2. **Ve el progreso paso a paso:**

   ```bash
   git checkout 01-smart-wallet-contract
   git checkout 02-lot-registry-contract
   # ... continuar a través de todas las ramas
   ```

3. **Compara ramas:**
   ```bash
   git diff starting-template..01-smart-wallet-contract
   ```

### Para Instructores

1. **Crear ramas en orden:**

   ```bash
   git checkout -b 01-smart-wallet-contract
   # Hacer cambios, commit
   git checkout -b 02-lot-registry-contract
   # Continuar...
   ```

2. **Subir todas las ramas:**
   ```bash
   git push origin --all
   ```

## Convención de Nombres de Ramas

- `starting-template` - Estado inicial
- `01-*` hasta `08-*` - Etapas de desarrollo
- Usar nombres descriptivos después del número
- Mantener ramas enfocadas en una característica/etapa

## Mejores Prácticas

1. **Cada rama debe ser completa** - Debe compilar/ejecutar por sí sola
2. **Mensajes de commit claros** - Explicar qué se agregó
3. **Actualizar README** - Documentar qué hay de nuevo en cada rama
4. **Probar cada etapa** - Asegurar que funciona antes de pasar a la siguiente rama

## Estado Actual de las Ramas

- ✅ `starting-template` - Listo (README, docs, contracts)
- ⏳ `01-smart-wallet-contract` - Por crear
- ⏳ `02-lot-registry-contract` - Por crear
- ⏳ `03-frontend-setup` - Por crear
- ⏳ `04-passkey-integration` - Por crear
- ⏳ `05-wallet-integration` - Por crear
- ⏳ `06-lot-registration` - Por crear
- ⏳ `07-lot-query` - Por crear
- ⏳ `08-production-ready` - Por crear

---

**Próximo Paso:** Limpiar la rama `starting-template` para que solo tenga README, docs y contracts.
