"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import ProductInputForm from "@/components/ProductInputForm";
import GTMReport from "@/components/GTMReport";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import WorkspaceMetrics from "@/components/WorkspaceMetrics";
import NextActionsPanel from "@/components/NextActionsPanel";
import GuardrailsPanel from "@/components/GuardrailsPanel";
import { generateGTMPack } from "@/lib/api";
import type { ProductInput, GenerationState } from "@/lib/types";

export default function HomePage() {
  const [state, setState] = useState<GenerationState>("idle");
  const [markdown, setMarkdown] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadSampleSignal, setLoadSampleSignal] = useState(0);

  async function handleGenerate(input: ProductInput) {
    setState("loading");
    setMarkdown("");
    setErrorMessage("");

    const result = await generateGTMPack(input);

    if (result.success && result.markdown) {
      setMarkdown(result.markdown);
      setState("success");
    } else {
      setErrorMessage(result.error ?? "Unknown error occurred.");
      setState("error");
    }
  }

  function handleReset() {
    setState("idle");
    setMarkdown("");
    setErrorMessage("");
  }

  function handleDownload() {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fingtm-report.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      {/* Workspace descriptor bar */}
      <div className="py-4 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h1 className="text-[14px] font-semibold text-slate-800 leading-snug">
              Build a B2B FinTech GTM Pack
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              Map ICP, buyer committee, positioning, outbound sequences, and trust messaging — 16 sections in one run.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-500 flex-shrink-0 self-start sm:self-auto">
            DeepSeek · 16 sections
          </span>
        </div>
      </div>

      {/* KPI metrics bar */}
      <div className="py-4">
        <WorkspaceMetrics state={state} />
      </div>

      {/* Two-column workspace */}
      <div className="flex flex-col lg:flex-row gap-5 pb-8">
        {/* Left: input panel only — sticky */}
        <aside className="w-full lg:w-[380px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <ProductInputForm
              onSubmit={handleGenerate}
              isLoading={state === "loading"}
              loadSampleSignal={loadSampleSignal}
            />
          </div>
        </aside>

        {/* Right: context panels + state-driven content */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Persistent context panels — always visible, change with state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NextActionsPanel
              state={state}
              onLoadSample={() => setLoadSampleSignal((s) => s + 1)}
              onDownload={state === "success" ? handleDownload : undefined}
            />
            <GuardrailsPanel state={state} />
          </div>

          {/* State-driven workspace content */}
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <EmptyState />
              </motion.div>
            )}

            {state === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingState />
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorState message={errorMessage} onRetry={handleReset} />
              </motion.div>
            )}

            {state === "success" && markdown && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GTMReport markdown={markdown} onRegenerate={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppShell>
  );
}
