
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: View.HOME, label: 'Home', icon: '🏠' },
    { id: View.CREATE, label: 'Create', icon: '✨' },
    { id: View.DOWNLOADS, label: 'Downloads', icon: '📥' },
    { id: View.PROFILE, label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="glass rounded-full px-5 py-3.5 flex items-center justify-between shadow-2xl border-white/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              currentView === tab.id 
                ? 'text-pink-600 scale-105' 
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className={`text-[11px] font-black uppercase tracking-wider ${currentView === tab.id ? 'opacity-100' : 'opacity-60'}`}>
              {tab.label}
            </span>
            {currentView === tab.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-pink-600" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
