
import React from 'react';
import { AppView } from '../types';
import { Ghost, Beer, Pointer, Bomb, MessageSquare, Timer, Scale } from 'lucide-react';

interface GameHubProps {
  onSelectGame: (view: AppView) => void;
}

const GameHub: React.FC<GameHubProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 animate-fade-in relative z-10 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-2 py-6">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-white to-gray-400 drop-shadow-xl tracking-tighter">
          ARCADE
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Selecciona tu juego</p>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-8">
        {/* IMPOSTOR */}
        <button
          onClick={() => onSelectGame('impostor')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <Ghost size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400">
                <Ghost size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">El Impostor</h2>
                <p className="text-gray-400 text-xs">Deducción social y engaño.</p>
              </div>
            </div>
          </div>
        </button>

        {/* CONFESIONES */}
        <button
          onClick={() => onSelectGame('confessions')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <MessageSquare size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-500/20 p-3 rounded-xl text-cyan-400">
                <MessageSquare size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Confesiones</h2>
                <p className="text-gray-400 text-xs">Escribe y adivina quién lo dijo.</p>
              </div>
            </div>
          </div>
        </button>

        {/* 3 EN 5 */}
        <button
          onClick={() => onSelectGame('three_in_five')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <Timer size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400">
                <Timer size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">3 en 5</h2>
                <p className="text-gray-400 text-xs">Velocidad y presión.</p>
              </div>
            </div>
          </div>
        </button>

         {/* WORD BOMB */}
         <button
          onClick={() => onSelectGame('word_bomb')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-green-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <Bomb size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-xl text-green-400">
                <Bomb size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Palabra Bomba</h2>
                <p className="text-gray-400 text-xs">Pásala antes de que explote.</p>
              </div>
            </div>
          </div>
        </button>

        {/* WOULD YOU RATHER */}
        <button
          onClick={() => onSelectGame('would_you_rather')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-indigo-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <Scale size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
                <Scale size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Qué Preferirías</h2>
                <p className="text-gray-400 text-xs">Dilemas imposibles.</p>
              </div>
            </div>
          </div>
        </button>

        {/* MOST LIKELY TO */}
        <button
          onClick={() => onSelectGame('most_likely')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-pink-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-red-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <Pointer size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-500/20 p-3 rounded-xl text-pink-400">
                <Pointer size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Quién es más...</h2>
                <p className="text-gray-400 text-xs">Señala al culpable.</p>
              </div>
            </div>
          </div>
        </button>

         {/* NEVER HAVE I EVER */}
         <button
          onClick={() => onSelectGame('never_have_i_ever')}
          className="group relative overflow-hidden rounded-3xl bg-gray-800 border-2 border-gray-700 hover:border-rose-500 transition-all duration-300 text-left h-32 shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-orange-600/20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500">
             <Beer size={80} />
          </div>
          <div className="relative p-5 h-full flex flex-col justify-center z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-rose-500/20 p-3 rounded-xl text-rose-400">
                <Beer size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Yo Nunca</h2>
                <p className="text-gray-400 text-xs">Bebe si lo has hecho.</p>
              </div>
            </div>
          </div>
        </button>
      </div>
      
      <div className="text-center text-gray-600 text-[10px] pb-4">
        POWERED BY GEMINI 2.5
      </div>
    </div>
  );
};

export default GameHub;
