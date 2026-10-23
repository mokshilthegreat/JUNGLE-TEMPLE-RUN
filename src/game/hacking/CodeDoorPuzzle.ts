export type DigitFeedback = 'green' | 'yellow' | 'red';

export class CodeDoorPuzzle {
    private code: string = '';
    private attemptsRemaining: number = 3;
    private maxAttempts: number = 3;
    private difficulty: number;

    constructor(difficulty: number = 1) {
        this.difficulty = difficulty;
        this.generateCode();
    }

    generateCode() {
        const length = this.difficulty > 2 ? 6 : 4;
        let newCode = '';
        for (let i = 0; i < length; i++) {
            newCode += Math.floor(Math.random() * 10).toString();
        }
        this.code = newCode;
        this.attemptsRemaining = this.maxAttempts;
    }

    checkCode(input: string): DigitFeedback[] {
        const feedback: DigitFeedback[] = [];
        this.attemptsRemaining--;

        const answerChars = this.code.split('');
        const inputChars = input.split('');
        
        // First pass: check for green (correct position and value)
        const usedInAnswer = new Array(answerChars.length).fill(false);
        const usedInInput = new Array(inputChars.length).fill(false);

        for (let i = 0; i < inputChars.length; i++) {
            if (i < answerChars.length && inputChars[i] === answerChars[i]) {
                feedback[i] = 'green';
                usedInAnswer[i] = true;
                usedInInput[i] = true;
            } else {
                feedback[i] = 'red'; // default to red
            }
        }

        // Second pass: check for yellow (correct value, wrong position)
        for (let i = 0; i < inputChars.length; i++) {
            if (!usedInInput[i]) {
                for (let j = 0; j < answerChars.length; j++) {
                    if (!usedInAnswer[j] && inputChars[i] === answerChars[j]) {
                        feedback[i] = 'yellow';
                        usedInAnswer[j] = true;
                        break;
                    }
                }
            }
        }

        return feedback;
    }

    getRemainingAttempts(): number {
        return this.attemptsRemaining;
    }

    isLockedOut(): boolean {
        return this.attemptsRemaining <= 0;
    }

    getCodeLength(): number {
        return this.code.length;
    }
}
