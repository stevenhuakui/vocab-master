

interface SM2Input {
    interval: number;
    repetition: number;
    ef: number;
    grade: number; // 0-5
}

interface SM2Output {
    interval: number;
    repetition: number;
    ef: number;
}

export const calculateSM2 = ({ interval, repetition, ef, grade }: SM2Input): SM2Output => {
    let newInterval: number;
    let newRepetition: number;
    let newEf: number;

    if (grade >= 3) {
        if (repetition === 0) {
            newInterval = 1;
        } else if (repetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * ef);
        }
        newRepetition = repetition + 1;
    } else {
        newRepetition = 0;
        newInterval = 1;
    }

    newEf = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (newEf < 1.3) newEf = 1.3;

    return {
        interval: newInterval,
        repetition: newRepetition,
        ef: newEf
    };
};

// Map buttons to grades
export const GRADE_AGAIN = 0; // Complete blackout
export const GRADE_HARD = 3;  // Remembered with difficulty
export const GRADE_EASY = 5;  // Easy
