"use client";

import type { Ayah } from "../types/quran";

interface AyahCardProps {
  ayah: Ayah;
  surahId: number;
  isPlaying: boolean;
  isBookmarked: boolean;
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
  onPlay: () => void;
  onCopy: () => void;
  onToggleBookmark: () => void;
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5.6c0-1.1 1.2-1.9 2.2-1.3l10 6c1 .6 1 2 0 2.6l-10 6c-1 .6-2.2-.2-2.2-1.3V5.6Z" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.5V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconBookmark({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden="true">
        <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.5-6 3.5v-16Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.5-6 3.5v-16Z" />
    </svg>
  );
}

function ActionButton({
  title,
  onClick,
  children,
  active = false,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`h-9 w-9 rounded-lg flex items-center justify-center transition ${
        active ? "bg-emerald-600 text-white" : "bg-(--app-surface) text-(--app-muted) hover:bg-emerald-500/15 hover:text-emerald-500"
      }`}
    >
      {children}
    </button>
  );
}

export default function AyahCard({
  ayah,
  surahId,
  isPlaying,
  isBookmarked,
  arabicFont,
  arabicFontSize,
  translationFontSize,
  onPlay,
  onCopy,
  onToggleBookmark,
}: AyahCardProps) {
  return (
    <article
      className={`group relative rounded-2xl border transition-all duration-300 p-4 sm:p-5 ${
        isPlaying
          ? "bg-emerald-500/10 border-emerald-500/35 shadow-[0_10px_35px_rgba(16,185,129,0.12)]"
          : "bg-(--app-card) border-(--app-border) hover:border-emerald-500/20 hover:bg-(--app-surface)"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="hidden sm:flex flex-col gap-2">
          <ActionButton title="Play Ayah" onClick={onPlay} active={isPlaying}>
            <IconPlay />
          </ActionButton>
          <ActionButton title="Copy Ayah" onClick={onCopy}>
            <IconCopy />
          </ActionButton>
          <ActionButton title="Bookmark Ayah" onClick={onToggleBookmark} active={isBookmarked}>
            <IconBookmark active={isBookmarked} />
          </ActionButton>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex h-8 min-w-8 px-2 rounded-full items-center justify-center text-xs font-semibold bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/25">
              {surahId}:{ayah.id}
            </span>

            <div className="sm:hidden flex items-center gap-2">
              <ActionButton title="Play Ayah" onClick={onPlay} active={isPlaying}>
                <IconPlay />
              </ActionButton>
              <ActionButton title="Copy Ayah" onClick={onCopy}>
                <IconCopy />
              </ActionButton>
              <ActionButton title="Bookmark Ayah" onClick={onToggleBookmark} active={isBookmarked}>
                <IconBookmark active={isBookmarked} />
              </ActionButton>
            </div>
          </div>

          <p
            className={`text-right tracking-wide select-text transition-colors duration-300 leading-[2.15] sm:leading-[2.35] ${
              isPlaying ? "text-emerald-300" : "text-(--app-fg)"
            }`}
            style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px` }}
            dir="rtl"
          >
            {ayah.text}
          </p>

          <div className="h-px w-full my-4 bg-(--app-border)" />

          <p className="text-[11px] uppercase tracking-wide text-(--app-muted-2) mb-1">Saheeh International</p>
          <p className={`leading-relaxed ${isPlaying ? "text-(--app-fg)" : "text-(--app-muted)"}`} style={{ fontSize: `${translationFontSize}px` }}>
            {ayah.translation}
          </p>
        </div>
      </div>
    </article>
  );
}

