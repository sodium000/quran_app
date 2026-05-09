"use client";

import { useAudio } from "../hooks/useAudio";
import { useMemo } from "react";

export default function AudioPlayer() {
  const { 
    status, 
    currentSurahId, 
    currentSurahName, 
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

  const isActive = status !== "idle";

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
    if (status === "idle" || status === "error") {
      return;
    }
    await togglePlayPause();
  };

  if (!isActive && status === "idle") return null;

  return (
    <div className="fixed bottom-[64px] lg:bottom-0 left-0 lg:left-[72px] right-0 z-50 animate-in slide-in-from-bottom-full duration-500 ease-out">  
      <div className="h-1 bg-(--app-surface-2) w-full overflow-hidden relative">
        <div 
          className="h-full bg-[var(--app-accent)] shadow-[0_0_10px_rgba(45,106,79,0.5)] transition-all duration-300 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="bg-(--app-card) border-t border-(--app-border) shadow-floating backdrop-blur-xl">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 h-15 flex items-center justify-between gap-4">
          
          <div className="flex-1 min-w-0 hidden lg:flex items-center gap-4">
            <div className="flex flex-col">
              <h3 className="truncate text-sm font-semibold text-(--app-fg)">
                {currentSurahName}: {currentAyahIndex + 1}
              </h3>
            </div>
          </div>

          <div className="lg:hidden flex-1 min-w-0">
             <h3 className="truncate text-xs font-bold text-(--app-fg)">
                {currentSurahName}: {currentAyahIndex + 1}
              </h3>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-4 sm:gap-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-(--app-muted) w-10 text-right">{formatTime(progress)}</span>
                
                <div className="flex items-center gap-1 sm:gap-3">
                  <button
                    onClick={() => void playPrevious()}
                    className="p-2 text-(--app-muted) hover:text-[var(--app-accent)] transition-all active:scale-90"
                    title="Previous"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => void onMainAction()}
                    disabled={status === "loading"}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-accent)] text-white shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : status === "playing" ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => void playNext()}
                    className="p-2 text-(--app-muted) hover:text-[var(--app-accent)] transition-all active:scale-90"
                    title="Next"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>

                <span className="text-[10px] font-mono font-bold text-(--app-muted) w-10">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
             <button
              onClick={stop}
              className="h-10 w-10 flex items-center justify-center rounded-xl text-(--app-muted) hover:bg-(--app-surface) hover:text-red-500 transition-all active:scale-95"
              title="Close Player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
