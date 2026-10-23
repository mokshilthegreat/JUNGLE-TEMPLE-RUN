import { Loot } from '../entities/Loot';

export class InventorySystem {
    private bagLevels = [500, 1000, 2000, 3500, 5000, 7500, 10000];
    private currentLevelIndex: number = 0;
    
    bagCapacity: number = this.bagLevels[0];
    currentLoad: number = 0;
    collectedLoot: Loot[] = [];
    totalValue: number = 0;

    canCarry(weight: number): boolean {
        return this.currentLoad + weight <= this.bagCapacity;
    }

    addLoot(loot: Loot): boolean {
        if (this.canCarry(loot.weight)) {
            this.collectedLoot.push(loot);
            this.currentLoad += loot.weight;
            this.totalValue += loot.value;
            return true;
        }
        return false; // Bag full
    }

    getBagPercentage(): number {
        return (this.currentLoad / this.bagCapacity) * 100;
    }

    isBagFull(): boolean {
        return this.currentLoad >= this.bagCapacity;
    }

    getBagLevel(): number {
        return this.currentLevelIndex + 1;
    }

    getBagUpgradeCost(): number {
        if (this.currentLevelIndex >= this.bagLevels.length - 1) return -1;
        // Cost formula, e.g., next capacity * 2
        return this.bagLevels[this.currentLevelIndex + 1] * 2;
    }

    getNextBagCapacity(): number {
        if (this.currentLevelIndex >= this.bagLevels.length - 1) return this.bagCapacity;
        return this.bagLevels[this.currentLevelIndex + 1];
    }

    upgradeBag(money: number): boolean {
        const cost = this.getBagUpgradeCost();
        if (cost !== -1 && money >= cost) {
            this.currentLevelIndex++;
            this.bagCapacity = this.bagLevels[this.currentLevelIndex];
            return true;
        }
        return false;
    }

    getLoadString(): string {
        return `${this.currentLoad.toLocaleString()} / ${this.bagCapacity.toLocaleString()}`;
    }

    clearForMission() {
        this.currentLoad = 0;
        this.totalValue = 0;
        this.collectedLoot = [];
        // upgrades remain intact
    }
}
