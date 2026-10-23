// ==================== Core Types ====================
export interface Position { x: number; y: number; }
export interface Bounds { x: number; y: number; width: number; height: number; }
export interface Size { width: number; height: number; }

// ==================== Enums (Converted to string unions for Vite) ====================
export type EntityType = 'PLAYER' | 'GUARD' | 'CAMERA' | 'DOOR' | 'LOOT' | 'BULLET' | 'PARTICLE' | 'HIDING_SPOT' | 'EQUIPMENT_ITEM';

export type GameScreen = 'MAIN_MENU' | 'GAME' | 'MISSION_SELECT' | 'CHARACTER_SELECT' | 'SHOP' | 'SAFE_HOUSE' | 'SKILL_TREE' | 'SETTINGS' | 'HOW_TO_PLAY' | 'ACHIEVEMENTS' | 'EQUIPMENT';

// Re-export constants for easy access if needed
export const GameScreen = {
  MAIN_MENU: 'MAIN_MENU' as GameScreen,
  GAME: 'GAME' as GameScreen,
  MISSION_SELECT: 'MISSION_SELECT' as GameScreen,
  CHARACTER_SELECT: 'CHARACTER_SELECT' as GameScreen,
  SHOP: 'SHOP' as GameScreen,
  SAFE_HOUSE: 'SAFE_HOUSE' as GameScreen,
  SKILL_TREE: 'SKILL_TREE' as GameScreen,
  SETTINGS: 'SETTINGS' as GameScreen,
  HOW_TO_PLAY: 'HOW_TO_PLAY' as GameScreen,
  ACHIEVEMENTS: 'ACHIEVEMENTS' as GameScreen,
  EQUIPMENT: 'EQUIPMENT' as GameScreen
};

export const EntityType = {
  PLAYER: 'PLAYER' as EntityType,
  GUARD: 'GUARD' as EntityType,
  CAMERA: 'CAMERA' as EntityType,
  DOOR: 'DOOR' as EntityType,
  LOOT: 'LOOT' as EntityType,
  BULLET: 'BULLET' as EntityType,
  PARTICLE: 'PARTICLE' as EntityType,
  HIDING_SPOT: 'HIDING_SPOT' as EntityType,
  EQUIPMENT_ITEM: 'EQUIPMENT_ITEM' as EntityType
};

// ==================== Location & Map Types ====================
export type LocationType = 'bank' | 'jewelry' | 'museum' | 'mansion' | 'financial' | 'datacenter' | 'military' | 'vault';
export type TileType = 'floor' | 'wall' | 'door' | 'window' | 'vent' | 'furniture' | 'computer' | 'security_desk' | 'cctv_mount' | 'hiding_spot' | 'extraction' | 'objective';
export type DoorType = 'code' | 'keycard' | 'lockpick' | 'standard' | 'vault';
export type DoorState = 'locked' | 'hacking' | 'unlocked' | 'opening' | 'open' | 'closed';
export type WeatherType = 'clear' | 'rain' | 'fog' | 'storm';
export type GuardStateType = 'patrol' | 'suspicious' | 'investigate' | 'alert' | 'chase' | 'search' | 'return';
export type DetectionState = 'hidden' | 'noticed' | 'suspicious' | 'detected';

export interface Room {
  x: number; y: number;
  width: number; height: number;
  type: 'entry' | 'corridor' | 'office' | 'security' | 'vault' | 'storage' | 'lobby' | 'server' | 'exhibition' | 'loot';
}

export interface DoorData {
  x: number; y: number;
  type: DoorType;
  locked: boolean;
  horizontal: boolean;
}

export interface GuardSpawn {
  x: number; y: number;
  patrolRoute?: Position[];
}

export interface CameraPosition {
  x: number; y: number;
  direction: string;
}

export interface LootPosition {
  x: number; y: number;
  value: number;
  type?: LootType;
}

export interface MapData {
  width: number;
  height: number;
  tileSize: number;
  tiles: TileType[][];
  rooms: Room[];
  doors: DoorData[];
  guardSpawns: GuardSpawn[];
  cameraPositions: CameraPosition[];
  lootPositions: LootPosition[];
  playerSpawn: Position;
  extractionPoint: Position;
  vaultPosition?: Position;
}

// ==================== Player Types ====================
export interface PlayerStats {
  speed: number;
  stealth: number;
  health: number;
  hacking: number;
  lockpicking: number;
  combat: number;
  bagCapacity: number;
}

