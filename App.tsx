import React, { useState, useEffect } from 'react';
import ProfileCard from './components/ProfileCard';
import BackgroundEffects from './components/BackgroundEffects';
import CustomCursor from './components/CustomCursor';
import VerificationScreen from './components/VerificationScreen';
import { HUDView } from './types';

const App: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<HUDView>(null);

  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  const handleToggleView = (view: HUDView) => {
    setActiveView(prev => prev === view ? null : view);
  };

  return (
    <div className="relative w-full h-screen bg-[#020202] selection:bg-red-500/30 overflow-hidden select-none flex items-center justify-center">
      <CustomCursor />
      <BackgroundEffects />
      
      {!isVerified && (
        <VerificationScreen onVerified={() => setIsVerified(true)} />
      )}

      {isVerified && (
        <div className={`
          relative z-50 transition-all duration-1000 transform 
          ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-xl'}
        `}>
          <ProfileCard activeView={activeView} onToggleView={handleToggleView} />
        </div>
      )}

      <div className="fixed bottom-6 left-6 mono text-[9px] text-white/10 uppercase tracking-[0.6em] pointer-events-none z-[100] hidden md:block">
        KYROS_OS // VER: 4.2.0 // STATUS: {isVerified ? 'ENCRYPTED_LINK' : 'LOCKED'}
      </div>
    </div>
  );
};

export default App;