"use client";

import { createContext, useContext, useEffect, useState, useCallback, useTransition } from "react";
import type { Surah, SearchResult } from "../types/quran";

interface SearchContextValue {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [quranData, setQuranData] = useState<Surah[] | null>(null);
  const [isSearching, startTransition] = useTransition();

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);

  // Fetch data on first open
  useEffect(() => {
    if (isOpen && !quranData) {
      fetch("/data/quran.json")
        .then((res) => res.json())
        .then((data) => setQuranData(data))
        .catch((err) => console.error("Failed to load search data:", err));
    }
  }, [isOpen, quranData]);

  // Search logic
  useEffect(() => {
    if (!query.trim() || !quranData) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(() => {
        const q = query.toLowerCase().trim();
        const matches: SearchResult[] = [];

        for (const surah of quranData) {
          for (const ayah of surah.verses) {
            const inTranslation = ayah.translation.toLowerCase().includes(q);
            const inArabic = ayah.text.includes(q);

            if (inTranslation || inArabic) {
              matches.push({
                surahId: surah.id,
                surahName: surah.englishName,
                surahArabic: surah.name,
                verseId: ayah.id,
                text: ayah.text,
                translation: ayah.translation,
              });
            }
            if (matches.length >= 50) break; // Limit for performance/UI
          }
          if (matches.length >= 50) break;
        }
        setResults(matches);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, quranData]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleSearch, closeSearch]);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        query,
        results,
        isSearching,
        setQuery,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
}