export interface CharacterData {
  id: string;
  name: string;
  className: string;
  description: string;
  stats: PlayerStats;
  specialAbility: string;
  specialAbilityDesc: string;
  unlockLevel: number;
  color: string;
}

// ==================== Weapon & Equipment Types ====================
export interface WeaponData {
  id: string;
  name: string;
  damage: number;
  range: number;
  fireRate: number;
  noise: number;
  ammo: number;
  maxAmmo: number;
  reloadTime: number;
  price: number;
  description: string;
  owned: boolean;
}

export interface EquipmentData {
  id: string;
  name: string;
  description: string;
  price: number;
  uses: number;
  maxUses: number;
  type: 'lockpick' | 'adv_lockpick' | 'emp' | 'smoke' | 'distraction' | 'hacking_device' | 'keycard' | 'thermal_scanner';
  owned: boolean;
}

export type LootType = 'cash' | 'gold' | 'diamond' | 'jewelry' | 'watch' | 'painting' | 'artifact' | 'data_drive' | 'gold_bar';

export interface LootItem {
  id: string;
  name: string;
  type: LootType;
  value: number;
  weight: number;
  collected: boolean;
}

// ==================== Skill Types ====================
export type SkillBranch = 'stealth' | 'hacking' | 'combat' | 'mobility' | 'loot';

export interface SkillData {
  id: string;
  name: string;
  description: string;
  branch: SkillBranch;
  tier: number;
  cost: number;
  effect: string;
  unlocked: boolean;
}

// ==================== Mission Types ====================
export interface Objective {
  id: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

export interface MissionDefinition {
  id: number;
  name: string;
  description: string;
  location: LocationType;
  difficulty: number;
  requiredLevel: number;
  objectives: Objective[];
  optionalObjectives: Objective[];
  rewards: { money: number; xp: number; diamonds: number };
  guardCount: number;
  cameraCount: number;
  doorTypes: DoorType[];
  hasVault: boolean;
  mainTreasure: { name: string; value: number };
  lootItems: LootDefinition[];
  weather: WeatherType;
  timeLimit?: number;
  starRequirements: { one: string; two: string; three: string };
}

export interface LootDefinition {
  type: LootType;
  name: string;
  value: number;
  weight: number;
  count: number;
}

export interface MissionResult {
  missionId: number;
  completed: boolean;
  stars: number;
  cashStolen: number;
  xpEarned: number;
  timeTaken: number;
  enemiesAvoided: number;
  totalEnemies: number;
  camerasDisabled: number;
  totalCameras: number;
  lootCollected: number;
  totalLoot: number;
  alarmTriggered: boolean;
}

// ==================== Save Data ====================
export interface MissionSave {
  id: string;
  name: string;
  difficulty: number;
  reward: number;
  unlocked: boolean;
  stars: number;
  description: string;
}

export interface SettingsData {
  soundVolume: number;
  musicVolume: number;
  sfxVolume: number;
  difficulty: 'easy' | 'normal' | 'hard';
  graphics: 'low' | 'medium' | 'high';
  vibration: boolean;
  showFps: boolean;
}

export interface SaveData {
  level: number;
  xp: number;
  money: number;
  diamonds: number;
  currentCharacter: string;
  unlockedCharacters: string[];
  unlockedWeapons: string[];
  unlockedEquipment: string[];
  unlockedSkills: string[];
  bagLevel: number;
  missions: { [key: string]: MissionSave };
  settings: SettingsData;
  totalMissionsCompleted: number;
  totalMoneyEarned: number;
  totalGuardsAvoided: number;
  skillPoints: number;
}

// ==================== HUD Types ====================
export interface HUDData {
  playerLevel: number;
  xp: number;
  xpToNextLevel: number;
  health: number;
  maxHealth: number;
  armor: number;
  maxArmor: number;
  stamina: number;
  maxStamina: number;
  missionObjective: string;
  money: number;
  alarmLevel: number;
  eyeLevel: number;
  bagLoad: number;
  bagCapacity: number;
  ammo: number;
  maxAmmo: number;
  weaponName: string;
  objectives: Objective[];
}

// ==================== Shop Types ====================
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'weapons' | 'gadgets' | 'tools' | 'outfits' | 'bag' | 'upgrades';
  price: number;
  currencyType: 'money' | 'diamonds';
  stats?: Record<string, number>;
  owned: boolean;
}
