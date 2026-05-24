# FastAPI application entry point for FinGTM Agent backend
import os
from typing import Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from agents import Runner

import json
from openai import AsyncOpenAI

from schemas import ProductInput, GTMResponse
from agent import create_gtm_agent, build_user_prompt
from market_context import fetch_market_data
from structured_output import GTMReportStructured, CompanyDataPoint, MacroSnapshot

load_dotenv()

# Rate limiter — defaults to 5 req/min/IP, overridable via RATE_LIMIT env var
_RATE_LIMIT = os.getenv("RATE_LIMIT", "5/minute")
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="FinGTM Agent API",
    description="B2B FinTech GTM Copilot powered by DeepSeek",
    version="1.0.0",
)

app.state.limiter = limiter


async def _rate_limit_json_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": "Too many requests. Please wait a moment and try again."},
    )


app.add_exception_handler(RateLimitExceeded, _rate_limit_json_handler)

# Read allowed origin from env so production deployments can override without code changes
_ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")
_ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# In production, only the explicit ALLOWED_ORIGIN is permitted.
# In development (default), also allow 127.0.0.1 as a local alias for localhost.
_CORS_ORIGINS = (
    [_ALLOWED_ORIGIN]
    if _ENVIRONMENT == "production"
    else [_ALLOWED_ORIGIN, "http://127.0.0.1:3000"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response


app.add_middleware(SecurityHeadersMiddleware)


async def _parse_structured(
    product_input: ProductInput,
    markdown_output: str,
    financials: dict,
    macro: dict,
    data_enriched: bool,
) -> Optional[GTMReportStructured]:
    """Second DeepSeek call: extract structured fields from the generated Markdown."""
    try:
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            return None

        extraction_prompt = f"""从下面的 GTM 报告 Markdown 中提取结构化数据，只返回 JSON，不要任何其他文字。

需要提取的字段：
- market_size: {{ "summary": string, "tam_usd_billion": number|null, "sam_usd_billion": number|null, "som_usd_billion": number|null, "tam_assumption": bool }}
- competitors: [ {{ "name": string, "who_uses_it": string, "strengths": string, "weaknesses": string, "displacement_angle": string }} ]  (来自第8章)
- executive_summary: 第1章的完整文字
- positioning: 第2章的完整文字

报告内容：
{markdown_output}"""

        client = AsyncOpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        response = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": extraction_prompt}],
            max_tokens=4000,
            temperature=0,
        )
        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1]
            raw = raw.rsplit("```", 1)[0]

        parsed = json.loads(raw)

        # Build comparable_companies from live financials data — no LLM parsing needed
        comparable_companies = []
        for ticker, d in financials.items():
            if d.get("name") and d["name"] != ticker:
                comparable_companies.append(
                    CompanyDataPoint(
                        name=d["name"],
                        ticker=ticker,
                        revenue_usd=d.get("revenue_usd"),
                        gross_margin_pct=d.get("gross_margin_pct"),
                        market_cap=d.get("market_cap"),
                        revenue_growth_yoy=d.get("revenue_growth_yoy"),
                    )
                )

        # Build macro_snapshot from live macro data
        macro_snapshot = None
        if macro:
            macro_snapshot = MacroSnapshot(
                federal_funds_rate=macro.get("federal_funds_rate", {}).get("latest"),
                cpi_inflation=macro.get("cpi_inflation", {}).get("latest"),
                gdp_growth_rate=macro.get("gdp_growth_rate", {}).get("latest"),
            )

        from structured_output import MarketSizeSection, CompetitorRow

        market_size = None
        ms_raw = parsed.get("market_size")
        if ms_raw and isinstance(ms_raw, dict) and ms_raw.get("summary"):
            market_size = MarketSizeSection(
                summary=ms_raw.get("summary", ""),
                tam_usd_billion=ms_raw.get("tam_usd_billion"),
                sam_usd_billion=ms_raw.get("sam_usd_billion"),
                som_usd_billion=ms_raw.get("som_usd_billion"),
                tam_assumption=ms_raw.get("tam_assumption", True),
            )

        competitors = []
        for row in parsed.get("competitors", []):
            if isinstance(row, dict) and row.get("name"):
                competitors.append(
                    CompetitorRow(
                        name=row.get("name", ""),
                        who_uses_it=row.get("who_uses_it", ""),
                        strengths=row.get("strengths", ""),
                        weaknesses=row.get("weaknesses", ""),
                        displacement_angle=row.get("displacement_angle", ""),
                    )
                )

        return GTMReportStructured(
            product_name=product_input.product_name,
            comparable_companies=comparable_companies,
            macro_snapshot=macro_snapshot,
            data_enriched=data_enriched,
            market_size=market_size,
            competitors=competitors,
            executive_summary=parsed.get("executive_summary", ""),
            positioning=parsed.get("positioning", ""),
            full_markdown=markdown_output,
        )

    except Exception as e:
        print(f"[FinGTM] Structured parsing failed: {e}")
        return None


