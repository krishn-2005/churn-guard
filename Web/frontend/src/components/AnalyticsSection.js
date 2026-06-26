"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadFromStore } from "@/lib/store";
import {
  Users,
  Percent,
  DollarSign,
  Clock,
  Lightbulb,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Shared Card Wrapper ─────────────────────────────────────────────────────
// Keeps our layout consistent without duplicating Card, Title, and Insight boxes
// across all 6 charts.
function ChartWrapper({ title, description, insight, alert, children }) {
  return (
    <Card className="border-[#2a2a3c] bg-[#13131f]">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render the chart passed to this wrapper */}
        {children}

        {/* Display an optional alert bubble if the prop is provided */}
        {alert && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{alert}</p>
          </div>
        )}

        {/* Display the insight text */}
        <div className="flex items-start gap-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a3c] p-4">
          <Lightbulb className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <p className="text-sm text-slate-400 leading-relaxed">{insight}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Recharts Helper Components ─────────────────────────────────────────────
// Recharts tooltips have a white background by default. This makes it dark mode friendly.
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#13131f] border border-[#2a2a3c] p-3 rounded-lg shadow-xl">
        <p className="text-slate-200 font-medium">{label || payload[0].name}</p>
        <p className="text-slate-400">
          {payload[0].name}:{" "}
          <span className="text-slate-100 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function AnalyticsSection() {
  const [data, setData] = useState(null);

  // Load analytics from localStorage on component mount
  useEffect(() => {
    const saved = loadFromStore("analytics");
    if (saved) setData(saved);
  }, []);

  // Show a helpful empty state if no data is found
  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#2a2a3c] bg-[#13131f] px-8 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <ArrowLeft className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-100">No Data Yet</h2>
          <p className="mb-6 max-w-sm text-sm text-slate-400">
            Upload a CSV file on the Prediction page first. Insights will be
            generated automatically.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go to Prediction Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 1. Prepare data for Churn Distribution (Pie Chart)
  // Converting object keys to an array of objects
  const churnDistData = [
    { name: "Retained", value: data.churn_distribution?.["0"] || 0 },
    { name: "Churned", value: data.churn_distribution?.["1"] || 0 },
  ];
  const PIE_COLORS = ["#10b981", "#ef4444"]; // Emerald and Red

  // 2. Prepare data for Contract Churn (Vertical Bar Chart)
  const contractChurnData = Object.entries(
    data.churn_rate_by_contract || {},
  ).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  // 3. Prepare data for Payment Methods (Horizontal Bar Chart)
  const paymentMethodData = Object.entries(data.payment_method_risk || {})
    .map(([name, value]) => ({
      name: name.replace(" (automatic)", " (auto)"),
      value,
    }))
    .sort((a, b) => b.value - a.value);
  const highestPaymentRisk = paymentMethodData[0];

  // 4. Prepare data for Top Reasons (Horizontal Bar Chart)
  const topReasonsData = Object.entries(data.top_churn_reasons || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Only show top 5

  // 5. Prepare data for Service Protection (Vertical Bar Chart)
  const serviceProtectionData = (data.service_protection_impact || []).map(
    (item) => {
      const hasTechSupport = item["Tech Support"] === 1;
      const hasOnlineSecurity = item["Online Security"] === 1;
      return {
        name:
          hasTechSupport && hasOnlineSecurity
            ? "Both"
            : hasTechSupport
              ? "Tech Support"
              : hasOnlineSecurity
                ? "Security"
                : "Neither",
        value: parseFloat((item["Churn Value"] * 100).toFixed(2)),
      };
    },
  );
  const bothRate =
    serviceProtectionData.find((d) => d.name === "Both")?.value || 0;
  const neitherRate =
    serviceProtectionData.find((d) => d.name === "Neither")?.value || 0;

  // 6. Prepare data for Charge Buckets (Vertical Bar Chart)
  const chargeBucketData = (data.bucket_churn || [])
    .map((item) => {
      // Parse "(20.0, 40.0]" into numbers
      const bucketValues = item.charge_bucket
        .replace(/[()[\]]/g, "")
        .split(",")
        .map((n) => parseFloat(n));
      return {
        name: bucketValues.map((n) => `$${Math.round(n)}`).join("-"), // Format display name to "$20-$40"
        sortOrder: bucketValues[0],
        value: parseFloat((item.churn_rate * 100).toFixed(1)),
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder); // Sort ranges from low to high

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Customer Churn Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Explore churn patterns, customer behavior, and business insights.
        </p>
      </div>

      {/* KPI Cards section inline to avoid unnecessary component wrapper */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Customers",
            value: data.kpi.total_customers?.toLocaleString(),
            icon: <Users className="h-6 w-6 text-indigo-400" />,
            bg: "bg-indigo-500/10",
          },
          {
            title: "Churn Rate",
            value: `${data.kpi.churn_rate}%`,
            icon: <Percent className="h-6 w-6 text-red-400" />,
            bg: "bg-red-500/10",
          },
          {
            title: "Avg Monthly Charges",
            value: `$${data.kpi.avg_monthly_charges}`,
            icon: <DollarSign className="h-6 w-6 text-emerald-400" />,
            bg: "bg-emerald-500/10",
          },
          {
            title: "Avg Tenure",
            value: `${data.kpi.avg_tenure} months`,
            icon: <Clock className="h-6 w-6 text-purple-400" />,
            bg: "bg-purple-500/10",
          },
        ].map((card) => (
          <Card key={card.title} className="border-[#2a2a3c] bg-[#13131f]">
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg}`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-slate-400">{card.title}</p>
                <p className="text-2xl font-bold text-slate-100">
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart Example */}
        <ChartWrapper
          title="Churn Distribution"
          description="Overall customer retention vs churn breakdown"
          insight={
            <>
              Only{" "}
              <strong className="text-slate-200">
                {data.churn_distribution?.["1"]}%
              </strong>{" "}
              of customers churned. Focus on the at-risk segment.
            </>
          }
        >
          {/* Recharts PieChart requires a wrapper with explicit height */}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
<Pie
  data={churnDistData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={80}
  label={({ name, value }) => `${name}: ${value}%`}
  labelLine={true}
>
                  {/* Map unique colors to each slice of the pie */}
                  {churnDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        {/* Vertical Bar Chart Example */}
        <ChartWrapper
          title="Churn by Contract Type"
          description="Churn rate across different contract durations"
          insight={
            <>
              Month-to-month customers churn at{" "}
              <strong className="text-red-400">42.71%</strong> vs just{" "}
              <strong className="text-emerald-400">2.85%</strong> on two-year.
            </>
          }
        >
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* layout="horizontal" is default. X is category, Y is number */}
              <BarChart
                data={contractChurnData}
                margin={{ left: -20, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a3c"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        {/* Horizontal Bar Chart Example */}
        <ChartWrapper
          title="Churn by Payment Method"
          description="Churn rate across different payment methods"
          alert={
            <>
              <span className="font-semibold">Highest Risk:</span>{" "}
              {highestPaymentRisk?.name} ({highestPaymentRisk?.value}% churn)
            </>
          }
          insight="Customers using Electronic Check churn the most. Encouraging auto-payment migration could significantly improve retention."
        >
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* layout="vertical" flips the chart to run side-to-side */}
              <BarChart
                data={paymentMethodData}
                layout="vertical"
                margin={{ left: 20, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a3c"
                  horizontal={false}
                />
                {/* For horizontal charts, Y is category and X is number */}
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                  hide
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="Top Churn Reasons"
          description="Most common reasons customers decided to leave"
          insight={
            <>
              Top reason:{" "}
              <strong className="text-slate-200">
                &quot;{topReasonsData[0]?.name}&quot;
              </strong>{" "}
              with{" "}
              <strong className="text-slate-200">
                {topReasonsData[0]?.value}
              </strong>{" "}
              customers.
            </>
          }
        >
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topReasonsData}
                layout="vertical"
                margin={{ left: 40, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a3c"
                  horizontal={false}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={130}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="Service Protection Impact"
          description="How Tech Support and Online Security affect churn"
          insight={
            <>
              Customers with <strong className="text-emerald-400">both</strong>{" "}
              churn at only{" "}
              <strong className="text-emerald-400">{bothRate}%</strong> vs{" "}
              <strong className="text-red-400">{neitherRate}%</strong> with
              neither — a{" "}
              <strong className="text-emerald-400">
                {(neitherRate - bothRate).toFixed(1)}%
              </strong>{" "}
              reduction.
            </>
          }
        >
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceProtectionData}
                margin={{ left: -20, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a3c"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="Churn by Monthly Charges"
          description="Churn rate across different monthly charge ranges"
          insight={
            <>
              Higher charges = higher churn. Premium customers show price
              sensitivity.
            </>
          }
        >
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chargeBucketData}
                margin={{ left: -20, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a3c"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* We use an amber color to match the original chart intention */}
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}