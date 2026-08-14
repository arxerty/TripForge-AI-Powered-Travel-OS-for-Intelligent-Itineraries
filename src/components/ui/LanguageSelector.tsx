"use client";

import { useI18n } from "@/lib/i18n/context";
import { LANGUAGE_OPTIONS, Language } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border text-sm font-medium hover:bg-secondary transition-colors"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span>{currentOption.flag}</span>
        <span className="hidden sm:inline">{currentOption.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-secondary/80 transition-colors ${
                language === opt.code ? "bg-primary/10 text-primary font-bold" : "text-foreground"
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
