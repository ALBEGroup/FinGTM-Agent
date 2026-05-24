# Pydantic schemas for API request/response validation
from pydantic import BaseModel, Field, model_validator
from typing import Optional
from structured_output import GTMReportStructured

# Field length limits
_SHORT = 500
_LONG = 2000


class ProductInput(BaseModel):
    product_name: str = Field(min_length=1, max_length=_SHORT)
    product_category: str = Field(min_length=1, max_length=_LONG)
    target_company_size: str = Field(min_length=1, max_length=_SHORT)
    target_industry: str = Field(min_length=1, max_length=_SHORT)
    primary_buyer_persona: str = Field(min_length=1, max_length=_SHORT)
    end_user_persona: str = Field(min_length=1, max_length=_SHORT)
    sales_motion: str = Field(min_length=1, max_length=_SHORT)
    current_alternatives: str = Field(min_length=1, max_length=_LONG)
    core_business_problem: str = Field(min_length=1, max_length=_LONG)
    buying_trigger: str = Field(min_length=1, max_length=_LONG)
    key_features: str = Field(min_length=1, max_length=_LONG)
    integration_requirements: str = Field(min_length=1, max_length=_LONG)
    security_compliance_sensitivity: str = Field(min_length=1, max_length=_LONG)
    pricing_assumption: str = Field(min_length=1, max_length=_LONG)
    target_market: str = Field(min_length=1, max_length=_SHORT)
    tone: str = Field(min_length=1, max_length=_SHORT)

    @model_validator(mode="before")
    @classmethod
    def strip_whitespace(cls, data: object) -> object:
        if isinstance(data, dict):
            return {
                k: v.strip() if isinstance(v, str) else v
                for k, v in data.items()
            }
        return data


class GTMResponse(BaseModel):
    success: bool
    markdown: Optional[str] = None
    structured: Optional[GTMReportStructured] = None
    data_enriched: bool = False
    error: Optional[str] = None
