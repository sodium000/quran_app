import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReadingSettingsPanel from "../../../components/ReadingSettingsPanel";
import ReaderLeftPanel from "../../../components/ReaderLeftPanel";
import { getAllSurahs, getSurahById, getSurahStaticParams, parseSurahId } from "../../../lib/quran-data";
import VerseDisplay from "./VerseDisplay";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  return getSurahStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const surahId = parseSurahId(id);

  if (!surahId) {
    return {
      title: "Surah Not Found | Quran Mazid",
      description: "Requested surah could not be found.",
    };
  }

  const surah = await getSurahById(surahId);
  if (!surah) {
    return {
      title: "Surah Not Found | Quran Mazid",
      description: "Requested surah could not be found.",
    };
  }

  return {
    title: `Surah ${surah.englishName} (${surah.id}) | Quran Mazid`,
    description: `Read Surah ${surah.englishName} (${surah.name}) with translation. ${surah.type} revelation, ${surah.verses.length} ayahs.`,
    alternates: {
      canonical: `/surah/${surah.id}`,
    },
    openGraph: {
      title: `Surah ${surah.englishName} (${surah.id})`,
      description: `${surah.type} revelation • ${surah.verses.length} ayahs`,
      url: `/surah/${surah.id}`,
      type: "article",
    },
  };
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surahId = parseSurahId(id);
  if (!surahId) {
    notFound();
  }

  const [surah, allSurahs] = await Promise.all([getSurahById(surahId), getAllSurahs()]);

  if (!surah) {
    notFound();
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="grid grid-cols-1 lg:grid-cols-[56px_minmax(240px,20vw)_minmax(0,1fr)] 2xl:grid-cols-[56px_minmax(260px,18vw)_minmax(0,1fr)_minmax(280px,22vw)] gap-3 lg:gap-4">
        <ReaderLeftPanel surahs={allSurahs} currentSurahId={surah.id} />

        <div className="min-w-0 pb-16 sm:pb-24">
          <div className="text-center py-4 border-b border-(--app-border) mb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-(--app-fg)">{surah.englishName}</h1>
            <p className="text-sm text-(--app-muted) mt-1">
              Ayah-{surah.verses.length}, {surah.type}
            </p>
          </div>

          <div className="xl:hidden mb-4">
            <Link href="/surah" className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-900 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Surahs
            </Link>
          </div>

          {surah.id !== 1 && surah.id !== 9 && (
            <div className="text-center py-5 mb-3 border-y border-(--app-border)">
              <span className="inline-block text-3xl sm:text-4xl font-arabic text-(--app-fg) leading-relaxed" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          )}

          <VerseDisplay surahId={surah.id} surahName={surah.englishName} verses={surah.verses} />
        </div>

        <ReadingSettingsPanel variant="sidebar" />
      </div>
    </div>
  );
}


