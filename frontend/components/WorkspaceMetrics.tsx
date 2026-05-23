"use client";

import { BarChart2, Users, FileText, ShieldCheck } from "lucide-react";
import type { GenerationState } from "@/lib/types";

interface Metric {
  label: string;
  icon: React.ElementType;
  idleStatus: string;
  loadingStatus: string;
  successStatus: string;
  successSubtitle: string;
  successColor: string;
  successIconBg: string;
}

const METRICS: Metric[] = [
  {
    label: "GTM Readiness",
    icon: BarChart2,
    idleStatus: "Waiting",
    loadingStatus: "Generating…",
    successStatus: "Ready",
    successSubtitle: "16 sections generated",
    successColor: "text-emerald-700",
    successIconBg: "bg-emerald-50",
  },
  {
    label: "ICP Clarity",
    icon: Users,
    idleStatus: "Pending",
    loadingStatus: "Mapping…",
    successStatus: "Mapped",
    successSubtitle: "Buyer roles and segments defined",
    successColor: "text-blue-700",
    successIconBg: "bg-blue-50",
  },
  {
    label: "Sales Assets",
    icon: FileText,
    idleStatus: "Pending",
    loadingStatus: "Drafting…",
    successStatus: "Generated",
    successSubtitle: "Outbound, discovery and objections ready",
    successColor: "text-violet-700",
    successIconBg: "bg-violet-50",
  },
  {
    label: "Trust Review",
    icon: ShieldCheck,
    idleStatus: "Pending",
    loadingStatus: "Scanning…",
    successStatus: "Included",
    successSubtitle: "FinTech-sensitive claims checked",
    successColor: "text-amber-700",
    successIconBg: "bg-amber-50",
  },
];

interface WorkspaceMetricsProps {
  state: GenerationState;
}

export default function WorkspaceMetrics({ state }: WorkspaceMetricsProps) {
  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {METRICS.map((metric) => {
        const Icon = metric.icon;

        const statusText = isSuccess
          ? metric.successStatus
          : isLoading
          ? metric.loadingStatus
          : metric.idleStatus;

        const dotColor = isSuccess
          ? "bg-emerald-400"
          : isLoading
          ? "bg-blue-400 animate-pulse"
          : isError
          ? "bg-red-400"
          : "bg-slate-200";

        const statusColor = isSuccess
          ? metric.successColor
          : isError
          ? "text-red-500"
          : "text-slate-400";

        const iconBg = isSuccess ? metric.successIconBg : "bg-slate-100";
        const iconColor = isSuccess ? metric.successColor : "text-slate-400";

        return (
          <div
            key={metric.label}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-3 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${iconBg}`}
            >
              <Icon className={`h-4 w-4 transition-colors ${iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide leading-none mb-1.5">
                {metric.label}
              </div>
              <div className={`flex items-center gap-1.5 ${statusColor}`}>
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`}
                />
                <span className="text-[13px] font-semibold leading-none">
                  {statusText}
                </span>
              </div>
              {isSuccess && (
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {metric.successSubtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
