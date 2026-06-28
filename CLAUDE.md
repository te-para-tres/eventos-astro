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

- **React 19** (islands architecture via `@astrojs/react`)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js` file)
- **Custom REST API** (`https://api.eventues.app/`) for the backend (no Supabase)
- **Firebase Hosting** for deployment

### Page Pattern

Interactive routes follow a two-file pattern:

- `src/pages/<route>/index.astro` — Astro shell that wraps the Layout and mounts the React component
- `src/pages/<route>/<route>View.tsx` — React component (default export)

Static content (no interactivity needed) uses plain `.astro` components instead of React.

**Hydration directives (`client:*`)** — choose by component priority/position, not by habit:

- `client:load` — high priority, above the fold, must be interactive immediately
- `client:idle` — medium priority; hydrates after load (`requestIdleCallback`)
- `client:visible` — low priority / below the fold; hydrates on entering the viewport
- `client:media="(...)"` — only interactive at certain screen sizes (responsive toggles)
- `client:only="react"` — components that depend on browser APIs (`localStorage`, `window`) or must not be server-rendered. The current code uses this widely, but prefer a priority-based directive when one fits better.

### Routes

| Route | View Component | Notes |
|---|---|---|
| `/` | `src/pages/Main.tsx` (`EventosPage`) | Home — event listing + filters |
| `/eventos/[id]` | (static Astro) | Event detail |
| `/departamentos` | (static Astro) | Departments listing |
| `/departamentos/[id]` | (static Astro) | Department detail |
| `/registro-evento` | `registroEventoView.tsx` | Event registration form |
| `/iniciar-sesion` | `iniciarSesionView.tsx` | Login form (UI only) |
| `/registro` | `registroView.tsx` | Signup form (UI only) |

### Key Files

- `src/layouts/Layout.astro` — Shared HTML shell with `<Navbar>`, `<Footer>`, Astro `<ClientRouter>` (view transitions), fonts, FontAwesome, and `<Toaster>` (sonner)
- `src/styles/global.css` — Tailwind v4 `@theme` block defining all custom design tokens
- `src/hooks/http.ts` — HTTP layer: `class HttpService` + exported singleton `http` (`API_URL = "https://api.eventues.app/"`). Methods `get/post/put/delete/getBlob/postFormData`; responses normalized to `DefaultResponse<T>` (`isError`, `status`, `resultado`)
- `src/services/*.ts` — Per-resource async data-fetching functions over `http` (e.g. `eventos.ts`, `carreras.ts`). Use `Modelo.ENDPOINTS.DEFAULT` for the URL, `Modelo.fromJsonList()` to hydrate, return `[]` on error
- `src/types/ModeloBase.model.ts` — Base class all `src/models/*.model.ts` extend (`id`, timestamps, `fromJson`/`fromJsonList`)
- `src/schemas/registroEventoSchema.ts` — Zod validation schemas (directory is `schemas`)

### Models

Domain models live in `src/models/Nombre.model.ts` as classes extending `ModeloBase`, with static `ENDPOINTS = { DEFAULT: "api/<recurso>.json" }`, `EXPAND = { DEFAULT: "rel1,rel2" }`, and `fromJson`/`fromJsonList`/constructor. Example: `src/models/Evento.model.ts`. (`src/types/QueryParams.model.ts` exists but is unused.)

### Environment Variables

Defined in `.env`. Astro exposes `PUBLIC_` prefixed vars to the client via `import.meta.env`.

### Tailwind Custom Tokens

All custom colors are defined in `src/styles/global.css` and usable as Tailwind classes:

- `text-primary`, `bg-primary`, `border-primary`, `text-primary-hover`
- `text-text-main`, `text-text-muted`, `text-text-light`
- `bg-bg-main`, `bg-bg-alt`, `bg-bg-card`
- `border-border-custom`
- `bg-accent-emerald`, `bg-accent-amber` — availability status colors

### Forms & Validation

The `/iniciar-sesion` and `/registro` views are currently UI-only forms (no auth backend wired yet). Form validation uses Zod schemas from `src/schemas/` together with react-hook-form (`zodResolver`); see `src/pages/registro-evento/registroEventoView.tsx` for the canonical pattern. UI feedback uses `sonner` toasts; programmatic navigation uses `navigate` from `astro:transitions/client`.

### Agents

This repo defines a multi-agent workflow in `.claude/agents/` (`orquestador`, `implementador`, `tester`, `reviewer`). The `orquestador` coordinates the others, improves the prompt, and asks before touching project config.
