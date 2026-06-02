"use client";

import Link from "next/link";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, withBasePath } from "@/lib/utils";
import type { Lead } from "@/types";
import { Star } from "lucide-react";

export function LeadCard({ lead }: { lead: Lead }) {
  const customer = lead.customer;
  return (
    <Link href={withBasePath(`/dashboard/leads/?id=${lead.id}`)}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">
                {customer?.full_name ?? "Unknown"}
              </h3>
              <p className="text-sm text-slate-500">{lead.service_type}</p>
            </div>
            <Badge variant={statusToBadgeVariant(lead.status)}>{lead.status}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{lead.budget_range}</span>
            <span>·</span>
            <span>{formatDate(lead.submitted_at)}</span>
            <span className="ml-auto flex items-center gap-1 text-amber-600">
              <Star className="h-3 w-3 fill-current" />
              {lead.priority_score}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
