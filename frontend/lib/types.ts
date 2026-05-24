// Shared TypeScript types for FinGTM Agent

export interface ProductInput {
  product_name: string;
  product_category: string;
  target_company_size: string;
  target_industry: string;
  primary_buyer_persona: string;
  end_user_persona: string;
  sales_motion: string;
  current_alternatives: string;
  core_business_problem: string;
  buying_trigger: string;
  key_features: string;
  integration_requirements: string;
  security_compliance_sensitivity: string;
  pricing_assumption: string;
  target_market: string;
  tone: string;
}

export interface CompanyDataPoint {
  name: string;
  ticker: string;
  revenue_usd?: number;
  gross_margin_pct?: number;
  market_cap?: number;
  revenue_growth_yoy?: number;
}

export interface MacroSnapshot {
  federal_funds_rate?: number;
  cpi_inflation?: number;
  gdp_growth_rate?: number;
}

export interface MarketSizeSection {
  summary: string;
  tam_usd_billion?: number;
  sam_usd_billion?: number;
  som_usd_billion?: number;
  tam_assumption: boolean;
}

export interface GTMStructured {
  product_name: string;
  comparable_companies: CompanyDataPoint[];
  macro_snapshot?: MacroSnapshot;
  market_size?: MarketSizeSection;
  data_enriched: boolean;
}

export interface GTMResponse {
  success: boolean;
  markdown?: string;
  structured?: GTMStructured;
  data_enriched: boolean;
  error?: string;
}

// Legacy alias kept so api.ts compiles without change
export type GTMApiResponse =
  | { success: true; markdown: string; structured?: GTMStructured; data_enriched: boolean }
  | { success: false; error: string };

export type GenerationState = "idle" | "loading" | "success" | "error";
