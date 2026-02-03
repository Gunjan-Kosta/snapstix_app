
import React from 'react';
import { Sticker } from '../types';

interface DownloadsProps {
  stickers: Sticker[];
}

const Downloads: React.FC<DownloadsProps> = ({ stickers }) => {
  if (stickers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
        <div className="text-5xl md:text-6xl grayscale opacity-30 animate-float">📥</div>
        <h3 className="text-xl md:text-2xl font-black text-gray-400">Your downloads are empty</h3>
        <p className="text-sm md:text-base text-gray-500 font-medium">Go to Create to generate your first sticker pack!</p>
      </div>
    );
  }

  const handleDownload = (sticker: Sticker) => {
    const link = document.createElement('a');
    link.href = sticker.stickerImage;
    link.download = `snapstix-${sticker.id}.webp`;
    link.click();
  };

  const handleShare = async (sticker: Sticker) => {
    try {
      const response = await fetch(sticker.stickerImage);
      const blob = await response.blob();
      const file = new File([blob], `snapstix-${sticker.id}.webp`, { type: 'image/webp' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'SnapStix Sticker',
          text: `Check out my sticker: ${sticker.prompt}`,
        });
      } else {
        alert("Sharing not supported on this browser. Try downloading!");
      }
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-32 px-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Downloads</h2>
          <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">{stickers.length} custom stickers ready to use</p>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {stickers.map((sticker) => (
          <div 
            key={sticker.id} 
            className="group relative glass rounded-[24px] md:rounded-[40px] p-3 md:p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/50"
          >
            <div className="relative aspect-square rounded-[20px] md:rounded-[32px] overflow-hidden bg-white mb-2 md:mb-3 flex items-center justify-center">
              <img 
                src={sticker.stickerImage} 
                alt={sticker.prompt} 
                className="w-full h-full object-contain p-3 md:p-4 sticker-shadow transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="px-1 md:px-2">
              <p className="text-[10px] md:text-xs font-black text-gray-700 truncate">
                {sticker.prompt || "Cartoon Sticker"}
              </p>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400">
                {new Date(sticker.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => handleShare(sticker)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition-all active:scale-90"
                title="Share to WhatsApp"
              >
                <span className="text-sm md:text-base">💬</span>
              </button>
              <button 
                onClick={() => handleDownload(sticker)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all active:scale-90"
                title="Download WebP"
              >
                <span className="text-sm md:text-base">📥</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;
