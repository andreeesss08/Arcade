
import React, { useState, useEffect } from 'react';
import { Player, Category } from '../types';
import { Timer, RefreshCw, Eye, Trophy, Users, ArrowLeft, MessageCircleQuestion, Lightbulb } from 'lucide-react';

interface GameplayProps {
  players: Player[];
  secretWord: string;
  category: Category;
  startingPlayerId?: string;
  onNewGame: (keepPlayers: boolean) => void;
  gameMode: string;
}

const MISSIONS = [
  "¿De qué material está hecho?",
  "¿Cuánto cuesta aproximadamente?",
  "¿Dónde se puede comprar?",
  "¿Es útil para sobrevivir?",
  "¿Lo usaría un niño?",
  "¿Cabe en una mochila?",
  "Describe su color sin decir el nombre.",
  "¿A qué huele?",
  "¿Es peligroso?",
  "¿Lo tienes en tu casa?"
];

const Gameplay: React.FC<GameplayProps> = ({ players, secretWord, category, startingPlayerId, onNewGame, gameMode }) => {
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(true);
  const [mission, setMission] = useState<string>("");

  const impostors = players.filter(p => p.isImpostor);
  const startingPlayer = players.find(p => p.id === startingPlayerId);

  useEffect(() => {
    setMission(MISSIONS[Math.floor(Math.random() * MISSIONS.length)]);
  }, []);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReveal = () => {
    setShowResult(true);
    setTimerActive(false);
  };

  const changeMission = () => {
    let newMission = mission;
    while(newMission === mission) {
      newMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    }
    setMission(newMission);
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-4 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-gray-800/40 p-2 rounded-xl border border-gray-700/30">
        <div className="flex items-center space-x-2 text-gray-300 px-2">
          <span>{category.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider">{category.name}</span>
        </div>
        
        <div className={`flex items-center space-x-2 font-mono text-lg font-bold px-3 py-1 rounded-lg ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-gray-300'}`}>
          <Timer size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center space-y-4 relative z-10 w-full">
        
        {!showResult ? (
          <>
            <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border border-gray-700/50 shadow-xl text-center">
              <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
                DEBATE
              </h2>
              <div className="flex justify-center mb-4">
                 {startingPlayer && (
                   <div className="bg-purple-900/40 border border-purple-500/30 rounded-full px-3 py-1 flex items-center space-x-2">
                      <span className="text-purple-300 text-[10px] font-bold uppercase">Empieza</span>
                      <span className="text-white text-sm font-bold">{startingPlayer.name}</span>
                   </div>
                 )}
              </div>
              
              {/* Mission Card */}
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 relative group cursor-pointer" onClick={changeMission}>
                <div className="absolute top-2 left-2 text-yellow-500/50"><Lightbulb size={16} /></div>
                <p className="text-gray-300 text-sm font-medium italic">"{mission}"</p>
                <div className="mt-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">Toca para cambiar pregunta</div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-2 gap-2 w-full flex-1 overflow-y-auto content-start">
               {players.map(p => (
                 <div key={p.id} className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                      {p.name.substring(0,2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-300 truncate text-sm">{p.name}</span>
                 </div>
               ))}
            </div>

            <button
              onClick={handleReveal}
              className="w-full py-4 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center space-x-3 shadow-lg hover:scale-[1.02] transition-all"
            >
              <Eye size={24} />
              <span>VER RESULTADO</span>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center animate-slide-in pb-4">
             <div className="mb-6 relative mt-4">
               <Trophy size={56} className="text-yellow-500 relative z-10" />
               <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20"></div>
             </div>

             <h2 className="text-xl font-bold text-gray-400 mb-4">Los impostores eran...</h2>
             
             <div className="space-y-3 w-full mb-6 flex-1 overflow-y-auto no-scrollbar">
               {impostors.map(impostor => (
                 <div key={impostor.id} className="bg-gradient-to-r from-red-900/40 to-red-800/20 border-l-4 border-red-500 p-4 rounded-r-xl">
                    <div className="flex justify-between items-center">
                       <span className="text-xl font-black text-white">{impostor.name}</span>
                       {gameMode === 'spy' && impostor.word && (
                         <div className="text-right">
                           <span className="text-[10px] text-red-300 uppercase block">Su palabra</span>
                           <span className="text-red-200 font-bold">{impostor.word}</span>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
             </div>

             <div className="bg-gray-800 p-5 rounded-2xl w-full mb-6 text-center border border-gray-700">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">La Palabra Real</p>
                <p className="text-3xl font-black text-white">{secretWord}</p>
             </div>
             
             <div className="w-full space-y-3">
               <button
                 onClick={() => onNewGame(true)}
                 className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:bg-purple-500"
               >
                 <RefreshCw size={20} />
                 <span>Jugar con los mismos</span>
               </button>
               
               <button
                 onClick={() => onNewGame(false)}
                 className="w-full py-4 rounded-2xl bg-gray-800 text-gray-400 font-bold text-sm flex items-center justify-center space-x-2 hover:bg-gray-700"
               >
                 <ArrowLeft size={18} />
                 <span>Cambiar Jugadores</span>
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gameplay;
