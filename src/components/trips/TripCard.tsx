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
        "px-2.5 h-6 inline-flex items-center text-[12px] font-semibold rounded-full whitespace-nowrap",
        status === "ongoing" ? "bg-sys-green/15 text-sys-green" : status === "past" ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary",
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
      className="group block overflow-hidden rounded-2xl bg-card shadow-card transition-transform duration-300 hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      <div className="h-36 relative overflow-hidden" style={{ background: coverGradient(trip.input.destination) }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.35),transparent_55%)]" />
        <span className="absolute bottom-3 left-4 right-4 text-white text-[28px] leading-tight font-bold tracking-tight drop-shadow-sm truncate">
          {trip.location.name}
        </span>
        <TripStatusPill trip={trip} className="absolute top-3 right-3 bg-white/25 text-white backdrop-blur-md" />
      </div>
      <div className="px-4 py-3.5 space-y-1">
        <h3 className="font-semibold text-[15px] leading-tight truncate">{trip.plan.tripTitle}</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDateRange(trip.input.startDate, trip.input.endDate, language)}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t("daysCount", { n: nDays })}</span>
          <span className="tabular-nums">{formatMoney(trip.plan.estimatedBudget.totalEstimated, trip.input.budgetCurrency, language)}</span>
        </div>
      </div>
    </Link>
  );
}
