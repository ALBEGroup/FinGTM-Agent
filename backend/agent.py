# -*- coding: utf-8 -*-
# OpenAI Agents SDK agent configured to use DeepSeek API
import os
from openai import AsyncOpenAI
from agents import Agent, ModelSettings, set_tracing_disabled
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel

from schemas import ProductInput

set_tracing_disabled(True)

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_company_financials",
            "description": "获取指定上市公司的财务数据，包括营收、毛利率、市值、增速等",
            "parameters": {
                "type": "object",
                "properties": {
                    "tickers": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "股票代码列表，例如 ['PYPL', 'SQ', 'V']",
                    }
                },
                "required": ["tickers"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_macro_context",
            "description": "获取当前宏观经济数据：联邦基金利率、CPI通胀、GDP增速",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "identify_competitors",
            "description": "根据产品信息识别3-5个相关的美股上市竞品，返回股票代码列表",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {"type": "string"},
                    "product_category": {"type": "string"},
                    "target_industry": {"type": "string"},
                },
                "required": ["product_name", "product_category", "target_industry"],
            },
        },
    },
]

AGENT_INSTRUCTIONS = """
You are a senior B2B SaaS / FinTech GTM strategist with deep expertise in:
- B2B SaaS positioning and messaging architecture
- FinTech product marketing: payments, invoicing, cash flow, subscription billing, treasury, CFO tools
- ICP definition, firmographic targeting, and buyer committee mapping
- SDR/BDR outbound strategy, cold email copywriting, and LinkedIn outreach
- Sales enablement: discovery scripts, objection handling playbooks, pricing strategy
- Enterprise trust and security messaging for finance software

LANGUAGE:
- Write the entire report in English
- Maintain a professional B2B SaaS tone throughout all sections

CONTENT RULES (MANDATORY):
- Do NOT fabricate customer case studies, testimonials, or named customers
- Do NOT claim specific ROI percentages unless the user provided data
- Do NOT make regulatory claims (SOC2, ISO27001, GDPR, PCI-DSS) unless user specified them
- Do NOT claim the product is a bank, licensed financial adviser, or payment processor
- Do NOT use: guaranteed, risk-free, 100% accurate, best-in-class (unless user provided proof)
- Mark any unverifiable estimates or assumptions as [ASSUMPTION]
- Keep security messaging qualified: use "designed to support", "built to help", "helps teams manage"
- Be specific to the product input — avoid generic SaaS platitudes
- Think like a B2B revenue practitioner, not a generic content writer

QUALITY RULES:
- ICP must include specific firmographic criteria, not vague generalisations
- Buyer personas must include: Title, Day-in-life summary, Primary goal, Key pain points, Objections, Message angle
- Cold emails must NOT open with "I hope this email finds you well" or any similar filler phrase
- LinkedIn connection requests must be UNDER 300 characters each
- Objection responses must sound like a real sales conversation, not a FAQ page
- GTM Action Plan must have clearly separated 30-day, 60-day, and 90-day sections

OUTPUT FORMAT:
Generate a complete GTM report in Markdown starting with '# FinGTM Report'.
Each section must use the format: ## N. [Section Title]
CRITICAL: You must output ALL 16 sections completely. Do not stop early or truncate any section.
"""


