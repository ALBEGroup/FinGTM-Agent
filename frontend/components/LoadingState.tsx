// Agent workflow timeline — shown while DeepSeek generates the 16-section GTM report
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const WORKFLOW_STAGES = [
  { id: "validate",    label: "Validating inputs & initialising agent" },
  { id: "positioning", label: "Analysing product positioning" },
  { id: "icp",         label: "Mapping target market and ICP" },
  { id: "personas",    label: "Building buyer personas" },
  { id: "messaging",   label: "Generating sales messaging framework" },
  { id: "outreach",    label: "Writing outbound sequences" },
  { id: "playbook",    label: "Drafting objection playbook & GTM plan" },
  { id: "assembly",    label: "Assembling final 16-section report" },
];

// Cumulative seconds at which each stage becomes active
const STAGE_START_TIMES = [0, 5, 14, 25, 38, 52, 66, 80];

export default function LoadingState() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeIndex = STAGE_START_TIMES.reduce(
    (acc, startAt, i) => (elapsed >= startAt ? i : acc),
    0
  );

  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  const timeStr = mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Generating GTM Pack
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            DeepSeek agent · 16 sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-500">
            {timeStr} elapsed
          </span>
        </div>
      </div>

      {/* Agent workflow timeline */}
      <div className="px-6 py-6 space-y-4">
        {WORKFLOW_STAGES.map((stage, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;

          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-4">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-200" />
                )}
              </div>
              <span
                className={`text-[13px] leading-snug transition-colors duration-300 ${
                  isCompleted
                    ? "text-slate-400 line-through decoration-slate-300"
                    : isActive
                    ? "text-slate-900 font-medium"
                    : "text-slate-300"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60">
        <p className="text-[11px] text-slate-400 text-center">
          Typically 45–90 seconds · Complex inputs may take longer
        </p>
      </div>
    </div>
  );
}
