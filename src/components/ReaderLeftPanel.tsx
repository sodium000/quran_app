"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Surah } from "../types/quran";

interface ReaderLeftPanelProps {
  surahs: Surah[];
  currentSurahId: number;
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5.6c0-1.1 1.2-1.9 2.2-1.3l10 6c1 .6 1 2 0 2.6l-10 6c-1 .6-2.2-.2-2.2-1.3V5.6Z" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.5-6 3.5v-16Z" />
    </svg>
  );
}

function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.7 8.3-2.1 6.1-6.1 2.1 2.1-6.1 6.1-2.1Z" />
    </svg>
  );
}

export default function ReaderLeftPanel({ surahs, currentSurahId }: ReaderLeftPanelProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return surahs;
    }
    return surahs.filter((s) => `${s.id}`.includes(q) || s.englishName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [query, surahs]);

  return (
    <aside className="hidden lg:flex flex-col w-full h-[calc(100vh-4rem)] bg-(--app-bg) border-r border-(--app-border) overflow-hidden">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex rounded-lg bg-(--app-surface) p-1 text-[11px] font-bold uppercase tracking-wider">
          <button 
            onClick={() => setActiveTab("surah")}
            className={`flex-1 rounded-md py-1.5 transition-all ${activeTab === "surah" ? "bg-(--app-card) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
          >
            Surah
          </button>
          <button 
            onClick={() => setActiveTab("juz")}
            className={`flex-1 rounded-md py-1.5 transition-all ${activeTab === "juz" ? "bg-(--app-card) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
          >
            Juz
          </button>
          <button 
            onClick={() => setActiveTab("page")}
            className={`flex-1 rounded-md py-1.5 transition-all ${activeTab === "page" ? "bg-(--app-card) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
          >
            Page
          </button>
        </div>

        <div className="relative group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--app-muted) group-focus-within:text-[var(--app-accent)] transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search Surah"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface) pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--app-accent)] transition-all text-(--app-fg) placeholder:text-(--app-muted-2)"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {filteredSurahs.map((item) => (
          <Link
            key={item.id}
            href={`/surah/${item.id}`}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 mb-1 transition-all ${
              item.id === currentSurahId
                ? "bg-[var(--app-accent-soft)]"
                : "hover:bg-(--app-surface)"
            }`}
          >
            <div
              className={`h-9 w-9 shrink-0 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                item.id === currentSurahId 
                  ? "bg-[var(--app-accent)] text-white shadow-md" 
                  : "bg-(--app-surface) text-(--app-muted)"
              }`}
            >
              {item.id}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold truncate ${item.id === currentSurahId ? "text-[var(--app-accent)]" : "text-(--app-fg)"}`}>
                {item.englishName}
              </p>
              <p className="text-[10px] font-medium text-(--app-muted) uppercase tracking-wide">
                {item.type} • {item.verses.length} Ayahs
              </p>
            </div>
            <p className={`font-arabic text-xl ${item.id === currentSurahId ? "text-[var(--app-accent)]" : "text-(--app-muted)"}`} dir="rtl">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
