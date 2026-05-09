"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type AudioStatus = "idle" | "loading" | "playing" | "paused" | "error";

interface AudioContextValue {
  status: AudioStatus;
  currentSurahId: number | null;
  currentAyahIndex: number;
  progress: number;
  duration: number;
  playAyah: (surahId: number, ayahIndex: number) => Promise<void>;
  playSurah: (surahId: number, startAyahIndex?: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const currentSurahRef = useRef<number | null>(null);
  const currentAyahIndexRef = useRef<number>(-1);
  const urlsCacheRef = useRef<Record<number, string[]>>({});
  const playRequestIdRef = useRef(0);

  const [status, setStatus] = useState<AudioStatus>("idle");
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);
  const [currentAyahIndex, setCurrentAyahIndexState] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const setCurrentAyahIndex = useCallback((index: number) => {
    currentAyahIndexRef.current = index;
    setCurrentAyahIndexState(index);
  }, []);

  const isAbortError = (error: unknown) => 
    error instanceof DOMException && error.name === "AbortError";

  const fetchSurahAudio = useCallback(async (surahId: number): Promise<string[]> => {
    const cached = urlsCacheRef.current[surahId];
    if (cached) return cached;

    try {
      const res = await fetch(`/api/audio/${surahId}`);
      if (!res.ok) throw new Error("Failed to fetch surah audio");
      const data = await res.json();
      const urls = data.data?.ayahs?.map((ayah: any) => ayah.audio ?? "").filter(Boolean) ?? [];
      urlsCacheRef.current[surahId] = urls;
      return urls;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }, []);

  const playFromIndex = useCallback(async (index: number) => {
    const audio = audioRef.current;
    const surahId = currentSurahRef.current;
    if (!audio || surahId == null) return;

    const urls = playlistRef.current;
    if (!urls.length || index < 0 || index >= urls.length) {
      setStatus("idle");
      setCurrentAyahIndex(-1);
      return;
    }

    const requestId = ++playRequestIdRef.current;
    const targetUrl = urls[index];

    setCurrentAyahIndex(index);
    setProgress(0);
    setDuration(0);
    setStatus("loading");


    const proxyUrl = `/api/proxy-audio?url=${encodeURIComponent(targetUrl)}`;
    
    const attemptPlay = async (url: string) => {
      if (requestId !== playRequestIdRef.current) return false;
      
      audio.src = url;
      audio.load();
      
      try {
        await audio.play();
        if (requestId === playRequestIdRef.current) {
          setStatus("playing");
          return true;
        }
      } catch (error) {
        if (!isAbortError(error) && requestId === playRequestIdRef.current) {
          console.warn(`Playback failed for ${url}:`, error);
        }
      }
      return false;
    };

    const success = await attemptPlay(proxyUrl);
    if (!success && requestId === playRequestIdRef.current) {
      const fallbackSuccess = await attemptPlay(targetUrl);
      if (!fallbackSuccess && requestId === playRequestIdRef.current) {
        setStatus("error");
      }
    }
  }, [setCurrentAyahIndex]);

  const playNext = useCallback(async () => {
    const nextIndex = currentAyahIndexRef.current + 1;
    if (nextIndex < playlistRef.current.length) {
      await playFromIndex(nextIndex);
    }
  }, [playFromIndex]);

  const playPrevious = useCallback(async () => {
    const prevIndex = currentAyahIndexRef.current - 1;
    if (prevIndex >= 0) {
      await playFromIndex(prevIndex);
    }
  }, [playFromIndex]);

  const handleEnded = useCallback(() => {
    const nextIndex = currentAyahIndexRef.current + 1;
    if (nextIndex < playlistRef.current.length) {
      void playFromIndex(nextIndex);
    } else {
      setStatus("idle");
      setCurrentAyahIndex(-1);
    }
  }, [playFromIndex, setCurrentAyahIndex]);


  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onWaiting = () => setStatus("loading");
    const onPlaying = () => setStatus("playing");
    const onPause = () => {
  
        if (playRequestIdRef.current === playRequestIdRef.current) {
           setStatus(prev => prev === "playing" ? "paused" : prev);
        }
    };
    const onError = () => setStatus("error");

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [handleEnded]);

  const playAyah = useCallback(async (surahId: number, ayahIndex: number) => {
    const isSameAyah = currentSurahRef.current === surahId && currentAyahIndexRef.current === ayahIndex;
    
    if (isSameAyah) {
      if (status === "playing") {
        audioRef.current?.pause();
        setStatus("paused");
      } else if (status === "paused") {
        try {
          await audioRef.current?.play();
          setStatus("playing");
        } catch (e) {
          void playFromIndex(ayahIndex);
        }
      } else {
        void playFromIndex(ayahIndex);
      }
      return;
    }

    setCurrentSurahId(surahId);
    currentSurahRef.current = surahId;
    
    const urls = await fetchSurahAudio(surahId);
    playlistRef.current = urls;
    await playFromIndex(ayahIndex);
  }, [status, fetchSurahAudio, playFromIndex]);

  const playSurah = useCallback(async (surahId: number, startAyahIndex = 0) => {
    setCurrentSurahId(surahId);
    currentSurahRef.current = surahId;
    const urls = await fetchSurahAudio(surahId);
    playlistRef.current = urls;
    await playFromIndex(startAyahIndex);
  }, [fetchSurahAudio, playFromIndex]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(async () => {
    if (!audioRef.current?.src) return;
    try {
      await audioRef.current.play();
      setStatus("playing");
    } catch (error) {
      if (!isAbortError(error)) {
        console.error("Audio resume failed:", error);
        setStatus("error");
      }
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (status === "playing") pause();
    else if (status === "paused" || status === "idle") await resume();
  }, [pause, resume, status]);

  const stop = useCallback(() => {
    playRequestIdRef.current++;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
    setProgress(0);
    setDuration(0);
    setStatus("idle");
    setCurrentAyahIndex(-1);
  }, [setCurrentAyahIndex]);

  const value = useMemo(() => ({
    status,
    currentSurahId,
    currentAyahIndex,
    progress,
    duration,
    playAyah,
    playSurah,
    playNext,
    playPrevious,
    pause,
    resume,
    togglePlayPause,
    stop,
  }), [status, currentSurahId, currentAyahIndex, progress, duration, playAyah, playSurah, playNext, playPrevious, pause, resume, togglePlayPause, stop]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioContext must be used within AudioProvider");
  return context;
}

