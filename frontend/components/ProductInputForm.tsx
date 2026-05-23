// Product input panel — 16-field B2B GTM workflow form grouped into 4 structured sections
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trash2, FlaskConical, Loader2, ChevronDown, AlertCircle } from "lucide-react";
import type { ProductInput } from "@/lib/types";
import { PAYFLOW_SAMPLE, EMPTY_FORM } from "@/lib/sampleData";

interface ProductInputFormProps {
  onSubmit: (input: ProductInput) => void;
  isLoading: boolean;
  loadSampleSignal?: number;
}

type FieldDef = {
  key: keyof ProductInput;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
  rows?: number;
};

type SectionDef = {
  id: string;
  title: string;
  description: string;
  fields: FieldDef[];
};

const FORM_SECTIONS: SectionDef[] = [
  {
    id: "01",
    title: "Product Foundation",
    description: "What you're building and the core problem it solves",
    fields: [
      {
        key: "product_name",
        label: "Product Name",
        type: "text",
        placeholder: "e.g. PayFlow AI",
      },
      {
        key: "product_category",
        label: "Product Category",
        type: "textarea",
        placeholder: "e.g. B2B SaaS FinTech platform for invoice tracking and cash flow insights",
        rows: 2,
      },
      {
        key: "core_business_problem",
        label: "Core Business Problem",
        type: "textarea",
        placeholder: "What specific workflow pain does this solve? What is the business impact?",
        rows: 3,
      },
      {
        key: "key_features",
        label: "Key Features",
        type: "textarea",
        placeholder: "List the main capabilities (one per line)",
        rows: 4,
      },
    ],
  },
  {
    id: "02",
    title: "Market & ICP",
    description: "Target accounts, buyer roles, and the people who buy and use this",
    fields: [
      {
        key: "target_company_size",
        label: "Target Company Size",
        type: "text",
        placeholder: "e.g. SMBs with 10–200 employees",
      },
      {
        key: "target_industry",
        label: "Target Industry",
        type: "text",
        placeholder: "e.g. SaaS companies, agencies, B2B service businesses",
      },
      {
        key: "target_market",
        label: "Target Market / Geography",
        type: "text",
        placeholder: "e.g. Australia, Singapore, UK, US SaaS market",
      },
      {
        key: "primary_buyer_persona",
        label: "Primary Buyer",
        type: "text",
        placeholder: "e.g. Founder, CFO, Finance Manager",
      },
      {
        key: "end_user_persona",
        label: "End User",
        type: "text",
        placeholder: "e.g. Finance team, accounts receivable staff",
      },
    ],
  },
  {
    id: "03",
    title: "Sales Motion",
    description: "How you sell, what drives urgency, and how you compete",
    fields: [
      {
        key: "sales_motion",
        label: "Sales Motion",
        type: "text",
        placeholder: "e.g. Founder-led + SDR outbound + PLG self-serve",
      },
      {
        key: "buying_trigger",
        label: "Buying Trigger",
        type: "textarea",
        placeholder: "What event or condition makes a company ready to buy right now?",
        rows: 2,
      },
      {
        key: "current_alternatives",
        label: "Current Alternatives",
        type: "textarea",
        placeholder: "e.g. Excel, Xero, QuickBooks, Stripe dashboard, manual email",
        rows: 2,
      },
      {
        key: "pricing_assumption",
        label: "Pricing Assumption",
        type: "textarea",
        placeholder: "e.g. Starter $29–49/mo, Growth $99–199/mo, Pro custom",
        rows: 2,
      },
    ],
  },
  {
    id: "04",
    title: "Technical & Trust",
    description: "Integration landscape, compliance context, and messaging tone",
    fields: [
      {
        key: "integration_requirements",
        label: "Integration Requirements",
        type: "text",
        placeholder: "e.g. Stripe, Xero, QuickBooks, CSV import/export",
      },
      {
        key: "security_compliance_sensitivity",
        label: "Security / Compliance Context",
        type: "textarea",
        placeholder: "Describe data sensitivity and any compliance considerations",
        rows: 2,
      },
      {
        key: "tone",
        label: "Messaging Tone",
        type: "text",
        placeholder: "e.g. Professional, clear, modern B2B SaaS style",
      },
    ],
  },
];

function FormField({
  field,
  value,
  onChange,
  hasError,
}: {
  field: FieldDef;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}) {
  const baseClass =
    "w-full px-3 py-2 text-[13px] text-slate-800 bg-white rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all leading-relaxed";
  const normalBorder = "border border-slate-200 focus:ring-blue-500/20 focus:border-blue-400";
  const errorBorder = "border border-red-300 focus:ring-red-500/20 focus:border-red-400";
  const inputClass = `${baseClass} ${hasError ? errorBorder : normalBorder}`;

  const fieldId = `field-${String(field.key)}`;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
      >
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
      {hasError && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          This field is required.
        </p>
      )}
    </div>
  );
}

