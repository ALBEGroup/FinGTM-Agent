"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X } from "lucide-react";
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
import type { ProductInput, GenerationState, GTMStructured } from "@/lib/types";

const LS_REPORT_KEY = "fingtm_last_report";
const LS_DATE_KEY = "fingtm_last_generated_at";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function HomePage() {
  const [state, setState] = useState<GenerationState>("idle");
  const [markdown, setMarkdown] = useState<string>("");
  const [structured, setStructured] = useState<GTMStructured | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadSampleSignal, setLoadSampleSignal] = useState(0);

  // localStorage restore banner
  const [restoreMarkdown, setRestoreMarkdown] = useState<string | null>(null);
  const [restoreDate, setRestoreDate] = useState<string>("");

  const abortRef = useRef<AbortController | null>(null);

  // On mount: check for a previously saved report
  useEffect(() => {
    const saved = localStorage.getItem(LS_REPORT_KEY);
    const savedAt = localStorage.getItem(LS_DATE_KEY);
    if (saved && saved.trim()) {
      setRestoreMarkdown(saved);
      setRestoreDate(savedAt ? formatDate(savedAt) : "");
    }
  }, []);

  function handleRestore() {
    if (!restoreMarkdown) return;
    setMarkdown(restoreMarkdown);
    setState("success");
    setRestoreMarkdown(null);
  }

  function handleDismissRestore() {
    localStorage.removeItem(LS_REPORT_KEY);
    localStorage.removeItem(LS_DATE_KEY);
    setRestoreMarkdown(null);
  }

  async function handleGenerate(input: ProductInput) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState("loading");
    setMarkdown("");
    setStructured(undefined);
    setErrorMessage("");
    // Hide restore banner once user starts generating
    setRestoreMarkdown(null);

    const result = await generateGTMPack(input, controller.signal);

    if (controller.signal.aborted) return;

    if (result.success) {
      setMarkdown(result.markdown);
      setStructured(result.structured);
      setState("success");
      // Persist to localStorage
      localStorage.setItem(LS_REPORT_KEY, result.markdown);
      localStorage.setItem(LS_DATE_KEY, new Date().toISOString());
    } else {
      setErrorMessage(result.error);
      setState("error");
    }
  }

  function handleReset() {
    abortRef.current?.abort();
    abortRef.current = null;
    setState("idle");
    setMarkdown("");
    setStructured(undefined);
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
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  return (
    <AppShell>
      {/* Workspace descriptor bar */}
      <div id="workspace-overview" className="py-4 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h1 className="text-[14px] font-semibold text-slate-800 leading-snug">
              Build a B2B FinTech GTM Pack
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              Map ICP, buyer committee, positioning, outbound sequences, and trust messaging — 16 sections in one run.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-500 flex-shrink-0 self-start sm:self-auto">
            DeepSeek · 16 sections
          </span>
        </div>
      </div>

      {/* Restore banner — only shown when a previous report exists and user is idle */}
      {restoreMarkdown && state === "idle" && (
        <div className="pt-3">
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <History className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[13px] font-medium text-amber-800">
                  A previous GTM pack is available
                </span>
                {restoreDate && (
                  <span className="text-[11px] text-amber-600 ml-2">
                    {restoreDate}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleRestore}
                className="px-3 py-1.5 text-[12px] font-medium rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={handleDismissRestore}
                aria-label="Dismiss restore banner"
                className="p-1.5 rounded-md text-amber-500 hover:bg-amber-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI metrics bar */}
      <div className="py-4">
        <WorkspaceMetrics state={state} />
      </div>

      {/* Two-column workspace */}
      <div className="flex flex-col lg:flex-row gap-5 pb-8">
        {/* Left: input panel — sticky */}
        <aside id="workspace-inputs" className="w-full lg:w-[380px] lg:flex-shrink-0">
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
          {/* Persistent context panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NextActionsPanel
              state={state}
              onLoadSample={() => setLoadSampleSignal((s) => s + 1)}
              onDownload={state === "success" ? handleDownload : undefined}
            />
            <div id="workspace-trust">
              <GuardrailsPanel state={state} />
            </div>
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
                <GTMReport markdown={markdown} onRegenerate={handleReset} structured={structured} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppShell>
  );
}
