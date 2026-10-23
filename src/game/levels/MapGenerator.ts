import type { MapData, TileType, LocationType, Room, DoorData, GuardSpawn, CameraPosition, LootPosition, Position } from '../types';

export class MapGenerator {
  private width: number = 60;
  private height: number = 40;
  private tiles: TileType[][] = [];
  private rooms: Room[] = [];
  private doors: DoorData[] = [];
  private guardSpawns: GuardSpawn[] = [];
  private cameraPositions: CameraPosition[] = [];
  private lootPositions: LootPosition[] = [];
  private playerSpawn: Position = { x: 0, y: 0 };
  private extractionPoint: Position = { x: 0, y: 0 };
  private vaultPosition: Position | undefined;
  
  public generateMap(missionId: number, locationType: LocationType, difficulty: number): MapData {
    // Reset state
    this.width = locationType === 'vault' || locationType === 'military' || locationType === 'datacenter' ? 80 : 60;
    this.height = locationType === 'vault' || locationType === 'military' || locationType === 'datacenter' ? 60 : 40;
    this.tiles = Array(this.height).fill(null).map(() => Array(this.width).fill('wall'));
    this.rooms = [];
    this.doors = [];
    this.guardSpawns = [];
    this.cameraPositions = [];
    this.lootPositions = [];
    
    // BSP or Grid based room generation
    this.generateRooms(locationType, difficulty);
    this.generateCorridors();
    this.placeDoors(difficulty);
    this.populateRooms(locationType, difficulty);
    this.setSpawns();

    return {
      width: this.width,
      height: this.height,
      tileSize: 32,
      tiles: this.tiles,
      rooms: this.rooms,
      doors: this.doors,
      guardSpawns: this.guardSpawns,
      cameraPositions: this.cameraPositions,
      lootPositions: this.lootPositions,
      playerSpawn: this.playerSpawn,
      extractionPoint: this.extractionPoint,
      vaultPosition: this.vaultPosition
    };
  }

  private generateRooms(locationType: LocationType, difficulty: number) {
    const numRooms = 5 + Math.floor(difficulty / 2) + (locationType === 'vault' ? 5 : 0);
    const minSize = 6;
    const maxSize = 12;
    
    // Entry room
    const entryRoom: Room = {
      x: 2, y: Math.floor(this.height / 2) - 4,
      width: 8, height: 8,
      type: 'entry'
    };
    this.rooms.push(entryRoom);
    this.carveRoom(entryRoom);
    
    // Generate other rooms trying to place them left to right
    for (let i = 0; i < numRooms; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 50) {
        const w = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        const h = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        const x = Math.floor(Math.random() * (this.width - w - 4)) + 2;
        const y = Math.floor(Math.random() * (this.height - h - 4)) + 2;
        
        const newRoom: Room = { x, y, width: w, height: h, type: 'office' };
        
        if (!this.roomsOverlap(newRoom)) {
          this.rooms.push(newRoom);
          this.carveRoom(newRoom);
          placed = true;
        }
        attempts++;
      }
    }

    // Sort rooms by x position to determine depth
    this.rooms.sort((a, b) => a.x - b.x);
    