function FormSection({
  section,
  formData,
  onChange,
  initialOpen,
  errorFieldKey,
}: {
  section: SectionDef;
  formData: ProductInput;
  onChange: (key: keyof ProductInput, val: string) => void;
  initialOpen?: boolean;
  errorFieldKey?: keyof ProductInput | null;
}) {
  const [open, setOpen] = useState(initialOpen ?? false);
  const filledInSection = section.fields.filter(
    (f) => formData[f.key]?.trim()
  ).length;
  const isComplete = filledInSection === section.fields.length;
  const hasErrorInSection = errorFieldKey
    ? section.fields.some((f) => f.key === errorFieldKey)
    : false;

  // Auto-open section when it contains the errored field
  useEffect(() => {
    if (hasErrorInSection) setOpen(true);
  }, [hasErrorInSection]);

  return (
    <div
      className={`rounded-xl border overflow-hidden bg-white transition-colors ${
        hasErrorInSection ? "border-red-200" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50/80 hover:bg-slate-100/60 transition-colors text-left border-b border-slate-200/60"
      >
        {/* Section number badge */}
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${
            isComplete
              ? "bg-emerald-100 text-emerald-600"
              : hasErrorInSection
              ? "bg-red-100 text-red-500"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {section.id}
        </span>

        {/* Title + completion count */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-slate-700">
            {section.title}
          </span>
          <span
            className={`text-[10px] font-medium flex-shrink-0 ${
              isComplete
                ? "text-emerald-500"
                : hasErrorInSection
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {filledInSection}/{section.fields.length}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pt-3.5 pb-5 space-y-5">
          <p className="text-[11px] text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-2.5">
            {section.description}
          </p>
          {section.fields.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={formData[field.key]}
              onChange={(val) => onChange(field.key, val)}
              hasError={errorFieldKey === field.key}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductInputForm({
  onSubmit,
  isLoading,
  loadSampleSignal,
}: ProductInputFormProps) {
  const [formData, setFormData] = useState<ProductInput>(EMPTY_FORM);
  const [errorFieldKey, setErrorFieldKey] = useState<keyof ProductInput | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (loadSampleSignal) setFormData(PAYFLOW_SAMPLE);
  }, [loadSampleSignal]);

  function updateField(key: keyof ProductInput, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user edits the offending field
    if (key === errorFieldKey) {
      setErrorFieldKey(null);
      setFormError("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorFieldKey(null);
    setFormError("");

    const missing = (
      Object.entries(formData) as [keyof ProductInput, string][]
    ).find(([, v]) => !v.trim());

    if (missing) {
      const readableName = String(missing[0]).replace(/_/g, " ");
      setErrorFieldKey(missing[0]);
      setFormError(`Please fill in: ${readableName}`);
      return;
    }

    onSubmit(formData);
  }

  const filledCount = Object.values(formData).filter((v) => v.trim()).length;
  const totalFields = Object.keys(formData).length;
  const pct = Math.round((filledCount / totalFields) * 100);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Panel header with progress */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Product Input
          </h2>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors ${
              filledCount === totalFields
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {filledCount}/{totalFields} fields
          </span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors duration-500 ${
              pct === 100 ? "bg-emerald-500" : "bg-blue-500"
            }`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setFormData(PAYFLOW_SAMPLE);
            setErrorFieldKey(null);
            setFormError("");
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <FlaskConical className="h-3 w-3" />
          Load Sample: PayFlow AI
        </button>
        <button
          type="button"
          onClick={() => {
            setFormData(EMPTY_FORM);
            setErrorFieldKey(null);
            setFormError("");
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Inline form-level error banner */}
      {formError && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
          <p className="text-[12px] text-red-600">{formError}</p>
        </div>
      )}

      {/* Scrollable form sections */}
      <div className="overflow-y-auto max-h-[calc(100vh-210px)] scroll-smooth">
        <div className="px-4 py-4 space-y-3">
          {FORM_SECTIONS.map((section, i) => (
            <FormSection
              key={section.id}
              section={section}
              formData={formData}
              onChange={updateField}
              initialOpen={i === 0}
              errorFieldKey={errorFieldKey}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 py-4 border-t border-slate-200 bg-white">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating GTM Pack...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate GTM Pack
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Typically 45–90 seconds · 16 GTM sections
        </p>
      </div>
    </form>
  );
}
