
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
    { id: View.GALLERY, label: 'Gallery', icon: '🖼️' },
    { id: View.PROFILE, label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="glass rounded-full px-4 py-3 flex items-center justify-between shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              currentView === tab.id 
                ? 'text-pink-600 scale-110' 
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {tab.label}
            </span>
            {currentView === tab.id && (
              <div className="w-1 h-1 rounded-full bg-pink-600" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
