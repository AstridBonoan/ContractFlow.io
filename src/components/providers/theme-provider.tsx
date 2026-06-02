"use client";

/** Light-only app — next-themes removed to prevent iOS Safari dark class conflicts. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
