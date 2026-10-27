"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Map, Heart, Plus, PlusCircle } from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AppIcon } from "@/components/ui/AppIcon";
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
      {/* Sidebar — macOS style, translucent */}
      <aside
        className={cn(
          "w-[248px] shrink-0 border-r border-sidebar-border/60 bg-sidebar backdrop-blur-2xl backdrop-saturate-150 hidden md:flex flex-col sticky top-0 h-screen",
          immersive && "md:hidden"
        )}
      >
        <div className="h-16 flex items-center px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <AppIcon size={28} />
            <span className="font-semibold text-[17px] tracking-tight">{t("brand")}</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-2 space-y-0.5" aria-label={t("brand")}>
          {NAV.map(({ href, key, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 h-9 rounded-lg text-[14px] transition-colors",
                  active ? "bg-sidebar-accent font-semibold" : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60"
                )}
              >
                <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={active ? 2.4 : 2} /> {t(key)}
              </Link>
            );
          })}

          <Link
            href="/trips/create"
            className="mt-4 flex items-center justify-center gap-1.5 h-9 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> {t("createTrip")}
          </Link>
        </nav>

        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <LanguageSelector placement="up" />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="flex-1 text-[13px] font-medium h-8 inline-flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
              {t("login")}
            </Link>
            <Link href="/register" className="flex-1 text-[13px] font-medium h-8 inline-flex items-center justify-center rounded-full bg-secondary hover:brightness-95 dark:hover:brightness-125 transition">
              {t("register")}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 min-w-0 flex flex-col", !immersive && "pb-[calc(52px+env(safe-area-inset-bottom))] md:pb-0")}>
        {!immersive && (
          <header className="md:hidden h-12 px-4 flex items-center justify-between material border-b border-border/50 sticky top-0 z-30">
            <Link href="/" className="flex items-center gap-2">
              <AppIcon size={24} />
              <span className="font-semibold text-[17px]">{t("brand")}</span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </header>
        )}
        {children}
      </main>

      {/* iOS tab bar */}
      {!immersive && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 material border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 h-[52px]">
            {NAV.slice(0, 2).map(({ href, key, icon }) => (
              <TabItem key={href} href={href} label={t(key)} icon={icon} active={isActive(href)} />
            ))}
            <TabItem href="/trips/create" label={t("newTrip")} icon={PlusCircle} active={pathname === "/trips/create"} />
            {NAV.slice(2).map(({ href, key, icon }) => (
              <TabItem key={href} href={href} label={t(key)} icon={icon} active={isActive(href)} />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

function TabItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Home; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium", active ? "text-primary" : "text-sys-gray")}
    >
      <Icon className="w-6 h-6" strokeWidth={active ? 2.3 : 1.8} />
      <span className="truncate max-w-full px-0.5">{label}</span>
    </Link>
  );
}
