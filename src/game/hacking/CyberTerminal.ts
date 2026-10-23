export class CyberTerminal {
    private grid: string[][] = [];
    private targetSequence: string[] = [];
    private selectedSequence: string[] = [];
    private timeRemaining: number = 30;
    private traceLevel: number = 0;
    private maxTrace: number = 100;
    private traceSpeed: number = 5;
    
    private currentRow: number = 0;
    private currentCol: number = -1;
    private isRowSelection: boolean = true;
    
    private hexValues = ['1C', '55', 'BD', 'E9', '7A', 'FF'];

    constructor(difficulty: number = 1) {
        this.startHack(difficulty);
    }

    startHack(difficulty: number) {
        const size = difficulty > 2 ? 8 : 6;
        this.timeRemaining = difficulty > 2 ? 15 : 30;
        this.traceSpeed = 2 + difficulty * 3;
        this.traceLevel = 0;
        
        this.grid = [];
        for (let i = 0; i < size; i++) {
            const row: string[] = [];
            for (let j = 0; j < size; j++) {
                row.push(this.hexValues[Math.floor(Math.random() * this.hexValues.length)]);
            }
            this.grid.push(row);
        }

        const seqLength = difficulty > 2 ? 5 : 4;
        this.targetSequence = [];
        for (let i = 0; i < seqLength; i++) {
            this.targetSequence.push(this.hexValues[Math.floor(Math.random() * this.hexValues.length)]);
        }

        this.selectedSequence = [];
        this.currentRow = 0;
        this.currentCol = -1;
        this.isRowSelection = true;
    }

    selectCell(row: number, col: number): boolean {
        if (this.isComplete() || this.isFailed()) return false;
        
        if (this.grid[row][col] === '--') return false; // Already selected

        if (this.isRowSelection) {
            if (row !== this.currentRow) return false;
            this.currentCol = col;
            this.isRowSelection = false;
        } else {
            if (col !== this.currentCol) return false;
            this.currentRow = row;
            this.isRowSelection = true;
        }

        const value = this.grid[row][col];
        this.selectedSequence.push(value);
        this.grid[row][col] = '--'; // Mark as used

        // Check if selected matches target so far
        const matchLength = this.selectedSequence.length;
        if (value !== this.targetSequence[matchLength - 1]) {
            // Mistake resets progress
            this.selectedSequence = [];
            // Penalty trace
            this.traceLevel += 10;
        }

        return true;
    }

    update(dt: number) {
        if (this.isComplete() || this.isFailed()) return;
        
        this.timeRemaining -= dt;
        this.traceLevel += this.traceSpeed * dt;
        
        if (this.timeRemaining < 0) this.timeRemaining = 0;
        if (this.traceLevel > this.maxTrace) this.traceLevel = this.maxTrace;
    }

    getGrid(): string[][] { return this.grid; }
    getTargetSequence(): string[] { return this.targetSequence; }
    getSelectedSequence(): string[] { return this.selectedSequence; }
    getTimeRemaining(): number { return this.timeRemaining; }
    getTraceLevel(): number { return this.traceLevel; }
    
    isComplete(): boolean {
        return this.selectedSequence.length === this.targetSequence.length;
    }

    isFailed(): boolean {
        return this.timeRemaining <= 0 || this.traceLevel >= this.maxTrace;
    }

    getSelectionState(): { isRow: boolean, index: number } {
        return {
            isRow: this.isRowSelection,
            index: this.isRowSelection ? this.currentRow : this.currentCol
        };
    }
}
