import Link from "next/link";
import { ChevronRight, Map, Wallet, CloudSun, Navigation, Languages, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/AppIcon";
import { getServerT } from "@/lib/i18n/server";

export default async function LandingPage() {
  const t = await getServerT();

  const features = [
    { icon: Sparkles, color: "bg-sys-purple", title: t("featAiTitle"), text: t("featAiText"), wide: true },
    { icon: Map, color: "bg-sys-blue", title: t("featMapTitle"), text: t("featMapText") },
    { icon: Wallet, color: "bg-sys-green", title: t("featBudgetTitle"), text: t("featBudgetText") },
    { icon: CloudSun, color: "bg-sys-orange", title: t("featWeatherTitle"), text: t("featWeatherText") },
    { icon: Navigation, color: "bg-sys-red", title: t("featTravelTitle"), text: t("featTravelText") },
    { icon: Languages, color: "bg-sys-indigo", title: t("featLangTitle"), text: t("featLangText"), wide: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Global nav — thin, translucent */}
      <header className="fixed top-0 inset-x-0 z-50 material border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AppIcon size={22} />
            <span className="font-semibold text-[15px]">TripForge</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-[12px] text-foreground/80">
            <Link href="#features" className="hover:text-foreground transition-colors">{t("navFeatures")}</Link>
            <Link href="/explore" className="hover:text-foreground transition-colors">{t("explore")}</Link>
            <Link href="/trips" className="hover:text-foreground transition-colors">{t("myTrips")}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[12px] text-foreground/80 hover:text-foreground">{t("login")}</Link>
            <Link href="/trips/create" className={buttonVariants({ size: "xs", className: "px-3" })}>{t("startPlanning")}</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-44 md:pb-24 px-5 text-center">
          <div className="max-w-3xl mx-auto">
            <AppIcon size={72} className="mb-6 shadow-float" />
            <h1 className="text-[48px] md:text-[80px] font-bold leading-[1.02] tracking-[-0.04em] mb-5">
              {t("heroTitle1")}
              <br />
              <span className="bg-gradient-to-r from-[#0071e3] via-[#7d4bdb] to-[#e0457b] bg-clip-text text-transparent">{t("heroTitle2")}</span>
            </h1>
            <p className="text-[19px] md:text-[24px] leading-snug text-muted-foreground mb-9 max-w-2xl mx-auto">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/trips/create" className={buttonVariants({ size: "lg", className: "h-12 px-7 text-[17px]" })}>
                {t("createTrip")}
              </Link>
              <Link href="/explore" className="inline-flex items-center text-[17px] text-primary hover:underline">
                {t("exploreDestinations")} <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Product shot */}
        <section className="px-5">
          <div className="max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-[28px] overflow-hidden relative shadow-float">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 flex flex-wrap gap-2">
              {[t("heroChip1"), t("heroChip2"), t("heroChip3")].map((chip) => (
                <span key={chip} className="h-9 px-4 inline-flex items-center rounded-full bg-white/25 backdrop-blur-xl text-white text-[15px] font-medium">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section id="features" className="py-24 md:py-32 px-5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[40px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.035em] text-center mb-4">{t("featuresTitle")}</h2>
            <p className="text-[19px] text-muted-foreground text-center max-w-2xl mx-auto mb-14">{t("featuresSubtitle")}</p>

            <div className="grid md:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, color, title, text, wide }) => (
                <div key={title} className={`rounded-[28px] bg-card shadow-card p-8 flex flex-col gap-4 ${wide ? "md:col-span-2" : ""}`}>
                  <span className={`size-12 rounded-[13px] ${color} text-white flex items-center justify-center`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </span>
                  <h3 className="text-[24px] font-bold leading-tight">{title}</h3>
                  <p className="text-[17px] text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-28 px-5 text-center">
          <h2 className="text-[40px] md:text-[56px] font-bold tracking-[-0.035em] mb-6">{t("ctaTitle")}</h2>
          <Link href="/trips/create" className={buttonVariants({ size: "lg", className: "h-12 px-7 text-[17px]" })}>
            {t("startPlanning")}
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-secondary/40">
        <div className="max-w-5xl mx-auto px-5 py-5 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-muted-foreground">
          <span>© {new Date().getFullYear()} TripForge</span>
          <div className="flex gap-4">
            <Link href="/explore" className="hover:text-foreground">{t("explore")}</Link>
            <Link href="/dashboard" className="hover:text-foreground">{t("dashboard")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
