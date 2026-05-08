export interface Verse {
  id: number;
  text: string;
  translation: string;
  audio?: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  type: string;
  verses: Verse[];
}

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahArabic: string;
  verseId: number;
  text: string;
  translation: string;
}
