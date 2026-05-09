import Image from "next/image";
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
    <div className="flex animate-in fade-in duration-700 ease-out">
      <div className="flex flex-1 min-w-0">
        <div className="w-[300px] xl:w-[320px] hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <ReaderLeftPanel surahs={allSurahs} currentSurahId={surah.id} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="">
            <div className=" py-10 bg-(--app-card-strong)/50 rounded-3xl px-8"> 
               <div className="flex items-center justify-between gap-8">
      
                  <div className="flex flex-col items-center">
                    <Image 
                      src={`/madinah.webp`} 
                      alt={surah.name} 
                      width={180} 
                      height={60} 
                      className=" opacity-100 brightness-200 dark: brightness-400 opacity-100" 
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <h1 className="text-2xl font-black text-(--app-fg) tracking-tight">{surah.englishName}</h1>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-(--app-muted)">{surah.type} • {surah.verses.length} Ayahs</span>
                  </div>

              

                  <div className="flex flex-col items-end min-w-[200px]">
                    {surah.id !== 1 && surah.id !== 9 && (
                      <span className="text-2xl sm:text-3xl font-arabic text-(--app-muted-2) leading-relaxed text-right" dir="rtl">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </span>
                    )}
                  </div>
               </div>
            </div>

       

            <div className=""> 
              <VerseDisplay surahId={surah.id} surahName={surah.englishName} verses={surah.verses} />
            </div>
          </div>
        </div>

        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          <ReadingSettingsPanel variant="sidebar" />
        </div>
      </div>
    </div>
  );
}


