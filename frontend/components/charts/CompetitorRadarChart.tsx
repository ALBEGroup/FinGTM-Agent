"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CompanyDataPoint } from "@/lib/types";

interface CompetitorRadarChartProps {
  companies: CompanyDataPoint[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

const DIMENSIONS: { key: keyof CompanyDataPoint; label: string }[] = [
  { key: "revenue_usd", label: "Revenue" },
  { key: "gross_margin_pct", label: "Gross Margin" },
  { key: "market_cap", label: "Market Cap" },
  { key: "revenue_growth_yoy", label: "Growth" },
];

function normalize(companies: CompanyDataPoint[]) {
  // For each dimension find the max, then score each company 0–100
  const maxes: Partial<Record<keyof CompanyDataPoint, number>> = {};
  for (const dim of DIMENSIONS) {
    const vals = companies
      .map((c) => {
        const raw = c[dim.key];
        return typeof raw === "number" ? Math.abs(raw) : null;
      })
      .filter((v): v is number => v !== null);
    maxes[dim.key] = vals.length ? Math.max(...vals) : 1;
  }

  return companies.map((c) => {
    const row: Record<string, number | string> = { company: `${c.name} (${c.ticker})` };
    for (const dim of DIMENSIONS) {
      const raw = c[dim.key];
      const max = maxes[dim.key] ?? 1;
      row[dim.label] =
        typeof raw === "number" && max > 0
          ? Math.round((Math.abs(raw) / max) * 100)
          : 0;
    }
    return row;
  });
}

export default function CompetitorRadarChart({ companies }: CompetitorRadarChartProps) {
  // Only keep companies that have at least two data dimensions
  const valid = companies.filter(
    (c) => DIMENSIONS.filter((d) => c[d.key] != null).length >= 2
  );

  if (valid.length < 2) {
    return (
      <div className="flex items-center justify-center h-20 rounded-lg bg-slate-50 border border-slate-100">
        <p className="text-[12px] text-slate-400">Competitor data unavailable</p>
      </div>
    );
  }

  const normalized = normalize(valid);

  // recharts RadarChart expects data = [{subject, co1, co2, ...}]
  const chartData = DIMENSIONS.map((dim) => {
    const row: Record<string, number | string> = { subject: dim.label };
    normalized.forEach((n, i) => {
      row[`co${i}`] = n[dim.label] as number;
    });
    return row;
  });

  return (
    <div className="space-y-1">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e2e8f0" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${value} / 100`, ""]}
          />
          {normalized.map((n, i) => (
            <Radar
              key={i}
              name={n.company as string}
              dataKey={`co${i}`}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.12}
              dot={false}
            />
          ))}
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-slate-400">
        Scores normalised 0–100 per dimension · Live data via yfinance
      </p>
    </div>
  );
}
