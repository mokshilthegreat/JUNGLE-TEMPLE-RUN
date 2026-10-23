import os

# Update App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_text = f.read()

app_text = app_text.replace("import { GameEngine } from \"./engine/GameEngine\";", "import { GameEngine3D } from \"./engine/GameEngine3D\";")
app_text = app_text.replace("import { GameEngine } from './engine/GameEngine';", "import { GameEngine3D } from './engine/GameEngine3D';")
app_text = app_text.replace("new GameEngine(", "new GameEngine3D(")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_text)

print("App.tsx updated!")

# Update GameCanvas.tsx
canvas_code = '''import React, { useEffect, useRef } from 'react';
import { GameEngine3D } from '../engine/GameEngine3D';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../engine/constants';

interface GameCanvasProps {
  engine: GameEngine3D;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    engine.initRenderer(canvas);

    let animId: number;

    const renderLoop = () => {
      engine.render();
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          engine.handleLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          engine.handleRight();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          e.preventDefault();
          engine.handleJump();
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          engine.handleSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [engine, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPaused) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || isPaused) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    touchStartPos.current = null;

    const minSwipeDistance = 25;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < minSwipeDistance) return;

    if (absX > absY) {
      if (dx > 0) {
        engine.handleRight();
      } else {
        engine.handleLeft();
      }
    } else {
      if (dy > 0) {
        engine.handleSlide();
      } else {
        engine.handleJump();
      }
    }
  };

  const mouseStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPaused) return;
    mouseStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStartPos.current || isPaused) return;
    const dx = e.clientX - mouseStartPos.current.x;
    const dy = e.clientY - mouseStartPos.current.y;
    mouseStartPos.current = null;

    const minSwipe = 25;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < minSwipe) return;

    if (absX > absY) {
      if (dx > 0) engine.handleRight();
      else engine.handleLeft();
    } else {
      if (dy > 0) engine.handleSlide();
      else engine.handleJump();
    }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={VIRTUAL_WIDTH}
        height={VIRTUAL_HEIGHT}
        className="game-viewport-canvas w-full h-full object-cover"
      />

      {engine.activeTurnPrompt && !isPaused && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center animate-bounce">
          <div className="bg-amber-500/90 border-2 border-yellow-300 px-6 py-2 rounded-2xl text-white font-black text-xl tracking-wider uppercase shadow-[0_0_20px_rgba(234,179,8,0.8)] flex items-center gap-2">
            {engine.activeTurnPrompt === 'left' ? '?? TURN LEFT' : 'TURN RIGHT ??'}
          </div>
          <span className="text-xs font-bold text-yellow-300 mt-1 drop-shadow">Swipe or Press Arrow Key</span>
        </div>
      )}
    </div>
  );
};
'''

with open('src/components/GameCanvas.tsx', 'w', encoding='utf-8') as f:
    f.write(canvas_code)

print("GameCanvas.tsx updated!")
