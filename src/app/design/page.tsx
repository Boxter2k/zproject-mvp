"use client";

import { useState } from "react";

export default function ZProjectControl() {
  const [logoSize, setLogoSize] = useState(12);   // tamaño de ZProject
  const [welcomeSize, setWelcomeSize] = useState(2.2); // tamaño del texto de bienvenida
  const [glow, setGlow] = useState(1.0);          // intensidad del glow
  const [offsetX, setOffsetX] = useState(-5);     // posición X de ZProject

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Panel lateral de control */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-black/80 border-r border-green-700/40 p-6 z-50">
        <h2 className="text-green-300 text-xl font-bold mb-6">🎛 ZProject Control</h2>

        <div className="space-y-6">
          {/* Tamaño ZProject */}
          <div>
            <label className="block text-sm mb-1">Tamaño ZProject: {logoSize}rem</label>
            <input
              type="range"
              min={6}
              max={20}
              step={0.5}
              value={logoSize}
              onChange={e => setLogoSize(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          {/* Posición X */}
          <div>
            <label className="block text-sm mb-1">Posición X: {offsetX}vw</label>
            <input
              type="range"
              min={-20}
              max={20}
              step={1}
              value={offsetX}
              onChange={e => setOffsetX(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          {/* Tamaño texto bienvenida */}
          <div>
            <label className="block text-sm mb-1">Texto bienvenida: {welcomeSize}rem</label>
            <input
              type="range"
              min={1}
              max={4}
              step={0.1}
              value={welcomeSize}
              onChange={e => setWelcomeSize(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          {/* Intensidad glow */}
          <div>
            <label className="block text-sm mb-1">Glow: {glow.toFixed(2)}x</label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={glow}
              onChange={e => setGlow(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>
        </div>
      </aside>

      {/* Vista previa */}
      <main className="ml-72 flex items-center justify-center min-h-screen relative">
        <div className="flex gap-20 items-center">
          {/* ZProject enorme */}
          <h1
            className="font-extrabold text-green-400 select-none"
            style={{
              fontSize: `${logoSize}rem`,
              transform: `translateX(${offsetX}vw)`,
              textShadow: `0 0 ${12 * glow}px rgba(34,197,94,0.8),
                           0 0 ${28 * glow}px rgba(34,197,94,0.45)`
            }}
          >
            ZProject
          </h1>

          {/* Bloque derecho */}
          <div className="max-w-md space-y-6">
            <h2
              style={{
                fontSize: `${welcomeSize}rem`,
                textShadow: `0 0 ${6 * glow}px rgba(34,197,94,0.6)`
              }}
              className="font-semibold"
            >
              Bienvenido a la comunidad creciente de artistas
            </h2>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-green-500 text-black font-bold hover:bg-green-400 transition-colors">
                Unirse a la comunidad
              </button>
              <button className="px-6 py-3 rounded-lg border border-green-500 text-green-400 hover:bg-green-900/40 transition-colors">
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}