"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "../context/SettingsContext";
import type { Surah } from "../types/quran";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useSettings();
  const pathname = usePathname();
  const [surahs, setSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    fetch("/data/quran.json")
      .then((res) => res.json() as Promise<Surah[]>)
      .then((data) => setSurahs(data))
      .catch(() => setSurahs([]));
  }, []);

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all duration-300" onClick={() => setIsSidebarOpen(false)}></div>

      <aside className="fixed inset-y-0 left-0 w-88 max-w-[92vw] bg-(--app-card-strong) z-50 transform transition-transform duration-300 overflow-hidden border-r border-emerald-500/15 shadow-2xl">
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b border-(--app-border) bg-(--app-surface)">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-(--app-fg) tracking-wide">Surah Index</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-(--app-muted-2) hover:text-emerald-400 transition-colors bg-(--app-card-strong) hover:bg-(--app-surface) rounded-full p-2"
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-(--app-muted) mt-1">Scrollable list of all 114 surahs</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {surahs.map((surah) => {
              const href = `/surah/${surah.id}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={surah.id}
                  href={href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`block rounded-xl px-3 py-3 border transition-all ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-(--app-surface) hover:border-emerald-500/15"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-8 min-w-8 px-2 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-emerald-600 text-white" : "bg-(--app-surface-2) text-(--app-muted)"
                      }`}
                    >
                      {surah.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-right font-arabic text-xl leading-tight text-(--app-fg) truncate" dir="rtl">
                        {surah.name}
                      </p>
                      <p className="text-sm text-(--app-muted) truncate">{surah.englishName}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-(--app-border) px-4 py-3 text-xs text-(--app-muted) bg-(--app-surface)">
            <span className="font-medium text-(--app-fg)">{surahs.length || 114}</span> surahs
          </div>
        </div>
      </aside>
    </>
  );
}
