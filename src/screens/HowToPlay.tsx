import React from 'react';

interface HowToPlayProps {
  onBack: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
  const sections = [
    {
      title: 'STEALTH & MOVEMENT',
      icon: '🥷',
      content: 'Use WASD to move. Hold SHIFT to sprint (makes noise). Press C to crouch and move silently. Stay out of red vision cones to avoid detection.'
    },
    {
      title: 'GUARDS',
      icon: '👮',
      content: 'Guards have vision cones. If they see you, a detection meter fills up. Once full, the alarm triggers. Sneak up behind them and press SPACE to knock them out.'
    },
    {
      title: 'CAMERAS & SECURITY',
      icon: '📷',
      content: 'Cameras scan areas with blue light. Hack nearby terminals to disable them temporarily. Laser grids can be deactivated or bypassed with items.'
    },
    {
      title: 'HACKING & LOCKPICKING',
      icon: '💻',
      content: 'Press E near terminals or locked doors. Hacking requires finding a sequence before the trace completes. Lockpicking requires matching pin heights.'
    },
    {
      title: 'LOOT & BAG CAPACITY',
      icon: '💎',
      content: 'Collect cash and valuables to earn money. Your bag has a weight limit. Heavy items slow you down. Upgrade your bag in the Safe House.'
    },
    {
      title: 'EQUIPMENT',
      icon: '🔧',
      content: 'Purchase tools like EMPs, Smoke Grenades, and Lockpicks in the Shop. Use them strategically with F to bypass difficult security or escape.'
    }
  ];

  return (
    <div className="w-full h-screen bg-[#050B14] text-white flex flex-col font-sans">
      <div className="h-16 border-b border-cyan-900 flex items-center px-6 bg-black/50">
        <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
          &larr; BACK
        </button>
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          TRAINING MANUAL
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((sec, i) => (
              <div key={i} className="bg-[#0a0e1a] border border-cyan-900/50 p-6 rounded-lg flex items-start space-x-6 hover:border-cyan-500/50 transition-colors">
                <div className="text-5xl bg-black p-4 rounded border border-gray-800 shrink-0">
                  {sec.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-3 tracking-wide">{sec.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{sec.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-black/60 border border-amber-900/50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-black text-amber-500 mb-4">THE GOLDEN RULE</h2>
            <p className="text-lg text-gray-300 italic">"Get in, get the goods, get out. Leave no trace."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
