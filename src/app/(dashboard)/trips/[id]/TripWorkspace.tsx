"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, Navigation, Calendar, Clock, Footprints, Trash2, Sparkles, FlaskConical, ChevronLeft,
  Utensils, Landmark, TrainFront, ShoppingBag, Martini, Trees, CircleDot,
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, type LucideIcon,
} from "lucide-react";
import MapWrapper from "@/components/map/MapWrapper";
import type { MarkerData } from "@/components/map/TripMap";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetView from "@/components/budget/BudgetView";
import { useI18n } from "@/lib/i18n/context";
import { formatDate, formatDateRange, formatDuration, formatMoney } from "@/lib/format";
import type { PublicTrip } from "@/lib/trips/types";
import type { WeatherCondition, WeatherForecast } from "@/lib/weather/api";
import { cn } from "@/lib/utils";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Food: Utensils, Attraction: Landmark, Transport: TrainFront, Shopping: ShoppingBag,
  Nightlife: Martini, Nature: Trees, Other: CircleDot,
};

/** Apple system colour per activity category (icon tiles, like Maps / Settings). */
export const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-sys-orange", Attraction: "bg-sys-blue", Transport: "bg-sys-teal", Shopping: "bg-sys-purple",
  Nightlife: "bg-sys-indigo", Nature: "bg-sys-green", Other: "bg-sys-gray",
};

const WEATHER_ICONS: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun, cloudy: Cloud, rainy: CloudRain, snow: CloudSnow, storm: CloudLightning,
};

