/**
 * Progress Component - shadcn/ui style
 * Visual indicator for showing completion percentage
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Progress bar component
 * @param {number} value - Current progress value (0-100)
 * @param {string} className - Additional CSS classes
 * @param {string} indicatorClassName - Additional classes for the indicator bar
 */
const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  // Determine color based on value
  const getColorClass = () => {
    if (clampedValue >= 70) return "bg-red-500";
    if (clampedValue >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[#1e1e2d]", className)}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", getColorClass(), indicatorClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };
