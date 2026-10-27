"use client";

import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useI18n();

  // The theme lives on <html> (set server-side from the cookie), so the icon is
  // switched with CSS and the button needs no state of its own.
  const toggle = () => {
    const root = document.documentElement;
    const current: Theme = root.classList.contains("light") ? "light" : "dark";
    const next: Theme = current === "dark" ? "light" : "dark";
    root.classList.replace(current, next);
    root.style.colorScheme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-full border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
        className
      )}
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}
