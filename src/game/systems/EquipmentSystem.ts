export type EquipmentType = 'lockpick' | 'advanced_lockpick' | 'emp' | 'smoke_bomb' | 'distraction' | 'hacking_device' | 'keycard' | 'thermal_scanner';

export interface EquipmentData {
    type: EquipmentType;
    name: string;
    count: number;
    maxCount: number;
    consumable: boolean;
    description: string;
}

export class EquipmentSystem {
    private inventory: Map<EquipmentType, EquipmentData> = new Map();
    private selectedIndex: number = 0;
    private equippedTypes: EquipmentType[] = [];

    constructor() {
        this.initDefaultEquipment();
    }

    private initDefaultEquipment() {
        this.addEquipmentType('lockpick', 'Basic Lockpick', 3, 10, true, 'Basic tool for standard locks.');
        this.addEquipmentType('emp', 'EMP Device', 1, 3, true, 'Disables nearby cameras for 10s.');
        this.addEquipmentType('keycard', 'Access Card', 0, 1, false, 'Standard security access card.');
    }

    private addEquipmentType(type: EquipmentType, name: string, count: number, maxCount: number, consumable: boolean, desc: string) {
        this.inventory.set(type, {
            type, name, count, maxCount, consumable, description: desc
        });
        if (!this.equippedTypes.includes(type)) {
            this.equippedTypes.push(type);
        }
    }

    addEquipment(type: EquipmentType, amount: number = 1) {
        const eq = this.inventory.get(type);
        if (eq) {
            eq.count = Math.min(eq.maxCount, eq.count + amount);
        }
    }

    hasEquipment(type: EquipmentType): boolean {
        const eq = this.inventory.get(type);
        return eq ? (!eq.consumable || eq.count > 0) : false;
    }

    getEquipmentCount(type: EquipmentType): number {
        return this.inventory.get(type)?.count || 0;
    }

    useEquipment(type: EquipmentType): boolean {
        const eq = this.inventory.get(type);
        if (!eq) return false;

        if (eq.consumable) {
            if (eq.count > 0) {
                eq.count--;
                return true;
            }
            return false;
        }
        return true; // Non-consumable usage successful
    }

    getEquippedItem(): EquipmentData | null {
        if (this.equippedTypes.length === 0) return null;
        const type = this.equippedTypes[this.selectedIndex];
        return this.inventory.get(type) || null;
    }

    selectEquipment(index: number) {
        if (index >= 0 && index < this.equippedTypes.length) {
            this.selectedIndex = index;
        }
    }

    nextEquipment() {
        if (this.equippedTypes.length > 0) {
            this.selectedIndex = (this.selectedIndex + 1) % this.equippedTypes.length;
        }
    }
    
    previousEquipment() {
        if (this.equippedTypes.length > 0) {
            this.selectedIndex = (this.selectedIndex - 1 + this.equippedTypes.length) % this.equippedTypes.length;
        }
    }
}
