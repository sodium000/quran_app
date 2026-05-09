export type Translation = string;

export interface Ayah {
  id: number;
  text: string;
  translation: Translation;
  audio?: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  type: string;
  verses: Ayah[];
}

// Backward-compatible alias while components migrate to Ayah.
export type Verse = Ayah;

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahArabic: string;
  verseId: number;
  text: string;
  translation: string;
}
