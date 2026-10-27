"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Calendar as CalendarIcon, Wallet, Activity, Heart, Sparkles, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { addDays, MAX_TRIP_DAYS, tripLengthDays } from "@/lib/trips/types";
import { formatDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";

const steps = [
  { id: "destination", title: "stepDestination", icon: MapPin },
  { id: "dates", title: "stepDates", icon: CalendarIcon },
  { id: "budget", title: "stepBudget", icon: Wallet },
  { id: "style", title: "stepStyle", icon: Activity },
  { id: "interests", title: "stepInterests", icon: Heart },
  { id: "generate", title: "stepGenerate", icon: Sparkles },
];

const INTERESTS = ["Food", "Nature", "Architecture", "History", "Art", "Nightlife", "Shopping", "Photography", "Anime", "Technology", "Beaches", "Sports"];
const PROGRESS = ["genUnderstanding", "genItinerary", "genRoutes", "genBudget"];

const today = () => new Date().toISOString().slice(0, 10);
const sliderValue = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number));

export default function CreateTripWizard({ initialDestination }: { initialDestination: string }) {
  const { t, language } = useI18n();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState(() => addDays(today(), 14));
  const [endDate, setEndDate] = useState(() => addDays(today(), 18));
  const [budget, setBudget] = useState(2500);
  const [style, setStyle] = useState({ relaxedToAdventure: 50, budgetToLuxury: 50, natureToCity: 50 });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const days = startDate && endDate ? tripLengthDays(startDate, endDate) : 0;
  const datesError =
    !startDate || !endDate ? t("errDatesRequired")
    : days < 1 ? t("errDatesOrder")
    : days > MAX_TRIP_DAYS ? t("errDatesTooLong", { max: MAX_TRIP_DAYS })
    : null;

  const canContinue =
    (currentStep !== 0 || destination.trim().length >= 2) &&
    (currentStep !== 1 || !datesError);

  // Walk through the progress checklist while the request is in flight.
  useEffect(() => {
    if (!isGenerating) return;
    const timer = setInterval(() => setProgress((p) => Math.min(p + 1, PROGRESS.length - 1)), 1800);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleNext = () => {
    if (!canContinue) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      void handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleGenerate = async () => {
    setError(null);
    setProgress(0);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          startDate,
          endDate,
          budgetAmount: budget,
          budgetCurrency: "EUR",
          travelStyle: style,
          interests: selectedInterests,
          language,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const placeError = data.error === "destination_not_found" || data.error === "geocoding_unavailable";
        setError(
          data.error === "destination_not_found" ? t("errDestinationNotFound")
          : data.error === "geocoding_unavailable" ? t("errGeocodingUnavailable")
          : t("errGenerate")
        );
        setCurrentStep(placeError ? 0 : steps.length - 1);
        setIsGenerating(false);
        return;
      }
      router.push(`/trips/${data.id}`);
    } catch {
      setError(t("errGenerate"));
      setIsGenerating(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest]
    );
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" aria-live="polite">
        <div className="size-20 rounded-2xl bg-accent flex items-center justify-center mb-8">
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold mb-6">{t("genTitle")}</h2>
        <div className="space-y-3 text-muted-foreground text-lg max-w-sm w-full text-left mx-auto">
          {PROGRESS.map((key, i) => (
            <p key={key} className={cn("flex items-center gap-3 transition-opacity", i > progress && "opacity-40", i === progress && "text-foreground")}>
              <span
                className={cn(
                  "size-6 rounded-full flex items-center justify-center text-xs shrink-0",
                  i < progress ? "bg-primary text-primary-foreground" : i === progress ? "border-2 border-primary animate-pulse" : "border border-border"
                )}
              >
                {i < progress && <Check className="w-3.5 h-3.5" />}
              </span>
              {t(key)}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="flex-1 flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-3xl">

        {/* Progress header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-primary" /> {t(steps[currentStep].title)}
            </h1>
            <span className="text-sm font-medium text-muted-foreground">
              {t("stepOf", { n: currentStep + 1, total: steps.length })}
            </span>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((s, i) => (
              <div key={s.id} className={cn("h-1.5 rounded-full transition-colors duration-500", i <= currentStep ? "bg-primary" : "bg-secondary")} />
            ))}
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* Form Content */}
        <form
          className="min-h-[380px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{t("whereTo")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("whereToHint")}</p>
              <div className="space-y-2">
                <Label htmlFor="destination">{t("stepDestination")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="destination"
                    autoFocus
                    placeholder={t("destinationPlaceholder")}
                    className="pl-10 h-12 text-lg bg-card"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{t("whenTo")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("whenToHint", { max: MAX_TRIP_DAYS })}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">{t("startDate")}</Label>
                  <Input id="start-date" type="date" className="h-12 bg-card" min={today()} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">{t("endDate")}</Label>
                  <Input id="end-date" type="date" className="h-12 bg-card" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <p className={cn("text-sm", datesError ? "text-destructive" : "text-muted-foreground")}>
                {datesError ?? t("tripLength", { n: days })}
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{t("budget")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("budgetHint")}</p>
              <div className="space-y-8 mt-12">
                <div className="flex justify-between items-end">
                  <Label className="text-lg">{t("totalBudget")} (EUR)</Label>
                  <span className="text-3xl font-bold tabular-nums">€{budget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[budget]}
                  min={500}
                  max={10000}
                  step={100}
                  onValueChange={(val) => setBudget(sliderValue(val))}
                  className="py-4"
                  aria-label={t("totalBudget")}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>€500</span>
                  <span>€10,000+</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{t("travelStyle")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("travelStyleHint")}</p>

              <div className="space-y-10">
                {([
                  ["relaxedToAdventure", "styleRelaxed", "styleAdventure"],
                  ["budgetToLuxury", "styleBudget", "styleLuxury"],
                  ["natureToCity", "styleNature", "styleCity"],
                ] as const).map(([field, left, right]) => (
                  <div key={field} className="space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{t(left)}</span>
                      <span>{t(right)}</span>
                    </div>
                    <Slider
                      value={[style[field]]}
                      max={100}
                      step={10}
                      aria-label={`${t(left)} – ${t(right)}`}
                      onValueChange={(val) => setStyle((s) => ({ ...s, [field]: sliderValue(val) }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{t("interests")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("interestsHint")}</p>

              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((interest) => {
                  const selected = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      aria-pressed={selected}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "text-sm py-2 px-4 rounded-full border transition-all",
                        selected ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60 hover:bg-accent"
                      )}
                    >
                      {t(`interest${interest}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{t("readyTitle")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("readyHint")}</p>

              <Card className="bg-card border-border">
                <CardContent className="p-6 divide-y divide-border">
                  {[
                    [t("stepDestination"), destination],
                    [t("stepDates"), `${formatDateRange(startDate, endDate, language)} · ${t("tripLength", { n: days })}`],
                    [t("stepBudget"), `€${budget.toLocaleString()}`],
                    [t("stepInterests"), selectedInterests.length > 0 ? selectedInterests.map((i) => t(`interest${i}`)).join(", ") : t("balancedMix")],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-6 py-3">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-6 border-t border-border">
            <Button type="button" variant="ghost" size="lg" onClick={handleBack} disabled={currentStep === 0} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> {t("back")}
            </Button>

            <Button type="submit" size="lg" className="gap-2 px-6 rounded-full" disabled={!canContinue}>
              {currentStep === steps.length - 1 ? (
                <>{t("generateTrip")} <Sparkles className="w-4 h-4" /></>
              ) : (
                <>{t("continue")} <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
