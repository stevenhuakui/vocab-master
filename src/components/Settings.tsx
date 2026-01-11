import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface SettingsProps {
    onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
    const { settings, updateSettings } = useStore();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
            >
                <div className="flex items-center mb-8">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold ml-2">Settings</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Daily New Words Limit
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={settings.dailyNewLimit}
                                onChange={(e) => updateSettings({ dailyNewLimit: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <span className="text-xl font-bold w-12 text-center">{settings.dailyNewLimit}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Recommended: 20 words. Increasing this may lead to review pile-ups.
                        </p>
                    </div>

                    <div className="pt-6 border-t">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">About</h3>
                        <p className="text-sm text-gray-500">
                            VocabMaster uses the SM-2 algorithm to optimize your learning schedule.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
