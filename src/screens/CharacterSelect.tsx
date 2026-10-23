import React, { useState } from 'react';

interface CharacterSelectProps {
  onBack: () => void;
  playerLevel: number;
}

const characters = [
  {
    id: 'thief',
    name: 'THE THIEF',
    class: 'Balanced',
    unlockLevel: 1,
    color: 'from-gray-500 to-gray-700',
    borderColor: 'border-gray-400',
    stats: { speed: 60, stealth: 70, health: 60, hacking: 50, combat: 50, stamina: 60 },
    ability: 'Silent Steps',
    abilityDesc: 'Generates 30% less noise when moving.',
  },
  {
    id: 'hacker',
    name: 'THE HACKER',
    class: 'Tech Specialist',
    unlockLevel: 5,
    color: 'from-cyan-500 to-blue-700',
    borderColor: 'border-cyan-400',
    stats: { speed: 50, stealth: 60, health: 40, hacking: 95, combat: 30, stamina: 40 },
    ability: 'Overdrive',
    abilityDesc: 'Hacking minigames are 50% slower and trace is reduced.',
  },
  {
    id: 'ghost',
    name: 'THE GHOST',
    class: 'Infiltrator',
    unlockLevel: 10,
    color: 'from-purple-500 to-purple-900',
    borderColor: 'border-purple-400',
    stats: { speed: 80, stealth: 95, health: 30, hacking: 40, combat: 20, stamina: 70 },
    ability: 'Shadow Walk',
    abilityDesc: 'Invisible to cameras for 3 seconds after sprinting.',
  },
  {
    id: 'muscle',
    name: 'THE MUSCLE',
    class: 'Enforcer',
    unlockLevel: 15,
    color: 'from-red-500 to-red-800',
    borderColor: 'border-red-400',
    stats: { speed: 40, stealth: 20, health: 100, hacking: 20, combat: 90, stamina: 80 },
    ability: 'Takedown',
    abilityDesc: 'Can knock out guards from any direction, not just behind.',
  },
];

const CharacterSelect: React.FC<CharacterSelectProps> = ({ onBack, playerLevel }) => {
  const [selectedId, setSelectedId] = useState<string>('thief');

  const StatBar = ({ label, value }: { label: string; value: number }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400 uppercase">{label}</span>
        <span className="text-cyan-400">{value}/100</span>
      </div>
      <div className="h-1.5 w-full bg-gray-800 rounded overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-[#050B14] text-white font-sans flex flex-col">
      <div className="h-16 border-b border-cyan-900 flex items-center px-6 bg-black/50 z-10">
        <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
          &larr; BACK
        </button>
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          SELECT CHARACTER
        </h1>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto">
        {characters.map((char) => {
          const isLocked = playerLevel < char.unlockLevel;
          const isSelected = selectedId === char.id;

          return (
            <div
              key={char.id}
              onClick={() => !isLocked && setSelectedId(char.id)}
              className={`relative flex flex-col rounded-lg border-2 transition-all duration-300 bg-[#0a0e1a] overflow-hidden ${
                isLocked 
                  ? 'border-gray-800 opacity-60 cursor-not-allowed' 
                  : isSelected 
                  ? `border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105` 
                  : 'border-cyan-900/50 hover:border-cyan-600 cursor-pointer hover:-translate-y-1'
              }`}
            >
              {/* Character Visual Header */}
              <div className={`h-48 bg-gradient-to-br ${char.color} relative flex items-center justify-center opacity-80`}>
                <div className="w-24 h-24 rounded-full bg-black/50 flex items-center justify-center shadow-inner">
                  <span className="text-5xl opacity-80">👤</span>
                </div>
                {isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-5xl">🔒</span>
                  </div>
                )}
              </div>

              {/* Character Info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-black tracking-wider">{char.name}</h2>
                  <span className="text-xs font-bold text-cyan-500 uppercase">{char.class}</span>
                </div>

                <div className="space-y-1 mb-6 flex-1">
                  <StatBar label="Speed" value={char.stats.speed} />
                  <StatBar label="Stealth" value={char.stats.stealth} />
                  <StatBar label="Health" value={char.stats.health} />
                  <StatBar label="Hacking" value={char.stats.hacking} />
                  <StatBar label="Combat" value={char.stats.combat} />
                  <StatBar label="Stamina" value={char.stats.stamina} />
                </div>

                <div className="bg-black/50 p-3 rounded border border-cyan-900/30 mb-4">
                  <h3 className="text-xs font-bold text-amber-500 mb-1">ABILITY: {char.ability}</h3>
                  <p className="text-xs text-gray-400 leading-tight">{char.abilityDesc}</p>
                </div>

                <button
                  disabled={isLocked}
                  className={`w-full py-3 rounded font-bold tracking-widest transition-colors ${
                    isLocked 
                      ? 'bg-gray-800 text-gray-500' 
                      : isSelected
                      ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : 'bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800'
                  }`}
                >
                  {isLocked ? `UNLOCKS AT LVL ${char.unlockLevel}` : isSelected ? 'SELECTED' : 'SELECT'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelect;
