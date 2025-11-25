
import React, { useState, useEffect } from 'react';
import { CATEGORIES, Category, GAME_MODES, GameModeId } from '../types';
import { Plus, X, UserPlus, Lightbulb } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (players: string[], category: Category, impostorCount: number, gameMode: GameModeId, impostorHints: boolean) => void;
  isGenerating: boolean;
  initialNames?: string[];
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame, isGenerating, initialNames = [] }) => {
  const [names, setNames] = useState<string[]>(initialNames);
  const [newName, setNewName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [selectedMode, setSelectedMode] = useState<GameModeId>('classic');
  const [impostorCount, setImpostorCount] = useState(1);
  const [impostorHints, setImpostorHints] = useState(false);

  useEffect(() => {
    if (initialNames.length > 0) {
      setNames(initialNames);
    }
  }, [initialNames]);

  // Adjust impostor count based on mode and players
  useEffect(() => {
    if (selectedMode === 'chaos') {
      setImpostorCount(Math.max(1, names.length - 1));
    } else {
      const maxImpostors = Math.max(1, Math.floor((names.length - 1) / 2));
      if (impostorCount > maxImpostors || impostorCount < 1) {
          setImpostorCount(1);
      }
    }
  }, [names.length, selectedMode]);

  const addPlayer = () => {
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const removePlayer = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addPlayer();
  };

  const handleStart = () => {
    if (names.length >= 3) {
      onStartGame(names, selectedCategory, impostorCount, selectedMode, impostorHints);
    }
  };

  const maxImpostors = Math.floor((names.length - 1) / 2);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-4 space-y-5 animate-fade-in relative z-10 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-1 pt-2">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 drop-shadow-lg tracking-tight">
          IMPOSTOR
        </h1>
      </div>

      {/* Game Mode Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Modo de Juego</label>
        <div className="grid grid-cols-1 gap-3">
          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`relative p-3 rounded-xl border-2 text-left transition-all duration-300 ${
                selectedMode === mode.id
                  ? `bg-gradient-to-r ${mode.color} border-transparent text-white shadow-lg scale-[1.02]`
                  : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{mode.icon}</span>
                  <div>
                    <h3 className={`font-bold text-sm ${selectedMode === mode.id ? 'text-white' : 'text-gray-300'}`}>
                      {mode.name}
                    </h3>
                    <p className={`text-xs leading-tight mt-0.5 ${selectedMode === mode.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {mode.description}
                    </p>
                  </div>
                </div>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 p-2 w-24 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 transition-all ${
                selectedCategory.id === cat.id
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold text-[10px] text-center leading-none">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div className="flex-1 flex flex-col space-y-3 min-h-[150px]">
        <div className="flex justify-between items-end px-1">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jugadores ({names.length})</label>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre..."
            className="flex-1 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder-gray-600"
          />
          <button
            onClick={addPlayer}
            disabled={!newName.trim()}
            className="bg-gray-800 hover:bg-purple-600 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar max-h-48">
          {names.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-xl p-4">
                <UserPlus size={24} className="mb-2 opacity-50" />
                <p className="text-xs">Añade jugadores</p>
             </div>
          ) : (
            names.map((name, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-700/30">
                <span className="font-medium text-gray-300 text-sm">{name}</span>
                <button onClick={() => removePlayer(index)} className="text-gray-600 hover:text-red-400"><X size={16} /></button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Impostor Settings */}
      {names.length >= 3 && selectedMode === 'classic' && (
        <div className="space-y-3">
            {/* Count */}
            <div className="bg-gray-800/30 rounded-xl p-3 flex items-center justify-between border border-gray-700/30">
                <span className="text-xs font-bold text-gray-400 uppercase ml-1">Impostores</span>
                <div className="flex items-center space-x-3 bg-gray-900 rounded-lg p-1">
                    <button onClick={() => setImpostorCount(Math.max(1, impostorCount - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded text-gray-400">-</button>
                    <span className="font-bold text-sm w-4 text-center">{impostorCount}</span>
                    <button 
                        onClick={() => setImpostorCount(Math.min(maxImpostors, impostorCount + 1))} 
                        disabled={impostorCount >= maxImpostors}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded text-gray-400 disabled:opacity-20"
                    >+</button>
                </div>
            </div>

            {/* Hint Toggle */}
            <button 
                onClick={() => setImpostorHints(!impostorHints)}
                className={`w-full bg-gray-800/30 rounded-xl p-3 flex items-center justify-between border border-gray-700/30 transition-colors ${impostorHints ? 'bg-purple-900/20 border-purple-500/30' : ''}`}
            >
                <div className="flex items-center space-x-2">
                    <Lightbulb size={18} className={impostorHints ? 'text-yellow-400' : 'text-gray-500'} />
                    <span className={`text-xs font-bold uppercase ${impostorHints ? 'text-gray-200' : 'text-gray-400'}`}>Pista para Impostor</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${impostorHints ? 'bg-purple-500' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm ${impostorHints ? 'left-6' : 'left-1'}`} />
                </div>
            </button>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={names.length < 3 || isGenerating}
        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-xl transition-all ${
          names.length < 3 || isGenerating
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-white text-black hover:scale-[1.02]'
        }`}
      >
        {isGenerating ? <div className="animate-spin w-6 h-6 border-2 border-black/30 border-t-black rounded-full" /> : <span>COMENZAR</span>}
      </button>
    </div>
  );
};

export default PlayerSetup;
