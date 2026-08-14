import { z } from "zod";

export const ActivitySchema = z.object({
  name: z.string(),
  category: z.enum(["Food", "Attraction", "Transport", "Shopping", "Nightlife", "Nature", "Other"]),
  description: z.string().optional(),
  durationMinutes: z.number().min(15).max(720),
  estimatedCost: z.number().min(0),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  recommendedStartTime: z.string(),
  distanceKm: z.number().optional(), // For walking/transport context
});

export const TripDaySchema = z.object({
  date: z.string(),
  city: z.string(),
  activities: z.array(ActivitySchema),
  estimatedDailyCost: z.number(),
  walkingDistanceKm: z.number(),
  transportTimeMinutes: z.number(),
});

export const BudgetEstimateSchema = z.object({
  totalEstimated: z.number(),
  breakdown: z.object({
    flights: z.number(),
    hotels: z.number(),
    transport: z.number(),
    food: z.number(),
    activities: z.number(),
    shopping: z.number(),
    other: z.number(),
  }),
});

export const GeneratedTripSchema = z.object({
  tripTitle: z.string(),
  summary: z.string(),
  cities: z.array(z.string()),
  days: z.array(TripDaySchema),
  estimatedBudget: BudgetEstimateSchema,
});

export type GeneratedTrip = z.infer<typeof GeneratedTripSchema>;
