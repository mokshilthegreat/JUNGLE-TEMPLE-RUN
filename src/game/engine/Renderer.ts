import { Camera } from './Camera';

export class Renderer {
  
  public drawGrid(ctx: CanvasRenderingContext2D, camera: Camera, width: number, height: number) {
    const gridSize = 50;
    
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;

    // Calculate offset based on camera position
    const offsetX = (-camera.x * camera.zoom) % (gridSize * camera.zoom);
    const offsetY = (-camera.y * camera.zoom) % (gridSize * camera.zoom);

    ctx.beginPath();
    // Vertical lines
    for (let x = offsetX; x < width; x += gridSize * camera.zoom) {
      if (x >= 0) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
    }
    // Horizontal lines
    for (let y = offsetY; y < height; y += gridSize * camera.zoom) {
      if (y >= 0) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
    }
    ctx.stroke();
  }

  public drawDarkness(ctx: CanvasRenderingContext2D, playerX: number, playerY: number, screenWidth: number, screenHeight: number, camera: Camera) {
    // We want a gradient that cuts a hole in the darkness
    // To do this efficiently, we fill the screen with darkness, then use composite operations
    
    // Save current state
    ctx.save();
    
    // Reset transform to draw over whole screen
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Create the overlay canvas/gradient
    const screenCenter = camera.worldToScreen({x: playerX, y: playerY});
    
    // Outer darkness
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw the gradient to reveal player
    const gradient = ctx.createRadialGradient(
      screenCenter.x, screenCenter.y, 50 * camera.zoom,
      screenCenter.x, screenCenter.y, 400 * camera.zoom
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    
    ctx.restore();
  }

  public drawCircleGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset
  }
}
