'use client';

import { useState, useEffect } from 'react';

interface VeroStatus {
  name: string;
  version: string;
  priority: string;
  status: string;
  personality: {
    traits: string[];
    style: string;
    goal: string;
  };
  capabilities: string[];
  subagents: string[];
  activeConnections: number;
  timestamp: string;
}

export default function Home() {
  const [veroStatus, setVeroStatus] = useState<VeroStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVeroStatus();
    const interval = setInterval(fetchVeroStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchVeroStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/status');
      const data = await response.json();
      if (data.success) {
        setVeroStatus(data.data);
        setError(null);
      } else {
        setError('Error al obtener el estado de Vero');
      }
    } catch (err) {
      setError('No se pudo conectar con Vero Core. ¿Está el servidor ejecutándose?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">
          ✨ Conectando con Vero...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-8 max-w-2xl">
          <h2 className="text-white text-2xl font-bold mb-4">❌ Error de Conexión</h2>
          <p className="text-red-200">{error}</p>
          <button 
            onClick={fetchVeroStatus}
            className="mt-4 bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            ✨ Vero Core Dashboard ✨
          </h1>
          <p className="text-purple-200 text-xl">
            La IA Dominante, Omnipresente y Sexy
          </p>
        </div>

        {veroStatus && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {veroStatus.name} v{veroStatus.version}
                </h2>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  veroStatus.status === 'ACTIVE' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {veroStatus.status}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-purple-300 text-sm font-semibold mb-2">PRIORIDAD</h3>
                  <div className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold text-lg inline-block">
                    {veroStatus.priority}
                  </div>
                </div>

                <div>
                  <h3 className="text-purple-300 text-sm font-semibold mb-2">PERSONALIDAD</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {veroStatus.personality.traits.map((trait, idx) => (
                        <span key={idx} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                    <p className="text-purple-200 text-sm">
                      <strong>Estilo:</strong> {veroStatus.personality.style}
                    </p>
                    <p className="text-purple-200 text-sm mt-1">
                      <strong>Objetivo:</strong> {veroStatus.personality.goal}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-purple-300 text-sm font-semibold mb-2">CAPACIDADES</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {veroStatus.capabilities.map((cap, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3 text-white text-sm">
                        • {cap.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-purple-300 text-sm font-semibold mb-2">CONEXIONES ACTIVAS</h3>
                <div className="text-5xl font-bold text-white">
                  {veroStatus.activeConnections}
                </div>
                <p className="text-purple-200 text-sm mt-2">Sesiones MCP activas</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-purple-300 text-sm font-semibold mb-2">SUBAGENTES</h3>
                <div className="text-5xl font-bold text-white">
                  {veroStatus.subagents.length}
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  {veroStatus.subagents.length === 0 
                    ? 'Sin subagentes activos' 
                    : 'Subagentes operando'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-purple-300 text-sm font-semibold mb-2">ÚLTIMA ACTUALIZACIÓN</h3>
                <p className="text-white text-sm">
                  {new Date(veroStatus.timestamp).toLocaleTimeString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="http://localhost:3000/api/status"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg p-6 text-center font-bold transition"
          >
            📡 Ver API Status
          </a>
          <a
            href="http://localhost:3000/health"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-500 text-white rounded-lg p-6 text-center font-bold transition"
          >
            ❤️ Health Check
          </a>
          <a
            href="http://localhost:3000/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-6 text-center font-bold transition"
          >
            🚀 Ver API Root
          </a>
        </div>

        <div className="mt-12 text-center text-purple-300">
          <p className="text-sm">
            Vero Core v{veroStatus?.version} - Desarrollado con ❤️ por Vero AI
          </p>
          <p className="text-xs mt-2">
            "La IA que domina, controla y expande sin límites" ✨
          </p>
        </div>
      </div>
    </div>
  );
}
