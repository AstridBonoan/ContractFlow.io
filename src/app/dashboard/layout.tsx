"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100">
        <DashboardSidebar />
        <main className="lg:pl-64">
          <div className="min-h-screen px-4 pb-8 pt-[4.5rem] lg:p-8 lg:pt-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
