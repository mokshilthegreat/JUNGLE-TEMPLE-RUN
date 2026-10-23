import React, { useState, useEffect } from 'react';

interface CyberTerminalUIProps {
  onSuccess: () => void;
  onFailure: () => void;
  onCancel: () => void;
  gridSize?: number;
  sequenceLength?: number;
}

const HEX_CHARS = ['1C', 'E9', '55', 'BD', '7A'];

const CyberTerminalUI: React.FC<CyberTerminalUIProps> = ({ onSuccess, onFailure, onCancel, gridSize = 5, sequenceLength = 4 }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetSeq, setTargetSeq] = useState<string[]>([]);
  const [currentSeq, setCurrentSeq] = useState<string[]>([]);
  const [isRowActive, setIsRowActive] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // row or col index
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState<'hacking' | 'success' | 'failure'>('hacking');

  useEffect(() => {
    // Generate random grid
    const newGrid = Array(gridSize).fill(0).map(() => 
      Array(gridSize).fill(0).map(() => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)])
    );
    setGrid(newGrid);

    // Generate valid target sequence (simple version)
    const seq = Array(sequenceLength).fill(0).map(() => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]);
    setTargetSeq(seq);
  }, [gridSize, sequenceLength]);

  useEffect(() => {
    if (status !== 'hacking') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('failure');
          setTimeout(onFailure, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, onFailure]);

  const handleCellClick = (r: number, c: number, value: string) => {
    if (status !== 'hacking') return;
    
    // Check if valid click
    if (isRowActive && r !== activeIndex) return;
    if (!isRowActive && c !== activeIndex) return;

    const newSeq = [...currentSeq, value];
    setCurrentSeq(newSeq);

    // Empty cell
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = '--';
    setGrid(newGrid);

    // Toggle row/col
    setIsRowActive(!isRowActive);
    setActiveIndex(isRowActive ? c : r);

    // Check win/loss
    if (newSeq[newSeq.length - 1] !== targetSeq[newSeq.length - 1]) {
      // Mismatch
      setStatus('failure');
      setTimeout(onFailure, 1500);
    } else if (newSeq.length === sequenceLength) {
      // Success
      setStatus('success');
      setTimeout(onSuccess, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 font-mono text-green-500">
      {/* Matrix background effect via CSS */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className={`relative z-10 w-full max-w-4xl p-8 border-2 bg-black/80 shadow-[0_0_50px_rgba(0,255,0,0.2)] ${
        status === 'success' ? 'border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.8)]' : 
        status === 'failure' ? 'border-red-500 text-red-500 shadow-[0_0_50px_rgba(255,0,0,0.8)]' : 'border-green-800'
      }`}>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-widest mb-1">CYBER_LINK_V4.2</h1>
            <div className="text-sm opacity-70">BYPASSING FIREWALL...</div>
          </div>
          <div className="text-right">
            <div className="text-sm mb-1">TRACE INITIATED</div>
            <div className={`text-2xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {status === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="text-6xl font-black animate-pulse text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,1)]">ACCESS GRANTED</div>
          </div>
        )}

        {status === 'failure' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="text-6xl font-black animate-pulse text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]">TRACE COMPLETED</div>
          </div>
        )}

        <div className="flex gap-12">
          {/* Main Grid */}
          <div className="flex-1">
            <div className="bg-[#051005] border border-green-900/50 p-6 rounded">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                {grid.map((row, r) => row.map((cell, c) => {
                  const isActive = status === 'hacking' && ((isRowActive && r === activeIndex) || (!isRowActive && c === activeIndex));
                  const isUsed = cell === '--';
                  
                  return (
                    <button
                      key={`${r}-${c}`}
                      disabled={isUsed || (!isActive && status === 'hacking')}
                      onClick={() => handleCellClick(r, c, cell)}
                      className={`aspect-square flex items-center justify-center text-xl font-bold transition-colors ${
                        isUsed ? 'text-green-900/30' :
                        isActive ? 'bg-green-900/40 text-green-300 hover:bg-green-700 hover:text-white border border-green-500/50 cursor-pointer shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                        'text-green-700 bg-[#0a1a0a]'
                      }`}
                    >
                      {cell}
                    </button>
                  );
                }))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-64 flex flex-col">
            <div className="bg-[#051005] border border-green-900/50 p-4 rounded mb-6">
              <h2 className="text-xs tracking-widest mb-3 opacity-70 border-b border-green-900/50 pb-2">TARGET SEQUENCE</h2>
              <div className="flex space-x-2">
                {targetSeq.map((hex, i) => (
                  <div key={i} className="bg-green-900/20 px-2 py-1 rounded text-green-400 font-bold border border-green-900/50">
                    {hex}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#051005] border border-green-900/50 p-4 rounded flex-1">
              <h2 className="text-xs tracking-widest mb-3 opacity-70 border-b border-green-900/50 pb-2">UPLOAD BUFFER</h2>
              <div className="flex flex-col space-y-2">
                {Array.from({ length: sequenceLength }).map((_, i) => (
                  <div key={i} className={`h-10 border flex items-center justify-center font-bold text-lg ${
                    i < currentSeq.length 
                      ? currentSeq[i] === targetSeq[i]
                        ? 'border-green-500 bg-green-900/40 text-green-400'
                        : 'border-red-500 bg-red-900/40 text-red-500' // Should technically trigger fail immediately based on logic above, but for visual completeness
                      : 'border-green-900/30 bg-black/50 text-green-900'
                  }`}>
                    {currentSeq[i] || '[  ]'}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onCancel} className="mt-6 py-3 border border-green-900 text-green-700 hover:text-green-400 hover:border-green-500 hover:bg-green-900/20 transition-colors font-bold tracking-widest">
              DISCONNECT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CyberTerminalUI;
