
import React from 'react';
import { Sticker } from '../types';

interface GalleryProps {
  stickers: Sticker[];
}

const Gallery: React.FC<GalleryProps> = ({ stickers }) => {
  if (stickers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="text-6xl grayscale opacity-30">🖼️</div>
        <h3 className="text-2xl font-bold text-gray-400">Your gallery is empty</h3>
        <p className="text-gray-500">Create your first sticker pack to see it here!</p>
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
    <div className="space-y-8 pb-32 px-4">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Your Collection</h2>
          <p className="text-gray-500 font-medium">{stickers.length} stickers ready for chat</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stickers.map((sticker) => (
          <div 
            key={sticker.id} 
            className="group relative glass rounded-[40px] p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/50"
          >
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white mb-3 flex items-center justify-center">
              <img 
                src={sticker.stickerImage} 
                alt={sticker.prompt} 
                className="w-full h-full object-contain p-4 sticker-shadow transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="px-2">
              <p className="text-xs font-black text-gray-700 truncate">
                {sticker.prompt || "Cartoon Sticker"}
              </p>
              <p className="text-[10px] font-bold text-gray-400">
                {new Date(sticker.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => handleShare(sticker)}
                className="w-10 h-10 rounded-2xl bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition-all active:scale-90"
                title="Share to WhatsApp"
              >
                💬
              </button>
              <button 
                onClick={() => handleDownload(sticker)}
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all active:scale-90"
                title="Download Sticker"
              >
                📥
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
