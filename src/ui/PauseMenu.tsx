import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
  onExit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, onSettings, onHowToPlay, onExit }) => {
  const buttons = [
    { label: 'RESUME', onClick: onResume, primary: true },
    { label: 'RESTART MISSION', onClick: onRestart },
    { label: 'SETTINGS', onClick: onSettings },
    { label: 'HOW TO PLAY', onClick: onHowToPlay },
    { label: 'ABORT MISSION', onClick: onExit, danger: true },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm font-sans">
      <div className="w-full max-w-md bg-[#0a0e1a] border border-cyan-900/50 rounded-lg p-8 shadow-[0_0_30px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-widest mb-8">
          PAUSED
        </h1>
        
        <div className="flex flex-col space-y-4">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`w-full py-3 px-4 font-bold tracking-wider rounded transition-all text-center ${
                btn.primary 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : btn.danger
                    ? 'bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 hover:border-red-500'
                    : 'bg-black/50 hover:bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
