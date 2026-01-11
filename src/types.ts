export interface WordItem {
    id: number;
    word: string;
    pronunciation?: string;
    meanings: string[];
    examples: string[];
    deformations: string[];
}

export interface UserProgress {
    wordId: number;
    interval: number; // Days until next review
    repetition: number; // Consecutive successful reviews
    ef: number; // Easiness Factor (default 2.5)
    nextReviewDate: number; // Timestamp
    status: 'new' | 'learning' | 'review';
}

export interface UserSettings {
    dailyNewLimit: number;
}
