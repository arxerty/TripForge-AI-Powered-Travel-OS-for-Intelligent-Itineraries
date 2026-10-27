import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { configuredProvider, generateTripItinerary } from "@/lib/ai/provider";
import { generateDemoTrip } from "@/lib/ai/demo";
import { geocode } from "@/lib/geo/geocode";
import { ensureOwnerId } from "@/lib/trips/owner";
import { saveTrip } from "@/lib/trips/store";
import { TripInputSchema, type StoredTrip, type TripSource } from "@/lib/trips/types";

export async function POST(req: Request) {
  const parsed = TripInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const geo = await geocode(input.destination, input.language);
  if (!geo.ok) {
    return geo.reason === "not_found"
      ? NextResponse.json({ error: "destination_not_found" }, { status: 422 })
      : NextResponse.json({ error: "geocoding_unavailable" }, { status: 503 });
  }
  const { location } = geo;

  const provider = configuredProvider();
  let source: TripSource = "demo";
  let plan = null;
  if (provider) {
    try {
      plan = await generateTripItinerary(input, location, provider);
      source = "ai";
    } catch (error) {
      // Keep the user moving: fall back to the offline planner and say so in the UI.
      console.error("[TRIP_GENERATE_ERROR]", error);
    }
  }
  plan ??= generateDemoTrip(input, location);

  const trip: StoredTrip = {
    id: randomUUID(),
    ownerId: await ensureOwnerId(),
    source,
    createdAt: new Date().toISOString(),
    input,
    location,
    plan,
  };
  await saveTrip(trip);

  return NextResponse.json({ id: trip.id, source });
}
