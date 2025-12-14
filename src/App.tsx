import { useState } from 'react';
import { CloudRain, Youtube, Trophy } from 'lucide-react';
import { MarketCard } from './components/MarketCard';
import { WeatherDetail } from './components/WeatherDetail';
import { VideoDetail } from './components/VideoDetail';
import { AccuracyView } from './components/AccuracyView';
import './index.css';

type View = 'dashboard' | 'weather' | 'video' | 'accuracy';

function App() {
  const [view, setView] = useState<View>('dashboard');

  const renderContent = () => {
    switch (view) {
      case 'weather':
        return <WeatherDetail onBack={() => setView('dashboard')} />;
      case 'video':
        return <VideoDetail onBack={() => setView('dashboard')} />;
      case 'accuracy':
        return <AccuracyView onBack={() => setView('dashboard')} />;
      default:
        return (
          <div className="dashboard-grid">
            <MarketCard
              title="NYC Weather Forecast"
              icon={<CloudRain size={24} />}
              value="Nov 21 - 23"
              trend="Updated 3h ago"
              color="#3b82f6"
              onClick={() => setView('weather')}
            />
            <MarketCard
              title="MrBeast Video Stats"
              icon={<Youtube size={24} />}
              value="Tracking 1 Video"
              trend="+1.2M Views"
              color="#ef4444"
              onClick={() => setView('video')}
            />
            <MarketCard
              title="Model Accuracy"
              icon={<Trophy size={24} />}
              value="Compare Models"
              trend="NWS vs ECMWF"
              color="#f59e0b"
              onClick={() => setView('accuracy')}
            />
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h1>PolyTracker</h1>
        </div>
        <div className="user-profile">
          <div className="avatar">U</div>
        </div>
      </header>

      <main className="main-content">
        {view === 'dashboard' && (
          <div className="section-header">
            <h2>Active Markets</h2>
            <p>Real-time tracking and analytics</p>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
