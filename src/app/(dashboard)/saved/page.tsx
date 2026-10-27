import { Heart, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getServerT } from "@/lib/i18n/server";

export default async function SavedPage() {
  const t = await getServerT();
  const savedItems = [
    { name: "Udon Shin", location: "Tokyo, Japan", type: "savedRestaurant", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500&q=80" },
    { name: "Banff National Park", location: "Alberta, Canada", type: "savedDestination", image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=500&q=80" },
    { name: "Villa Cimbrone Gardens", location: "Ravello, Italy", type: "savedAttraction", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80" },
    { name: "Omoide Yokocho", location: "Tokyo, Japan", type: "savedAttraction", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80" },
  ];
  const filters = ["savedAll", "savedDestination", "savedRestaurant", "savedAttraction", "savedHotel"];

  return (
    <div className="flex-1 overflow-auto px-5 py-6 md:px-10 md:py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        <header>
          <h1 className="large-title">{t("savedPlaces")}</h1>
          <p className="text-muted-foreground text-[17px] mt-1">{t("savedSubtitle")}</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-tertiary-foreground" />
            <Input placeholder={t("savedSearch")} aria-label={t("savedSearch")} className="pl-10 bg-card shadow-card" />
          </div>
          {/* Segmented filter */}
          <div className="inline-flex p-0.5 rounded-[9px] bg-secondary overflow-x-auto scrollbar-hide" role="tablist">
            {filters.map((f, i) => (
              <span
                key={f}
                role="tab"
                aria-selected={i === 0}
                className={`h-8 px-3.5 inline-flex items-center rounded-[7px] text-[13px] font-semibold whitespace-nowrap ${
                  i === 0 ? "bg-segment shadow-[0_3px_8px_rgb(0_0_0/0.12)]" : "text-muted-foreground"
                }`}
              >
                {t(f)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {savedItems.map((item) => (
            <article key={item.name} className="group overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${item.image})` }} />
                <span className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center">
                  <Heart className="w-4 h-4 text-sys-pink fill-sys-pink" />
                </span>
              </div>
              <div className="p-3.5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{t(item.type)}</p>
                <h3 className="font-semibold text-[15px] leading-tight truncate">{item.name}</h3>
                <p className="text-[13px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 shrink-0" /> {item.location}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
