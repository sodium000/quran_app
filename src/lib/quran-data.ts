import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { Surah } from "../types/quran";

const QURAN_JSON_PATH = path.join(process.cwd(), "public/data/quran.json");
export const TOTAL_SURAH_COUNT = 114;

const readQuranData = cache(async (): Promise<Surah[]> => {
  const file = await fs.readFile(QURAN_JSON_PATH, "utf8");
  return JSON.parse(file) as Surah[];
});

export async function getAllSurahs(): Promise<Surah[]> {
  return readQuranData();
}

export async function getSurahById(id: number): Promise<Surah | undefined> {
  const surahs = await readQuranData();
  return surahs.find((surah) => surah.id === id);
}

export async function getSurahStaticParams(): Promise<Array<{ id: string }>> {
  const surahs = await readQuranData();
  return surahs.map((surah) => ({ id: String(surah.id) }));
}

export function parseSurahId(param: string): number | null {
  const id = Number.parseInt(param, 10);
  if (!Number.isFinite(id) || id < 1 || id > TOTAL_SURAH_COUNT) {
    return null;
  }
  return id;
}

