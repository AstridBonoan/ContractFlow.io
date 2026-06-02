"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Hammer, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { withBasePath } from "@/lib/utils";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = signInSchema
  .extend({
    fullName: z.string().min(2, "Full name is required"),
    companyName: z.string().optional(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export function ContractorAuthForm() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const returnTo = searchParams.get("returnTo") || withBasePath("/dashboard/");

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", fullName: "", companyName: "" },
  });

  const onSignIn = async (values: SignInValues) => {
    setError(null);
    try {
      await signIn(values.email, values.password);
      router.replace(returnTo.startsWith("/") ? returnTo : withBasePath("/dashboard/"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    }
  };

  const onSignUp = async (values: SignUpValues) => {
    setError(null);
    try {
      await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        companyName: values.companyName,
      });
      router.replace(returnTo.startsWith("/") ? returnTo : withBasePath("/dashboard/"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl">
      <CardHeader className="text-center">
        <Link href={withBasePath("/")} className="mx-auto mb-4 flex w-fit items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 text-white">
            <Hammer className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold text-slate-900">ContractorFlow</span>
        </Link>
        <CardTitle className="text-2xl">Contractor Portal</CardTitle>
        <CardDescription>Sign in to manage leads, estimates, and your pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured() && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Demo mode: use <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong> or create
            a new account.
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <Tabs value={tab} onValueChange={(v) => { setTab(v as "signin" | "signup"); setError(null); }}>
          <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...signInForm.register("email")}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-xs text-red-600">{signInForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  {...signInForm.register("password")}
                />
                {signInForm.formState.errors.password && (
                  <p className="text-xs text-red-600">{signInForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={signInForm.formState.isSubmitting}>
                {signInForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input id="signup-name" autoComplete="name" {...signUpForm.register("fullName")} />
                {signUpForm.formState.errors.fullName && (
                  <p className="text-xs text-red-600">{signUpForm.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-company">Company Name (optional)</Label>
                <Input id="signup-company" {...signUpForm.register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  {...signUpForm.register("email")}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-xs text-red-600">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  {...signUpForm.register("password")}
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-xs text-red-600">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  autoComplete="new-password"
                  {...signUpForm.register("confirmPassword")}
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting}>
                {signUpForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href={withBasePath("/")} className="text-amber-700 hover:underline">
            ← Back to homeowner portal
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
