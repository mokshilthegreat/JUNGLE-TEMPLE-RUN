export class AlarmSystem {
    private alarmLevel: number = 0; // 0-100
    private decayRate: number = 2; // per second
    private lockdown: boolean = false;
    private sirenState: number = 0;

    public increaseAlarm(amount: number, source: string) {
        this.alarmLevel = Math.min(100, this.alarmLevel + amount);
        if (this.alarmLevel >= 100 && !this.lockdown) {
            this.triggerLockdown();
        }
    }

    public decreaseAlarm(dt: number) {
        // Only decrease if not in lockdown
        if (!this.lockdown && this.alarmLevel > 0) {
            this.alarmLevel = Math.max(0, this.alarmLevel - this.decayRate * dt);
        }
    }

    public update(dt: number) {
        this.decreaseAlarm(dt);
        if (this.lockdown) {
            this.sirenState = (this.sirenState + dt * 5) % (Math.PI * 2);
        } else {
            this.sirenState = 0;
        }
    }

    private triggerLockdown() {
        this.lockdown = true;
        this.alarmLevel = 100;
        console.log("SECURITY LOCKDOWN INITIATED");
        // Additional lockdown logic would hook into the main game engine here
        // e.g. engine.eventEmitter.emit('lockdown');
    }

    public isLockdown(): boolean {
        return this.lockdown;
    }

    public getAlarmLevel(): number {
        return this.alarmLevel;
    }

    public getVisualEffects() {
        let screenTint = 'rgba(255, 0, 0, 0)';
        if (this.lockdown) {
            const alpha = 0.1 + Math.sin(this.sirenState) * 0.1; // Pulsing effect
            screenTint = `rgba(255, 0, 0, ${alpha})`;
        } else if (this.alarmLevel > 50) {
            const alpha = (this.alarmLevel - 50) / 50 * 0.1;
            screenTint = `rgba(255, 100, 0, ${alpha})`;
        }
        
        return {
            screenTint,
            sirenActive: this.lockdown
        };
    }
}
