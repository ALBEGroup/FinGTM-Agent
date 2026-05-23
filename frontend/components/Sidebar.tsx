// Left workspace sidebar — fixed 220px on desktop, slide-in overlay on mobile
"use client";

import { useEffect } from "react";
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
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview",  icon: LayoutDashboard, label: "Overview",       active: true },
  { id: "inputs",    icon: FileText,        label: "Product Inputs" },
  { id: "icp",       icon: Users,           label: "ICP & Buyers" },
  { id: "messaging", icon: MessageSquare,   label: "Messaging" },
  { id: "outbound",  icon: Send,            label: "Outbound" },
  { id: "sales",     icon: Briefcase,       label: "Sales Assets" },
  { id: "trust",     icon: ShieldCheck,     label: "Trust Review" },
  { id: "export",    icon: Download,        label: "Export" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Close on Escape key
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
      >
        {/* Logo row — matches main header height */}
        <div className="flex items-center justify-between px-4 h-[52px] border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap className="text-white h-[13px] w-[13px]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-900 tracking-tight">
              FinGTM Agent
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={[
                "flex items-center gap-2.5 px-3 py-2 rounded-lg select-none cursor-default",
                "text-[13px] transition-colors duration-100",
                item.active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <item.icon
                className={`h-4 w-4 flex-shrink-0 ${
                  item.active ? "text-blue-600" : "text-slate-400"
                }`}
              />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Bottom workspace card */}
        <div className="px-2.5 py-3 border-t border-slate-100 flex-shrink-0">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Workspace
            </div>
            <div className="text-[13px] font-medium text-slate-700 leading-snug">
              FinGTM Demo
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Local project
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
