"use client";

import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ConsultationsWidget } from "@/components/dashboard/consultations-widget";
import { useAppData } from "@/components/providers/data-provider";
import { computeMetrics, getDemoActivities } from "@/lib/demo-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, loading } = useAppData();
  const metrics = computeMetrics(data.leads, data.estimates);
  const activities = getDemoActivities();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500">Overview of your leads, estimates, and pipeline</p>
      </div>
      <MetricsCards metrics={metrics} />
      <div className="grid gap-6 lg:grid-cols-2">
        <FunnelChart leads={data.leads} />
        <ConsultationsWidget appointments={data.appointments} />
      </div>
      <ActivityFeed activities={activities} />
    </div>
  );
}
