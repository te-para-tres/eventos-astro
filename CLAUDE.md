# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
yarn dev        # Start dev server at localhost:4321
yarn build      # Build production site to ./dist/
yarn preview    # Preview production build locally
yarn astro check  # TypeScript type checking
```

Deploy to Firebase Hosting (site: `qeventr`):

```sh
yarn build && firebase deploy --only hosting
```

## Architecture

This is an **Astro 5** project for the Universidad Estatal de Sonora event board, using:

- **React** (islands architecture via `@astrojs/react`)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, no config file)
- **Supabase** for authentication and backend
- **Firebase Hosting** for deployment

### Page Pattern

Every route follows a two-file pattern:

- `src/pages/<route>/index.astro` — Astro shell that wraps the Layout and mounts the React component
- `src/pages/<route>/<route>View.tsx` — React component rendered with `client:only="react"`

<!-- Example: `src/pages/dashboard/index.astro` uses `<DashboardView client:only="react" />`. -->

Static content (no interactivity needed) uses plain `.astro` components instead of React.

### Key Files

- `src/layouts/Layout.astro` — Shared HTML shell with `<Navbar>`, `<Footer>`, Astro `<ClientRouter>` (view transitions), Google Fonts, FontAwesome, and Material Icons
- `src/styles/global.css` — Tailwind v4 `@theme` block defining all custom design tokens (primary color `#7b163e`, semantic color names like `text-main`, `bg-alt`, `border-custom`)
- `src/shemas/registroSchema.ts` — Zod validation schemas (note: directory is `shemas`, not `schemas`)
- `src/types/` — TypeScript model classes
- `src/lib/supabase.ts` — Supabase client (referenced by dashboard page; must export a `supabase` client using `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY` env vars)

### Environment Variables

Defined in `.env`. Astro exposes `PUBLIC_` prefixed vars to the client via `import.meta.env`:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_KEY`

### Tailwind Custom Tokens

All custom colors are defined in `src/styles/global.css` and usable as Tailwind classes:

- `text-primary`, `bg-primary`, `border-primary`, `text-primary-hover`
- `text-text-main`, `text-text-muted`, `text-text-light`
- `bg-bg-main`, `bg-bg-alt`, `bg-bg-card`
- `border-border-custom`
- `bg-accent-emerald`, `bg-accent-amber`

### Auth Pattern

Auth is handled client-side in React components using `supabase.auth`. The dashboard checks `supabase.auth.getUser()` on mount and redirects unauthenticated users via Astro's `navigate()` from `astro/virtual-modules/transitions-router.js`. User email is cached in `localStorage`.
