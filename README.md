# Optifeed AI Video — Prototype

A product video generation workflow prototype built for e-commerce merchants. Select products from a catalog, pick a video template, review generated videos, and export to ad channels — all in a guided 6-step flow.

> **This is a frontend prototype.** No backend, no real AI generation, no real video export. All data is static and mocked.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## Quick Start

```bash
npm install
npm run dev
```

App runs at `http://localhost:8080`. No environment variables required.

```bash
npm run build    # production build
npm run lint     # ESLint
npm run test     # Vitest
```

---

## What It Does

The app walks merchants through a 6-step video creation workflow:

```
Select products → Campaign setup → Choose template → Review → Export → Done
```

1. **Select** — browse and filter a product catalog, pick up to 10 items
2. **Campaign setup** — name the campaign, choose sector and theme
3. **Template** — pick a video scenario; textile sector gets a dedicated scene-based screen with hover video previews
4. **Generate & Review** — simulated video generation with per-video approve/reject
5. **Export** — choose ad channels (Meta, Google, etc.) and export
6. **Success** — summary with token cost

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 + shadcn/ui |
| State | Local `useState` (no global store) |
| Data fetching | TanStack React Query (initialized, not actively used) |
| Notifications | Sonner |
| Icons | Lucide React |
| Tests | Vitest + Testing Library |

---

## Project Structure

```
src/
  pages/
    Videos.tsx                          # Main workflow controller — all cross-step state lives here
  components/
    AppShell.tsx                        # Sidebar + main layout
    videos/
      SelectStep.tsx                    # Product catalog with filters and search
      TemplateSelectionStep.tsx         # Generic template picker
      TextileTemplateSelectionStep.tsx  # Sector-specific template screen
      TextileTemplateCard.tsx           # Portrait video card with hover preview
      GenerateReviewStep.tsx            # Per-video approve/reject
      ExportStep.tsx                    # Channel selection and export
      SuccessStep.tsx                   # Completion summary
  data/
    products.ts                         # Static product catalog (12 items)
    templates.ts                        # Generic video templates
    textile-templates.ts                # Textile-specific scene templates
    tokens.ts                           # Mock token balance and cost constants
  types/
    video-flow.ts                       # Shared TypeScript types
```

---

## Mock Behavior

| Feature | Behavior |
|---|---|
| Video generation | 1200ms `setTimeout` + static sample MP4 |
| Token balance | Hardcoded mock values |
| Product catalog | 12 static items with Unsplash images |
| Export to channels | Toast notification only |
| ZIP download | Toast notification only |
| Authentication | None |

---

## Textile Sector Feature

When a campaign is created with the **Moda & Giyim** sector, the template selection screen switches to a textile-specific experience:

- **Scene-based templates** with descriptive names ("Sokakta Yürüyen Kız", "Plajda Yürüyen Kız", etc.)
- **Portrait (3:4) video cards** — hover plays the template preview video
- **Scene metadata overlays** — location tag and duration on each card
- **Scenario detail popover** — scenario flow, suitable product types, accessory notes

Other sectors use the generic template screen.

---

## Requirements

- Node.js 18+
- No external services, no API keys, no database
