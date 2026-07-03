# YieldSense AI — Frontend (Milestone 1)

Next.js 14 (App Router) + TypeScript + Tailwind. Covers the Milestone 1
wireframe set: auth screens, farm onboarding, and a dashboard shell with
placeholders for the Milestone 2 ML charts.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point at your running backend
npm run dev
```

Visit http://localhost:3000. The backend (see `../yieldsense-backend`)
must be running at the URL set in `NEXT_PUBLIC_API_BASE_URL` (default
`http://127.0.0.1:8000`) for auth and farm forms to work.

## Structure

```
app/
  page.tsx           Landing page
  login/page.tsx      Login form
  signup/page.tsx      Signup form (role select: Farmer / Admin)
  onboarding/page.tsx  Farm profile form (coordinates + N-P-K + pH)
  dashboard/page.tsx    Farm list + placeholder ML panels
components/
  FieldInput.tsx       Shared ledger-style form field
  Navbar.tsx           Top nav
  SoilHorizonBar.tsx    Signature decorative strip
lib/
  api.ts               Typed fetch client for the FastAPI backend
```

## Design notes

Visual identity is a "field ledger": pale sage-paper background, loam-ink
text, a growth-green + wheat-gold accent pair, hairline dividers instead
of cards, and monospace figures for coordinates/soil readings so they
read like instrument output. The soil-horizon strip at the top of each
page echoes the N-P-K soil model the product is built around.
