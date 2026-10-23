import React, { useEffect, useState } from 'react';

interface FloatingTextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'money' | 'damage' | 'bonus' | 'info';
  onComplete: (id: string) => void;
}

const FloatingText: React.FC<FloatingTextProps> = ({ id, text, x, y, type, onComplete }) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      setTimeout(() => onComplete(id), 300); // Wait for fade out animation
    }, 1200);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  let colorClass = 'text-white';
  if (type === 'money') colorClass = 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]';
  if (type === 'damage') colorClass = 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] scale-110';
  if (type === 'bonus') colorClass = 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]';
  if (type === 'info') colorClass = 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]';

  return (
    <div
      className={`absolute pointer-events-none z-40 font-black font-mono transition-all duration-1000 ease-out ${colorClass} ${
        active ? 'opacity-100 -translate-y-8' : 'opacity-0 -translate-y-16'
      }`}
      style={{ left: x, top: y }}
    >
      {text}
    </div>
  );
};

export default FloatingText;
