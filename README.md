# ContractorFlow

A modern **Contractor Lead & Estimate Management Platform** built with Next.js 15, React, TypeScript, Tailwind CSS, Shadcn-style UI, Framer Motion, React Hook Form, Zod, and Supabase.

## Features

### Public Customer Portal
- Hero section with CTA
- Project request form (customer info, service type, budget, timeline, photos, consultation scheduling)
- Success confirmation screen

### Contractor Dashboard
- **Dashboard** — Metrics, lead funnel chart, activity feed, upcoming consultations
- **Leads** — List/grid, search, filters, Kanban pipeline, detail view with notes & photos
- **Estimates** — Line-item builder, tax calculation, draft/send, PDF export, accept/reject
- **Calendar** — Month/week/day views
- **Customers** — Profiles with project history
- **Settings** — Company branding, tax rate, notifications

### Bonus
- Dark mode · Lead priority scoring · Loading skeletons · Empty states · Demo data (localStorage)

## Tech Stack

- Next.js 15 · React 19 · TypeScript
- Tailwind CSS v4 · Radix UI primitives
- Framer Motion · React Hook Form · Zod
- Supabase (optional — works in demo mode without credentials)
- Recharts · jsPDF

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public portal.  
Contractor dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Environment Variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the SQL migration in `supabase/migrations/001_initial_schema.sql` and create a `lead-photos` storage bucket in Supabase.

Without Supabase, the app runs in **demo mode** using browser localStorage with sample data.

## GitHub Pages Deployment

This project uses **static export** and deploys via GitHub Actions to the `gh-pages` branch.

### Setup (required once)

1. Push this repo to GitHub: `https://github.com/AstridBonoan/ContractFlow.io`
2. Go to **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**
4. Select branch: **`gh-pages`** · folder: **`/ (root)`**
5. Save

On every push to `main`, the workflow `.github/workflows/deploy-pages.yml` builds the site and updates `gh-pages`.

Live URL: `https://astridbonoan.github.io/ContractFlow.io/`

### CI

`.github/workflows/ci.yml` runs lint and build on pull requests and pushes.

## Project Structure

```
src/
  app/              # Next.js App Router pages
  components/       # UI, portal, dashboard, layout
  lib/              # Supabase, store, PDF, constants
  types/            # TypeScript interfaces
supabase/migrations # Database schema
.github/workflows   # CI & Pages deploy
```

## License

MIT
