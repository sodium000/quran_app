"use client";

import React from 'react';
import { useSettings } from '../context/SettingsContext';

export default function Sidebar() {
  const { 
    isSidebarOpen, setIsSidebarOpen,
    arabicFont, setArabicFont,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize
  } = useSettings();

  if (!isSidebarOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      
      <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white/90 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto border-l border-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-emerald-100/50 relative">
            <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-emerald-400 to-transparent"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">Settings</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-emerald-600 transition-colors bg-white/50 hover:bg-emerald-50 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Arabic Font Family</label>
              <div className="relative">
                <select 
                  value={arabicFont}
                  onChange={(e) => setArabicFont(e.target.value)}
                  className="block w-full rounded-xl border-emerald-100/50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white/80 p-3 text-slate-700 appearance-none transition-shadow hover:shadow-md outline-none border cursor-pointer"
                >
                  <option value="Amiri">Amiri</option>
                  <option value="Scheherazade New">Scheherazade New</option>
                  <option value="Lateef">Lateef</option>
                  <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-emerald-50/50">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Arabic Text Size
                </label>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">{arabicFontSize}px</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="60" 
                step="2"
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-emerald-50/50">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Translation Text Size
                </label>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">{translationFontSize}px</span>
              </div>
              <input 
                type="range" 
                min="12" 
                max="30" 
                step="1"
                value={translationFontSize}
                onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition"
              />
            </div>

            <div className="mt-10 p-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl relative overflow-hidden shadow-inner border border-emerald-100/50">
               <div className="absolute top-0 right-0 -mr-6 -mt-6 text-emerald-500/10 transform rotate-12">
                 <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z"></path>
                 </svg>
               </div>
               <div className="flex items-center space-x-2 mb-4 relative z-10">
                 <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                 <span className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">Live Preview</span>
               </div>
               <div className="relative z-10 space-y-4">
                 <div style={{ fontFamily: arabicFont, fontSize: `${arabicFontSize}px`, textShadow: '0 2px 4px rgba(0,0,0,0.05)' }} className="text-right text-slate-900 leading-relaxed transition-all">
                   بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                 </div>
                 <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                 <div style={{ fontSize: `${translationFontSize}px` }} className="text-left text-slate-600 leading-relaxed transition-all">
                   In the name of Allah, the Entirely Merciful, the Especially Merciful.
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
