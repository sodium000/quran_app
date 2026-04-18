import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import VerseDisplay from './VerseDisplay';

export async function generateStaticParams() {
  const paths = [];
  for (let i = 1; i <= 114; i++) {
    paths.push({ id: i.toString() });
  }
  return paths;
}

function getSurah(id) {
  const filePath = path.join(process.cwd(), 'public/data/quran.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const surahs = JSON.parse(fileContents);
  return surahs.find(s => s.id === parseInt(id, 10));
}

export default async function SurahPage({ params }) {
  const { id } = await params;
  const surah = getSurah(id);

  if (!surah) {
    return <div className="text-center py-20 text-2xl text-emerald-800">Surah not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 sm:pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <Link href="/" className="group inline-flex items-center text-emerald-700 hover:text-emerald-900 mb-6 sm:mb-8 transition-all font-medium py-2 px-4 rounded-full bg-white/50 hover:bg-white/90 shadow-sm backdrop-blur-sm border border-emerald-100/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Surahs
      </Link>

      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-10 md:p-16 text-center shadow-2xl shadow-emerald-900/20 mb-10 sm:mb-14 border border-emerald-800/50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-emerald-500/10 blur-2xl transform rotate-12 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z"></path>
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 sm:w-16 h-1 mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80"></div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4 sm:mb-6 font-arabic drop-shadow-lg tracking-wider leading-relaxed" dir="rtl">
            {surah.name}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-light text-emerald-100 mb-3 sm:mb-4 tracking-wide">{surah.englishName}</h2>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-1 sm:mt-2">
            <span className="w-6 sm:w-10 h-px bg-emerald-500/50"></span>
            <p className="text-amber-200/90 uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm">
              {surah.type} • {surah.verses.length} Verses
            </p>
            <span className="w-6 sm:w-10 h-px bg-emerald-500/50"></span>
          </div>
        </div>
      </div>
      
      {surah.id !== 1 && surah.id !== 9 && (
        <div className="text-center py-8 sm:py-12 mb-6 sm:mb-8 relative px-4">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-50"></div>
          <span className="relative z-10 inline-block bg-slate-50 px-4 sm:px-8 text-3xl sm:text-4xl md:text-5xl font-arabic text-emerald-900 drop-shadow-sm leading-relaxed" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>
      )}

      <div className="mt-2 sm:mt-4">
        <VerseDisplay surahId={surah.id} verses={surah.verses} />
      </div>
    </div>
  );
}
