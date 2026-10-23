import React, { useState } from 'react';

export interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

interface MissionObjectivePanelProps {
  objectives: Objective[];
}

const MissionObjectivePanel: React.FC<MissionObjectivePanelProps> = ({ objectives }) => {
  const [expanded, setExpanded] = useState(true);

  const completedCount = objectives.filter(o => o.completed).length;

  return (
    <div className="absolute top-24 left-4 z-10 w-64 bg-black/70 border border-cyan-900/50 rounded overflow-hidden font-sans backdrop-blur-md">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-2 bg-cyan-900/30 hover:bg-cyan-900/50 transition-colors"
      >
        <span className="text-[10px] font-bold text-cyan-400 tracking-wider">
          OBJECTIVES [{completedCount}/{objectives.length}]
        </span>
        <span className="text-cyan-500 text-xs">{expanded ? '▼' : '▶'}</span>
      </button>
      
      {expanded && (
        <div className="p-3 space-y-2">
          {objectives.map((obj) => (
            <div key={obj.id} className="flex items-start">
              <div className={`mt-0.5 mr-2 text-sm ${obj.completed ? 'text-green-500' : 'text-gray-500'}`}>
                {obj.completed ? '☑' : '☐'}
              </div>
              <div className={`text-xs ${obj.completed ? 'text-gray-400 line-through' : 'text-white font-medium'}`}>
                {obj.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionObjectivePanel;
