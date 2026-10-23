export type WeaponType = 'silent_pistol' | 'smg' | 'shotgun' | 'sniper' | 'unarmed';

export interface WeaponData {
    type: WeaponType;
    name: string;
    damage: number;
    range: number;
    fireRate: number; // shots per second
    noise: number; // noise radius
    ammo: number;
    maxAmmo: number;
    clipSize: number;
    clipAmmo: number;
    reloadTime: number; // seconds
}

export interface Bullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    range: number;
    distanceTraveled: number;
    active: boolean;
}

export class WeaponSystem {
    private weapons: WeaponData[] = [];
    private currentIndex: number = 0;
    private fireCooldown: number = 0;
    private reloadTimer: number = 0;
    private isReloading: boolean = false;
    
    public bullets: Bullet[] = [];

    constructor() {
        // Initial setup
        this.addWeapon({
            type: 'unarmed',
            name: 'Melee / Unarmed',
            damage: 20,
            range: 40,
            fireRate: 1.5,
            noise: 10,
            ammo: Infinity,
            maxAmmo: Infinity,
            clipSize: Infinity,
            clipAmmo: Infinity,
            reloadTime: 0
        });
        
        this.addWeapon({
            type: 'silent_pistol',
            name: 'Silenced Pistol',
            damage: 35,
            range: 300,
            fireRate: 2,
            noise: 50,
            ammo: 30,
            maxAmmo: 60,
            clipSize: 10,
            clipAmmo: 10,
            reloadTime: 1.5
        });
        
        this.currentIndex = 1; // Default to pistol if available
    }

    addWeapon(weapon: WeaponData) {
        this.weapons.push(weapon);
    }

    getCurrentWeapon(): WeaponData {
        return this.weapons[this.currentIndex];
    }

    switchWeapon(index: number) {
        if (index >= 0 && index < this.weapons.length) {
            this.currentIndex = index;
            this.isReloading = false;
            this.reloadTimer = 0;
        }
    }

    canFire(): boolean {
        if (this.isReloading) return false;
        if (this.fireCooldown > 0) return false;
        
        const w = this.getCurrentWeapon();
        return w.clipAmmo > 0 || w.type === 'unarmed';
    }

    fire(x: number, y: number, angle: number): { fired: boolean, noiseGenerated: number } {
        if (!this.canFire()) {
            // Check if needs auto-reload
            const w = this.getCurrentWeapon();
            if (w.clipAmmo <= 0 && w.ammo > 0 && !this.isReloading && w.type !== 'unarmed') {
                this.reload();
            }
            return { fired: false, noiseGenerated: 0 };
        }

        const w = this.getCurrentWeapon();
        
        if (w.type !== 'unarmed') {
            w.clipAmmo--;
            
            const speed = 500; // px/sec
            this.bullets.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                damage: w.damage,
                range: w.range,
                distanceTraveled: 0,
                active: true
            });
        }
        
        this.fireCooldown = 1 / w.fireRate;
        return { fired: true, noiseGenerated: w.noise };
    }

    reload() {
        const w = this.getCurrentWeapon();
        if (this.isReloading || w.clipAmmo === w.clipSize || w.ammo <= 0 || w.type === 'unarmed') return;
        
        this.isReloading = true;
        this.reloadTimer = w.reloadTime;
    }

    update(dt: number) {
        if (this.fireCooldown > 0) {
            this.fireCooldown -= dt;
        }

        if (this.isReloading) {
            this.reloadTimer -= dt;
            if (this.reloadTimer <= 0) {
                this.isReloading = false;
                const w = this.getCurrentWeapon();
                const needed = w.clipSize - w.clipAmmo;
                const available = Math.min(needed, w.ammo);
                w.clipAmmo += available;
                w.ammo -= available;
            }
        }

        // Update bullets
        for (const bullet of this.bullets) {
            if (!bullet.active) continue;
            
            const dx = bullet.vx * dt;
            const dy = bullet.vy * dt;
            bullet.x += dx;
            bullet.y += dy;
            bullet.distanceTraveled += Math.sqrt(dx*dx + dy*dy);
            
            if (bullet.distanceTraveled >= bullet.range) {
                bullet.active = false;
            }
        }
        
        // Clean up inactive bullets
        this.bullets = this.bullets.filter(b => b.active);
    }
}
