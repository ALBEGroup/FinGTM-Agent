// Product input form with 16 fields grouped into collapsible sections
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trash2, FlaskConical, Loader2, ChevronDown } from "lucide-react";
import type { ProductInput } from "@/lib/types";
import { PAYFLOW_SAMPLE, EMPTY_FORM } from "@/lib/sampleData";

interface ProductInputFormProps {
  onSubmit: (input: ProductInput) => void;
  isLoading: boolean;
}

const FORM_SECTIONS = [
  {
    title: "Product Basics",
    fields: [
      { key: "product_name" as keyof ProductInput, label: "Product Name", type: "text" as const, placeholder: "e.g. PayFlow AI" },
      { key: "product_category" as keyof ProductInput, label: "Product Category", type: "textarea" as const, placeholder: "e.g. B2B SaaS FinTech platform for invoice tracking and cash flow insights", rows: 2 },
    ],
  },
  {
    title: "Target Audience",
    fields: [
      { key: "target_company_size" as keyof ProductInput, label: "Target Company Size", type: "text" as const, placeholder: "e.g. SMBs with 10-200 employees" },
      { key: "target_industry" as keyof ProductInput, label: "Target Industry", type: "text" as const, placeholder: "e.g. SaaS companies, agencies, B2B service businesses" },
      { key: "primary_buyer_persona" as keyof ProductInput, label: "Primary Buyer Persona", type: "text" as const, placeholder: "e.g. Founder, CFO, Finance Manager" },
      { key: "end_user_persona" as keyof ProductInput, label: "End User Persona", type: "text" as const, placeholder: "e.g. Finance team, accounts receivable staff" },
    ],
  },
  {
    title: "Sales & Market",
    fields: [
      { key: "sales_motion" as keyof ProductInput, label: "Sales Motion", type: "text" as const, placeholder: "e.g. Founder-led + SDR outbound + PLG self-serve" },
      { key: "current_alternatives" as keyof ProductInput, label: "Current Alternatives", type: "textarea" as const, placeholder: "e.g. Excel, Xero, QuickBooks, Stripe dashboard, manual email", rows: 2 },
      { key: "target_market" as keyof ProductInput, label: "Target Market / Geography", type: "text" as const, placeholder: "e.g. Australia, Singapore, UK, US SaaS market" },
      { key: "tone" as keyof ProductInput, label: "Tone", type: "text" as const, placeholder: "e.g. Professional, clear, modern B2B SaaS style" },
    ],
  },
  {
    title: "Product Details",
    fields: [
      { key: "core_business_problem" as keyof ProductInput, label: "Core Business Problem", type: "textarea" as const, placeholder: "What pain does this product solve? Be specific about workflow and business impact.", rows: 3 },
      { key: "buying_trigger" as keyof ProductInput, label: "Buying Trigger", type: "textarea" as const, placeholder: "What event or condition makes a company ready to buy right now?", rows: 2 },
      { key: "key_features" as keyof ProductInput, label: "Key Features", type: "textarea" as const, placeholder: "List the main product capabilities (one per line)", rows: 4 },
      { key: "integration_requirements" as keyof ProductInput, label: "Integration Requirements", type: "text" as const, placeholder: "e.g. Stripe, Xero, QuickBooks, CSV import/export" },
    ],
  },
  {
    title: "Commercial",
    fields: [
      { key: "security_compliance_sensitivity" as keyof ProductInput, label: "Security / Compliance Sensitivity", type: "textarea" as const, placeholder: "Describe data sensitivity and any compliance considerations", rows: 2 },
      { key: "pricing_assumption" as keyof ProductInput, label: "Pricing Assumption", type: "textarea" as const, placeholder: "e.g. Starter $29-49/mo, Growth $99-199/mo, Pro custom", rows: 2 },
    ],
  },
];

function FormField({
  field,
  value,
  onChange,
}: {
  field: { key: keyof ProductInput; label: string; type: "text" | "textarea"; placeholder: string; rows?: number };
  value: string;
  onChange: (val: string) => void;
}) {
  const baseClass =
    "w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          className={`${baseClass} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 py-4 space-y-3.5 bg-white">{children}</div>}
    </div>
  );
}

export default function ProductInputForm({ onSubmit, isLoading }: ProductInputFormProps) {
  const [formData, setFormData] = useState<ProductInput>(EMPTY_FORM);

  function updateField(key: keyof ProductInput, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const missing = (Object.entries(formData) as [keyof ProductInput, string][]).find(([, v]) => !v.trim());
    if (missing) {
      alert(`Please fill in: ${String(missing[0]).replace(/_/g, " ")}`);
      return;
    }
    onSubmit(formData);
  }

  const filledCount = Object.values(formData).filter((v) => v.trim()).length;
  const totalFields = Object.keys(formData).length;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-slate-900">Product Details</h2>
          <span className="text-xs text-slate-400">{filledCount}/{totalFields} fields</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${(filledCount / totalFields) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFormData(PAYFLOW_SAMPLE)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <FlaskConical className="h-3 w-3" />
          Load Sample (PayFlow AI)
        </button>
        <button
          type="button"
          onClick={() => setFormData(EMPTY_FORM)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Fields */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
        <div className="px-4 py-4 space-y-3">
          {FORM_SECTIONS.map((section) => (
            <FormSection key={section.title} title={section.title}>
              {section.fields.map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={formData[field.key]}
                  onChange={(val) => updateField(field.key, val)}
                />
              ))}
            </FormSection>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 py-4 border-t border-slate-200 bg-white">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Generating GTM Pack...</>
          ) : (
            <><Sparkles className="h-4 w-4" />Generate GTM Pack</>
          )}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          Typically 45-90 seconds · 16 GTM sections
        </p>
      </div>
    </form>
  );
}
