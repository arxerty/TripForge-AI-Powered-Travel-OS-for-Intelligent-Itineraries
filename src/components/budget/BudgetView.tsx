"use client";

import { PieChart, Wallet, TrendingUp, AlertCircle, Plane, Hotel, Navigation, Utensils, Activity, ShoppingBag, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const budgetData = {
  total: 2500,
  spent: 1840,
  remaining: 660,
  currency: "€",
  categories: [
    { name: "Flights", spent: 850, icon: Plane, color: "bg-blue-500/20 text-blue-500" },
    { name: "Hotels", spent: 600, icon: Hotel, color: "bg-indigo-500/20 text-indigo-500" },
    { name: "Food", spent: 210, icon: Utensils, color: "bg-orange-500/20 text-orange-500" },
    { name: "Transport", spent: 80, icon: Navigation, color: "bg-green-500/20 text-green-500" },
    { name: "Activities", spent: 100, icon: Activity, color: "bg-pink-500/20 text-pink-500" },
    { name: "Shopping", spent: 0, icon: ShoppingBag, color: "bg-purple-500/20 text-purple-500" },
  ]
};

export default function BudgetView() {
  const percentageSpent = (budgetData.spent / budgetData.total) * 100;
  
  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetData.currency}{budgetData.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Spent</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetData.currency}{budgetData.spent.toLocaleString()}</div>
            <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${percentageSpent > 90 ? 'bg-destructive' : 'bg-primary'}`} 
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <PieChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${budgetData.remaining < 0 ? 'text-destructive' : ''}`}>
              {budgetData.currency}{budgetData.remaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {percentageSpent > 80 && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-destructive">Budget Warning</h4>
            <p className="text-sm text-destructive/80">You're projected to exceed your budget soon. Consider adjusting your upcoming activities.</p>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgetData.categories.map((cat, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color}`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{cat.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{budgetData.currency}{cat.spent.toLocaleString()}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
    </div>
  );
}
