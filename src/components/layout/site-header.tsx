"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white">
            <Hammer className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">ContractorFlow</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#request-form"
            className="hidden text-sm font-medium text-slate-600 hover:text-amber-700 sm:inline dark:text-slate-300"
          >
            Request Estimate
          </Link>
          <Button asChild size="sm" variant="secondary">
            <Link href={withBasePath("/dashboard/")}>Contractor Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
