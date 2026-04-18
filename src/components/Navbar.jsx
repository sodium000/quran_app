"use client";

import React from 'react';
import Link from 'next/link';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
  const { setIsSidebarOpen } = useSettings();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-emerald-100/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[4.5rem] items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 group">
              <span className="text-emerald-500 transform group-hover:rotate-12 transition-transform duration-300">☪</span> 
              <span className="bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-600 transition-colors">Quran App</span>
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
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all outline-none"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
