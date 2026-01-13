
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
  const [results, setResults] = useState<Record<number, { url: string; exp: string; failed?: boolean; retrying?: boolean }>>({});
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

  // Fix: Explicitly type 'exp' to match the EXPRESSIONS items
  const brewSticker = async (index: number, exp: { label: string; emoji: string }, isIndividualRetry = false): Promise<boolean> => {
    if (!selectedImage) return false;
    
    if (isIndividualRetry) {
      setResults(prev => ({ ...prev, [index]: { ...prev[index], retrying: true, failed: false } }));
    }

    try {
      const url = await generateSticker(selectedImage, prompt, exp.label);
      
      const newSticker: Sticker = {
        id: `stix-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
        originalImage: selectedImage,
        stickerImage: url,
        prompt: `${prompt || 'Cartoon'} (${exp.label})`,
        createdAt: Date.now(),
      };

      setResults(prev => ({ 
        ...prev, 
        [index]: { url, exp: exp.label, failed: false, retrying: false } 
      }));
      
      onStickerCreated(newSticker);
      return true;
    } catch (err) {
      console.warn(`Brew failed for ${exp.label}`, err);
      setResults(prev => ({ 
        ...prev, 
        [index]: { url: '', exp: exp.label, failed: true, retrying: false } 
      }));
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    
    setIsGenerating(true);
    setResults({});
    setProgress(0);
    setError(null);
    
    console.info("SnapStix: Brewing full pack of 5...");

    // Parallelize with slight staggers for better performance and consistency
    const tasks = EXPRESSIONS.map(async (exp, i) => {
      await new Promise(resolve => setTimeout(resolve, i * 800)); // Stagger to avoid request bursts
      const success = await brewSticker(i, exp);
      return success;
    });

    // Tracking progress as they complete
    let finished = 0;
    tasks.forEach(task => {
      task.then(() => {
        finished++;
        setProgress((finished / EXPRESSIONS.length) * 100);
      });
    });

    // Fix: Wait for all tasks to complete and use their individual success/failure returns
    const brewResults = await Promise.all(tasks);

    // Fix: Instead of using stale 'results' state which is captured in closure (and often seen as empty),
    // we use the return values of the tasks to determine failure count. 
    // This also fixes the TS error: Property 'failed' does not exist on type 'unknown' on line 104.
    const failedCount = brewResults.filter(success => !success).length;
    
    if (failedCount === EXPRESSIONS.length) {
      setError("AI was unable to brew any stickers. This category might be triggering safety filters. Try a friendlier theme!");
    } else if (failedCount > 0) {
      setError(`Almost there! ${failedCount} sticker(s) hit a snag. You can tap the retry icon on the cards below.`);
    }

    setIsGenerating(false);
  };

  const handleDownload = (url: string, exp: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapstix-${exp.toLowerCase()}.png`;
    link.click();
  };

  const handleRetrySingle = (index: number) => {
    if (isGenerating) return;
    brewSticker(index, EXPRESSIONS[index], true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
      <header className="text-center space-y-3">
        <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 bg-clip-text text-transparent italic tracking-tighter">
          THE MAGIC PACK
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">One Snap • 5 Guaranteed Expressive Stickers</p>
      </header>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[32px] text-red-600 flex items-center gap-4 transition-all mx-auto max-w-xl shadow-sm">
          <span className="text-3xl">⚠️</span>
          <p className="font-black text-sm leading-tight">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="glass rounded-[48px] p-8 shadow-2xl border border-white/50 space-y-8">
            <div 
              className="relative group cursor-pointer transition-transform hover:scale-[1.02]" 
              onClick={() => !isGenerating && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={isGenerating} />
              {selectedImage ? (
                <div className="relative aspect-square rounded-[40px] overflow-hidden border-8 border-white shadow-xl sticker-shadow">
                  <img src={selectedImage} alt="Source" className="w-full h-full object-cover" />
                  {!isGenerating && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-black px-8 py-3 rounded-full border-2 border-white backdrop-blur-sm text-sm uppercase">Change Photo</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square rounded-[40px] border-4 border-dashed border-pink-100 bg-pink-50/20 flex flex-col items-center justify-center gap-6 transition-all hover:border-pink-300 group">
                  <div className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center text-6xl animate-float">📸</div>
                  <div className="text-center">
                    <p className="text-pink-600 font-black uppercase tracking-widest text-xs">Drop Image Here</p>
                    <p className="text-gray-400 text-[10px] mt-1 font-bold">PNG, JPG or WEBP</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Character Theme</label>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Cyberpunk Ninja, Space Cat..."
                className="w-full px-8 py-5 rounded-[24px] border-2 border-gray-50 focus:ring-8 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all shadow-inner bg-white/50 font-bold"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedImage || isGenerating}
              className={`w-full py-8 rounded-[32px] font-black text-white text-xl transition-all shadow-2xl flex flex-col items-center justify-center gap-2 ${
                !selectedImage || isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:scale-[1.03] active:scale-95'
              }`}
            >
              {isGenerating ? (
                <div className="w-full px-10 space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/80">
                    <span>Brewing Pack...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,255,255,1)]" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🪄</span>
                  <span>GENERATE PACK</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-8">
          {(Object.keys(results).length > 0 || isGenerating) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {EXPRESSIONS.map((exp, idx) => {
                const res = results[idx];
                const isLoading = (isGenerating && !res) || res?.retrying;
                const isFailed = res?.failed;

                return (
                  <div key={idx} className={`glass p-8 rounded-[56px] border-2 border-white shadow-xl transition-all duration-700 ${idx === 0 ? 'sm:col-span-2' : ''}`}>
                    <div className="relative aspect-square bg-gradient-to-br from-white to-gray-50 rounded-[40px] overflow-hidden flex items-center justify-center border border-gray-100/50">
                      {res && !isFailed && !res.retrying ? (
                        <>
                          <img src={res.url} alt={res.exp} className="w-full h-full object-contain p-10 sticker-shadow transform hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-pink-600 shadow-md border border-pink-100 flex items-center gap-2">
                            <span className="text-lg">{exp.emoji}</span> {res.exp}
                          </div>
                          <button 
                            onClick={() => handleDownload(res.url, res.exp)}
                            className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur rounded-[24px] flex items-center justify-center shadow-lg hover:bg-pink-600 hover:text-white transition-all text-2xl sticker-shadow"
                          >
                            📥
                          </button>
                        </>
                      ) : isFailed ? (
                        <div className="flex flex-col items-center gap-4 text-center px-6">
                          <span className="text-4xl grayscale opacity-30">🪄</span>
                          <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Brewing Issue</p>
                          <button 
                            onClick={() => handleRetrySingle(idx)}
                            className="px-6 py-2 bg-pink-100 text-pink-600 rounded-full font-black text-[10px] uppercase hover:bg-pink-200 transition-colors flex items-center gap-2"
                          >
                            <span>Retry</span> <span>🔄</span>
                          </button>
                        </div>
                      ) : isLoading ? (
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-20 h-20 border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin shadow-inner" />
                          <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em] animate-pulse text-center px-4 leading-relaxed">
                            {res?.retrying ? 'Retrying...' : `Crafting ${exp.label}...`}
                          </p>
                        </div>
                      ) : (
                        <div className="text-6xl opacity-5">🪄</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center glass rounded-[80px] border-4 border-dashed border-pink-100 p-20 space-y-8">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center text-7xl shadow-inner animate-float border-4 border-pink-50">🎨</div>
              <div className="space-y-3">
                <h3 className="text-4xl font-black text-gray-800 tracking-tight">Your Studio is Ready</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                  Upload a snap to see the magic happen. We'll brew <span className="text-pink-600 font-black">5 unique stickers</span> for you in one go.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickerMaker;
