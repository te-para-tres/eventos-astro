# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
yarn dev        # Start dev server at localhost:4321
yarn build      # Build production site to ./dist/
yarn preview    # Preview production build locally
yarn astro check  # TypeScript type checking
```

There is no test runner or linter configured; `yarn astro check` + `yarn build` are the verification steps. CI (`.github/workflows/build.yml`) only runs `yarn install --frozen-lockfile && yarn build` on Node 24 for pushes to `main`. `yarn.lock` is the lockfile CI and Docker use (a stray `package-lock.json` is also committed).

Deploy to Firebase Hosting (site: `qeventr`):

```sh
yarn build && firebase deploy --only hosting
```

Caveat: `firebase.json` serves `dist/` as a static SPA (all paths rewrite to `/index.html`), but several pages opt out of prerendering (see Rendering below) and only exist in the Node server build. The `dockerfile.dk` image runs that server (`node ./dist/server/entry.mjs`, port 4321), which is the deploy target that actually serves SSR pages.

## Architecture

This is an **Astro 7** project for the Universidad Estatal de Sonora event board, using:

- **React 19** (islands architecture via `@astrojs/react`)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js` file)
- **Custom REST API** for the backend (base URL from `PUBLIC_API_URL`, see `src/constants/index.ts`)
- **shadcn/ui on top of `@base-ui/react`** (not Radix) — primitives in `src/components/ui/` (lowercase filenames, configured by `components.json`); `cn()` in `src/lib/utils`
- Import alias `@/*` → `src/*`
- **Firebase Hosting** for deployment

### Page Pattern

Interactive routes follow a two-file pattern:

- `src/pages/<route>/index.astro` — Astro shell that wraps the Layout and mounts the React component
- `src/pages/<route>/<route>View.tsx` — React component (default export). Some routes instead use `_`-prefixed files/folders (`src/pages/_index.tsx`, `src/pages/eventos/_components/index.tsx`); the `_` prefix keeps Astro from treating them as routes.

Static content (no interactivity needed) uses plain `.astro` components instead of React.

**Hydration directives (`client:*`)** — choose by component priority/position, not by habit:

- `client:load` — high priority, above the fold, must be interactive immediately
- `client:idle` — medium priority; hydrates after load (`requestIdleCallback`)
- `client:visible` — low priority / below the fold; hydrates on entering the viewport
- `client:media="(...)"` — only interactive at certain screen sizes (responsive toggles)
- `client:only="react"` — components that depend on browser APIs (`localStorage`, `window`) or must not be server-rendered. The current code uses this widely, but prefer a priority-based directive when one fits better.

### Rendering

`astro.config.mjs` uses `output: "static"` with the `@astrojs/node` standalone adapter. Pages are prerendered by default; pages that fetch per-request data declare `export const prerender = false` and fetch in the Astro frontmatter via `src/services/*` (currently `eventos/[id].astro`, `departamentos/index.astro`, `departamentos/[id].astro`).

### Routes

| Route | View Component | Notes |
|---|---|---|
| `/` | `src/pages/_index.tsx` (`IndexView`) | Home / landing |
| `/eventos` | `src/pages/eventos/_components/index.tsx` (`EventosView`) | Event listing + filters |
| `/eventos/[id]` | (Astro, SSR) | Event detail |
| `/departamentos` | (Astro, SSR) | Departments listing |
| `/departamentos/[id]` | (Astro, SSR) | Department detail |
| `/registro-evento` | `registroEventoView.tsx` | Event registration form |
| `/iniciar-sesion` | `iniciarSesionView.tsx` | Student login |
| `/registro` | `registroView.tsx` | Student signup (logs in and redirects to `/eventos`) |
| `/perfil` | `src/pages/perfil/_components/index.tsx` (`PerfilView`) | Logged-in student profile |

### Key Files

