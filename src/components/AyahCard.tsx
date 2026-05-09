"use client";

import { useState } from "react";
import type { Ayah } from "../types/quran";

interface AyahCardProps {
  ayah: Ayah;
  surahId: number;
  isPlaying: boolean;
  isBookmarked: boolean;
  isLastRead: boolean;
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
  onPlay: () => void;
  onCopy: () => void;
  onToggleBookmark: () => void;
  onSetLastRead: () => void;
}

export default function AyahCard({
  ayah,
  surahId,
  isPlaying,
  isBookmarked,
  isLastRead,
  arabicFont,
  arabicFontSize,
  translationFontSize,
  onPlay,
  onCopy,
  onToggleBookmark,
  onSetLastRead,
}: AyahCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const text = `${ayah.text}\n\n${ayah.translation}\n\n[Surah ${surahId}:${ayah.id}]`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surah ${surahId}, Ayah ${ayah.id}`,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      void handleCopy();
    }
  };

  const handleCopy = async () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <article
      id={`ayah-${ayah.id}`} 
      onMouseEnter={onSetLastRead}
      className={`group relative flex border-b gap-4 sm:gap-8 p-4 sm:p-8 transition-all duration-500 ${
        isPlaying
          ? "bg-[var(--app-accent-soft)] border-[var(--app-accent)]/30 shadow-premium"
          : isLastRead 
            ? "bg-(--app-card-strong)/50 border-[var(--app-accent)]/10"
            : "bg-(--app-card-strong)/50 border-(--app-border) hover:border-[var(--app-accent)]/20 hover:shadow-premium"
      }`} 
    >
      
      <div className="flex flex-col items-center ">
        <div 
          className={`min-w-[30px] sm:min-w-[40px] px-2 h-10 sm:h-10 mb-2 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
            isPlaying 
              ? "bg-[var(--app-accent)] text-white shadow-lg" 
              : "bg-(--app-surface-2) text-(--app-muted) group-hover:bg-[var(--app-accent-soft)] group-hover:text-[var(--app-accent)]"
          }`}
        >
          {surahId}.{ayah.id}
        </div>

        <div className="flex flex-col gap-2 opacity-100">
          <ActionButton 
            onClick={onPlay} 
            active={isPlaying} 
            title="Play Audio"
          >
            {isPlaying ? <IconPause /> : <IconPlaySmall />}
          </ActionButton>

          <ActionButton 
            onClick={onToggleBookmark} 
            active={isBookmarked} 
            title="Bookmark"
          >
            <IconBookmarkSmall active={isBookmarked} />
          </ActionButton>

          <ActionButton 
            onClick={handleCopy} 
            title="Copy Text"
            active={isCopied}
          >
            {isCopied ? <IconCheck /> : <IconCopySmall />}
          </ActionButton>

          <ActionButton 
            onClick={handleShare} 
            title="Share"
          >
            <IconShare />
          </ActionButton>
        </div>
      </div>
      <div className="flex-1 mt-15 min-w-0 flex flex-col justify-between">
        <div className="flex flex-col gap-6 sm:gap-8">
          <p
            className={`text-right tracking-wide leading-[2.2] sm:leading-[2.5] transition-all duration-500 ${
              isPlaying ? "text-[var(--app-accent)] scale-[1.01]" : "text-(--app-fg)"
            }`}
            style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px` }}
            dir="rtl"
          >
            {ayah.text}
          </p>

          <div className="space-y-3 mt-auto">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--app-muted-2)">Saheeh International</span>
             </div>
             <p 
               className={`text-left leading-relaxed transition-all duration-500 ${isPlaying ? "text-(--app-fg) translate-x-1" : "text-(--app-muted)"}`} 
               style={{ fontSize: `${translationFontSize}px` }}
             >
               {ayah.translation}
             </p>
          </div>
        </div>     
      </div>
    </article>
  );
}

function ActionButton({ onClick, children, title, active = false }: { onClick: () => void; children: React.ReactNode; title: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
        active 
          ? "bg-[var(--app-accent)] text-white border-transparent shadow-md" 
          : "bg-(--app-card) text-(--app-muted) border-(--app-border) hover:border-[var(--app-accent)] hover:text-[var(--app-accent)]"
      }`}
    >
      {children}
    </button>
  );
}

function IconPlaySmall() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>;
}

function IconPause() {
  return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
}

function IconBookmarkSmall({ active }: { active: boolean }) {
  return <svg className={`h-5 w-5 ${active ? "fill-current" : "fill-none"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
}

function IconCopySmall() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
}

function IconShare() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
}

function IconCheck() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}


