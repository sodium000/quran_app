"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "../../../context/SettingsContext";
import type { Verse } from "../../../types/quran";

interface VerseDisplayProps {
  surahId: number;
  verses: Verse[];
}

type PlayingStatus = "idle" | "loading" | "playing" | "paused";

export default function VerseDisplay({ surahId, verses }: VerseDisplayProps) {
  const { arabicFont, arabicFontSize, translationFontSize } = useSettings();

  const [audioData, setAudioData] = useState<string[] | null>(null);
  const [playingStatus, setPlayingStatus] = useState<PlayingStatus>("idle");
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const urlsRef = useRef<string[]>([]);
  const hasRetriedCurrentRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (playingStatus === "playing" && currentVerseIndex >= 0 && verseRefs.current[currentVerseIndex]) {
      verseRefs.current[currentVerseIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentVerseIndex, playingStatus]);

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

  const fetchAudio = async () => {
    try {
      const res = await fetch(`/api/audio/${surahId}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = (await res.json()) as { data?: { ayahs?: Array<{ audio?: string }> } };
      return data.data?.ayahs?.map((a) => a.audio ?? "").filter(Boolean) ?? [];
    } catch (e: unknown) {
      console.error("Failed to load audio:", e);
      return [];
    }
  };

  const playVerse = (index: number, urls: string[]) => {
    if (index >= urls.length) {
      setPlayingStatus("idle");
      setCurrentVerseIndex(-1);
      return;
    }
    urlsRef.current = urls;
    hasRetriedCurrentRef.current = false;
    setCurrentVerseIndex(index);
    if (!audioRef.current || !urls[index]) {
      console.error("Invalid audio URL at index", index);
      setPlayingStatus("idle");
      return;
    }
    audioRef.current.src = `/api/proxy-audio?url=${encodeURIComponent(urls[index])}`;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((e: unknown) => {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error("Audio playback interrupted", e);
          setPlayingStatus("paused");
        }
      });
    }
    audioRef.current.onended = () => {
      playVerse(index + 1, urls);
    };
  };

  const togglePlay = async () => {
    if (playingStatus === "playing") {
      audioRef.current?.pause();
      setPlayingStatus("paused");
    } else if (playingStatus === "paused") {
      if (!audioRef.current?.src || audioRef.current.src.startsWith("data:audio")) {
        setPlayingStatus("idle");
        togglePlay();
        return;
      }
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch((e: unknown) => {
          if (e instanceof Error && e.name !== "AbortError") {
            console.error("Audio resume error", e);
            setPlayingStatus("paused");
          }
        });
      }
      setPlayingStatus("playing");
    } else {
      setPlayingStatus("loading");
      let urls = audioData;
      if (!urls) {
        urls = await fetchAudio();
        setAudioData(urls);
      }
      if (urls && urls.length > 0) {
        setPlayingStatus("playing");
        playVerse(currentVerseIndex !== -1 ? currentVerseIndex : 0, urls);
      } else {
        setPlayingStatus("idle");
        alert("Audio could not be loaded at this time.");
      }
    }
  };

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingStatus("idle");
    setCurrentVerseIndex(-1);
  };

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        className="hidden"
        preload="auto"
        onError={(e) => {
          const audio = e.currentTarget;
          const error = e.currentTarget.error;
          if (!error || currentVerseIndex < 0) {
            return;
          }
          const errorMap: Record<number, string> = {
            1: "MEDIA_ERR_ABORTED",
            2: "MEDIA_ERR_NETWORK",
            3: "MEDIA_ERR_DECODE",
            4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
          };
          const currentUrl = urlsRef.current[currentVerseIndex];
          const isProxySrc = audio.src.includes("/api/proxy-audio?url=");

          if (isProxySrc && currentUrl && !hasRetriedCurrentRef.current) {
            // First failure on proxied stream: retry direct CDN URL once.
            hasRetriedCurrentRef.current = true;
            audio.src = currentUrl;
            audio.play().catch(() => {
              playVerse(currentVerseIndex + 1, urlsRef.current);
            });
            return;
          }

          console.warn("Audio Load Error:", {
            code: error?.code,
            type: error?.code ? errorMap[error.code] ?? "UNKNOWN" : "UNKNOWN",
            message: error?.message ?? "Check network/proxy logs",
            src: audio.src,
          });

          const nextIndex = currentVerseIndex + 1;
          if (nextIndex < urlsRef.current.length) {
            playVerse(nextIndex, urlsRef.current);
            return;
          }

          setPlayingStatus("idle");
          setCurrentVerseIndex(-1);
        }}
      />

      <div className="sticky top-22 z-30 mx-auto w-max mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-(--app-card) shadow-sm border border-(--app-border) rounded-full px-4 py-2 flex items-center space-x-3">
          <button
            onClick={togglePlay}
            disabled={playingStatus === "loading"}
            className="flex items-center justify-center space-x-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-5 py-2.5 font-semibold shadow-md transform hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            {playingStatus === "loading" ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : playingStatus === "playing" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
            <span>{playingStatus === "loading" ? "Loading Track..." : playingStatus === "playing" ? "Pause Recitation" : currentVerseIndex !== -1 ? "Resume Recitation" : "Play Recitation"}</span>
          </button>

          {(playingStatus === "playing" || playingStatus === "paused" || currentVerseIndex !== -1) && (
            <button
              onClick={stopPlay}
              className="p-2.5 rounded-full text-(--app-muted-2) hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none"
              title="Stop Recitation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-0 border border-(--app-border) rounded-2xl overflow-hidden bg-(--app-card)">
        {verses.map((verse, index) => {
          const isPlaying = currentVerseIndex === index && (playingStatus === "playing" || playingStatus === "paused");

          return (
            <div
              key={verse.id}
              ref={(el) => {
                verseRefs.current[index] = el;
              }}
              className={`group relative p-4 sm:p-5 border-b last:border-b-0 border-(--app-border) transition-colors duration-300 ${
                isPlaying
                  ? "bg-emerald-500/10"
                  : "bg-transparent hover:bg-(--app-surface)"
              }`}
              style={{ animationDelay: isPlaying ? "0ms" : `${index * 50}ms` }}
            >
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex flex-col gap-2 w-10 items-center text-(--app-muted-2) mt-1">
                    <button className="hover:text-emerald-600" aria-label="Play ayah">
                      ▷
                    </button>
                    <button className="hover:text-emerald-600" aria-label="Bookmark ayah">
                      ☆
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-emerald-700 mb-3">{surahId}:{verse.id}</div>
                    <div
                      className={`w-full text-right leading-[2.1] sm:leading-[2.4] tracking-wide select-text transition-all duration-300 ${
                        isPlaying ? "text-emerald-300 font-semibold" : "text-(--app-fg)"
                      }`}
                      style={{ fontFamily: arabicFont, fontSize: `${Math.max(18, arabicFontSize - (isMobile ? 6 : 0))}px` }}
                      dir="rtl"
                    >
                      {verse.text}
                    </div>
                    <div className="h-px w-full my-4 bg-(--app-border)"></div>
                    <div className="text-[11px] tracking-wide uppercase text-(--app-muted-2) mb-1">Saheeh International</div>
                    <div className={`text-left leading-relaxed transition-colors duration-500 ${isPlaying ? "text-(--app-fg)" : "text-(--app-muted)"}`} style={{ fontSize: `${translationFontSize}px` }}>
                      {verse.translation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-2 z-30 mt-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-500/20 bg-(--app-card) backdrop-blur px-4 py-3 shadow-sm">
          <div className="h-1 rounded bg-emerald-500/15 mb-3 overflow-hidden">
            <div className="h-full bg-emerald-500 w-1/3"></div>
          </div>
          <div className="flex items-center justify-between text-sm text-(--app-muted)">
            <span>
              Surah {surahId} {currentVerseIndex >= 0 ? `• Ayah ${currentVerseIndex + 1}` : ""}
            </span>
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                {playingStatus === "playing" ? "❚❚" : "▶"}
              </button>
              <button onClick={stopPlay} className="text-(--app-muted-2) hover:text-red-400">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
