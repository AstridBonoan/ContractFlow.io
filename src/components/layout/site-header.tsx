"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white sm:h-9 sm:w-9">
            <Hammer className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="truncate text-base sm:text-lg">ContractorFlow</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            asChild
            size="sm"
            className="h-9 shrink-0 bg-amber-600 px-2.5 text-xs text-white hover:bg-amber-700 sm:px-3 sm:text-sm"
          >
            <Link href="/#request-form">Estimate</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 shrink-0 border-slate-300 bg-white px-2.5 text-xs text-slate-900 hover:bg-slate-50 sm:px-3 sm:text-sm"
          >
            <Link href={withBasePath("/auth/login/")}>Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
