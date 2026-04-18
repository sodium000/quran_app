"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSettings } from '../../context/SettingsContext';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [quranData, setQuranData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { arabicFont, arabicFontSize, translationFontSize } = useSettings();

  useEffect(() => {
    fetch('/data/quran.json')
      .then(res => res.json())
      .then(data => setQuranData(data))
      .catch(err => console.error("Error loading Quran data:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim() || !quranData) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    setTimeout(() => {
      const searchResults = [];
      const lowerQuery = query.toLowerCase();
      
      for (const surah of quranData) {
        for (const verse of surah.verses) {
          if (verse.translation.toLowerCase().includes(lowerQuery)) {
            searchResults.push({
              surahId: surah.id,
              surahName: surah.englishName,
              surahArabic: surah.name,
              verseId: verse.id,
              text: verse.text,
              translation: verse.translation
            });
          }
        }
      }
      
      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out px-2 sm:px-0">
      <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-2xl shadow-emerald-900/5 border border-white/80 text-center mb-8 sm:mb-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 text-emerald-500/5 blur-3xl transform rotate-45 pointer-events-none">
          <svg width="500" height="500" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z"></path>
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-900 to-teal-800 bg-clip-text text-transparent mb-3 sm:mb-4 font-serif">Search the Quran</h1>
          <p className="text-base sm:text-lg text-emerald-700/80 mb-8 sm:mb-10 font-light">Find wisdom by searching words or phrases in the English translation</p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center w-full">
              <span className="absolute left-4 sm:left-6 text-emerald-500 hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. mercy, patience..."
                className="w-full pl-5 sm:pl-16 pr-24 sm:pr-32 py-4 sm:py-5 rounded-full border-2 border-white bg-white/90 focus:bg-white focus:border-emerald-300 focus:outline-none shadow-sm text-base sm:text-lg text-slate-800 placeholder-slate-400 transition-all font-medium"
              />
              <button 
                type="submit" 
                className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-4 sm:px-8 font-semibold shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none text-sm sm:text-base"
                disabled={!quranData || isSearching}
              >
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Search'}
              </button>
            </div>
          </form>
          {!quranData && (
            <div className="flex items-center justify-center mt-6 space-x-2 text-emerald-600/70">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Initializing Database...</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {hasSearched && results.length === 0 && !isSearching && (
          <div className="text-center py-12 sm:py-16 px-4 sm:px-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 text-slate-500 font-medium">
            <span className="text-4xl sm:text-5xl mb-4 block">🔍</span>
            No verses found for "<span className="text-slate-800">{query}</span>". Try a different word.
          </div>
        )}
        
        {results.length > 0 && (
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 sm:px-5 sm:py-2 flex-wrap rounded-full font-medium border border-emerald-100 shadow-sm text-sm sm:text-base">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Found {results.length} result{results.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {results.map((result, idx) => (
          <div key={idx} className="group relative bg-white/80 backdrop-blur-lg rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-white hover:border-emerald-200/50 hover:bg-white hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-all duration-300">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 pb-4 border-b border-emerald-50/50 gap-4 sm:gap-0">
              <Link 
                href={`/surah/${result.surahId}`}
                className="inline-flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-900 font-semibold px-4 py-2 rounded-xl transition text-xs sm:text-sm tracking-wide gap-2 group-hover:shadow-sm"
              >
                <span>{result.surahId}:{result.verseId}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                <span className="truncate max-w-[120px] sm:max-w-none">{result.surahName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <div className="font-arabic text-xl sm:text-2xl text-slate-800 self-end sm:self-auto" dir="rtl">{result.surahArabic}</div>
            </div>
            
            <div className="space-y-4 sm:space-y-6 relative z-10">
              <div 
                className="text-right text-slate-900 leading-[2.2] sm:leading-[2.5]" 
                style={{ fontFamily: arabicFont, fontSize: `${Math.max(18, arabicFontSize - (typeof window !== 'undefined' && window.innerWidth < 640 ? 4 : 0))}px` }}
                dir="rtl"
              >
                {result.text}
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-100 to-transparent my-4 sm:my-6"></div>
              <div 
                className="text-left text-slate-600 leading-relaxed font-medium text-sm sm:text-base"
                style={{ fontSize: `${Math.max(14, translationFontSize - (typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 0))}px` }}
              >
                {result.translation.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                  part.toLowerCase() === query.toLowerCase() 
                    ? <span key={i} className="bg-amber-200/80 text-amber-900 rounded p-0.5 px-1 sm:px-1.5 shadow-sm font-semibold">{part}</span>
                    : part
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
