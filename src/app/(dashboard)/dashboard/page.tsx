import Link from "next/link";
import { Plus, Navigation, Calendar, ChevronRight, Compass, Heart, Map, Wallet, Sparkles, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
    <div className="flex-1 overflow-auto px-5 py-6 md:px-10 md:py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {new Intl.DateTimeFormat(language, { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
            </p>
            <h1 className="large-title">{t("welcomeBack")}</h1>
          </div>
          <Link href="/trips/create" className={buttonVariants({ className: "hidden sm:inline-flex" })}>
            <Plus className="w-4 h-4" strokeWidth={2.5} /> {t("createTrip")}
          </Link>
        </header>

        {!aiReady && (
          <div className="grouped p-4 flex items-start gap-3">
            <span className="size-[29px] rounded-[7px] bg-sys-purple text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <p className="text-[13px] text-muted-foreground leading-snug">
              <span className="font-semibold text-foreground">{t("demoModeTitle")}</span> {t("demoModeText")}
            </p>
          </div>
        )}

        {trips.length === 0 ? (
          <EmptyTrips title={t("noTripsTitle")} text={t("noTripsText")} cta={t("createTrip")} />
        ) : (
          <>
            {/* Widgets */}
            <section className="grid grid-cols-3 gap-3">
              {[
                { icon: Map, color: "bg-sys-blue", label: t("statTrips"), value: String(trips.length) },
                { icon: Calendar, color: "bg-sys-red", label: t("statDays"), value: String(plannedDays) },
                { icon: Wallet, color: "bg-sys-green", label: t("statBudget"), value: formatMoney(trips.reduce((s, trip) => s + trip.plan.estimatedBudget.totalEstimated, 0), "EUR", language) },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="grouped p-4 flex flex-col gap-2">
                  <span className={`size-7 rounded-full ${color} text-white flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="text-[22px] md:text-[28px] font-bold tracking-tight tabular-nums leading-none truncate">{value}</span>
                  <span className="text-[12px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </section>

            {/* Up next — hero card */}
            {active && (
              <section>
                <h2 className="text-[22px] font-bold mb-3">{t("activeTrip")}</h2>
                <Link
                  href={`/trips/${active.id}`}
                  className="group block relative overflow-hidden rounded-3xl shadow-card min-h-[260px] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                  style={{ background: coverGradient(active.input.destination) }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.35),transparent_50%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="relative h-full min-h-[260px] p-6 md:p-8 flex flex-col justify-between gap-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/85"><MapPin className="w-3.5 h-3.5" /> {active.location.name}</span>
                      <TripStatusPill trip={active} className="bg-white/25 text-white backdrop-blur-md" />
                    </div>
                    <div>
                      <h3 className="text-[34px] md:text-[44px] font-bold tracking-tight leading-[1.05] mb-2">{active.plan.tripTitle}</h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px] text-white/85">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDateRange(active.input.startDate, active.input.endDate, language)}</span>
                        <span className="flex items-center gap-1.5"><Navigation className="w-4 h-4" /> {t("activitiesCount", { n: active.plan.days.reduce((s, d) => s + d.activities.length, 0) })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex justify-end gap-2 mt-3">
                  <Link href={`/trips/${active.id}/travel`} className={buttonVariants({ variant: "tinted" })}>
                    <Navigation className="w-4 h-4" /> {t("travelMode")}
                  </Link>
                  <Link href={`/trips/${active.id}`} className={buttonVariants()}>
                    {t("viewItinerary")}
                  </Link>
                </div>
              </section>
            )}
          </>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {others.length > 0 && (
            <section className="lg:col-span-2">
              <div className="flex justify-between items-baseline mb-3">
                <h2 className="text-[22px] font-bold">{t("recentTrips")}</h2>
                <Link href="/trips" className="text-[15px] text-primary hover:underline">{t("viewAll")}</Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {others.map((trip) => <TripCard key={trip.id} trip={trip} />)}
              </div>
            </section>
          )}

          {/* Quick Actions — inset grouped list */}
          <section className={others.length > 0 ? "" : "lg:col-span-3 lg:max-w-md"}>
            <h2 className="text-[22px] font-bold mb-3">{t("quickActions")}</h2>
            <div className="grouped">
              {[
                { href: "/trips/create", icon: Plus, color: "bg-sys-blue", label: t("createTrip") },
                { href: "/explore", icon: Compass, color: "bg-sys-orange", label: t("exploreDestinations") },
                { href: "/saved", icon: Heart, color: "bg-sys-pink", label: t("savedPlaces") },
                { href: "/trips", icon: Map, color: "bg-sys-green", label: t("myTrips") },
              ].map(({ href, icon: Icon, color, label }) => (
                <Link key={href} href={href} className="grouped-row hover:bg-secondary/60 transition-colors">
                  <span className={`size-[29px] rounded-[7px] ${color} text-white flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 text-[15px]">{label}</span>
                  <ChevronRight className="w-4 h-4 text-tertiary-foreground" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
