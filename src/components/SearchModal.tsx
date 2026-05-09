"use client";

import { useSearch } from "../context/SearchContext";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function SearchModal() {
  const { isOpen, query, results, isSearching, setQuery, closeSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={closeSearch}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-(--app-card-strong) border border-(--app-border) shadow-2xl animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        
        {/* Search Header */}
        <div className="relative flex items-center border-b border-(--app-border) p-4">
          <svg className="h-5 w-5 text-(--app-muted)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="ml-3 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-(--app-muted-2) text-(--app-fg)"
            placeholder="Search Quran (Arabic or English)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden sm:flex items-center gap-1.5 ml-3">
             <span className="px-1.5 py-0.5 rounded border border-(--app-border) text-[10px] text-(--app-muted) uppercase tracking-wider">Esc</span>
          </div>
          {isSearching && (
            <div className="ml-3 h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          {!query.trim() ? (
             <div className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                </div>
                <p className="text-sm font-medium text-(--app-fg)">Start searching across all surahs</p>
                <p className="text-xs text-(--app-muted) mt-1">Tip: Try searching "mercy" or "صبر"</p>
             </div>
          ) : results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((result, idx) => (
                <Link
                  key={`${result.surahId}-${result.verseId}`}
                  href={`/surah/${result.surahId}#ayah-${result.verseId}`}
                  onClick={closeSearch}
                  className="group block p-4 rounded-xl hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                         {result.surahId}:{result.verseId}
                       </span>
                       <span className="text-sm font-semibold text-(--app-fg)">{result.surahName}</span>
                    </div>
                    <span className="text-xs font-arabic text-(--app-muted)" dir="rtl">{result.surahArabic}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-right font-arabic text-lg text-(--app-fg) leading-relaxed" dir="rtl">
                      <HighlightedText text={result.text} highlight={query} />
                    </p>
                    <p className="text-sm text-(--app-muted) leading-relaxed">
                      <HighlightedText text={result.translation} highlight={query} />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
               <p className="text-sm text-(--app-muted)">No results found for "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-(--app-surface) px-4 py-3 border-t border-(--app-border)">
          <div className="flex items-center gap-4 text-[10px] text-(--app-muted) uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1.5">
               <kbd className="px-1.5 py-0.5 rounded border border-(--app-border) bg-(--app-card)">Enter</kbd> to select
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
               <kbd className="px-1.5 py-0.5 rounded border border-(--app-border) bg-(--app-card)">↑↓</kbd> to navigate
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
            {results.length} results
          </span>
        </div>
      </div>
    </div>
  );
}

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;
  
  // Use a simple regex for English, and handle Arabic carefully
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-emerald-500/30 text-emerald-900 dark:text-emerald-300 rounded px-0.5 ring-1 ring-emerald-500/20">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
