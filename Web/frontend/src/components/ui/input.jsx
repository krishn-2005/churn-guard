/**
 * Input Component - shadcn/ui style
 * Text input field with dark theme styling
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input component for forms
 * Styled for dark theme with consistent focus states
 */
const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[#2a2a3c] bg-[#0a0a0f] px-3 py-2 text-sm text-slate-200",
        "placeholder:text-slate-500",
        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
