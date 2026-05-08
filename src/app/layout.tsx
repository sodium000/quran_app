import type { Metadata } from "next";
import { Amiri, Inter, Lateef, Noto_Naskh_Arabic, Scheherazade_New } from "next/font/google";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SettingsProvider } from "../context/SettingsContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });
const lateef = Lateef({ subsets: ["arabic", "latin"], weight: ["400"], variable: "--font-lateef" });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-noto-naskh-arabic" });
const scheherazadeNew = Scheherazade_New({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-scheherazade-new" });

export const metadata: Metadata = {
  title: "Quran Web Application",
  description: "A beautiful, responsive Quran application with multiple translations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} ${amiri.variable} ${lateef.variable} ${notoNaskhArabic.variable} ${scheherazadeNew.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-emerald-50/50 via-slate-50 to-teal-50/50 text-slate-900 selection:bg-emerald-200">
        <SettingsProvider>
          <Navbar />
          <Sidebar />
          <main className="flex-1 w-full px-3 sm:px-4 lg:px-6 py-6">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}
