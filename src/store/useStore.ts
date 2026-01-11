import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WordItem, UserProgress, UserSettings } from '../types';
import { calculateSM2 } from '../utils/sm2';
import { idbStorage } from './storage';
import text from '../../vocabulary.txt?raw';
import { parseVocabulary } from '../utils/parser';

interface VocabState {
    words: WordItem[];
    progress: Record<number, UserProgress>;
    settings: UserSettings;
    initialized: boolean;

    initialize: () => void;
    reviewWord: (wordId: number, grade: number) => void;
    getDueWords: () => WordItem[];
    updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useStore = create<VocabState>()(
    persist(
        (set, get) => ({
            words: [],
            progress: {},
            settings: {
                dailyNewLimit: 20
            },
            initialized: false,

            initialize: () => {
                const state = get();
                if (state.words.length > 0) return; // Already initialized

                const parsedWords = parseVocabulary(text);
                set({ words: parsedWords, initialized: true });
            },

            reviewWord: (wordId: number, grade: number) => {
                const progress = get().progress;
                const current = progress[wordId] || {
                    wordId,
                    interval: 0,
                    repetition: 0,
                    ef: 2.5,
                    nextReviewDate: 0,
                    status: 'new'
                };

                const result = calculateSM2({
                    interval: current.interval,
                    repetition: current.repetition,
                    ef: current.ef,
                    grade
                });

                // Calculate next date
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;
                const nextDate = now + result.interval * oneDay;

                const newProgress: UserProgress = {
                    ...current,
                    interval: result.interval,
                    repetition: result.repetition,
                    ef: result.ef,
                    nextReviewDate: nextDate,
                    status: result.repetition > 0 ? 'review' : 'learning'
                };

                set(state => ({
                    progress: {
                        ...state.progress,
                        [wordId]: newProgress
                    }
                }));
            },

            updateSettings: (newSettings) => {
                set(state => ({
                    settings: { ...state.settings, ...newSettings }
                }));
            },

            getDueWords: () => {
                const state = get();
                const now = Date.now();

                // 1. Find Review words (status !== 'new' && nextReviewDate <= now)
                const reviews = state.words.filter(w => {
                    const p = state.progress[w.id];
                    if (!p) return false;
                    // Allow reviewing if due
                    return p.status !== 'new' && p.nextReviewDate <= now;
                });

                // 2. Find New words (limit by daily limit)
                const newWords = state.words.filter(w => !state.progress[w.id] || state.progress[w.id].status === 'new');

                // Shuffle new words to avoid alphabetical order
                for (let i = newWords.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
                }

                return [...reviews, ...newWords.slice(0, state.settings.dailyNewLimit)];
            }
        }),
        {
            name: 'vocab-storage',
            storage: createJSONStorage(() => idbStorage),
            partialize: (state) => ({
                progress: state.progress,
                settings: state.settings,
                words: state.words,
                initialized: state.initialized
            })
        }
    )
);
