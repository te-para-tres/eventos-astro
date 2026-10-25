# DESIGN.md

Identidad visual de **Eventues**, el tablero de eventos de la Universidad Estatal de Sonora. Todo lo que aparece aquí sale del código actual. Si un cambio de UI contradice este documento, avísalo antes de desviarte. Si la identidad cambia a propósito, actualiza este archivo en el mismo cambio.

## Identidad

- Marca: **Eventues**. Tono universitario, cercano y claro.
- Color de marca: **guinda `#731C38`**. Hover: `#8f2347`.
- Todo el texto de la interfaz va en español. Fechas con `dayjs` y locale `es` (`"dddd, D [de] MMMM [de] YYYY"`, `"D MMM"`). Números con `toLocaleString("es-MX")`.

## Color

Los tokens están en `src/styles/global.css`. Usa siempre tokens, nunca hex sueltos en las clases.

| Token (clase) | Valor | Uso |
|---|---|---|
| `primary` | `#731C38` | Marca: CTAs, palabra destacada en títulos, íconos de acento, overlines, footer |
| `primary-hover` | `#8f2347` | Hover de todo lo que sea `bg-primary` o `text-primary` |
| `primary/10` | — | Fondo de ítem activo o hover suave (nav) |
| `text-main` | `#0f172a` | Títulos y texto principal |
| `text-muted` | `#64748b` | Párrafos, descripciones, metadatos |
| `text-light` | `#f8fafc` | Texto sobre `bg-primary` (usa `/70` o `/80` para texto secundario) |
| `bg-main` | `#f8f9fa` | Fondo de inputs y hover de botón secundario |
| `bg-alt` | `#ffffff` | Bandas de sección (`bg-bg-alt border-y border-border-custom`) |
| `bg-card` | `#ffffff` | Tarjetas y paneles |
| `border-custom` | `#e2e8f0` | Bordes de tarjetas, paneles y separadores |
| `accent-emerald` | `#059669` | Disponible, éxito, inscripción confirmada |
| `accent-amber` | `#d97706` | Cupo limitado, advertencia |
| `destructive` | (shadcn) | Error, cancelar |

Advertencias:

- `@theme inline` vuelve a definir `--color-primary` con la variable shadcn `--primary` (`oklch(0.378 0.122 5.9)`, el mismo guinda en oklch). También redefine `--color-secondary`, así que `bg-secondary` es el gris neutro de shadcn, **no** `#1a202c`.
- Paleta guinda extendida (`PageTransitionOverlay.astro`), para degradados o capas: `#2a0814` → `#3d0e1f` → `#561429` → `#731C38` → `#8f2347` → `#b54e6f` → `#e8a8bc`.
- Deuda, no patrón: hoy hay `gray-*`, `stone-500`, `orange-500`, `emerald-500`, `green-*`, `red-*`, `yellow-400`, `rose-900` y `focus:ring-blue-500` en `eventos/[id].astro`, `departamentos/*`, `EventCard.tsx`, `registroEventoView.tsx` e `iniciarSesionView.tsx`. En código nuevo usa el token equivalente: `text-text-muted` en lugar de `text-gray-500/600`, `border-border-custom` en lugar de `border-gray-200`, `bg-accent-amber` en lugar de `bg-orange-500`, `hover:bg-primary-hover` en lugar de `hover:bg-rose-900` y `ring-primary` en lugar de `ring-blue-500`.
- La única excepción a "no usar colores crudos" es `bg-stone-100`, el fondo del shell (ver Layout).

## Tipografía

- Fuente oficial: **Geist Variable** (`@fontsource-variable/geist`, `--font-sans` y `--font-heading`). No agregues otras fuentes.
  - Deuda: `Layout.astro` carga Inter desde Google Fonts sin usarla, y su `<style is:global>` pone `html { font-family: system-ui }`, que le gana a Geist. Hoy la página se ve en system-ui.
