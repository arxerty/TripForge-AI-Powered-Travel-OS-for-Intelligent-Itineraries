import { z } from "zod";
import type { GeneratedTrip } from "@/lib/validation/trip.schema";

export const MAX_TRIP_DAYS = 14;

export const TripInputSchema = z
  .object({
    destination: z.string().trim().min(2).max(120),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    budgetAmount: z.number().min(100).max(100_000),
    budgetCurrency: z.string().length(3).default("EUR"),
    travelStyle: z.object({
      relaxedToAdventure: z.number().min(0).max(100),
      budgetToLuxury: z.number().min(0).max(100),
      natureToCity: z.number().min(0).max(100),
    }),
    interests: z.array(z.string().max(40)).max(20).default([]),
    language: z.string().max(5).default("en"),
  })
  .refine((v) => v.endDate >= v.startDate, { message: "End date must be after start date", path: ["endDate"] })
  .refine((v) => tripLengthDays(v.startDate, v.endDate) <= MAX_TRIP_DAYS, {
    message: `Trips are limited to ${MAX_TRIP_DAYS} days`,
    path: ["endDate"],
  });

export type TripInput = z.infer<typeof TripInputSchema>;

export type TripSource = "ai" | "demo";

export interface StoredTrip {
  id: string;
  ownerId: string;
  source: TripSource;
  createdAt: string;
  input: TripInput;
  location: { name: string; country?: string; latitude: number; longitude: number };
  plan: GeneratedTrip;
}

/** Trip shape that is safe to hand to client components. */
export type PublicTrip = Omit<StoredTrip, "ownerId">;

export function toPublicTrip(trip: StoredTrip): PublicTrip {
  const { ownerId, ...rest } = trip;
  void ownerId;
  return rest;
}

/** Inclusive number of calendar days between two YYYY-MM-DD dates. */
export function tripLengthDays(startDate: string, endDate: string) {
  const ms = Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`);
  return Math.floor(ms / 86_400_000) + 1;
}

/** YYYY-MM-DD for the given offset from a start date. */
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type TripStatus = "upcoming" | "ongoing" | "past";

export function tripStatus(trip: PublicTrip, today = new Date().toISOString().slice(0, 10)): TripStatus {
  if (today < trip.input.startDate) return "upcoming";
  if (today > trip.input.endDate) return "past";
  return "ongoing";
}
