/**
 * Button Component - shadcn/ui style
 * A flexible button component with multiple variants and sizes
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button component with various style variants
 * 
 * Variants:
 * - default: Primary indigo button
 * - destructive: Red button for dangerous actions
 * - outline: Bordered button with transparent background
 * - secondary: Dark button for secondary actions
 * - ghost: Transparent button, shows background on hover
 * - link: Text-only button that looks like a link
 * 
 * Sizes:
 * - default: Standard size
 * - sm: Small size
 * - lg: Large size
 * - icon: Square size for icon-only buttons
 */
const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Base button styles that apply to all variants
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    // Variant-specific styles
    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-500/20",
      destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-500/20",
      outline:
        "border border-[#2a2a3c] bg-transparent text-slate-200 hover:bg-[#1e1e2d] hover:border-[#3a3a50]",
      secondary: "bg-[#1e1e2d] text-slate-200 hover:bg-[#2a2a3c] active:bg-[#333348]",
      ghost: "bg-transparent text-slate-300 hover:bg-[#1e1e2d] hover:text-slate-100",
      link: "bg-transparent text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
    };

    // Size-specific styles
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 py-1.5 text-xs",
      lg: "h-12 px-6 py-3 text-base",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
