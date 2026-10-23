import React, { useState, useRef, useEffect } from 'react';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';
import { GameScreen, HUDData, MissionResult } from './game/types';
import { GameEngine } from './game/engine/GameEngine';

// Screens
import MainMenu from './screens/MainMenu';
import MissionSelect from './screens/MissionSelect';
import CharacterSelect from './screens/CharacterSelect';
import Shop from './screens/Shop';
import SafeHouse from './screens/SafeHouse';
import SkillTree from './screens/SkillTree';
import Settings from './screens/Settings';
import HowToPlay from './screens/HowToPlay';

// UI
import GameHUD from './ui/GameHUD';
import MobileControls from './ui/MobileControls';
import PauseMenu from './ui/PauseMenu';
import MissionObjectivePanel from './ui/MissionObjectivePanel';
import MissionComplete from './ui/MissionComplete';
import GameOverScreen from './ui/GameOverScreen';
import MenuButton from './ui/MenuButton';

// Puzzles
import CodePuzzleUI from './ui/puzzles/CodePuzzleUI';
import LockpickUI from './ui/puzzles/LockpickUI';
import CyberTerminalUI from './ui/puzzles/CyberTerminalUI';

import './index.css';

const GameView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const { setScreen, currentMissionId, addMoney, addXp, completeMission } = useGameState();
  
  const [paused, setPaused] = useState(false);
  const [hudData, setHudData] = useState<HUDData | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<{type: string, data: any} | null>(null);
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [interactionPrompt, setInteractionPrompt] = useState<{text: string, x: number, y: number} | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number, color: string}[]>([]);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (engineRef.current) {
        engineRef.current.camera.width = canvas.width;
        engineRef.current.camera.height = canvas.height;
      }
    };
    window.addEventListener('resize', handleResize);
    
    const engine = new GameEngine(canvas, currentMissionId || 1, {
      onPause: () => {
        setPaused(true);
      },
      onMissionComplete: (result) => {
        setMissionResult(result);
        addMoney(result.cashStolen);
        addXp(result.xpEarned);
        completeMission(`mission_${result.missionId}`, result.stars);
      },
      onGameOver: () => {
        setGameOver(true);
      },
      onHUDUpdate: (data) => {
        setHudData(data);
      },
      onInteraction: (type, data) => {
        if (type === 'none') {
          setInteractionPrompt(null);
        } else {
          setInteractionPrompt({ text: data.text, x: data.screenX, y: data.screenY });
        }
      },
      onPuzzleStart: (type, data) => {
        setActivePuzzle({ type, data });
      },
      onPuzzleEnd: () => {
        setActivePuzzle(null);
      },
      onFloatingText: (text, x, y, color) => {
        const id = Date.now() + Math.random();
        setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== id));
        }, 1500);
      }
    });
    
    engineRef.current = engine;
    engine.start();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, [currentMissionId, addMoney, addXp, completeMission]);
  
  const handleResume = () => {
    setPaused(false);
    if (engineRef.current) {
      engineRef.current.resume();
    }
  };

  const handleQuit = () => {
    setScreen(GameScreen.MAIN_MENU);
  };
  
  const handlePuzzleSolve = (success: boolean) => {
    if (engineRef.current && activePuzzle) {
      engineRef.current.solvePuzzle(activePuzzle.type, success);
    }
    setActivePuzzle(null);
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {hudData && <GameHUD data={hudData} />}
      
      <MenuButton onPause={() => {
        if (engineRef.current && !paused && !gameOver && !missionResult && !activePuzzle) {
          engineRef.current.pause();
          setPaused(true);
        }
      }} />
      
      {interactionPrompt && !activePuzzle && !paused && (
        <div 
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-1 rounded border border-cyan-500 text-sm whitespace-nowrap z-10"
          style={{ left: interactionPrompt.x, top: interactionPrompt.y }}
        >
          {interactionPrompt.text}
        </div>
      )}
      
      {floatingTexts.map(t => (
        <div 
          key={t.id}
          className="absolute pointer-events-none animate-float-up text-lg font-bold z-20"
          style={{ left: t.x, top: t.y, color: t.color, textShadow: '1px 1px 2px black' }}
        >
          {t.text}
        </div>
      ))}
      
      {activePuzzle?.type === 'code' && (
        <CodePuzzleUI puzzleData={activePuzzle.data} onComplete={handlePuzzleSolve} />
      )}
      {activePuzzle?.type === 'lockpick' && (
        <LockpickUI puzzleData={activePuzzle.data} onComplete={handlePuzzleSolve} />
      )}
      {activePuzzle?.type === 'cyber' && (
        <CyberTerminalUI puzzleData={activePuzzle.data} onComplete={handlePuzzleSolve} />
      )}
      
      {paused && <PauseMenu onResume={handleResume} onQuit={handleQuit} />}
      
      {missionResult && <MissionComplete result={missionResult} onContinue={handleQuit} />}
      {gameOver && <GameOverScreen onRetry={() => {
        setGameOver(false);
        if (engineRef.current) {
          engineRef.current.stop();
          engineRef.current.initMission();
          engineRef.current.start();
        }
      }} onQuit={handleQuit} />}
      
      <div className="absolute bottom-4 right-4 z-10 sm:hidden">
        <MobileControls onInteraction={() => {
           if (engineRef.current && (engineRef.current as any).input) {
             (engineRef.current as any).input.keys['e'] = true;
             setTimeout(() => {
               if (engineRef.current) (engineRef.current as any).input.keys['e'] = false;
             }, 100);
           }
        }} />
      </div>
    </div>
  );
};

const Main = () => {
  const { screen } = useGameState();

  const renderScreen = () => {
    switch (screen) {
      case GameScreen.MAIN_MENU: return <MainMenu />;
      case GameScreen.MISSION_SELECT: return <MissionSelect />;
      case GameScreen.CHARACTER_SELECT: return <CharacterSelect />;
      case GameScreen.SHOP: return <Shop />;
      case GameScreen.SAFE_HOUSE: return <SafeHouse />;
      case GameScreen.SKILL_TREE: return <SkillTree />;
      case GameScreen.SETTINGS: return <Settings />;
      case GameScreen.HOW_TO_PLAY: return <HowToPlay />;
      case GameScreen.GAME: return <GameView />;
      default: return <MainMenu />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white overflow-hidden font-sans">
      {renderScreen()}
    </div>
  );
};

const App = () => {
  return (
    <GameStateProvider>
      <Main />
    </GameStateProvider>
  );
};

export default App;
