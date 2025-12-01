import React, { useState } from 'react';
import { Wallpaper } from '../types';

interface FullScreenViewerProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  onRemix: (wallpaper: Wallpaper) => void;
}

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({ wallpaper, onClose, onRemix }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!wallpaper) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // For better Android compatibility, convert Base64 to Blob
      const response = await fetch(wallpaper.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wallpaper-${wallpaper.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
      // Fallback to direct link if blob creation fails
      const link = document.createElement('a');
      link.href = wallpaper.url;
      link.download = `wallpaper-${wallpaper.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      // Simulate a small delay for visual feedback
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Image - Adjusted for landscape */}
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
        <img 
          src={wallpaper.url} 
          alt={wallpaper.prompt} 
          className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
        />
      </div>

      {/* Actions Bar */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
        <button
          onClick={() => {
            onRemix(wallpaper);
            onClose();
          }}
          className="flex-1 max-w-[160px] flex items-center justify-center gap-2 bg-slate-800/80 backdrop-blur-md text-white py-3 px-6 rounded-full font-medium hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
          Remix
        </button>
        
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 max-w-[160px] flex items-center justify-center gap-2 bg-white text-slate-900 py-3 px-6 rounded-full font-bold hover:bg-slate-200 transition-colors"
        >
          {isDownloading ? (
             <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              다운로드
            </>
          )}
        </button>
      </div>
    </div>
  );
};