import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import Flashcard from './Flashcard';
import type { WordItem } from '../types';
import { GRADE_AGAIN } from '../utils/sm2';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { ArrowLeft } from 'lucide-react';

interface ReviewSessionProps {
    onExit: () => void;
}

export default function ReviewSession({ onExit }: ReviewSessionProps) {
    const { initialized, initialize, getDueWords, reviewWord } = useStore();
    const [queue, setQueue] = useState<WordItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!initialized) {
            initialize();
        } else {
            const due = getDueWords();
            // Determine a queue (simple array for now)
            // If word is Failed (Again), re-insert into queue at end?
            setQueue(due);
            setLoading(false);
        }
    }, [initialized, initialize]); // Only run on mount/init

    const handleResult = (grade: number) => {
        const currentWord = queue[currentIndex];

        // Update store
        reviewWord(currentWord.id, grade);

        // If "Again", re-queue this word for this session?
        if (grade === GRADE_AGAIN) {
            setQueue(prev => [...prev, currentWord]);
        }

        // Move next
        setCurrentIndex(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (currentIndex >= queue.length) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <CheckCircle2 size={80} className="text-green-500 mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">All caught up!</h2>
                <p className="text-gray-500 mb-8">You've finished your reviews for today.</p>
                <button
                    onClick={onExit}
                    className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const currentWord = queue[currentIndex];
    // Calculate progress
    const progress = Math.min(100, (currentIndex / queue.length) * 100);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Progress */}
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-50 z-10">
                <button onClick={onExit} className="p-1 -ml-1 text-gray-400 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-sm font-medium text-gray-500 mx-4">
                    {queue.length - currentIndex} left
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentWord.id + '-' + currentIndex} // Key change triggers animation
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full"
                    >
                        <Flashcard word={currentWord} onResult={handleResult} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
