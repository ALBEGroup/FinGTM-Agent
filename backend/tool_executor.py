import json
import asyncio
from data_service import get_company_financials, get_macro_context
from market_context import identify_tickers


async def execute_tool_async(tool_name: str, tool_args: dict) -> str:
    """Execute a tool call requested by the LLM. Returns a JSON string result."""
    try:
        if tool_name == "get_company_financials":
            result = get_company_financials(tool_args.get("tickers", []))
            return json.dumps(result, ensure_ascii=False)

        elif tool_name == "get_macro_context":
            result = get_macro_context()
            return json.dumps(result, ensure_ascii=False)

        elif tool_name == "identify_competitors":
            tickers = await identify_tickers(
                tool_args.get("product_name", ""),
                tool_args.get("product_category", ""),
                tool_args.get("target_industry", ""),
            )
            return json.dumps({"tickers": tickers}, ensure_ascii=False)

        else:
            return json.dumps({"error": f"Unknown tool: {tool_name}"})

    except Exception as e:
        return json.dumps({"error": str(e)})


def execute_tool(tool_name: str, tool_args: dict) -> str:
    """Sync wrapper for execute_tool_async — usable from non-async contexts."""
    try:
        return asyncio.run(execute_tool_async(tool_name, tool_args))
    except Exception as e:
        return json.dumps({"error": str(e)})
