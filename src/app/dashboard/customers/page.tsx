"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { useAppData } from "@/components/providers/data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatDate, withBasePath } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersPage() {
  const { data, loading } = useAppData();

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader title="Customers" description="Customer records and project history" />
      {data.customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Customers are created when homeowners submit project requests."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.customers.map((customer) => {
            const leads = data.leads.filter((l) => l.customer_id === customer.id);
            const estimates = data.estimates.filter((e) => e.customer_id === customer.id);
            return (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{customer.full_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-slate-500">{customer.email}</p>
                  <p>{customer.phone}</p>
                  <p className="text-slate-600">{customer.address}</p>
                  {customer.notes && (
                    <p className="rounded-lg bg-slate-50 p-2 italic text-slate-700">
                      {customer.notes}
                    </p>
                  )}
                  <div className="flex gap-4 border-t pt-3 text-xs text-slate-500">
                    <span>{leads.length} projects</span>
                    <span>{estimates.length} estimates</span>
                  </div>
                  <p className="text-xs text-slate-400">Since {formatDate(customer.created_at)}</p>
                  {leads[0] && (
                    <Link
                      href={withBasePath(`/dashboard/leads/?id=${leads[0].id}`)}
                      className="text-sm font-medium text-amber-700 hover:underline"
                    >
                      View latest project →
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
