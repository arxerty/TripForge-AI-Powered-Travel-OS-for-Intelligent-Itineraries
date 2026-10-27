"use client";

import Link from "next/link";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AppIcon } from "@/components/ui/AppIcon";

/** Shared frame for sign-in / sign-up, modelled on Apple Account sheets. */
export function AuthShell({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-16 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5" aria-label="TripForge">
            <AppIcon size={64} className="shadow-float" />
          </Link>
          <h1 className="text-[28px] font-bold">{title}</h1>
          <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {children}

        <p className="text-center text-[15px] text-muted-foreground mt-8">{footer}</p>
      </div>
    </div>
  );
}

/** Alert row used inside auth forms. */
export function AuthNotice({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`grouped px-4 py-3 text-[15px] mb-4 ${tone === "error" ? "text-destructive" : "text-sys-green"}`}>
      {children}
    </div>
  );
}
