// Sample product data for PayFlow AI — use the "Load Sample" button to fill the form
import type { ProductInput } from "./types";

export const PAYFLOW_SAMPLE: ProductInput = {
  product_name: "PayFlow AI",

  product_category:
    "B2B SaaS FinTech platform for invoice tracking, payment visibility, and cash flow insights",

  target_company_size:
    "SMBs and early mid-market companies with 10-200 employees",

  target_industry:
    "SaaS companies, agencies, online service providers, and B2B service businesses",

  primary_buyer_persona:
    "Founder, CFO, Finance Manager, Operations Manager",

  end_user_persona:
    "Finance team, accounts receivable staff, operations team",

  sales_motion:
    "Founder-led sales and SDR-led outbound, with potential product-led self-serve for smaller teams",

  current_alternatives:
    "Excel spreadsheets, Xero, QuickBooks, Stripe dashboard, manual email reminders, outsourced bookkeeping",

  core_business_problem:
    "Businesses struggle to track incoming payments, overdue invoices, subscription revenue, and cash flow visibility across multiple tools. Finance teams spend significant time chasing payments manually and lack a single source of truth.",

  buying_trigger:
    "The company is growing, invoice volume is increasing, payment follow-ups are becoming repetitive and time-consuming, and the founder or finance team needs better cash flow visibility to make confident decisions.",

  key_features: `- Invoice tracking and status dashboard
- Payment status visibility across customers
- Subscription revenue tracking
- Automated overdue payment reminders
- AI-generated payment summaries and cash flow insights
- CSV export for accounting handoff
- Basic cash flow forecasting
- Customer payment history view
- Team collaboration notes on invoices`,

  integration_requirements:
    "Stripe, Xero, QuickBooks, CSV import/export, email reminder workflows",

  security_compliance_sensitivity:
    "Moderate to high. The product handles business payment records and customer payment history, so messaging should be careful around data privacy, access control, and AI accuracy claims. Avoid overstating compliance certifications.",

  pricing_assumption:
    "Starter around $29-$49/month for small teams, Growth around $99-$199/month for growing teams, Pro custom pricing for mid-market or multi-entity companies",

  target_market:
    "Australia, Singapore, UK, and English-speaking SaaS/startup markets",

  tone:
    "Professional, clear, trustworthy, modern, B2B SaaS style",
};

export const EMPTY_FORM: ProductInput = {
  product_name: "",
  product_category: "",
  target_company_size: "",
  target_industry: "",
  primary_buyer_persona: "",
  end_user_persona: "",
  sales_motion: "",
  current_alternatives: "",
  core_business_problem: "",
  buying_trigger: "",
  key_features: "",
  integration_requirements: "",
  security_compliance_sensitivity: "",
  pricing_assumption: "",
  target_market: "",
  tone: "",
};
