"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadCard } from "@/components/dashboard/lead-card";
import { LeadDetail } from "@/components/dashboard/lead-detail";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useAppData } from "@/components/providers/data-provider";
import { LEAD_STATUSES } from "@/lib/constants";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function LeadsContent() {
  const { data, loading } = useAppData();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"list" | "kanban">("list");

  const filtered = useMemo(() => {
    return data.leads.filter((lead) => {
      const name = lead.customer?.full_name?.toLowerCase() ?? "";
      const matchSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        lead.service_type.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data.leads, search, statusFilter]);

  const selectedLead = selectedId ? data.leads.find((l) => l.id === selectedId) : null;

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (selectedLead) {
    return <LeadDetail lead={selectedLead} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-slate-500">{filtered.length} leads</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("kanban")}
            aria-label="Kanban view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leads found"
          description="New project requests from homeowners will appear here."
        />
      ) : view === "kanban" ? (
        <KanbanBoard leads={filtered} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <LeadsContent />
    </Suspense>
  );
}
