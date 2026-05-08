import fs from "fs";
import path from "path";
import Link from "next/link";
import ReadingSettingsPanel from "../../../components/ReadingSettingsPanel";
import ReaderLeftPanel from "../../../components/ReaderLeftPanel";
import VerseDisplay from "./VerseDisplay";
import type { Surah } from "../../../types/quran";

export async function generateStaticParams() {
  const paths: { id: string }[] = [];
  for (let i = 1; i <= 114; i += 1) {
    paths.push({ id: i.toString() });
  }
  return paths;
}

function getSurah(id: string) {
  const filePath = path.join(process.cwd(), "public/data/quran.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const surahs = JSON.parse(fileContents) as Surah[];
  return surahs.find((s) => s.id === Number.parseInt(id, 10));
}

function getAllSurahs() {
  const filePath = path.join(process.cwd(), "public/data/quran.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as Surah[];
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surah = getSurah(id);
  const allSurahs = getAllSurahs();

  if (!surah) {
    return <div className="text-center py-20 text-2xl text-emerald-800">Surah not found</div>;
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="grid grid-cols-1 lg:grid-cols-[56px_minmax(240px,20vw)_minmax(0,1fr)] 2xl:grid-cols-[56px_minmax(260px,18vw)_minmax(0,1fr)_minmax(280px,22vw)] gap-3 lg:gap-4">
        <ReaderLeftPanel surahs={allSurahs} currentSurahId={surah.id} />

        <div className="min-w-0 pb-16 sm:pb-24">
          <div className="text-center py-4 border-b border-slate-100 mb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">{surah.englishName}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Ayah-{surah.verses.length}, {surah.type}
            </p>
          </div>

          <div className="xl:hidden mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-900 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Surahs
            </Link>
          </div>

          {surah.id !== 1 && surah.id !== 9 && (
            <div className="text-center py-5 mb-3 border-y border-slate-100">
              <span className="inline-block text-3xl sm:text-4xl font-arabic text-slate-800 leading-relaxed" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          )}

          <VerseDisplay surahId={surah.id} verses={surah.verses} />
        </div>

        <ReadingSettingsPanel />
      </div>
    </div>
  );
}
