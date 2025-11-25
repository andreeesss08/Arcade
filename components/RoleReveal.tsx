
import React, { useState, useEffect } from 'react';
import { Player, Category } from '../types';
import { Fingerprint, CheckCircle2, Lightbulb } from 'lucide-react';

interface RoleRevealProps {
  players: Player[];
  secretWord: string;
  category: Category;
  impostorHints: boolean;
  onPlayerViewed: (playerId: string) => void;
  onAllViewed: () => void;
  impostorSpecificHint?: string;
}

const RoleReveal: React.FC<RoleRevealProps> = ({ players, secretWord, category, impostorHints, onPlayerViewed, onAllViewed, impostorSpecificHint }) => {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [hasUnlocked, setHasUnlocked] = useState(false);

  const activePlayer = players.find(p => p.id === activePlayerId);
  const unviewedPlayers = players.filter(p => !p.hasViewedRole);

  // Optimized Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setRevealProgress(prev => {
        if (prev >= 100) return 100;
        // Smoother increment: +2.5 per frame approx 60fps = ~0.6s to fill
        return prev + 2.5; 
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isRevealing && !hasUnlocked) {
      animationFrameId = requestAnimationFrame(animate);
    } else if (!isRevealing) {
      // Instant reset if released before unlock
      setRevealProgress(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isRevealing, hasUnlocked]); // Removed revealProgress to prevent re-render loop lag

  // Trigger unlock state when progress hits 100%
  useEffect(() => {
    if (revealProgress >= 100 && !hasUnlocked) {
      setHasUnlocked(true);
    }
  }, [revealProgress, hasUnlocked]);

  const handleSelectPlayer = (id: string) => {
    setActivePlayerId(id);
    setRevealProgress(0);
    setHasUnlocked(false);
    setIsRevealing(false);
  };

  const handleFinishView = () => {
    if (activePlayerId) {
      onPlayerViewed(activePlayerId);
      setActivePlayerId(null);
      setRevealProgress(0);
      setHasUnlocked(false);
      setIsRevealing(false);
      
      if (unviewedPlayers.length === 1 && unviewedPlayers[0].id === activePlayerId) {
        onAllViewed();
      }
    }
  };

  if (!activePlayerId) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mt-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Identificación</h2>
          <p className="text-gray-500 text-sm">Entrega el dispositivo al jugador</p>
        </div>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[65vh] no-scrollbar pb-24">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => !player.hasViewedRole && handleSelectPlayer(player.id)}
              disabled={player.hasViewedRole}
              className={`p-5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                player.hasViewedRole
                  ? 'bg-gray-900/50 border border-gray-800 text-gray-700'
                  : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-750 active:scale-95 shadow-md'
              }`}
            >
              <span className="font-bold text-lg">{player.name}</span>
              {player.hasViewedRole ? (
                <CheckCircle2 size={24} className="text-green-900" />
              ) : (
                <Fingerprint size={28} className="text-purple-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          {unviewedPlayers.length === 0 && (
            <button
              onClick={onAllViewed}
              className="w-full py-4 rounded-2xl bg-white text-black font-black text-xl shadow-xl hover:scale-[1.02] transition-all"
            >
              EMPEZAR
            </button>
          )}
        </div>
      </div>
    );
  }

  const isFullyRevealed = revealProgress >= 100;
  
  const showWord = activePlayer?.word !== undefined;
  const displayWord = activePlayer?.word || secretWord;

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 bg-[#13141c] absolute inset-0 z-50">
      <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center">
        
        <div className="space-y-1">
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Identidad de</p>
          <h1 className="text-4xl font-black text-white">{activePlayer?.name}</h1>
        </div>

        <div 
          className="relative w-72 h-80 select-none touch-none"
          onMouseDown={() => setIsRevealing(true)}
          onMouseUp={() => setIsRevealing(false)}
          onMouseLeave={() => setIsRevealing(false)}
          onTouchStart={() => setIsRevealing(true)}
          onTouchEnd={() => setIsRevealing(false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className={`
              w-full h-full rounded-3xl relative overflow-hidden transition-all duration-300 shadow-2xl
              bg-gray-800 border-2 ${hasUnlocked && !showWord ? 'border-red-500' : 'border-gray-700'}
            `}>
            
            {/* HIDDEN CONTENT */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 z-10 
                ${hasUnlocked ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300
                ${!showWord ? 'bg-red-900/20' : ''}
            `}>
               {!showWord ? (
                 <>
                   <div className="text-6xl mb-4">🤫</div>
                   <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest mb-2">IMPOSTOR</h2>
                   <p className="text-gray-400 text-sm mb-4">No conoces la palabra.</p>
                   {impostorHints && (
                     <div className="bg-red-900/40 px-4 py-2 rounded-lg border border-red-500/30 animate-pulse flex items-center space-x-2">
                         <Lightbulb size={16} className="text-yellow-400" />
                         <div>
                            <p className="text-red-300 text-[10px] font-bold uppercase leading-none">Pista</p>
                            <p className="text-white font-bold leading-tight">{impostorSpecificHint || category.name}</p>
                         </div>
                     </div>
                   )}
                 </>
               ) : (
                 <>
                   <p className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-6">Tu palabra es</p>
                   <div className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full backdrop-blur-md">
                     <h2 className="text-3xl font-black text-white break-words leading-tight">{displayWord}</h2>
                   </div>
                 </>
               )}
            </div>

            {/* COVER OVERLAY */}
            <div 
              className="absolute inset-0 z-20 bg-gray-900 flex flex-col items-center justify-center will-change-opacity"
              style={{ opacity: Math.max(0, 1 - (revealProgress / 80)), pointerEvents: 'none' }}
            >
                <div className={`w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-800 flex items-center justify-center mb-4 relative overflow-hidden transform transition-transform duration-100 ${isRevealing ? 'scale-105' : ''}`}>
                  <Fingerprint size={48} className={`text-gray-600 ${isRevealing ? 'text-purple-500' : ''}`} />
                  {isRevealing && <div className="absolute inset-0 bg-purple-500/20 animate-pulse" />}
                </div>
                <p className="text-gray-500 font-bold text-sm animate-pulse">MANTÉN PULSADO</p>
            </div>
            
            {/* Progress Bar - No transition for fluid JS animation */}
            <div className="absolute bottom-0 left-0 h-1 bg-purple-500 z-30" style={{ width: `${revealProgress}%` }} />
          </div>
        </div>

        <button
          onClick={handleFinishView}
          className={`
            w-full max-w-xs px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-all duration-300
            ${hasUnlocked 
              ? 'bg-white text-black translate-y-0 opacity-100 shadow-lg cursor-pointer' 
              : 'bg-gray-800 text-gray-600 translate-y-4 opacity-0 pointer-events-none'}
          `}
        >
          <span>Entendido</span>
        </button>

      </div>
    </div>
  );
};

export default RoleReveal;
