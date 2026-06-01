"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  Hammer,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn, withBasePath } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/dashboard/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/leads/", label: "Leads", icon: Users },
  { href: "/dashboard/estimates/", label: "Estimates", icon: FileText },
  { href: "/dashboard/calendar/", label: "Calendar", icon: Calendar },
  { href: "/dashboard/customers/", label: "Customers", icon: Users },
  { href: "/dashboard/settings/", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const normalizedPath = pathname?.replace(/\/$/, "") || "";

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg border bg-white p-2 shadow lg:hidden dark:bg-slate-900"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-slate-900 text-white transition-transform lg:translate-x-0 dark:border-slate-800",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600">
            <Hammer className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">ContractorFlow</p>
            <p className="text-xs text-slate-400">Contractor Dashboard</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const href = withBasePath(item.href);
            const active =
              normalizedPath === item.href.replace(/\/$/, "") ||
              (item.href !== "/dashboard/" && normalizedPath.startsWith(item.href.replace(/\/$/, "")));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-slate-800 p-3">
          <Link href={withBasePath("/")} className="text-xs text-slate-400 hover:text-white">
            ← Public Portal
          </Link>
          <ThemeToggle />
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
