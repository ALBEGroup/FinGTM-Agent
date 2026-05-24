import os
import yfinance as yf


def get_company_financials(tickers: list[str]) -> dict:
    result = {}
    for ticker_symbol in tickers:
        try:
            t = yf.Ticker(ticker_symbol)
            info = t.info or {}

            name = info.get("longName") or info.get("shortName") or ticker_symbol
            sector = info.get("sector", "")
            market_cap = info.get("marketCap")
            revenue_growth = info.get("revenueGrowth")
            pe_ratio = info.get("trailingPE") or info.get("forwardPE")
            profit_margins = info.get("profitMargins")

            revenue_usd = None
            gross_margin_pct = None
            operating_cashflow_usd = None

            try:
                financials = t.financials
                if financials is not None and not financials.empty:
                    col = financials.columns[0]
                    total_revenue = None
                    gross_profit = None

                    for idx in financials.index:
                        label = str(idx).lower()
                        if "total revenue" in label:
                            total_revenue = financials.loc[idx, col]
                        elif "gross profit" in label:
                            gross_profit = financials.loc[idx, col]

                    if total_revenue and total_revenue != 0:
                        revenue_usd = round(float(total_revenue), 2)
                    if total_revenue and gross_profit and total_revenue != 0:
                        gross_margin_pct = round(float(gross_profit) / float(total_revenue) * 100, 2)
            except Exception:
                pass

            try:
                cashflow = t.cashflow
                if cashflow is not None and not cashflow.empty:
                    col = cashflow.columns[0]
                    for idx in cashflow.index:
                        label = str(idx).lower()
                        if "operating" in label and "cash" in label:
                            operating_cashflow_usd = round(float(cashflow.loc[idx, col]), 2)
                            break
            except Exception:
                pass

            result[ticker_symbol] = {
                "name": name,
                "sector": sector,
                "market_cap": round(float(market_cap), 2) if market_cap else None,
                "revenue_usd": revenue_usd,
                "gross_margin_pct": gross_margin_pct,
                "operating_cashflow_usd": operating_cashflow_usd,
                "revenue_growth_yoy": round(float(revenue_growth), 4) if revenue_growth else None,
                "pe_ratio": round(float(pe_ratio), 2) if pe_ratio else None,
            }
        except Exception as e:
            print(f"[data_service] Failed to fetch data for {ticker_symbol}: {e}")
            continue

    return result


def get_macro_context() -> dict:
    api_key = os.getenv("FRED_API_KEY")
    if not api_key:
        print("[data_service] FRED_API_KEY is not set — skipping macro context fetch")
        return {}

    try:
        from fredapi import Fred
        fred = Fred(api_key=api_key)

        series_map = {
            "federal_funds_rate": "FEDFUNDS",
            "cpi_inflation": "CPIAUCSL",
            "gdp_growth_rate": "A191RL1Q225SBEA",
        }

        output = {}
        for key, series_id in series_map.items():
            try:
                data = fred.get_series(series_id)
                recent = data.dropna().tail(4).tolist()
                recent = [round(float(v), 4) for v in recent]
                latest = recent[-1] if recent else None
                output[key] = {"latest": latest, "trend": recent}
            except Exception as e:
                print(f"[data_service] Failed to fetch FRED series {series_id}: {e}")
                output[key] = {"latest": None, "trend": []}

        return output

    except Exception as e:
        print(f"[data_service] FRED fetch failed: {e}")
        return {}
