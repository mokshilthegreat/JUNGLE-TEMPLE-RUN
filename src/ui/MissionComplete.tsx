import React from 'react';

interface MissionCompleteProps {
  stats: {
    cashStolen: number;
    xpEarned: number;
    time: string;
    enemiesAvoided: string;
    camerasDisabled: string;
    lootCollected: string;
  };
  stars: number; // 1-3
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}

const MissionComplete: React.FC<MissionCompleteProps> = ({ stats, stars, onNext, onReplay, onHome }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 font-sans">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 tracking-widest drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] mb-2 text-center">
          MISSION COMPLETE
        </h1>
        <h2 className="text-xl text-cyan-400 tracking-[0.3em] mb-8 font-bold">TREASURE SECURED</h2>
        
        {/* Stars */}
        <div className="flex space-x-4 mb-10">
          {[1, 2, 3].map(star => (
            <div key={star} className={`text-6xl ${star <= stars ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'text-gray-700'}`}>
              ★
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="w-full bg-[#0a0e1a] border border-cyan-900/50 rounded-lg p-6 grid grid-cols-2 gap-4 mb-10">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400 text-sm">CASH STOLEN</span>
            <span className="text-green-400 font-mono font-bold text-lg">${stats.cashStolen.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400 text-sm">XP EARNED</span>
            <span className="text-cyan-400 font-mono font-bold text-lg">+{stats.xpEarned}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400 text-sm">TIME</span>
            <span className="text-white font-mono font-bold">{stats.time}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400 text-sm">ENEMIES AVOIDED</span>
            <span className="text-white font-mono font-bold">{stats.enemiesAvoided}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400 text-sm">CAMERAS DISABLED</span>
            <span className="text-white font-mono font-bold">{stats.camerasDisabled}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400 text-sm">LOOT COLLECTED</span>
            <span className="text-white font-mono font-bold">{stats.lootCollected}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex w-full space-x-4">
          <button onClick={onHome} className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold tracking-widest rounded transition-colors">
            HOME
          </button>
          <button onClick={onReplay} className="flex-1 py-4 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-600 text-cyan-100 font-bold tracking-widest rounded transition-colors">
            REPLAY
          </button>
          <button onClick={onNext} className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            NEXT MISSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionComplete;
