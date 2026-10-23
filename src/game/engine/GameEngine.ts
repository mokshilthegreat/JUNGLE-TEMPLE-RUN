import type { Camera } from './Camera';
import type { InputManager } from './InputManager';
import type { Player } from '../entities/Player';
import type { MapGenerator } from '../levels/MapGenerator';
import type { MapRenderer } from '../levels/MapRenderer';
import type { MapData, Position, Objective, HUDData, MissionResult } from '../types';
import type { missions } from '../levels/MissionData';

export interface GameCallbacks {
  onPause: () => void;
  onMissionComplete: (result: MissionResult) => void;
  onGameOver: () => void;
  onHUDUpdate: (data: HUDData) => void;
  onInteraction: (type: string, data: any) => void;
  onPuzzleStart: (type: 'code' | 'lockpick' | 'cyber', puzzleData: any) => void;
  onPuzzleEnd: () => void;
  onFloatingText: (text: string, x: number, y: number, color: string) => void;
}

interface DoorInfo {
  x: number; y: number;
  tileX: number; tileY: number;
  type: string;
  state: 'locked' | 'unlocked' | 'opening' | 'open';
  openProgress: number;
  horizontal: boolean;
  code?: string;
}

interface LootInfo {
  x: number; y: number;
  type: string;
  value: number;
  weight: number;
  name: string;
  collected: boolean;
  bobOffset: number;
}

interface CameraInfo {
  x: number; y: number;
  baseAngle: number;
  currentAngle: number;
  sweepRange: number;
  sweepSpeed: number;
  visionRange: number;
  visionAngle: number;
  disabled: boolean;
}

