"use client";

import { motion } from "framer-motion";
import { FileText, Target, Mail, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    label: "Product Positioning",
    description: "ICP analysis, value props, differentiation",
  },
  {
    icon: FileText,
    label: "Landing Page Copy",
    description: "Hero, features, trust, FAQ, CTA sections",
  },
  {
    icon: Mail,
    label: "Cold Outreach",
    description: "Emails, LinkedIn messages, objection replies",
  },
  {
    icon: BarChart3,
    label: "Sales Enablement",
    description: "One-pager, pricing packages, Q&A",
  },
];

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      {/* Icon grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 max-w-xs w-full">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-card"
          >
            <feature.icon className="h-5 w-5 text-slate-400 mb-2" />
            <p className="text-xs font-semibold text-slate-700">
              {feature.label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-slate-700 mb-2">
        Your marketing pack will appear here
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-sm leading-relaxed">
        Fill in your product details on the left and click{" "}
        <span className="font-medium text-slate-700">
          Generate Marketing Pack
        </span>{" "}
        to generate 12 sections of professional B2B FinTech marketing content.
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Powered by DeepSeek — no OpenAI key required</span>
      </div>
    </motion.div>
  );
}
