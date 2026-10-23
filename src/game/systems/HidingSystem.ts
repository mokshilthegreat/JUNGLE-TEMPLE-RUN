import type { Position } from '../types';

export type HidingSpotType = 'locker' | 'crate' | 'dark_corner' | 'under_desk';

export interface HidingSpot {
    id: string;
    x: number;
    y: number;
    radius: number;
    type: HidingSpotType;
}

export class HidingSystem {
    private hidingSpots: HidingSpot[] = [];
    public isPlayerHidden: boolean = false;
    public currentHidingSpot: HidingSpot | null = null;
    
    // Config
    private interactionRadius: number = 40;

    constructor(spots: HidingSpot[] = []) {
        this.hidingSpots = spots;
    }

    public addHidingSpot(spot: HidingSpot) {
        this.hidingSpots.push(spot);
    }

    public enterHidingSpot(player: any): boolean {
        if (this.isPlayerHidden) return false;

        const playerPos = { x: player.x, y: player.y };
        const spot = this.getNearbyHidingSpot(playerPos);
        
        if (spot) {
            this.isPlayerHidden = true;
            this.currentHidingSpot = spot;
            player.isHidden = true; // Hook into player object
            
            // Snap player to center of hiding spot (optional, based on design)
            player.x = spot.x;
            player.y = spot.y;
            
            return true;
        }
        
        return false;
    }

    public exitHidingSpot(player: any): boolean {
        if (!this.isPlayerHidden) return false;

        this.isPlayerHidden = false;
        this.currentHidingSpot = null;
        player.isHidden = false;
        
        return true;
    }

    public getNearbyHidingSpot(playerPos: Position): HidingSpot | null {
        let closestSpot: HidingSpot | null = null;
        let minDistance = this.interactionRadius;

        for (const spot of this.hidingSpots) {
            const dx = spot.x - playerPos.x;
            const dy = spot.y - playerPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= minDistance) {
                minDistance = dist;
                closestSpot = spot;
            }
        }

        return closestSpot;
    }

    public update(player: any, keys: { [key: string]: boolean }, previousKeys: { [key: string]: boolean }) {
        // Handle E key press to enter/exit hiding spot
        if (keys['e'] && !previousKeys['e']) {
            if (this.isPlayerHidden) {
                this.exitHidingSpot(player);
            } else {
                this.enterHidingSpot(player);
            }
        }
    }
}
