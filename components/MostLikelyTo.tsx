
import React, { useState } from 'react';
import { generateMostLikelyPhrase } from '../services/geminiService';
import { Home, Pointer, RefreshCw } from 'lucide-react';

interface MostLikelyToProps {
  onExit: () => void;
}

const MostLikelyTo: React.FC<MostLikelyToProps> = ({ onExit }) => {
  const [currentPhrase, setCurrentPhrase] = useState<string>("Toca para empezar...");
  const [loading, setLoading] = useState(false);

  const getPhrase = async () => {
    if (loading) return;
    setLoading(true);
    const minTime = new Promise(resolve => setTimeout(resolve, 400));
    const phrasePromise = generateMostLikelyPhrase();
    const [_, phrase] = await Promise.all([minTime, phrasePromise]);
    setCurrentPhrase(phrase);
    setLoading(false);
  };

  return (
    <div className="h-full max-w-md mx-auto p-6 flex flex-col relative z-10 animate-fade-in">
      <button 
        onClick={onExit}
        className="absolute top-4 left-4 p-3 bg-gray-800/80 backdrop-blur rounded-full text-gray-400 hover:text-white transition-colors z-20"
      >
        <Home size={20} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 mt-8">
        <div className="text-center space-y-2">
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-tighter drop-shadow-sm leading-tight">Quién es más probable</h1>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-800/50 py-1 px-3 rounded-full inline-block">A la de 3, señalad todos a uno</p>
        </div>

        {/* Card */}
        <div 
          onClick={getPhrase}
          className="w-full aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 flex items-center justify-center relative shadow-2xl cursor-pointer active:scale-95 transition-transform duration-200 group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-50 rounded-t-3xl" />
          
          <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
             <Pointer size={32} className="text-yellow-400" />
          </div>
          
          <div className="text-center">
             {loading ? (
                <div className="flex flex-col items-center space-y-3">
                   <RefreshCw className="animate-spin text-yellow-500" size={32} />
                   <span className="text-xs text-gray-500 font-mono">PENSANDO...</span>
                </div>
             ) : (
                <p className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md select-none">
                  {currentPhrase}
                </p>
             )}
          </div>
        </div>

        <button 
          onClick={getPhrase}
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-white text-black font-black text-xl shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 relative overflow-hidden"
        >
           <Pointer size={24} />
           <span>SIGUIENTE</span>
        </button>
      </div>
    </div>
  );
};

export default MostLikelyTo;
