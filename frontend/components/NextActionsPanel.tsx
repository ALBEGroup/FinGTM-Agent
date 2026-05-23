"use client";

import {
  ArrowRight,
  ClipboardCopy,
  Download,
  Users,
  Globe,
  Zap,
  ShieldCheck,
  FileText,
} from "lucide-react";
import type { GenerationState } from "@/lib/types";

interface Action {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

interface NextActionsPanelProps {
  state: GenerationState;
  onLoadSample?: () => void;
  onDownload?: () => void;
}

export default function NextActionsPanel({
  state,
  onLoadSample,
  onDownload,
}: NextActionsPanelProps) {
  const isSuccess = state === "success";

  const idleActions: Action[] = [
    {
      icon: Zap,
      label: "Complete product inputs",
    },
    {
      icon: ClipboardCopy,
      label: "Load PayFlow sample",
      onClick: onLoadSample,
    },
    {
      icon: FileText,
      label: "Generate GTM pack",
    },
  ];

  const successActions: Action[] = [
    {
      icon: ShieldCheck,
      label: "Review trust-sensitive claims",
    },
    {
      icon: ClipboardCopy,
      label: "Copy SDR outbound sequence",
    },
    {
      icon: Download,
      label: "Export sales one-pager",
      onClick: onDownload,
    },
    {
      icon: Users,
      label: "Validate ICP with 10 target accounts",
    },
    {
      icon: Globe,
      label: "Turn landing copy into a page",
    },
  ];

  const actions = isSuccess ? successActions : idleActions;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
          Recommended Next Actions
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            isSuccess
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSuccess ? "bg-emerald-400" : "bg-slate-300"
            }`}
          />
          {isSuccess ? "Ready" : "Suggested"}
        </span>
      </div>

      {/* Action rows */}
      <div className="divide-y divide-slate-100">
        {actions.map((action) => {
          const Icon = action.icon;
          const isClickable = !!action.onClick;
          const Tag = isClickable ? "button" : "div";
          return (
            <Tag
              key={action.label}
              onClick={action.onClick}
              className={[
                "w-full flex items-center gap-2.5 px-4 py-2.5 text-left",
                isClickable
                  ? "hover:bg-slate-50 transition-colors cursor-pointer group"
                  : "cursor-default",
              ].join(" ")}
            >
              <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon className="h-3 w-3 text-slate-500" />
              </div>
              <span className="flex-1 text-[12px] text-slate-700 leading-snug min-w-0">
                {action.label}
              </span>
              {isClickable && (
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
              )}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
