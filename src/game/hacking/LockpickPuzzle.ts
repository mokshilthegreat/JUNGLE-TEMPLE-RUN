export type PinState = 'unset' | 'setting' | 'set';

export class LockpickPuzzle {
    private pins: PinState[] = [];
    private pinHeights: number[] = [];
    private currentPinIndex: number = 0;
    private remainingPicks: number = 3;
    private pickY: number = 0;
    private tolerance: number = 0.1;

    constructor(difficulty: number = 1, skillLevel: number = 1) {
        this.startPuzzle(difficulty, skillLevel);
    }

    startPuzzle(difficulty: number, skillLevel: number) {
        const numPins = Math.max(2, Math.min(5, difficulty + 1));
        this.pins = new Array(numPins).fill('unset');
        this.pinHeights = [];
        
        for (let i = 0; i < numPins; i++) {
            this.pinHeights.push(0.2 + Math.random() * 0.6); // 0.2 to 0.8 height
        }
        
        this.currentPinIndex = 0;
        this.remainingPicks = skillLevel + 2;
        this.tolerance = 0.15 - (difficulty * 0.02) + (skillLevel * 0.02);
        this.pickY = 0;
    }

    updatePick(yPosition: number) {
        // yPosition from 0 to 1
        this.pickY = Math.max(0, Math.min(1, yPosition));
    }

    tryPin(): boolean {
        if (this.currentPinIndex >= this.pins.length || this.remainingPicks <= 0) return false;

        const targetHeight = this.pinHeights[this.currentPinIndex];
        const diff = Math.abs(this.pickY - targetHeight);

        if (diff <= this.tolerance) {
            this.pins[this.currentPinIndex] = 'set';
            this.currentPinIndex++;
            return true;
        } else {
            this.remainingPicks--;
            // Reset current pin progress on failure, maybe reset all based on design
            if (this.currentPinIndex > 0) {
                // Hard mode: drop previous pins
                // this.currentPinIndex--;
                // this.pins[this.currentPinIndex] = 'unset';
            }
            return false;
        }
    }

    isComplete(): boolean {
        return this.currentPinIndex >= this.pins.length;
    }

    isFailed(): boolean {
        return this.remainingPicks <= 0;
    }

    getPinStates(): PinState[] {
        return this.pins;
    }

    getCurrentPin(): number {
        return this.currentPinIndex;
    }

    getSweetSpotRange(): { min: number, max: number } {
        if (this.currentPinIndex >= this.pinHeights.length) return { min: 0, max: 0 };
        const target = this.pinHeights[this.currentPinIndex];
        return {
            min: Math.max(0, target - this.tolerance),
            max: Math.min(1, target + this.tolerance)
        };
    }

    getRemainingPicks(): number {
        return this.remainingPicks;
    }
    
    getPickY(): number {
        return this.pickY;
    }
}
