import React, { useState, useEffect } from 'react';
import { GenerationStatus } from '../types';

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  status: GenerationStatus;
  initialPrompt?: string;
  isRemixMode?: boolean;
  onCancelRemix?: () => void;
}

export const PromptBar: React.FC<PromptBarProps> = ({ 
  onGenerate, 
  status, 
  initialPrompt = '',
  isRemixMode = false,
  onCancelRemix
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);

  // Sync internal state if initialPrompt changes (e.g., when entering remix mode)
  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || status === GenerationStatus.LOADING) return;
    onGenerate(prompt);
  };

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent z-40 pb-6 sm:pb-8">
      {isRemixMode && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
               <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312h-2.433a.75.75 0 000 1.5h4.242z" clipRule="evenodd" />
             </svg>
             Remix Mode
          </span>
          <button 
            onClick={onCancelRemix}
            className="text-xs text-slate-400 hover:text-white"
          >
            취소
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto w-full">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={isRemixMode ? "어떻게 이미지를 변형할까요?" : "예: 해 질 무렵의 서정적인 도시 풍경"}
          className={`w-full bg-slate-800 text-white placeholder-slate-400 rounded-full py-3.5 pl-5 pr-14 
            border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none 
            shadow-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`absolute right-1.5 top-1.5 p-2 rounded-full transition-all duration-200
            ${!prompt.trim() || isLoading 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-500 shadow-md hover:shadow-purple-500/30'}`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};