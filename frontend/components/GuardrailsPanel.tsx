"use client";

import { ShieldCheck } from "lucide-react";
import type { GenerationState } from "@/lib/types";

const RULES = [
  "No guaranteed revenue claims",
  "No unsupported compliance claims",
  "No fake security certifications",
  "AI accuracy wording reviewed",
  "Financial advisory risk avoided",
];

interface GuardrailsPanelProps {
  state: GenerationState;
}

export default function GuardrailsPanel({ state }: GuardrailsPanelProps) {
  const isSuccess = state === "success";
  const isLoading = state === "loading";

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            FinTech Guardrails
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
            isSuccess
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isSuccess
                ? "bg-emerald-400"
                : isLoading
                ? "bg-blue-300 animate-pulse"
                : "bg-slate-300"
            }`}
          />
          {isSuccess ? "Included in report" : "Runs after generation"}
        </span>
      </div>

      {/* Rules list */}
      <div className="px-4 py-3 space-y-2">
        {RULES.map((rule) => (
          <div key={rule} className="flex items-center gap-2.5">
            <div
              className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                isSuccess
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isSuccess ? "bg-emerald-400" : "bg-slate-300"
                }`}
              />
            </div>
            <span
              className={`text-[11px] leading-snug transition-colors ${
                isSuccess ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {rule}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