- Los títulos son pesados y cerrados. La palabra clave va en guinda: `Vive los <span class="text-primary">eventos</span>`.

| Rol | Clases |
|---|---|
| Hero (h1 de home) | `text-5xl md:text-7xl font-extrabold tracking-tight text-text-main` |
| H1 de página | `text-4xl font-extrabold` + palabra en `text-primary` |
| H1 de detalle | `text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight` |
| H2 de sección | `text-3xl md:text-5xl font-extrabold text-text-main` |
| H3 de tarjeta | `text-lg font-bold` (hover `text-primary`) |
| Intro | `text-lg md:text-xl text-text-muted max-w-2xl mx-auto` |
| Cuerpo | `text-sm sm:text-base text-text-muted leading-relaxed` |
| Overline / etiqueta | `text-xs font-medium uppercase tracking-widest text-primary` |
| Label de filtro | `text-xs font-semibold text-primary` |
| Estadística | `text-5xl md:text-6xl font-extrabold tracking-tight` |

## Layout

- **Shell** (`Layout.astro`): `body bg-stone-100`, contenedor `min-h-screen p-4 flex flex-col`. El `<main>` es una hoja blanca `rounded-2xl bg-white shadow-sm overflow-hidden` con `-mt-5` para quedar bajo el navbar.
- **Navbar** (`Navbar.astro`): "pestaña" sticky `max-w-4xl bg-stone-100 rounded-2xl rounded-t-none h-16`. Logo en cuadro `bg-primary rounded-lg` con ícono `School` y el texto "Eventues" en `font-bold tracking-tight text-primary`. Links dentro de una píldora blanca `rounded-xl p-2`. El ítem activo lleva `bg-primary/10 text-primary` y `aria-current="page"`.
- **Footer** (`Footer.astro`): bloque `bg-primary text-white rounded-2xl` con un marquee gigante de "Eventues" en `text-white/15 font-black`, más una grilla de links que se invierten a `bg-white text-primary` en hover.
- **Contenedor de página**: `max-w-7xl mx-auto px-6 py-16`. En la home: `py-20` o `py-24` y secciones centradas.
- **Detalle** (evento, departamento): `xl:grid xl:grid-cols-12`, contenido en `xl:col-span-8` y sidebar en `xl:col-span-4`, con `gap-6 lg:gap-8`. `Breadcrumbs` arriba con `mb-6`.
- **Grillas de tarjetas**: `grid gap-6|gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- **Bandas**: alterna fondo blanco, banda `bg-bg-alt border-y border-border-custom` y banda de impacto `bg-primary text-text-light`.

## Forma: radios y sombras

- `rounded-lg`: controles, botones pequeños, cuadros de ícono, badges grandes.
- `rounded-xl`: tarjetas, paneles de filtros, botones CTA, imágenes.
- `rounded-2xl`: piezas del shell (main, navbar, footer) y modales o paneles grandes.
- `rounded` / `rounded-full`: badges sobre imagen, avatares e íconos circulares.
- Sombras suaves: `shadow-sm` en reposo, `shadow-md` en hover o en destacados. `shadow-xl` solo en el hover de `EventCard`.

## Componentes

Usa primero `src/components/ui/*` (shadcn estilo `base-nova` sobre `@base-ui/react`) y los componentes de `src/components/` (`EventCard`, `Breadcrumbs`, `Paginacion`, `QuerySelector`, `DatePicker`). Combina clases con `cn()` de `@/lib/utils`.

- **Botón primario / CTA**: `inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-text-light transition-colors hover:bg-primary-hover`, normalmente con `<ArrowRight className="size-5" />` al final.
- **Botón secundario**: `rounded-xl border border-border-custom bg-bg-alt px-7 py-3.5 font-semibold text-text-main hover:bg-bg-main`.
- **Link de acción**: `inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-hover` + `ArrowRight size-4`.
- **Tarjeta**: `rounded-xl border border-border-custom bg-bg-card p-6 transition-shadow hover:shadow-md`.
  - Tarjeta de evento (`EventCard`): imagen `h-52 object-cover` con `group-hover:scale-110 duration-500`, card con `hover:-translate-y-1 hover:shadow-xl`, título en `group-hover:text-primary` y metadatos con íconos `Clock`/`MapPin` en `text-primary`.
  - Tarjeta destacada (inscripción): `border-t-4 border-primary shadow-md`.
  - Tarjeta-link pequeña: `rounded-lg border hover:border-primary hover:shadow-sm`.
- **Badge sobre imagen**: `absolute top-4 left-4`, `px-3 py-1 text-xs font-bold text-white rounded`, `bg-primary` para la categoría y `bg-accent-emerald` / `bg-accent-amber` para la disponibilidad.
- **Cuadro de ícono**: `w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center` (`rounded-full` en listados).
- **Panel de filtros**: `bg-bg-card border border-border-custom rounded-xl p-6` con grilla `items-end` y labels `text-xs font-semibold text-primary`.
- **Barra de progreso**: `h-2 bg-border-custom rounded-full` con relleno `bg-primary transition-all duration-500`.
- **Estados**: la carga es `<Spinner />` centrado con `py-24`. El vacío es un ícono lucide `w-10 h-10` + `<p class="text-sm">` centrado en `text-text-muted`.
- **Feedback**: toasts con `sonner` (`toast()`), ya montado en `Layout`.

## Iconos

- **lucide-react** es la librería oficial (`iconLibrary` en `components.json`). Tamaños: `size-4` en línea, `size-5` en CTAs, `size-8`/`size-12` en `text-primary` sobre títulos de sección.
- FontAwesome sigue cargado solo por código legado (`EventosCalendario.tsx`). No lo uses en código nuevo.
- Los íconos decorativos llevan `aria-hidden="true"`. Los botones que solo tienen ícono llevan `aria-label`.

## Movimiento

- Animaciones con `motion/react`. La variante estándar es `fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }`, con `transition={{ duration: 0.6 }}` (`0.5` en ítems), `staggerChildren` de `0.12` a `0.15` y `whileInView` con `viewport={{ once: true, margin: "-80px" }}`.
- Contadores: `animate(0, target, { duration: 2, ease: "easeOut" })` al entrar en vista (`CountUp` en `_index.tsx`).
- Marquees: infinitos, lineales, de 30 s (galería de la home y footer).
- Utilidades CSS en `global.css`: `.page-enter` (entrada del contenido de detalle) y `.confirmed-enter` (cambio de estado).
- Transición de página: barras guinda escalonadas (`PageTransitionOverlay.astro`). No agregues otra transición global.
- Microinteracciones: `hover:-translate-y-px` / `-translate-y-0.5` / `-translate-y-1`, `active:scale-[0.97]`, zoom de imagen en hover. Duraciones de 200 a 500 ms.
- Respeta siempre `prefers-reduced-motion`, como lo hacen `Footer`, `PageTransitionOverlay` y `404.astro`.

## Accesibilidad

- Foco visible en todo lo interactivo: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary` (`outline-white` sobre fondo guinda).
- `aria-current="page"` en la navegación, `aria-label` en los `<nav>` y en los botones de solo ícono, y `alt` descriptivo en español en las imágenes.

## Modo oscuro

`global.css` define variables `.dark`, pero no hay toggle ni se usa `next-themes`. No diseñes para modo oscuro salvo que se pida.

## No hacer

- Hex o colores Tailwind crudos en clases nuevas (ver la tabla de equivalencias en Color).
- Fuentes nuevas, o mezclar FontAwesome con lucide.
- Tomar como referencia `Background.astro` (degradado naranja/morado ajeno a la marca), `WebPadding.astro` o `FiltrosContainer.astro`. Ninguno se usa.
- Sombras duras, degradados arcoíris o radios distintos a la escala de arriba.
