"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { withBasePath } from "@/lib/utils";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const loginUrl = withBasePath("/auth/login/");
      const returnTo = encodeURIComponent(pathname || withBasePath("/dashboard/"));
      router.replace(`${loginUrl}?returnTo=${returnTo}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-10 w-48 bg-slate-200" />
          <Skeleton className="h-64 w-full bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
