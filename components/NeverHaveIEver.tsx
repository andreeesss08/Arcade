
import React, { useState } from 'react';
import { generateNeverHaveIEverPhrase } from '../services/geminiService';
import { Home, Beer, Sparkles, Flame, PartyPopper, RefreshCw } from 'lucide-react';

interface NeverHaveIEverProps {
  onExit: () => void;
}

type Mode = 'soft' | 'party' | 'spicy';

const NeverHaveIEver: React.FC<NeverHaveIEverProps> = ({ onExit }) => {
  const [currentPhrase, setCurrentPhrase] = useState<string>("Toca el botón para empezar...");
  const [mode, setMode] = useState<Mode>('party');
  const [loading, setLoading] = useState(false);

  const getPhrase = async () => {
    if (loading) return;
    setLoading(true);
    // Add artificial delay for UX if API is too fast, or to show interaction
    const minTime = new Promise(resolve => setTimeout(resolve, 400));
    const phrasePromise = generateNeverHaveIEverPhrase(mode);
    
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
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 uppercase tracking-tighter drop-shadow-sm">Yo Nunca</h1>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-800/50 py-1 px-3 rounded-full inline-block">Si lo has hecho, bebes</p>
        </div>

        {/* Card */}
        <div 
          onClick={getPhrase}
          className="w-full aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 flex items-center justify-center relative shadow-2xl cursor-pointer active:scale-95 transition-transform duration-200 group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-50 rounded-t-3xl" />
          
          <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
             {mode === 'soft' && <Sparkles size={32} className="text-blue-400" />}
             {mode === 'party' && <PartyPopper size={32} className="text-yellow-400" />}
             {mode === 'spicy' && <Flame size={32} className="text-red-500" />}
          </div>
          
          <div className="text-center">
             {loading ? (
                <div className="flex flex-col items-center space-y-3">
                   <RefreshCw className="animate-spin text-pink-500" size={32} />
                   <span className="text-xs text-gray-500 font-mono">GENERANDO...</span>
                </div>
             ) : (
                <p className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md select-none">
                  {currentPhrase}
                </p>
             )}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
          <div className="flex bg-gray-900/50 p-1.5 rounded-2xl border border-gray-700/50">
             <button onClick={() => setMode('soft')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${mode === 'soft' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Soft</button>
             <button onClick={() => setMode('party')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${mode === 'party' ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Fiesta</button>
             <button onClick={() => setMode('spicy')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${mode === 'spicy' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Picante</button>
          </div>

          <button 
            onClick={getPhrase}
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-white text-black font-black text-xl shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-all duration-1000" />
             <Beer size={24} />
             <span>SIGUIENTE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeverHaveIEver;
