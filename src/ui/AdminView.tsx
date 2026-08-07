import React, { useState } from 'react';

interface AdminViewProps {
  onCreateProcess: (config: {
    procesoId: string;
    ingresoMaximo: bigint;
    promedioMinimo: bigint;
    edadMinima: bigint;
    edadMaxima: bigint;
  }) => Promise<void>;
}

export const AdminView: React.FC<AdminViewProps> = ({ onCreateProcess }) => {
  const [procesoId, setProcesoId] = useState('');
  const [ingresoMaximo, setIngresoMaximo] = useState('');
  const [promedioMinimo, setPromedioMinimo] = useState('');
  const [edadMinima, setEdadMinima] = useState('18');
  const [edadMaxima, setEdadMaxima] = useState('25');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onCreateProcess({
        procesoId,
        ingresoMaximo: BigInt(ingresoMaximo),
        promedioMinimo: BigInt(promedioMinimo),
        edadMinima: BigInt(edadMinima),
        edadMaxima: BigInt(edadMaxima),
      });
      alert('Proceso de selección creado con éxito.');
    } catch (error) {
      console.error(error);
      alert('Error al crear el proceso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Panel Admin: Crear Proceso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID del Proceso</label>
          <input
            type="text"
            required
            placeholder="ej: beca-2026"
            value={procesoId}
            onChange={(e) => setProcesoId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Límite de ingresos</label>
          <input
            type="number"
            required
            placeholder="ej: 1500000"
            value={ingresoMaximo}
            onChange={(e) => setIngresoMaximo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Promedio (nota) mínimo</label>
          <input
            type="number"
            required
            placeholder="ej: 75"
            value={promedioMinimo}
            onChange={(e) => setPromedioMinimo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Edad mínima</label>
            <input
              type="number"
              required
              value={edadMinima}
              onChange={(e) => setEdadMinima(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Edad máxima</label>
            <input
              type="number"
              required
              value={edadMaxima}
              onChange={(e) => setEdadMaxima(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Guardar Parámetros'}
        </button>
      </form>
    </div>
  );
};