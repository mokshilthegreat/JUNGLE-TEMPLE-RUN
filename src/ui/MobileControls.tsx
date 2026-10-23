import React, { useState, useRef, useEffect } from 'react';

interface MobileControlsProps {
  onMove: (dir: { x: number; y: number }) => void;
  onAction: (action: string) => void;
  interactText?: string; // e.g. "HACK", "OPEN", "LOOT"
}

const MobileControls: React.FC<MobileControlsProps> = ({ onMove, onAction, interactText }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateJoystick(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateJoystick(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setStickPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const updateJoystick = (touch: React.Touch) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const maxDist = rect.width / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    
    setStickPos({ x: dx, y: dy });
    
    // Normalize -1 to 1
    onMove({
      x: dx / maxDist,
      y: dy / maxDist
    });
  };

  if (!isTouchDevice) {
    return null; // Don't render on desktop
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex justify-between items-end p-8 pb-12">
      
      {/* Left: Joystick */}
      <div 
        className="relative w-32 h-32 rounded-full border-2 border-white/20 bg-black/20 pointer-events-auto touch-none"
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div 
          className="absolute w-12 h-12 rounded-full bg-white/40 border border-white/60 shadow-lg top-1/2 left-1/2 -mt-6 -ml-6 transition-transform duration-75"
          style={{ transform: `translate(${stickPos.x}px, ${stickPos.y}px)` }}
        />
      </div>

      {/* Right: Action Buttons */}
      <div className="relative w-48 h-48 pointer-events-auto touch-none">
        {/* Interact Button (Top Left) */}
        {interactText && (
          <button 
            className="absolute top-0 left-0 w-16 h-16 rounded-full bg-cyan-500/50 border-2 border-cyan-300 text-white font-bold text-[10px] flex items-center justify-center active:scale-95 active:bg-cyan-500/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            onTouchStart={() => onAction('INTERACT')}
          >
            {interactText}
          </button>
        )}

        {/* Sprint Button (Top Right) */}
        <button 
          className="absolute top-4 right-0 w-14 h-14 rounded-full bg-orange-500/40 border-2 border-orange-300 text-white font-bold text-xs flex items-center justify-center active:scale-95 active:bg-orange-500/70"
          onTouchStart={() => onAction('SPRINT')}
        >
          🏃
        </button>

        {/* Attack/Takedown (Bottom Right) */}
        <button 
          className="absolute bottom-0 right-4 w-16 h-16 rounded-full bg-red-500/40 border-2 border-red-300 text-white font-bold text-lg flex items-center justify-center active:scale-95 active:bg-red-500/70"
          onTouchStart={() => onAction('ATTACK')}
        >
          👊
        </button>

        {/* Crouch (Bottom Left) */}
        <button 
          className="absolute bottom-4 left-4 w-14 h-14 rounded-full bg-blue-500/40 border-2 border-blue-300 text-white font-bold text-xs flex items-center justify-center active:scale-95 active:bg-blue-500/70"
          onTouchStart={() => onAction('CROUCH')}
        >
          🧎
        </button>
      </div>

    </div>
  );
};

export default MobileControls;
