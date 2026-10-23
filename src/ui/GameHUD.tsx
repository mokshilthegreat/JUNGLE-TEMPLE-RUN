import React from 'react';

interface GameHUDProps {
  playerLevel: number;
  xpProgress: number; // 0-100
  health: number; // 0-100
  armor: number; // 0-100
  stamina: number; // 0-100
  currentObjective: string;
  money: number;
  alarmMeter: number; // 0-100
  detectionMeter: number; // 0-100
  bagCurrent: number;
  bagMax: number;
  equipment: { id: string; icon: string; count?: number }[];
  activeEquipmentIndex: number;
}

const GameHUD: React.FC<GameHUDProps> = ({
  playerLevel, xpProgress, health, armor, stamina,
  currentObjective, money, alarmMeter, detectionMeter,
  bagCurrent, bagMax, equipment, activeEquipmentIndex
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between font-sans selection:bg-transparent">
      
      {/* Top Row */}
      <div className="flex justify-between items-start">
        {/* Top Left: Player Stats */}
        <div className="flex flex-col space-y-2 w-64 bg-black/60 p-3 rounded border border-cyan-900/50 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 bg-cyan-900 border border-cyan-500 flex items-center justify-center font-black text-white rounded">
              {playerLevel}
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-cyan-400 font-bold mb-1">LEVEL PROGRESS</div>
              <div className="h-1.5 w-full bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${xpProgress}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center">
              <span className="text-[10px] w-12 text-red-400 font-bold">HP</span>
              <div className="h-2 flex-1 bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${health}%` }}></div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-[10px] w-12 text-blue-400 font-bold">AP</span>
              <div className="h-2 flex-1 bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${armor}%` }}></div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-[10px] w-12 text-yellow-400 font-bold">SP</span>
              <div className="h-2 flex-1 bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${stamina}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Center: Objective */}
        <div className="bg-black/80 border-t-2 border-amber-500 px-6 py-2 rounded-b shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
          <div className="text-[10px] text-amber-500 font-bold text-center tracking-widest mb-1">CURRENT OBJECTIVE</div>
          <div className="text-white font-bold text-sm text-center">{currentObjective}</div>
        </div>

        {/* Top Right: Minimap Area */}
        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
          <div className="w-48 h-48 bg-black/80 border border-cyan-500/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,212,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
            <div className="absolute top-2 left-2 text-[10px] text-cyan-500 font-mono">RADAR OFFLINE</div>
            {/* Dummy map dots */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"></div>
            <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
          </div>
          
          <div className="w-48 bg-black/60 p-2 rounded border border-cyan-900/50 text-right">
            <div className="text-green-400 font-mono text-lg font-bold">
              ${money.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Center Alerts (Detection/Alarm) */}
      <div className="flex justify-center mt-10">
        {detectionMeter > 0 && (
          <div className="w-64">
            <div className="text-center text-red-500 font-black text-sm mb-1 tracking-widest animate-pulse">DETECTING</div>
            <div className="h-3 w-full bg-black/80 border border-red-900 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${detectionMeter}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-end mt-auto pointer-events-auto">
        {/* Bottom Left: Bag */}
        <div className="bg-black/60 p-3 rounded border border-cyan-900/50 backdrop-blur-sm">
          <div className="text-[10px] text-gray-400 font-bold mb-1">LOOT BAG</div>
          <div className="text-white font-bold flex items-center">
            <span className="text-xl mr-2">🎒</span>
            {bagCurrent} / {bagMax} kg
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded mt-2 overflow-hidden">
            <div className={`h-full ${bagCurrent/bagMax > 0.8 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${(bagCurrent/bagMax)*100}%` }}></div>
          </div>
        </div>

        {/* Bottom Right: Equipment slots */}
        <div className="flex space-x-2">
          {equipment.map((item, index) => (
            <div key={item.id} className={`relative w-12 h-12 bg-black/80 rounded border-2 flex items-center justify-center text-xl transition-all ${
              activeEquipmentIndex === index 
                ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] -translate-y-2' 
                : 'border-gray-800 opacity-60'
            }`}>
              {item.icon}
              <div className="absolute top-0 left-1 text-[10px] text-gray-400 font-bold">{index + 1}</div>
              {item.count !== undefined && (
                <div className="absolute bottom-0 right-1 text-[10px] text-white font-mono">{item.count}</div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default GameHUD;
