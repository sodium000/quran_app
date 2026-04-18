"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [arabicFont, setArabicFont] = useState('Amiri');
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedFont = localStorage.getItem('arabicFont');
    const savedArabicSize = localStorage.getItem('arabicFontSize');
    const savedTranslationSize = localStorage.getItem('translationFontSize');

    if (savedFont) setArabicFont(savedFont);
    if (savedArabicSize) setArabicFontSize(parseInt(savedArabicSize, 10));
    if (savedTranslationSize) setTranslationFontSize(parseInt(savedTranslationSize, 10));
    
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('arabicFont', arabicFont);
      localStorage.setItem('arabicFontSize', arabicFontSize.toString());
      localStorage.setItem('translationFontSize', translationFontSize.toString());
    }
  }, [arabicFont, arabicFontSize, translationFontSize, isMounted]);

  const value = {
    arabicFont, setArabicFont,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize,
    isSidebarOpen, setIsSidebarOpen
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
