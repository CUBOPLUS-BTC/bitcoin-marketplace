# Satsy Wallet — Design System Guidelines

> Documento de referencia para replicar fielmente la "genética visual" de este proyecto en un repositorio nuevo.

---

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Configuración de Tailwind CSS v4](#2-configuración-de-tailwind-css-v4)
3. [Variables CSS Globales](#3-variables-css-globales)
4. [Reglas de Espaciado y Tipografía](#4-reglas-de-espaciado-y-tipografía)
5. [Anatomía de Componentes Core](#5-anatomía-de-componentes-core)
6. [Patrones de Composición](#6-patrones-de-composición)
7. [Dependencias Clave](#7-dependencias-clave)

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router, RSC) | 16.x |
| UI Primitives | Radix UI | Latest (2025) |
| Component System | shadcn/ui | `new-york` style |
| Styling | Tailwind CSS **v4** (CSS-first config) | ^4.2.0 |
| Animations | tw-animate-css | 1.3.3 |
| Class Utilities | `clsx` + `tailwind-merge` (via `cn()`) | — |
| Variants | `class-variance-authority` (CVA) | ^0.7.1 |
| Icons | Lucide React | ^0.564.0 |
| Theme Toggle | `next-themes` | ^0.4.6 |

### Utilidad `cn()`

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 2. Configuración de Tailwind CSS v4

> **IMPORTANTE**: Este proyecto usa Tailwind CSS v4. No existe un archivo `tailwind.config.ts`. Toda la configuración vive dentro de `app/globals.css` mediante directivas CSS nativas.

### PostCSS

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

### Bloque `@theme inline` (equivalente a `theme.extend`)

Este bloque dentro de `globals.css` es el reemplazo directo de `tailwind.config.ts` → `theme.extend` en Tailwind v4. Copiar tal cual en un proyecto nuevo:

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* ── Tipografía ── */
  --font-sans: 'Geist', 'Geist Fallback';
  --font-mono: 'Geist Mono', 'Geist Mono Fallback';

  /* ── Colores semánticos (todos referenciando CSS vars) ── */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* ── Chart/Gráficos ── */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* ── Radii (base: 0.5rem) ── */
  --radius-sm: calc(var(--radius) - 4px);   /* 0.25rem */
  --radius-md: calc(var(--radius) - 2px);   /* 0.375rem */
  --radius-lg: var(--radius);               /* 0.5rem */
  --radius-xl: calc(var(--radius) + 4px);   /* 0.75rem */

  /* ── Sidebar ── */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

### Base Layer

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 3. Variables CSS Globales

### `:root` — Tema Oscuro (Default)

El proyecto es **dark-first**. El `:root` define el tema oscuro. La clase `.dark` lo replica explícitamente.

```css
:root {
  /* ── Fondos ── */
  --background: #09090b;           /* Zinc-950 — fondo principal */
  --foreground: #fafafa;           /* Zinc-50 — texto principal */

  /* ── Superficies (Card/Popover) ── */
  --card: #111113;                 /* Un tono por encima del fondo */
  --card-foreground: #fafafa;
  --popover: #111113;
  --popover-foreground: #fafafa;

  /* ── Primary accent: Mint Green ── */
  --primary: #36D69E;              /* ⭐ Color identitario del proyecto */
  --primary-foreground: #09090b;   /* Texto oscuro sobre mint */

  /* ── Secondary ── */
  --secondary: #1a1a1e;            /* Superficie elevada sutil */
  --secondary-foreground: #fafafa;

  /* ── Muted (texto de soporte) ── */
  --muted: #1a1a1e;
  --muted-foreground: #a1a1aa;     /* Zinc-400 — texto desaturado */

  /* ── Accent (= primary en dark) ── */
  --accent: #36D69E;
  --accent-foreground: #09090b;

  /* ── Destructive (errores) ── */
  --destructive: #ef4444;          /* Red-500 */
  --destructive-foreground: #fafafa;

  /* ── Bordes e inputs ── */
  --border: #27272a;               /* Zinc-800 */
  --input: #1a1a1e;
  --ring: #36D69E;                 /* Focus ring = primary */

  /* ── Gráficos ── */
  --chart-1: #36D69E;              /* Mint (primary) */
  --chart-2: #6B8AFF;              /* Azul lavanda */
  --chart-3: #ef4444;              /* Rojo */
  --chart-4: #F7931A;              /* Bitcoin Orange */
  --chart-5: #627EEA;              /* Ethereum Blue */

  /* ── Radio ── */
  --radius: 0.5rem;

  /* ── Sidebar ── */
  --sidebar: #111113;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #36D69E;
  --sidebar-primary-foreground: #09090b;
  --sidebar-accent: #1a1a1e;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: #27272a;
  --sidebar-ring: #36D69E;
}
```

### `.light` — Tema Claro

```css
.light {
  --background: #ffffff;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #16a34a;              /* Green-600 */
  --primary-foreground: #ffffff;
  --secondary: #f4f4f5;            /* Zinc-100 */
  --secondary-foreground: #09090b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;     /* Zinc-500 */
  --accent: #16a34a;
  --accent-foreground: #ffffff;
  --destructive: #dc2626;          /* Red-600 */
  --destructive-foreground: #ffffff;
  --border: #e4e4e7;               /* Zinc-200 */
  --input: #f4f4f5;
  --ring: #16a34a;
  --chart-1: #16a34a;
  --chart-2: #3b82f6;
  --chart-3: #dc2626;
  --chart-4: #f97316;
  --chart-5: #8b5cf6;
  --sidebar: #ffffff;
  --sidebar-foreground: #09090b;
  --sidebar-primary: #16a34a;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f4f4f5;
  --sidebar-accent-foreground: #09090b;
  --sidebar-border: #e4e4e7;
  --sidebar-ring: #16a34a;
}
```

### Paleta Auxiliar (usada inline, no como variable)

Estos colores se usan directamente en clases Tailwind pero forman parte de la identidad visual:

| Color | Hex | Uso |
|---|---|---|
| **Bitcoin Orange** | `orange-500` / `#F7931A` | Ícono BTC, indicadores de red testnet, estados "pending" |
| **Mint Green** | `#36D69E` | Primary accent, CTA, indicadores positivos, focus ring |
| **Green-600** | `#16a34a` | Primary en tema claro |

---

## 4. Reglas de Espaciado y Tipografía

### 4.1 Tipografía

**Fuentes del sistema:**

| Token | Familia | Uso |
|---|---|---|
| `font-sans` | Geist, Inter (fallback) | Todo el texto |
| `font-mono` | Geist Mono | Direcciones, sats, hashes |

**Nota**: El layout carga `Inter` de Google Fonts como `--font-inter`, pero el `@theme inline` define `--font-sans: 'Geist'`. El `body` aplica `font-sans antialiased`.

**Escalas de texto recurrentes:**

| Elemento | Clases Tailwind |
|---|---|
| **H1 (Landing Hero)** | `text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-balance` |
| **H2 (Secciones)** | `text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance` |
| **H3 (Feature Card)** | `font-semibold text-foreground text-sm` |
| **Balance Grande** | `text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight` |
| **Subtítulo / Descripción** | `text-base md:text-lg text-muted-foreground leading-relaxed text-balance` |
| **Párrafo secundario** | `text-sm text-muted-foreground` |
| **Captions / Meta** | `text-xs text-muted-foreground` |
| **Labels de form** | `text-sm text-foreground font-medium` |
| **Card Title (shadcn)** | `leading-none font-semibold` |
| **Card Description (shadcn)** | `text-muted-foreground text-sm` |
| **Dialog Title** | `text-lg leading-none font-semibold` |
| **Dialog Description** | `text-muted-foreground text-sm` |

### 4.2 Espaciado — Contenedores

| Patrón | Clases |
|---|---|
| **Max-width principal** | `max-w-5xl mx-auto` (landing), `max-w-2xl mx-auto` (wallet) |
| **Max-width auth forms** | `w-full max-w-sm` |
| **Padding horizontal page** | `px-4` |
| **Padding section** | `py-20 px-4` |
| **Hero section** | `pt-32 pb-20 px-4 text-center` |

### 4.3 Espaciado — Cards y Componentes

| Patrón | Clases |
|---|---|
| **Card (shadcn)** | `gap-6 rounded-xl border py-6 shadow-sm` |
| **Card padding interno** | `px-6` (CardHeader, CardContent, CardFooter) |
| **Card custom (wallet)** | `bg-card border border-border rounded-xl p-4 md:p-6` |
| **Card custom (feature)** | `bg-card border border-border rounded-xl p-5` |
| **Card custom (auth form)** | `bg-card border border-border rounded-2xl p-6` |
| **Card mockup (hero)** | `bg-card border border-border rounded-2xl p-5 shadow-xl` |
| **Gap en grids (cards)** | `gap-4` (desktop), `gap-3` (compacto), `gap-2` (tight) |
| **Gap interno cards** | `gap-2` a `gap-3` entre ítems internos |
| **Form fields gap** | `space-y-4` (entre campos), `space-y-1.5` (label→input) |
| **Sections gap** | `space-y-3 md:space-y-4` |
| **Button group gap** | `gap-2 md:gap-3` |

### 4.4 Spacing Pattern: Responsive Steps

El proyecto usa un patrón consistente de escalado en un solo step:

```
Base: valor_md    → sm/md breakpoint: valor_md+1
```

Ejemplos: `p-4 md:p-6`, `gap-3 md:gap-4`, `text-xs md:text-sm`, `w-9 md:w-10`.

### 4.5 Border Patterns

| Patrón | Clases |
|---|---|
| **Borde estándar** | `border border-border` |
| **Borde hover** | `hover:border-primary/40` o `hover:border-primary/50` |
| **Borde divisor** | `border-t border-border`, `divide-y divide-border` |
| **Borde activo/focus** | `focus-visible:border-ring` |

---

## 5. Anatomía de Componentes Core

### 5.1 Button

**Patrón**: CVA con 6 variantes y 6 tamaños. Usa `@radix-ui/react-slot` para composición vía `asChild`.

```tsx
// Clases base (todos los botones)
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
 text-sm font-medium transition-all
 disabled:pointer-events-none disabled:opacity-50
 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4
 shrink-0 [&_svg]:shrink-0
 outline-none
 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
 aria-invalid:border-destructive"
```

**Variantes:**

| Variante | Clases |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90` |
| `destructive` | `bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60` |
| `outline` | `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50` |
| `link` | `text-primary underline-offset-4 hover:underline` |

**Tamaños:**

| Tamaño | Clases |
|---|---|
| `default` | `h-9 px-4 py-2 has-[>svg]:px-3` |
| `sm` | `h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5` |
| `lg` | `h-10 rounded-md px-6 has-[>svg]:px-4` |
| `icon` | `size-9` |
| `icon-sm` | `size-8` |
| `icon-lg` | `size-10` |

**Uso mínimo:**

```tsx
import { Button } from '@/components/ui/button'

{/* Primary CTA */}
<Button size="lg">Get Started <ArrowRight className="w-4 h-4 ml-2" /></Button>

{/* Outline */}
<Button variant="outline">Cancel</Button>

{/* Ghost icon */}
<Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>

{/* As link */}
<Button asChild><Link href="/register">Sign up</Link></Button>

{/* Disabled */}
<Button disabled>Processing...</Button>

{/* Full-width form submit */}
<Button type="submit" className="w-full h-10">Sign in</Button>
```

---

### 5.2 Card

**Patrón**: Composición con subcomponentes funcionales. Sin CVA, usa `cn()` directo. Cada parte tiene un `data-slot` para selectores condicionales.

```tsx
// Card root
"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"

// CardHeader
"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6
 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"

// CardTitle
"leading-none font-semibold"

// CardDescription
"text-muted-foreground text-sm"

// CardContent
"px-6"

// CardFooter
"flex items-center px-6 [.border-t]:pt-6"

// CardAction (posicionamiento absoluto en grid)
"col-start-2 row-span-2 row-start-1 self-start justify-self-end"
```

**Uso mínimo (shadcn):**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Balance</CardTitle>
    <CardDescription>Your current BTC holdings</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">0.3812 BTC</p>
  </CardContent>
</Card>
```

**Uso custom (wallet-style card — sin shadcn Card):**

```tsx
{/* El proyecto frecuentemente usa div puras con este patrón: */}
<div className="bg-card border border-border rounded-xl p-4 md:p-6">
  {/* Contenido */}
</div>

{/* Con hover */}
<div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
  {/* Contenido */}
</div>

{/* Empty state */}
<div className="bg-card border border-border rounded-xl p-6 md:p-8 text-center">
  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
    <Clock className="w-6 h-6 text-muted-foreground" />
  </div>
  <p className="text-muted-foreground text-sm">No transactions yet</p>
</div>
```

---

### 5.3 Input

**Patrón**: Componente funcional simple con `cn()`. Sin CVA. Altura fija `h-9`, override frecuente a `h-10` en forms.

```tsx
// Clases base completas
"file:text-foreground placeholder:text-muted-foreground
 selection:bg-primary selection:text-primary-foreground
 dark:bg-input/30 border-input
 h-9 w-full min-w-0 rounded-md border bg-transparent
 px-3 py-1 text-base shadow-xs
 transition-[color,box-shadow] outline-none
 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium
 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
 md:text-sm"

// Focus state
"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

// Error state
"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
```

**Uso mínimo:**

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-1.5">
  <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    className="h-10"
  />
</div>

{/* Input con ícono (password toggle) */}
<div className="relative">
  <Input type="password" className="h-10 pr-10" />
  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
    <Eye className="w-4 h-4" />
  </button>
</div>
```

**Error message pattern:**

```tsx
<p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
  {error}
</p>
```

---

### 5.4 Badge

**Patrón**: CVA con 4 variantes. Usa `@radix-ui/react-slot` para composición con `asChild`.

```tsx
// Clases base
"inline-flex items-center justify-center rounded-md border
 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0
 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none
 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
 transition-[color,box-shadow] overflow-hidden"
```

**Variantes:**

| Variante | Clases |
|---|---|
| `default` | `border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90` |
| `secondary` | `border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90` |
| `destructive` | `border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60` |
| `outline` | `text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground` |

**Uso mínimo:**

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">On-chain</Badge>
```

**Badge-like custom pattern (usado inline en el proyecto):**

```tsx
{/* Pill status indicator */}
<div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
  +4.2%
</div>

{/* Hero announcement pill */}
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium">
  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
  Now supporting native SegWit
  <ChevronRight className="w-3 h-3" />
</div>

{/* Pending status pill */}
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full">
  <span className="text-xs font-medium text-orange-500">+0.0050 BTC pending</span>
</div>
```

---

### 5.5 Tabs

**Patrón**: Wrapper alrededor de Radix `@radix-ui/react-tabs`.

```tsx
// Tabs root
"flex flex-col gap-2"

// TabsList
"bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"

// TabsTrigger
"data-[state=active]:bg-background
 dark:data-[state=active]:text-foreground
 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring
 dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30
 text-foreground dark:text-muted-foreground
 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center
 gap-1.5 rounded-md border border-transparent
 px-2 py-1 text-sm font-medium whitespace-nowrap
 transition-[color,box-shadow]
 focus-visible:ring-[3px] focus-visible:outline-1
 disabled:pointer-events-none disabled:opacity-50
 data-[state=active]:shadow-sm
 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// TabsContent
"flex-1 outline-none"
```

**Uso mínimo:**

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="onchain">
  <TabsList>
    <TabsTrigger value="onchain">On-chain</TabsTrigger>
    <TabsTrigger value="lightning">Lightning</TabsTrigger>
  </TabsList>
  <TabsContent value="onchain">
    {/* content */}
  </TabsContent>
  <TabsContent value="lightning">
    {/* content */}
  </TabsContent>
</Tabs>
```

---

## 6. Patrones de Composición

### 6.1 Layout de Página

```tsx
// Auth pages (login/register) — centrado
<div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
  <div className="w-full max-w-sm">
    {/* Logo */}
    <div className="flex flex-col items-center mb-8">
      <Image src="/icon.svg" width={40} height={40} className="h-10 w-10 mb-3" />
      <h1 className="text-xl font-semibold text-foreground">Title</h1>
      <p className="text-sm text-muted-foreground mt-1">Subtitle</p>
    </div>
    {/* Form card */}
    <form className="bg-card border border-border rounded-2xl p-6 space-y-4">
      {/* fields */}
    </form>
  </div>
</div>
```

```tsx
// Wallet/App pages — contenedor angosto
<div className="max-w-2xl mx-auto px-4 md:px-0">
  {/* content */}
</div>
```

### 6.2 Header Fijo con Blur

```tsx
<header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
  <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
    {/* Logo + Nav */}
  </div>
</header>

{/* Wallet variant (relative, no fixed) */}
<header className="relative top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md">
  <div className="max-w-2xl mx-auto flex items-center justify-between px-4 md:px-0 py-3">
    {/* ... */}
  </div>
</header>
```

### 6.3 Icon Container Pattern

El proyecto usa un patrón consistente para contener íconos:

```tsx
{/* Icono estándar en card */}
<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
  <Icon className="w-4 h-4 text-primary" />
</div>

{/* Icono circular (asset) */}
<div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
  <BitcoinIcon className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
</div>

{/* Icono circular para estado vacío */}
<div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
  <Clock className="w-6 h-6 text-muted-foreground" />
</div>

{/* Icono button (toolbar) */}
<button className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
  <Icon className="w-4 h-4" />
</button>
```

### 6.4 Glow Effect

```tsx
{/* Sutil glow detrás de una card */}
<div className="relative">
  <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10" />
  {/* Card content */}
</div>
```

### 6.5 Loading Spinner Pattern

```tsx
{/* Inline spinner (dentro de button) */}
<span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />

{/* Standalone spinner */}
<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
```

### 6.6 Footer / Bottom Navigation

```tsx
<footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-2xl bg-background/95 backdrop-blur-md border-t border-l border-r border-border rounded-t-xl">
  <nav className="flex items-center justify-around px-2 py-2">
    <button className={cn(
      "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    )}>
      <Icon className={cn("w-6 h-6", isActive && "text-primary")} />
      <span className="text-xs font-medium hidden sm:block">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary sm:hidden" />}
    </button>
  </nav>
</footer>
```

### 6.7 Transaction Row Pattern

```tsx
<div className="px-4 py-3 hover:bg-secondary transition-colors cursor-pointer">
  <div className="flex items-center gap-3">
    {/* Icon */}
    <div className={cn(
      "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0",
      direction === 'send' ? 'text-destructive bg-destructive/10' : 'text-primary bg-primary/10'
    )}>
      <TypeIcon className="w-4 h-4 md:w-5 md:h-5" />
    </div>
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground capitalize truncate">Sent</p>
        <p className="text-sm font-semibold text-destructive shrink-0">-0.00500000 BTC</p>
      </div>
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <p className="text-xs text-muted-foreground truncate">bc1q...f4k2</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-primary" />
          <span className="text-xs text-muted-foreground">3 hours ago</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 7. Dependencias Clave

Para replicar este sistema en un proyecto nuevo, instalar:

```bash
# Core
pnpm add tailwindcss@^4.2.0 @tailwindcss/postcss@^4.2.0 postcss@^8.5 -D
pnpm add tw-animate-css@1.3.3 -D

# Utilities
pnpm add clsx tailwind-merge class-variance-authority

# Radix Primitives (instalar según componentes usados)
pnpm add @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-tabs \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select \
  @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-separator

# Icons
pnpm add lucide-react

# Theme
pnpm add next-themes
```

### shadcn/ui `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## Resumen Visual Rápido

```
┌─────────────────────────────────────────────────┐
│  Fondo:    #09090b (zinc-950)                   │
│  Surface:  #111113 (card)                       │
│  Elevated: #1a1a1e (secondary/muted)            │
│  Border:   #27272a (zinc-800)                   │
│                                                 │
│  Primary:  #36D69E (mint green)                 │
│  Error:    #ef4444 (red-500)                    │
│  Bitcoin:  orange-500                           │
│                                                 │
│  Text:     #fafafa (principal)                  │
│  Muted:    #a1a1aa (secundario)                 │
│                                                 │
│  Radius:   0.5rem base (rounded-xl = cards)     │
│  Font:     Geist / Inter                        │
│  Icon:     Lucide                               │
└─────────────────────────────────────────────────┘
```
