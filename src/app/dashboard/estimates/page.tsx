"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { useAppData } from "@/components/providers/data-provider";
import { EstimateBuilder } from "@/components/dashboard/estimate-builder";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, withBasePath } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";

function EstimatesContent() {
  const { data, loading } = useAppData();
  const searchParams = useSearchParams();
  const leadId = searchParams.get("leadId");

  if (loading) return <Skeleton className="h-96 w-full" />;

  if (leadId) {
    const lead = data.leads.find((l) => l.id === leadId);
    if (!lead) {
      return (
        <EmptyState
          icon={FileText}
          title="Lead not found"
          description="The selected lead could not be found."
        />
      );
    }
    return <EstimateBuilder lead={lead} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader title="Estimates" description="Manage and send project estimates" />
      {data.estimates.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No estimates yet"
          description="Create an estimate from a lead detail page."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.estimates.map((est) => {
            const lead = data.leads.find((l) => l.id === est.lead_id);
            const customer = data.customers.find((c) => c.id === est.customer_id);
            return (
              <Link key={est.id} href={withBasePath(`/dashboard/estimates/?leadId=${est.lead_id}`)}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{customer?.full_name}</p>
                        <p className="text-sm text-slate-500">{lead?.service_type}</p>
                      </div>
                      <Badge variant={statusToBadgeVariant(est.status)}>{est.status}</Badge>
                    </div>
                    <p className="mt-3 text-xl font-bold text-amber-700">
                      {formatCurrency(est.total)}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(est.updated_at)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EstimatesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <EstimatesContent />
    </Suspense>
  );
}
