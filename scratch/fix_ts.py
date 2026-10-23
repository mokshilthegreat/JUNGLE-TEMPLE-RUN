import os

# Fix MobileControls.tsx
mobile_code = '''import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface EngineControls {
  handleLeft: () => void;
  handleRight: () => void;
  handleJump: () => void;
  handleSlide: () => void;
}

interface MobileControlsProps {
  engine: EngineControls;
  visible?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ engine, visible = true }) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none z-20 flex justify-between items-end max-w-md mx-auto">
      <div className="flex gap-2 pointer-events-auto">
        <button
          onTouchStart={(e) => { e.preventDefault(); engine.handleLeft(); }}
          onMouseDown={(e) => { e.preventDefault(); engine.handleLeft(); }}
          className="w-13 h-13 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 active:bg-amber-700 active:scale-95 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all"
          aria-label="Move Left"
        >
          <ArrowLeft size={26} />
        </button>

        <button
          onTouchStart={(e) => { e.preventDefault(); engine.handleRight(); }}
          onMouseDown={(e) => { e.preventDefault(); engine.handleRight(); }}
          className="w-13 h-13 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 active:bg-amber-700 active:scale-95 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all"
          aria-label="Move Right"
        >
          <ArrowRight size={26} />
        </button>
      </div>

      <div className="flex gap-2 pointer-events-auto">
        <button
          onTouchStart={(e) => { e.preventDefault(); engine.handleSlide(); }}
          onMouseDown={(e) => { e.preventDefault(); engine.handleSlide(); }}
          className="w-13 h-13 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/60 active:bg-emerald-700 active:scale-95 text-emerald-300 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all"
          aria-label="Slide"
        >
          <ArrowDown size={26} />
        </button>

        <button
          onTouchStart={(e) => { e.preventDefault(); engine.handleJump(); }}
          onMouseDown={(e) => { e.preventDefault(); engine.handleJump(); }}
          className="w-13 h-13 rounded-2xl bg-amber-900/90 border-2 border-yellow-400 active:bg-amber-600 active:scale-95 text-yellow-300 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all"
          aria-label="Jump"
        >
          <ArrowUp size={26} />
        </button>
      </div>
    </div>
  );
};
'''

with open('src/components/MobileControls.tsx', 'w', encoding='utf-8') as f:
    f.write(mobile_code)

print('MobileControls.tsx fixed!')

# Fix TrackManager3D.ts
with open('src/engine/TrackManager3D.ts', 'r', encoding='utf-8') as f:
    track_txt = f.read()

track_txt = track_txt.replace("private torchLightMat: THREE.MeshStandardMaterial;", "private torchLightMat: THREE.MeshBasicMaterial;")
track_txt = track_txt.replace("private woodMat: THREE.MeshStandardMaterial;\n", "")

with open('src/engine/TrackManager3D.ts', 'w', encoding='utf-8') as f:
    f.write(track_txt)

print('TrackManager3D.ts fixed!')

# Fix GameEngine3D.ts
with open('src/engine/GameEngine3D.ts', 'r', encoding='utf-8') as f:
    eng_txt = f.read()

eng_txt = eng_txt.replace("import type { GameStats, Lane, CharacterSkin, ObstacleType, CollectibleType } from '../types/game';", "import type { GameStats, Lane, CharacterSkin, CollectibleType } from '../types/game';")
eng_txt = eng_txt.replace("import { TrackManager3D, TurnZone } from './TrackManager3D';", "import { TrackManager3D } from './TrackManager3D';\nimport type { TurnZone } from './TrackManager3D';")
eng_txt = eng_txt.replace("private powerUpTimer: number = 10;", "")
eng_txt = eng_txt.replace("private targetCameraPos: THREE.Vector3 = new THREE.Vector3();", "")
eng_txt = eng_txt.replace("private handleSpawning(moveDist: number, dt: number) {", "private handleSpawning() {")
eng_txt = eng_txt.replace("this.handleSpawning(moveDist, dt);", "this.handleSpawning();")

with open('src/engine/GameEngine3D.ts', 'w', encoding='utf-8') as f:
    f.write(eng_txt)

print('GameEngine3D.ts fixed!')
