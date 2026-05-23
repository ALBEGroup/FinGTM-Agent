// Top nav + sidebar layout shell
"use client";

import { useState } from "react";
import { Zap, Github, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6f8]">
      {/* Left sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right column: header + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top nav */}
        <header className="flex-shrink-0 z-20 bg-white border-b border-slate-200/80 h-[52px] flex items-center px-4 gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Logo — desktop hidden (sidebar has it), mobile visible */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap className="text-white h-3 w-3" />
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">
              FinGTM Agent
            </span>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-800">
              GTM Workspace
            </span>
            <span className="h-3.5 w-px bg-slate-200 mx-0.5" />
            <span className="text-[12px] text-slate-400">B2B FinTech</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Status badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DeepSeek-powered
          </span>

          {/* GitHub */}
          <a
            href="https://github.com/ALBEGroup/FinGTM-Agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </header>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
