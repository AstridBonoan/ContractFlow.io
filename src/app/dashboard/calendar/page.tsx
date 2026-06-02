"use client";

import { CalendarView } from "@/components/dashboard/calendar-view";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAppData } from "@/components/providers/data-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  const { data, loading } = useAppData();

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Calendar"
        description="Consultations, follow-ups, and estimate meetings"
      />
      <CalendarView appointments={data.appointments} />
    </div>
  );
}
