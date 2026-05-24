from pydantic import BaseModel
from typing import Optional


class CompanyDataPoint(BaseModel):
    name: str
    ticker: str
    revenue_usd: Optional[float] = None
    gross_margin_pct: Optional[float] = None
    market_cap: Optional[float] = None
    revenue_growth_yoy: Optional[float] = None


class MacroSnapshot(BaseModel):
    federal_funds_rate: Optional[float] = None
    cpi_inflation: Optional[float] = None
    gdp_growth_rate: Optional[float] = None


class MarketSizeSection(BaseModel):
    summary: str
    tam_usd_billion: Optional[float] = None
    sam_usd_billion: Optional[float] = None
    som_usd_billion: Optional[float] = None
    tam_assumption: bool = True


class CompetitorRow(BaseModel):
    name: str
    who_uses_it: str
    strengths: str
    weaknesses: str
    displacement_angle: str


class GTMReportStructured(BaseModel):
    product_name: str

    comparable_companies: list[CompanyDataPoint] = []
    macro_snapshot: Optional[MacroSnapshot] = None
    data_enriched: bool = False

    market_size: Optional[MarketSizeSection] = None
    competitors: list[CompetitorRow] = []

    executive_summary: str = ""
    positioning: str = ""
    full_markdown: str = ""
