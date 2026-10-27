import Link from "next/link";
import { Plus, Navigation, Calendar, ArrowRight, Compass, Heart, Map, Wallet, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TripCard, TripStatusPill } from "@/components/trips/TripCard";
import { EmptyTrips } from "@/components/trips/EmptyTrips";
import { configuredProvider } from "@/lib/ai/provider";
import { coverGradient, formatDateRange, formatMoney } from "@/lib/format";
import { getServerLanguage, getServerT } from "@/lib/i18n/server";
import { getOwnerId } from "@/lib/trips/owner";
import { listTrips } from "@/lib/trips/store";
import { toPublicTrip, tripLengthDays, tripStatus } from "@/lib/trips/types";

export default async function DashboardPage() {
  const [t, language, ownerId] = await Promise.all([getServerT(), getServerLanguage(), getOwnerId()]);
  const trips = (await listTrips(ownerId)).map(toPublicTrip);

  // Ongoing trip wins, otherwise the soonest upcoming one.
  const active =
    trips.find((trip) => tripStatus(trip) === "ongoing") ?? trips.find((trip) => tripStatus(trip) === "upcoming");
  const others = trips.filter((trip) => trip !== active).slice(-4).reverse();
  const plannedDays = trips.reduce((sum, trip) => sum + tripLengthDays(trip.input.startDate, trip.input.endDate), 0);
  const aiReady = configuredProvider() !== null;

  return (
    <div className="flex-1 overflow-auto p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Welcome Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t("welcomeBack")}</h1>
            <p className="text-muted-foreground text-lg">{t("whereNext")}</p>
          </div>
          <Link href="/trips/create" className={buttonVariants({ size: "lg", className: "rounded-full gap-2 h-11 px-5" })}>
            <Plus className="w-5 h-5" /> {t("createTrip")}
          </Link>
        </header>

        {!aiReady && (
          <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 text-sm">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{t("demoModeTitle")}</span> {t("demoModeText")}
            </p>
          </div>
        )}

        {trips.length === 0 ? (
          <EmptyTrips title={t("noTripsTitle")} text={t("noTripsText")} cta={t("createTrip")} />
        ) : (
          <>
            {/* Stats */}
            <section className="grid grid-cols-3 gap-3">
              {[
                { icon: Map, label: t("statTrips"), value: String(trips.length) },
                { icon: Calendar, label: t("statDays"), value: String(plannedDays) },
                { icon: Wallet, label: t("statBudget"), value: formatMoney(trips.reduce((s, trip) => s + trip.plan.estimatedBudget.totalEstimated, 0), "EUR", language) },
              ].map(({ icon: Icon, label, value }) => (
                <Card key={label} size="sm" className="bg-card">
                  <CardContent className="flex flex-col gap-1">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xl md:text-2xl font-bold tabular-nums truncate">{value}</span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Active Trip */}
            {active && (
              <section>
                <h2 className="text-xl font-semibold mb-4">{t("activeTrip")}</h2>
                <Card className="border-border bg-card overflow-hidden py-0">
                  <div className="grid md:grid-cols-3">
                    <div className="h-40 md:h-auto relative flex items-end p-5" style={{ background: coverGradient(active.input.destination) }}>
                      <span className="text-white text-3xl font-bold tracking-tight drop-shadow">{active.location.name}</span>
                    </div>
                    <div className="md:col-span-2 p-6 flex flex-col justify-between gap-6">
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-2xl font-bold">{active.plan.tripTitle}</h3>
                          <TripStatusPill trip={active} />
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{active.plan.summary}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDateRange(active.input.startDate, active.input.endDate, language)}</div>
                          <div className="flex items-center gap-1.5"><Navigation className="w-4 h-4" /> {t("activitiesCount", { n: active.plan.days.reduce((s, d) => s + d.activities.length, 0) })}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link href={`/trips/${active.id}/travel`} className={buttonVariants({ variant: "outline", className: "gap-2" })}>
                          <Navigation className="w-4 h-4" /> {t("travelMode")}
                        </Link>
                        <Link href={`/trips/${active.id}`} className={buttonVariants({ className: "gap-2" })}>
                          {t("viewItinerary")} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            )}
          </>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Trips */}
          {others.length > 0 && (
            <section className="lg:col-span-2">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-semibold">{t("recentTrips")}</h2>
                <Link href="/trips" className="text-sm text-muted-foreground hover:text-foreground">{t("viewAll")}</Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {others.map((trip) => <TripCard key={trip.id} trip={trip} />)}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className={others.length > 0 ? "" : "lg:col-span-3"}>
            <h2 className="text-xl font-semibold mb-4">{t("quickActions")}</h2>
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col gap-1">
                {[
                  { href: "/explore", icon: Compass, label: t("exploreDestinations") },
                  { href: "/saved", icon: Heart, label: t("savedPlaces") },
                  { href: "/trips", icon: Map, label: t("myTrips") },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href} className={buttonVariants({ variant: "ghost", className: "w-full justify-start gap-3 h-11" })}>
                    <Icon className="w-5 h-5 text-muted-foreground" /> {label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