- `src/layouts/Layout.astro` — Shared HTML shell with `<Navbar>`, `<Footer>`, Astro `<ClientRouter>` (view transitions), fonts, FontAwesome, and `<Toaster>` (sonner)
- `src/styles/global.css` — Tailwind v4 `@theme` block defining all custom design tokens
- `src/hooks/http.ts` — HTTP layer: `class HttpService` + exported singleton `http` built from `API_URL`. Methods `get/post/put/delete/getBlob/postFormData`; responses normalized to `DefaultResponse<T>` (`isError`, `status`, `resultado`)
- `src/services/*.ts` — Per-resource async data-fetching functions over `http` (e.g. `eventos.ts`, `carreras.ts`). Use `Modelo.ENDPOINTS.DEFAULT` for the URL, `Modelo.fromJsonList()` to hydrate, return `[]` on error
- `src/types/ModeloBase.model.ts` — Base class all `src/models/*.model.ts` extend (`id`, timestamps, `fromJson`/`fromJsonList`)
- `src/schemas/*` — Zod validation schemas (`registroEventoSchema.ts`, `registro.schema.ts`, `iniciarSesion.schema.ts`)
- `src/stores/sesion.store.ts` — nanostores `persistentAtom`s for the session: `$token` (localStorage `eventues-token`), `$refreshToken`, `$estudiante`; `tokenPorExpirar()` reads the JWT `exp`. `http.ts` reads `$token` to send `Authorization: Bearer`
- `src/hooks/useAuth.ts` — `useAuth()` returns `{ usuario, iniciarSesion, registrar, cerrarSesion, refrescarToken, asegurarToken }`

### Models

Domain models live in `src/models/Nombre.model.ts` as classes extending `ModeloBase`, with static `ENDPOINTS = { DEFAULT: "api/<recurso>.json" }`, `EXPAND = { DEFAULT: "rel1,rel2" }`, and `fromJson`/`fromJsonList`/constructor. Example: `src/models/Evento.model.ts`. `tsconfig.json` sets `useDefineForClassFields: false`, which the models rely on: `ModeloBase`'s constructor does `Object.assign(this, data)`, and with define semantics the subclasses' uninitialized field declarations would reset those values to `undefined`. (`src/types/QueryParams.model.ts` exists but is unused.)

### Environment Variables

Defined in `.env.development.local` and `.env.production`, typed in `src/.env.d.ts`, and read only through `src/constants/index.ts`: `API_URL` (`PUBLIC_API_URL`, falls back to `http://localhost:8080/`), `IS_DEV`, `SHOW_DEVTOOLS`, `VERSION`, `PROJECT_NAME`, and `URL_RECURSOS` (`${API_URL}/recursos`, prefix for media paths such as `evento.imagenDestacada.ruta`).

### Design System

**Before any UI/design work (new pages, components, styling, redesigns), read and follow [`DESIGN.md`](DESIGN.md).** It defines the visual identity: color tokens from `src/styles/global.css`, typography, layout shell, component patterns, icons, motion, and what not to do. If a request contradicts `DESIGN.md`, say so before deviating. If the identity changes intentionally, update `DESIGN.md` in the same change.

### Session

Student auth lives in the PHP API's `api` module (`eventos-php/modulos/api`): `registro`, `iniciar-sesion`, `refrescar-token`, `cerrar-sesion` and `estudiante` (Bearer). Login returns a 1 h JWT plus a 30-day refresh token (table `RefreshTokenEstudiante`) that rotates on use, with a 30 s grace window so a lost refresh response does not end the session; `useAuth` dedupes concurrent refreshes. `NavbarSesion.tsx` (avatar + menu) and `PerfilView` call `asegurarToken()` on mount, which refreshes when the JWT is about to expire; a failed refresh clears the session.

### Forms & Validation

Form validation uses Zod schemas from `src/schemas/` together with react-hook-form (`zodResolver`); see `src/pages/registro-evento/registroEventoView.tsx` for the canonical pattern. UI feedback uses `sonner` toasts; programmatic navigation uses `navigate` from `astro:transitions/client`.

### Agents

This repo defines a multi-agent workflow in `.claude/agents/` (`orquestador`, `implementador`, `tester`, `reviewer`). The `orquestador` coordinates the others, improves the prompt, and asks before touching project config.
