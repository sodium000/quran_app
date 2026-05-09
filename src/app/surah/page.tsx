import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Surah } from "../../types/quran";

export default async function SurahIndexPage() {
  const filePath = path.join(process.cwd(), "public/data/quran.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const surahs: Surah[] = JSON.parse(fileContents);

  return (
    <div className="animate-in fade-in duration-700 ease-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-(--app-fg) mb-4 tracking-tight">The Noble Quran</h1>
          <p className="text-base text-(--app-muted) max-w-2xl mx-auto">
            Read, study, and learn the Quran with a beautiful, modern interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {surahs.map((surah) => (
            <Link
              href={`/surah/${surah.id}`}
              key={surah.id}
              className="group relative bg-(--app-card) rounded-2xl p-6 border border-(--app-border) hover:border-[var(--app-accent)]/50 transition-all duration-300 hover:shadow-premium"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-(--app-surface) text-sm font-bold text-(--app-muted) group-hover:bg-[var(--app-accent)] group-hover:text-white transition-all">
                  {surah.id}
                </div>
                <div className="text-2xl text-(--app-fg) font-arabic" dir="rtl">
                  {surah.name}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-(--app-fg) group-hover:text-[var(--app-accent)] transition-colors">{surah.englishName}</h2>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-(--app-muted) font-bold uppercase tracking-widest">{surah.type}</p>
                  <p className="text-[10px] text-[var(--app-accent)] font-bold uppercase tracking-widest">{surah.verses.length} Verses</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

