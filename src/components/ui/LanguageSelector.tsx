"use client";

import { useI18n } from "@/lib/i18n/context";
import { LANGUAGE_OPTIONS } from "@/lib/i18n/translations";
import { Check, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSelector({ placement = "down" }: { placement?: "down" | "up" }) {
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
        className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-secondary text-[13px] font-medium hover:brightness-95 dark:hover:brightness-125 transition"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">{currentOption.name}</span>
        <span className="sm:hidden uppercase">{currentOption.code}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`absolute w-48 material-thick border border-border/60 rounded-xl shadow-float p-1 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            placement === "up" ? "left-0 bottom-full mb-2 origin-bottom-left" : "right-0 mt-2 origin-top-right"
          }`}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              role="menuitemradio"
              aria-checked={language === opt.code}
              onClick={() => {
                setLanguage(opt.code);
                setIsOpen(false);
              }}
              className="group w-full flex items-center gap-2 h-8 px-2 rounded-md text-[13px] text-left text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Check className={`w-3.5 h-3.5 ${language === opt.code ? "opacity-100" : "opacity-0"}`} strokeWidth={2.5} />
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
