// Download the GTM report as a Markdown file
"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  content: string;
  filename?: string;
  className?: string;
}

export default function DownloadButton({
  content,
  filename = "gtm-report.md",
  className = "",
}: DownloadButtonProps) {
  function handleDownload() {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-150 ${className}`}
    >
      <Download className="h-3.5 w-3.5" />
      Download .md
    </button>
  );
}
