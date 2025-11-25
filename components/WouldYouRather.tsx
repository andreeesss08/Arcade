
import React, { useState, useEffect } from 'react';
import { generateWouldYouRather } from '../services/geminiService';
import { Home, RefreshCw, Scale } from 'lucide-react';

interface WouldYouRatherProps {
  onExit: () => void;
}

const WouldYouRather: React.FC<WouldYouRatherProps> = ({ onExit }) => {
  const [options, setOptions] = useState<[string, string]>(["...", "..."]);
  const [loading, setLoading] = useState(false);

  const nextScenario = async () => {
    if (loading) return;
    setLoading(true);
    const minTime = new Promise(resolve => setTimeout(resolve, 500));
    const dataPromise = generateWouldYouRather();
    const [_, data] = await Promise.all([minTime, dataPromise]);
    setOptions(data);
    setLoading(false);
  };

  useEffect(() => {
    nextScenario();
  }, []);

  return (
    <div className="h-full max-w-md mx-auto p-4 flex flex-col relative z-10 animate-fade-in">
      <button 
        onClick={onExit}
        className="absolute top-4 left-4 p-3 bg-gray-800/80 backdrop-blur rounded-full text-gray-400 hover:text-white transition-colors z-20"
      >
        <Home size={20} />
      </button>

      <div className="flex-1 flex flex-col justify-center space-y-6 pt-10">
        <div className="text-center mb-4">
           <h1 className="text-3xl font-black text-indigo-400 uppercase tracking-tighter">Qué Preferirías</h1>
        </div>

        {/* OPTION A */}
        <div 
            onClick={nextScenario}
            className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 flex items-center justify-center text-center shadow-lg transform hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden group"
        >
             <div className="absolute top-4 left-4 text-blue-300/30 text-6xl font-black">A</div>
             {loading ? (
                 <RefreshCw className="animate-spin text-white/50" />
             ) : (
                 <h2 className="text-2xl font-black text-white leading-tight">{options[0]}</h2>
             )}
        </div>

        {/* OR BADGE */}
        <div className="flex items-center justify-center -my-8 z-10">
            <div className="bg-[#1a1b26] p-2 rounded-full">
                <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#1a1b26] shadow-xl">
                    <span className="font-black text-gray-400 text-xl">O</span>
                </div>
            </div>
        </div>

        {/* OPTION B */}
        <div 
            onClick={nextScenario}
            className="flex-1 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-6 flex items-center justify-center text-center shadow-lg transform hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden group"
        >
             <div className="absolute top-4 left-4 text-red-300/30 text-6xl font-black">B</div>
             {loading ? (
                 <RefreshCw className="animate-spin text-white/50" />
             ) : (
                 <h2 className="text-2xl font-black text-white leading-tight">{options[1]}</h2>
             )}
        </div>

        <button 
             onClick={nextScenario}
             className="w-full py-4 bg-white text-black font-black rounded-2xl text-lg shadow-xl hover:bg-gray-200 transition-colors mt-4"
        >
             SIGUIENTE DILEMA
        </button>
      </div>
    </div>
  );
};

export default WouldYouRather;
