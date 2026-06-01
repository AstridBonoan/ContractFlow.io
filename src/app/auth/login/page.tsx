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
    return <Skeleton className="mx-auto h-96 w-full max-w-md" />;
  }

  return <ContractorAuthForm />;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-4 py-12">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80')] bg-cover bg-center opacity-15" />
      <div className="relative w-full max-w-md">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
