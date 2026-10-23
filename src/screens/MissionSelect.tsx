import React, { useState } from 'react';

interface MissionSelectProps {
  onBack: () => void;
  onStartMission: (missionId: number) => void;
  playerLevel: number;
}

interface Mission {
  id: number;
  name: string;
  location: string;
  difficulty: number;
  requiredLevel: number;
  rating: number; // 0-3
  description: string;
  objectives: string[];
  rewards: { money: number; xp: number; diamonds: number };
  guardCount: number;
  securityLevel: string;
}

const generateMissions = (): Mission[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `Mission ${i + 1}: ${['The Bank Job', 'Jewel Heist', 'Data Breach', 'Art Theft'][i % 4]}`,
    location: ['Downtown', 'Financial District', 'Tech Park', 'Museum Area'][i % 4],
    difficulty: Math.min(5, Math.ceil((i + 1) / 6)),
    requiredLevel: Math.floor(i / 2) + 1,
    rating: i < 5 ? Math.floor(Math.random() * 4) : 0,
    description: `Infiltrate the ${['bank', 'jewelry store', 'server room', 'gallery'][i % 4]} and extract the target without being detected.`,
    objectives: [
      'Infiltrate the building',
      'Disable security systems',
      'Acquire the target',
      'Escape undetected',
    ],
    rewards: {
      money: (i + 1) * 1000,
      xp: (i + 1) * 150,
      diamonds: (i + 1) * 2,
    },
    guardCount: 3 + Math.floor(i / 2),
    securityLevel: ['Low', 'Medium', 'High', 'Extreme'][Math.min(3, Math.floor(i / 8))],
  }));
};

const MissionSelect: React.FC<MissionSelectProps> = ({ onBack, onStartMission, playerLevel }) => {
  const missions = generateMissions();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(missions[0]);

  return (
    <div className="w-full h-screen bg-[#0a0e1a] text-white font-sans flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-cyan-900 flex items-center px-6 bg-black/50">
        <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold mr-6 transition-colors">
          &larr; BACK
        </button>
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          MISSIONS
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mission List */}
        <div className="w-2/3 h-full overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions.map((mission) => {
            const isLocked = playerLevel < mission.requiredLevel;
            const isSelected = selectedMission?.id === mission.id;
            return (
              <button
                key={mission.id}
                onClick={() => !isLocked && setSelectedMission(mission)}
                className={`relative p-4 rounded border text-left transition-all ${
                  isLocked
                    ? 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'border-cyan-900/50 bg-black/40 hover:border-cyan-700 hover:bg-black/60'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-400">#{mission.id}</span>
                  <div className="flex">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < mission.rating ? 'text-amber-400' : 'text-gray-700'}`}>★</span>
                    ))}
                  </div>
                </div>
                <h3 className={`font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>{mission.name}</h3>
                <div className="text-sm text-cyan-500 mb-2 flex items-center">
                  <span className="mr-1">📍</span> {mission.location}
                </div>
                
                {isLocked ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded">
                    <span className="text-red-500 font-bold text-sm tracking-wider">🔒 UNLOCKS AT LVL {mission.requiredLevel}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">
                    Difficulty: {'⭐'.repeat(mission.difficulty)}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Mission Details Panel */}
        <div className="w-1/3 h-full border-l border-cyan-900 bg-black/80 p-8 overflow-y-auto flex flex-col">
          {selectedMission ? (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-black text-white mb-2">{selectedMission.name}</h2>
                <p className="text-cyan-400 flex items-center mb-4">📍 {selectedMission.location}</p>
                <p className="text-gray-300 leading-relaxed">{selectedMission.description}</p>
              </div>

              <div className="bg-[#0a0e1a] border border-cyan-900/50 p-4 rounded mb-6">
                <h3 className="font-bold text-cyan-500 mb-3 border-b border-cyan-900/50 pb-2">OBJECTIVES</h3>
                <ul className="space-y-2">
                  {selectedMission.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="text-cyan-500 mr-2">◈</span> {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0a0e1a] border border-cyan-900/50 p-3 rounded">
                  <span className="text-xs text-gray-500 block">SECURITY</span>
                  <span className="font-bold text-amber-500">{selectedMission.securityLevel}</span>
                </div>
                <div className="bg-[#0a0e1a] border border-cyan-900/50 p-3 rounded">
                  <span className="text-xs text-gray-500 block">GUARDS</span>
                  <span className="font-bold text-red-400">{selectedMission.guardCount}</span>
                </div>
              </div>

              <div className="bg-[#0a0e1a] border border-cyan-900/50 p-4 rounded mb-auto">
                <h3 className="font-bold text-amber-400 mb-3 border-b border-cyan-900/50 pb-2">REWARDS</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CASH</span>
                    <span className="text-green-400">+${selectedMission.rewards.money.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP</span>
                    <span className="text-cyan-400">+{selectedMission.rewards.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">DIAMONDS</span>
                    <span className="text-purple-400">+{selectedMission.rewards.diamonds}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartMission(selectedMission.id)}
                className="w-full mt-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-widest rounded transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
              >
                START MISSION
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
              Select a mission
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionSelect;
