import type { MapData, WeatherType, Objective, Position, DoorType } from '../types';
import type { MapGenerator } from './MapGenerator';
import type { missions } from './MissionData';

// Placeholder entity types for manager
export interface Entity {
  id: string;
  type: 'player' | 'guard' | 'camera' | 'loot' | 'door';
  x: number;
  y: number;
}

export interface Player extends Entity { type: 'player'; }
export interface Guard extends Entity { type: 'guard'; state: string; }
export interface Camera extends Entity { type: 'camera'; direction: string; }
export interface Loot extends Entity { type: 'loot'; value: number; collected: boolean; }
export interface Door extends Entity { type: 'door'; doorType: DoorType; locked: boolean; horizontal: boolean; }

export class LevelManager {
  private currentMissionId: number = -1;
  private mapData: MapData | null = null;
  private weather: WeatherType = 'clear';
  
  private entities: Entity[] = [];
  private objectives: Objective[] = [];
  private mapGenerator: MapGenerator;

  constructor() {
    this.mapGenerator = new MapGenerator();
  }

  public loadMission(missionId: number) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);

    this.currentMissionId = missionId;
    this.weather = mission.weather || 'clear';
    this.objectives = [...mission.objectives.map(o => ({...o})), ...mission.optionalObjectives.map(o => ({...o}))];

    // Generate map
    this.mapData = this.mapGenerator.generateMap(missionId, mission.location, mission.difficulty);
    
    this.spawnEntities();
  }

  private spawnEntities() {
    if (!this.mapData) return;
    this.entities = [];

    // Spawn Player
    this.entities.push({
      id: 'player_1',
      type: 'player',
      x: this.mapData.playerSpawn.x * this.mapData.tileSize,
      y: this.mapData.playerSpawn.y * this.mapData.tileSize
    } as Player);

    // Spawn Guards
    this.mapData.guardSpawns.forEach((spawn, idx) => {
      this.entities.push({
        id: `guard_${idx}`,
        type: 'guard',
        x: spawn.x * this.mapData.tileSize,
        y: spawn.y * this.mapData.tileSize,
        state: 'patrol'
      } as Guard);
    });

    // Spawn Cameras
    this.mapData.cameraPositions.forEach((cam, idx) => {
      this.entities.push({
        id: `camera_${idx}`,
        type: 'camera',
        x: cam.x * this.mapData.tileSize,
        y: cam.y * this.mapData.tileSize,
        direction: cam.direction
      } as Camera);
    });

    // Spawn Loot
    this.mapData.lootPositions.forEach((loot, idx) => {
      this.entities.push({
        id: `loot_${idx}`,
        type: 'loot',
        x: loot.x * this.mapData.tileSize,
        y: loot.y * this.mapData.tileSize,
        value: loot.value,
        collected: false
      } as Loot);
    });

    // Spawn Doors
    this.mapData.doors.forEach((door, idx) => {
      this.entities.push({
        id: `door_${idx}`,
        type: 'door',
        x: door.x * this.mapData.tileSize,
        y: door.y * this.mapData.tileSize,
        doorType: door.type,
        locked: door.locked,
        horizontal: door.horizontal
      } as Door);
    });
  }

  public getEntitiesByType<T extends Entity>(type: string): T[] {
    return this.entities.filter(e => e.type === type) as T[];
  }

  public getAllEntities(): Entity[] {
    return this.entities;
  }

  public resetLevel() {
    if (this.currentMissionId !== -1) {
      this.loadMission(this.currentMissionId);
    }
  }

  public checkMissionObjectives(): boolean {
    const mainObjectives = this.objectives.filter(o => o.id.startsWith('obj_main'));
    return mainObjectives.every(o => o.completed);
  }

  public completeObjective(objectiveId: string) {
    const obj = this.objectives.find(o => o.id === objectiveId);
    if (obj) obj.completed = true;
  }

  public getMapData(): MapData | null {
    return this.mapData;
  }

  public getWeather(): WeatherType {
    return this.weather;
  }
}
