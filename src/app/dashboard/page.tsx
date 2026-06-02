"use client";

import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ConsultationsWidget } from "@/components/dashboard/consultations-widget";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAppData } from "@/components/providers/data-provider";
import { computeMetrics, getDemoActivities } from "@/lib/demo-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, loading } = useAppData();
  const metrics = computeMetrics(data.leads, data.estimates);
  const activities = getDemoActivities();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-48 bg-slate-200" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your leads, estimates, and pipeline"
      />
      <MetricsCards metrics={metrics} />
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <FunnelChart leads={data.leads} />
        <ConsultationsWidget appointments={data.appointments} />
      </div>
      <ActivityFeed activities={activities} />
    </div>
  );
}
