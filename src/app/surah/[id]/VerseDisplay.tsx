"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AyahCard from "../../../components/AyahCard";
import { useAudio } from "../../../hooks/useAudio";
import { useSettings } from "../../../context/SettingsContext";
import type { Verse } from "../../../types/quran";

interface VerseDisplayProps {
  surahId: number;
  surahName: string;
  verses: Verse[];
}

export default function VerseDisplay({ surahId, surahName, verses }: VerseDisplayProps) {
  const { arabicFont, arabicFontSize, translationFontSize } = useSettings();
  const { status, currentSurahId, currentAyahIndex, playAyah } = useAudio();

  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Record<string, true>>({});
  const [lastReadAyahId, setLastReadAyahId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const verseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasRestoredScroll = useRef(false);

 
  useEffect(() => {
    const isActiveSurah = currentSurahId === surahId;
    if (isActiveSurah && status === "playing" && currentAyahIndex >= 0 && verseRefs.current[currentAyahIndex]) {
      verseRefs.current[currentAyahIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyahIndex, currentSurahId, status, surahId]);

 
  useEffect(() => {
    const bookmarksKey = `bookmarks:surah:${surahId}`;
    const lastReadKey = `lastRead:surah:${surahId}`;
    
 
    const rawBookmarks = localStorage.getItem(bookmarksKey);
    if (rawBookmarks) {
      try {
        const parsed = JSON.parse(rawBookmarks) as number[];
        const map: Record<string, true> = {};
        for (const id of parsed) map[String(id)] = true;
        setBookmarkedAyahs(map);
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }

 
    const rawLastRead = localStorage.getItem(lastReadKey);
    if (rawLastRead) {
      const id = Number.parseInt(rawLastRead, 10);
      if (!isNaN(id)) {
        setLastReadAyahId(id);
      }
    }
  }, [surahId]);

  useEffect(() => {
    if (lastReadAyahId !== null && !hasRestoredScroll.current) {
      const index = verses.findIndex(v => v.id === lastReadAyahId);
      if (index !== -1 && verseRefs.current[index]) {
        setTimeout(() => {
          verseRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
          hasRestoredScroll.current = true;
        }, 500);
      }
    }
  }, [lastReadAyahId, verses]);

  useEffect(() => {
    const updateScreenState = () => setIsMobile(window.innerWidth < 640);
    updateScreenState();
    window.addEventListener("resize", updateScreenState);
    return () => window.removeEventListener("resize", updateScreenState);
  }, []);

  const handleSetLastRead = useCallback((ayahId: number) => {
    setLastReadAyahId(ayahId);
    localStorage.setItem(`lastRead:surah:${surahId}`, String(ayahId));
  }, [surahId]);

  const handleCopyAyah = async (verse: Verse) => {
    const payload = `${verse.text}\n\n${verse.translation}\n\n[Surah ${surahId}:${verse.id}]`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch (e) {
      console.warn("Clipboard access denied");
    }
  };

  const toggleBookmarkAyah = (verseId: number) => {
    const key = `bookmarks:surah:${surahId}`;
    setBookmarkedAyahs((prev) => {
      const next = { ...prev };
      const id = String(verseId);
      if (next[id]) delete next[id];
      else next[id] = true;

      const ids = Object.keys(next).map((value) => Number.parseInt(value, 10));
      localStorage.setItem(key, JSON.stringify(ids));
      return next;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-10">

      <div className="flex flex-col ">
        {verses.map((verse, index) => {
          const isPlaying = currentSurahId === surahId && currentAyahIndex === index && (status === "playing" || status === "paused" || status === "loading");

          return (
            <div
              key={verse.id}
              ref={(el) => {
                verseRefs.current[index] = el;
              }}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AyahCard
                ayah={verse}
                surahId={surahId}
                isPlaying={isPlaying}
                isBookmarked={Boolean(bookmarkedAyahs[String(verse.id)])}
                isLastRead={lastReadAyahId === verse.id}
                arabicFont={arabicFont}
                arabicFontSize={Math.max(22, arabicFontSize - (isMobile ? 6 : 0))}
                translationFontSize={Math.max(14, translationFontSize)}
                onPlay={() => void playAyah(surahId, surahName, index)}
                onCopy={() => void handleCopyAyah(verse)}
                onToggleBookmark={() => toggleBookmarkAyah(verse.id)}
                onSetLastRead={() => handleSetLastRead(verse.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


