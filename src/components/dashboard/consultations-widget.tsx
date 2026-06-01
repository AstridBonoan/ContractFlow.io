"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/utils";
import type { Appointment } from "@/types";

export function ConsultationsWidget({ appointments }: { appointments: Appointment[] }) {
  const upcoming = [...appointments]
    .filter((a) => new Date(a.start_at) >= new Date())
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Consultations</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={withBasePath("/dashboard/calendar/")}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming consultations scheduled.</p>
        ) : (
          upcoming.map((apt) => (
            <div
              key={apt.id}
              className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
            >
              <p className="font-medium text-slate-900 dark:text-white">{apt.title}</p>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                {format(new Date(apt.start_at), "EEE, MMM d · h:mm a")}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
