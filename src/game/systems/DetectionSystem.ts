export class DetectionSystem {
    private eyeLevel: number = 0; // 0-100

    public update(dt: number, player: any, guards: any[], cameras: any[]) {
        let maxLocalDetection = 0;

        // Check guards
        for (const guard of guards) {
            if (guard.detectionLevel > maxLocalDetection) {
                maxLocalDetection = guard.detectionLevel;
            }
        }

        // Check cameras
        for (const camera of cameras) {
            if (camera.detectionLevel > maxLocalDetection) {
                maxLocalDetection = camera.detectionLevel;
            }
        }

        // Update global eye level based on max local detection
        // Smoothly interpolate towards the max detection
        if (maxLocalDetection > this.eyeLevel) {
            // Rising fast
            this.eyeLevel = Math.min(100, this.eyeLevel + (maxLocalDetection - this.eyeLevel) * 5 * dt);
        } else {
            // Falling slowly
            this.eyeLevel = Math.max(0, this.eyeLevel - dt * 20);
        }

        // Apply global modifiers to max detection effectively if needed
        // But individual guard/camera detection logic handles distance, crouch, sprint, hiding, etc.
        // The Eye level just reflects the highest danger level currently aimed at the player.
    }

    public getEyeLevel(): number {
        return this.eyeLevel;
    }

    public isDetected(): boolean {
        return this.eyeLevel >= 100;
    }

    public getDetectionState(): 'hidden' | 'noticed' | 'suspicious' | 'detected' {
        if (this.eyeLevel >= 100) return 'detected';
        if (this.eyeLevel >= 60) return 'suspicious';
        if (this.eyeLevel >= 30) return 'noticed';
        return 'hidden';
    }
}
