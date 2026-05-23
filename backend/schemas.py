# Pydantic schemas for API request/response validation
from pydantic import BaseModel
from typing import Optional


class ProductInput(BaseModel):
    product_name: str
    product_category: str
    target_company_size: str
    target_industry: str
    primary_buyer_persona: str
    end_user_persona: str
    sales_motion: str
    current_alternatives: str
    core_business_problem: str
    buying_trigger: str
    key_features: str
    integration_requirements: str
    security_compliance_sensitivity: str
    pricing_assumption: str
    target_market: str
    tone: str


class GTMResponse(BaseModel):
    success: bool
    markdown: Optional[str] = None
    error: Optional[str] = None
