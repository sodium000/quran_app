import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default async function Home() {
  const filePath = path.join(process.cwd(), 'public/data/quran.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const surahs = JSON.parse(fileContents);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="text-center my-8 md:my-16 px-2">
        <div className="inline-block mb-3 md:mb-4 p-2 bg-emerald-50 rounded-full border border-emerald-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600 sm:w-10 sm:h-10">
             <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z"></path>
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-teal-800 mb-4 md:mb-6 font-serif drop-shadow-sm leading-tight pb-2">
          The Noble Quran
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed px-4">
          Read, study, and learn the Quran with a beautiful, modern interface designed for focus and contemplation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 pb-12">
        {surahs.map((surah) => (
          <Link 
            href={`/surah/${surah.id}`} 
            key={surah.id}
            className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] transition-all duration-500 hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transform scale-50 group-hover:scale-110 transition-all duration-700 pointer-events-none text-emerald-900">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z"></path>
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Top Row: Badge & Arabic Name */}
              <div className="flex justify-between items-start mb-6">
                <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center shadow-sm rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                  <span className="relative text-emerald-700 font-extrabold group-hover:text-emerald-900 transition-colors">{surah.id}</span>
                </div>
                
                <div className="flex-1 flex justify-end pl-4">
                  <div className="text-[1.75rem] leading-tight text-emerald-800/90 font-arabic drop-shadow-sm group-hover:text-emerald-600 transition-colors text-right" dir="rtl">
                    {surah.name}
                  </div>
                </div>
              </div>
              
              {/* Bottom Row: English Name & Info */}
              <div className="mt-auto border-t border-emerald-50/50 pt-4">
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {surah.englishName}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                    {surah.type}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium tracking-wide">
                    {surah.verses.length} VERSES
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
