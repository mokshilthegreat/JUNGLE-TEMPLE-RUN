import React, { useState } from 'react';

interface SkillTreeProps {
  onBack: () => void;
  skillPoints?: number;
}

const branches = [
  {
    id: 'stealth', name: 'STEALTH', color: 'text-purple-400', borderColor: 'border-purple-500',
    skills: [
      { id: 's1', name: 'Silent Steps', desc: '-30% movement noise', cost: 1, unlocked: true },
      { id: 's2', name: 'Ghost', desc: '-50% enemy detection speed', cost: 2, unlocked: false },
      { id: 's3', name: 'Shadow', desc: '+50% crouch walk speed', cost: 3, unlocked: false },
    ]
  },
  {
    id: 'hacking', name: 'HACKING', color: 'text-cyan-400', borderColor: 'border-cyan-500',
    skills: [
      { id: 'h1', name: 'Overclock', desc: '+50% hack mini-game speed', cost: 1, unlocked: true },
      { id: 'h2', name: 'Buffer', desc: '+2 Extra attempts on terminals', cost: 2, unlocked: false },
      { id: 'h3', name: 'Firewall Bypass', desc: '-40% trace speed', cost: 3, unlocked: false },
    ]
  },
  {
    id: 'combat', name: 'COMBAT', color: 'text-red-400', borderColor: 'border-red-500',
    skills: [
      { id: 'c1', name: 'Heavy Hitter', desc: '+30% melee damage', cost: 1, unlocked: false },
      { id: 'c2', name: 'Steady Aim', desc: '+20% weapon accuracy', cost: 2, unlocked: false },
      { id: 'c3', name: 'Quick Hands', desc: '+40% reload speed', cost: 3, unlocked: false },
    ]
  },
  {
    id: 'mobility', name: 'MOBILITY', color: 'text-green-400', borderColor: 'border-green-500',
    skills: [
      { id: 'm1', name: 'Athletics', desc: '+20% sprint speed', cost: 1, unlocked: true },
      { id: 'm2', name: 'Endurance', desc: '+50% max stamina', cost: 2, unlocked: false },
      { id: 'm3', name: 'Dash', desc: 'Unlocks tactical dash ability', cost: 3, unlocked: false },
    ]
  },
  {
    id: 'loot', name: 'LOOT', color: 'text-amber-400', borderColor: 'border-amber-500',
    skills: [
      { id: 'l1', name: 'Deep Pockets', desc: '+1000 bag capacity', cost: 1, unlocked: false },
      { id: 'l2', name: 'Appraiser', desc: '+20% value from stolen goods', cost: 2, unlocked: false },
      { id: 'l3', name: 'Sleight of Hand', desc: '+50% interaction/loot speed', cost: 3, unlocked: false },
    ]
  }
];

const SkillTree: React.FC<SkillTreeProps> = ({ onBack, skillPoints = 5 }) => {
  const [points, setPoints] = useState(skillPoints);

  return (
    <div className="w-full h-screen bg-[#050B14] text-white flex flex-col font-sans overflow-hidden">
      <div className="h-16 border-b border-cyan-900 flex items-center justify-between px-6 bg-black/50 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
            &larr; BACK
          </button>
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            SKILL TREE
          </h1>
        </div>
        <div className="bg-cyan-900/30 border border-cyan-500/50 px-4 py-2 rounded">
          <span className="text-gray-400 text-sm mr-2">SKILL POINTS:</span>
          <span className="text-cyan-400 font-black text-xl">{points}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#050B14] to-black">
        <div className="flex flex-row justify-center gap-12 min-w-max">
          {branches.map(branch => (
            <div key={branch.id} className="flex flex-col items-center w-48">
              <h2 className={`text-xl font-black mb-8 ${branch.color} tracking-widest`}>{branch.name}</h2>
              
              <div className="flex flex-col space-y-12 relative w-full items-center">
                {/* Connecting Lines */}
                <div className="absolute top-10 bottom-10 w-1 bg-gray-800 z-0 left-1/2 -translate-x-1/2"></div>

                {branch.skills.map((skill, index) => (
                  <div key={skill.id} className="relative z-10 w-full group">
                    <button className={`w-full p-4 rounded bg-[#0a0e1a] border-2 transition-all flex flex-col items-center text-center ${
                      skill.unlocked 
                        ? `${branch.borderColor} shadow-[0_0_15px_rgba(255,255,255,0.1)]` 
                        : 'border-gray-800 opacity-70 hover:border-gray-500'
                    }`}>
                      <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center border-2 ${
                        skill.unlocked ? branch.borderColor : 'border-gray-700 bg-gray-900'
                      }`}>
                        {skill.unlocked ? '✓' : '🔒'}
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${skill.unlocked ? 'text-white' : 'text-gray-400'}`}>{skill.name}</h3>
                      <p className="text-[10px] text-gray-500 leading-tight h-8">{skill.desc}</p>
                      
                      {!skill.unlocked && (
                        <div className="mt-2 text-xs font-bold text-cyan-600 bg-cyan-900/20 px-2 py-1 rounded">
                          COST: {skill.cost} SP
                        </div>
                      )}
                    </button>
                    {/* Glow effect for unlocked */}
                    {skill.unlocked && (
                      <div className={`absolute inset-0 blur-md opacity-20 bg-current pointer-events-none rounded ${branch.color}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTree;
