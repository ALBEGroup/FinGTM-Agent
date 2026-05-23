// GTM workspace idle state — shown before generation, displays module cards, report structure, and trust guardrails
"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Mail, ShieldCheck } from "lucide-react";


// Four GTM workflow modules — each maps to a cluster of report sections
const GTM_MODULES = [
  {
    icon: Users,
    title: "ICP & Buyer Committee",
    description:
      "Define the target account, buyer roles, pains, objections, and decision criteria.",
    count: 5,
  },
  {
    icon: MessageSquare,
    title: "Pain-to-Value Messaging",
    description:
      "Translate business pains into value messages, proof points, and product capabilities.",
    count: 4,
  },
  {
    icon: Mail,
    title: "Outbound & Sales Assets",
    description:
      "Generate SDR emails, LinkedIn sequences, discovery questions, and sales messaging.",
    count: 4,
  },
  {
    icon: ShieldCheck,
    title: "Trust & Commercial Readiness",
    description:
      "Review security-sensitive claims, pricing logic, objections, and GTM launch plan.",
    count: 3,
  },
];

// Report sections grouped by theme for the navigator preview
const REPORT_GROUPS = [
  {
    label: "Market Intelligence",
    dot: "bg-blue-500",
    sections: [
      "Executive GTM Summary",
      "Product Positioning",
      "Target Market Overview",
      "Ideal Customer Profile (ICP)",
      "Buyer Personas",
    ],
  },
  {
    label: "Messaging",
    dot: "bg-violet-500",
    sections: [
      "Pain Points & Buying Triggers",
      "Value Proposition",
      "Competitive Landscape",
      "Differentiation Strategy",
    ],
  },
  {
    label: "Sales & Outreach",
    dot: "bg-amber-500",
    sections: [
      "Sales Messaging Framework",
      "LinkedIn Outreach",
      "Cold Email Sequence",
      "Discovery Call Questions",
    ],
  },
  {
    label: "Commercial",
    dot: "bg-emerald-500",
    sections: [
      "Objection Handling Playbook",
      "Pricing and Packaging",
      "GTM Action Plan (30/60/90 Days)",
    ],
  },
];


export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-3"
    >
      {/* Workspace status bar */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            GTM Workspace
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Fill in product inputs on the left to generate your structured GTM
            pack.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          Waiting for input
        </span>
      </div>

      {/* GTM module cards — 2×2 grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {GTM_MODULES.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                <mod.icon className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                {mod.count} sections
              </span>
            </div>
            <h3 className="text-[12px] font-semibold text-slate-800 mb-1 leading-snug">
              {mod.title}
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {mod.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Report structure navigator */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-slate-700">
            GTM Pack Structure
          </span>
          <span className="text-[11px] text-slate-400">16 sections</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-4">
          {REPORT_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-1.5 mb-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${group.dot}`}
                />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {group.label}
                </span>
              </div>
              <div className="space-y-1">
                {group.sections.map((section) => (
                  <div key={section} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-200 flex-shrink-0" />
                    <span className="text-[11px] text-slate-400 leading-snug truncate">
                      {section}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
