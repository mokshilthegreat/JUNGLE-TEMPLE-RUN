import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SaveData, GameScreen, SettingsData } from '../game/types';

interface GameStateContextType {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  saveData: SaveData;
  updateSaveData: (data: Partial<SaveData>) => void;
  addMoney: (amount: number) => void;
  addDiamonds: (amount: number) => void;
  addXp: (amount: number) => void;
  unlockCharacter: (id: string) => void;
  selectCharacter: (id: string) => void;
  completeMission: (missionId: string, stars: number) => void;
  purchaseItem: (itemId: string, cost: number, category: string) => boolean;
  unlockSkill: (skillId: string) => void;
  updateSettings: (settings: Partial<SettingsData>) => void;
  currentMissionId: number;
  setCurrentMissionId: (id: number) => void;
}

const XP_TABLE = [0, 500, 1200, 2100, 3200, 4500, 6000, 7800, 9900, 12300, 15000, 18000, 21500, 25500, 30000];

function xpForLevel(level: number): number {
  if (level - 1 < XP_TABLE.length) return XP_TABLE[level - 1];
  return XP_TABLE[XP_TABLE.length - 1] + (level - XP_TABLE.length) * 5000;
}

const DEFAULT_SAVE_DATA: SaveData = {
  level: 1,
  xp: 0,
  money: 5000,
  diamonds: 10,
  currentCharacter: 'thief',
  unlockedCharacters: ['thief'],
  unlockedWeapons: ['silent_pistol'],
  unlockedEquipment: ['lockpick'],
  unlockedSkills: [],
  bagLevel: 1,
  missions: {
    'mission_1': { id: 'mission_1', name: 'Bank Recon', difficulty: 1, reward: 2000, unlocked: true, stars: 0, description: 'Scout the bank layout and steal initial intel.' },
    'mission_2': { id: 'mission_2', name: 'Vault Access', difficulty: 2, reward: 3500, unlocked: true, stars: 0, description: 'Break into the bank vault.' },
    'mission_3': { id: 'mission_3', name: 'Silent Robbery', difficulty: 2, reward: 4000, unlocked: true, stars: 0, description: 'Rob the bank without triggering alarms.' },
    'mission_4': { id: 'mission_4', name: 'Data Theft', difficulty: 3, reward: 5000, unlocked: false, stars: 0, description: 'Steal confidential data from the server room.' },
    'mission_5': { id: 'mission_5', name: 'High Value Target', difficulty: 3, reward: 6000, unlocked: false, stars: 0, description: 'Steal a priceless artifact from the bank.' },
    'mission_6': { id: 'mission_6', name: 'Art Collection', difficulty: 4, reward: 7500, unlocked: false, stars: 0, description: 'Steal valuable paintings from the museum.' },
    'mission_7': { id: 'mission_7', name: 'Final Bank Heist', difficulty: 4, reward: 10000, unlocked: false, stars: 0, description: 'The ultimate bank heist.' },
    'mission_8': { id: 'mission_8', name: 'Diamond Exchange', difficulty: 5, reward: 12000, unlocked: false, stars: 0, description: 'Rob the diamond exchange.' },
    'mission_9': { id: 'mission_9', name: 'Museum After Dark', difficulty: 5, reward: 13000, unlocked: false, stars: 0, description: 'Night raid on the national museum.' },
    'mission_10': { id: 'mission_10', name: 'Crown Jewels', difficulty: 5, reward: 15000, unlocked: false, stars: 0, description: 'Steal the crown jewels exhibit.' },
  },
  settings: {
    soundVolume: 80,
    musicVolume: 60,
    sfxVolume: 80,
    difficulty: 'normal',
    graphics: 'high',
    vibration: true,
    showFps: false
  },
  totalMissionsCompleted: 0,
  totalMoneyEarned: 0,
  totalGuardsAvoided: 0,
  skillPoints: 0
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<GameScreen>(GameScreen.MAIN_MENU);
  const [saveData, setSaveData] = useState<SaveData>(DEFAULT_SAVE_DATA);
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem('heist_master_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSaveData({ ...DEFAULT_SAVE_DATA, ...parsed });
      } catch (e) {
        console.error('Failed to parse save data', e);
      }
    }
  }, []);

  const persistSave = useCallback((data: SaveData) => {
    localStorage.setItem('heist_master_save', JSON.stringify(data));
  }, []);

  const updateSaveData = useCallback((data: Partial<SaveData>) => {
    setSaveData(prev => {
      const next = { ...prev, ...data };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const addMoney = useCallback((amount: number) => {
    setSaveData(prev => {
      const next = { ...prev, money: prev.money + amount, totalMoneyEarned: prev.totalMoneyEarned + (amount > 0 ? amount : 0) };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const addDiamonds = useCallback((amount: number) => {
    setSaveData(prev => {
      const next = { ...prev, diamonds: prev.diamonds + amount };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const addXp = useCallback((amount: number) => {
    setSaveData(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newSkillPoints = prev.skillPoints;
      let needed = xpForLevel(newLevel + 1);
      while (newXp >= needed) {
        newXp -= needed;
        newLevel++;
        newSkillPoints++;
        needed = xpForLevel(newLevel + 1);
      }
      const next = { ...prev, xp: newXp, level: newLevel, skillPoints: newSkillPoints };
      // Unlock missions based on level
      const missions = { ...prev.missions };
      Object.keys(missions).forEach(key => {
        const m = missions[key];
        if (!m.unlocked && m.difficulty <= Math.ceil(newLevel / 2)) {
          missions[key] = { ...m, unlocked: true };
        }
      });
      const final = { ...next, missions };
      persistSave(final);
      return final;
    });
  }, [persistSave]);

  const unlockCharacter = useCallback((id: string) => {
    setSaveData(prev => {
      if (prev.unlockedCharacters.includes(id)) return prev;
      const next = { ...prev, unlockedCharacters: [...prev.unlockedCharacters, id] };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const selectCharacter = useCallback((id: string) => {
    setSaveData(prev => {
      const next = { ...prev, currentCharacter: id };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const completeMission = useCallback((missionId: string, stars: number) => {
    setSaveData(prev => {
      const mission = prev.missions[missionId];
      if (!mission) return prev;
      const updatedMission = { ...mission, stars: Math.max(mission.stars, stars) };
      const missions = { ...prev.missions, [missionId]: updatedMission };
      // Unlock next mission
      const missionNum = parseInt(missionId.replace('mission_', ''));
      const nextKey = `mission_${missionNum + 1}`;
      if (missions[nextKey] && !missions[nextKey].unlocked) {
        missions[nextKey] = { ...missions[nextKey], unlocked: true };
      }
      const next = { ...prev, missions, totalMissionsCompleted: prev.totalMissionsCompleted + 1 };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const purchaseItem = useCallback((itemId: string, cost: number, category: string): boolean => {
    let success = false;
    setSaveData(prev => {
      if (prev.money < cost) return prev;
      const next = { ...prev, money: prev.money - cost };
      if (category === 'weapons') {
        next.unlockedWeapons = [...prev.unlockedWeapons, itemId];
      } else {
        next.unlockedEquipment = [...prev.unlockedEquipment, itemId];
      }
      success = true;
      persistSave(next);
      return next;
    });
    return success;
  }, [persistSave]);

  const unlockSkill = useCallback((skillId: string) => {
    setSaveData(prev => {
      if (prev.skillPoints <= 0 || prev.unlockedSkills.includes(skillId)) return prev;
      const next = {
        ...prev,
        skillPoints: prev.skillPoints - 1,
        unlockedSkills: [...prev.unlockedSkills, skillId]
      };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  const updateSettings = useCallback((settings: Partial<SettingsData>) => {
    setSaveData(prev => {
      const next = { ...prev, settings: { ...prev.settings, ...settings } };
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  return (
    <GameStateContext.Provider value={{
      screen, setScreen,
      saveData, updateSaveData,
      addMoney, addDiamonds, addXp,
      unlockCharacter, selectCharacter,
      completeMission, purchaseItem,
      unlockSkill, updateSettings,
      currentMissionId, setCurrentMissionId
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};
