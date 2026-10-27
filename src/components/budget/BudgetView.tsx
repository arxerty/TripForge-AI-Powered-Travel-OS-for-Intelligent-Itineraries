"use client";

import { PieChart, Wallet, TrendingUp, AlertCircle, Plane, Hotel, Navigation, Utensils, Activity, ShoppingBag, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { formatMoney } from "@/lib/format";
import type { GeneratedTrip } from "@/lib/validation/trip.schema";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "flights", label: "catFlights", icon: Plane, color: "bg-sky-500" },
  { key: "hotels", label: "catHotels", icon: Hotel, color: "bg-indigo-500" },
  { key: "food", label: "catFood", icon: Utensils, color: "bg-orange-500" },
  { key: "transport", label: "catTransport", icon: Navigation, color: "bg-emerald-500" },
  { key: "activities", label: "catActivities", icon: Activity, color: "bg-pink-500" },
  { key: "shopping", label: "catShopping", icon: ShoppingBag, color: "bg-purple-500" },
  { key: "other", label: "catOther", icon: MoreHorizontal, color: "bg-zinc-500" },
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
  const maxCategory = Math.max(1, ...CATEGORIES.map((c) => estimate.breakdown[c.key]));

  return (
    <div className="space-y-6">

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card size="sm" className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("yourBudget")}</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tabular-nums">{money(budgetAmount)}</div>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("estimated")}</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tabular-nums">{money(total)}</div>
            <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={cn("h-full rounded-full", percentage > 100 ? "bg-destructive" : percentage > 90 ? "bg-amber-500" : "bg-primary")}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{remaining < 0 ? t("overBudget") : t("remaining")}</CardTitle>
            <PieChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-xl font-bold tabular-nums", remaining < 0 && "text-destructive")}>
              {money(Math.abs(remaining))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {percentage > 90 && (
        <div role="status" className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-destructive">{t("budgetWarning")}</h4>
            <p className="text-sm text-destructive/80">{t("budgetWarningText")}</p>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">{t("expensesByCategory")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {CATEGORIES.map((cat) => {
            const value = estimate.breakdown[cat.key];
            return (
              <div key={cat.key} className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <cat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{t(cat.label)}</span>
                    <span className="font-semibold tabular-nums">{money(value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${(value / maxCategory) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}
