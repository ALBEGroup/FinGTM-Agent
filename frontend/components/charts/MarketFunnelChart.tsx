"use client";

import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MarketSizeSection } from "@/lib/types";

interface MarketFunnelChartProps {
  marketSize: MarketSizeSection;
}

function fmtBillion(v?: number): string {
  if (v == null) return "—";
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}T`;
  return `$${v.toFixed(1)}B`;
}

export default function MarketFunnelChart({ marketSize }: MarketFunnelChartProps) {
  const { tam_usd_billion, sam_usd_billion, som_usd_billion, tam_assumption } = marketSize;

  if (tam_usd_billion == null && sam_usd_billion == null && som_usd_billion == null) {
    return (
      <div className="flex items-center justify-center h-20 rounded-lg bg-slate-50 border border-slate-100">
        <p className="text-[12px] text-slate-400">Market size data unavailable</p>
      </div>
    );
  }

  const layers = [
    { name: "TAM", value: tam_usd_billion, fill: "#3b82f6" },
    { name: "SAM", value: sam_usd_billion ?? (tam_usd_billion ? tam_usd_billion * 0.3 : undefined), fill: "#6366f1" },
    { name: "SOM", value: som_usd_billion ?? (tam_usd_billion ? tam_usd_billion * 0.05 : undefined), fill: "#8b5cf6" },
  ].filter((l) => l.value != null) as { name: string; value: number; fill: string }[];

  if (layers.length === 0) return null;

  // recharts Funnel renders largest→smallest automatically; sort descending to be safe
  layers.sort((a, b) => b.value - a.value);

  const data = layers.map((l) => ({
    ...l,
    label: `${l.name}  ${fmtBillion(l.value)}`,
  }));

  return (
    <div className="space-y-1">
      <ResponsiveContainer width="100%" height={200}>
        <FunnelChart>
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [fmtBillion(typeof value === "number" ? value : undefined), ""]}
            contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e2e8f0" }}
          />
          <Funnel dataKey="value" data={data} isAnimationActive={false}>
            <LabelList
              position="right"
              fill="#475569"
              stroke="none"
              dataKey="label"
              style={{ fontSize: 11 }}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      {tam_assumption && (
        <p className="text-[10px] text-slate-400">
          * Market size figures are estimates [ASSUMPTION]
        </p>
      )}
    </div>
  );
}
