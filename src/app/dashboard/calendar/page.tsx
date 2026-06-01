"use client";

import { CalendarView } from "@/components/dashboard/calendar-view";
import { useAppData } from "@/components/providers/data-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  const { data, loading } = useAppData();

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-slate-500">Consultations, follow-ups, and estimate meetings</p>
      </div>
      <CalendarView appointments={data.appointments} />
    </div>
  );
}
