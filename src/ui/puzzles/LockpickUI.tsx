import React, { useState, useEffect, useRef } from 'react';

interface LockpickUIProps {
  numPins?: number;
  maxPicks?: number;
  onSuccess: () => void;
  onFailure: () => void;
  onCancel: () => void;
}

const LockpickUI: React.FC<LockpickUIProps> = ({ numPins = 4, maxPicks = 3, onSuccess, onFailure, onCancel }) => {
  const [picks, setPicks] = useState(maxPicks);
  const [currentPin, setCurrentPin] = useState(0);
  const [pinHeights, setPinHeights] = useState<number[]>(Array(numPins).fill(0)); // 0-100
  const [pickY, setPickY] = useState(50);
  
  // Hidden correct heights
  const [targetHeights] = useState(() => Array.from({ length: numPins }, () => 20 + Math.random() * 60));

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const pct = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
      setPickY(pct);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSetPin = () => {
    const target = targetHeights[currentPin];
    const diff = Math.abs(pickY - target);

    if (diff < 10) {
      // Success for this pin
      const newHeights = [...pinHeights];
      newHeights[currentPin] = target;
      setPinHeights(newHeights);
      
      if (currentPin + 1 >= numPins) {
        setTimeout(onSuccess, 500);
      } else {
        setCurrentPin(prev => prev + 1);
      }
    } else {
      // Snap pick
      setPicks(prev => prev - 1);
      if (picks - 1 <= 0) {
        setTimeout(onFailure, 500);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 font-sans select-none">
      <div className="bg-[#111] border-4 border-gray-800 p-8 rounded-full w-[500px] h-[500px] shadow-2xl relative flex flex-col items-center justify-center overflow-hidden">
        
        <div className="absolute top-8 text-center">
          <h2 className="text-gray-400 font-bold tracking-widest text-lg">TUMBLER LOCK</h2>
          <p className="text-xs text-gray-500">Move mouse up/down to align, click to set</p>
        </div>

        <div className="absolute bottom-12 flex space-x-2">
          {Array.from({ length: maxPicks }).map((_, i) => (
            <div key={i} className={`w-8 h-1 rounded ${i < picks ? 'bg-amber-500' : 'bg-gray-800'}`}></div>
          ))}
        </div>
        <div className="absolute bottom-6 text-xs text-gray-500">PICKS REMAINING</div>

        {/* Lock Cylinder */}
        <div className="w-64 h-64 border-4 border-gray-700 rounded-full relative bg-gradient-to-b from-gray-800 to-gray-900" onClick={handleSetPin}>
          
          {/* Pins Area */}
          <div ref={containerRef} className="absolute inset-x-8 top-8 bottom-8 flex justify-between items-end pb-8">
            {Array.from({ length: numPins }).map((_, i) => (
              <div key={i} className="w-8 h-full relative">
                {/* Chamber */}
                <div className="absolute inset-x-0 bottom-0 top-0 bg-black/50 border-x border-gray-700"></div>
                
                {/* The Pin */}
                <div 
                  className={`absolute inset-x-1 bottom-0 bg-gradient-to-b from-amber-200 to-amber-600 rounded-t-sm transition-all duration-100 ${
                    i < currentPin ? 'opacity-50' : 'opacity-100'
                  }`}
                  style={{ 
                    height: i < currentPin ? `${100 - pinHeights[i]}%` : i === currentPin ? `${100 - pickY}%` : '80%',
                  }}
                >
                  <div className="w-full h-1 bg-black/20 mt-1"></div>
                </div>

                {/* Pin Driver (top part) */}
                <div 
                  className="absolute inset-x-1 top-0 bg-gradient-to-b from-gray-400 to-gray-600 border-b border-black transition-all duration-100"
                  style={{
                    height: i < currentPin ? `${pinHeights[i]}%` : i === currentPin ? `${pickY}%` : '20%',
                  }}
                ></div>

                {/* Indicator for current pin target (dev/easy mode, usually hidden in real game) */}
                {/* <div className="absolute inset-x-0 border-t-2 border-red-500" style={{ top: `${targetHeights[i]}%` }}></div> */}
              </div>
            ))}
          </div>

          {/* The Pick */}
          <div 
            className="absolute right-0 w-64 h-2 bg-gradient-to-r from-gray-400 to-gray-300 origin-right transition-transform duration-75 pointer-events-none"
            style={{ 
              top: `${pickY}%`, 
              transform: `translateX(120px) rotate(${15 - pickY/4}deg)`,
              borderTopLeftRadius: '5px',
              borderBottomLeftRadius: '5px'
            }}
          >
            <div className="absolute -left-2 top-0 bottom-0 w-4 bg-gray-300 rounded-l-full rotate-45 origin-right"></div>
          </div>

        </div>

        <button onClick={onCancel} className="absolute top-8 right-8 text-gray-500 hover:text-white font-bold p-2">
          ✕
        </button>
      </div>
    </div>
  );
};

export default LockpickUI;
