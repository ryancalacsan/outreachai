# OutreachAI

AI-powered patient outreach message generator for maternal and women's healthcare. Care coordinators select a patient, configure outreach parameters, and generate personalized messages across SMS, email, and in-app channels — each with multiple variants, engagement predictions, and clinical reasoning.

![OutreachAI — Generated Messages](public/screenshots/outreachai-messages.png)

## Live Demo

**[outreachai.ryancalacsan.dev](https://outreachai.ryancalacsan.dev)**

The app works immediately in Demo Mode with pre-generated responses — no API keys needed.

## Features

- **Patient-aware generation** — 4 realistic patient profiles with clinical context (pregnancy, postpartum, midlife care), risk factors, care team info, and interaction history
- **Multi-channel output** — SMS, email, and in-app messages with channel-appropriate formatting and length
- **A/B/C variant generation** — Each channel produces 3 message variants with different approaches (empathy-led, resource-focused, clinical-gentle, etc.)
- **Engagement scoring** — Each variant includes a predicted engagement likelihood (high/medium/low) with clinical reasoning
- **Smart defaults** — Outreach goal and preferred channel auto-populate based on patient lifecycle stage
- **6 outreach goals** — Enrollment, onboarding, appointment reminders, re-engagement, win-back, educational
- **4 message tones** — Warm/supportive, clinical/informative, urgent/action, casual/friendly
- **Live LLM streaming** — Real-time token streaming with Gemini and Claude, with progress indicators
- **Responsive design** — Desktop sidebar layout with mobile bottom sheet drawer

![OutreachAI — Campaign Dashboard](public/screenshots/outreachai-dashboard.png)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui v4 |
| LLM Providers | Google Gemini (2.5 Flash, 2.5 Flash Lite, 3.1 Flash Lite Preview), Anthropic Claude Sonnet |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Select **Demo Mode** to explore the full app with no configuration.

### Live AI Mode

To use live LLM generation, create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
DEMO_ACCESS_CODE=your_access_code
```

Select a live AI model in the sidebar and enter the access code to generate.

## Architecture

```
src/
  app/
    api/generate/          # POST endpoint — routes to mock or live LLM
    page.tsx               # Main layout (campaign dashboard + generation view)
    globals.css            # Theme, animations, custom properties
  components/
    campaign-view.tsx      # Dashboard with patient overview and stats
    patient-card.tsx       # Patient context display (compact + full)
    patient-select.tsx     # Patient dropdown with lifecycle/program tags
    outreach-controls.tsx  # Configuration panel (goal, tone, channels, model)
    message-output.tsx     # Generated message variants with tabs
    mobile-controls-drawer.tsx  # Bottom sheet for mobile
    layout/header.tsx      # App header
    ui/                    # shadcn/ui primitives
  lib/
    data/
      patients.ts          # 4 patient profiles with clinical context
      mock-responses.ts    # Pre-generated demo responses
    llm/
      index.ts             # Provider factory + response validation
      gemini.ts            # Google Gemini integration
      gemini-stream.ts     # Gemini SSE streaming
      claude.ts            # Anthropic Claude integration
      claude-stream.ts     # Claude SSE streaming
    prompts/
      outreach.ts          # Dynamic system + user prompt construction
    types.ts               # Shared TypeScript types
    api.ts                 # Client-side fetch + SSE stream parser
    utils/format.ts        # Label maps, date formatting
```

## Design Decisions

- **Dynamic prompts** — System prompts only include rules for selected channels, reducing token usage and improving compliance
- **Server-side filtering** — Channel filtering on the response as a safety net for LLM non-compliance
- **Response validation** — LLM output is validated for expected shape before being returned to the client
- **Rate limiting** — In-memory rate limiting (10 req/hr per IP) with periodic cleanup for live mode
- **Access code gating** — Live LLM endpoints require an access code to prevent unauthorized API usage
- **Mock-first** — Demo mode is the default, so the app is fully functional without any API keys
- **Smart fallback** — Mock mode tries exact match, then goal-match, then tone-match, then any patient scenario before falling back to generic responses
- **Input validation** — API route validates request body, required fields, provider, and channel values at the boundary

## What I'd Build Next

- **Spanish language support** — Maria's profile is already set up for bilingual outreach; extend prompts and UI for language selection
- **A/B test tracking** — Record which variant a coordinator selects and track engagement outcomes over time
- **Analytics dashboard** — Visualize outreach volume, channel performance, and engagement rates across the patient population
- **EHR integration** — Pull real patient context from Epic/Cerner FHIR APIs instead of static profiles
- **Care team collaboration** — Allow nurses to edit, approve, and schedule generated messages directly
- **Compliance review workflow** — Flag messages for clinical review before sending, with audit trail
- **Batch generation** — Generate outreach for an entire patient cohort at once with campaign-level controls
