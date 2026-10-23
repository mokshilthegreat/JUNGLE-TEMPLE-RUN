import type { Position } from '../types';
import type { Camera } from './Camera';

export class InputManager {
  private keysDown: Set<string> = new Set();
  private keysPressed: Set<string> = new Set(); // Cleared every frame
  private mousePos: Position = { x: 0, y: 0 };
  private mouseButtonsDown: Set<number> = new Set();
  private mouseButtonsPressed: Set<number> = new Set();

  constructor(private canvas: HTMLCanvasElement) {
    this.initListeners();
  }

  private initListeners() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (!this.keysDown.has(key)) {
        this.keysPressed.add(key);
      }
      this.keysDown.add(key);
      
      if ([' ', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.key.toLowerCase());
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.mouseButtonsDown.has(e.button)) {
        this.mouseButtonsPressed.add(e.button);
      }
      this.mouseButtonsDown.add(e.button);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseButtonsDown.delete(e.button);
    });
  }

  public update() {
    this.keysPressed.clear();
    this.mouseButtonsPressed.clear();
  }

  public isKeyDown(key: string): boolean {
    return this.keysDown.has(key.toLowerCase());
  }

  public isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key.toLowerCase());
  }

  public getMouseScreenPos(): Position {
    return { ...this.mousePos };
  }

  public getMouseWorldPos(camera: Camera): Position {
    return camera.screenToWorld(this.mousePos);
  }

  public isMouseButtonDown(button: number = 0): boolean {
    return this.mouseButtonsDown.has(button);
  }
}
