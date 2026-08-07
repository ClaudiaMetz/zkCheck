import React, { useState } from 'react';
import { AdminView } from './ui/AdminView.js';
import { PostulanteView } from './ui/PostulanteView.js';

export const App: React.FC = () => {
  const [tab, setTab] = useState<'postulante' | 'admin'>('postulante');

  // Conexión mock temporal a la lógica del contrato
  const handleCreateProcess = async (params: any) => {
    console.log('Creando proceso:', params);
  };

  const handlePostular = async (params: any) => {
    console.log('Postulando con datos ZK:', params);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="max-w-md mx-auto mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">zkCheck</h1>
        <p className="text-sm text-gray-600 mt-1">Motor de elegibilidad privada en Midnight</p>
        
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setTab('postulante')}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              tab === 'postulante' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border'
            }`}
          >
            Postulante
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              tab === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'
            }`}
          >
            Administrador
          </button>
        </div>
      </header>

      <main>
        {tab === 'postulante' ? (
          <PostulanteView onPostular={handlePostular} />
        ) : (
          <AdminView onCreateProcess={handleCreateProcess} />
        )}
      </main>
    </div>
  );
};

export default App;
