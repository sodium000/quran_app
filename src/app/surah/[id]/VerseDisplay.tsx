"use client";

import { useEffect, useRef, useState } from "react";
import AudioPlayer from "../../../components/AudioPlayer";
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
  const [isMobile, setIsMobile] = useState(false);
  const verseRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const isActiveSurah = currentSurahId === surahId;
    if (isActiveSurah && status === "playing" && currentAyahIndex >= 0 && verseRefs.current[currentAyahIndex]) {
      verseRefs.current[currentAyahIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyahIndex, currentSurahId, status, surahId]);

  useEffect(() => {
    const updateScreenState = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateScreenState();
    window.addEventListener("resize", updateScreenState);
    return () => {
      window.removeEventListener("resize", updateScreenState);
    };
  }, []);

  useEffect(() => {
    const key = `bookmarks:surah:${surahId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as number[];
      const map: Record<string, true> = {};
      for (const ayahId of parsed) {
        map[String(ayahId)] = true;
      }
      setBookmarkedAyahs(map);
    } catch {
      setBookmarkedAyahs({});
    }
  }, [surahId]);

  const handleCopyAyah = async (verse: Verse) => {
    const payload = `${surahId}:${verse.id}\n${verse.text}\n\n${verse.translation}`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // No-op if clipboard is blocked.
    }
  };

  const toggleBookmarkAyah = (verseId: number) => {
    const key = `bookmarks:surah:${surahId}`;
    setBookmarkedAyahs((prev) => {
      const next = { ...prev };
      const id = String(verseId);
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }

      const ids = Object.keys(next).map((value) => Number.parseInt(value, 10));
      localStorage.setItem(key, JSON.stringify(ids));
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <AudioPlayer surahId={surahId} surahName={surahName} />

      <div className="space-y-3 sm:space-y-4">
        {verses.map((verse, index) => {
          const isPlaying = currentSurahId === surahId && currentAyahIndex === index && (status === "playing" || status === "paused" || status === "loading");

          return (
            <div
              key={verse.id}
              ref={(el) => {
                verseRefs.current[index] = el;
              }}
              style={{ animationDelay: isPlaying ? "0ms" : `${index * 50}ms` }}
            >
              <AyahCard
                ayah={verse}
                surahId={surahId}
                isPlaying={isPlaying}
                isBookmarked={Boolean(bookmarkedAyahs[String(verse.id)])}
                arabicFont={arabicFont}
                arabicFontSize={Math.max(22, arabicFontSize - (isMobile ? 5 : 0))}
                translationFontSize={Math.max(13, translationFontSize)}
                onPlay={() => {
                  void playAyah(surahId, index);
                }}
                onCopy={() => {
                  void handleCopyAyah(verse);
                }}
                onToggleBookmark={() => toggleBookmarkAyah(verse.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

