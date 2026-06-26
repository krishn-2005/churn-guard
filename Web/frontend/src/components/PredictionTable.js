"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge }    from "@/components/ui/badge";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getRiskBadgeColor, getPredictionBadgeColor, formatPercentage } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

const COLUMNS = [
  { key: "customer_id",      label: "Customer ID"   },
  { key: "churn_probability", label: "Probability"   },
  { key: "churn_prediction",  label: "Prediction"    },
  { key: "risk_level",        label: "Risk Level"    },
  { key: "loyalty_score",     label: "Loyalty Score" },
];

export default function PredictionTable({ predictions }) {
  const [search,   setSearch]   = useState("");
  const [sortKey,  setSortKey]  = useState("");
  const [sortDir,  setSortDir]  = useState("desc");
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function handleSort(key) {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  }

  function SortIcon({ col }) {
    if (col !== sortKey) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />;
    return sortDir === "asc"
      ? <ArrowUp   className="h-3.5 w-3.5 text-indigo-400" />
      : <ArrowDown className="h-3.5 w-3.5 text-indigo-400" />;
  }

  // 1. Filter
  const filtered = predictions.filter((p) => {
    const term = search.toLowerCase();
    return p.customer_id?.toLowerCase().includes(term) || p.risk_level?.toLowerCase().includes(term);
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === "asc" ? av - bv : bv - av;
  });

  // 3. Paginate
  const totalPages  = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx    = (currentPage - 1) * pageSize;
  const pageRows    = sorted.slice(startIdx, startIdx + pageSize);

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          placeholder="Search by Customer ID or Risk Level..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border border-[#2a2a3c] bg-[#13131f] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a2a3c] hover:bg-transparent">
                {COLUMNS.map(({ key, label }) => (
                  <TableHead key={key}>
                    <button onClick={() => handleSort(key)}
                      className="flex items-center gap-1 font-medium hover:text-indigo-400 transition-colors">
                      {label} <SortIcon col={key} />
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    {search ? "No results match your search" : "No predictions available"}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((p, i) => (
                  <TableRow key={`${p.customer_id}-${i}`} className="table-row-hover">

                    <TableCell className="font-medium text-slate-200">{p.customer_id}</TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm text-slate-300">{formatPercentage(p.churn_probability)}</span>
                        <Progress value={p.churn_probability * 100} className="h-1.5 w-24" />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={getPredictionBadgeColor(p.churn_prediction)}>
                        {p.churn_prediction === 1 ? "Churn" : "No Churn"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={getRiskBadgeColor(p.risk_level)}>
                        {p.risk_level}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-slate-300">{p.loyalty_score}</TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-[#2a2a3c] px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {sorted.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, sorted.length)} of {sorted.length}
            {search && ` (filtered from ${predictions.length})`}
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              Rows
              <select value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-8 rounded-lg border border-[#2a2a3c] bg-[#0a0a0f] px-2 text-xs text-slate-200 outline-none hover:border-[#3a3a50]">
                {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <Button variant="outline" size="sm" className="h-8 px-2"
              onClick={() => setPage((p) => p - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-20 text-center text-slate-400">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" className="h-8 px-2"
              onClick={() => setPage((p) => p + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
