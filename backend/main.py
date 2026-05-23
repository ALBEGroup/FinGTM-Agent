# FastAPI application entry point for FinGTM Agent backend
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from agents import Runner

from schemas import ProductInput, GTMResponse
from agent import create_gtm_agent, build_user_prompt

load_dotenv()

app = FastAPI(
    title="FinGTM Agent API",
    description="B2B FinTech GTM Copilot powered by DeepSeek",
    version="1.0.0",
)

# Read allowed origin from env so production deployments can override without code changes
_ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[_ALLOWED_ORIGIN, "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok", "service": "FinGTM Agent API"}


@app.get("/health")
async def health():
    api_key_set = bool(os.getenv("DEEPSEEK_API_KEY"))
    return {"status": "ok", "deepseek_key_configured": api_key_set}


@app.post("/api/generate-gtm-pack", response_model=GTMResponse)
async def generate_gtm_pack(product_input: ProductInput):
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
