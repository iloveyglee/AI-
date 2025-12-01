import React from 'react';
import { Wallpaper } from '../types';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  onSelect: (wallpaper: Wallpaper) => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({ wallpapers, onSelect }) => {
  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 text-center px-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="text-lg font-medium">나만의 배경화면을 만들어보세요</p>
        <p className="text-sm mt-2">아래 입력창에 원하는 분위기를 설명해주세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 pb-24 max-w-4xl mx-auto">
      {wallpapers.map((wp, index) => (
        <div 
          key={wp.id} 
          className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-800 cursor-pointer group shadow-lg ring-1 ring-white/10"
          onClick={() => onSelect(wp)}
        >
          <img 
            src={wp.url} 
            alt={wp.prompt} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
};