import { useState, useEffect } from 'react';
import ReviewSession from './components/ReviewSession';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { useStore } from './store/useStore';

type View = 'dashboard' | 'review' | 'settings';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const { initialize, initialized } = useStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
      {view === 'dashboard' && (
        <Dashboard
          onStartReview={() => setView('review')}
          onOpenSettings={() => setView('settings')}
        />
      )}

      {view === 'settings' && (
        <Settings
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'review' && (
        <ReviewSession onExit={() => setView('dashboard')} />
      )}
    </div>
  );
}

export default App;
