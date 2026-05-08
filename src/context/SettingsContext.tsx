"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextValue {
  arabicFont: string;
  setArabicFont: React.Dispatch<React.SetStateAction<string>>;
  arabicFontSize: number;
  setArabicFontSize: React.Dispatch<React.SetStateAction<number>>;
  translationFontSize: number;
  setTranslationFontSize: React.Dispatch<React.SetStateAction<number>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ARABIC_FONT_OPTIONS = [
  "var(--font-amiri)",
  "var(--font-scheherazade-new)",
  "var(--font-lateef)",
  "var(--font-noto-naskh-arabic)",
] as const;

const LEGACY_FONT_MAP: Record<string, (typeof ARABIC_FONT_OPTIONS)[number]> = {
  Amiri: "var(--font-amiri)",
  "Scheherazade New": "var(--font-scheherazade-new)",
  Lateef: "var(--font-lateef)",
  "Noto Naskh Arabic": "var(--font-noto-naskh-arabic)",
};

function normalizeArabicFont(value: string | null) {
  if (!value) {
    return "var(--font-amiri)";
  }
  if (value in LEGACY_FONT_MAP) {
    return LEGACY_FONT_MAP[value];
  }
  if ((ARABIC_FONT_OPTIONS as readonly string[]).includes(value)) {
    return value;
  }
  return "var(--font-amiri)";
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [arabicFont, setArabicFont] = useState(() => {
    if (typeof window === "undefined") {
      return "var(--font-amiri)";
    }
    return normalizeArabicFont(localStorage.getItem("arabicFont"));
  });
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    if (typeof window === "undefined") {
      return 24;
    }
    const saved = localStorage.getItem("arabicFontSize");
    return saved ? Number.parseInt(saved, 10) : 24;
  });
  const [translationFontSize, setTranslationFontSize] = useState(() => {
    if (typeof window === "undefined") {
      return 16;
    }
    const saved = localStorage.getItem("translationFontSize");
    return saved ? Number.parseInt(saved, 10) : 16;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("arabicFont", arabicFont);
      localStorage.setItem("arabicFontSize", arabicFontSize.toString());
      localStorage.setItem("translationFontSize", translationFontSize.toString());
    }
  }, [arabicFont, arabicFontSize, translationFontSize]);

  const value: SettingsContextValue = {
    arabicFont,
    setArabicFont,
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    isSidebarOpen,
    setIsSidebarOpen,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
