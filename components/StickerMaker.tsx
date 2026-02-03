
import React, { useState, useRef } from 'react';
import { generateSticker } from '../services/geminiService';
import { Sticker } from '../types';

interface StickerMakerProps {
  onStickerCreated: (sticker: Sticker) => void;
}

const EXPRESSIONS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Shocked', emoji: '😲' },
  { label: 'Cool', emoji: '😎' },
  { label: 'Heart-eyes', emoji: '😍' },
  { label: 'Winking', emoji: '😉' }
];

const StickerMaker: React.FC<StickerMakerProps> = ({ onStickerCreated }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<number, { url: string; exp: string; failed?: boolean; retrying?: boolean; status?: string }>>({});
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResults({});
        setProgress(0);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageForWhatsApp = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const ratio = Math.min(512 / img.width, 512 / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (512 - w) / 2;
        const y = (512 - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        resolve(canvas.toDataURL('image/webp', 0.9));
      };
      img.src = dataUrl;
    });
  };

  const brewSticker = async (index: number, exp: { label: string; emoji: string }, isIndividualRetry = false): Promise<boolean> => {
    if (!selectedImage) return false;
    
    setResults(prev => ({ 
      ...prev, 
      [index]: { ...prev[index], retrying: true, failed: false, status: 'Brewing...' } 
    }));

    try {
      const rawUrl = await generateSticker(selectedImage, prompt, exp.label);
      const optimizedUrl = await processImageForWhatsApp(rawUrl);
      const newSticker: Sticker = {
        id: `stix-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
        stickerImage: optimizedUrl,
        prompt: `${prompt || 'Cartoon'} (${exp.label})`,
        createdAt: Date.now(),
      };
      setResults(prev => ({ 
        ...prev, 
        [index]: { url: optimizedUrl, exp: exp.label, failed: false, retrying: false, status: undefined } 
      }));
      onStickerCreated(newSticker);
      return true;
    } catch (err: any) {
      const isRateLimit = err.message === "RATE_LIMIT";
      setResults(prev => ({ 
        ...prev, 
        [index]: { 
          ...prev[index], 
          url: '', 
          exp: exp.label, 
          failed: !isRateLimit, 
          retrying: false,
          status: isRateLimit ? 'Limit hit...' : 'Failed'
        } 
      }));
      if (isRateLimit) throw err; 
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setIsGenerating(true);
    setResults({});
    setProgress(0);
    setError(null);

    let finishedCount = 0;
    
    for (let i = 0; i < EXPRESSIONS.length; i++) {
      const exp = EXPRESSIONS[i];
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;

      while (!success && attempts < maxAttempts) {
        try {
          success = await brewSticker(i, exp);
          if (success) {
            finishedCount++;
            setProgress((finishedCount / EXPRESSIONS.length) * 100);
          }
        } catch (err: any) {
          if (err.message === "RATE_LIMIT") {
            attempts++;
            if (attempts < maxAttempts) {
              const waitTime = 20000; // Increased cooldown to 20s
              setResults(prev => ({ 
                ...prev, 
                [i]: { ...prev[i], status: `Retrying in ${waitTime/1000}s...` } 
              }));
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
              setResults(prev => ({ 
                ...prev, 
                [i]: { ...prev[i], failed: true, retrying: false, status: 'Rate Limited' } 
              }));
              setError("The AI server is currently busy. Please try again later or wait between stickers.");
              success = true; // Move to next sticker
            }
          } else {
            success = true; // Other errors are handled in brewSticker
          }
        }
      }

      // Base sequential delay between successful generations to prevent 429
      if (i < EXPRESSIONS.length - 1 && success) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10s delay between stickers
      }
    }
    setIsGenerating(false);
  };

  const handleDownload = (url: string, exp: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapstix-${exp.toLowerCase()}.webp`;
    link.click();
  };

  const handleShare = async (url: string, exp: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], `snapstix-${exp.toLowerCase()}.webp`, { type: 'image/webp' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'SnapStix Sticker',
          text: `Check out my ${exp} sticker!`,
        });
      } else {
        alert("Native sharing is not supported on this browser. Use Download instead!");
      }
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 pb-20 px-4">
      <header className="text-center space-y-2">
        <h2 className="text-3xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 bg-clip-text text-transparent italic tracking-tighter">
          THE MAGIC PACK
        </h2>
        <p className="text-gray-500 font-black uppercase tracking-widest text-[9px] md:text-xs">One Snap • 5 Chat-Ready Stickers</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input/Upload Area */}
        <div className="space-y-6">
          <div 
            onClick={() => !isGenerating && fileInputRef.current?.click()}
            className={`relative aspect-square rounded-[40px] border-4 border-dashed transition-all overflow-hidden group ${
              selectedImage ? 'border-pink-200' : 'border-gray-200 hover:border-pink-300 bg-gray-50'
            } ${isGenerating ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                {!isGenerating && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold bg-pink-600 px-6 py-3 rounded-2xl shadow-xl">CHANGE PHOTO</span>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="text-7xl">📸</div>
                <div>
                  <p className="text-xl font-black text-gray-800">Tap to Upload</p>
                  <p className="text-gray-400 font-medium">Clear selfies work best!</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Style: e.g. Cyberpunk, Disney, Retro..."
                disabled={isGenerating}
                className="w-full px-6 py-5 rounded-[24px] bg-white border border-gray-100 shadow-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-300 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🪄</div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedImage || isGenerating}
              className={`w-full py-5 rounded-[24px] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                !selectedImage || isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gray-900 text-white hover:bg-pink-600 shadow-pink-100'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  BREWING... {Math.round(progress)}%
                </>
              ) : (
                <>GENERATE PACK ✨</>
              )}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {EXPRESSIONS.map((exp, i) => {
              const res = results[i];
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-[32px] glass border border-white relative flex items-center justify-center p-4 transition-all ${
                    res?.failed ? 'bg-red-50 border-red-100' : ''
                  }`}
                >
                  {res?.url ? (
                    <div className="relative group w-full h-full">
                      <img 
                        src={res.url} 
                        alt={exp.label} 
                        className="w-full h-full object-contain sticker-shadow animate-in zoom-in duration-500" 
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all bg-white/60 backdrop-blur-sm rounded-[24px]">
                        <button 
                          onClick={() => handleShare(res.url, exp.label)}
                          className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:scale-110 active:scale-90"
                        >
                          SHARE 💬
                        </button>
                        <button 
                          onClick={() => handleDownload(res.url, exp.label)}
                          className="bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:scale-110 active:scale-90"
                        >
                          SAVE 📥
                        </button>
                      </div>
                    </div>
                  ) : res?.failed ? (
                    <div className="text-center space-y-2">
                      <span className="text-3xl">⚠️</span>
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Failed</p>
                      <button 
                        onClick={() => brewSticker(i, exp, true)}
                        className="text-[9px] font-bold underline text-gray-400"
                        disabled={res.retrying || isGenerating}
                      >
                        {res.retrying ? 'Retry...' : 'Try Again'}
                      </button>
                    </div>
                  ) : (res?.retrying || (isGenerating && progress < (i + 1) * (100 / EXPRESSIONS.length))) ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
                      <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest animate-pulse text-center">
                        {res?.status || `${exp.label}...`}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center opacity-20">
                      <span className="text-4xl">{exp.emoji}</span>
                      <p className="text-[10px] font-black uppercase mt-1">{exp.label}</p>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-xs font-bold">
                    {exp.emoji}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-in slide-in-from-bottom-2">
              🚨 {error}
            </div>
          )}
          
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest text-center leading-relaxed">
              Note: Sequential mode active (AI Rate limits). <br/> Total pack generation time: ~60-90 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerMaker;
