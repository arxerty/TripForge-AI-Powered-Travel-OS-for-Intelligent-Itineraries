"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { coverGradient, daysUntil, formatDateRange, formatMoney } from "@/lib/format";
import { tripLengthDays, tripStatus, type PublicTrip } from "@/lib/trips/types";
import { cn } from "@/lib/utils";

export function TripStatusPill({ trip, className }: { trip: PublicTrip; className?: string }) {
  const { t } = useI18n();
  const status = tripStatus(trip);
  const n = daysUntil(trip.input.startDate);
  const label = status === "ongoing" ? t("statusOngoing") : status === "past" ? t("statusPast") : n === 1 ? t("tomorrow") : t("inDays", { n });
  return (
    <span
      className={cn(
        "px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap",
        status === "ongoing" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : status === "past" ? "bg-secondary text-muted-foreground" : "bg-accent text-accent-foreground",
        className
      )}
    >
      {label}
    </span>
  );
}

export function TripCard({ trip }: { trip: PublicTrip }) {
  const { t, language } = useI18n();
  const nDays = tripLengthDays(trip.input.startDate, trip.input.endDate);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="h-28 relative overflow-hidden" style={{ background: coverGradient(trip.input.destination) }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_55%)] transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute bottom-3 left-4 text-white/95 text-2xl font-bold tracking-tight drop-shadow">{trip.location.name}</span>
        <TripStatusPill trip={trip} className="absolute top-3 right-3 bg-black/35 text-white dark:text-white backdrop-blur-md" />
      </div>
      <div className="p-4 space-y-1.5">
        <h3 className="font-semibold leading-tight truncate">{trip.plan.tripTitle}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDateRange(trip.input.startDate, trip.input.endDate, language)}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t("daysCount", { n: nDays })}</span>
          <span className="tabular-nums">{formatMoney(trip.plan.estimatedBudget.totalEstimated, trip.input.budgetCurrency, language)}</span>
        </div>
      </div>
    </Link>
  );
}
