"use client";

import Link from "next/link";
import { useSettings } from "../context/SettingsContext";
import { useSearch } from "../context/SearchContext";

function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconTheme({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
      />
    </svg>
  );
}

function IconMonitor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17h6m-8 3h10M4 5h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
    </svg>
  );
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.5 8.5 0 1111.2 3a7 7 0 109.8 9.8z" />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
    </svg>
  );
}

export default function Navbar() {
  const { setIsSidebarOpen, setIsSettingsOpen, theme, setTheme } = useSettings();
  const { toggleSearch } = useSearch();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
              aria-label="Open surah list"
              title="Surah list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/surah" className="flex min-w-0 items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25">
                <IconBook className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base sm:text-lg font-semibold text-white leading-tight">Quran Mazid</span>
                <span className="block truncate text-[11px] sm:text-xs text-white/60 leading-tight">Read, Study &amp; Learn from the Quran</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden sm:flex items-center gap-3 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 transition group"
              aria-label="Search"
              title="Search"
              onClick={toggleSearch}
            >
              <IconSearch className="h-5 w-5 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium">Search...</span>
              <kbd className="hidden lg:inline-flex h-5 w-8 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/40 group-hover:text-white/60 transition-colors">⌘K</kbd>
            </button>

            <button
              type="button"
              className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
              aria-label="Search"
              title="Search"
              onClick={toggleSearch}
            >
              <IconSearch className="h-5 w-5" />
            </button>

            <div className="relative">
              <details className="group">
                <summary
                  className="list-none inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Theme"
                  title="Theme"
                >
                  <IconTheme className="h-5 w-5" />
                </summary>

                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl ring-1 ring-white/5">
                  <div className="px-3 py-2 text-[11px] font-semibold tracking-wide text-white/60">THEME</div>
                  <div className="p-2 space-y-1">
                    <button
                      className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                        theme === "system" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7 hover:text-white"
                      }`}
                      onClick={() => setTheme("system")}
                      type="button"
                    >
                      <IconMonitor className="h-4 w-4 text-white/80" />
                      System
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                        theme === "light" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7 hover:text-white"
                      }`}
                      onClick={() => setTheme("light")}
                      type="button"
                    >
                      <IconSun className="h-4 w-4 text-white/80" />
                      Light
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                        theme === "dark" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7 hover:text-white"
                      }`}
                      onClick={() => setTheme("dark")}
                      type="button"
                    >
                      <IconMoon className="h-4 w-4 text-white/80" />
                      Dark
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                        theme === "sepia" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7 hover:text-white"
                      }`}
                      onClick={() => setTheme("sepia")}
                      type="button"
                    >
                      <span className="inline-flex h-4 w-4 rounded bg-amber-200/80 ring-1 ring-amber-200/40" aria-hidden="true" />
                      Sepia
                    </button>
                  </div>
                </div>
              </details>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
              aria-label="Settings"
              title="Reading Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <Link
              href="/surah"
              className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition"
            >
              Support Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
