// Individual GTM report section card with collapsible content
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
          {index}
        </span>
        <span className="flex-1 text-sm font-semibold text-slate-800">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="gtm-prose mt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
