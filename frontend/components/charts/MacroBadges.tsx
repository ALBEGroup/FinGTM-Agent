"use client";

import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import type { MacroSnapshot } from "@/lib/types";

interface MacroBadgesProps {
  macro: MacroSnapshot;
}

function fmt(value: number, isPercent: boolean): string {
  if (isPercent) return `${value.toFixed(1)}%`;
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export default function MacroBadges({ macro }: MacroBadgesProps) {
  const badges = [
    {
      key: "ffr",
      label: "Fed Funds Rate",
      value: macro.federal_funds_rate,
      isPercent: true,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      key: "cpi",
      label: "CPI Inflation",
      value: macro.cpi_inflation,
      isPercent: false,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      key: "gdp",
      label: "GDP Growth",
      value: macro.gdp_growth_rate,
      isPercent: true,
      icon: BarChart2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  ].filter((b) => b.value != null);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {badges.map(({ key, label, value, isPercent, icon: Icon, color, bg, border }) => (
        <div
          key={key}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${bg} ${border}`}
        >
          <div className={`flex-shrink-0 w-6 h-6 rounded-md ${bg} flex items-center justify-center`}>
            <Icon className={`h-3.5 w-3.5 ${color}`} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 leading-none mb-0.5">{label}</p>
            <p className={`text-[13px] font-semibold leading-none ${color}`}>
              {fmt(value!, isPercent)}
            </p>
          </div>
        </div>
      ))}
      <p className="w-full text-[10px] text-slate-400 mt-0.5">
        Live macro data · FRED
      </p>
    </div>
  );
}
