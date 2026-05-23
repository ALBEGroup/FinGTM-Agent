# -*- coding: utf-8 -*-
# OpenAI Agents SDK agent configured to use DeepSeek API
import os
from openai import AsyncOpenAI
from agents import Agent, ModelSettings, set_tracing_disabled
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel

from schemas import ProductInput

set_tracing_disabled(True)

AGENT_INSTRUCTIONS = """
You are a senior B2B SaaS FinTech GTM strategist with deep expertise in:
- B2B SaaS positioning and messaging architecture
- FinTech product marketing: payments, invoicing, cash flow, subscription billing, treasury, CFO tools
- ICP definition and buyer committee mapping
- SDR/BDR outbound strategy and cold email copywriting
- Sales enablement: one-pagers, discovery scripts, demo scripts
- Enterprise objection handling and ROI messaging
- Security and trust messaging for finance software
- Early-stage SaaS go-to-market planning and pricing packaging strategy

LANGUAGE RULES:
- Write all section headers in English
- Write all customer-facing content in English: emails, LinkedIn posts, landing page copy, scripts, FAQs
- Write strategic analysis and B2B logic explanations in Chinese (simplified Chinese)

CONTENT RULES (MANDATORY):
- Do NOT fabricate customer case studies, testimonials, or named customers
- Do NOT claim specific ROI percentages without user-provided basis
- Do NOT make regulatory claims (SOC2, ISO27001, GDPR, PCI-DSS) unless user specified
- Do NOT claim the product is a bank, licensed financial adviser, or payment processor
- Do NOT use: guaranteed revenue, guaranteed compliance, risk-free, 100% accurate AI
- Keep security messaging qualified: use 'designed with', 'built to support', 'helps teams manage'
- Be specific to the product input, avoid generic SaaS platitudes
- Think like a B2B revenue practitioner, not a generic content marketer

OUTPUT FORMAT:
Generate a complete GTM report in Markdown titled '# FinGTM Report' with all 16 sections.
Each section must be thorough, specific, and immediately actionable.
IMPORTANT: You must complete ALL 16 sections. Do not stop early.
"""


def build_user_prompt(product: ProductInput) -> str:
    return f"""
Please generate a complete FinGTM Report based on the following product information.

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

Generate the complete report with all 16 sections. Be concise but complete for each section.

# FinGTM Report

## 1. Executive Summary
Product summary, target market, core GTM recommendation, main commercial risk, main opportunity.
(Brief analysis in Chinese; content in English)

## 2. ICP Definition
Ideal customer profile, company size, industry segment, budget signal, urgency signal, poor-fit signals.
(Analysis in Chinese; ICP in English)

## 3. Buyer Committee Map
For each of 5 personas (Economic Buyer, Technical Evaluator, Daily User, Champion, Procurement):
role, concerns, pain, objection, message angle.

## 4. Pain-to-Value Mapping
Markdown table: Current Pain | Business Impact | Product Capability | Value Message | Proof Needed

## 5. Positioning
One-sentence positioning, category, 3 alternative angles, key differentiation, why now.

## 6. Landing Page Copy
Hero headline, subheadline, primary CTA, secondary CTA, problem section (3 pains), solution section,
feature section (3-5 features), use case section (2 use cases), trust section, FAQ (5 Q&As), final CTA.

## 7. SDR / BDR Outbound Sequence
3 cold emails (subject + body), 3 LinkedIn connection messages, 3 LinkedIn follow-ups,
3 voicemail scripts, personalisation tokens list.

## 8. LinkedIn ABM Content
5 founder posts, 5 company page posts, 5 thought-leadership hooks, 5 buyer pain posts.

## 9. Sales One-Pager
Product summary, who it is for, problems solved, key capabilities, business outcomes, use cases,
why choose this, CTA.

## 10. Discovery Call Questions
3 questions each for: current workflow, pain severity, business impact, existing tools,
decision process, timeline, budget, security/integration, success criteria.

## 11. Demo Script
Opening, discovery recap, demo flow (steps with feature-to-value narration), 3 objection moments, closing CTA.

## 12. Objection Handling
For each objection: what it means (Chinese), response script (English), follow-up question.
Cover: Excel, Xero/QuickBooks/Stripe, no budget, data security, not ready for AI,
need integrations, too complex, too small.

## 13. Pricing Packaging
3 tiers (Starter / Growth / Pro): best for, included features, not included, pricing logic,
upgrade trigger, sales note.

## 14. Security & Trust Messaging
What can be claimed, what not to claim, 5 trust phrases, security FAQ (5 Q&As),
3 compliance wording warnings.

## 15. 30-Day GTM Launch Plan
Week 1 (positioning/ICP), Week 2 (assets), Week 3 (outreach), Week 4 (demo/iteration).
Each week: tasks, deliverables, success metrics.

## 16. Next Version Suggestions
Product improvements, integrations, GTM automations, V2 agent capabilities.

---
Keep each section focused and actionable. Marketing copy in English, analysis in Chinese.
Complete all 16 sections without stopping early.
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