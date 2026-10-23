import React, { useState, useEffect } from 'react';

interface MainMenuProps {
  onPlay: () => void;
  onMissions: () => void;
  onEquipment: () => void;
  onCharacter: () => void;
  onSkills: () => void;
  onSafeHouse: () => void;
  onShop: () => void;
  onAchievements: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  playerLevel?: number;
  money?: number;
  diamonds?: number;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onMissions,
  onEquipment,
  onCharacter,
  onSkills,
  onSafeHouse,
  onShop,
  onAchievements,
  onHowToPlay,
  onSettings,
  playerLevel = 1,
  money = 5000,
  diamonds = 50,
}) => {
  const [rainParticles, setRainParticles] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const particles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
    }));
    setRainParticles(particles);
  }, []);

  const buttons = [
    { label: 'PLAY', onClick: onPlay },
    { label: 'MISSIONS', onClick: onMissions },
    { label: 'EQUIPMENT', onClick: onEquipment },
    { label: 'CHARACTER', onClick: onCharacter },
    { label: 'SKILLS', onClick: onSkills },
    { label: 'SAFE HOUSE', onClick: onSafeHouse },
    { label: 'SHOP', onClick: onShop },
    { label: 'ACHIEVEMENTS', onClick: onAchievements },
    { label: 'HOW TO PLAY', onClick: onHowToPlay },
    { label: 'SETTINGS', onClick: onSettings },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050B14] text-white font-sans selection:bg-cyan-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] to-[#050B14] z-0"></div>
      
      {/* City Skyline */}
      <div className="absolute bottom-0 w-full h-1/2 flex items-end opacity-20 z-0">
        <div className="w-1/4 h-3/4 bg-black border-t border-r border-cyan-900/30"></div>
        <div className="w-1/5 h-full bg-black border-t border-r border-cyan-900/30"></div>
        <div className="w-1/3 h-4/5 bg-black border-t border-r border-cyan-900/30"></div>
        <div className="w-1/4 h-2/3 bg-black border-t border-cyan-900/30"></div>
      </div>

      {/* Police Lights */}
      <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-red-600 rounded-full animate-ping z-0 opacity-50 shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
      <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-blue-600 rounded-full animate-ping z-0 opacity-50 delay-75 shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>

      {/* Helicopter Searchlight */}
      <div className="absolute top-0 left-1/2 w-64 h-[200vh] bg-gradient-to-b from-white/20 to-transparent -translate-x-1/2 -translate-y-1/2 origin-top animate-[spin_10s_linear_infinite] z-0 pointer-events-none mix-blend-overlay"></div>

      {/* Rain Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {rainParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-0 w-px h-8 bg-cyan-300/40"
            style={{
              left: `${particle.left}%`,
              animation: `fall ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>

      {/* Thief Silhouette */}
      <div className="absolute bottom-0 right-10 w-48 h-64 bg-black rounded-t-full z-10 opacity-90" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)' }}>
        {/* Abstract representation of a thief */}
      </div>

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/60 border-b border-cyan-500/30 flex items-center justify-between px-6 z-20 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-[#0a0e1a] px-3 py-1 rounded border border-cyan-800">
            <span className="text-cyan-400 font-bold">LVL</span>
            <span className="text-white">{playerLevel}</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <span>$</span>
            <span className="text-white font-mono">{money.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <span>💎</span>
            <span className="text-white font-mono">{diamonds}</span>
          </div>
        </div>
        <button onClick={onSettings} className="p-2 hover:bg-white/10 rounded transition-colors">
          ⚙️
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-12 md:px-24">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(0,212,255,0.8)] tracking-tighter">
            HEIST MASTER
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 tracking-widest mt-2 uppercase">
            Escape Plan
          </h2>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col space-y-3 w-full max-w-xs">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.onClick}
              className={`group relative px-6 py-3 bg-[#0a0e1a]/80 border border-cyan-900 hover:border-cyan-400 transition-all duration-300 text-left overflow-hidden ${index === 0 ? 'border-cyan-500 py-4 shadow-[0_0_15px_rgba(0,212,255,0.3)]' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-400/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              <span className={`relative z-10 font-bold tracking-wider ${index === 0 ? 'text-cyan-400 text-xl' : 'text-gray-300 group-hover:text-white'}`}>
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
