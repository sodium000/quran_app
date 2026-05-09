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
  theme: ThemeMode;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
}

export type ThemeMode = "system" | "light" | "dark" | "sepia";

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

function normalizeTheme(value: string | null): ThemeMode {
  if (value === "light" || value === "dark" || value === "sepia" || value === "system") {
    return value;
  }
  return "system";
}

function applyThemeToDom(theme: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  const resolved = theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved === "dark" ? "dark" : "light";
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // IMPORTANT: keep initial render identical on server + client to avoid hydration mismatches.
  const [arabicFont, setArabicFont] = useState("var(--font-amiri)");
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    // Load persisted settings after mount (client-only).
    const storedArabicFont = normalizeArabicFont(localStorage.getItem("arabicFont"));
    const storedArabicFontSize = Number.parseInt(localStorage.getItem("arabicFontSize") ?? "", 10);
    const storedTranslationFontSize = Number.parseInt(localStorage.getItem("translationFontSize") ?? "", 10);
    const storedTheme = normalizeTheme(localStorage.getItem("theme"));

    setArabicFont(storedArabicFont);
    setArabicFontSize(Number.isFinite(storedArabicFontSize) ? storedArabicFontSize : 24);
    setTranslationFontSize(Number.isFinite(storedTranslationFontSize) ? storedTranslationFontSize : 16);
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("arabicFont", arabicFont);
      localStorage.setItem("arabicFontSize", arabicFontSize.toString());
      localStorage.setItem("translationFontSize", translationFontSize.toString());
      localStorage.setItem("theme", theme);
    }
  }, [arabicFont, arabicFontSize, translationFontSize, theme]);

  useEffect(() => {
    applyThemeToDom(theme);
    if (theme !== "system") {
      return;
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    if (!mql) {
      return;
    }

    const listener = () => applyThemeToDom("system");
    if ("addEventListener" in mql) {
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    }
    return;
  }, [theme]);

  const value: SettingsContextValue = {
    arabicFont,
    setArabicFont,
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    isSidebarOpen,
    setIsSidebarOpen,
    theme,
    setTheme,
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