def _check_demo_token(request: Request) -> None:
    """If DEMO_ACCESS_TOKEN env var is set, require a matching X-Demo-Access-Token header."""
    required = os.getenv("DEMO_ACCESS_TOKEN")
    if not required:
        return
    provided = request.headers.get("x-demo-access-token", "")
    if provided != required:
        raise HTTPException(status_code=401, detail="Demo access token is missing or invalid.")


@app.get("/")
async def root():
    return {"status": "ok", "service": "FinGTM Agent API"}


@app.get("/health")
async def health():
    api_key_set = bool(os.getenv("DEEPSEEK_API_KEY"))
    return {"status": "ok", "deepseek_key_configured": api_key_set}


@app.post("/api/generate-gtm-pack", response_model=GTMResponse)
@limiter.limit(_RATE_LIMIT)
async def generate_gtm_pack(request: Request, product_input: ProductInput):
    _check_demo_token(request)

    try:
        if not os.getenv("DEEPSEEK_API_KEY"):
            return GTMResponse(
                success=False,
                error="DEEPSEEK_API_KEY is not configured.",
            )

        market_ctx = ""
        financials: dict = {}
        macro: dict = {}
        data_enriched = False
        try:
            market_ctx, financials, macro = await fetch_market_data(product_input)
            data_enriched = bool(market_ctx)
        except Exception as e:
            print(f"[FinGTM] Market context fetch failed: {e}")

        agent = create_gtm_agent()
        prompt = build_user_prompt(product_input, market_context=market_ctx)

        result = await Runner.run(agent, prompt)
        markdown_output = result.final_output

        if not markdown_output or not markdown_output.strip():
            return GTMResponse(
                success=False,
                error="Agent returned an empty response. Please try again.",
            )

        structured = await _parse_structured(
            product_input, markdown_output, financials, macro, data_enriched
        )

        return GTMResponse(
            success=True,
            markdown=markdown_output,
            structured=structured,
            data_enriched=data_enriched,
        )

    except HTTPException:
        raise

    except ValueError:
        # Raised by create_gtm_agent when API key is missing
        return GTMResponse(success=False, error="DEEPSEEK_API_KEY is not configured.")

    except Exception as e:
        err = str(e).lower()
        # Log full detail server-side only
        print(f"[FinGTM] Generation error: {e}")

        if "authentication" in err or "api key" in err or "unauthorized" in err:
            return GTMResponse(
                success=False,
                error="DeepSeek authentication failed. Please check your DEEPSEEK_API_KEY.",
            )
        if "rate limit" in err or "rate_limit" in err:
            return GTMResponse(
                success=False,
                error="DeepSeek rate limit reached. Please wait a moment and try again.",
            )
        if "model" in err and "not found" in err:
            return GTMResponse(
                success=False,
                error="Model not found. Please check the model configuration in agent.py.",
            )
        return GTMResponse(
            success=False,
            error="Failed to generate GTM pack. Please check backend logs for details.",
        )
