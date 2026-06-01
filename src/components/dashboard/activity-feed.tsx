"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, FileText, MessageSquare, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/types";

const icons = {
  lead: UserPlus,
  estimate: FileText,
  appointment: Calendar,
  note: MessageSquare,
};

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity</p>
        ) : (
          activities.map((item) => {
            const Icon = icons[item.type];
            return (
              <div key={item.id} className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
