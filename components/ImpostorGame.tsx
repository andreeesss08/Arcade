
import React, { useState } from 'react';
import { GameState, Category, Player, GameModeId } from '../types';
import PlayerSetup from './PlayerSetup';
import RoleReveal from './RoleReveal';
import Gameplay from './Gameplay';
import { generateGameWords } from '../services/geminiService';
import { Home } from 'lucide-react';

interface ImpostorGameProps {
  onExit: () => void;
}

const ImpostorGame: React.FC<ImpostorGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    phase: 'setup',
    secretWord: '',
    gameMode: 'classic',
    currentCategory: null,
    winner: null,
    roundKey: 0,
    impostorHints: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedNames, setSavedNames] = useState<string[]>([]);

  const startGame = async (names: string[], category: Category, impostorCountInput: number, gameMode: GameModeId, impostorHints: boolean) => {
    setIsGenerating(true);
    
    // Call API: Now returns relatedCategory (for General mode)
    const { secretWord, fakeWord, relatedCategory } = await generateGameWords(category.promptKey, category.id, gameMode);
    
    const playerCount = names.length;
    let finalImpostorCount = impostorCountInput;
    
    if (gameMode === 'chaos') {
      finalImpostorCount = playerCount - 1; 
    }

    const indices = Array.from({ length: playerCount }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    const impostorIndices = new Set(indices.slice(0, finalImpostorCount));

    const newPlayers: Player[] = names.map((name, index) => {
      const isImpostor = impostorIndices.has(index);
      let assignedWord: string | undefined = undefined;

      if (!isImpostor) {
        assignedWord = secretWord;
      } else {
        if (gameMode === 'spy') {
          // SPY MODE: Gets a very different word
          assignedWord = fakeWord || '???';
        } else if (gameMode === 'chaos') {
           assignedWord = undefined;
        } else {
          assignedWord = undefined;
        }
      }

      return {
        id: `p-${index}-${Date.now()}`,
        name,
        isImpostor,
        hasViewedRole: false,
        word: assignedWord
      };
    });

    const startingPlayerIndex = Math.floor(Math.random() * names.length);

    setGameState({
      players: newPlayers,
      phase: 'reveal',
      secretWord: secretWord,
      fakeWord: fakeWord,
      gameMode: gameMode,
      currentCategory: category,
      winner: null,
      startingPlayerId: newPlayers[startingPlayerIndex].id,
      roundKey: Date.now(),
      impostorHints: impostorHints,
      impostorSpecificHint: relatedCategory // Store the specific hint
    });
    setIsGenerating(false);
  };

  const handlePlayerViewed = (playerId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, hasViewedRole: true } : p
      )
    }));
  };

  const handleAllViewed = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'discuss'
    }));
  };

  const handleNewGame = (keepPlayers: boolean) => {
    if (keepPlayers) {
      const names = gameState.players.map(p => p.name);
      setSavedNames(names);
    } else {
      setSavedNames([]);
    }

    setGameState(prev => ({
      ...prev,
      phase: 'setup',
      secretWord: '',
      winner: null,
      players: [],
      impostorSpecificHint: undefined
    }));
  };

  return (
    <div className="h-full relative">
       {/* Exit Button - Only visible in setup */}
       {gameState.phase === 'setup' && (
        <button 
          onClick={onExit}
          className="absolute top-4 left-4 z-50 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"
        >
          <Home size={20} />
        </button>
      )}

      {gameState.phase === 'setup' && (
        <PlayerSetup 
          onStartGame={startGame} 
          isGenerating={isGenerating} 
          initialNames={savedNames}
        />
      )}

      {gameState.phase === 'reveal' && gameState.currentCategory && (
        <RoleReveal 
          players={gameState.players}
          secretWord={gameState.secretWord}
          category={gameState.currentCategory}
          impostorHints={gameState.impostorHints}
          onPlayerViewed={handlePlayerViewed}
          onAllViewed={handleAllViewed}
          impostorSpecificHint={gameState.impostorSpecificHint}
        />
      )}

      {gameState.phase === 'discuss' && gameState.currentCategory && (
        <Gameplay 
          players={gameState.players}
          secretWord={gameState.secretWord}
          category={gameState.currentCategory}
          startingPlayerId={gameState.startingPlayerId}
          onNewGame={handleNewGame}
          gameMode={gameState.gameMode}
        />
      )}
    </div>
  );
};

export default ImpostorGame;
