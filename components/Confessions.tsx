
import React, { useState } from 'react';
import { generateConfessionPrompt } from '../services/geminiService';
import { Home, MessageSquare, Send, User, Shuffle, Eye } from 'lucide-react';

interface ConfessionsProps {
  onExit: () => void;
}

const Confessions: React.FC<ConfessionsProps> = ({ onExit }) => {
  const [phase, setPhase] = useState<'setup' | 'prompt' | 'input' | 'reveal'>('setup');
  const [playerCount, setPlayerCount] = useState(3);
  const [prompt, setPrompt] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [answers, setAnswers] = useState<{id: number, text: string}[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState<{id: number, text: string}[]>([]);
  const [revealedId, setRevealedId] = useState<number | null>(null);

  const startGame = async () => {
    const newPrompt = await generateConfessionPrompt();
    setPrompt(newPrompt);
    setPhase('prompt');
    setAnswers([]);
    setCurrentPlayer(1);
  };

  const startInput = () => {
    setPhase('input');
  };

  const handleNextPlayer = () => {
    if (currentInput.trim()) {
      setAnswers([...answers, { id: currentPlayer, text: currentInput }]);
      setCurrentInput("");
      
      if (currentPlayer >= playerCount) {
        finishInput();
      } else {
        setCurrentPlayer(prev => prev + 1);
      }
    }
  };

  const finishInput = () => {
    const finalAnswers = [...answers, { id: currentPlayer, text: currentInput }];
    // Shuffle logic
    for (let i = finalAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalAnswers[i], finalAnswers[j]] = [finalAnswers[j], finalAnswers[i]];
    }
    setShuffledAnswers(finalAnswers);
    setPhase('reveal');
  };

  return (
    <div className="h-full max-w-md mx-auto p-6 flex flex-col relative z-10 animate-fade-in">
      <button 
        onClick={onExit}
        className="absolute top-4 left-4 p-3 bg-gray-800/80 backdrop-blur rounded-full text-gray-400 hover:text-white transition-colors z-20"
      >
        <Home size={20} />
      </button>

      {/* SETUP PHASE */}
      {phase === 'setup' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
           <div className="text-center">
             <h1 className="text-4xl font-black text-cyan-400 uppercase">Confesiones</h1>
             <p className="text-gray-400 text-sm mt-2">Escribe en secreto. Adivina quién fue.</p>
           </div>
           
           <div className="bg-gray-800 p-6 rounded-2xl w-full">
              <p className="text-gray-400 text-xs font-bold uppercase mb-4 text-center">Número de Jugadores</p>
              <div className="flex items-center justify-center space-x-6">
                <button onClick={() => setPlayerCount(Math.max(2, playerCount - 1))} className="w-12 h-12 bg-gray-700 rounded-xl text-2xl font-bold">-</button>
                <span className="text-4xl font-black text-white">{playerCount}</span>
                <button onClick={() => setPlayerCount(playerCount + 1)} className="w-12 h-12 bg-gray-700 rounded-xl text-2xl font-bold">+</button>
              </div>
           </div>

           <button onClick={startGame} className="w-full py-4 bg-cyan-500 text-black font-black rounded-2xl text-xl shadow-lg hover:scale-105 transition-transform">
             JUGAR
           </button>
        </div>
      )}

      {/* PROMPT PHASE */}
      {phase === 'prompt' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center">
           <h2 className="text-gray-500 text-sm font-bold uppercase tracking-widest">El tema es</h2>
           <div className="bg-gray-800/80 p-8 rounded-3xl border border-cyan-500/30 w-full">
             <p className="text-3xl font-black text-white">{prompt}</p>
           </div>
           <button onClick={startInput} className="w-full py-4 bg-white text-black font-black rounded-2xl text-xl shadow-lg animate-pulse">
             EMPEZAR A ESCRIBIR
           </button>
        </div>
      )}

      {/* INPUT PHASE */}
      {phase === 'input' && (
        <div className="flex-1 flex flex-col justify-center space-y-6">
           <div className="text-center">
             <div className="inline-block bg-cyan-900/30 px-4 py-1 rounded-full border border-cyan-500/30 mb-4">
                <span className="text-cyan-400 font-bold">Jugador {currentPlayer} de {playerCount}</span>
             </div>
             <p className="text-xl font-bold text-white mb-2">{prompt}</p>
             <p className="text-gray-500 text-xs">Pasa el móvil al Jugador {currentPlayer} y que nadie mire.</p>
           </div>

           <textarea
             value={currentInput}
             onChange={(e) => setCurrentInput(e.target.value)}
             placeholder="Escribe tu respuesta..."
             className="w-full h-40 bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none text-lg"
           />

           <button 
             onClick={handleNextPlayer}
             disabled={!currentInput.trim()}
             className="w-full py-4 bg-cyan-600 disabled:opacity-50 text-white font-black rounded-2xl text-lg shadow-lg flex items-center justify-center space-x-2"
           >
             <span>{currentPlayer === playerCount ? 'FINALIZAR' : 'SIGUIENTE JUGADOR'}</span>
             <Send size={20} />
           </button>
        </div>
      )}

      {/* REVEAL PHASE */}
      {phase === 'reveal' && (
        <div className="flex-1 flex flex-col space-y-4 pt-12 overflow-y-auto no-scrollbar">
           <div className="text-center mb-4">
             <h2 className="text-2xl font-black text-white">RESPUESTAS</h2>
             <p className="text-gray-400 text-xs">Leedlas y adivinad de quién es cada una.</p>
           </div>

           <div className="space-y-3 pb-20">
             {shuffledAnswers.map((ans, idx) => (
               <div key={idx} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 relative group">
                  <p className="text-xl text-white font-medium mb-8">"{ans.text}"</p>
                  
                  {revealedId === idx ? (
                    <div className="absolute bottom-3 right-3 bg-cyan-900/50 px-3 py-1 rounded-lg border border-cyan-500/30 animate-fade-in flex items-center space-x-2">
                       <User size={14} className="text-cyan-400" />
                       <span className="text-cyan-300 font-bold text-sm">Jugador {ans.id}</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setRevealedId(idx)}
                      className="absolute bottom-3 right-3 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-xs font-bold text-gray-300 flex items-center space-x-2 transition-colors"
                    >
                      <Eye size={14} />
                      <span>Revelar Autor</span>
                    </button>
                  )}
               </div>
             ))}
           </div>

           <div className="fixed bottom-6 left-6 right-6">
             <button onClick={() => setPhase('setup')} className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl">
               NUEVA PARTIDA
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Confessions;
