import React from 'react';

interface InteractionPromptProps {
  text: string;
  keybind?: string; // default to 'E'
  visible: boolean;
}

const InteractionPrompt: React.FC<InteractionPromptProps> = ({ text, keybind = 'E', visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 pointer-events-none z-30 animate-bounce">
      <div className="bg-black/80 border border-cyan-500 px-3 py-1.5 rounded flex items-center shadow-[0_0_10px_rgba(6,182,212,0.5)] backdrop-blur-sm">
        <span className="bg-cyan-500 text-black font-black text-xs px-1.5 py-0.5 rounded mr-2 border border-cyan-400">
          {keybind}
        </span>
        <span className="text-white font-bold text-sm tracking-wide">
          {text}
        </span>
      </div>
    </div>
  );
};

export default InteractionPrompt;
