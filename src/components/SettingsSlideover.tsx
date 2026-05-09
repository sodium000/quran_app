"use client";

import { useSettings } from "../context/SettingsContext";
import ReadingSettingsPanel from "./ReadingSettingsPanel";
import { useEffect } from "react";

export default function SettingsSlideover() {
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();

  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md h-full overflow-hidden animate-in slide-in-from-right duration-500 ease-out">
         <ReadingSettingsPanel 
           variant="slideover" 
           onClose={() => setIsSettingsOpen(false)} 
         />
      </div>
    </div>
  );
}
