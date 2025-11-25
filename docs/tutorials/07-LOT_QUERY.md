# 📝 Tutorial Paso 07: Implementar Consulta de Lotes

## 🎯 Objetivo

Crear la interfaz para consultar y visualizar información de lotes registrados.

## 📚 Prerequisitos

- ✅ **Paso 06**: Registro de lotes implementado

## 🛠️ Paso 1: Crear Componente de Consulta

### 1.1 Crear `components/LotQuery.tsx`

```typescript
import { useState } from 'react';
import { getLot, lotExists } from '@/utils/lotRegistry';

export default function LotQuery() {
  const [lotId, setLotId] = useState('');
  const [lotData, setLotData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    if (!lotId) return;

    setLoading(true);
    setError(null);
    setLotData(null);

    try {
      const exists = await lotExists(lotId);
      if (!exists) {
        setError('Lot not found');
        setLoading(false);
        return;
      }

      const data = await getLot(lotId);
      setLotData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2>Query Production Lot</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter Lot ID"
          value={lotId}
          onChange={(e) => setLotId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
        />
        <button onClick={handleQuery} disabled={loading}>
          {loading ? 'Querying...' : 'Query'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {lotData && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Lot Information</h3>
          <p><strong>Lot ID:</strong> {lotData.lot_id}</p>
          <p><strong>Production Date:</strong> {new Date(lotData.production_date).toLocaleDateString()}</p>
          <p><strong>Batch Number:</strong> {lotData.batch_number}</p>
          <p><strong>Quantity:</strong> {lotData.quantity}</p>
          <p><strong>Quality Score:</strong> {lotData.quality_score}</p>
          <p><strong>Location:</strong> {lotData.location}</p>
          <p><strong>Notes:</strong> {lotData.notes}</p>
          <p><strong>Registered By:</strong> {lotData.registered_by}</p>
        </div>
      )}
    </div>
  );
}
```

## 🚀 Siguiente Paso

**Paso 08**: Versión final lista para producción

```bash
git checkout 08-production-ready
```

Lee: [`08-PRODUCTION_READY.md`](./08-PRODUCTION_READY.md)

