import { Door, Position } from '../entities/Door';

export class DoorSystem {
    private doors: Door[] = [];

    addDoor(door: Door) {
        this.doors.push(door);
    }

    getDoors(): Door[] {
        return this.doors;
    }

    update(dt: number) {
        for (const door of this.doors) {
            door.update(dt);
        }
    }

    findInteractableDoor(playerPos: Position, range: number = 50): Door | null {
        let nearestDoor: Door | null = null;
        let minDistance = range;

        for (const door of this.doors) {
            const centerX = door.position.x + door.size.width / 2;
            const centerY = door.position.y + door.size.height / 2;
            
            const dx = playerPos.x - centerX;
            const dy = playerPos.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= minDistance) {
                minDistance = distance;
                nearestDoor = door;
            }
        }

        return nearestDoor;
    }

    openDoor(door: Door) {
        if (door.state === 'closed' || door.state === 'unlocked' || door.state === 'locked') {
            door.state = 'opening';
            door.openProgress = 0;
        }
    }

    lockDoor(door: Door) {
        if (door.state === 'closed' || door.state === 'unlocked' || door.state === 'open') {
            door.state = 'locked';
            door.openProgress = 0;
        }
    }

    unlockDoor(door: Door) {
        if (door.state === 'locked' || door.state === 'hacking') {
            door.state = 'unlocked';
        }
    }

    isPathBlocked(x: number, y: number, width: number, height: number): boolean {
        for (const door of this.doors) {
            if (door.isBlocking()) {
                if (
                    x < door.position.x + door.size.width &&
                    x + width > door.position.x &&
                    y < door.position.y + door.size.height &&
                    y + height > door.position.y
                ) {
                    return true;
                }
            }
        }
        return false;
    }
}
