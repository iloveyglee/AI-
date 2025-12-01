import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { WallpaperGrid } from './components/WallpaperGrid';
import { FullScreenViewer } from './components/FullScreenViewer';
import { generateWallpapers, remixWallpaperBatch } from './services/geminiService';
import { Wallpaper, GenerationStatus } from './types';

function App() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [remixTarget, setRemixTarget] = useState<Wallpaper | null>(null);

  // Handle new generation
  const handleGenerate = async (prompt: string) => {
    setStatus(GenerationStatus.LOADING);
    try {
      let resultUrls: string[];

      if (remixTarget) {
        // Remix Logic
        resultUrls = await remixWallpaperBatch(remixTarget.url, prompt);
      } else {
        // Fresh Generation Logic
        resultUrls = await generateWallpapers(prompt);
      }

      const newWallpapers: Wallpaper[] = resultUrls.map((url, i) => ({
        id: Date.now().toString() + i,
        url,
        prompt: prompt,
        createdAt: Date.now(),
      }));

      // Prepend new wallpapers to the list
      setWallpapers(prev => [...newWallpapers, ...prev]);
      
      // Reset Remix state if active
      if (remixTarget) {
        setRemixTarget(null);
      }
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      alert("이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      if (status !== GenerationStatus.ERROR) {
        setStatus(GenerationStatus.IDLE);
      }
    }
  };

  const handleRemixRequest = (wallpaper: Wallpaper) => {
    setRemixTarget(wallpaper);
    // Optionally scroll to input or focus
    const inputEl = document.querySelector('input');
    if (inputEl) inputEl.focus();
  };

  const cancelRemix = () => {
    setRemixTarget(null);
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 px-2 sm:px-4 lg:px-8 w-full">
        {status === GenerationStatus.LOADING && wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="animate-pulse text-lg">AI가 그림을 그리고 있어요...</p>
             <p className="text-sm mt-2 text-slate-500">잠시만 기다려주세요 (약 10~20초)</p>
          </div>
        ) : (
          <WallpaperGrid 
            wallpapers={wallpapers} 
            onSelect={setSelectedWallpaper} 
          />
        )}
      </main>

      {/* Loading Overlay when generating but existing images are present */}
      {status === GenerationStatus.LOADING && wallpapers.length > 0 && (
         <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center">
            <div className="bg-slate-800 rounded-xl p-6 shadow-2xl flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-white font-medium">새로운 배경화면 생성 중...</p>
            </div>
         </div>
      )}

      <PromptBar 
        onGenerate={handleGenerate} 
        status={status}
        initialPrompt={remixTarget ? remixTarget.prompt : ''}
        isRemixMode={!!remixTarget}
        onCancelRemix={cancelRemix}
      />

      <FullScreenViewer 
        wallpaper={selectedWallpaper} 
        onClose={() => setSelectedWallpaper(null)}
        onRemix={handleRemixRequest}
      />
    </div>
  );
}

export default App;