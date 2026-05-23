// Main application page — orchestrates state and layout
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import ProductInputForm from "@/components/ProductInputForm";
import GTMReport from "@/components/GTMReport";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { generateGTMPack } from "@/lib/api";
import type { ProductInput, GenerationState } from "@/lib/types";

export default function HomePage() {
  const [state, setState] = useState<GenerationState>("idle");
  const [markdown, setMarkdown] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-4rem)] py-6">
        {/* Left: Input Form */}
        <aside className="w-full lg:w-[420px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <ProductInputForm
              onSubmit={handleGenerate}
              isLoading={state === "loading"}
            />
          </div>
        </aside>

        {/* Right: Report Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <EmptyState />
              </motion.div>
            )}
            {state === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <LoadingState />
              </motion.div>
            )}
            {state === "error" && (
              <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <ErrorState message={errorMessage} onRetry={handleReset} />
              </motion.div>
            )}
            {state === "success" && markdown && (
              <motion.div key="report" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <GTMReport markdown={markdown} onRegenerate={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppShell>
  );
}
