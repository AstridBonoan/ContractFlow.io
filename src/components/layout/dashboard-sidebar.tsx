"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  Hammer,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn, withBasePath } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace(withBasePath("/auth/login/"));
  };

  const normalizedPath = pathname?.replace(/\/$/, "") || "";

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm lg:hidden">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href={withBasePath("/dashboard/")} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
            <Hammer className="h-4 w-4" />
          </span>
          <span className="font-bold text-slate-900">ContractorFlow</span>
        </Link>
        <div className="w-10" aria-hidden />
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex w-[min(100%,280px)] flex-col border-r border-slate-700 bg-slate-900 text-white shadow-xl transition-transform duration-200 ease-out lg:z-40 lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-700 px-4 lg:h-16 lg:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600">
              <Hammer className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold leading-tight">ContractorFlow</p>
              <p className="text-xs text-slate-400">Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const href = withBasePath(item.href);
            const active =
              normalizedPath === item.href.replace(/\/$/, "") ||
              (item.href !== "/dashboard/" &&
                normalizedPath.startsWith(item.href.replace(/\/$/, "")));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-600 text-white"
                    : "text-slate-200 active:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-slate-700 p-4">
          {user && (
            <div className="rounded-lg bg-slate-800 p-3">
              <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-full justify-start text-slate-200 hover:bg-slate-800 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Link
            href={withBasePath("/")}
            className="block py-2 text-center text-xs text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ← Homeowner portal
          </Link>
        </div>
      </aside>
    </>
  );
}
