import type { MapData, TileType, LocationType, DoorType } from '../types';

interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class MapRenderer {
  private ctx: CanvasRenderingContext2D;
  private locationType: LocationType;
  
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.locationType = 'bank';
  }

  public render(mapData: MapData, viewport: Viewport, locationType: LocationType) {
    this.locationType = locationType;
    const { tileSize, tiles, doors } = mapData;

    const startCol = Math.max(0, Math.floor(viewport.x / tileSize));
    const endCol = Math.min(mapData.width, Math.ceil((viewport.x + viewport.width) / tileSize));
    const startRow = Math.max(0, Math.floor(viewport.y / tileSize));
    const endRow = Math.min(mapData.height, Math.ceil((viewport.y + viewport.height) / tileSize));

    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, viewport.width, viewport.height);

    // Render Layers
    this.renderFloorLayer(tiles, startCol, endCol, startRow, endRow, tileSize, viewport);
    this.renderObjectLayer(tiles, doors, startCol, endCol, startRow, endRow, tileSize, viewport);
    this.renderWallLayer(tiles, startCol, endCol, startRow, endRow, tileSize, viewport);
    this.renderLightingOverlay(viewport);
  }

  private renderFloorLayer(tiles: TileType[][], startCol: number, endCol: number, startRow: number, endRow: number, tileSize: number, viewport: Viewport) {
    const { floorColor, gridColor } = this.getPalette();
    
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        if (tiles[y][x] !== 'wall') {
          const drawX = x * tileSize - viewport.x;
          const drawY = y * tileSize - viewport.y;
          
          this.ctx.fillStyle = floorColor;
          this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
          
          // Subtle grid
          this.ctx.strokeStyle = gridColor;
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(drawX, drawY, tileSize, tileSize);
        }
      }
    }
  }

  private renderObjectLayer(tiles: TileType[][], doors: any[], startCol: number, endCol: number, startRow: number, endRow: number, tileSize: number, viewport: Viewport) {
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const tile = tiles[y][x];
        const drawX = x * tileSize - viewport.x;
        const drawY = y * tileSize - viewport.y;

        if (tile === 'door') {
          const door = doors.find(d => d.x === x && d.y === y);
          if (door) {
            this.renderDoor(drawX, drawY, tileSize, door.type, door.horizontal);
          }
        } else if (tile === 'furniture') {
          this.ctx.fillStyle = '#8B4513';
          this.ctx.fillRect(drawX + 4, drawY + 4, tileSize - 8, tileSize - 8);
        } else if (tile === 'computer') {
          this.ctx.fillStyle = '#333333';
          this.ctx.fillRect(drawX + 6, drawY + 8, tileSize - 12, tileSize - 16);
          this.ctx.fillStyle = '#4488FF'; // Screen
          this.ctx.fillRect(drawX + 8, drawY + 10, tileSize - 16, tileSize - 20);
        } else if (tile === 'security_desk') {
          this.ctx.fillStyle = '#222222';
          this.ctx.fillRect(drawX + 2, drawY + 2, tileSize - 4, tileSize - 4);
          this.ctx.fillStyle = '#FF4444'; // Red screens
          this.ctx.fillRect(drawX + 4, drawY + 4, tileSize/2 - 6, tileSize/2 - 6);
        } else if (tile === 'extraction') {
          this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
          this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
          this.ctx.strokeStyle = '#00FF00';
          this.ctx.strokeRect(drawX + 4, drawY + 4, tileSize - 8, tileSize - 8);
        } else if (tile === 'objective') {
          this.ctx.fillStyle = '#FFD700'; // Gold
          this.ctx.beginPath();
          this.ctx.arc(drawX + tileSize/2, drawY + tileSize/2, tileSize/3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  private renderWallLayer(tiles: TileType[][], startCol: number, endCol: number, startRow: number, endRow: number, tileSize: number, viewport: Viewport) {
    const { wallColor, wallEdgeColor } = this.getPalette();
    
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        if (tiles[y][x] === 'wall') {
          const drawX = x * tileSize - viewport.x;
          const drawY = y * tileSize - viewport.y;
          
          this.ctx.fillStyle = wallColor;
          this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
          
          // 3D edge effect
          this.ctx.fillStyle = wallEdgeColor;
          this.ctx.fillRect(drawX, drawY + tileSize - 4, tileSize, 4);
        }
      }
    }
  }

  private renderLightingOverlay(viewport: Viewport) {
    this.ctx.fillStyle = 'rgba(0, 0, 10, 0.4)';
    this.ctx.fillRect(0, 0, viewport.width, viewport.height);
  }

  private renderDoor(x: number, y: number, size: number, type: DoorType, horizontal: boolean) {
    let color = '#FFFFFF';
    switch (type) {
      case 'standard': color = '#00FF00'; break; // green unlocked
      case 'keycard': color = '#FFFF00'; break; // yellow
      case 'code': color = '#0088FF'; break; // blue hackable
      case 'vault': color = '#FF0000'; break; // red locked
      case 'lockpick': color = '#FFA500'; break; // orange
    }

    this.ctx.fillStyle = color;
    if (horizontal) {
      this.ctx.fillRect(x, y + size/2 - 4, size, 8);
    } else {
      this.ctx.fillRect(x + size/2 - 4, y, 8, size);
    }
  }

  private getPalette() {
    switch (this.locationType) {
      case 'bank': return { floorColor: '#3d3024', gridColor: '#4a3c2d', wallColor: '#2a2a2a', wallEdgeColor: '#1a1a1a' };
      case 'jewelry': return { floorColor: '#222233', gridColor: '#2a2a40', wallColor: '#111122', wallEdgeColor: '#080811' };
      case 'museum': return { floorColor: '#443333', gridColor: '#554444', wallColor: '#221111', wallEdgeColor: '#110000' };
      case 'mansion': return { floorColor: '#552222', gridColor: '#663333', wallColor: '#331111', wallEdgeColor: '#220000' };
      case 'datacenter': return { floorColor: '#112233', gridColor: '#223344', wallColor: '#0a1a2a', wallEdgeColor: '#051015' };
      case 'military': return { floorColor: '#333333', gridColor: '#444444', wallColor: '#223322', wallEdgeColor: '#112211' };
      case 'vault': return { floorColor: '#1a1a1a', gridColor: '#2a2a2a', wallColor: '#333333', wallEdgeColor: '#222222' };
      default: return { floorColor: '#2a2a2a', gridColor: '#3a3a3a', wallColor: '#1a1a2a', wallEdgeColor: '#0a0a1a' };
    }
  }
}
