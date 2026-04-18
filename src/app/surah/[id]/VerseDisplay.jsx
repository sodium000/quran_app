"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../../context/SettingsContext';

export default function VerseDisplay({ surahId, verses }) {
  const { arabicFont, arabicFontSize, translationFontSize } = useSettings();

  const [audioData, setAudioData] = useState(null);
  const [playingStatus, setPlayingStatus] = useState('idle');
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const audioRef = useRef(null);
  const verseRefs = useRef([]);

  useEffect(() => {

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {

    if (playingStatus === 'playing' && currentVerseIndex >= 0 && verseRefs.current[currentVerseIndex]) {
      verseRefs.current[currentVerseIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentVerseIndex, playingStatus]);

  const fetchAudio = async () => {
    try {
      const res = await fetch(`/api/audio/${surahId}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      return data.data.ayahs.map(a => a.audio);
    } catch (e) {
      console.error("Failed to load audio:", e);
      return [];
    }
  };

  const playVerse = (index, urls) => {
    if (index >= urls.length) {
      setPlayingStatus('idle');
      setCurrentVerseIndex(-1);
      return;
    }
    setCurrentVerseIndex(index);
    if (!audioRef.current || !urls[index]) {
      console.error("Invalid audio URL at index", index);
      setPlayingStatus('idle');
      return;
    }
    audioRef.current.src = `/api/proxy-audio?url=${encodeURIComponent(urls[index])}`;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Audio playback interrupted", e);
          setPlayingStatus('paused');
        }
      });
    }
    audioRef.current.onended = () => {
      playVerse(index + 1, urls);
    };
  };

  const togglePlay = async () => {
    if (playingStatus === 'playing') {
      audioRef.current?.pause();
      setPlayingStatus('paused');
    } else if (playingStatus === 'paused') {

      if (!audioRef.current?.src || audioRef.current.src.startsWith('data:audio')) {
        setPlayingStatus('idle');
        togglePlay();
        return;
      }
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Audio resume error", e);
            setPlayingStatus('paused');
          }
        });
      }
      setPlayingStatus('playing');
    } else {

      if (audioRef.current && !audioRef.current.src) {
        audioRef.current.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
        audioRef.current.play().catch(() => { });
        audioRef.current.pause();
      }

      setPlayingStatus('loading');
      let urls = audioData;
      if (!urls) {
        urls = await fetchAudio();
        setAudioData(urls);
      }
      if (urls && urls.length > 0) {
        setPlayingStatus('playing');
        playVerse(currentVerseIndex !== -1 ? currentVerseIndex : 0, urls);
      } else {
        setPlayingStatus('idle');
        alert("Audio could not be loaded at this time.");
      }
    }
  };

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingStatus('idle');
    setCurrentVerseIndex(-1);
  };

  return (
    <div className="space-y-8">
      <audio
        ref={audioRef}
        className="hidden"
        preload="auto"
        onError={(e) => {
          const error = e.currentTarget.error;
          const errorMap = {
            1: "MEDIA_ERR_ABORTED",
            2: "MEDIA_ERR_NETWORK",
            3: "MEDIA_ERR_DECODE",
            4: "MEDIA_ERR_SRC_NOT_SUPPORTED"
          };
          console.error("Audio Load Error:", {
            code: error?.code,
            type: errorMap[error?.code] || "UNKNOWN",
            message: error?.message || "Check network/proxy logs",
            src: e.currentTarget.src
          });
          setPlayingStatus('paused');
        }}
      />

      <div className="sticky top-[5.5rem] z-30 mx-auto w-max mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80 rounded-full px-6 py-3 flex items-center space-x-4">
          <button
            onClick={togglePlay}
            disabled={playingStatus === 'loading'}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-5 py-2.5 font-semibold shadow-md transform hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            {playingStatus === 'loading' ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : playingStatus === 'playing' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
            <span>
              {playingStatus === 'loading' ? 'Loading Track...' : playingStatus === 'playing' ? 'Pause Recitation' : currentVerseIndex !== -1 ? 'Resume Recitation' : 'Play Recitation'}
            </span>
          </button>

          {(playingStatus === 'playing' || playingStatus === 'paused' || currentVerseIndex !== -1) && (
            <button
              onClick={stopPlay}
              className="p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
              title="Stop Recitation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {verses.map((verse, index) => {
          const isPlaying = currentVerseIndex === index && (playingStatus === 'playing' || playingStatus === 'paused');

          return (
            <div
              key={verse.id}
              ref={(el) => (verseRefs.current[index] = el)}
              className={`group relative backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-10 border transition-all duration-500 overflow-hidden ${isPlaying
                ? 'bg-white/95 border-emerald-300 ring-4 ring-emerald-500/20 scale-[1.01] shadow-[0_10px_40px_rgb(16,185,129,0.15)] z-10'
                : 'bg-white/70 border-white/80 hover:bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] z-0'
                }`}
              style={{ animationDelay: isPlaying ? '0ms' : `${index * 50}ms` }}
            >

              <div className={`absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-transparent transition-opacity duration-500 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">

                  <div className="flex-shrink-0 relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-2 md:mb-0">
                    <div className={`absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full transition-transform duration-700 shadow-lg shadow-emerald-500/20 ${isPlaying ? 'rotate-90 animate-pulse' : 'rotate-45 group-hover:rotate-90'}`}></div>
                    <div className="absolute inset-[2px] bg-white rounded-full"></div>
                    <span className={`relative font-bold text-base sm:text-lg font-serif transition-colors ${isPlaying ? 'text-emerald-600' : 'text-emerald-800'}`}>
                      {verse.id}
                    </span>
                  </div>


                  <div
                    className={`flex-1 w-full text-right leading-[2.2] sm:leading-[2.5] tracking-wide select-text transition-all duration-300 ${isPlaying ? 'text-emerald-600 font-bold scale-[1.02] transform origin-right' : 'text-slate-900 group-hover:text-emerald-800'}`}
                    style={{ fontFamily: arabicFont, fontSize: `${Math.max(18, arabicFontSize - (typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 0))}px`, textShadow: isPlaying ? '0 4px 15px rgba(16,185,129,0.3)' : '0 2px 10px rgba(0,0,0,0.02)' }}
                    dir="rtl"
                  >
                    {verse.text}
                  </div>
                </div>


                <div className={`relative h-px w-full my-6 bg-gradient-to-r transition-colors duration-500 ${isPlaying ? 'from-emerald-200 via-emerald-400 to-emerald-200' : 'from-transparent via-emerald-100 to-transparent'}`}></div>


                <div
                  className={`text-left font-medium leading-relaxed max-w-4xl transition-colors duration-500 ${isPlaying ? 'text-slate-900' : 'text-slate-600'}`}
                  style={{ fontSize: `${translationFontSize}px` }}
                >
                  {verse.translation}
                </div>
              </div>


              {isPlaying && playingStatus === 'playing' && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300 animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
