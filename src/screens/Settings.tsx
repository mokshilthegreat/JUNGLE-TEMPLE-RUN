import React, { useState } from 'react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [sound, setSound] = useState(80);
  const [music, setMusic] = useState(60);
  const [sfx, setSfx] = useState(100);
  const [vibration, setVibration] = useState(true);
  const [showFps, setShowFps] = useState(false);
  const [difficulty, setDifficulty] = useState('Normal');
  const [graphics, setGraphics] = useState('High');

  return (
    <div className="w-full h-screen bg-[#050B14] text-white flex flex-col font-sans">
      <div className="h-16 border-b border-cyan-900 flex items-center px-6 bg-black/50">
        <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
          &larr; BACK
        </button>
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          SETTINGS
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column */}
          <div className="space-y-8">
            <section className="bg-[#0a0e1a] p-6 rounded border border-cyan-900/30">
              <h2 className="text-xl font-bold text-cyan-500 mb-6 border-b border-cyan-900/30 pb-2">AUDIO</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-300">
                    <span>Master Volume</span>
                    <span>{sound}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={sound} onChange={e => setSound(Number(e.target.value))} className="w-full accent-cyan-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-300">
                    <span>Music Volume</span>
                    <span>{music}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={music} onChange={e => setMusic(Number(e.target.value))} className="w-full accent-cyan-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-300">
                    <span>SFX Volume</span>
                    <span>{sfx}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={sfx} onChange={e => setSfx(Number(e.target.value))} className="w-full accent-cyan-500" />
                </div>
              </div>
            </section>

            <section className="bg-[#0a0e1a] p-6 rounded border border-cyan-900/30">
              <h2 className="text-xl font-bold text-cyan-500 mb-6 border-b border-cyan-900/30 pb-2">GAMEPLAY</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Difficulty</span>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="bg-black border border-cyan-900 rounded p-2 text-white outline-none focus:border-cyan-500">
                    <option>Easy</option>
                    <option>Normal</option>
                    <option>Hard</option>
                    <option>Master</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Vibration (Controllers)</span>
                  <button onClick={() => setVibration(!vibration)} className={`w-12 h-6 rounded-full transition-colors relative ${vibration ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${vibration ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <section className="bg-[#0a0e1a] p-6 rounded border border-cyan-900/30">
              <h2 className="text-xl font-bold text-cyan-500 mb-6 border-b border-cyan-900/30 pb-2">DISPLAY</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Graphics Quality</span>
                  <select value={graphics} onChange={e => setGraphics(e.target.value)} className="bg-black border border-cyan-900 rounded p-2 text-white outline-none focus:border-cyan-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Ultra</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show FPS</span>
                  <button onClick={() => setShowFps(!showFps)} className={`w-12 h-6 rounded-full transition-colors relative ${showFps ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${showFps ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-[#0a0e1a] p-6 rounded border border-cyan-900/30">
              <h2 className="text-xl font-bold text-cyan-500 mb-6 border-b border-cyan-900/30 pb-2">CONTROLS</h2>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-gray-400">Move</div><div className="font-mono text-cyan-300">W A S D / Arrows</div>
                <div className="text-gray-400">Sprint</div><div className="font-mono text-cyan-300">SHIFT</div>
                <div className="text-gray-400">Crouch / Sneak</div><div className="font-mono text-cyan-300">C / CTRL</div>
                <div className="text-gray-400">Interact / Hack</div><div className="font-mono text-cyan-300">E</div>
                <div className="text-gray-400">Attack / Takedown</div><div className="font-mono text-cyan-300">SPACE / Left Click</div>
                <div className="text-gray-400">Use Item</div><div className="font-mono text-cyan-300">F</div>
                <div className="text-gray-400">Pause</div><div className="font-mono text-cyan-300">ESC</div>
              </div>
            </section>

            <div className="flex space-x-4 pt-4">
              <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded transition-colors">
                RESET DEFAULTS
              </button>
              <button onClick={onBack} className="flex-1 py-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                SAVE & APPLY
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
