import type { Guard } from './Guard';
import type { Position, Bounds } from '../types';

export class GuardAI {
    public guards: Guard[] = [];

    public updateAll(dt: number, player: any, walls: Bounds[], alarmSystem: any, detectionSystem: any) {
        let maxDetection = 0;
        
        for (const guard of this.guards) {
            // Update individual guard
            guard.update(dt, { player });
            
            // Check detection
            this.checkPlayerDetection(guard, player, walls, dt);
            
            if (guard.detectionLevel > maxDetection) {
                maxDetection = guard.detectionLevel;
            }
            
            // State transitions based on detection
            if (guard.detectionLevel > 90 && guard.state !== 'chase' && guard.state !== 'alert') {
                guard.state = 'alert';
                this.alertNearbyGuards(guard, this.guards);
                if (alarmSystem) alarmSystem.increaseAlarm(20, 'guard_spotted');
            } else if (guard.detectionLevel > 60 && guard.state !== 'investigate' && guard.state !== 'chase' && guard.state !== 'alert') {
                guard.state = 'investigate';
                guard.lastKnownPlayerPos = { x: player.x, y: player.y };
            } else if (guard.detectionLevel > 30 && guard.state === 'patrol') {
                guard.state = 'suspicious';
                guard.waitTimer = 2.0;
            }
            
            // Decay detection if not seeing player
            if (!this.canSeePlayer(guard, player, walls)) {
                guard.detectionLevel = Math.max(0, guard.detectionLevel - dt * 20);
                if (guard.detectionLevel === 0 && guard.state === 'chase' && guard.searchTimer <= 0) {
                    guard.state = 'search';
                    guard.searchTimer = 5.0;
                }
            }
        }
        
        return maxDetection;
    }

    private canSeePlayer(guard: Guard, player: any, walls: Bounds[]): boolean {
        if (!player || player.isHidden) return false;
        
        const playerPos = { x: player.x, y: player.y };
        if (this.isPointInVisionCone(guard, playerPos)) {
            if (this.lineOfSight(guard, playerPos, walls)) {
                return true;
            }
        }
        return false;
    }

    public checkPlayerDetection(guard: Guard, player: any, walls: Bounds[], dt: number) {
        if (this.canSeePlayer(guard, player, walls)) {
            const dx = player.x - guard.x;
            const dy = player.y - guard.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Base detection rate
            let detectionRate = 50 * (1 - dist / guard.visionRange); 
            if (detectionRate < 10) detectionRate = 10;
            
            if (player.isCrouching) {
                detectionRate *= 0.4; // 60% reduction
            }
            if (player.isSprinting) {
                detectionRate *= 1.2; // 20% increase
            }
            
            guard.detectionLevel = Math.min(100, guard.detectionLevel + detectionRate * dt);
            guard.lastKnownPlayerPos = { x: player.x, y: player.y };
        }
    }

    public lineOfSight(from: Position, to: Position, walls: Bounds[]): boolean {
        // Simple raycast against AABB walls
        // For standard 2D top-down, we check if the line segment from->to intersects any wall rect
        for (const wall of walls) {
            if (this.lineIntersectsRect(from, to, wall)) {
                return false;
            }
        }
        return true;
    }

    private lineIntersectsRect(p1: Position, p2: Position, rect: Bounds): boolean {
        // Check if point is inside
        if (p1.x >= rect.x && p1.x <= rect.x + rect.width && p1.y >= rect.y && p1.y <= rect.y + rect.height) return true;
        if (p2.x >= rect.x && p2.x <= rect.x + rect.width && p2.y >= rect.y && p2.y <= rect.y + rect.height) return true;
        
        // Check intersection with 4 line segments of rect
        const tl = { x: rect.x, y: rect.y };
        const tr = { x: rect.x + rect.width, y: rect.y };
        const bl = { x: rect.x, y: rect.y + rect.height };
        const br = { x: rect.x + rect.width, y: rect.y + rect.height };
        
        if (this.linesIntersect(p1, p2, tl, tr)) return true;
        if (this.linesIntersect(p1, p2, tr, br)) return true;
        if (this.linesIntersect(p1, p2, br, bl)) return true;
        if (this.linesIntersect(p1, p2, bl, tl)) return true;
        
        return false;
    }

    private linesIntersect(p1: Position, p2: Position, p3: Position, p4: Position): boolean {
        const det = (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);
        if (det === 0) return false;
        
        const lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
        const gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }

    public isPointInVisionCone(guard: Guard, point: Position): boolean {
        const dx = point.x - guard.x;
        const dy = point.y - guard.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > guard.visionRange) return false;
        
        const angleToPoint = Math.atan2(dy, dx);
        let angleDiff = angleToPoint - guard.rotation;
        
        // Normalize angleDiff to [-PI, PI]
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        return Math.abs(angleDiff) <= guard.visionAngle / 2;
    }

    public alertNearbyGuards(guard: Guard, allGuards: Guard[]) {
        for (const other of allGuards) {
            if (other === guard) continue;
            
            const dx = other.x - guard.x;
            const dy = other.y - guard.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist <= 200 && other.state !== 'chase' && other.state !== 'alert') {
                other.state = 'investigate';
                other.lastKnownPlayerPos = guard.lastKnownPlayerPos;
            }
        }
    }

    public getAlertLevel(): number {
        let max = 0;
        for (const g of this.guards) {
            if (g.detectionLevel > max) max = g.detectionLevel;
        }
        return max;
    }

    public resetAllGuards() {
        for (const guard of this.guards) {
            guard.state = 'patrol';
            guard.detectionLevel = 0;
            guard.lastKnownPlayerPos = null;
        }
    }
}
