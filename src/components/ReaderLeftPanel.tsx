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
  const pathname = usePathname();

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return surahs;
    }
    return surahs.filter((s) => `${s.id}`.includes(q) || s.englishName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [query, surahs]);

  return (
    <>
      <aside className="hidden lg:flex sticky top-24 h-[calc(100vh-7rem)] rounded-2xl bg-(--app-card) border border-(--app-border) shadow-sm flex-col items-center py-3 gap-2">
        <span className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold flex items-center justify-center ring-1 ring-emerald-500/30">
          S
        </span>

        <Link
          href="/surah"
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${
            pathname?.startsWith("/surah") ? "bg-emerald-500 text-white shadow-sm" : "text-(--app-muted) hover:bg-(--app-surface)"
          }`}
          aria-label="Surah Reader"
        >
          <IconHome />
        </Link>
        <button className="h-10 w-10 rounded-xl flex items-center justify-center text-(--app-muted) hover:bg-(--app-surface) transition" aria-label="Collections">
          <IconGrid />
        </button>
        <button className="h-10 w-10 rounded-xl flex items-center justify-center text-(--app-muted) hover:bg-(--app-surface) transition" aria-label="Recitations">
          <IconPlay />
        </button>
        <button className="h-10 w-10 rounded-xl flex items-center justify-center text-(--app-muted) hover:bg-(--app-surface) transition" aria-label="Bookmarks">
          <IconBookmark />
        </button>
        <button className="mt-auto mb-1 h-10 w-10 rounded-xl flex items-center justify-center text-(--app-muted) hover:bg-(--app-surface) transition" aria-label="Explore">
          <IconCompass />
        </button>
      </aside>

      <aside className="hidden lg:block sticky top-24 h-[calc(100vh-7rem)] rounded-2xl bg-(--app-card) border border-(--app-border) shadow-sm overflow-hidden">
        <div className="border-b border-(--app-border) p-3">
          <div className="flex rounded-xl bg-(--app-surface) p-1 text-xs font-medium">
            <button className="flex-1 rounded-lg bg-(--app-card-strong) py-1.5 text-(--app-fg) shadow-sm">Surah</button>
            <button className="flex-1 rounded-lg py-1.5 text-(--app-muted)">Juz</button>
            <button className="flex-1 rounded-lg py-1.5 text-(--app-muted)">Page</button>
          </div>
          <input
            placeholder="Search Surah"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-2 w-full rounded-lg border border-(--app-border) bg-(--app-card-strong) px-3 py-2 text-sm outline-none focus:border-emerald-300 text-(--app-fg) placeholder:text-(--app-muted-2)"
          />
        </div>
        <div className="h-[calc(100%-92px)] overflow-y-auto p-2">
          {filteredSurahs.map((item) => (
            <Link
              key={item.id}
              href={`/surah/${item.id}`}
              className={`block rounded-xl border px-3 py-3 mb-1 transition ${
                item.id === currentSurahId
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-transparent border-transparent hover:bg-(--app-surface)"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-7 min-w-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    item.id === currentSurahId ? "bg-emerald-600 text-white" : "bg-(--app-surface-2) text-(--app-muted)"
                  }`}
                >
                  {item.id}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-(--app-fg) truncate">{item.englishName}</p>
                  <p className="text-xs text-(--app-muted) truncate">{item.verses.length} Ayah</p>
                </div>
                <p className="font-arabic text-lg text-(--app-muted) truncate max-w-[110px]" dir="rtl">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
