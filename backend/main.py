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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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
                error="DEEPSEEK_API_KEY is not configured. Please set: $env:DEEPSEEK_API_KEY = 'your_key'",
            )

        agent = create_gtm_agent()
        prompt = build_user_prompt(product_input)

        result = await Runner.run(agent, prompt)
        markdown_output = result.final_output

        if not markdown_output or not markdown_output.strip():
            return GTMResponse(success=False, error="Agent returned empty response. Please try again.")

        return GTMResponse(success=True, markdown=markdown_output)

    except ValueError as e:
        return GTMResponse(success=False, error=str(e))

    except Exception as e:
        err = str(e)
        if "authentication" in err.lower() or "api key" in err.lower():
            return GTMResponse(success=False, error=f"DeepSeek API auth failed. Check your DEEPSEEK_API_KEY. Detail: {err}")
        if "rate limit" in err.lower():
            return GTMResponse(success=False, error="DeepSeek rate limit reached. Wait and retry.")
        if "model" in err.lower() and "not found" in err.lower():
            return GTMResponse(success=False, error=f"Model not found. Check model name in agent.py. Detail: {err}")
        return GTMResponse(success=False, error=f"Generation failed: {err}")