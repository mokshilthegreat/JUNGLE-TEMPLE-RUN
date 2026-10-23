import React from 'react';

interface GameOverScreenProps {
  stats: {
    timeSurvived: string;
    lootCollected: string;
    guardsAlerted: number;
  };
  onRetry: () => void;
  onHome: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ stats, onRetry, onHome }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 font-sans">
      <div className="w-full max-w-lg p-8 flex flex-col items-center">
        
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800 tracking-widest drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] mb-4 text-center">
          MISSION FAILED
        </h1>
        <p className="text-gray-400 mb-10 text-center uppercase tracking-widest">You were detected and apprehended.</p>

        <div className="w-full bg-[#1a0a0a] border border-red-900/50 rounded-lg p-6 space-y-4 mb-10">
          <div className="flex justify-between items-center border-b border-red-900/30 pb-2">
            <span className="text-gray-400 text-sm">TIME SURVIVED</span>
            <span className="text-white font-mono">{stats.timeSurvived}</span>
          </div>
          <div className="flex justify-between items-center border-b border-red-900/30 pb-2">
            <span className="text-gray-400 text-sm">LOOT COLLECTED</span>
            <span className="text-white font-mono">{stats.lootCollected}</span>
          </div>
          <div className="flex justify-between items-center border-b border-red-900/30 pb-2">
            <span className="text-gray-400 text-sm">GUARDS ALERTED</span>
            <span className="text-red-400 font-mono font-bold">{stats.guardsAlerted}</span>
          </div>
        </div>

        <div className="flex w-full space-x-4">
          <button onClick={onHome} className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold tracking-widest rounded transition-colors">
            HOME
          </button>
          <button onClick={onRetry} className="flex-[2] py-4 bg-red-700 hover:bg-red-600 text-white font-black tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            RETRY MISSION
          </button>
        </div>

      </div>
    </div>
  );
};

export default GameOverScreen;
