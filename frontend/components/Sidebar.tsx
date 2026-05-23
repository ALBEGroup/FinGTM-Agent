// Left workspace sidebar — fixed 220px on desktop, slide-in overlay on mobile
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Send,
  Briefcase,
  ShieldCheck,
  Download,
  X,
  Zap,
  Lock,
} from "lucide-react";
import { saveDemoToken } from "@/lib/api";

const NAV_ITEMS = [
  { id: "overview",  icon: LayoutDashboard, label: "Overview",       anchor: "workspace-overview" },
  { id: "inputs",    icon: FileText,        label: "Product Inputs",  anchor: "workspace-inputs" },
  { id: "icp",       icon: Users,           label: "ICP & Buyers",   anchor: "workspace-report" },
  { id: "messaging", icon: MessageSquare,   label: "Messaging",       anchor: "workspace-report" },
  { id: "outbound",  icon: Send,            label: "Outbound",        anchor: "workspace-report" },
  { id: "sales",     icon: Briefcase,       label: "Sales Assets",   anchor: "workspace-report" },
  { id: "trust",     icon: ShieldCheck,     label: "Trust Review",   anchor: "workspace-trust" },
  { id: "export",    icon: Download,        label: "Export",          anchor: "workspace-export" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function scrollTo(anchorId: string) {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [demoToken, setDemoToken] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("fingtm_demo_access_token") ?? "";
    setDemoToken(stored);
  }, []);

  function handleTokenChange(val: string) {
    setDemoToken(val);
    saveDemoToken(val);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 h-screen w-[220px] bg-white border-r border-slate-200",
          "flex flex-col z-40 transition-transform duration-200 ease-in-out will-change-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0",
        ].join(" ")}
        aria-label="Workspace navigation"
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-4 h-[52px] border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap className="text-white h-[13px] w-[13px]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-900 tracking-tight">
              FinGTM Agent
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto" aria-label="Workspace sections">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to ${item.label}`}
              onClick={() => scrollTo(item.anchor)}
              className={[
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg",
                "text-[13px] transition-colors duration-100 text-left",
                i === 0
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <item.icon
                className={`h-4 w-4 flex-shrink-0 ${
                  i === 0 ? "text-blue-600" : "text-slate-400"
                }`}
              />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Demo access token input */}
        <div className="px-2.5 pt-2.5 pb-0 border-t border-slate-100 flex-shrink-0">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock className={`h-3 w-3 flex-shrink-0 ${demoToken ? "text-emerald-500" : "text-slate-400"}`} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Demo Token
              </span>
            </div>
            <input
              type="password"
              value={demoToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="Optional access token"
              aria-label="Demo access token"
              className="w-full px-2 py-1 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-md placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-300 transition-all"
            />
          </div>
        </div>

        {/* Bottom workspace card */}
        <div className="px-2.5 py-2.5 flex-shrink-0">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Workspace
            </div>
            <div className="text-[13px] font-medium text-slate-700 leading-snug">
              FinGTM Demo
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Local project
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
