"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Button }   from "@/components/ui/button";
import { downloadCSV } from "@/lib/utils";
import PredictionTable from "@/components/PredictionTable";
import { BarChart3, Users, UserX, UserCheck, AlertTriangle, Download } from "lucide-react";

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCards({ predictions }) {
  const cards = [
    { title: "Total Customers",    value: predictions.length,                                             icon: <Users         className="h-5 w-5 text-indigo-400" />, bg: "bg-indigo-500/10",  border: "border-indigo-500/20"  },
    { title: "Predicted Churn",    value: predictions.filter((p) => p.churn_prediction === 1).length,    icon: <UserX         className="h-5 w-5 text-red-400"    />, bg: "bg-red-500/10",     border: "border-red-500/20"     },
    { title: "Predicted No Churn", value: predictions.filter((p) => p.churn_prediction === 0).length,    icon: <UserCheck     className="h-5 w-5 text-emerald-400"/>, bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "High Risk",          value: predictions.filter((p) => p.risk_level === "High").length,     icon: <AlertTriangle className="h-5 w-5 text-amber-400"  />, bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={`${card.bg} ${card.border} card-hover`}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#13131f]">
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400">{card.title}</p>
              <p className="text-2xl font-bold text-slate-100">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Results Section (main export) ───────────────────────────────────────────

export default function ResultsSection({ predictions }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 animate-fade-in-up">

      {/* Header + Download button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Prediction Results
          </h2>
          <p className="mt-1 text-sm text-slate-400">Review customer churn predictions and risk assessments</p>
        </div>
        <Button variant="outline" onClick={() => downloadCSV(predictions)} className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Download Results (CSV)
        </Button>
      </div>

      {/* Summary stats */}
      <div className="mb-6">
        <SummaryCards predictions={predictions} />
      </div>

      {/* Predictions table */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Detailed Predictions</CardTitle>
          <CardDescription>Click column headers to sort. Use the search bar to filter results.</CardDescription>
        </CardHeader>
        <PredictionTable predictions={predictions} />
      </Card>

    </section>
  );
}
