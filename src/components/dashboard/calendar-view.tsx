"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Appointment } from "@/types";

type ViewMode = "month" | "week" | "day";

export function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState<ViewMode>("month");

  const days = useMemo(() => {
    if (view === "day") return [current];
    if (view === "week") {
      const start = startOfWeek(current);
      return eachDayOfInterval({ start, end: addDays(start, 6) });
    }
    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(current);
    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [current, view]);

  const navigate = (dir: -1 | 1) => {
    if (view === "month") setCurrent(dir === 1 ? addMonths(current, 1) : subMonths(current, 1));
    else if (view === "week") setCurrent(dir === 1 ? addWeeks(current, 1) : subWeeks(current, 1));
    else setCurrent(dir === 1 ? addDays(current, 1) : addDays(current, -1));
  };

  const dayAppointments = (day: Date) =>
    appointments.filter((a) => isSameDay(new Date(a.start_at), day));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="min-w-[180px] text-center text-lg font-semibold">
            {format(current, view === "day" ? "MMMM d, yyyy" : "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          {(["month", "week", "day"] as ViewMode[]).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? "default" : "ghost"}
              onClick={() => setView(v)}
              className="capitalize"
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {view === "month" && (
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
      )}

      <div
        className={
          view === "month"
            ? "grid grid-cols-7 gap-1"
            : view === "week"
              ? "grid grid-cols-7 gap-2"
              : "grid grid-cols-1"
        }
      >
        {days.map((day) => {
          const events = dayAppointments(day);
          return (
            <Card
              key={day.toISOString()}
              className={
                view === "month"
                  ? `min-h-[80px] ${!isSameMonth(day, current) ? "opacity-40" : ""}`
                  : ""
              }
            >
              <CardContent className="p-2">
                <p
                  className={`text-sm font-medium ${
                    isSameDay(day, new Date()) ? "text-amber-600" : ""
                  }`}
                >
                  {format(day, view === "month" ? "d" : "EEE d")}
                </p>
                <div className="mt-1 space-y-1">
                  {events.map((e) => (
                    <div
                      key={e.id}
                      className="truncate rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                    >
                      {format(new Date(e.start_at), "h:mm a")} {e.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
