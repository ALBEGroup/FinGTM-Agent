// Top navigation bar and page shell
import { Zap, Github } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap className="text-white" style={{ height: 18, width: 18 }} />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-slate-900 text-[15px] tracking-tight">
                FinGTM Agent
              </span>
              <span className="hidden sm:block text-slate-300">·</span>
              <span className="hidden sm:block text-xs text-slate-500">
                B2B FinTech GTM Copilot
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              DeepSeek-powered
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Turn a B2B FinTech SaaS idea into a complete GTM pack
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Generate ICP, buyer committee mapping, positioning, outbound sequences,
              sales enablement assets, pricing packages, and trust messaging in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">{children}</div>
    </div>
  );
}
