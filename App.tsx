
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import StickerMaker from './components/StickerMaker';
import Gallery from './components/Gallery';
import Profile from './components/Profile';
import { View, Sticker } from './types';

const STORAGE_KEY = 'snapstix_v1_collection';
// We can keep more in memory, but disk space is precious
const MAX_PERSISTED_COUNT = 10; 

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load from local storage on mount safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStickers(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("SnapStix: Storage recovery failed - starting fresh", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Optimized Persistence Effect
  useEffect(() => {
    if (!isInitialized) return;
    
    // 1. Prepare data by stripping the heavy 'originalImage'
    // This reduces storage usage by ~50% or more per sticker
    const stickersToPersist = stickers.slice(0, MAX_PERSISTED_COUNT).map(s => ({
      ...s,
      originalImage: undefined // Remove the heavy source photo
    }));

    // 2. Iterative save strategy to handle QuotaExceededError
    let currentCount = stickersToPersist.length;
    let saved = false;

    while (currentCount >= 0 && !saved) {
      try {
        const data = JSON.stringify(stickersToPersist.slice(0, currentCount));
        localStorage.setItem(STORAGE_KEY, data);
        saved = true;
      } catch (e) {
        if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.warn(`SnapStix: Quota hit at ${currentCount} items, pruning oldest...`);
          currentCount--; // Drop the oldest one and try again
          if (currentCount < 0) break;
        } else {
          console.error("SnapStix: Unexpected storage error", e);
          break;
        }
      }
    }
  }, [stickers, isInitialized]);

  const handleStickerCreated = (sticker: Sticker) => {
    setStickers((prev) => [sticker, ...prev]);
  };

  // Splash Screen UI
  if (showSplash) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-mesh animate-in fade-in duration-500">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-2 animate-float">
              <span className="text-8xl sm:text-9xl filter sticker-shadow">🧒</span>
              <span className="text-8xl sm:text-9xl filter sticker-shadow">👧</span>
            </div>
            <div className="w-48 h-12 border-b-[6px] border-[#63422e] rounded-[100%] opacity-80" />
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-[#63422e] mt-4 animate-pulse">
            SNAPSTIX
          </h1>
          
          <div className="flex gap-1.5 mt-8">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return null;
  }

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home onCreateClick={() => setCurrentView(View.CREATE)} />;
      case View.CREATE:
        return <StickerMaker onStickerCreated={handleStickerCreated} />;
      case View.GALLERY:
        return <Gallery stickers={stickers} />;
      case View.PROFILE:
        return <Profile />;
      default:
        return <Home onCreateClick={() => setCurrentView(View.CREATE)} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-32 animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-10">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setCurrentView(View.HOME)}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-pink-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-12 h-12 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
               <div className="flex flex-col items-center justify-center -space-y-1 mt-1">
                 <div className="flex gap-0.5">
                   <span className="text-base">🧒</span>
                   <span className="text-base">👧</span>
                 </div>
                 <div className="w-7 h-3 border-b-2 border-[#63422e] rounded-[100%] opacity-80"></div>
               </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">SNAPSTIX</span>
            <span className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.2em] mt-0.5">AI Studio</span>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentView(View.CREATE)}
          className="bg-white/80 backdrop-blur px-5 py-2 rounded-2xl font-bold text-gray-800 border border-gray-100 hover:border-pink-200 hover:text-pink-600 transition-all shadow-sm active:scale-95"
        >
          Create ✨
        </button>
      </header>

      <main className="min-h-[70vh]">
        {renderView()}
      </main>

      <Navigation currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;
