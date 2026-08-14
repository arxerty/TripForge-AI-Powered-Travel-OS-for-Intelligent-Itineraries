"use client";

import Link from "next/link";
import { Compass, Home, Map, Heart, User, LogOut, KeyRound } from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useI18n } from "@/lib/i18n/context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" className="flex items-center">
            <Compass className="w-6 h-6 text-primary mr-2" />
            <span className="font-bold text-lg tracking-tight">{t("brand")}</span>
          </Link>
          <LanguageSelector />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground">
            <Home className="w-5 h-5" /> {t("dashboard")}
          </Link>
          <Link href="/trips" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
            <Map className="w-5 h-5" /> {t("myTrips")}
          </Link>
          <Link href="/explore" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
            <Compass className="w-5 h-5" /> {t("explore")}
          </Link>
          <Link href="/saved" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
            <Heart className="w-5 h-5" /> {t("saved")}
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Link href="/login" className="flex-1">
              <button className="w-full text-xs font-medium py-2 px-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-center">
                {t("login")}
              </button>
            </Link>
            <Link href="/register" className="flex-1">
              <button className="w-full text-xs font-medium py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center">
                {t("register")}
              </button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Explorer</p>
              <p className="text-xs text-muted-foreground truncate">View profile</p>
            </div>
            <button className="text-muted-foreground hover:text-destructive transition-colors" title={t("logout")}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
