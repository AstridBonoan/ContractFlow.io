"use client";

import { DollarSign, FileText, Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardMetrics } from "@/types";

const cards = [
  {
    key: "newLeads" as const,
    label: "New Leads",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    key: "estimatesSent" as const,
    label: "Estimates Sent",
    icon: FileText,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    key: "jobsWon" as const,
    label: "Jobs Won",
    icon: Trophy,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    key: "revenuePipeline" as const,
    label: "Revenue Pipeline",
    icon: DollarSign,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
    format: true,
  },
];

export function MetricsCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key];
        return (
          <Card key={card.key} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-600 sm:text-sm">{card.label}</p>
                <p className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
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
