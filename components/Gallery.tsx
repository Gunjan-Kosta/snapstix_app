
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
        <p className="text-gray-500">Create your first sticker to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800">Your Collection</h2>
          <p className="text-gray-500">{stickers.length} magic creations</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stickers.map((sticker) => (
          <div 
            key={sticker.id} 
            className="group relative glass rounded-3xl p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/50"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/40 mb-3 flex items-center justify-center">
              <img 
                src={sticker.stickerImage} 
                alt={sticker.prompt} 
                className="w-full h-full object-contain p-2 sticker-shadow transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <p className="text-xs font-bold text-gray-600 truncate px-1">
              {sticker.prompt || "Cartoon Sticker"}
            </p>
            <p className="text-[10px] text-gray-400 px-1">
              {new Date(sticker.createdAt).toLocaleDateString()}
            </p>
            
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = sticker.stickerImage;
                link.download = `snapstix-${sticker.id}.png`;
                link.click();
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              📥
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
