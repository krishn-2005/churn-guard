/**
 * Badge Component - shadcn/ui style
 * Small status indicator for labels and categories
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component for displaying status, categories, or labels
 * 
 * Variants:
 * - default: Subtle background with primary color
 * - secondary: Dark background for less emphasis
 * - destructive: Red background for warnings/errors
 * - outline: Bordered with transparent background
 * - success: Green for positive status
 * - warning: Amber/Orange for caution
 */
const badgeVariants = {
  default: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  secondary: "bg-[#1e1e2d] text-slate-400 border-[#2a2a3c]",
  destructive: "bg-red-500/15 text-red-400 border-red-500/25",
  outline: "border-[#2a2a3c] text-slate-300 bg-transparent",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };
