
import React, { useState, useEffect, useRef } from 'react';
import { generateBombCategory } from '../services/geminiService';
import { Home, Bomb, Play, RotateCcw } from 'lucide-react';

interface WordBombProps {
  onExit: () => void;
}

const WordBomb: React.FC<WordBombProps> = ({ onExit }) => {
  const [category, setCategory] = useState<string>("...");
  const [isPlaying, setIsPlaying] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<any>(null);

  const startGame = async () => {
    if (loading) return;
    setLoading(true);
    setExploded(false);
    
    // Get category first
    const newCat = await generateBombCategory();
    setCategory(newCat);
    setLoading(false);
    setIsPlaying(true);

    // Random duration between 20s and 60s
    const duration = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
    
    timerRef.current = setTimeout(() => {
      explode();
    }, duration);
  };

  const explode = () => {
    setIsPlaying(false);
    setExploded(true);
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
  };

  const stopGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCategory("...");
    setExploded(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`h-full max-w-md mx-auto p-6 flex flex-col relative z-10 animate-fade-in transition-colors duration-200 ${exploded ? 'bg-red-900/40' : ''}`}>
      <button 
        onClick={() => { stopGame(); onExit(); }}
        className="absolute top-4 left-4 p-3 bg-gray-800/80 backdrop-blur rounded-full text-gray-400 hover:text-white transition-colors z-20"
      >
        <Home size={20} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 mt-8">
        
        {/* BOMB VISUAL */}
        <div className={`relative transition-all duration-300 transform ${isPlaying ? 'scale-110' : 'scale-100'}`}>
          <div className={`absolute inset-0 bg-green-500 rounded-full blur-[60px] opacity-20 transition-all ${isPlaying ? 'animate-pulse bg-red-500 opacity-40' : ''}`} />
          {exploded ? (
             <div className="text-red-500 animate-bounce">
                <Bomb size={180} />
             </div>
          ) : (
             <div className={`text-gray-200 ${isPlaying ? 'animate-wiggle' : ''}`}>
                <Bomb size={140} className={isPlaying ? 'text-red-400' : 'text-green-400'} />
             </div>
          )}
        </div>

        <div className="text-center space-y-4 w-full">
           {exploded ? (
             <h2 className="text-5xl font-black text-red-500 uppercase tracking-tighter animate-pulse">
               ¡EXPLOSIÓN!
             </h2>
           ) : (
             <>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">CATEGORÍA</p>
                <div className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl backdrop-blur-md min-h-[120px] flex items-center justify-center">
                    {loading ? (
                        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                    ) : (
                        <h2 className="text-3xl font-black text-white leading-tight break-words">
                        {category}
                        </h2>
                    )}
                </div>
             </>
           )}
        </div>

        {/* Controls */}
        <div className="w-full pt-8">
            {!isPlaying && !exploded && (
                <button 
                onClick={startGame}
                disabled={loading}
                className="w-full py-6 rounded-2xl bg-green-500 text-black font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                >
                <Play size={28} fill="currentColor" />
                <span>EMPEZAR RONDA</span>
                </button>
            )}

            {isPlaying && (
                 <div className="text-center">
                    <p className="text-red-400 font-mono text-xl animate-pulse font-bold">TIC... TAC...</p>
                    <p className="text-gray-500 text-xs mt-2">Di una palabra y pasa el móvil</p>
                 </div>
            )}

            {exploded && (
                <button 
                onClick={startGame}
                className="w-full py-6 rounded-2xl bg-white text-black font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                >
                <RotateCcw size={28} />
                <span>OTRA RONDA</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default WordBomb;
