# FinGTM Agent

> **Built by [Becky Dai](https://github.com/Becky-Dai) and [Alice Liu](https://github.com/iamaliceliu)**

**B2B FinTech GTM Copilot** — Turn a product brief into a complete, deployment-ready go-to-market strategy in under 90 seconds.

![FinGTM Agent](./Homepage.png)

---

## Overview

FinGTM Agent is a full-stack AI Agent application built for early-stage B2B SaaS FinTech founders, product marketers, SDRs, and BDR teams. Fill in one product brief and get a 16-section GTM and sales enablement pack — structured, FinTech-aware, and immediately usable.

Unlike general-purpose AI writing tools, FinGTM Agent is built around the actual mechanics of B2B enterprise selling: buying committees, procurement friction, security reviews, ICP qualification, and pipeline-stage messaging.

**Input:** One product brief (16 fields across 4 groups).  
**Output:** 16 GTM sections — positioning, ICP, outbound sequences, sales scripts, objection handling, pricing, trust messaging, and a 30/60/90-day launch plan.

---

## Why This Exists

Early-stage FinTech teams waste weeks building GTM assets manually, often without the B2B enterprise sales expertise to make them effective. FinGTM Agent compresses that work into minutes, grounded in real B2B logic:

| Challenge | What FinGTM Agent Solves |
|---|---|
| Who actually buys the product | Buyer persona mapping: Economic Buyer, Champion, End User — with distinct pain points |
| Why companies buy *now* | Buying trigger analysis tied to growth stage and workflow breakdowns |
| How to displace Excel, Xero, Stripe | Competitive landscape analysis and differentiation strategy |
| What slows enterprise deals | Objection handling playbook with scripted responses |
| How SDRs should reach out | Cold email sequences and LinkedIn outreach ready to paste |
| How AEs run discovery | Structured discovery call questions by topic |
| How to price for conversion | Tiered packaging with upgrade triggers |
| What you can and cannot claim in FinTech | FinTech messaging guardrails applied automatically — no guaranteed revenue, no fake certifications |

---

## UI Overview

The workspace is a Stripe-style SaaS dashboard:

- **Left sidebar** — Fixed 220px navigation on desktop, slide-in overlay on mobile
- **4 KPI status cards** — GTM Readiness, ICP Clarity, Sales Assets, Trust Review — update live as the agent runs
- **Left panel** — Product input form (4 collapsible groups, progress bar, Load Sample shortcut)
- **Right column** — Recommended Next Actions panel + FinTech Guardrails panel (always visible, context-aware), then the live workspace below
- **Report view** — 16 sections rendered in 4 labelled groups: Market Strategy · Messaging & Positioning · Sales & Outreach Assets · Commercial & Action Plan

---

## Generated GTM Sections

| # | Section | What You Get |
|---|---|---|
| 1 | Executive GTM Summary | Product snapshot, recommended GTM motion, key risks and opportunities |
| 2 | Product Positioning | One-sentence positioning, category framing, differentiation angle |
| 3 | Target Market Overview | Market size context, verticals, geographies, and timing signals |
| 4 | Ideal Customer Profile (ICP) | Firmographics, budget signals, urgency triggers, disqualification criteria |
| 5 | Buyer Personas | Role-by-role pain points, goals, objections, and influence in the deal |
| 6 | Pain Points & Buying Triggers | Specific workflow failures that trigger purchase decisions |
| 7 | Value Proposition | Pain → business impact → capability → proof needed — per persona |
| 8 | Competitive Landscape | Key alternatives, their weaknesses, and displacement messaging |
| 9 | Differentiation Strategy | Unique angles, positioning moats, and competitive proof points |
| 10 | Pricing and Packaging | Tiered structure with upgrade triggers and sales notes per tier |
| 11 | Sales Messaging Framework | Core value message, supporting points, and proof structure |
| 12 | LinkedIn Outreach | Personalised LinkedIn sequences ready to paste into a sequencer |
| 13 | Cold Email Sequence | Multi-touch cold email with subject lines and personalisation tokens |
| 14 | Discovery Call Questions | Structured question bank by topic for AE-led discovery calls |
| 15 | Objection Handling Playbook | 8+ objections with root cause analysis and scripted responses |
| 16 | GTM Action Plan (30/60/90 Days) | Week-by-week tasks, owners, deliverables, and success metrics |

---

## Features

- **16 GTM sections** generated from a single product brief in 45–90 seconds
- **Stripe-style SaaS workspace** — sidebar nav, KPI status bar, grouped report panels
- **B2B sales logic baked in** — buyer committee mapping, ICP definition, objection handling
- **FinTech-aware guardrails** — no guaranteed revenue claims, no fake certifications, AI accuracy wording reviewed
- **DeepSeek-powered** — uses DeepSeek V3 via OpenAI-compatible API, no OpenAI key required
- **4-group report navigation** — Market Strategy · Messaging · Sales Assets · Commercial
- **Recommended Next Actions panel** — context-aware suggestions before and after generation
- **Section copy + Markdown download** — each section and the full report are independently copyable
- **Sample data included** — one-click PayFlow AI demo to explore output format
- **API key stays in backend** — never exposed to the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, react-markdown |
| Backend | Python 3.11, FastAPI, OpenAI Agents SDK (`openai-agents`) |
| AI Model | DeepSeek V3 via OpenAI-compatible API (`deepseek-chat`) |
| UI Icons | lucide-react |

---

## Project Structure

```
FinGTM Agent/
├── README.md
├── Homepage.png
├── .gitignore
├── backend/
│   ├── main.py          # FastAPI app, CORS config, /api/generate-gtm-pack endpoint
│   ├── agent.py         # DeepSeek agent, system prompt, 16-section GTM prompt builder
│   ├── schemas.py       # Pydantic models — ProductInput (16 fields), GTMResponse
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    ├── app/
    │   ├── layout.tsx       # Root layout, metadata, Google Fonts (Inter)
    │   ├── page.tsx         # 4-state machine (idle/loading/success/error) + layout orchestration
    │   └── globals.css      # Tailwind base + .markdown-body prose styles + table styles
    ├── components/
    │   ├── AppShell.tsx          # h-screen flex layout — sidebar + scrollable main column
    │   ├── Sidebar.tsx           # 220px fixed nav (desktop), slide-in overlay (mobile)
    │   ├── WorkspaceMetrics.tsx  # 4 KPI status cards with live state and success subtitles
    │   ├── NextActionsPanel.tsx  # Context-aware action list — Suggested (idle) / Ready (success)
    │   ├── GuardrailsPanel.tsx   # FinTech compliance guardrails — dual-state display
    │   ├── ProductInputForm.tsx  # 16-field form in 4 collapsible groups, progress bar, loadSampleSignal
    │   ├── GTMReport.tsx         # 4-group section renderer with staggered animation
    │   ├── ReportSection.tsx     # Collapsible card — section icon, index, react-markdown, copy button
    │   ├── LoadingState.tsx      # 8-stage agent workflow timeline with elapsed timer
    │   ├── EmptyState.tsx        # Module cards + GTM pack structure navigator
    │   ├── ErrorState.tsx        # Error display with troubleshooting checklist
    │   ├── CopyButton.tsx        # Copy to clipboard with visual feedback
    │   └── DownloadButton.tsx    # Download as .md file
    └── lib/
        ├── types.ts       # TypeScript interfaces (ProductInput, GenerationState, GTMApiResponse)
        ├── api.ts         # Fetch client — AbortController + 180s timeout + error classification
        └── sampleData.ts  # PayFlow AI pre-filled demo data (PAYFLOW_SAMPLE, EMPTY_FORM)
```

---

## Getting Started

### Prerequisites

- [Anaconda](https://www.anaconda.com/) or Miniconda
- [Node.js](https://nodejs.org/) 18+
- A [DeepSeek API key](https://platform.deepseek.com)

---

### Backend Setup

**Step 1 — Create Conda environment**

```powershell
conda create -n fingtm-agent python=3.11 -y
conda activate fingtm-agent
```

**Step 2 — Install dependencies**

```powershell
cd backend
pip install -r requirements.txt
```

**Step 3 — Set your DeepSeek API key**

```powershell
# Windows PowerShell (current session)
$env:DEEPSEEK_API_KEY = "your_deepseek_api_key_here"
```

Or create a `.env` file in `backend/`:
```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**Step 4 — Start the backend**

```powershell
uvicorn main:app --reload --port 8000
```

Verify: `http://localhost:8000/health` → `{"status":"ok","deepseek_key_configured":true}`

---

### Frontend Setup

**Step 1 — Install dependencies**

```powershell
cd frontend
npm install
```

**Step 2 — Start the dev server**

```powershell
npm run dev
```

Open: **http://localhost:3000**

---

## Testing with Sample Data

1. Start the backend — `uvicorn main:app --reload --port 8000`
2. Start the frontend — `npm run dev`
3. Open **http://localhost:3000**
4. Click **"Load PayFlow sample"** in the Recommended Next Actions panel, or use the button inside the form
5. Click **"Generate GTM Pack"** — all 16 fields must be filled
6. Wait 45–90 seconds for the agent to complete
7. Browse grouped section cards, copy individual sections, or download the full report as `.md`

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `DEEPSEEK_API_KEY is not configured` | Missing env variable | Run `$env:DEEPSEEK_API_KEY = "sk-..."` before starting uvicorn |
| `Cannot connect to backend` | uvicorn not running | Run `uvicorn main:app --reload --port 8000` in the backend directory |
| `Authentication failed` | Wrong or expired API key | Verify key at platform.deepseek.com |
| `Model not found` | Wrong model name | Confirm `model="deepseek-chat"` in `backend/agent.py` |
| Frontend shows blank page | Stale `.next` build cache | Delete `frontend/.next` and restart `npm run dev` |
| Report stops before section 16 | Output token limit hit | `max_tokens=16000` is already set in `agent.py` |

---

## Deployment & Security Notes

> **This is a local MVP / portfolio project.**  
> Before exposing the backend to the internet, review and address the items below.

### Backend Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DEEPSEEK_API_KEY` | *(required)* | Your DeepSeek API key — server-side only, never expose to the browser |
| `ALLOWED_ORIGIN` | `http://localhost:3000` | Frontend origin allowed by CORS — set to your production URL before deploying |
| `RATE_LIMIT` | `5/minute` | slowapi rate limit per IP on the generate endpoint (e.g. `"10/minute"`, `"100/hour"`) |
| `DEMO_ACCESS_TOKEN` | *(unset)* | Optional shared secret to gate the demo. If set, requests must include a matching `X-Demo-Access-Token` header |

### Deployment Checklist

| Requirement | Status | Notes |
|---|---|---|
| Rate limiting on `/api/generate-gtm-pack` | **Done** | `slowapi` — default 5 req/min/IP, override with `RATE_LIMIT` env var |
| Optional demo access gate | **Done** | Set `DEMO_ACCESS_TOKEN` env var; enter token in sidebar to authenticate |
| HTTP security headers | **Done** | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |
| CORS origin configuration | **Done** | Override default via `ALLOWED_ORIGIN` env var — do not use `*` in production |
| API key isolation | **Done** | `DEEPSEEK_API_KEY` is read server-side only — never set it in frontend code |
| Error message safety | **Done** | Backend exceptions are logged server-side; only safe text is returned to the client |
| Backend authentication | Not implemented | For production, add a proper auth layer (OAuth, session tokens) beyond the demo gate |
| Content disclaimer | **Done** | All generated content is labeled "For strategic reference only" |

**Key rules:**
- Keep `DEEPSEEK_API_KEY` in backend environment variables only — never in frontend code or `.env` files committed to git
- Set `ALLOWED_ORIGIN` to your production frontend URL before deploying — do not use `*`
- Set `DEMO_ACCESS_TOKEN` to a strong random string before sharing a public demo link
- Generated content is strategic reference only — not legal, financial, regulatory, or compliance advice

---

## Security Notes

- `DEEPSEEK_API_KEY` is read server-side only — never sent to the browser
- All AI calls go through FastAPI — the frontend never calls DeepSeek directly
- CORS origin is configured via `ALLOWED_ORIGIN` env var (default: `http://localhost:3000`)
- Rate limiting via `slowapi` prevents API credit abuse (default: 5 req/min/IP)
- Demo access token is stored in browser `localStorage` — never in `NEXT_PUBLIC` env vars or source code
- No database, no user accounts — local development and demo tool only
- `.env` is in `.gitignore` — never commit your API key

---

## Codebase Orientation

Read these files in order to understand the full system:

| File | What It Teaches You |
|---|---|
| `backend/schemas.py` | The data contract — 16 input fields in, markdown string + success flag out |
| `backend/agent.py` | How the DeepSeek agent is configured and what it is instructed to generate |
| `backend/main.py` | FastAPI endpoint, error classification, CORS setup |
| `frontend/lib/types.ts` | TypeScript interfaces shared across all frontend components |
| `frontend/app/page.tsx` | Layout orchestration — state machine, callback wiring, column structure |
| `frontend/components/AppShell.tsx` | Sidebar integration and scroll container architecture |
| `frontend/components/ProductInputForm.tsx` | 16-field form in 4 collapsible groups with loadSampleSignal pattern |
| `frontend/components/GTMReport.tsx` | How markdown output is parsed and rendered into 4 grouped section clusters |

---

## Roadmap

| Feature | Status |
|---|---|
| 16-section GTM report generation | Done |
| Stripe-style SaaS workspace UI | Done |
| Left sidebar navigation | Done |
| Live KPI status cards | Done |
| Recommended Next Actions panel | Done |
| FinTech messaging guardrails panel | Done |
| 4-group report section navigation | Done |
| Sample data (PayFlow AI) | Done |
| Markdown copy + download per section | Done |
| Streaming output (show report as it generates) | Planned |
| PDF / DOCX export | Planned |
| Vertical modes (Payments, Lending, Treasury, InsurTech) | Planned |
| Competitor analysis agent | Planned |
| CRM export (HubSpot, Salesforce) | Planned |
| Team collaboration + saved reports | Planned |

---

## Authors

Built by **Becky Dai** and **Alice Liu**.

---

*FinGTM Agent is a portfolio and demonstration project. All generated GTM content is AI-generated and should be reviewed by a qualified GTM practitioner before use in production sales or marketing workflows.*
