"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContractorAuthForm } from "@/components/auth/contractor-auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { withBasePath } from "@/lib/utils";

function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || withBasePath("/dashboard/");

  useEffect(() => {
    if (!loading && user) {
      router.replace(returnTo.startsWith("/") ? returnTo : withBasePath("/dashboard/"));
    }
  }, [user, loading, router, returnTo]);

  if (loading || user) {
    return <Skeleton className="mx-auto h-96 w-full max-w-md rounded-xl bg-white" />;
  }

  return <ContractorAuthForm />;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl bg-white" />}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
