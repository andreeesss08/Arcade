
import React, { useState, useEffect } from 'react';
import { generateThreeInFiveCategory } from '../services/geminiService';
import { Home, Timer, Play, RefreshCw, XCircle } from 'lucide-react';

interface ThreeInFiveProps {
  onExit: () => void;
}

const ThreeInFive: React.FC<ThreeInFiveProps> = ({ onExit }) => {
  const [category, setCategory] = useState("...");
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'failed'>('idle');
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            setGameState('failed');
            if(navigator.vibrate) navigator.vibrate(500);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const loadCategory = async () => {
    setLoading(true);
    const cat = await generateThreeInFiveCategory();
    setCategory(cat);
    setLoading(false);
    setGameState('idle');
    setTimeLeft(5.0);
  };

  const startGame = () => {
    if (gameState === 'idle') loadCategory();
    else {
        setTimeLeft(5.0);
        setGameState('playing');
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  return (
    <div className={`h-full max-w-md mx-auto p-6 flex flex-col relative z-10 animate-fade-in transition-colors duration-200 ${gameState === 'failed' ? 'bg-red-900/20' : ''}`}>
      <button 
        onClick={onExit}
        className="absolute top-4 left-4 p-3 bg-gray-800/80 backdrop-blur rounded-full text-gray-400 hover:text-white transition-colors z-20"
      >
        <Home size={20} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        <div className="text-center">
           <h1 className="text-5xl font-black text-yellow-500 italic tracking-tighter">3 EN 5</h1>
           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Di 3 cosas en 5 segundos</p>
        </div>

        {/* CATEGORY CARD */}
        <div className="w-full bg-gray-800 border-2 border-yellow-500/30 p-8 rounded-3xl min-h-[200px] flex items-center justify-center text-center relative overflow-hidden">
           {loading ? (
             <RefreshCw className="animate-spin text-yellow-500" size={40} />
           ) : (
             <h2 className="text-3xl font-black text-white leading-tight">{category}</h2>
           )}
           
           {gameState === 'failed' && (
             <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center animate-fade-in">
                <XCircle size={60} className="text-red-500 mb-2" />
                <p className="text-2xl font-black text-white">¡TIEMPO!</p>
             </div>
           )}
        </div>

        {/* TIMER */}
        <div className="text-center">
           <div className={`text-6xl font-mono font-black ${timeLeft < 2 ? 'text-red-500 scale-110' : 'text-white'} transition-all`}>
             {timeLeft.toFixed(1)}s
           </div>
        </div>

        {/* CONTROLS */}
        <div className="w-full space-y-4">
           {gameState === 'idle' || gameState === 'failed' ? (
             <button 
               onClick={() => { setGameState('playing'); setTimeLeft(5.0); }}
               className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center space-x-2"
             >
               <Play size={28} fill="currentColor" />
               <span>{gameState === 'failed' ? 'REINTENTAR' : 'EMPEZAR'}</span>
             </button>
           ) : (
             <button disabled className="w-full py-5 bg-gray-700 text-gray-500 font-bold rounded-2xl text-xl animate-pulse">
               ¡RÁPIDO!
             </button>
           )}

           <button 
             onClick={loadCategory}
             className="w-full py-4 bg-gray-800 text-white font-bold rounded-2xl text-lg hover:bg-gray-700 transition-colors"
           >
             Siguiente Tarjeta
           </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeInFive;
