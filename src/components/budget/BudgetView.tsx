"use client";

import { AlertCircle, Plane, BedDouble, Navigation, Utensils, Ticket, ShoppingBag, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { formatMoney } from "@/lib/format";
import type { GeneratedTrip } from "@/lib/validation/trip.schema";
import { cn } from "@/lib/utils";

// Apple system colours, one per category (like Screen Time / Wallet breakdowns).
const CATEGORIES = [
  { key: "flights", label: "catFlights", icon: Plane, color: "bg-sys-blue" },
  { key: "hotels", label: "catHotels", icon: BedDouble, color: "bg-sys-indigo" },
  { key: "food", label: "catFood", icon: Utensils, color: "bg-sys-orange" },
  { key: "transport", label: "catTransport", icon: Navigation, color: "bg-sys-green" },
  { key: "activities", label: "catActivities", icon: Ticket, color: "bg-sys-pink" },
  { key: "shopping", label: "catShopping", icon: ShoppingBag, color: "bg-sys-purple" },
  { key: "other", label: "catOther", icon: MoreHorizontal, color: "bg-sys-gray" },
] as const;

interface BudgetViewProps {
  budgetAmount: number;
  currency: string;
  estimate: GeneratedTrip["estimatedBudget"];
}

export default function BudgetView({ budgetAmount, currency, estimate }: BudgetViewProps) {
  const { t, language } = useI18n();
  const money = (n: number) => formatMoney(n, currency, language);
  const total = estimate.totalEstimated;
  const remaining = budgetAmount - total;
  const percentage = budgetAmount > 0 ? (total / budgetAmount) * 100 : 0;

  return (
    <div className="space-y-6">

      {/* Summary */}
      <div className="grouped p-5">
        <p className="text-[13px] text-muted-foreground mb-1">{t("estimated")}</p>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <span className="text-[34px] font-bold tracking-tight tabular-nums leading-none">{money(total)}</span>
          <span className="text-[13px] text-muted-foreground">
            {t("yourBudget")}: <span className="text-foreground font-medium tabular-nums">{money(budgetAmount)}</span>
          </span>
        </div>

        {/* Stacked bar, like Screen Time */}
        <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-secondary gap-[2px]">
          {CATEGORIES.map((cat) => {
            const value = estimate.breakdown[cat.key];
            const width = (value / Math.max(total, budgetAmount)) * 100;
            return width > 0 ? <div key={cat.key} className={cat.color} style={{ width: `${width}%` }} /> : null;
          })}
        </div>

        <p className={cn("mt-3 text-[15px] font-medium", remaining < 0 ? "text-destructive" : "text-sys-green")}>
          {remaining < 0 ? t("overBudget") : t("remaining")}: <span className="tabular-nums">{money(Math.abs(remaining))}</span>
        </p>
      </div>

      {/* Alerts */}
      {percentage > 90 && (
        <div role="status" className="grouped p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-sys-orange shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[15px]">{t("budgetWarning")}</h4>
            <p className="text-[13px] text-muted-foreground">{t("budgetWarningText")}</p>
          </div>
        </div>
      )}

      {/* Category Breakdown — inset grouped list */}
      <section>
        <h3 className="px-4 mb-1.5 text-[13px] uppercase tracking-wide text-muted-foreground">{t("expensesByCategory")}</h3>
        <div className="grouped">
          {CATEGORIES.map((cat) => {
            const value = estimate.breakdown[cat.key];
            return (
              <div key={cat.key} className="grouped-row">
                <span className={cn("size-[29px] rounded-[7px] flex items-center justify-center text-white shrink-0", cat.color)}>
                  <cat.icon className="w-4 h-4" strokeWidth={2.2} />
                </span>
                <span className="flex-1 text-[15px]">{t(cat.label)}</span>
                <span className="text-[15px] text-muted-foreground tabular-nums">{money(value)}</span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
