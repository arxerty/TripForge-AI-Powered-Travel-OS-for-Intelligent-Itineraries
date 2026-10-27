import Link from "next/link";
import { Search, MapPin, Star, ArrowRight, Compass } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getServerT } from "@/lib/i18n/server";

const planHref = (destination: string) => `/trips/create?destination=${encodeURIComponent(destination)}`;

export default async function ExplorePage() {
  const t = await getServerT();
  const trendingDestinations = [
    { name: "Kyoto, Japan", category: "exploreCulture", rating: "4.9", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop" },
    { name: "Amalfi, Italy", category: "exploreCoastal", rating: "4.8", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop" },
    { name: "Banff, Canada", category: "exploreNature", rating: "4.9", image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=1000&auto=format&fit=crop" },
  ];

  const quickPicks = ["Lisbon", "Istanbul", "Barcelona", "Tbilisi", "Seoul", "New York", "Bali", "Prague"];

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative h-[380px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-3xl px-6 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("exploreTitle")}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">{t("exploreSubtitle")}</p>

          <form action="/trips/create" className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
            <Input
              name="destination"
              required
              minLength={2}
              aria-label={t("exploreSearch")}
              placeholder={t("exploreSearch")}
              className="pl-12 pr-36 h-14 rounded-full bg-card/80 backdrop-blur-md border-border/50 text-lg shadow-2xl"
            />
            <Button type="submit" className="absolute right-1.5 top-1.5 rounded-full h-11 px-5">
              {t("planTrip")}
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        {/* Quick picks */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickPicks.map((city) => (
            <Link key={city} href={planHref(city)}>
              <Badge variant="outline" className="h-auto px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-accent hover:border-primary/40 transition-colors">
                {city}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Trending Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><Compass className="w-6 h-6 text-primary"/> {t("trendingTitle")}</h2>
            <p className="text-muted-foreground">{t("trendingSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingDestinations.map((dest) => (
              <Link href={planHref(dest.name)} key={dest.name} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Card className="overflow-hidden border-border bg-card group-hover:ring-primary/50 transition-all h-[340px] relative py-0">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${dest.image})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <CardContent className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="flex justify-between items-end">
                      <div>
                        <Badge className="mb-3 backdrop-blur-md bg-white/15 text-white border-none text-xs">{t(dest.category)}</Badge>
                        <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                        <p className="text-sm text-white/75 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {t("planTrip")} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {dest.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Template */}
        <section className="bg-secondary/50 rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <Badge variant="outline" className="text-primary border-primary/20 bg-accent">{t("featuredTemplate")}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">{t("featuredTitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("featuredText")}</p>
            <Link href={planHref("Paris, France")} className={buttonVariants({ size: "lg", className: "rounded-full gap-2 mt-4 h-11 px-5" })}>
              {t("useTemplate")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 w-full relative h-[280px] md:h-[380px] rounded-2xl overflow-hidden border border-border shadow-2xl">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
          </div>
        </section>

      </div>
    </div>
  );
}
