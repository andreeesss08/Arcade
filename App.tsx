
import React, { useState } from 'react';
import { AppView } from './types';
import GameHub from './components/GameHub';
import ImpostorGame from './components/ImpostorGame';
import NeverHaveIEver from './components/NeverHaveIEver';
import MostLikelyTo from './components/MostLikelyTo';
import WordBomb from './components/WordBomb';
import Confessions from './components/Confessions';
import ThreeInFive from './components/ThreeInFive';
import WouldYouRather from './components/WouldYouRather';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('hub');

  return (
    <div className="min-h-screen bg-[#1a1b26] text-white overflow-hidden font-sans">
      <main className="h-screen w-full relative">
        {/* Simple Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b26] to-[#0f1016]" />
        
        {/* Aesthetic Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Content Router */}
        <div className="relative z-10 h-full">
          {currentView === 'hub' && (
            <GameHub onSelectGame={setCurrentView} />
          )}

          {currentView === 'impostor' && (
            <ImpostorGame onExit={() => setCurrentView('hub')} />
          )}

          {currentView === 'never_have_i_ever' && (
            <NeverHaveIEver onExit={() => setCurrentView('hub')} />
          )}

          {currentView === 'most_likely' && (
            <MostLikelyTo onExit={() => setCurrentView('hub')} />
          )}

          {currentView === 'word_bomb' && (
            <WordBomb onExit={() => setCurrentView('hub')} />
          )}

          {currentView === 'confessions' && (
            <Confessions onExit={() => setCurrentView('hub')} />
          )}

          {currentView === 'three_in_five' && (
            <ThreeInFive onExit={() => setCurrentView('hub')} />
          )}

          {currentView === 'would_you_rather' && (
            <WouldYouRather onExit={() => setCurrentView('hub')} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
