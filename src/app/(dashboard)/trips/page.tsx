import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TripCard } from "@/components/trips/TripCard";
import { EmptyTrips } from "@/components/trips/EmptyTrips";
import { getServerT } from "@/lib/i18n/server";
import { getOwnerId } from "@/lib/trips/owner";
import { listTrips } from "@/lib/trips/store";
import { toPublicTrip, tripStatus } from "@/lib/trips/types";

export default async function TripsPage() {
  const [t, ownerId] = await Promise.all([getServerT(), getOwnerId()]);
  const trips = (await listTrips(ownerId)).map(toPublicTrip);
  const upcoming = trips.filter((trip) => tripStatus(trip) !== "past");
  const past = trips.filter((trip) => tripStatus(trip) === "past").reverse();

  return (
    <div className="flex-1 overflow-auto p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t("myTrips")}</h1>
            <p className="text-muted-foreground text-lg">{t("tripsCount", { n: trips.length })}</p>
          </div>
          <Link href="/trips/create" className={buttonVariants({ size: "lg", className: "rounded-full gap-2 h-11 px-5" })}>
            <Plus className="w-5 h-5" /> {t("createTrip")}
          </Link>
        </header>

        {trips.length === 0 ? (
          <EmptyTrips title={t("noTripsTitle")} text={t("noTripsText")} cta={t("createTrip")} />
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">{t("upcomingTrips")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcoming.map((trip) => <TripCard key={trip.id} trip={trip} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">{t("pastTrips")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {past.map((trip) => <TripCard key={trip.id} trip={trip} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
