"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const LOADING_MESSAGES = [
  "Analysing product positioning...",
  "Mapping ICP and buyer pains...",
  "Crafting value propositions...",
  "Generating landing page copy...",
  "Writing LinkedIn content...",
  "Building cold outreach sequences...",
  "Designing pricing packages...",
  "Generating GTM assets...",
  "Running compliance check...",
  "Finalising your marketing pack...",
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      {/* Animated icon */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-2 border-slate-200 border-t-slate-700 absolute inset-0"
        />
        <div className="w-16 h-16 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-slate-500" />
        </div>
      </div>

      {/* Status label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Generating your marketing pack
      </p>

      {/* Rotating message */}
      <div className="h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="text-sm text-slate-600 text-center"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-300"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-8 text-center max-w-xs">
        DeepSeek is generating 12 sections of marketing content. This may take
        30–90 seconds depending on product complexity.
      </p>
    </div>
  );
}
