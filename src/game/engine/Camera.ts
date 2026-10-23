import type { Position } from '../types';
import type { Entity } from '../entities/Entity';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1;
  public width: number;
  public height: number;
  
  private shakeTime: number = 0;
  private shakeMagnitude: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public updateSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public follow(target: Entity, dt: number, lerpAmt: number = 0.1) {
    // Target position is centered on the entity
    const targetX = target.x - this.width / 2 / this.zoom;
    const targetY = target.y - this.height / 2 / this.zoom;

    // Smooth follow
    this.x += (targetX - this.x) * lerpAmt * (dt * 60);
    this.y += (targetY - this.y) * lerpAmt * (dt * 60);

    // Update shake
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      this.offsetX = (Math.random() - 0.5) * this.shakeMagnitude * 2;
      this.offsetY = (Math.random() - 0.5) * this.shakeMagnitude * 2;
      
      // Decay shake
      this.shakeMagnitude *= 0.9;
    } else {
      this.offsetX = 0;
      this.offsetY = 0;
    }
  }

  public shake(magnitude: number, duration: number) {
    this.shakeMagnitude = magnitude;
    this.shakeTime = duration;
  }

  public screenToWorld(pos: Position): Position {
    return {
      x: (pos.x / this.zoom) + this.x - this.offsetX,
      y: (pos.y / this.zoom) + this.y - this.offsetY
    };
  }

  public worldToScreen(pos: Position): Position {
    return {
      x: (pos.x - this.x + this.offsetX) * this.zoom,
      y: (pos.y - this.y + this.offsetY) * this.zoom
    };
  }

  public applyTransform(ctx: CanvasRenderingContext2D) {
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x + this.offsetX, -this.y + this.offsetY);
  }
}
