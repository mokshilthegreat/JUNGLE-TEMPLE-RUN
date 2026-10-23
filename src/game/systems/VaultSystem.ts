export class VaultSystem {
    private currentStep: number = 1;
    private totalSteps: number = 7;
    
    private steps = [
        { id: 1, desc: "Find 3 security clues" },
        { id: 2, desc: "Disable all CCTV cameras" },
        { id: 3, desc: "Hack security terminal" },
        { id: 4, desc: "Find vault code" },
        { id: 5, desc: "Enter vault code" },
        { id: 6, desc: "Complete final mechanism" },
        { id: 7, desc: "Vault Access Granted" }
    ];

    private cluesFound: number = 0;
    private camerasDisabled: boolean = false;
    private terminalHacked: boolean = false;
    private codeFound: boolean = false;
    private codeEntered: boolean = false;
    private mechanismComplete: boolean = false;

    getCurrentStep(): number {
        return this.currentStep;
    }

    getStepDescription(): string {
        return this.steps[this.currentStep - 1].desc;
    }

    checkStepCompletion(stepData: any): boolean {
        switch (this.currentStep) {
            case 1:
                return this.cluesFound >= 3;
            case 2:
                return this.camerasDisabled;
            case 3:
                return this.terminalHacked;
            case 4:
                return this.codeFound;
            case 5:
                return this.codeEntered;
            case 6:
                return this.mechanismComplete;
            case 7:
                return true;
        }
        return false;
    }

    completeStep(stepId: number) {
        if (stepId === this.currentStep && this.currentStep < this.totalSteps) {
            this.currentStep++;
        }
    }

    // specific triggers
    addClue() {
        this.cluesFound++;
        if (this.currentStep === 1 && this.cluesFound >= 3) {
            this.completeStep(1);
        }
    }

    setCamerasDisabled() {
        this.camerasDisabled = true;
        if (this.currentStep === 2) this.completeStep(2);
    }

    setTerminalHacked() {
        this.terminalHacked = true;
        if (this.currentStep === 3) this.completeStep(3);
    }

    setCodeFound() {
        this.codeFound = true;
        if (this.currentStep === 4) this.completeStep(4);
    }

    setCodeEntered() {
        this.codeEntered = true;
        if (this.currentStep === 5) this.completeStep(5);
    }

    setMechanismComplete() {
        this.mechanismComplete = true;
        if (this.currentStep === 6) this.completeStep(6);
    }

    isVaultOpen(): boolean {
        return this.currentStep === this.totalSteps;
    }

    getProgress(): string {
        return `${Math.min(this.currentStep, this.totalSteps)}/${this.totalSteps}`;
    }

    canOpenVault(): boolean {
        return this.isVaultOpen();
    }
}
