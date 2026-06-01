import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** App route path. Next.js `basePath` in next.config prepends this on deploy — do not add it again in Link/router hrefs. */
export function withBasePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Strip accidental duplicate base segment (e.g. /ContractFlow.io/ContractFlow.io/...)
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (base && normalized.startsWith(`${base}${base}`)) {
    return normalized.slice(base.length);
  }
  return normalized;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}
