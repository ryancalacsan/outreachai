# OutreachAI

AI-powered patient outreach message generator for maternal and women's healthcare. Built as a demo for care coordination teams to generate personalized, multi-channel engagement messages using LLMs.

## What It Does

Care coordinators select a patient, configure outreach parameters (goal, tone, channels), and generate personalized messages across SMS, email, and in-app channels. Each generation produces multiple message variants (A/B/C) with engagement predictions and reasoning.

**Key features:**
- 4 realistic patient profiles with clinical context (pregnancy, postpartum, midlife care)
- 6 outreach goals: enrollment, onboarding, appointment reminders, re-engagement, win-back, educational
- 4 message tones: warm/supportive, clinical/informative, urgent/action, casual/friendly
- Multi-channel output with channel-appropriate formatting
- A/B/C variant generation with engagement likelihood scoring
- Demo mode with pre-generated responses (no API key needed)
- Live mode with Gemini 2.5 Flash and Claude Sonnet

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui v4
- **LLM Providers:** Google Gemini 2.5 Flash, Anthropic Claude Sonnet
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works immediately in Demo Mode with no configuration.

### Live AI Mode

To use live LLM generation, create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
DEMO_ACCESS_CODE=your_access_code
```

Select a live AI model in the sidebar and enter the access code to generate messages.

## Architecture

```
src/
  app/
    api/generate/     # POST endpoint — routes to mock or live LLM
    page.tsx           # Main page (campaign dashboard + generation view)
    globals.css        # Theme, animations, custom properties
  components/
    campaign-view.tsx  # Dashboard with patient overview and stats
    patient-card.tsx   # Patient context display (compact + full)
    outreach-controls.tsx  # Sidebar configuration panel
    message-output.tsx # Generated message variants display
    layout/header.tsx  # App header
    ui/               # shadcn/ui components
  lib/
    data/
      patients.ts     # 4 patient profiles with clinical context
      mock-responses.ts  # Pre-generated demo responses
    llm/
      index.ts        # Provider factory (routes to gemini/claude)
      gemini.ts       # Google Gemini integration
      claude.ts       # Anthropic Claude integration
    prompts/
      outreach.ts     # Dynamic system + user prompt construction
    types.ts          # Shared TypeScript types
    api.ts            # Client-side fetch helper
    utils/format.ts   # Label maps, date formatting
```

## Design Decisions

- **Dynamic prompts:** System prompts only include rules for selected channels, reducing token usage
- **Server-side filtering:** Channel filtering on the response as a safety net for LLM non-compliance
- **Rate limiting:** In-memory rate limiting (10 req/hr per IP) for live mode
- **Access code gating:** Live LLM endpoints require an access code to prevent unauthorized API usage
- **Mock-first:** Demo mode is the default, so the app is fully functional without any API keys
