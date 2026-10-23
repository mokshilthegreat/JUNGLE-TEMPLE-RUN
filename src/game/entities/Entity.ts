import type { Bounds, EntityType } from '../types';
import type { GameEngine } from './GameEngine';
import type { Camera } from './Camera';

export abstract class Entity {
  public id: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 32;
  public height: number = 32;
  public vx: number = 0;
  public vy: number = 0;
  public rotation: number = 0;
  public active: boolean = true;
  public type: EntityType | string = 'BASE';
  public zIndex: number = 0;

  constructor() {
    this.id = Math.random().toString(36).substring(2, 9);
  }

  public abstract update(dt: number, engine: GameEngine): void;
  public abstract render(ctx: CanvasRenderingContext2D, camera: Camera): void;

  public getBounds(): Bounds {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  public onCollide(other: Entity): void {
    // Override in subclasses
  }
}
