"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FUNNEL_STAGES } from "@/lib/constants";
import type { Lead } from "@/types";

export function FunnelChart({ leads }: { leads: Lead[] }) {
  const data = FUNNEL_STAGES.map((stage) => ({
    stage: stage.replace(" ", "\n"),
    count: leads.filter((l) => {
      if (stage === "New Lead") return l.status === "New Lead" || l.status === "Contacted";
      if (stage === "Estimate Sent") return ["Estimate Sent", "Consultation Scheduled"].includes(l.status);
      return l.status === stage;
    }).length,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#d97706" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">
          New Lead → Estimate Sent → Negotiation → Won
        </p>
      </CardContent>
    </Card>
  );
}
