"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Surah } from "../types/quran";

interface ReaderLeftPanelProps {
  surahs: Surah[];
  currentSurahId: number;
}

export default function ReaderLeftPanel({ surahs, currentSurahId }: ReaderLeftPanelProps) {
  const [query, setQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return surahs;
    }
    return surahs.filter((s) => `${s.id}`.includes(q) || s.englishName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [query, surahs]);

  return (
    <>
      <aside className="hidden lg:flex sticky top-24 h-[calc(100vh-7rem)] rounded-2xl bg-(--app-card) border border-(--app-border) shadow-sm flex-col items-center py-4 gap-4">
        <button className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">S</button>
        <button className="h-9 w-9 rounded-lg hover:bg-(--app-surface) text-(--app-muted)" aria-label="Home">
          ⌂
        </button>
        <button className="h-9 w-9 rounded-lg hover:bg-(--app-surface) text-(--app-muted)" aria-label="Library">
          ⌗
        </button>
        <button className="h-9 w-9 rounded-lg hover:bg-(--app-surface) text-(--app-muted)" aria-label="Audio">
          ♪
        </button>
        <button className="h-9 w-9 rounded-lg hover:bg-(--app-surface) text-(--app-muted)" aria-label="Bookmarks">
          ☆
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
                  <p className="text-xs text-(--app-muted) truncate">{item.type}</p>
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
