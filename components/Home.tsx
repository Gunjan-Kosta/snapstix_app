
import React from 'react';

interface HomeProps {
  onCreateClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onCreateClick }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="relative inline-block">
          {/* Official Mascot Logo UI */}
          <div className="flex flex-col items-center mb-6 animate-float">
            <div className="flex justify-center gap-6">
              <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl border-4 border-pink-50 flex items-center justify-center text-6xl sticker-shadow rotate-[-6deg]">🧒</div>
              <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl border-4 border-blue-50 flex items-center justify-center text-6xl sticker-shadow rotate-[6deg]">👧</div>
            </div>
            <div className="w-56 h-10 border-b-8 border-[#63422e] rounded-[100%] opacity-60 mt-[-20px]" />
          </div>
          
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-20 blur-[100px] -z-10" />
          
          <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-[#63422e] leading-none">
            SNAPSTIX
          </h1>
          <div className="flex justify-center mt-2">
            <div className="h-2 w-48 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full opacity-80" />
          </div>
        </div>

        <p className="text-xl text-gray-500 max-w-lg mx-auto font-medium leading-relaxed">
          The sticker app for characters with <span className="text-gray-900 font-bold italic">personality</span>. 
          Turn any photo into a premium cartoon sticker pack.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onCreateClick}
            className="group relative px-12 py-6 bg-gray-900 text-white rounded-[32px] font-black text-xl hover:bg-pink-600 transition-all shadow-2xl shadow-pink-200 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              START CREATING <span className="text-2xl transition-transform group-hover:rotate-12">✨</span>
            </span>
          </button>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No account required • Instant generation</p>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🎨', title: 'Iconic Style', desc: 'Hand-crafted cartoon logic that keeps your features recognizable.', color: 'from-blue-500' },
          { icon: '💎', title: 'Pro Quality', desc: 'High-res vectors with the classic white die-cut border.', color: 'from-purple-500' },
          { icon: '⚡', title: 'Batch Power', desc: 'Generate 5 unique expressions (Happy, Cool, etc.) at once.', color: 'from-pink-500' }
        ].map((f, i) => (
          <div key={i} className="glass p-10 rounded-[48px] border border-white shadow-xl space-y-5 transition-transform hover:-translate-y-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} to-white flex items-center justify-center text-3xl shadow-lg text-white`}>
              {f.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Visual Demo Sticker Pile */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute flex gap-8 animate-float" style={{ animationDuration: '6s' }}>
          {['😊', '😎', '😲', '😍', '😉'].map((emoji, i) => (
            <div 
              key={i} 
              className="w-32 h-32 bg-white rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center text-5xl sticker-shadow"
              style={{ transform: `rotate(${i % 2 === 0 ? '-' : ''}${Math.random() * 15}deg)` }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
