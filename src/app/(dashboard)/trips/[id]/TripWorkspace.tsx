"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, Navigation, Calendar, Clock, Footprints, Trash2, Sparkles, FlaskConical,
  Utensils, Landmark, TrainFront, ShoppingBag, Martini, Trees, CircleDot,
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, type LucideIcon,
} from "lucide-react";
import MapWrapper from "@/components/map/MapWrapper";
import type { MarkerData } from "@/components/map/TripMap";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="w-full md:w-[460px] lg:w-[520px] md:border-r border-border bg-background flex flex-col md:h-full z-10">
        <Tabs defaultValue="itinerary" className="w-full flex flex-col md:h-full gap-0">
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-border bg-card md:sticky top-0 z-20">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="min-w-0">
                {trip.source === "demo" && (
                  <Badge variant="outline" className="mb-2 gap-1 text-muted-foreground" title={t("demoPlanHint")}>
                    <FlaskConical /> {t("demoPlan")}
                  </Badge>
                )}
                {trip.source === "ai" && (
                  <Badge variant="outline" className="mb-2 gap-1 text-primary border-primary/30">
                    <Sparkles /> {t("aiPlan")}
                  </Badge>
                )}
                <h1 className="text-2xl font-bold tracking-tight mb-1 text-balance">{plan.tripTitle}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {formatDateRange(input.startDate, input.endDate, language)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-medium text-muted-foreground block mb-1">{t("totalEst")}</span>
                <span className="text-xl font-bold tabular-nums">{money(plan.estimatedBudget.totalEstimated)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{plan.summary}</p>

            <TabsList className="w-full grid grid-cols-2 mb-4">
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
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <h2 id={`day-${d}`} className="text-lg font-bold">
                          {t("dayN", { n: d + 1 })}
                          <span className="text-muted-foreground font-medium"> · {formatDate(day.date, language, { weekday: "short", day: "numeric", month: "short" })}</span>
                        </h2>
                        {w && WeatherIcon && (
                          <Badge
                            variant="secondary"
                            className={cn("gap-1.5 font-normal", (w.condition === "rainy" || w.condition === "storm") && "text-sky-600 dark:text-sky-400")}
                            title={t("rainChance", { p: w.precipitationProbability })}
                          >
                            <WeatherIcon /> {w.temperatureMax}° / {w.temperatureMin}°
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {day.city}</span>
                        <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {t("km", { n: day.walkingDistanceKm })}</span>
                        <span className="tabular-nums">{money(day.estimatedDailyCost)}</span>
                      </div>
                    </div>

                    <ol className="relative space-y-3 before:absolute before:left-[4.1rem] before:top-2 before:bottom-2 before:w-px before:bg-border">
                      {day.activities.map((act, i) => {
                        const id = `${d}-${i}`;
                        const Icon = CATEGORY_ICONS[act.category] ?? CircleDot;
                        return (
                          <li key={id} id={`activity-${id}`} className="flex gap-3 items-start scroll-mt-24">
                            <div className="w-12 pt-3.5 text-xs font-bold text-muted-foreground text-right tabular-nums shrink-0">{act.recommendedStartTime}</div>
                            <div className={cn("relative z-10 mt-3 size-4 rounded-full border-2 bg-background shrink-0", focusId === id ? "border-primary bg-primary" : "border-border")} />
                            <button
                              type="button"
                              onClick={() => setFocusId(id)}
                              className={cn(
                                "flex-1 min-w-0 text-left bg-card border p-4 rounded-xl transition-colors shadow-sm",
                                focusId === id ? "border-primary/70 ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                              )}
                            >
                              <div className="flex justify-between items-start gap-3 mb-1.5">
                                <h3 className="font-semibold text-sm leading-tight">{act.name}</h3>
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1 shrink-0">
                                  <Icon /> {t(`cat${act.category}`)}
                                </Badge>
                              </div>
                              {act.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{act.description}</p>}
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(act.durationMinutes, t)}</span>
                                <span className="tabular-nums">{act.estimatedCost > 0 ? money(act.estimatedCost) : t("free")}</span>
                                {act.distanceKm !== undefined && (
                                  <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {t("km", { n: act.distanceKm })}</span>
                                )}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                );
              })}

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={buttonVariants({ variant: "destructive", size: "sm", className: "gap-1.5" })}
                >
                  <Trash2 /> {t("deleteTrip")}
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
            className={buttonVariants({ size: "lg", className: "rounded-full shadow-2xl h-14 px-8 text-base font-semibold gap-2" })}
          >
            <Navigation className="w-5 h-5" /> {t("travelMode")}
          </Link>
        </div>
      </div>

      {/* Mobile travel mode button */}
      <Link
        href={`/trips/${trip.id}/travel`}
        className={buttonVariants({ size: "lg", className: "md:hidden fixed bottom-20 right-4 z-30 rounded-full shadow-2xl h-12 px-5 gap-2" })}
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
        "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}
