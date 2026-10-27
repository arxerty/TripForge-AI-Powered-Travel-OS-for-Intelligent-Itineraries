"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Map, Heart, Plus } from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", key: "dashboard", icon: Home },
  { href: "/trips", key: "myTrips", icon: Map },
  { href: "/explore", key: "explore", icon: Compass },
  { href: "/saved", key: "saved", icon: Heart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/trips" ? pathname === "/trips" || (pathname.startsWith("/trips/") && pathname !== "/trips/create") : pathname.startsWith(href);
  // Travel mode is a full-screen mobile view; it brings its own chrome.
  const immersive = pathname.endsWith("/travel");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn("w-64 shrink-0 border-r border-border bg-sidebar hidden md:flex flex-col sticky top-0 h-screen", immersive && "md:hidden")}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </span>
            <span className="font-bold text-lg tracking-tight">{t("brand")}</span>
          </Link>
        </div>

        <div className="px-4 pt-5">
          <Link
            href="/trips/create"
            className="flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> {t("createTrip")}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1">
          {NAV.map(({ href, key, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" /> {t(key)}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between gap-2">
            <LanguageSelector placement="up" />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="flex-1 text-xs font-medium py-2 px-3 rounded-lg border border-border hover:bg-secondary transition-colors text-center">
              {t("login")}
            </Link>
            <Link href="/register" className="flex-1 text-xs font-medium py-2 px-3 rounded-lg bg-secondary hover:bg-muted transition-colors text-center">
              {t("register")}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 min-w-0 flex flex-col", !immersive && "pb-20 md:pb-0")}>
        {!immersive && (
          <header className="md:hidden h-14 px-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
            <Link href="/" className="flex items-center gap-2">
              <span className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </span>
              <span className="font-bold tracking-tight">{t("brand")}</span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </header>
        )}
        {children}
      </main>

      {/* Mobile bottom navigation */}
      {!immersive && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 h-16">
            {NAV.slice(0, 2).map(({ href, key, icon: Icon }) => (
              <MobileTab key={href} href={href} label={t(key)} icon={Icon} active={isActive(href)} />
            ))}
            <Link href="/trips/create" aria-label={t("createTrip")} className="flex items-center justify-center">
              <span className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5" />
              </span>
            </Link>
            {NAV.slice(2).map(({ href, key, icon: Icon }) => (
              <MobileTab key={href} href={href} label={t(key)} icon={Icon} active={isActive(href)} />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

function MobileTab({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Home; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}
    >
      <Icon className="w-5 h-5" />
      <span className="truncate max-w-full px-1">{label}</span>
    </Link>
  );
}
