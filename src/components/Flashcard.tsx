import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WordItem } from '../types';
import { GRADE_AGAIN, GRADE_HARD, GRADE_EASY } from '../utils/sm2';
import { Volume2, RotateCw } from 'lucide-react';

interface FlashcardProps {
    word: WordItem;
    onResult: (grade: number) => void;
}

export default function Flashcard({ word, onResult }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    // Reset flip state when word changes
    useEffect(() => {
        setIsFlipped(false);
    }, [word]);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const speak = (e: React.MouseEvent) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(word.word);
        speechSynthesis.speak(utterance);
    };

    const variants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 }
    };

    return (
        <div className="w-full max-w-md mx-auto aspect-[3/4] relative perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d cursor-pointer shadow-xl rounded-2xl bg-white text-gray-800"
                variants={variants}
                initial="front"
                animate={isFlipped ? "back" : "front"}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                onClick={handleFlip}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100">
                    <div className="absolute top-4 right-4 text-gray-400">
                        <RotateCw size={20} />
                    </div>
                    <h2 className="text-5xl font-bold mb-4 text-center break-words w-full text-gray-900">{word.word}</h2>
                    {word.pronunciation && (
                        <p className="text-xl text-gray-500 font-serif mb-6">{word.pronunciation}</p>
                    )}
                    <button
                        onClick={speak}
                        className="p-3 rounded-full hover:bg-gray-100 transition-colors text-primary"
                        title="Pronounce"
                    >
                        <Volume2 size={28} />
                    </button>

                    <p className="absolute bottom-8 text-sm text-gray-400">Tap to see meaning</p>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 backface-hidden flex flex-col p-8 bg-white rounded-2xl border border-gray-100 overflow-y-auto"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="flex-1 overflow-y-auto no-scrollbar pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-baseline justify-between mb-4 border-b pb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{word.word}</h3>
                            <button onClick={speak} className="text-primary"><Volume2 size={20} /></button>
                        </div>

                        <div className="space-y-4 text-left">
                            {word.meanings.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Meanings</h4>
                                    <ul className="list-none space-y-1">
                                        {word.meanings.map((m, i) => (
                                            <li key={i} className="text-lg leading-snug">{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {word.examples.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Examples</h4>
                                    <ul className="list-none space-y-2">
                                        {word.examples.map((ex, i) => (
                                            <li key={i} className="text-gray-600 text-sm italic border-l-2 border-gray-200 pl-3">{ex}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {word.deformations.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">More</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {word.deformations.map((d, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 mt-4 border-t grid grid-cols-3 gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onResult(GRADE_AGAIN)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                            <span className="font-bold text-sm">Again</span>
                            <span className="text-xs opacity-70">1 min</span>
                        </button>
                        <button
                            onClick={() => onResult(GRADE_HARD)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-700 transition-colors"
                        >
                            <span className="font-bold text-sm">Hard</span>
                            <span className="text-xs opacity-70">2 days</span>
                        </button>
                        <button
                            onClick={() => onResult(GRADE_EASY)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                        >
                            <span className="font-bold text-sm">Easy</span>
                            <span className="text-xs opacity-70">4 days</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
