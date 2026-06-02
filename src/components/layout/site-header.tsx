"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white sm:h-9 sm:w-9">
            <Hammer className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="truncate text-base tracking-tight sm:text-lg">ContractorFlow</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Button asChild size="sm" variant="outline" className="h-9 px-2.5 text-xs sm:px-3 sm:text-sm">
            <Link href="/#request-form">Request Estimate</Link>
          </Button>
          <Button asChild size="sm" className="h-9 bg-slate-800 px-2.5 text-xs hover:bg-slate-900 sm:px-3 sm:text-sm">
            <Link href={withBasePath("/auth/login/")}>
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Contractor Login</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