interface SimpleGuard {
  x: number;
  y: number;
  rotation: number;
  state: 'patrol' | 'alert' | 'chase';
  alertLevel: number;
  patrolNodes: Position[];
  currentNode: number;
}

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public camera: Camera;
  public input: InputManager;
  
  private mapData: MapData | null = null;
  private mapRenderer: MapRenderer;
  private mapGenerator: MapGenerator;
  
  public player: Player;
  private guards: SimpleGuard[] = [];
  private doors: DoorInfo[] = [];
  private lootItems: LootInfo[] = [];
  private cameras: CameraInfo[] = [];
  
  private isRunning = false;
  private lastTime = 0;
  private animFrameId = 0;
  public gameState: 'playing' | 'paused' | 'puzzle' | 'complete' | 'gameover' = 'playing';
  
  private missionTimer = 0;
  private missionId: number | string;
  private moneyCollected = 0;
  private xpEarned = 0;
  
  private objectives: Objective[] = [];
  private extractionPoint: Position = { x: 0, y: 0 };
  private mainTreasureCollected = false;
  private activeDoorInteraction: DoorInfo | null = null;
  
  private callbacks: GameCallbacks;
  
  constructor(canvas: HTMLCanvasElement, missionId: number | string, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.missionId = missionId;
    this.callbacks = callbacks;
    
    this.camera = new Camera(canvas.width, canvas.height);
    this.input = new InputManager();
    this.mapRenderer = new MapRenderer();
    this.mapGenerator = new MapGenerator();
    
    this.player = new Player();
    this.initMission();
  }
  
  public initMission() {
    this.mapData = this.mapGenerator.generateMap(this.missionId, 'warehouse', 'normal');
    
    if (this.mapData.playerSpawn) {
      this.player.x = this.mapData.playerSpawn.x * this.mapData.tileSize + this.mapData.tileSize / 2;
      this.player.y = this.mapData.playerSpawn.y * this.mapData.tileSize + this.mapData.tileSize / 2;
    } else {
      this.player.x = 100;
      this.player.y = 100;
    }
    
    this.extractionPoint = { 
      x: (this.mapData.extractionPoint?.x || 0) * this.mapData.tileSize + this.mapData.tileSize/2,
      y: (this.mapData.extractionPoint?.y || 0) * this.mapData.tileSize + this.mapData.tileSize/2
    };

    this.doors = [];
    if (this.mapData.doors) {
      for (const d of this.mapData.doors) {
        this.doors.push({
          x: d.x * this.mapData.tileSize + this.mapData.tileSize/2,
          y: d.y * this.mapData.tileSize + this.mapData.tileSize/2,
          tileX: d.x,
          tileY: d.y,
          type: d.locked ? 'locked' : 'normal',
          state: d.locked ? 'locked' : 'unlocked',
          openProgress: 0,
          horizontal: d.horizontal || false,
          code: d.locked ? '1234' : undefined
        });
      }
    }
    
    this.lootItems = [];
    if (this.mapData.lootPositions) {
      for (const l of this.mapData.lootPositions) {
        this.lootItems.push({
          x: l.x * this.mapData.tileSize + this.mapData.tileSize/2,
          y: l.y * this.mapData.tileSize + this.mapData.tileSize/2,
          type: 'cash',
          value: 100,
          weight: 1,
          name: 'Cash Stack',
          collected: false,
          bobOffset: Math.random() * Math.PI * 2
        });
      }
    }
    
    this.guards = [];
    if (this.mapData.guardSpawns) {
      for (const g of this.mapData.guardSpawns) {
        this.guards.push({
          x: g.x * this.mapData.tileSize + this.mapData.tileSize/2,
          y: g.y * this.mapData.tileSize + this.mapData.tileSize/2,
          rotation: 0,
          state: 'patrol',
          alertLevel: 0,
          patrolNodes: [{x: g.x, y: g.y}],
          currentNode: 0
        });
      }
    }
    
    this.cameras = [];
    if (this.mapData.cameraPositions) {
      for (const c of this.mapData.cameraPositions) {
        this.cameras.push({
          x: c.x * this.mapData.tileSize + this.mapData.tileSize/2,
          y: c.y * this.mapData.tileSize + this.mapData.tileSize/2,
          baseAngle: c.direction === 'down' ? Math.PI/2 : (c.direction === 'left' ? Math.PI : (c.direction === 'up' ? -Math.PI/2 : 0)),
          currentAngle: 0,
          sweepRange: Math.PI/4,
          sweepSpeed: 1,
          visionRange: 150,
          visionAngle: Math.PI/4,
          disabled: false
        });
      }
    }

    this.objectives = [
      { id: 'loot', description: 'Steal the main treasure', completed: false },
      { id: 'extract', description: 'Escape via the extraction point', completed: false }
    ];
    
    this.gameState = 'playing';
    this.missionTimer = 0;
    this.moneyCollected = 0;
    this.xpEarned = 0;
    this.mainTreasureCollected = false;
  }
  
  public start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.input.attach(this.canvas);
    this.loop(this.lastTime);
  }
  
  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
    this.input.detach();
  }
  
  public pause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      this.callbacks.onPause();
    }
  }
  
  public resume() {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
      this.lastTime = performance.now();
    }
  }
  
  private loop = (time: number) => {
    if (!this.isRunning) return;
    this.animFrameId = requestAnimationFrame(this.loop);
    
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    
    if (this.gameState === 'playing') {
      this.update(Math.min(dt, 0.1));
    }
    
    this.render();
    this.input.update();
  }
  
  private isWallAt(wx: number, wy: number): boolean {
    if (!this.mapData) return false;
    const tx = Math.floor(wx / this.mapData.tileSize);
    const ty = Math.floor(wy / this.mapData.tileSize);
    if (tx < 0 || ty < 0 || tx >= this.mapData.width || ty >= this.mapData.height) return true;
    
    const tile = this.mapData.tiles[ty][tx];
    if (tile === 1 || tile === 2 || tile === 5) return true; // walls, boundaries
    
    const door = this.doors.find(d => d.tileX === tx && d.tileY === ty);
    if (door && door.state !== 'open') return true;
    
    return false;
  }
  
  private update(dt: number) {
    this.missionTimer += dt;
    
    if (this.input.isKeyPressed('Escape')) {
      this.pause();
      return;
    }
    
    // Player movement
    let vx = 0; let vy = 0;
    const speed = 150;
    if (this.input.isKeyDown('w') || this.input.isKeyDown('ArrowUp')) vy -= speed;
    if (this.input.isKeyDown('s') || this.input.isKeyDown('ArrowDown')) vy += speed;
    if (this.input.isKeyDown('a') || this.input.isKeyDown('ArrowLeft')) vx -= speed;
    if (this.input.isKeyDown('d') || this.input.isKeyDown('ArrowRight')) vx += speed;
    
    if (vx !== 0 && vy !== 0) {
      const len = Math.sqrt(vx*vx + vy*vy);
      vx = (vx / len) * speed;
      vy = (vy / len) * speed;
    }
    
    this.player.vx = vx;
    this.player.vy = vy;
    
    const r = this.player.width / 2;
    const nextX = this.player.x + this.player.vx * dt;
    if (!this.isWallAt(nextX - r, this.player.y) && !this.isWallAt(nextX + r, this.player.y)) {
      this.player.x = nextX;
    }
    const nextY = this.player.y + this.player.vy * dt;
    if (!this.isWallAt(this.player.x, nextY - r) && !this.isWallAt(this.player.x, nextY + r)) {
      this.player.y = nextY;
    }
    
    if (vx !== 0 || vy !== 0) {
      this.player.rotation = Math.atan2(vy, vx);
    }
    
    this.camera.follow(this.player, dt);
    
    // Animate doors
    for (const d of this.doors) {
      if (d.state === 'opening') {
        d.openProgress += dt * 2;
        if (d.openProgress >= 1) {
          d.openProgress = 1;
          d.state = 'open';
        }
      }
    }
    
    // Animate loot
    for (const l of this.lootItems) {
      if (!l.collected) l.bobOffset += dt * 3;
    }
    
    // Update cameras
    for (const c of this.cameras) {
      if (!c.disabled) {
        c.currentAngle = c.baseAngle + Math.sin(this.missionTimer * c.sweepSpeed) * c.sweepRange;
      }
    }
    
    // Guard logic
    for (const g of this.guards) {
      if (g.state === 'patrol') {
        g.rotation += dt * 0.5;
        // Check vision to player
        const dx = this.player.x - g.x;
        const dy = this.player.y - g.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
           const angleToPlayer = Math.atan2(dy, dx);
           let angleDiff = Math.abs(angleToPlayer - g.rotation) % (Math.PI*2);
           if (angleDiff > Math.PI) angleDiff = Math.PI*2 - angleDiff;
           
           if (angleDiff < Math.PI/4) {
               // See player
               this.player.health -= dt * 20; // damage
           }
        }
      }
    }
    
    if (this.player.health <= 0) {
      this.gameState = 'gameover';
      this.callbacks.onGameOver();
      return;
    }
    
    this.handleInteractions();
    
    // Update HUD
    this.callbacks.onHUDUpdate({
      playerLevel: 1,
      xp: this.xpEarned,
      xpToNextLevel: 1000,
      health: this.player.health,
      maxHealth: 100,
      armor: 0,
      maxArmor: 100,
      stamina: 100,
      maxStamina: 100,
      missionObjective: this.objectives.find(o => !o.completed)?.description || 'Escape!',
      money: this.moneyCollected,
      alarmLevel: 0,
      eyeLevel: 0,
      bagLoad: 0,
      bagCapacity: 100,
      ammo: 0,
      maxAmmo: 0,
      weaponName: 'None',
      objectives: this.objectives
    });
  }
  
  private handleInteractions() {
    let interactable = false;
    
    for (const d of this.doors) {
      if (d.state === 'locked' || d.state === 'unlocked') {
        const dist = Math.sqrt(Math.pow(d.x - this.player.x, 2) + Math.pow(d.y - this.player.y, 2));
        if (dist < 50) {
          interactable = true;
          const sx = this.camera.worldToScreen(d.x, d.y - 40).x;
          const sy = this.camera.worldToScreen(d.x, d.y - 40).y;
          this.callbacks.onInteraction('door', { text: d.state === 'locked' ? 'Press E to Unlock' : 'Press E to Open', screenX: sx, screenY: sy });
          
          if (this.input.isKeyPressed('e')) {
            if (d.state === 'locked') {
              this.activeDoorInteraction = d;
              this.callbacks.onPuzzleStart('code', { correctCode: d.code || '1234' });
            } else {
              d.state = 'opening';
            }
          }
          break;
        }
      }
    }
    
    if (!interactable) {
      for (const l of this.lootItems) {
        if (!l.collected) {
          const dist = Math.sqrt(Math.pow(l.x - this.player.x, 2) + Math.pow(l.y - this.player.y, 2));
          if (dist < 40) {
            interactable = true;
            const sx = this.camera.worldToScreen(l.x, l.y - 30).x;
            const sy = this.camera.worldToScreen(l.x, l.y - 30).y;
            this.callbacks.onInteraction('loot', { text: 'Press E to Collect', screenX: sx, screenY: sy });
            
            if (this.input.isKeyPressed('e')) {
              l.collected = true;
              this.moneyCollected += l.value;
              this.xpEarned += 50;
              this.callbacks.onFloatingText(`+${l.value} Cash`, sx, sy, '#00ff00');
              if (this.objectives.length > 0 && !this.objectives[0].completed) {
                this.objectives[0].completed = true;
                this.mainTreasureCollected = true;
                this.callbacks.onFloatingText("Objective Complete", sx, sy - 20, '#ffff00');
              }
            }
            break;
          }
        }
      }
    }
    
    if (!interactable) {
      const dist = Math.sqrt(Math.pow(this.extractionPoint.x - this.player.x, 2) + Math.pow(this.extractionPoint.y - this.player.y, 2));
      if (dist < 60) {
        interactable = true;
        const sx = this.camera.worldToScreen(this.extractionPoint.x, this.extractionPoint.y - 40).x;
        const sy = this.camera.worldToScreen(this.extractionPoint.x, this.extractionPoint.y - 40).y;
        
        if (this.mainTreasureCollected) {
          this.callbacks.onInteraction('extract', { text: 'Press E to Escape', screenX: sx, screenY: sy });
          if (this.input.isKeyPressed('e')) {
             this.gameState = 'complete';
             this.callbacks.onMissionComplete({
               missionId: this.missionId, completed: true, stars: 3, cashStolen: this.moneyCollected,
               xpEarned: this.xpEarned, timeTaken: this.missionTimer, enemiesAvoided: 5, totalEnemies: 5,
               camerasDisabled: 0, totalCameras: 3, lootCollected: 1, totalLoot: 1, alarmTriggered: false
             });
          }
        } else {
          this.callbacks.onInteraction('extract', { text: 'Collect Treasure First', screenX: sx, screenY: sy });
        }
      }
    }
    
    if (!interactable) {
      this.callbacks.onInteraction('none', null);
    }
  }
  
  public solvePuzzle(type: string, success: boolean) {
    this.gameState = 'playing';
    this.callbacks.onPuzzleEnd();
    if (success && this.activeDoorInteraction) {
      this.activeDoorInteraction.state = 'opening';
    }
    this.activeDoorInteraction = null;
  }
  
  private render() {
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.camera.applyTransform(this.ctx);
    
    if (this.mapData) {
      this.mapRenderer.render(this.ctx, this.mapData, this.camera);
    }
    
    // Render extraction
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(this.extractionPoint.x, this.extractionPoint.y, 50, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    
    // Loot
    for (const l of this.lootItems) {
      if (!l.collected) {
        this.ctx.fillStyle = 'gold';
        this.ctx.beginPath();
        const yOffset = Math.sin(l.bobOffset) * 5;
        this.ctx.arc(l.x, l.y + yOffset, 10, 0, Math.PI*2);
        this.ctx.fill();
      }
    }
    
    // Doors
    const ts = this.mapData?.tileSize || 32;
    for (const d of this.doors) {
      this.ctx.fillStyle = d.state === 'locked' ? 'red' : 'gray';
      this.ctx.save();
      this.ctx.translate(d.x, d.y);
      if (d.horizontal) {
        this.ctx.fillRect(-ts/2 + (d.openProgress * ts/2), -4, ts, 8);
      } else {
        this.ctx.fillRect(-4, -ts/2 + (d.openProgress * ts/2), 8, ts);
      }
      this.ctx.restore();
    }
    
    // Guards
    for (const g of this.guards) {
      this.ctx.save();
      this.ctx.translate(g.x, g.y);
      this.ctx.rotate(g.rotation);
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(-12, -12, 24, 24);
      
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, 150, -Math.PI/4, Math.PI/4);
      this.ctx.fill();
      
      this.ctx.restore();
    }
    
    // Player
    this.player.render(this.ctx, this.camera);
    
    // Darkness
    this.ctx.globalCompositeOperation = 'destination-in';
    const grad = this.ctx.createRadialGradient(this.player.x, this.player.y, 0, this.player.x, this.player.y, 300);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(this.camera.x, this.camera.y, this.camera.width, this.camera.height);
    this.ctx.globalCompositeOperation = 'source-over';
    
    this.ctx.restore();
    
    this.renderMinimap();
  }
  
  private renderMinimap() {
    const size = 150;
    const margin = 20;
    const x = this.canvas.width - size - margin;
    const y = margin;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x, y, size, size);
    this.ctx.strokeStyle = 'cyan';
    this.ctx.strokeRect(x, y, size, size);
    
    if (!this.mapData) return;
    const scale = size / (this.mapData.width * this.mapData.tileSize);
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);
    
    this.ctx.fillStyle = 'cyan';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, 20, 0, Math.PI*2);
    this.ctx.fill();
    
    for (const g of this.guards) {
      this.ctx.fillStyle = 'red';
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, 20, 0, Math.PI*2);
      this.ctx.fill();
    }
    
    for (const l of this.lootItems) {
      if (!l.collected) {
        this.ctx.fillStyle = 'gold';
        this.ctx.beginPath();
        this.ctx.arc(l.x, l.y, 15, 0, Math.PI*2);
        this.ctx.fill();
      }
    }
    
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.extractionPoint.x, this.extractionPoint.y, 25, 0, Math.PI*2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
}
