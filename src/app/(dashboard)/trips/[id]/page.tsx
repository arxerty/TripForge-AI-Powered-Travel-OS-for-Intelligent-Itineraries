import { notFound } from "next/navigation";
import { getOwnerId } from "@/lib/trips/owner";
import { getTrip } from "@/lib/trips/store";
import { toPublicTrip } from "@/lib/trips/types";
import { getTripWeatherForecast } from "@/lib/weather/api";
import TripWorkspace from "./TripWorkspace";

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, ownerId] = await Promise.all([params, getOwnerId()]);
  const trip = await getTrip(id, ownerId);
  if (!trip) notFound();

  const weather = await getTripWeatherForecast(
    trip.location.latitude,
    trip.location.longitude,
    trip.input.startDate,
    trip.input.endDate
  );

  return <TripWorkspace trip={toPublicTrip(trip)} weather={weather} />;
}
