import { notFound } from "next/navigation";
import { getOwnerId } from "@/lib/trips/owner";
import { getTrip } from "@/lib/trips/store";
import { toPublicTrip } from "@/lib/trips/types";
import TravelMode from "./TravelMode";

export default async function TravelModePage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, ownerId] = await Promise.all([params, getOwnerId()]);
  const trip = await getTrip(id, ownerId);
  if (!trip) notFound();

  return <TravelMode trip={toPublicTrip(trip)} />;
}
