import type { Position, Bounds, GuardStateType } from '../types';

export class Guard {
    public x: number;
    public y: number;
    public width: number = 24;
    public height: number = 24;
    public rotation: number = 0;
    public active: boolean = true;

    public state: GuardStateType = 'patrol';
    public health: number = 100;
    public speed: number = 60; // Base speed per second
    public alertLevel: number = 0; // 0-100
    public detectionLevel: number = 0; // 0-100
    
    public patrolRoute: Position[] = [];
    public currentWaypoint: number = 0;
    public waitTimer: number = 0;
    
    public visionAngle: number = Math.PI / 3; // 60 degrees
    public visionRange: number = 150;
    
    public lastKnownPlayerPos: Position | null = null;
    public searchTimer: number = 0;

    constructor(x: number, y: number, patrolRoute: Position[] = []) {
        this.x = x;
        this.y = y;
        this.patrolRoute = patrolRoute;
        if (patrolRoute.length > 0) {
            this.x = patrolRoute[0].x;
            this.y = patrolRoute[0].y;
        }
    }

    public update(dt: number, engine: any) {
        if (!this.active) return;
        
        const speedMultiplier = this.getSpeedMultiplier();
        const currentSpeed = this.speed * speedMultiplier * dt;

        switch (this.state) {
            case 'patrol':
                this.updatePatrol(currentSpeed);
                break;
            case 'suspicious':
                this.updateSuspicious(dt);
                break;
            case 'investigate':
                this.updateInvestigate(currentSpeed);
                break;
            case 'alert':
            case 'chase':
                this.updateChase(currentSpeed, engine);
                break;
            case 'search':
                this.updateSearch(dt);
                break;
            case 'return':
                this.updateReturn(currentSpeed);
                break;
        }
    }

    private getSpeedMultiplier(): number {
        switch (this.state) {
            case 'patrol': return 1;
            case 'suspicious': return 0.5;
            case 'investigate': return 1.2;
            case 'chase':
            case 'alert': return 1.8;
            case 'search': return 1.0;
            case 'return': return 1.0;
            default: return 1;
        }
    }

    private updatePatrol(speed: number) {
        if (this.patrolRoute.length === 0) return;
        
        if (this.waitTimer > 0) {
            this.waitTimer -= 0.016; // Approx dt
            return;
        }

        const target = this.patrolRoute[this.currentWaypoint];
        if (this.moveToTarget(target, speed)) {
            this.currentWaypoint = (this.currentWaypoint + 1) % this.patrolRoute.length;
            this.waitTimer = 1.0; // Wait 1 second at waypoint
        }
    }

    private updateSuspicious(dt: number) {
        this.waitTimer -= dt;
        this.rotation += dt * 0.5; // Look around slowly
        if (this.waitTimer <= 0) {
            if (this.detectionLevel > 60) {
                this.state = 'investigate';
            } else {
                this.state = 'patrol';
            }
        }
    }

    private updateInvestigate(speed: number) {
        if (this.lastKnownPlayerPos) {
            if (this.moveToTarget(this.lastKnownPlayerPos, speed)) {
                this.state = 'search';
                this.searchTimer = 5.0; // Search for 5 seconds
            }
        } else {
            this.state = 'return';
        }
    }

    private updateChase(speed: number, engine: any) {
        const player = engine.player;
        if (player) {
            this.lastKnownPlayerPos = { x: player.x, y: player.y };
            this.moveToTarget(this.lastKnownPlayerPos, speed);
        } else if (this.lastKnownPlayerPos) {
            this.state = 'investigate';
        }
    }

    private updateSearch(dt: number) {
        this.searchTimer -= dt;
        this.rotation += dt * 2.0; // Look around quickly
        if (this.searchTimer <= 0) {
            this.state = 'return';
        }
    }

    private updateReturn(speed: number) {
        if (this.patrolRoute.length === 0) {
            this.state = 'patrol';
            return;
        }
        
        const target = this.patrolRoute[this.currentWaypoint];
        if (this.moveToTarget(target, speed)) {
            this.state = 'patrol';
        }
    }

    private moveToTarget(target: Position, speed: number): boolean {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) return true; // Reached target
        
        this.rotation = Math.atan2(dy, dx);
        this.x += (dx / dist) * speed;
        this.y += (dy / dist) * speed;
        return false;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Position) {
        if (!this.active) return;
        
        const renderX = this.x - camera.x;
        const renderY = this.y - camera.y;

        // Draw vision cone
        ctx.save();
        ctx.translate(renderX, renderY);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, this.visionRange, -this.visionAngle / 2, this.visionAngle / 2);
        ctx.lineTo(0, 0);
        
        if (this.state === 'alert' || this.state === 'chase' || this.detectionLevel > 90) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        } else if (this.state === 'investigate' || this.state === 'suspicious' || this.detectionLevel > 30) {
            ctx.fillStyle = 'rgba(255, 165, 0, 0.3)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        }
        ctx.fill();
        ctx.restore();

        // Draw guard body
        ctx.save();
        ctx.translate(renderX, renderY);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = '#000080'; // Navy blue uniform
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Direction indicator (head/hat)
        ctx.fillStyle = '#404040';
        ctx.beginPath();
        ctx.arc(this.width / 4, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        // Draw state indicator
        if (this.state !== 'patrol') {
            ctx.fillStyle = this.state === 'chase' || this.state === 'alert' ? 'red' : 'orange';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            let icon = '?';
            if (this.state === 'chase' || this.state === 'alert') icon = '!';
            if (this.state === 'search') icon = '...';
            ctx.fillText(icon, renderX, renderY - this.height);
        }
    }
}
