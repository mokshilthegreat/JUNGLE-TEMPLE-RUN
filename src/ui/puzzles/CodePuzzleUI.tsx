import React, { useState } from 'react';

interface CodePuzzleUIProps {
  targetCode: string;
  maxAttempts?: number;
  onSuccess: () => void;
  onFailure: () => void;
  onCancel: () => void;
}

const CodePuzzleUI: React.FC<CodePuzzleUIProps> = ({ targetCode, maxAttempts = 3, onSuccess, onFailure, onCancel }) => {
  const [input, setInput] = useState<string>('');
  const [attempts, setAttempts] = useState<string[]>([]);
  const codeLength = targetCode.length;

  const handleKeyPress = (char: string) => {
    if (input.length < codeLength) {
      setInput(prev => prev + char);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  const handleSubmit = () => {
    if (input.length !== codeLength) return;

    const newAttempts = [...attempts, input];
    setAttempts(newAttempts);
    setInput('');

    if (input === targetCode) {
      setTimeout(onSuccess, 500);
    } else if (newAttempts.length >= maxAttempts) {
      setTimeout(onFailure, 500);
    }
  };

  const renderFeedback = (attemptStr: string) => {
    return (
      <div className="flex space-x-2 mb-2">
        {attemptStr.split('').map((char, i) => {
          let status = 'bg-gray-800 text-gray-500'; // not in code
          if (targetCode[i] === char) {
            status = 'bg-green-600/30 border-green-500 text-green-400'; // exact match
          } else if (targetCode.includes(char)) {
            status = 'bg-yellow-600/30 border-yellow-500 text-yellow-400'; // wrong position
          }
          
          return (
            <div key={i} className={`w-8 h-10 border rounded flex items-center justify-center font-mono font-bold ${status}`}>
              {char}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 font-mono">
      <div className="bg-[#051014] border-2 border-cyan-800 p-6 rounded-lg w-full max-w-sm shadow-[0_0_30px_rgba(0,100,150,0.5)]">
        
        <div className="text-center mb-6">
          <h2 className="text-cyan-400 text-xl font-bold tracking-widest">SECURITY TERMINAL</h2>
          <p className="text-xs text-cyan-700 mt-1">ENTER {codeLength}-DIGIT OVERRIDE CODE</p>
        </div>

        {/* Display */}
        <div className="bg-black border border-cyan-900 p-4 mb-4 rounded flex justify-center space-x-3 h-16 items-center">
          {Array.from({ length: codeLength }).map((_, i) => (
            <div key={i} className="text-3xl text-white font-bold border-b-2 border-cyan-800 w-6 text-center pb-1">
              {input[i] || '_'}
            </div>
          ))}
        </div>

        {/* History */}
        <div className="mb-6 min-h-[120px] flex flex-col justify-end">
          {attempts.map((att, i) => (
            <div key={i} className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">ATTEMPT {i+1}</span>
              {renderFeedback(att)}
            </div>
          ))}
          <div className="text-right text-xs text-cyan-600 mt-2">
            ATTEMPTS REMAINING: {maxAttempts - attempts.length}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1','2','3','4','5','6','7','8','9','C','0','E'].map(key => (
            <button
              key={key}
              onClick={() => {
                if (key === 'C') handleClear();
                else if (key === 'E') handleSubmit();
                else handleKeyPress(key);
              }}
              className={`py-3 rounded font-bold text-lg transition-colors border ${
                key === 'C' ? 'bg-red-900/30 text-red-400 border-red-900/50 hover:bg-red-800/50' :
                key === 'E' ? 'bg-green-900/30 text-green-400 border-green-900/50 hover:bg-green-800/50' :
                'bg-[#0a1a24] text-cyan-100 border-cyan-900/50 hover:bg-cyan-900/50'
              }`}
            >
              {key === 'E' ? '↵' : key}
            </button>
          ))}
        </div>

        <button onClick={onCancel} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm tracking-widest transition-colors">
          CANCEL
        </button>

      </div>
    </div>
  );
};

export default CodePuzzleUI;
