import type { Metadata } from "next";
import { Amiri, Inter, Lateef, Noto_Naskh_Arabic, Scheherazade_New } from "next/font/google";
import Navbar from "../components/Navbar";
import AudioPlayer from "../components/AudioPlayer";
import Sidebar from "../components/Sidebar";
import { AudioProvider } from "../context/AudioContext";
import { SettingsProvider } from "../context/SettingsContext";
import { SearchProvider } from "../context/SearchContext";
import SearchModal from "../components/SearchModal";
import SettingsSlideover from "../components/SettingsSlideover";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });
const lateef = Lateef({ subsets: ["arabic", "latin"], weight: ["400"], variable: "--font-lateef" });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-noto-naskh-arabic" });
const scheherazadeNew = Scheherazade_New({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-scheherazade-new" });

export const metadata: Metadata = {
  title: "Quran Mazid | Read, Listen, Study",
  description: "A beautiful, responsive Quran application with multiple translations and high-quality recitations.",
  manifest: "/manifest.json",
  themeColor: "#4A7C44",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quran Mazid",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} ${amiri.variable} ${lateef.variable} ${notoNaskhArabic.variable} ${scheherazadeNew.variable} h-full antialiased`} data-theme="dark">
      <body className="min-h-full flex bg-(--app-bg) text-(--app-fg) selection:bg-emerald-200/30 selection:text-white">
        <SettingsProvider>
          <SearchProvider>
            <AudioProvider>
  
              <div className="hidden lg:flex w-16 xl:w-[72px] flex-col items-center py-2 border-r border-(--app-border) bg-(--app-card-strong) z-50 sticky top-0 h-screen">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[var(--app-accent)] flex items-center justify-center text-white shadow-lg mb-6 shrink-0">
                  <IconBook className="h-6 w-6" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  <NavIcon href="/surah" active><IconHome /></NavIcon>
                  <NavIcon href="/surah"><IconGrid /></NavIcon>
                  <NavIcon href="/surah"><IconPlay /></NavIcon>
                  <NavIcon href="/surah"><IconBookmark /></NavIcon>
                </div>
                
                {/* Bottom: Settings */}
                <div className="mt-auto shrink-0">
                  <NavIcon href="/surah"><IconSettings /></NavIcon>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-w-0 relative">
                <Navbar />
                <main className="flex-1 pb-20 lg:pb-0">
                  {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-(--app-card-strong)/80 backdrop-blur-xl border-t border-(--app-border) px-6 py-3 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                  <Link href="/surah" className="p-2 text-[var(--app-accent)]">
                    <IconHome className="h-6 w-6" />
                  </Link>
                  <Link href="/surah" className="p-2 text-(--app-muted) hover:text-(--app-fg) transition-colors">
                    <IconGrid className="h-6 w-6" />
                  </Link>
                  <Link href="/surah" className="p-2 text-(--app-muted) hover:text-(--app-fg) transition-colors">
                    <IconPlay className="h-6 w-6" />
                  </Link>
                  <Link href="/surah" className="p-2 text-(--app-muted) hover:text-(--app-fg) transition-colors">
                    <IconBookmark className="h-6 w-6" />
                  </Link>
                </div>
              </div>

              <Sidebar />
              <SearchModal />
              <SettingsSlideover />
              <AudioPlayer />
            </AudioProvider>
          </SearchProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

function NavIcon({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all duration-300 ${
        active 
          ? "bg-[var(--app-accent-soft)] text-[var(--app-accent)]" 
          : "text-(--app-muted) hover:bg-(--app-surface) hover:text-(--app-fg)"
      }`}
    >
      {children}
    </Link>
  );
}

function IconHome({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}

function IconGrid({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
}

function IconPlay({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>;
}

function IconBookmark({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
}

function IconSettings({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

