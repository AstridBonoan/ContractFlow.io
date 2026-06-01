"use client";

import { DollarSign, FileText, Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardMetrics } from "@/types";

const cards = [
  { key: "newLeads" as const, label: "New Leads", icon: Users, color: "text-blue-600" },
  { key: "estimatesSent" as const, label: "Estimates Sent", icon: FileText, color: "text-amber-600" },
  { key: "jobsWon" as const, label: "Jobs Won", icon: Trophy, color: "text-emerald-600" },
  { key: "revenuePipeline" as const, label: "Revenue Pipeline", icon: DollarSign, color: "text-purple-600", format: true },
];

export function MetricsCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key];
        return (
          <Card key={card.key}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl bg-slate-100 p-3 dark:bg-slate-800 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {card.format ? formatCurrency(value) : value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
