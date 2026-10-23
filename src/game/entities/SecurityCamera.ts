import type { Position, Bounds } from '../types';

export type CameraState = 'active' | 'disabled' | 'destroyed';

export class SecurityCamera {
    public x: number;
    public y: number;
    public state: CameraState = 'active';
    
    public rotation: number = 0;
    public startAngle: number;
    public endAngle: number;
    public sweepSpeed: number = 0.5; // radians per second
    public sweepDirection: number = 1;
    
    public visionAngle: number = Math.PI / 4; // 45 degrees
    public visionRange: number = 200;
    public detectionLevel: number = 0;
    
    constructor(x: number, y: number, startAngle: number, endAngle: number) {
        this.x = x;
        this.y = y;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.rotation = startAngle;
    }

    public update(dt: number) {
        if (this.state !== 'active') {
            this.detectionLevel = 0;
            return;
        }

        // Sweep logic
        this.rotation += this.sweepSpeed * this.sweepDirection * dt;
        
        // Handle angle wrapping and reversing direction
        if (this.sweepDirection > 0 && this.rotation >= this.endAngle) {
            this.rotation = this.endAngle;
            this.sweepDirection = -1;
        } else if (this.sweepDirection < 0 && this.rotation <= this.startAngle) {
            this.rotation = this.startAngle;
            this.sweepDirection = 1;
        }
        
        // Natural detection decay if player not seen
        this.detectionLevel = Math.max(0, this.detectionLevel - dt * 10);
    }

    public checkDetection(player: any, walls: Bounds[], dt: number, lineOfSightFn: (from: Position, to: Position, walls: Bounds[]) => boolean) {
        if (this.state !== 'active' || !player || player.isHidden) return;

        const playerPos = { x: player.x, y: player.y };
        if (this.isPointInVisionCone(playerPos)) {
            if (lineOfSightFn({x: this.x, y: this.y}, playerPos, walls)) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                let rate = 40 * (1 - dist / this.visionRange);
                if (rate < 5) rate = 5;
                if (player.isCrouching) rate *= 0.4;
                
                this.detectionLevel = Math.min(100, this.detectionLevel + rate * dt * 2); // Multiplier since decay is fast
            }
        }
    }

    private isPointInVisionCone(point: Position): boolean {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > this.visionRange) return false;
        
        const angleToPoint = Math.atan2(dy, dx);
        let angleDiff = angleToPoint - this.rotation;
        
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        return Math.abs(angleDiff) <= this.visionAngle / 2;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Position) {
        const renderX = this.x - camera.x;
        const renderY = this.y - camera.y;

        // Draw vision cone
        if (this.state === 'active') {
            ctx.save();
            ctx.translate(renderX, renderY);
            ctx.rotate(this.rotation);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.visionRange, -this.visionAngle / 2, this.visionAngle / 2);
            ctx.lineTo(0, 0);
            
            if (this.detectionLevel > 0) {
                // Fade to red based on detection
                const alpha = Math.min(0.5, 0.2 + (this.detectionLevel / 100) * 0.3);
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
            } else {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; // Cyan/teal
            }
            
            ctx.fill();
            
            // Scan line effect
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.visionRange, -this.visionAngle / 2 + (Math.random() * 0.1 - 0.05), this.visionAngle / 2 + (Math.random() * 0.1 - 0.05));
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.stroke();
            
            ctx.restore();
        }

        // Draw camera body
        ctx.save();
        ctx.translate(renderX, renderY);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(-8, -8, 16, 16);
        
        ctx.rotate(this.rotation);
        ctx.fillStyle = '#555';
        ctx.fillRect(0, -4, 12, 8); // Lens barrel
        
        // Status light
        ctx.fillStyle = this.state === 'active' ? (this.detectionLevel > 0 ? '#ff0000' : '#00ff00') : '#555555';
        ctx.beginPath();
        ctx.arc(10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}
