"use client";

import { useAudio } from "../hooks/useAudio";
import { useMemo } from "react";

interface AudioPlayerProps {
  surahId: number;
  surahName: string;
}

export default function AudioPlayer({ surahId, surahName }: AudioPlayerProps) {
  const { 
    status, 
    currentSurahId, 
    currentAyahIndex, 
    progress, 
    duration, 
    playSurah, 
    pause, 
    resume, 
    stop,
    togglePlayPause,
    playNext,
    playPrevious
  } = useAudio();

  const isCurrentSurah = currentSurahId === surahId;
  const isActive = isCurrentSurah && status !== "idle";

  const progressPercent = useMemo(() => {
    if (duration <= 0) return 0;
    return Math.min(100, (progress / duration) * 100);
  }, [progress, duration]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onMainAction = async () => {
    if (!isCurrentSurah || status === "idle" || status === "error") {
      await playSurah(surahId, 0);
      return;
    }
    await togglePlayPause();
  };

  if (!isActive && status === "idle") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-500 ease-out">
      <div className="absolute top-0 left-0 right-0 h-1 bg-(--app-surface-2) z-20">
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-300 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
        <div 
            className="absolute h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-md -top-1 transition-all duration-300 ease-linear"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>

      <div className="bg-(--app-card-strong) border-t border-(--app-border) shadow-[0_-10px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        <div className="max-w-[1920px] mx-auto px-4 h-20 sm:h-24 flex items-center justify-between gap-4">
          
          <div className="flex-1 min-w-0 hidden md:block">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600/70 mb-0.5">
                {status === "loading" ? "Buffering..." : "Currently Playing"}
              </span>
              <h3 className="truncate text-sm sm:text-base font-bold text-(--app-fg)">
                {surahName} : {currentAyahIndex + 1}
              </h3>
            </div>
          </div>

          <div className="md:hidden flex-1 min-w-0">
             <h3 className="truncate text-xs font-bold text-(--app-fg)">
                {surahName} : {currentAyahIndex + 1}
              </h3>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => void playPrevious()}
              className="p-2 text-(--app-muted) hover:text-emerald-500 transition-colors active:scale-90"
              title="Previous Ayah"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-7 sm:w-7">
                <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
              </svg>
            </button>

            <button
              onClick={() => void onMainAction()}
              disabled={status === "loading"}
              className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {status === "loading" ? (
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : status === "playing" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 sm:h-8 sm:w-8">
                  <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>


            <button
              onClick={() => void playNext()}
              className="p-2 text-(--app-muted) hover:text-emerald-500 transition-colors active:scale-90"
              title="Next Ayah"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-7 sm:w-7">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            <button
              onClick={stop}
              className="p-2 text-(--app-muted) hover:text-red-500 transition-colors active:scale-90"
              title="Stop"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex-1 flex justify-end items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-(--app-fg)">
                    {formatTime(progress)}
                </span>
                <span className="text-[10px] text-(--app-muted) uppercase font-medium">Current</span>
             </div>
             <div className="h-8 w-px bg-(--app-border) hidden sm:block mx-1" />
             <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-(--app-fg) sm:text-emerald-600">
                    {formatTime(duration)}
                </span>
                <span className="text-[10px] text-(--app-muted) uppercase font-medium">Total</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}


