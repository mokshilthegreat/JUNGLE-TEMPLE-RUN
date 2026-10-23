import type { Entity } from './Entity';
import type { EntityType, PlayerStats } from '../types';
import type { GameEngine } from '../engine/GameEngine';
import type { Camera } from '../engine/Camera';

export class Player extends Entity {
  public stats: PlayerStats;
  public stamina: number = 100;
  public maxStamina: number = 100;
  
  private state: 'idle' | 'walking' | 'sprinting' | 'crouching' = 'idle';

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.type = EntityType.PLAYER;
    this.zIndex = 10;
    
    this.stats = {
      speed: 150,
      stealth: 50,
      health: 100,
      hacking: 1,
      lockpicking: 1,
      combat: 1,
      bagCapacity: 10
    };
  }

  public update(dt: number, engine: GameEngine): void {
    const input = engine.input;
    let dx = 0;
    let dy = 0;

    // Movement input
    if (input.isKeyDown('w')) dy -= 1;
    if (input.isKeyDown('s')) dy += 1;
    if (input.isKeyDown('a')) dx -= 1;
    if (input.isKeyDown('d')) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    // Determine state and speed
    let speedMult = 1.0;
    this.state = 'idle';

    if (dx !== 0 || dy !== 0) {
      this.state = 'walking';
      
      if (input.isKeyDown('shift') && this.stamina > 0) {
        this.state = 'sprinting';
        speedMult = 1.8;
        this.stamina -= 20 * dt; // Consume stamina
      } else if (input.isKeyDown('c')) {
        this.state = 'crouching';
        speedMult = 0.5;
      } else {
        // Regenerate stamina slowly when walking
        this.stamina = Math.min(this.maxStamina, this.stamina + 5 * dt);
      }
    } else {
      // Regenerate stamina faster when idle
      if (input.isKeyDown('c')) this.state = 'crouching';
      this.stamina = Math.min(this.maxStamina, this.stamina + 15 * dt);
    }

    // Apply movement
    this.vx = dx * this.stats.speed * speedMult;
    this.vy = dy * this.stats.speed * speedMult;
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Rotation towards mouse
    const mousePos = input.getMouseWorldPos(engine.camera);
    this.rotation = Math.atan2(mousePos.y - this.y, mousePos.x - this.x);
  }

  public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(4, 4, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw body
    ctx.fillStyle = '#1e293b'; // Dark tactical color
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw backpack
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(-this.width/2 - 4, -10, 8, 20, 2);
    ctx.fill();

    // Draw arms/shoulders
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(this.width/2 - 4, -10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width/2 - 4, 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Direction indicator (vision / flashlight)
    const gradient = ctx.createLinearGradient(0, 0, 40, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50, -15);
    ctx.lineTo(50, 15);
    ctx.fill();

    ctx.restore();
    
    // Draw stamina bar if not full
    if (this.stamina < this.maxStamina) {
      ctx.save();
      ctx.translate(this.x, this.y - this.height);
      
      const barWidth = 30;
      const barHeight = 4;
      
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-barWidth/2, 0, barWidth, barHeight);
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-barWidth/2, 0, barWidth * (this.stamina / this.maxStamina), barHeight);
      
      ctx.restore();
    }
  }
}
