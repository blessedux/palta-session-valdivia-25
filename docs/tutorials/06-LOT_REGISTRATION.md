# 📝 Tutorial Paso 06: Implementar Registro de Lotes

## 🎯 Objetivo

Crear la funcionalidad completa para registrar lotes de producción usando el Smart Wallet y el contrato de registro.

## 📚 Prerequisitos

- ✅ **Paso 05**: Smart Wallet integrado en frontend
- ✅ Contrato de registro de lotes desplegado

## 🛠️ Paso 1: Crear Componente de Formulario

### 1.1 Crear `components/LotRegistrationForm.tsx`

```typescript
import { useState } from 'react';
import { registerLot } from '@/utils/lotRegistry';

export default function LotRegistrationForm() {
  const [formData, setFormData] = useState({
    lotId: '',
    productionDate: '',
    batchNumber: '',
    quantity: '',
    qualityScore: '',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const txHash = await registerLot({
        lotId: formData.lotId,
        productionDate: new Date(formData.productionDate).getTime(),
        batchNumber: formData.batchNumber,
        quantity: parseInt(formData.quantity),
        qualityScore: parseInt(formData.qualityScore),
        location: formData.location,
        notes: formData.notes,
      });

      setResult(`Success! Transaction: ${txHash}`);
      // Reset form
      setFormData({
        lotId: '',
        productionDate: '',
        batchNumber: '',
        quantity: '',
        qualityScore: '',
        location: '',
        notes: '',
      });
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      <h2>Register Production Lot</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Lot ID:</label>
        <input
          type="text"
          value={formData.lotId}
          onChange={(e) => setFormData({ ...formData, lotId: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Production Date:</label>
        <input
          type="date"
          value={formData.productionDate}
          onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Batch Number:</label>
        <input
          type="text"
          value={formData.batchNumber}
          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Quantity:</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Quality Score (0-100):</label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.qualityScore}
          onChange={(e) => setFormData({ ...formData, qualityScore: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Location:</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Notes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register Lot'}
      </button>

      {result && <p style={{ marginTop: '1rem' }}>{result}</p>}
    </form>
  );
}
```

## 🚀 Siguiente Paso

**Paso 07**: Implementar consulta de lotes

```bash
git checkout 07-lot-query
```

Lee: [`07-LOT_QUERY.md`](./07-LOT_QUERY.md)

