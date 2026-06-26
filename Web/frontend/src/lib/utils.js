import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind class names safely (used by shadcn/ui components)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 0.82 → "82.0%"
export function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

// Badge color for risk level
export function getRiskBadgeColor(level) {
  if (level === "High")   return "bg-red-500/20 text-red-400 border-red-500/30";
  if (level === "Medium") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (level === "Low")    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

// Badge color for churn prediction (1 = churn, 0 = no churn)
export function getPredictionBadgeColor(prediction) {
  return prediction === 1
    ? "bg-red-500/20 text-red-400 border-red-500/30"
    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
}

// Downloads predictions array as a CSV file
export function downloadCSV(predictions) {
  const headers = ["Customer ID", "Churn Probability", "Churn Prediction", "Risk Level", "Loyalty Score"];
  const rows = predictions.map((p) => [
    p.customer_id,
    p.churn_probability,
    p.churn_prediction === 1 ? "Churn" : "No Churn",
    p.risk_level,
    p.loyalty_score,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = `churn-predictions-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
