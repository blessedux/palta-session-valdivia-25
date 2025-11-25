# Configuración de Variables de Entorno

Crea un archivo `.env.local` en el directorio raíz con las siguientes variables:

```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-futurenet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://rpc-futurenet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=TU_CONTRACT_ID_AQUI
```

**Nota:** Reemplaza `TU_CONTRACT_ID_AQUI` con el ID del contrato real después de desplegar el contrato Soroban.

Para el despliegue en Vercel, agrega estas mismas variables en:
- Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
