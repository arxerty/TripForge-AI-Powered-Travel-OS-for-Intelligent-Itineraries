import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerT } from "@/lib/i18n/server";

const planHref = (destination: string) => `/trips/create?destination=${encodeURIComponent(destination)}`;

export default async function ExplorePage() {
  const t = await getServerT();
  const trendingDestinations = [
    { name: "Kyoto, Japan", category: "exploreCulture", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop" },
    { name: "Amalfi, Italy", category: "exploreCoastal", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop" },
    { name: "Banff, Canada", category: "exploreNature", image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=1000&auto=format&fit=crop" },
  ];

  const quickPicks = ["Lisbon", "Istanbul", "Barcelona", "Tbilisi", "Seoul", "New York", "Bali", "Prague"];

  return (
    <div className="flex-1 overflow-auto px-5 py-6 md:px-10 md:py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        <header className="space-y-5">
          <div>
            <h1 className="large-title">{t("explore")}</h1>
            <p className="text-muted-foreground text-[17px] mt-1">{t("exploreSubtitle")}</p>
          </div>

          {/* Search field, iOS style */}
          <form action="/trips/create" className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-tertiary-foreground" />
            <Input
              name="destination"
              required
              minLength={2}
              aria-label={t("exploreSearch")}
              placeholder={t("exploreSearch")}
              className="pl-10 h-11 bg-card shadow-card"
            />
          </form>

          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0 pb-1 scrollbar-hide">
            {quickPicks.map((city) => (
              <Link
                key={city}
                href={planHref(city)}
                className="h-9 px-4 inline-flex items-center rounded-full bg-card shadow-card text-[15px] font-medium whitespace-nowrap hover:bg-secondary transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </header>

        {/* Trending — App Store "Today" cards */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[22px] font-bold">{t("trendingTitle")}</h2>
            <span className="text-[15px] text-muted-foreground hidden sm:inline">{t("trendingSubtitle")}</span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {trendingDestinations.map((dest) => (
              <Link
                href={planHref(dest.name)}
                key={dest.name}
                className="group relative block h-[420px] overflow-hidden rounded-3xl shadow-card transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dest.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
                <div className="absolute top-5 inset-x-5 text-white">
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-white/75">{t(dest.category)}</p>
                  <h3 className="text-[28px] font-bold leading-tight">{dest.name}</h3>
                </div>
                <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-white">
                  <span className="text-[15px] font-medium">{t("planTrip")}</span>
                  <span className="h-8 px-4 inline-flex items-center rounded-full bg-white/25 backdrop-blur-md text-[15px] font-semibold">
                    {t("open")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured template */}
        <section className="relative overflow-hidden rounded-3xl shadow-card bg-card grid md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-primary">{t("featuredTemplate")}</p>
            <h2 className="text-[34px] md:text-[40px] font-bold leading-tight">{t("featuredTitle")}</h2>
            <p className="text-[17px] text-muted-foreground">{t("featuredText")}</p>
            <div className="flex items-center gap-4 mt-2">
              <Link href={planHref("Paris, France")} className={buttonVariants({ size: "lg" })}>
                {t("useTemplate")}
              </Link>
              <Link href="/trips" className="inline-flex items-center text-[17px] text-primary hover:underline">
                {t("myTrips")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[260px]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
        </section>

      </div>
    </div>
  );
}
