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
    ? "hidden xl:block w-[350px] shrink-0 border-l border-(--app-border) bg-(--app-bg) h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin" 
    : "w-full h-full bg-(--app-card-strong) flex flex-col shadow-2xl";

  const Content = (
    <div className={`space-y-8 ${variant === "sidebar" ? "p-6" : "p-6"}`}>
      {/* Tabs */}
      <div className="flex rounded-xl bg-(--app-surface) p-1 text-[11px] font-bold uppercase tracking-wider">
        <button 
          onClick={() => setActiveTab("translation")}
          className={`flex-1 rounded-lg py-2.5 transition-all ${activeTab === "translation" ? "bg-(--app-card) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
        >
          Translation
        </button>
        <button 
          onClick={() => setActiveTab("reading")}
          className={`flex-1 rounded-lg py-2.5 transition-all ${activeTab === "reading" ? "bg-(--app-card) text-(--app-fg) shadow-sm" : "text-(--app-muted)"}`}
        >
          Reading
        </button>
      </div>

      <div className="space-y-6">
        {/* Reading Settings Header */}
        <button className="w-full flex items-center justify-between py-1 group">
          <div className="flex items-center gap-3">
             <IconReading className="h-4.5 w-4.5 text-(--app-muted)" />
             <span className="text-sm font-bold text-(--app-fg)">Reading Settings</span>
          </div>
          <IconChevronDown className="h-4 w-4 text-(--app-muted-2)" />
        </button>

        {/* Font Settings Section */}
        <div className="space-y-4 pt-2 border-t border-(--app-border)">
          <button 
            onClick={() => setIsFontSettingsExpanded(!isFontSettingsExpanded)}
            className="w-full flex items-center justify-between py-1 group"
          >
            <div className="flex items-center gap-3">
               <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent)] font-bold text-xs">T</div>
               <span className="text-sm font-bold text-(--app-fg)">Font Settings</span>
            </div>
            <IconChevronUp className={`h-4 w-4 text-(--app-muted-2) transition-transform ${isFontSettingsExpanded ? "" : "rotate-180"}`} />
          </button>

          {isFontSettingsExpanded && (
            <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Arabic Font Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-(--app-muted) uppercase tracking-wider">Arabic Font Size</span>
                  <span className="text-sm font-black text-[var(--app-accent)]">{arabicFontSize}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="64"
                  step="1"
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-(--app-surface-2) accent-[var(--app-accent)] cursor-pointer"
                />
              </div>

              {/* Translation Font Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-(--app-muted) uppercase tracking-wider">Translation Font Size</span>
                  <span className="text-sm font-black text-[var(--app-accent)]">{translationFontSize}</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="1"
                  value={translationFontSize}
                  onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-(--app-surface-2) accent-[var(--app-accent)] cursor-pointer"
                />
              </div>

              {/* Arabic Font Face */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-(--app-muted) uppercase tracking-wider">Arabic Font Face</label>
                <div className="relative">
                   <select 
                     value={arabicFont}
                     onChange={(e) => setArabicFont(e.target.value)}
                     className="w-full appearance-none rounded-xl border border-(--app-border) bg-(--app-surface) p-3 pr-10 text-sm font-semibold text-(--app-fg) outline-none focus:border-[var(--app-accent)]"
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
      <div className="mt-8 rounded-2xl bg-[var(--app-accent-soft)] p-6 border border-[var(--app-accent)]/10">
        <h4 className="text-sm font-bold text-(--app-fg)">Help spread the knowledge of Islam</h4>
        <p className="text-[11px] text-(--app-muted) mt-3 leading-relaxed">
          Your regular support helps us reach our religious brothers and sisters with the message of Islam. 
          Join our mission and be part of the big change.
        </p>
        <button className="mt-6 w-full bg-[var(--app-accent)] hover:opacity-90 text-white text-xs font-bold rounded-xl py-3.5 transition-all shadow-md shadow-emerald-900/20">
          Support Us
        </button>
      </div>
    </div>
  );

  if (variant === "sidebar") {
    return (
      <aside className={containerClasses}>
        {Content}
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
