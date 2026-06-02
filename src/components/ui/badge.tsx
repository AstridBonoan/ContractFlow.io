import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-800",
        new: "bg-blue-100 text-blue-800",
        success: "bg-emerald-100 text-emerald-800",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-800",
        purple: "bg-purple-100 text-purple-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function statusToBadgeVariant(status: string): BadgeProps["variant"] {
  switch (status) {
    case "New Lead":
      return "new";
    case "Won":
    case "accepted":
      return "success";
    case "Lost":
    case "rejected":
      return "danger";
    case "Negotiation":
    case "Estimate Sent":
      return "warning";
    case "Consultation Scheduled":
      return "purple";
    default:
      return "default";
  }
}
