
import React from 'react';

interface HomeProps {
  onCreateClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onCreateClick }) => {
  return (
    <div className="space-y-12 md:space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 md:space-y-8">
        <div className="relative inline-block">
          {/* Official Mascot Logo UI */}
          <div className="flex flex-col items-center mb-6 animate-float">
            <div className="flex justify-center gap-4 md:gap-6">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl md:rounded-3xl shadow-2xl border-4 border-pink-50 flex items-center justify-center text-4xl md:text-6xl sticker-shadow rotate-[-6deg]">🧒</div>
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl md:rounded-3xl shadow-2xl border-4 border-blue-50 flex items-center justify-center text-4xl md:text-6xl sticker-shadow rotate-[6deg]">👧</div>
            </div>
            <div className="w-40 md:w-56 h-8 md:h-10 border-b-8 border-[#63422e] rounded-[100%] opacity-60 mt-[-15px] md:mt-[-20px]" />
          </div>
          
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-20 blur-[100px] -z-10" />
          
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-[#63422e] leading-none">
            SNAPSTIX
          </h1>
          <div className="flex justify-center mt-3">
            <div className="h-2 w-32 md:w-48 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full opacity-80" />
          </div>
        </div>

        <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto font-medium leading-relaxed px-4">
          The sticker app for characters with <span className="text-gray-900 font-bold italic">personality</span>. 
          Turn any photo into a premium cartoon sticker pack.
        </p>

        <div className="flex flex-col items-center gap-4 px-4">
          <button 
            onClick={onCreateClick}
            className="group relative w-full md:w-auto px-10 py-5 md:px-12 md:py-6 bg-gray-900 text-white rounded-[24px] md:rounded-[32px] font-black text-lg md:text-xl hover:bg-pink-600 transition-all shadow-2xl shadow-pink-200 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              START CREATING <span className="text-xl md:text-2xl transition-transform group-hover:rotate-12">✨</span>
            </span>
          </button>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No account required • Instant generation</p>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
        {[
          { icon: '🎨', title: 'Iconic Style', desc: 'Hand-crafted cartoon logic that keeps your features recognizable.', color: 'from-blue-500' },
          { icon: '💎', title: 'Pro Quality', desc: 'High-res vectors with the classic white die-cut border.', color: 'from-purple-500' },
          { icon: '⚡', title: 'Batch Power', desc: 'Generate 5 unique expressions (Happy, Cool, etc.) at once.', color: 'from-pink-500' }
        ].map((f, i) => (
          <div key={i} className="glass p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-white shadow-xl space-y-4 transition-transform hover:-translate-y-2">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${f.color} to-white flex items-center justify-center text-2xl md:text-3xl shadow-lg text-white`}>
              {f.icon}
            </div>
            <div className="space-y-1 md:space-y-2">
              <h3 className="text-lg md:text-xl font-black text-gray-800 tracking-tight">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Visual Demo Sticker Pile */}
      <div className="relative h-48 md:h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute flex gap-4 md:gap-8 animate-float" style={{ animationDuration: '6s' }}>
          {['😊', '😎', '😲', '😍', '😉'].map((emoji, i) => (
            <div 
              key={i} 
              className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl md:rounded-3xl border-4 md:border-8 border-white shadow-2xl flex items-center justify-center text-4xl md:text-5xl sticker-shadow"
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