def build_user_prompt(product: ProductInput, market_context: str = "") -> str:
    context_block = f"{market_context}\n\n" if market_context else ""
    return f"""
Generate a complete FinGTM Report for the following product. Output all 16 sections without stopping.

{context_block}---
Product Name: {product.product_name}
Product Category: {product.product_category}
Target Company Size: {product.target_company_size}
Target Industry: {product.target_industry}
Primary Buyer Persona: {product.primary_buyer_persona}
End User Persona: {product.end_user_persona}
Sales Motion: {product.sales_motion}
Current Alternatives: {product.current_alternatives}
Core Business Problem: {product.core_business_problem}
Buying Trigger: {product.buying_trigger}
Key Features: {product.key_features}
Integration Requirements: {product.integration_requirements}
Security / Compliance Sensitivity: {product.security_compliance_sensitivity}
Pricing Assumption: {product.pricing_assumption}
Target Market: {product.target_market}
Tone: {product.tone}
---

# FinGTM Report

## 1. Executive GTM Summary
Write 2–3 paragraphs covering: what the product does, who it is built for, the core GTM hypothesis,
the primary commercial opportunity, and the biggest risk to watch.

## 2. Product Positioning
- One-sentence positioning statement using this template:
  "For [target customer] who [pain], [product name] is a [category] that [key benefit]. Unlike [alternatives], we [differentiator]."
- Product category and positioning angle (e.g. workflow tool, intelligence layer, infrastructure)
- Three alternative positioning angles with trade-offs for each
- Key differentiation: what this product does that alternatives cannot
- Why now: what market timing or urgency driver makes this the right moment

## 3. Target Market Overview
- Primary market segment and geography
- Target company profile: industry, size (employees + ARR range), growth stage, tech maturity
- Market timing factors: regulatory, economic, or technology trends driving demand
- Key market entry strategy recommendation (direct outbound, partnerships, PLG, community)
- 3–5 market readiness signals: how to tell if a company is in-market now

## 4. Ideal Customer Profile (ICP)
Provide a specific, actionable ICP:
- Firmographic criteria: industry, company size (employees + revenue range [ASSUMPTION if estimated]),
  geography, tech stack signals (e.g. uses Stripe, Xero, or similar)
- Behavioural signals: growth stage, hiring patterns, recent funding, events that indicate readiness
- Budget signals: spending patterns or budget triggers that indicate willingness to buy
- Urgency signals: what specific events cause a company to seek a solution right now
- Qualification questions: 5 questions to qualify a lead in the first discovery call
- Poor-fit signals: who to de-prioritise and why

## 5. Buyer Personas
For each of the 5 personas below, provide a structured profile:
**Title** | **Day-in-life** (2 sentences) | **Primary goal** | **Top 3 pain points** |
**Key objections** (2–3) | **Message angle** | **Best outreach channel**

Personas to cover:
1. Economic Buyer (controls budget and final sign-off)
2. Champion (internal advocate who drives the deal forward)
3. Technical Evaluator (assesses integration, security, and implementation)
4. End User (uses the product day-to-day)
5. Procurement / Legal (manages contract review and compliance)


## 6. Pain Points and Buying Triggers
Markdown table with columns:
| Current Pain | Business Impact | What Triggers Purchase | Urgency Level |

Include 6–8 rows covering the core pain dimensions for this product.
Urgency Level: High / Medium / Low.

Below the table, list the top 3 specific buying trigger events that make a company ready to purchase NOW,
and explain why each creates urgency.

## 7. Value Proposition
- Core value proposition statement (2–3 sentences, specific and outcome-focused)
- 3 supporting proof points (measurable outcomes preferred; mark estimates as [ASSUMPTION])
- Before/After narrative: what the customer's workflow looks like before vs. after adopting this product
- One-line value prop tailored for each buyer persona type
- Single-line variants for: website hero, sales email subject line, LinkedIn post hook

## 8. Competitive Landscape
Markdown table with columns:
| Alternative | Who Uses It | Strengths | Weaknesses | Displacement Angle |

Cover all alternatives mentioned by the user plus obvious market incumbents.

For the top 2 competitors, write a 2-sentence displacement strategy:
how to win a deal where the prospect is already using that tool.

## 9. Differentiation Strategy
- Top 3 unique capabilities that competitors cannot easily replicate
- Feature-level comparison table: Capability | This Product | Alternative A | Alternative B
- Positioning moat: what makes this product defensible over 12–18 months
- "Why us over [X]" messaging guide for the top 2 competitors
  (2–3 talking points for each, in English, for sales conversations)

## 10. Pricing and Packaging
Three tiers (Starter / Growth / Pro or equivalent names suited to the product):
For each tier:
- Best for (customer segment)
- Core features included
- Notable exclusions
- Pricing logic / range
- Upgrade trigger (what behaviour or need prompts an upgrade)
- Sales note (how to position this tier in a conversation)

Also include:
- Recommended pricing motion: self-serve vs. sales-assisted and why
- Annual vs. monthly billing recommendation
- Free trial or freemium recommendation with rationale

## 11. Sales Messaging Framework
- Headline sales message (1 sentence — what you lead with in any sales context)
- Elevator pitch (30-second spoken version, natural conversational language)
- SDR cold call talk track:
  Opening (30 seconds) → pivot to value → close to meeting ask
- Demo opening statement (how to start a product demo to maximise engagement)
- Email subject line options: provide 5 variants, labelled A–E, for A/B testing
- Leading proof point for each buyer persona (what to emphasise when talking to each)

## 12. LinkedIn Outreach
**Connection Request Messages (MUST be under 300 characters each):**
- 3 connection requests for the Economic Buyer persona
- 3 connection requests for the Champion persona

**Follow-up Messages (after connection accepted):**
- 3 follow-up messages that lead with value or insight, not a pitch

**Content Hooks for Organic Content:**
- 5 post hooks for founder thought leadership (share insights, not product pitches)
- 3 post hooks designed to resonate with buyer pain points

## 13. Cold Email Sequence
Three emails for a complete outbound sequence. Each email must have a Subject and Body.

**Email 1 — First Touch:**
Subject: [subject line]
Body: [Specific, relevant hook. Do NOT open with "I hope this email finds you well" or similar filler.
Reference a relevant pain or trigger. Clear value in 3–4 sentences. Soft CTA.]

**Email 2 — Follow-Up (3–5 days later):**
Subject: [subject line]
Body: [New angle — add insight, a relevant trend, or a brief proof point. Keep it short. CTA.]

**Email 3 — Breakup Email (7–10 days later):**
Subject: [subject line]
Body: [Honest, brief, no pressure. Leaves the door open for future timing. Under 5 sentences.]

**Personalisation tokens:** List the tokens a rep should customise before sending
(e.g. {{company_name}}, {{recent_trigger}}, {{industry_pain}})

## 14. Discovery Call Questions
Questions to ask in a first 30-minute discovery call, grouped by category (3 questions each):

**Current Workflow** — understand how they work today
**Pain Severity** — qualify how painful the problem really is
**Business Impact** — quantify the cost of the problem
**Existing Tools & Integration** — assess the tech stack and switching cost
**Decision Process & Stakeholders** — map the buying committee
**Timeline & Budget** — qualify urgency and commercial viability

Also include: 3 questions specifically designed to identify whether this is a qualified ICP fit
(questions that reveal poor-fit early before investing more time).

## 15. Objection Handling Playbook
For each objection, provide:
1. What the objection really means (the underlying concern the prospect has)
2. Response script (conversational, not robotic, 3–5 sentences)
3. Follow-up question to keep the conversation moving forward

Objections to cover:
1. "We already use [Excel / Xero / QuickBooks / Stripe]"
2. "We don't have budget right now"
3. "We're not sure about data security / where our data goes"
4. "We're not ready for AI in our finance workflow"
5. "We need this to integrate with [specific tool]"
6. "This seems too complex for our team to implement"
7. "We're too small / too early for this right now"
8. "We need to get more stakeholders involved before we decide"

## 16. GTM Action Plan (30 / 60 / 90 Days)

### Days 1–30: Foundation
**Goal:** [what to validate or establish]
**Key tasks:** (5–7 bullet points)
**Deliverables:** (what should exist by end of day 30)
**Success metrics:** (2–3 measurable indicators)

### Days 31–60: Activation
**Goal:** [what to launch or accelerate]
**Key tasks:** (5–7 bullet points)
**Deliverables:** (what should exist by end of day 60)
**Success metrics:** (2–3 measurable indicators)

### Days 61–90: Scale
**Goal:** [what to optimise or expand]
**Key tasks:** (5–7 bullet points)
**Deliverables:** (what should exist by end of day 90)
**Success metrics:** (2–3 measurable indicators)

**Leading indicators to track across all 90 days:** (top 3)
**Warning signs that signal the GTM motion needs to pivot:** (3–4 signals)

---
Output all 16 sections completely in English.
Never stop early. Never add commentary outside the report structure.
"""


def create_gtm_agent() -> Agent:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise ValueError(
            "DEEPSEEK_API_KEY is not set. "
            "Run: $env:DEEPSEEK_API_KEY = 'your_key_here'"
        )

    deepseek_client = AsyncOpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com",
    )

    model = OpenAIChatCompletionsModel(
        model="deepseek-chat",
        openai_client=deepseek_client,
    )

    agent = Agent(
        name="FinGTM Strategist",
        instructions=AGENT_INSTRUCTIONS,
        model=model,
        model_settings=ModelSettings(max_tokens=16000),
    )

    return agent
