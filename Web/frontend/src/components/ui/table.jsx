/**
 * Table Component - shadcn/ui style
 * Structured data display with dark theme
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Table - Main wrapper with overflow handling
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/**
 * TableHeader - Head section of the table
 */
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("border-b border-[#2a2a3c]", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

/**
 * TableBody - Body section of the table
 */
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

/**
 * TableFooter - Footer section for totals/summaries
 */
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t border-[#2a2a3c] bg-[#1a1a2e] font-medium", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

/**
 * TableRow - Individual row with hover effect
 */
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[#2a2a3c] transition-colors duration-150 hover:bg-[#1a1a2e]/50 data-[state=selected]:bg-[#1a1a2e]",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/**
 * TableHead - Column header cell
 */
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-slate-400 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * TableCell - Data cell
 */
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * TableCaption - Caption/title for the table
 */
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-slate-500", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
