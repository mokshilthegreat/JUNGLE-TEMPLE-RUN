import React from 'react';

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="absolute top-4 right-4 z-40 w-12 h-12 bg-black/50 border border-cyan-900/50 rounded flex flex-col items-center justify-center space-y-1.5 hover:bg-black/80 hover:border-cyan-500 transition-all backdrop-blur-sm group"
      aria-label="Pause Menu"
    >
      <div className="w-6 h-0.5 bg-gray-400 group-hover:bg-cyan-400 transition-colors"></div>
      <div className="w-6 h-0.5 bg-gray-400 group-hover:bg-cyan-400 transition-colors"></div>
      <div className="w-6 h-0.5 bg-gray-400 group-hover:bg-cyan-400 transition-colors"></div>
      
      {/* Tiny ESC key hint for desktop */}
      <div className="absolute -bottom-4 text-[9px] text-gray-500 font-mono hidden md:block">ESC</div>
    </button>
  );
};

export default MenuButton;
