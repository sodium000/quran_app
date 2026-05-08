"use client";

import Link from "next/link";
import { useSettings } from "../context/SettingsContext";

export default function Navbar() {
  const { setIsSidebarOpen } = useSettings();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-emerald-100/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all outline-none"
              aria-label="Open surah list"
              title="Open surah list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 group">
              <span className="text-emerald-500 transform group-hover:rotate-12 transition-transform duration-300">☪</span>
              <span className="bg-linear-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-600 transition-colors">Quran App</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition">Surahs</Link>
              <Link href="/search" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition">Search</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/search" className="md:hidden text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2.5 rounded-xl transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
