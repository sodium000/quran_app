"use client";

import { useSettings } from "../context/SettingsContext";
import { useState } from "react";

interface ReadingSettingsPanelProps {
  variant?: "sidebar" | "slideover";
  onClose?: () => void;
}

export default function ReadingSettingsPanel({ variant = "sidebar", onClose }: ReadingSettingsPanelProps) {
  const { 
    arabicFont, 
    setArabicFont, 
    arabicFontSize, 
    setArabicFontSize, 
    translationFontSize, 
    setTranslationFontSize,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<"translation" | "reading">("translation");
  const [isFontSettingsExpanded, setIsFontSettingsExpanded] = useState(true);

  const containerClasses = variant === "sidebar" 
    ? "hidden 2xl:block w-full sticky top-24" 
    : "w-full h-full bg-(--app-card-strong) flex flex-col shadow-2xl";

  const Content = (
    <div className={`space-y-6 ${variant === "sidebar" ? "" : "p-6"}`}>
      {/* Tabs */}
      <div className="flex rounded-full bg-(--app-surface) p-1 text-sm font-medium">
        <button 
          onClick={() => setActiveTab("translation")}
          className={`flex-1 rounded-full py-2.5 transition-all ${activeTab === "translation" ? "bg-(--app-card-strong) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
        >
          Translation
        </button>
        <button 
          onClick={() => setActiveTab("reading")}
          className={`flex-1 rounded-full py-2.5 transition-all ${activeTab === "reading" ? "bg-(--app-card-strong) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
        >
          Reading
        </button>
      </div>

      <div className="space-y-4">
        {/* Reading Settings Header */}
        <button className="w-full flex items-center justify-between py-2 group">
          <div className="flex items-center gap-3">
             <IconReading className="h-5 w-5 text-(--app-muted)" />
             <span className="text-sm font-bold text-(--app-fg)">Reading Settings</span>
          </div>
          <IconChevronDown className="h-4 w-4 text-(--app-muted-2) group-hover:text-(--app-fg)" />
        </button>

        {/* Font Settings Section */}
        <div className="space-y-4">
          <button 
            onClick={() => setIsFontSettingsExpanded(!isFontSettingsExpanded)}
            className="w-full flex items-center justify-between py-2 group"
          >
            <div className="flex items-center gap-3">
               <IconFont className="h-5 w-5 text-amber-700" />
               <span className="text-sm font-bold text-amber-900">Font Settings</span>
            </div>
            <IconChevronUp className={`h-4 w-4 text-(--app-muted-2) transition-transform ${isFontSettingsExpanded ? "" : "rotate-180"}`} />
          </button>

          {isFontSettingsExpanded && (
            <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Arabic Font Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-(--app-fg)">Arabic Font Size</span>
                  <span className="text-amber-800">{arabicFontSize}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="64"
                  step="1"
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-amber-900/10 accent-amber-800 cursor-pointer"
                />
              </div>

              {/* Translation Font Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-(--app-fg)">Translation Font Size</span>
                  <span className="text-amber-800">{translationFontSize}</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="1"
                  value={translationFontSize}
                  onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-amber-900/10 accent-amber-800 cursor-pointer"
                />
              </div>

              {/* Arabic Font Face */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-(--app-fg)">Arabic Font Face</label>
                <div className="relative">
                   <select 
                     value={arabicFont}
                     onChange={(e) => setArabicFont(e.target.value)}
                     className="w-full appearance-none rounded-xl border border-(--app-border) bg-amber-500/5 p-4 pr-10 text-sm font-semibold text-(--app-fg) outline-none focus:border-amber-500/50"
                   >
                     <option value="var(--font-amiri)">Amiri Quran</option>
                     <option value="var(--font-scheherazade-new)">Scheherazade New</option>
                     <option value="var(--font-lateef)">Lateef</option>
                     <option value="var(--font-noto-naskh-arabic)">Noto Naskh</option>
                   </select>
                   <IconChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-(--app-muted-2) pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Box */}
      <div className="mt-8 rounded-2xl bg-amber-500/10 p-6 border border-amber-500/10">
        <h4 className="text-base font-bold text-(--app-fg)">Help spread the knowledge of Islam</h4>
        <p className="text-xs text-(--app-muted) mt-3 leading-relaxed">
          Your regular support helps us reach our religious brothers and sisters with the message of Islam. 
          Join our mission and be part of the big change.
        </p>
        <button className="mt-6 w-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-bold rounded-xl py-3.5 transition-all shadow-md shadow-amber-900/20">
          Support Us
        </button>
      </div>
    </div>
  );

  if (variant === "sidebar") {
    return (
      <aside className={containerClasses}>
        <div className="bg-(--app-card) rounded-3xl border border-(--app-border) shadow-sm p-6 overflow-hidden">
          {Content}
        </div>
      </aside>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Slideover Header */}
      <div className="flex items-center justify-between p-6 border-b border-(--app-border)">
        <h2 className="text-xl font-bold text-(--app-fg)">Reader Settings</h2>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-(--app-surface) text-(--app-muted)">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Content}
      </div>
    </div>
  );
}

function IconReading({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconFont({ className }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center rounded bg-amber-700/10 font-bold text-[10px]`}>
       T
    </div>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconChevronUp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
