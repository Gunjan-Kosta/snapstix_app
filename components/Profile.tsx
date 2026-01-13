
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="space-y-10 pb-32">
      <header className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-pink-100 p-1">
             <img src="https://picsum.photos/seed/user/200/200" alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg text-sm">✏️</button>
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-800">Sticker Master</h2>
          <p className="text-gray-500 font-medium">@snap_creative</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-3xl text-center space-y-1">
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Creations</p>
        </div>
        <div className="glass p-6 rounded-3xl text-center space-y-1">
          <p className="text-3xl font-bold text-pink-600">Pro</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</p>
        </div>
      </div>

      <div className="glass rounded-[40px] p-8 space-y-6 shadow-xl border border-white">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Settings</h3>
        <ul className="space-y-4">
          {[
            { label: 'High Quality Export', icon: '💎', toggle: true },
            { label: 'Cloud Sync', icon: '☁️', toggle: true },
            { label: 'Auto-Remove BG', icon: '✨', toggle: false },
            { label: 'Subscription Plan', icon: '💳', val: 'Gold Member' },
            { label: 'App Version', icon: '🆔', val: 'v1.0.0' },
            { label: 'Developer', icon: '👨‍💻', val: 'GUNJAN KOSTA' },
            { label: 'Help & Support', icon: '🎧' },
          ].map((item, i) => (
            <li key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 p-2 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              {item.toggle !== undefined ? (
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.toggle ? 'bg-pink-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.toggle ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-400">{item.val || '→'}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center space-y-2">
        <button className="w-full py-5 rounded-2xl bg-white border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-all">
          Logout
        </button>
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          Designed & Developed with ❤️ by GUNJAN KOSTA
        </p>
      </div>
    </div>
  );
};

export default Profile;
