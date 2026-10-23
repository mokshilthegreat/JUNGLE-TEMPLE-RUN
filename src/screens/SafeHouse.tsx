import React from 'react';

interface SafeHouseProps {
  onBack: () => void;
  playerLevel: number;
}

const SafeHouse: React.FC<SafeHouseProps> = ({ onBack, playerLevel }) => {
  return (
    <div className="w-full h-screen bg-[#050B14] text-white flex flex-col font-sans">
      <div className="h-16 border-b border-cyan-900 flex items-center px-6 bg-black/50 z-10">
        <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
          &larr; BACK
        </button>
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          SAFE HOUSE
        </h1>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto bg-gradient-to-br from-[#0a0e1a] to-[#050B14]">
        
        {/* Statistics Panel */}
        <div className="bg-black/60 border border-cyan-900/50 rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-cyan-500 border-b border-cyan-900/50 pb-2 mb-4">STATISTICS</h2>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center bg-[#0a0e1a] p-3 rounded">
              <span className="text-gray-400">Total Missions</span>
              <span className="text-white font-bold">42</span>
            </div>
            <div className="flex justify-between items-center bg-[#0a0e1a] p-3 rounded">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-green-400 font-bold">85%</span>
            </div>
            <div className="flex justify-between items-center bg-[#0a0e1a] p-3 rounded">
              <span className="text-gray-400">Money Earned</span>
              <span className="text-green-400 font-bold">$1,250,000</span>
            </div>
            <div className="flex justify-between items-center bg-[#0a0e1a] p-3 rounded">
              <span className="text-gray-400">Guards Knocked Out</span>
              <span className="text-amber-400 font-bold">128</span>
            </div>
            <div className="flex justify-between items-center bg-[#0a0e1a] p-3 rounded">
              <span className="text-gray-400">Safes Cracked</span>
              <span className="text-cyan-400 font-bold">34</span>
            </div>
          </div>
        </div>

        {/* Current Loadout */}
        <div className="bg-black/60 border border-cyan-900/50 rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-cyan-500 border-b border-cyan-900/50 pb-2 mb-4">CURRENT LOADOUT</h2>
          <div className="flex-1 space-y-4">
            <div className="flex items-center p-3 bg-[#0a0e1a] rounded border border-gray-800">
              <div className="text-2xl mr-4 bg-gray-900 p-2 rounded">👤</div>
              <div>
                <div className="text-xs text-cyan-600 font-bold">CHARACTER</div>
                <div className="text-white font-bold">THE THIEF</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-[#0a0e1a] rounded border border-gray-800">
              <div className="text-2xl mr-4 bg-gray-900 p-2 rounded">👕</div>
              <div>
                <div className="text-xs text-cyan-600 font-bold">OUTFIT</div>
                <div className="text-white font-bold">Night Suit</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-[#0a0e1a] rounded border border-gray-800">
              <div className="text-2xl mr-4 bg-gray-900 p-2 rounded">🔫</div>
              <div>
                <div className="text-xs text-cyan-600 font-bold">WEAPON</div>
                <div className="text-white font-bold">Silenced Pistol</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-[#0a0e1a] rounded border border-gray-800">
              <div className="text-2xl mr-4 bg-gray-900 p-2 rounded">💣</div>
              <div>
                <div className="text-xs text-cyan-600 font-bold">GADGET</div>
                <div className="text-white font-bold">EMP Grenade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loot Collection */}
        <div className="bg-black/60 border border-cyan-900/50 rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-amber-500 border-b border-cyan-900/50 pb-2 mb-4">TROPHY ROOM</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🖼️', name: 'Mona Lisa Fake', rarity: 'rare' },
              { icon: '💎', name: 'Hope Diamond', rarity: 'epic' },
              { icon: '👑', name: 'Royal Crown', rarity: 'legendary' },
              { icon: '🏺', name: 'Ming Vase', rarity: 'uncommon' },
              { icon: '📜', name: 'Secret Docs', rarity: 'rare' },
              { icon: '💻', name: 'Prototype', rarity: 'epic' },
              { icon: '🪙', name: 'Gold Bar', rarity: 'common' },
              { icon: '❓', name: 'Locked', rarity: 'none' },
              { icon: '❓', name: 'Locked', rarity: 'none' },
            ].map((trophy, i) => (
              <div key={i} className={`aspect-square rounded flex flex-col items-center justify-center p-2 text-center border bg-[#0a0e1a] ${
                trophy.rarity === 'legendary' ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                trophy.rarity === 'epic' ? 'border-purple-500' :
                trophy.rarity === 'rare' ? 'border-blue-500' :
                trophy.rarity === 'uncommon' ? 'border-green-500' :
                trophy.rarity === 'common' ? 'border-gray-500' :
                'border-gray-800 opacity-50'
              }`}>
                <div className="text-3xl mb-1">{trophy.icon}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{trophy.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SafeHouse;
