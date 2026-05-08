"use client";

import { useSettings } from "../context/SettingsContext";

export default function ReadingSettingsPanel() {
  const { arabicFont, setArabicFont, arabicFontSize, setArabicFontSize, translationFontSize, setTranslationFontSize } = useSettings();

  return (
    <aside className="hidden 2xl:block w-full shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
            <button className="flex-1 rounded-lg bg-white text-slate-800 py-1.5 shadow-sm">Translation</button>
            <button className="flex-1 rounded-lg text-slate-500 py-1.5">Reading</button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Reading Settings</h3>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-700">Font Settings</h3>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700">Arabic Font Size</span>
                <span className="text-slate-500">{arabicFontSize}</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="2"
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700">Translation Font Size</span>
                <span className="text-slate-500">{translationFontSize}</span>
              </div>
              <input
                type="range"
                min="12"
                max="30"
                step="1"
                value={translationFontSize}
                onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="text-sm text-slate-700">Arabic Font Face</label>
              <select value={arabicFont} onChange={(e) => setArabicFont(e.target.value)} className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-700">
                <option value="var(--font-amiri)">Amiri</option>
                <option value="var(--font-scheherazade-new)">Scheherazade New</option>
                <option value="var(--font-lateef)">Lateef</option>
                <option value="var(--font-noto-naskh-arabic)">Noto Naskh Arabic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4">
          <h4 className="text-sm font-semibold text-emerald-900">Help spread the knowledge of Islam</h4>
          <p className="text-xs text-emerald-800/80 mt-2">Your regular support helps us reach more brothers and sisters with the message of Islam.</p>
          <button className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg py-2">Support Us</button>
        </div>
      </div>
    </aside>
  );
}
