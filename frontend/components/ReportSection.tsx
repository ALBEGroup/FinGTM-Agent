// Individual GTM report section card — collapsible with section-type icon and per-section copy
"use client";

import { useState } from "react";
import {
  ChevronDown,
  BarChart2,
  Target,
  Globe,
  Users,
  UserCheck,
  Zap,
  TrendingUp,
  Shield,
  Gem,
  DollarSign,
  MessageSquare,
  Share2,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyButton from "./CopyButton";

// Icon for each section (1-indexed, maps to sections 1–16)
const SECTION_ICONS: LucideIcon[] = [
  BarChart2,    // 1. Executive GTM Summary
  Target,       // 2. Product Positioning
  Globe,        // 3. Target Market Overview
  Users,        // 4. Ideal Customer Profile
  UserCheck,    // 5. Buyer Personas
  Zap,          // 6. Pain Points & Buying Triggers
  TrendingUp,   // 7. Value Proposition
  Shield,       // 8. Competitive Landscape
  Gem,          // 9. Differentiation Strategy
  DollarSign,   // 10. Pricing and Packaging
  MessageSquare,// 11. Sales Messaging Framework
  Share2,       // 12. LinkedIn Outreach
  Mail,         // 13. Cold Email Sequence
  Phone,        // 14. Discovery Call Questions
  ShieldCheck,  // 15. Objection Handling Playbook
  Calendar,     // 16. GTM Action Plan
];

interface ReportSectionProps {
  title: string;
  content: string;
  index: number;
  defaultOpen?: boolean;
}

export default function ReportSection({
  title,
  content,
  index,
  defaultOpen = true,
}: ReportSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = SECTION_ICONS[index - 1] ?? BarChart2;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
      {/* Section header / toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50/80 transition-colors"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-slate-500" />
        </div>

        {/* Index + title */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <span className="text-[10px] font-bold text-slate-300 flex-shrink-0 tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-medium text-slate-800 truncate">
            {title}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="markdown-body mt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <CopyButton text={content} label="Copy Section" />
          </div>
        </div>
      )}
    </div>
  );
}
