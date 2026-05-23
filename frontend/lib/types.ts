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

export interface GTMApiResponse {
  success: boolean;
  markdown?: string;
  error?: string;
}

export type GenerationState = "idle" | "loading" | "success" | "error";
