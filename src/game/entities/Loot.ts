import { Position, Camera } from './Door';

export type LootType = 'cash' | 'gold' | 'diamond' | 'jewelry' | 'watch' | 'painting' | 'artifact' | 'data_drive' | 'gold_bar';

export class Loot {
    id: string;
    position: Position;
    type: LootType;
    value: number;
    weight: number;
    name: string;
    collected: boolean = false;
    
    private floatOffset: number = 0;
    private floatSpeed: number = 2;
    private time: number = 0;

    constructor(id: string, x: number, y: number, type: LootType, value: number, weight: number, name: string) {
        this.id = id;
        this.position = { x, y };
        this.type = type;
        this.value = value;
        this.weight = weight;
        this.name = name;
        this.time = Math.random() * 100; // random start phase
    }

    update(dt: number) {
        if (this.collected) return;
        this.time += dt;
        this.floatOffset = Math.sin(this.time * this.floatSpeed) * 5; // 5px float amplitude
    }

    render(ctx: CanvasRenderingContext2D, camera: Camera) {
        if (this.collected) return;

        const x = this.position.x - camera.x;
        const y = this.position.y - camera.y + this.floatOffset;

        ctx.save();
        
        // Glow effect
        ctx.shadowBlur = 10;
        
        switch (this.type) {
            case 'cash':
                ctx.fillStyle = '#4ade80'; // light green
                ctx.shadowColor = '#4ade80';
                ctx.fillRect(x - 8, y - 5, 16, 10);
                break;
            case 'gold':
            case 'gold_bar':
                ctx.fillStyle = '#facc15'; // yellow/gold
                ctx.shadowColor = '#facc15';
                ctx.beginPath();
                ctx.moveTo(x - 10, y + 5);
                ctx.lineTo(x + 10, y + 5);
                ctx.lineTo(x + 8, y - 5);
                ctx.lineTo(x - 8, y - 5);
                ctx.fill();
                break;
            case 'diamond':
                ctx.fillStyle = '#60a5fa'; // blue
                ctx.shadowColor = '#60a5fa';
                ctx.beginPath();
                ctx.moveTo(x, y - 8);
                ctx.lineTo(x + 8, y);
                ctx.lineTo(x, y + 8);
                ctx.lineTo(x - 8, y);
                ctx.fill();
                break;
            case 'jewelry':
            case 'watch':
                ctx.fillStyle = '#c084fc'; // purple
                ctx.shadowColor = '#c084fc';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'painting':
            case 'artifact':
            case 'data_drive':
            default:
                ctx.fillStyle = '#f87171'; // red/various
                ctx.shadowColor = '#f87171';
                ctx.fillRect(x - 8, y - 8, 16, 16);
                break;
        }
        
        ctx.restore();
    }

    isNearPlayer(playerPos: Position, range: number = 40): boolean {
        if (this.collected) return false;
        const dx = this.position.x - playerPos.x;
        const dy = this.position.y - playerPos.y;
        return (dx * dx + dy * dy) <= (range * range);
    }

    collect(): number {
        this.collected = true;
        return this.value;
    }
}
