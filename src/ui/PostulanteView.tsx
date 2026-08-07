import React, { useState } from 'react';

interface PostulanteViewProps {
  onPostular: (datos: {
    procesoId: string;
    ingreso: bigint;
    promedio: bigint;
    edad: bigint;
    secreto: Uint8Array;
  }) => Promise<void>;
}

export const PostulanteView: React.FC<PostulanteViewProps> = ({ onPostular }) => {
  const [procesoId, setProcesoId] = useState('');
  const [ingreso, setIngreso] = useState('');
  const [promedio, setPromedio] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      // Clave aleatoria para anonimizar la postulación en la prueba ZK
      const secreto = crypto.getRandomValues(new Uint8Array(32));

      await onPostular({
        procesoId,
        ingreso: BigInt(ingreso),
        promedio: BigInt(promedio),
        edad: BigInt(edad),
        secreto,
      });

      setStatusMessage({
        text: '¡Postulación procesada! La prueba ZK se validó sin revelar tus datos.',
        error: false,
      });
    } catch (err: any) {
      setStatusMessage({
        text: err?.message || 'Error al procesar la postulación.',
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Postulación Privada (ZK)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Tus datos personales permanecen en tu navegador. Solo se envía una prueba matemática de elegibilidad.
      </p>

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
          <label className="block text-sm font-medium text-gray-700">Ingreso familiar mensual</label>
          <input
            type="number"
            required
            placeholder="ej: 1200000"
            value={ingreso}
            onChange={(e) => setIngreso(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Promedio (nota)</label>
          <input
            type="number"
            required
            placeholder="ej: 85"
            value={promedio}
            onChange={(e) => setPromedio(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Edad</label>
          <input
            type="number"
            required
            placeholder="ej: 21"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Generando prueba ZK...' : 'Postularse en privado'}
        </button>
      </form>

      {statusMessage && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            statusMessage.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {statusMessage.text}
        </div>
      )}
    </div>
  );
};