    // Assign types
    if (this.rooms.length > 1) {
      this.rooms[0].type = 'entry'; // Keep first as entry just in case
      this.rooms[this.rooms.length - 1].type = 'vault';
      this.vaultPosition = {
        x: this.rooms[this.rooms.length - 1].x + Math.floor(this.rooms[this.rooms.length - 1].width / 2),
        y: this.rooms[this.rooms.length - 1].y + Math.floor(this.rooms[this.rooms.length - 1].height / 2)
      };

      // Assign security room somewhere in the middle
      const midIndex = Math.floor(this.rooms.length / 2);
      if (this.rooms[midIndex].type !== 'vault' && this.rooms[midIndex].type !== 'entry') {
        this.rooms[midIndex].type = 'security';
      }
      
      // Assign other types based on location
      for (let i = 1; i < this.rooms.length - 1; i++) {
        if (this.rooms[i].type === 'office') {
          if (locationType === 'datacenter') this.rooms[i].type = 'server';
          else if (locationType === 'museum') this.rooms[i].type = 'exhibition';
          else if (locationType === 'jewelry') this.rooms[i].type = 'exhibition';
          else if (Math.random() > 0.7) this.rooms[i].type = 'storage';
        }
      }
    }
  }

  private carveRoom(room: Room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        this.tiles[y][x] = 'floor';
      }
    }
  }

  private roomsOverlap(room: Room): boolean {
    for (const r of this.rooms) {
      if (room.x - 1 <= r.x + r.width && room.x + room.width + 1 >= r.x &&
          room.y - 1 <= r.y + r.height && room.y + room.height + 1 >= r.y) {
        return true;
      }
    }
    return false;
  }

  private generateCorridors() {
    for (let i = 0; i < this.rooms.length - 1; i++) {
      const roomA = this.rooms[i];
      const roomB = this.rooms[i + 1];
      
      const centerA = { x: Math.floor(roomA.x + roomA.width / 2), y: Math.floor(roomA.y + roomA.height / 2) };
      const centerB = { x: Math.floor(roomB.x + roomB.width / 2), y: Math.floor(roomB.y + roomB.height / 2) };
      
      // Draw L-shaped corridor
      if (Math.random() > 0.5) {
        this.carveHorizontal(centerA.x, centerB.x, centerA.y);
        this.carveVertical(centerA.y, centerB.y, centerB.x);
      } else {
        this.carveVertical(centerA.y, centerB.y, centerA.x);
        this.carveHorizontal(centerA.x, centerB.x, centerB.y);
      }
    }
  }

  private carveHorizontal(x1: number, x2: number, y: number) {
    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);
    for (let x = start; x <= end; x++) {
      this.tiles[y][x] = 'floor';
      this.tiles[y-1][x] = this.tiles[y-1][x] === 'wall' ? 'floor' : this.tiles[y-1][x]; // Wider corridors
    }
  }

  private carveVertical(y1: number, y2: number, x: number) {
    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);
    for (let y = start; y <= end; y++) {
      this.tiles[y][x] = 'floor';
      this.tiles[y][x-1] = this.tiles[y][x-1] === 'wall' ? 'floor' : this.tiles[y][x-1]; // Wider corridors
    }
  }

  private placeDoors(difficulty: number) {
    // Simple heuristic: look for floor tiles bounded by walls
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        if (this.tiles[y][x] === 'floor') {
          const isHorizontalDoor = this.tiles[y-1][x] === 'wall' && this.tiles[y+1][x] === 'wall' && this.tiles[y][x-1] === 'floor' && this.tiles[y][x+1] === 'floor';
          const isVerticalDoor = this.tiles[y][x-1] === 'wall' && this.tiles[y][x+1] === 'wall' && this.tiles[y-1][x] === 'floor' && this.tiles[y+1][x] === 'floor';
          
          if (isHorizontalDoor || isVerticalDoor) {
            // Check spacing with other doors
            const tooClose = this.doors.some(d => Math.abs(d.x - x) + Math.abs(d.y - y) < 4);
            if (!tooClose) {
              this.tiles[y][x] = 'door';
              
              let type: 'standard' | 'code' | 'keycard' | 'lockpick' | 'vault' = 'standard';
              const rand = Math.random();
              if (rand > 0.9 && difficulty > 4) type = 'vault';
              else if (rand > 0.7) type = 'keycard';
              else if (rand > 0.5) type = 'code';
              else if (rand > 0.3) type = 'lockpick';
              
              this.doors.push({
                x, y,
                type,
                locked: type !== 'standard',
                horizontal: isHorizontalDoor
              });
            }
          }
        }
      }
    }
  }

  private populateRooms(locationType: LocationType, difficulty: number) {
    for (const room of this.rooms) {
      if (room.type === 'entry') continue;

      // Cameras
      if (Math.random() < 0.5 + (difficulty * 0.05)) {
        this.cameraPositions.push({
          x: room.x + 1,
          y: room.y + 1,
          direction: 'down'
        });
      }

      // Guards
      if (Math.random() < 0.4 + (difficulty * 0.05)) {
        this.guardSpawns.push({
          x: room.x + Math.floor(room.width / 2),
          y: room.y + Math.floor(room.height / 2)
        });
      }

      // Loot
      if (Math.random() < 0.6) {
        this.lootPositions.push({
          x: room.x + Math.floor(Math.random() * (room.width - 2)) + 1,
          y: room.y + Math.floor(Math.random() * (room.height - 2)) + 1,
          value: (Math.floor(Math.random() * 5) + 1) * 100 * difficulty
        });
      }

      // Decor
      this.tiles[room.y + 2][room.x + 2] = 'furniture';
      
      if (room.type === 'security') {
        this.tiles[room.y + Math.floor(room.height/2)][room.x + Math.floor(room.width/2)] = 'security_desk';
      }
      if (room.type === 'office' || room.type === 'server') {
        this.tiles[room.y + 2][room.x + room.width - 3] = 'computer';
      }
      if (room.type === 'vault') {
        this.tiles[room.y + Math.floor(room.height/2)][room.x + Math.floor(room.width/2)] = 'objective';
      }
    }
  }

  private setSpawns() {
    const entryRoom = this.rooms.find(r => r.type === 'entry') || this.rooms[0];
    this.playerSpawn = {
      x: entryRoom.x + 2,
      y: entryRoom.y + Math.floor(entryRoom.height / 2)
    };
    this.extractionPoint = {
      x: entryRoom.x + 1,
      y: entryRoom.y + 1
    };
    this.tiles[this.extractionPoint.y][this.extractionPoint.x] = 'extraction';
  }
}
