"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon, Wallet, Activity, Heart, Sparkles, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
        <div className="size-20 rounded-[22px] bg-gradient-to-b from-[#3d9bff] to-[#0062e0] flex items-center justify-center mb-8 shadow-float">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
        <h2 className="text-[28px] font-bold mb-6">{t("genTitle")}</h2>
        <div className="grouped max-w-sm w-full text-left mx-auto">
          {PROGRESS.map((key, i) => (
            <p key={key} className={cn("grouped-row text-[15px] transition-opacity", i > progress && "opacity-40")}>
              <span
                className={cn(
                  "size-[22px] rounded-full flex items-center justify-center shrink-0",
                  i < progress ? "bg-sys-green text-white" : i === progress ? "border-2 border-primary border-t-transparent animate-spin" : "border-2 border-border"
                )}
              >
                {i < progress && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
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
    <div className="flex-1 flex flex-col items-center px-5 py-6 md:p-10">
      <div className="w-full max-w-2xl">

        {/* Progress header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[13px] font-semibold uppercase tracking-wide text-primary flex items-center gap-1.5">
              <StepIcon className="w-4 h-4" /> {t(steps[currentStep].title)}
            </h1>
            <span className="text-[13px] text-muted-foreground">
              {t("stepOf", { n: currentStep + 1, total: steps.length })}
            </span>
          </div>
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-[width] duration-500 ease-out" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 grouped text-destructive flex items-start gap-3 text-[15px]">
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
              <h2 className="text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-tight mb-2">{t("whereTo")}</h2>
              <p className="text-[17px] md:text-[19px] text-muted-foreground mb-8">{t("whereToHint")}</p>
              <div className="space-y-2">
                <Label htmlFor="destination" className="sr-only">{t("stepDestination")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary-foreground" />
                  <Input
                    id="destination"
                    autoFocus
                    placeholder={t("destinationPlaceholder")}
                    className="pl-12 h-14 text-[20px] bg-card shadow-card"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-tight mb-2">{t("whenTo")}</h2>
              <p className="text-[17px] md:text-[19px] text-muted-foreground mb-8">{t("whenToHint", { max: MAX_TRIP_DAYS })}</p>
              <div className="grouped">
                <label htmlFor="start-date" className="grouped-row">
                  <span className="flex-1 text-[17px]">{t("startDate")}</span>
                  <input id="start-date" type="date" className="bg-secondary rounded-lg px-2.5 h-9 text-[17px] text-primary outline-none focus-visible:ring-4 focus-visible:ring-primary/20" min={today()} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label htmlFor="end-date" className="grouped-row">
                  <span className="flex-1 text-[17px]">{t("endDate")}</span>
                  <input id="end-date" type="date" className="bg-secondary rounded-lg px-2.5 h-9 text-[17px] text-primary outline-none focus-visible:ring-4 focus-visible:ring-primary/20" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
              </div>
              <p className={cn("px-4 text-[13px]", datesError ? "text-destructive" : "text-muted-foreground")}>
                {datesError ?? t("tripLength", { n: days })}
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-tight mb-2">{t("budget")}</h2>
              <p className="text-[17px] md:text-[19px] text-muted-foreground mb-8">{t("budgetHint")}</p>
              <div className="grouped p-6 space-y-4">
                <div className="text-center">
                  <span className="block text-[13px] text-muted-foreground">{t("totalBudget")}</span>
                  <span className="text-[48px] font-bold tracking-tight tabular-nums leading-tight">€{budget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[budget]}
                  min={500}
                  max={10000}
                  step={100}
                  onValueChange={(val) => setBudget(sliderValue(val))}
                  aria-label={t("totalBudget")}
                />
                <div className="flex justify-between text-[13px] text-muted-foreground">
                  <span>€500</span>
                  <span>€10,000+</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-tight mb-2">{t("travelStyle")}</h2>
              <p className="text-[17px] md:text-[19px] text-muted-foreground mb-8">{t("travelStyleHint")}</p>

              <div className="grouped">
                {([
                  ["relaxedToAdventure", "styleRelaxed", "styleAdventure"],
                  ["budgetToLuxury", "styleBudget", "styleLuxury"],
                  ["natureToCity", "styleNature", "styleCity"],
                ] as const).map(([field, left, right]) => (
                  <div key={field} className="grouped-row flex-col items-stretch gap-1 py-4">
                    <div className="flex justify-between text-[15px]">
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
              <h2 className="text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-tight mb-2">{t("interests")}</h2>
              <p className="text-[17px] md:text-[19px] text-muted-foreground mb-8">{t("interestsHint")}</p>

              <div className="flex flex-wrap gap-2.5">
                {INTERESTS.map((interest) => {
                  const selected = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      aria-pressed={selected}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-[15px] font-medium transition-all active:scale-95",
                        selected ? "bg-primary text-primary-foreground" : "bg-card shadow-card text-foreground hover:bg-secondary"
                      )}
                    >
                      {selected && <Check className="w-4 h-4" strokeWidth={2.75} />}
                      {t(`interest${interest}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-tight mb-2">{t("readyTitle")}</h2>
              <p className="text-[17px] md:text-[19px] text-muted-foreground mb-8">{t("readyHint")}</p>

              <div className="grouped">
                {[
                  [t("stepDestination"), destination, 0],
                  [t("stepDates"), `${formatDateRange(startDate, endDate, language)} · ${t("tripLength", { n: days })}`, 1],
                  [t("stepBudget"), `€${budget.toLocaleString()}`, 2],
                  [t("stepInterests"), selectedInterests.length > 0 ? selectedInterests.map((i) => t(`interest${i}`)).join(", ") : t("balancedMix"), 4],
                ].map(([label, value, step]) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => setCurrentStep(step as number)}
                    className="grouped-row w-full text-left hover:bg-secondary/60 transition-colors"
                  >
                    <span className="text-[17px] shrink-0">{label}</span>
                    <span className="flex-1 text-[17px] text-muted-foreground text-right truncate">{value}</span>
                    <ChevronRight className="w-4 h-4 text-tertiary-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button type="button" variant="ghost" size="lg" onClick={handleBack} disabled={currentStep === 0} className="px-3 disabled:opacity-0">
              <ChevronLeft className="w-5 h-5" /> {t("back")}
            </Button>

            <Button type="submit" size="lg" className="min-w-40" disabled={!canContinue}>
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
