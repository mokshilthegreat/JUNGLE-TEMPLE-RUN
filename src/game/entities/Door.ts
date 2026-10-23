export type LockType = 'standard' | 'code' | 'keycard' | 'lockpick' | 'vault';
export type DoorState = 'locked' | 'hacking' | 'unlocked' | 'opening' | 'open' | 'closed';

export interface Position {
    x: number;
    y: number;
}

export interface Camera {
    x: number;
    y: number;
}

export class Door {
    position: Position;
    size: { width: number, height: number } = { width: 32, height: 32 };
    lockType: LockType;
    state: DoorState;
    openProgress: number = 0; // 0 to 1
    horizontal: boolean;

    constructor(x: number, y: number, lockType: LockType = 'standard', horizontal: boolean = true) {
        this.position = { x, y };
        this.lockType = lockType;
        this.state = lockType === 'standard' ? 'closed' : 'locked';
        this.horizontal = horizontal;
    }

    update(dt: number) {
        if (this.state === 'opening') {
            this.openProgress += dt / 0.5; // opens over 0.5 seconds
            if (this.openProgress >= 1) {
                this.openProgress = 1;
                this.state = 'open';
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const x = this.position.x - camera.x;
        const y = this.position.y - camera.y;
        
        ctx.save();
        
        let color = '#22c55e'; // standard (green)
        if (this.lockType === 'code') color = '#3b82f6'; // blue
        if (this.lockType === 'keycard') color = '#eab308'; // yellow
        if (this.lockType === 'lockpick') color = '#94a3b8'; // gray
        if (this.lockType === 'vault') color = '#ffd700'; // gold
        if (this.state === 'locked' && this.lockType !== 'code' && this.lockType !== 'keycard' && this.lockType !== 'lockpick' && this.lockType !== 'vault') color = '#ef4444'; // generic locked red
        
        if (this.state === 'locked' || this.state === 'closed' || this.state === 'hacking') {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, this.size.width, this.size.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, this.size.width, this.size.height);
            
            // Draw lock icon
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 12, y + 12, 8, 8);
            ctx.beginPath();
            ctx.arc(x + 16, y + 12, 4, Math.PI, 0);
            ctx.stroke();
        } else if (this.state === 'opening') {
            ctx.fillStyle = color;
            ctx.globalAlpha = 1 - (this.openProgress * 0.5);
            
            if (this.horizontal) {
                ctx.fillRect(x + (this.size.width * this.openProgress), y, this.size.width * (1 - this.openProgress), this.size.height);
            } else {
                ctx.fillRect(x, y + (this.size.height * this.openProgress), this.size.width, this.size.height * (1 - this.openProgress));
            }
            ctx.globalAlpha = 1;
        } else if (this.state === 'open') {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            if (this.horizontal) {
                ctx.fillRect(x, y, this.size.width, 2);
            } else {
                ctx.fillRect(x, y, 2, this.size.height);
            }
            ctx.globalAlpha = 1;
        }
        
        ctx.restore();
    }

    isBlocking(): boolean {
        return ['locked', 'closed', 'hacking', 'opening'].includes(this.state);
    }

    interact(playerHasKeycard: boolean): string {
        if (this.state === 'open' || this.state === 'opening') return "";
        
        if (this.lockType === 'standard') {
            return "[E] OPEN DOOR";
        } else if (this.lockType === 'code') {
            return "[E] HACK TERMINAL";
        } else if (this.lockType === 'keycard') {
            if (playerHasKeycard) {
                return "[E] USE KEYCARD";
            } else {
                return "ACCESS DENIED - KEYCARD REQUIRED";
            }
        } else if (this.lockType === 'lockpick') {
            return "[E] LOCKPICK";
        } else if (this.lockType === 'vault') {
            return "[E] ACCESS VAULT";
        }
        
        return "";
    }
}