export default function TripWorkspace({ trip, weather }: { trip: PublicTrip; weather: WeatherForecast[] }) {
  const { t, language } = useI18n();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { plan, input } = trip;
  const weatherByDate = useMemo(() => new Map(weather.map((w) => [w.date, w])), [weather]);
  const money = (n: number) => formatMoney(n, input.budgetCurrency, language);

  const markers = useMemo<MarkerData[]>(
    () =>
      plan.days.flatMap((day, d) =>
        selectedDay !== null && selectedDay !== d
          ? []
          : day.activities.map((a, i) => ({
              id: `${d}-${i}`,
              latitude: a.latitude,
              longitude: a.longitude,
              title: a.name,
              category: a.category,
              label: selectedDay === null ? String(d + 1) : String(i + 1),
            }))
      ),
    [plan.days, selectedDay]
  );

  const onMarkerClick = useCallback((id: string) => {
    setFocusId(id);
    document.getElementById(`activity-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleDelete = async () => {
    if (!window.confirm(t("deleteConfirm"))) return;
    setDeleting(true);
    const res = await fetch(`/api/trips/${trip.id}`, { method: "DELETE" });
    if (res.ok || res.status === 404) {
      router.push("/trips");
      router.refresh();
    } else {
      setDeleting(false);
    }
  };

  const visibleDays = plan.days.map((day, d) => ({ day, d })).filter(({ d }) => selectedDay === null || selectedDay === d);

  return (
    <div className="flex-1 flex flex-col md:flex-none md:flex-row md:h-screen md:overflow-hidden">

      {/* Sidebar */}
      <div className="w-full md:w-[440px] lg:w-[500px] md:border-r border-border/60 bg-background flex flex-col md:h-full z-10">
        <Tabs defaultValue="itinerary" className="w-full flex flex-col md:h-full gap-0">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 md:px-6 md:pt-6 material border-b border-border/50 md:sticky top-0 z-20">
            <Link href="/trips" className="inline-flex items-center gap-0.5 text-[15px] text-primary mb-3 -ml-1 hover:opacity-70">
              <ChevronLeft className="w-5 h-5" /> {t("myTrips")}
            </Link>
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="min-w-0">
                {trip.source === "demo" && (
                  <span className="inline-flex items-center gap-1 mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-sys-purple" title={t("demoPlanHint")}>
                    <FlaskConical className="w-3.5 h-3.5" /> {t("demoPlan")}
                  </span>
                )}
                {trip.source === "ai" && (
                  <span className="inline-flex items-center gap-1 mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="w-3.5 h-3.5" /> {t("aiPlan")}
                  </span>
                )}
                <h1 className="text-[28px] font-bold leading-tight tracking-tight mb-1 text-balance">{plan.tripTitle}</h1>
                <p className="text-[15px] text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {formatDateRange(input.startDate, input.endDate, language)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[12px] text-muted-foreground block mb-0.5">{t("totalEst")}</span>
                <span className="text-[22px] font-bold tabular-nums tracking-tight">{money(plan.estimatedBudget.totalEstimated)}</span>
              </div>
            </div>

            <p className="text-[15px] text-muted-foreground mb-4 line-clamp-2">{plan.summary}</p>

            <TabsList className="w-full grid grid-cols-2 mb-3 bg-secondary">
              <TabsTrigger value="itinerary">{t("itinerary")}</TabsTrigger>
              <TabsTrigger value="budget">{t("budgetTab")}</TabsTrigger>
            </TabsList>

            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-hide" role="group" aria-label={t("filterByDay")}>
              <DayChip active={selectedDay === null} onClick={() => setSelectedDay(null)}>{t("allDays")}</DayChip>
              {plan.days.map((day, d) => (
                <DayChip key={day.date} active={selectedDay === d} onClick={() => { setSelectedDay(d); setFocusId(null); }}>
                  {t("dayN", { n: d + 1 })} · {formatDate(day.date, language)}
                </DayChip>
              ))}
            </div>
          </div>

          {/* Mobile map */}
          <div className="md:hidden relative h-64 border-b border-border bg-secondary">
            {isDesktop === false && <MapWrapper markers={markers} focusId={focusId} onMarkerClick={onMarkerClick} />}
          </div>

          <div className="flex-1 md:overflow-y-auto p-5 md:p-6">
            <TabsContent value="itinerary" className="m-0 space-y-10 focus-visible:outline-none">
              {visibleDays.map(({ day, d }) => {
                const w = weatherByDate.get(day.date);
                const WeatherIcon = w ? WEATHER_ICONS[w.condition] : null;
                return (
                  <section key={day.date} aria-labelledby={`day-${d}`}>
                    <div className="flex flex-wrap items-end justify-between gap-2 mb-3 px-1">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {formatDate(day.date, language, { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                        <div className="flex items-center gap-2.5">
                          <h2 id={`day-${d}`} className="text-[22px] font-bold">{t("dayN", { n: d + 1 })}</h2>
                          {w && WeatherIcon && (
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-[13px] font-medium",
                                w.condition === "rainy" || w.condition === "storm" ? "text-sys-blue" : w.condition === "sunny" ? "text-sys-orange" : "text-muted-foreground"
                              )}
                              title={t("rainChance", { p: w.precipitationProbability })}
                            >
                              <WeatherIcon className="w-4 h-4" /> {w.temperatureMax}° <span className="text-muted-foreground">{w.temperatureMin}°</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-muted-foreground pb-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {day.city}</span>
                        <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {t("km", { n: day.walkingDistanceKm })}</span>
                        <span className="tabular-nums">{money(day.estimatedDailyCost)}</span>
                      </div>
                    </div>

                    <ol className="grouped">
                      {day.activities.map((act, i) => {
                        const id = `${d}-${i}`;
                        const Icon = CATEGORY_ICONS[act.category] ?? CircleDot;
                        return (
                          <li key={id} id={`activity-${id}`} className="scroll-mt-40">
                            <button
                              type="button"
                              onClick={() => setFocusId(id)}
                              aria-pressed={focusId === id}
                              className={cn(
                                "grouped-row w-full text-left items-start py-3 transition-colors",
                                focusId === id ? "bg-primary/8 dark:bg-primary/15" : "hover:bg-secondary/60"
                              )}
                            >
                              <span className={cn("size-[34px] rounded-[9px] flex items-center justify-center text-white shrink-0 mt-0.5", CATEGORY_COLORS[act.category] ?? "bg-sys-gray")}>
                                <Icon className="w-[18px] h-[18px]" strokeWidth={2.1} />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="flex justify-between items-baseline gap-3">
                                  <span className="font-semibold text-[15px] leading-snug">{act.name}</span>
                                  <span className="text-[13px] text-muted-foreground tabular-nums shrink-0">{act.recommendedStartTime}</span>
                                </span>
                                {act.description && <span className="block text-[13px] text-muted-foreground mt-0.5 line-clamp-2">{act.description}</span>}
                                <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-tertiary-foreground">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(act.durationMinutes, t)}</span>
                                <span className="tabular-nums">{act.estimatedCost > 0 ? money(act.estimatedCost) : t("free")}</span>
                                {act.distanceKm !== undefined && (
                                  <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {t("km", { n: act.distanceKm })}</span>
                                )}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                );
              })}

              <div className="grouped">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="grouped-row w-full justify-center text-[17px] text-destructive hover:bg-secondary/60 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> {t("deleteTrip")}
                </button>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="m-0 focus-visible:outline-none">
              <BudgetView budgetAmount={input.budgetAmount} currency={input.budgetCurrency} estimate={plan.estimatedBudget} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-secondary relative hidden md:block">
        {isDesktop && <MapWrapper markers={markers} focusId={focusId} onMarkerClick={onMarkerClick} />}

        {/* Floating Travel Mode Button */}
        <div className="absolute bottom-8 right-8">
          <Link
            href={`/trips/${trip.id}/travel`}
            className={buttonVariants({ size: "lg", className: "shadow-float h-12 px-6 font-semibold" })}
          >
            <Navigation className="w-5 h-5" /> {t("travelMode")}
          </Link>
        </div>
      </div>

      {/* Mobile travel mode button */}
      <Link
        href={`/trips/${trip.id}/travel`}
        className={buttonVariants({ size: "lg", className: "md:hidden fixed bottom-[calc(64px+env(safe-area-inset-bottom))] right-4 z-30 shadow-float font-semibold" })}
      >
        <Navigation className="w-4 h-4" /> {t("travelMode")}
      </Link>
    </div>
  );
}

/** null until mounted, so only one map instance is ever created. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function DayChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full h-8 px-3.5 text-[13px] font-medium transition-colors",
        active ? "bg-foreground text-background" : "bg-secondary text-foreground/80 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
