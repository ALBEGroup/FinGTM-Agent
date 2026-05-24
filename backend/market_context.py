import json
import os
from openai import AsyncOpenAI

from schemas import ProductInput
from data_service import get_company_financials, get_macro_context


def _build_ticker_prompt(product_name: str, product_category: str, target_industry: str) -> str:
    return (
        f'Given this B2B FinTech product: "{product_name}" in category '
        f'"{product_category}" targeting "{target_industry}", '
        f"identify 3-5 publicly listed competitor or comparable companies on US stock exchanges. "
        f'Return ONLY a JSON array of ticker symbols, nothing else. Example: ["PYPL", "SQ", "AFRM"]'
    )


async def identify_tickers(
    product_name: str,
    product_category: str,
    target_industry: str,
) -> list[str]:
    """Identify 3-5 US-listed competitor tickers via DeepSeek. Returns [] on any failure."""
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return []

    client = AsyncOpenAI(api_key=api_key, base_url="https://api.deepseek.com")
    prompt = _build_ticker_prompt(product_name, product_category, target_industry)

    response = await client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        temperature=0,
    )
    raw = response.choices[0].message.content.strip()
    tickers = json.loads(raw)
    return [t.upper() for t in tickers if isinstance(t, str)]


async def _identify_tickers(product: ProductInput) -> list[str]:
    return await identify_tickers(
        product.product_name,
        product.product_category,
        product.target_industry,
    )


def _format_financials(financials: dict) -> str:
    if not financials:
        return ""
    lines = []
    for ticker, d in financials.items():
        name = d.get("name") or ticker
        parts = [f"- {name} ({ticker}):"]
        if d.get("revenue_usd") is not None:
            rev = d["revenue_usd"]
            rev_str = f"${rev / 1e9:.1f}B" if rev >= 1e9 else f"${rev / 1e6:.0f}M"
            parts.append(f"Revenue {rev_str}")
        if d.get("gross_margin_pct") is not None:
            parts.append(f"Gross Margin {d['gross_margin_pct']:.0f}%")
        if d.get("market_cap") is not None:
            mc = d["market_cap"]
            mc_str = f"${mc / 1e9:.0f}B" if mc >= 1e9 else f"${mc / 1e6:.0f}M"
            parts.append(f"Market Cap {mc_str}")
        if d.get("revenue_growth_yoy") is not None:
            parts.append(f"YoY Revenue Growth {d['revenue_growth_yoy'] * 100:.0f}%")
        if d.get("pe_ratio") is not None:
            parts.append(f"P/E {d['pe_ratio']}")
        lines.append(", ".join(parts[0:1]) + " " + ", ".join(parts[1:]) if len(parts) > 1 else parts[0])
    return "\n".join(lines)


def _format_macro(macro: dict) -> str:
    if not macro:
        return ""
    lines = []

    ffr = macro.get("federal_funds_rate", {})
    if ffr.get("latest") is not None:
        trend = ffr.get("trend", [])
        trend_str = " → ".join(str(v) for v in trend[-3:]) if len(trend) >= 2 else str(ffr["latest"])
        lines.append(f"- Federal Funds Rate: {ffr['latest']}% (recent trend: {trend_str})")

    cpi = macro.get("cpi_inflation", {})
    if cpi.get("latest") is not None:
        trend = cpi.get("trend", [])
        direction = ""
        if len(trend) >= 2:
            direction = " (recent trend: upward)" if trend[-1] > trend[0] else " (recent trend: downward)"
        lines.append(f"- CPI Inflation: {cpi['latest']}{direction}")

    gdp = macro.get("gdp_growth_rate", {})
    if gdp.get("latest") is not None:
        lines.append(f"- GDP Growth Rate: {gdp['latest']}%")

    return "\n".join(lines)


def _build_context_string(financials: dict, macro: dict) -> str:
    if not financials and not macro:
        return ""

    sections = []
    financials_block = _format_financials(financials)
    macro_block = _format_macro(macro)

    if financials_block:
        sections.append(f"COMPARABLE PUBLIC COMPANIES:\n{financials_block}")
    if macro_block:
        sections.append(f"CURRENT MACRO ENVIRONMENT:\n{macro_block}")

    body = "\n\n".join(sections)
    return (
        "=== REAL MARKET DATA (use these numbers in your report, do not fabricate alternatives) ===\n\n"
        + body
        + "\n\nINSTRUCTIONS: Reference the above real figures when discussing market size, competitive landscape, "
        "and pricing benchmarks. Mark any additional figures you estimate as [ASSUMPTION].\n"
        "==="
    )


async def fetch_market_data(product: ProductInput) -> tuple[str, dict, dict]:
    """Returns (context_string, financials_dict, macro_dict). Never raises."""
    tickers: list[str] = []
    try:
        tickers = await _identify_tickers(product)
    except Exception as e:
        print(f"[market_context] Ticker identification failed: {e}")

    financials: dict = {}
    if tickers:
        try:
            financials = get_company_financials(tickers)
        except Exception as e:
            print(f"[market_context] Financials fetch failed: {e}")

    macro: dict = {}
    try:
        macro = get_macro_context()
    except Exception as e:
        print(f"[market_context] Macro fetch failed: {e}")

    return _build_context_string(financials, macro), financials, macro


async def build_market_context(product: ProductInput) -> str:
    """Fallback: returns only the context string, discards raw dicts."""
    context_str, _, _ = await fetch_market_data(product)
    return context_str
