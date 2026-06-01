"use client";

import Link from "next/link";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { withBasePath } from "@/lib/utils";
import type { Lead } from "@/types";
import { updateLeadStatus } from "@/lib/data-service";
import { useAppData } from "@/components/providers/data-provider";
import type { LeadStatus } from "@/lib/constants";

const pipelineStatuses: LeadStatus[] = [
  "New Lead",
  "Contacted",
  "Consultation Scheduled",
  "Estimate Sent",
  "Negotiation",
  "Won",
  "Lost",
];

export function KanbanBoard({ leads }: { leads: Lead[] }) {
  const { refresh } = useAppData();

  const onDrop = async (leadId: string, status: LeadStatus) => {
    await updateLeadStatus(leadId, status);
    await refresh();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {pipelineStatuses.map((status) => {
        const columnLeads = leads.filter((l) => l.status === status);
        return (
          <div
            key={status}
            className="min-w-[240px] flex-shrink-0 rounded-xl bg-slate-100 p-3 dark:bg-slate-900"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const leadId = e.dataTransfer.getData("leadId");
              if (leadId) onDrop(leadId, status);
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <Badge variant={statusToBadgeVariant(status)}>{status}</Badge>
              <span className="text-xs text-slate-500">{columnLeads.length}</span>
            </div>
            <div className="space-y-2">
              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("leadId", lead.id)}
                  className="cursor-grab rounded-lg border bg-white p-3 shadow-sm active:cursor-grabbing dark:bg-slate-800"
                >
                  <Link href={withBasePath(`/dashboard/leads/?id=${lead.id}`)}>
                    <p className="font-medium text-sm">{lead.customer?.full_name}</p>
                    <p className="text-xs text-slate-500">{lead.service_type}</p>
                    <p className="mt-1 text-xs text-amber-600">Priority: {lead.priority_score}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
