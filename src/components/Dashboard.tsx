import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Play, BookOpen, CheckCircle, Brain } from 'lucide-react';

interface DashboardProps {
    onStartReview: () => void;
    onOpenSettings: () => void;
}

export default function Dashboard({ onStartReview, onOpenSettings }: DashboardProps) {
    const { words, progress, initialized, initialize, getDueWords } = useStore();

    if (!initialized) {
        // Trigger initialization if not ready (though App usually handles this)
        initialize();
    }

    // Calculate stats
    const totalWords = words.length;
    const learnedCount = Object.values(progress).filter(p => p.status !== 'new').length;

    // Calculate due count specifically for display
    // We can use getDueWords, but that mixes new and reviews.
    // Let's break it down or just show "Due Today"
    const dueWords = getDueWords();
    const dueCount = dueWords.length;

    // Simple "Mastered" proxy: interval > 30 days?
    const masteredCount = Object.values(progress).filter(p => p.interval > 30).length;

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto w-full flex-1 flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">VocabMaster</h1>
                        <p className="text-gray-500">Your daily growth</p>
                    </div>
                    <button
                        onClick={onOpenSettings}
                        className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:text-primary transition-colors"
                    >
                        <SettingsIcon size={24} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <BookOpen size={20} />
                            <span className="text-xs font-bold uppercase tracking-wide">Total</span>
                        </div>
                        <p className="text-2xl font-bold">{totalWords}</p>
                        <p className="text-xs text-gray-400">Words in library</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <CheckCircle size={20} />
                            <span className="text-xs font-bold uppercase tracking-wide">Learned</span>
                        </div>
                        <p className="text-2xl font-bold">{learnedCount}</p>
                        <p className="text-xs text-gray-400">{((learnedCount / totalWords) * 100).toFixed(1)}% complete</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-purple-600 mb-2">
                            <Brain size={20} />
                            <span className="text-xs font-bold uppercase tracking-wide">Mastered</span>
                        </div>
                        <p className="text-2xl font-bold">{masteredCount}</p>
                        <p className="text-xs text-gray-400">&gt; 30 days interval</p>
                    </div>
                </div>

                {/* Main Action */}
                <div className="mt-auto mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <h2 className="text-2xl font-bold mb-2">Ready to Review?</h2>
                        <p className="text-gray-500 mb-6">
                            You have <strong className="text-primary">{dueCount}</strong> words scheduled for today.
                        </p>

                        <button
                            onClick={onStartReview}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                        >
                            <Play fill="currentColor" size={20} />
                            Start Session
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
