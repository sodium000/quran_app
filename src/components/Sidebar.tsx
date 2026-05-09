"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "../context/SettingsContext";
import type { Surah } from "../types/quran";

function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useSettings();
  const pathname = usePathname();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/data/quran.json")
      .then((res) => res.json() as Promise<Surah[]>)
      .then((data) => setSurahs(data))
      .catch(() => setSurahs([]));
  }, []);

  if (!isSidebarOpen) {
    return null;
  }

  const filteredSurahs = surahs.filter((surah) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return `${surah.id}`.includes(q) || surah.englishName.toLowerCase().includes(q) || surah.name.toLowerCase().includes(q);
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all duration-500 animate-in fade-in" 
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className="fixed inset-y-0 left-0 w-80 sm:w-96 max-w-[92vw] bg-(--app-card-strong) z-50 transform transition-transform duration-500 ease-out overflow-hidden border-r border-(--app-border) shadow-floating animate-in slide-in-from-left">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-6 border-b border-(--app-border) bg-(--app-surface)">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-black text-(--app-fg) tracking-tight uppercase">Surah <span className="text-[var(--app-accent)]">Index</span></h2>
                <p className="text-[10px] font-bold text-(--app-muted-2) uppercase tracking-widest mt-0.5">Quick navigation</p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="h-10 w-10 flex items-center justify-center text-(--app-muted-2) hover:text-[var(--app-accent)] transition-colors bg-(--app-card-strong) rounded-xl shadow-sm border border-(--app-border)"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex rounded-xl bg-(--app-card-strong) border border-(--app-border) p-1 text-[11px] font-black uppercase tracking-widest">
                <button className="flex-1 rounded-lg bg-[var(--app-accent)] py-2 text-white shadow-md">Surah</button>
                <button className="flex-1 rounded-lg py-2 text-(--app-muted) hover:text-(--app-fg) transition-colors">Juz</button>
                <button className="flex-1 rounded-lg py-2 text-(--app-muted) hover:text-(--app-fg) transition-colors">Page</button>
              </div>
              
              <div className="relative group">
                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-(--app-muted-2) group-focus-within:text-[var(--app-accent)] transition-colors" />
                <input
                  placeholder="Search Surah..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-(--app-border) bg-(--app-card-strong) pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-[var(--app-accent)] focus:ring-4 focus:ring-[var(--app-accent-soft)] transition-all text-(--app-fg) placeholder:text-(--app-muted-2)"
                />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-[var(--app-accent)]/20 scrollbar-track-transparent">
            {filteredSurahs.map((surah) => {
              const href = `/surah/${surah.id}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={surah.id}
                  href={href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`block group rounded-2xl px-4 py-4 transition-all duration-300 border ${
                    isActive
                      ? "bg-[var(--app-accent-soft)] border-[var(--app-accent)]/30 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-(--app-surface) hover:border-(--app-border)"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300 ${
                        isActive 
                          ? "bg-[var(--app-accent)] text-white shadow-md rotate-3" 
                          : "bg-(--app-surface-2) text-(--app-muted) group-hover:bg-[var(--app-accent-soft)] group-hover:text-[var(--app-accent)]"
                      }`}
                    >
                      {surah.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-bold truncate transition-colors ${isActive ? "text-[var(--app-accent)]" : "text-(--app-fg)"}`}>
                          {surah.englishName}
                        </p>
                        <p className={`font-arabic text-xl leading-none transition-colors ${isActive ? "text-[var(--app-accent)]" : "text-(--app-fg)"}`} dir="rtl">
                          {surah.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-(--app-muted-2)">{surah.type}</span>
                         <span className="h-1 w-1 rounded-full bg-(--app-border)" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-(--app-muted-2)">{surah.verses.length} Ayahs</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-(--app-border) px-6 py-4 bg-(--app-surface) flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-(--app-muted-2)">Total Surahs</p>
            <span className="text-sm font-black text-[var(--app-accent)]">{surahs.length || 114}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
