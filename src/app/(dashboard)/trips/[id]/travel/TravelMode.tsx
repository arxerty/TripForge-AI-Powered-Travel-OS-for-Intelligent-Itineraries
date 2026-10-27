"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Navigation, Clock, ChevronLeft, ChevronRight, Map as MapIcon, CircleDot } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_ICONS } from "../TripWorkspace";
import { useI18n } from "@/lib/i18n/context";
import { coverGradient, daysUntil, formatDate, formatDuration } from "@/lib/format";
import type { PublicTrip } from "@/lib/trips/types";
import { cn } from "@/lib/utils";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
const toHHMM = (mins: number) => `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

export default function TravelMode({ trip }: { trip: PublicTrip }) {
  const { t, language } = useI18n();
  const [now, setNow] = useState<Date | null>(null);
  const [override, setOverride] = useState<{ day: number; index: number } | null>(null);

  // Clock lives on the client (the traveller's local time); tick every 30s.
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  const days = trip.plan.days;
  const todayStr = now ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}` : null;
  const nowMins = now ? now.getHours() * 60 + now.getMinutes() : 0;

  const live = useMemo(() => {
    if (!todayStr) return null;
    const dayIndex = days.findIndex((d) => d.date === todayStr);
    if (dayIndex === -1) return null;
    const acts = days[dayIndex].activities;
    // Current = last activity that has started; before the first one, show the first.
    let index = 0;
    acts.forEach((a, i) => {
      if (toMinutes(a.recommendedStartTime) <= nowMins) index = i;
    });
    return { day: dayIndex, index };
  }, [days, todayStr, nowMins]);

  const position = override ?? live ?? { day: 0, index: 0 };
  const day = days[position.day];
  const current = day?.activities[position.index];

  if (!day || !current) {
    return <div className="flex-1 flex items-center justify-center p-6 text-muted-foreground">{t("noActivities")}</div>;
  }

  const next = day.activities[position.index + 1] ?? days[position.day + 1]?.activities[0];
  const startMins = toMinutes(current.recommendedStartTime);
  const endMins = startMins + current.durationMinutes;
  const isLive = !override && !!live;
  const remaining = isLive ? endMins - nowMins : null;
  const startsIn = todayStr ? daysUntil(trip.input.startDate, todayStr) : null;
  const Icon = CATEGORY_ICONS[current.category] ?? CircleDot;

  const flat = days.flatMap((d, di) => d.activities.map((_, ai) => ({ day: di, index: ai })));
  const flatPos = flat.findIndex((p) => p.day === position.day && p.index === position.index);
  const step = (delta: number) => {
    const target = flat[flatPos + delta];
    if (target) setOverride(target);
  };

  const dest = `${current.latitude},${current.longitude}`;

  return (
    <div className="flex flex-col min-h-screen bg-background w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-border sm:shadow-2xl relative">

      {/* Header */}
      <div className="relative h-64 shrink-0 overflow-hidden rounded-b-3xl shadow-lg z-10" style={{ background: coverGradient(trip.input.destination) }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        <div className="absolute top-0 inset-x-0 p-5 flex justify-between items-center text-white">
          <Link
            href={`/trips/${trip.id}`}
            aria-label={t("back")}
            className="h-10 w-10 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {isLive ? (
            <Badge className="bg-black/40 backdrop-blur-md text-white border-none gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> {t("live")}
            </Badge>
          ) : (
            <Badge className="bg-black/40 backdrop-blur-md text-white border-none">
              {startsIn !== null && startsIn > 0 ? t("startsInDays", { n: startsIn }) : t("preview")}
            </Badge>
          )}
        </div>

        <div className="absolute bottom-6 inset-x-6 flex flex-col items-start gap-2 text-white">
          <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-md gap-1">
            <Icon /> {t(`cat${current.category}`)}
          </Badge>
          <h1 className="text-3xl font-bold leading-tight text-balance">{current.name}</h1>
          <p className="flex items-center gap-1.5 text-white/80 text-sm">
            <MapPin className="w-4 h-4" /> {day.city} · {t("dayN", { n: position.day + 1 })}, {formatDate(day.date, language)}
          </p>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 px-5 pt-6 pb-10 space-y-7">

        {/* Status & Time */}
        <div className="bg-accent border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold tabular-nums">{current.recommendedStartTime} – {toHHMM(endMins)}</p>
              <p className="text-sm text-primary font-medium">
                {remaining !== null && remaining > 0
                  ? t("minutesRemaining", { n: remaining })
                  : formatDuration(current.durationMinutes, t)}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={() => step(-1)} disabled={flatPos <= 0} aria-label={t("previous")} className="size-9 rounded-full hover:bg-background/60 flex items-center justify-center disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => step(1)} disabled={flatPos >= flat.length - 1} aria-label={t("nextUp")} className="size-9 rounded-full hover:bg-background/60 flex items-center justify-center disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${dest}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", className: "h-16 flex-col gap-1 rounded-2xl" })}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-xs">{t("navigate")}</span>
          </a>
          <a
            href={`https://maps.apple.com/?daddr=${dest}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", className: "h-16 flex-col gap-1 rounded-2xl" })}
          >
            <MapIcon className="w-5 h-5" />
            <span className="text-xs">{t("appleMaps")}</span>
          </a>
        </div>

        {/* Notes */}
        {current.description && (
          <div>
            <h3 className="font-semibold mb-3">{t("aiNotes")}</h3>
            <Card className="bg-card border-border">
              <CardContent className="text-sm text-muted-foreground leading-relaxed">{current.description}</CardContent>
            </Card>
          </div>
        )}

        {/* Next Up */}
        {next && (
          <div>
            <h3 className="font-semibold mb-3 text-muted-foreground">{t("nextUp")} ({next.recommendedStartTime})</h3>
            <button type="button" onClick={() => step(1)} className="w-full text-left">
              <Card className="bg-secondary/50 border-border shadow-none hover:bg-secondary transition-colors">
                <CardContent className="flex items-center gap-4">
                  <NextIcon category={next.category} />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{next.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDuration(next.durationMinutes, t)}</p>
                  </div>
                </CardContent>
              </Card>
            </button>
          </div>
        )}

        {override && live && (
          <button type="button" onClick={() => setOverride(null)} className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}>
            {t("backToNow")}
          </button>
        )}
      </div>
    </div>
  );
}

function NextIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? CircleDot;
  return (
    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border shrink-0">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}
