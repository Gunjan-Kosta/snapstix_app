
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="space-y-8 md:space-y-10 pb-32 px-4">
      <header className="text-center space-y-3 md:space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-pink-100 p-1">
             <img src="https://picsum.photos/seed/user/200/200" alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg text-sm border border-gray-100 hover:bg-gray-50 transition-colors">✏️</button>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800">Sticker Master</h2>
          <p className="text-sm md:text-base text-gray-400 font-bold uppercase tracking-widest">@snap_creative</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 md:p-6 rounded-[24px] md:rounded-3xl text-center space-y-1">
          <p className="text-2xl md:text-3xl font-black text-blue-600">12</p>
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Creations</p>
        </div>
        <div className="glass p-5 md:p-6 rounded-[24px] md:rounded-3xl text-center space-y-1">
          <p className="text-2xl md:text-3xl font-black text-pink-600">Pro</p>
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Status</p>
        </div>
      </div>

      <div className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-6 shadow-xl border border-white">
        <h3 className="text-lg md:text-xl font-black text-gray-800 border-b border-gray-100 pb-4">Settings</h3>
        <ul className="space-y-3 md:space-y-4">
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
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-xl md:text-2xl">{item.icon}</span>
                <span className="font-bold text-gray-700 text-sm md:text-base">{item.label}</span>
              </div>
              {item.toggle !== undefined ? (
                <div className={`w-10 h-5 md:w-12 md:h-6 rounded-full p-1 transition-colors ${item.toggle ? 'bg-pink-500' : 'bg-gray-200'}`}>
                  <div className={`w-3 h-3 md:w-4 md:h-4 bg-white rounded-full transition-transform ${item.toggle ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`} />
                </div>
              ) : (
                <span className="text-[11px] md:text-sm font-black text-gray-400 uppercase">{item.val || '→'}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center space-y-3">
        <button className="w-full py-4 md:py-5 rounded-[20px] md:rounded-2xl bg-white border border-red-100 text-red-500 font-black text-sm md:text-base hover:bg-red-50 transition-all active:scale-95">
          Logout
        </button>
        <div className="space-y-1">
           <p className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            Designed & Developed with ❤️ by
          </p>
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
            GUNJAN KOSTA
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
