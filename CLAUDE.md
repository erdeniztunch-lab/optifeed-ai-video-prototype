# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
npm run preview      # Serve the production build locally
```

## Architecture

**Optifeed AI Video** is a React/TypeScript SPA for e-commerce merchants to generate AI-powered product videos. Built with Vite, React Router v6, Tailwind CSS, and shadcn/ui components.

### Workflow

The app is a linear 6-step wizard managed in [src/pages/Videos.tsx](src/pages/Videos.tsx):

```
entry → select → generate → preview → send → success
```

Each step maps to a component in [src/components/videos/](src/components/videos/). The `Videos.tsx` page owns the stage state, selected product IDs, chosen template, and distribution channels — all passed down as props.

### Key Files

- [src/App.tsx](src/App.tsx) — Router setup and QueryClient provider. `/` redirects to `/videos`.
- [src/pages/Videos.tsx](src/pages/Videos.tsx) — Workflow controller; all cross-step state lives here.
- [src/components/AppShell.tsx](src/components/AppShell.tsx) — Fixed sidebar + main content layout.
- [src/data/products.ts](src/data/products.ts) — Static product catalog (12 items). Currently the only data source; there is no backend or API integration.

### Current State

- Video generation is **mocked** with a 1200ms `setTimeout` and a static sample MP4 URL.
- Product images come from Unsplash. No environment variables are required to run the app.
- TanStack React Query is initialized but not actively used; all state is local `useState`.
- TypeScript is configured loosely (`noImplicitAny: false`, `strictNullChecks: false`).

### Path Alias

`@/` maps to `src/` (configured in [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)).

### Styling

Design tokens are HSL CSS variables defined in [src/index.css](src/index.css). Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) (re-exports `clsx` + `tailwind-merge`) for conditional class composition.
