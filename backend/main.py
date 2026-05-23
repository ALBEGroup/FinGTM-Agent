# FastAPI application entry point for FinGTM Agent backend
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from agents import Runner

from schemas import ProductInput, GTMResponse
from agent import create_gtm_agent, build_user_prompt

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[_ALLOWED_ORIGIN, "http://127.0.0.1:3000"],
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

        agent = create_gtm_agent()
        prompt = build_user_prompt(product_input)

        result = await Runner.run(agent, prompt)
        markdown_output = result.final_output

        if not markdown_output or not markdown_output.strip():
            return GTMResponse(
                success=False,
                error="Agent returned an empty response. Please try again.",
            )

        return GTMResponse(success=True, markdown=markdown_output)

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
