# Design Specification — "Editorial Engineering" Resume

## 1. Design Tokens & System

### 1.1 Color Palette

#### Primary Palette (Dark Editorial)

| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#09090f` | Page background (deepest) |
| `--bg-1` | `#0d0d12` | Primary background |
| `--bg-2` | `#1a1a2e` | Card/panel backgrounds |
| `--bg-3` | `#16162a` | Elevated surfaces |
| `--bg-4` | `#222244` | Hover states |
| `--accent-amber` | `#e8a838` | Primary accent — CTAs, highlights |
| `--accent-amber-dim` | `rgba(232,168,56,0.15)` | Glow effects |
| `--accent-teal` | `#56c4b8` | Secondary accent — links, success |
| `--accent-violet` | `#c77dff` | Tertiary accent — badges, tags |
| `--accent-rose` | `#ff6b8a` | Error / destructive |
| `--text-0` | `#f5f0e8` | Primary text (warm ivory) |
| `--text-1` | `#c8c4b8` | Secondary text |
| `--text-2` | `#9898ac` | Muted text |
| `--text-3` | `#5c5c72` | Disabled/subtle text |
| `--border-subtle` | `#2a2a44` | Card borders |
| `--border-hover` | `#3d3d5c` | Hover borders |

#### Gradient Presets

```css
--gradient-amber:   linear-gradient(135deg, #e8a838 0%, #d4842a 100%);
--gradient-teal:    linear-gradient(135deg, #56c4b8 0%, #38a89d 100%);
--gradient-violet:  linear-gradient(135deg, #c77dff 0%, #9946ed 100%);
--gradient-surface: linear-gradient(180deg, #1a1a2e 0%, #0d0d12 100%);
--gradient-glow:    radial-gradient(ellipse at center, rgba(232,168,56,0.08) 0%, transparent 70%);
```

### 1.2 Typography Scale

**Font Stack:**
```css
--font-heading: 'Space Grotesk', 'Inter', system-ui, sans-serif;
--font-body:    'DM Sans', 'Inter', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
```

> Using Space Grotesk + DM Sans as freely available alternatives to Clash Display + Cabinet Grotesk. Both are Google Fonts with similar editorial quality.

**Type Scale (fluid, clamp-based):**

| Token | Desktop | Mobile | Weight | Usage |
|---|---|---|---|---|
| `--text-display` | `clamp(3.5rem, 8vw, 7rem)` | auto | 700 | Hero name |
| `--text-h1` | `clamp(2.5rem, 5vw, 4rem)` | auto | 600 | Section titles |
| `--text-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | auto | 600 | Subsection titles |
| `--text-h3` | `clamp(1.25rem, 2vw, 1.5rem)` | auto | 600 | Card headings |
| `--text-body` | `1.125rem` | `1rem` | 400 | Body copy |
| `--text-small` | `0.875rem` | `0.8125rem` | 400 | Captions, tags |
| `--text-xs` | `0.75rem` | `0.75rem` | 500 | Badges, labels |
| `--text-mono` | `0.875rem` | `0.8125rem` | 400 | Terminal / code |

**Line Heights:**
```css
--leading-tight:   1.1;    /* Display text */
--leading-snug:    1.3;    /* Headings */
--leading-normal:  1.6;    /* Body */
--leading-relaxed: 1.8;    /* Long-form */
```

### 1.3 Spacing Scale

Using an 8px base grid:

| Token | Value |
|---|---|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-8` | `2rem` (32px) |
| `--space-10` | `2.5rem` (40px) |
| `--space-12` | `3rem` (48px) |
| `--space-16` | `4rem` (64px) |
| `--space-20` | `5rem` (80px) |
| `--space-24` | `6rem` (96px) |
| `--space-32` | `8rem` (128px) |

### 1.4 Border Radius

```css
--radius-sm:   0.375rem;   /* 6px — tags, small pills */
--radius-md:   0.625rem;   /* 10px — buttons, inputs */
--radius-lg:   1rem;       /* 16px — cards */
--radius-xl:   1.5rem;     /* 24px — large panels */
--radius-full: 9999px;     /* Pills, circles */
```

### 1.5 Shadows

```css
--shadow-sm:   0 1px 2px rgba(0,0,0,0.3);
--shadow-md:   0 4px 12px rgba(0,0,0,0.4);
--shadow-lg:   0 8px 32px rgba(0,0,0,0.5);
--shadow-glow: 0 0 20px rgba(232,168,56,0.2), 0 0 60px rgba(232,168,56,0.05);
--shadow-card: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
```

### 1.6 Z-Index Scale

```css
--z-base:       0;
--z-card:       10;
--z-sticky:     100;
--z-nav:        200;
--z-cursor:     500;
--z-modal:      1000;
--z-loader:     9999;
```

---

## 2. Section-Level Wireframes

### 2.1 Hero Section

```
┌─────────────────────────────────────────────────────┐
│ [● ● ●  particle field background  ● ●  ●  ● ●]   │
│                     ● ●                             │
│          ●  ●                    ●                   │
│   ●                                         ●       │
│                                                     │
│                   GHASSEN                            │
│                 BARGOUGUI                            │
│                                                     │
│        Software Engineer · Full-Stack &              │
│             Backend Specialist|                      │ ← typewriter cursor
│                                                     │
│      ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│      │📍 Lux.   │  │📧 Email  │  │🟢 Open   │      │ ← contact pills
│      └──────────┘  └──────────┘  └──────────┘      │
│                                                     │
│          [GH]    [LI]    [✉]    [↓ CV]              │ ← magnetic social btns
│                                                     │
│                      ▼                              │ ← scroll indicator
└─────────────────────────────────────────────────────┘
          ● ← side dot nav (right edge, vertically centered)
          ●
          ◉ ← active
          ●
          ●
          ●
          ●
          ●
```

### 2.2 About Section

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌─────────────┐   ┌────────────────────────────┐  │
│   │             │   │                            │  │
│   │    5+       │   │  Bio paragraph 1...        │  │
│   │   YEARS     │   │                            │  │
│   │             │   │  Bio paragraph 2...        │  │
│   │    3        │   │                            │  │
│   │  COMPANIES  │   │  Bio paragraph 3...        │  │
│   │             │   │                            │  │
│   │    1        │   │  Bio paragraph 4...        │  │
│   │   CERT      │   │                            │  │
│   │             │   │                            │  │
│   └─────────────┘   └────────────────────────────┘  │
│                                                     │
│   ┌──────┐ ┌───────────┐ ┌──────┐ ┌─────────────┐  │
│   │  OCP │ │ Full-Stack │ │ 🌐   │ │   Clean     │  │ ← bento cards
│   │ Cert │ │ + icons    │ │Lang. │ │   Arch.     │  │
│   │ ★★★  │ │            │ │      │ │             │  │
│   └──────┘ └───────────┘ └──────┘ └─────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.3 Experience Section (Horizontal Scroll)

```
                    VIEWPORT (pinned)
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Professional Experience                           │
│   ════════════════════                               │
│                                                     │
│   ┌──────────────────────────────────────────┐      │
│   │                                          │      │
│   │  SOGETI (BGL BNP Paribas)     🟢 CURRENT│      │
│   │  Software Engineer                       │      │
│   │  Luxembourg · Feb 2025 – Present         │      │
│   │                                          │      │
│   │  • Developed internal apps using Java... │      │
│   │  • Built and optimized RESTful APIs...   │      │
│   │  • Implemented CI/CD pipelines...        │      │
│   │  • Collaborated cross-functionally...    │      │
│   │                                          │      │
│   └──────────────────────────────────────────┘      │
│                                                     │
│   ═══●═══════○═══════○═══  ← progress bar           │
│     Job 1   Job 2   Job 3                           │
│                                                     │
└─────────────────────────────────────────────────────┘
          ← scroll reveals Job 2 sliding in from right →
```

### 2.4 Skills Section (Constellation)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               Technical Skills                       │
│                                                     │
│          [Backend]                                   │
│         ╱  Java ★                                   │
│        ╱   Spring Boot ★                            │
│       ╱    Java EE                                  │
│      ╱     Hibernate                                │
│   ──●──── [CORE] ────●── [Frontend]                 │
│      ╲               Angular ★                      │
│       ╲              TypeScript ★                   │
│        ╲             JavaScript                     │
│         ╲                                           │
│          [DevOps]                                   │
│          Docker                                     │
│          Jenkins                                    │
│          AWS                                        │
│                                                     │
│   ┌────────┐ ┌────────┐ ┌────────┐                  │
│   │ 6+ yrs │ │ 4 Core │ │ 9 Cats │                  │
│   └────────┘ └────────┘ └────────┘                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.5 Projects Section (Stacked Cards)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Featured Projects                                  │
│                                                     │
│   ┌──────────────────────────────────────────┐      │
│   │  Orbit Ways                        [▶ Play]│   ← top card (current)
│   │  Full Stack Game Developer                 │      │
│   │                                            │      │
│   │  • Built real-time multiplayer board game   │      │
│   │  • Spring Boot backend for sessions         │      │
│   │  • WebSocket real-time communication        │      │
│   │                                            │      │
│   │  [Java] [Spring Boot] [Redis] [Angular]    │      │
│   └──────────────────────────────────────────┘      │
│     └───────────────────────────────────────┘       │ ← card 2 peeking
│       └─────────────────────────────────────┘       │ ← card 3 peeking
│                                                     │
│         ● ● ● ○ ○ ○   ← card position dots         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.6 Contact Section (Terminal)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌─ Terminal ─────────────────── ● ● ● ┐           │
│   │                                      │          │
│   │  $ whoami                            │          │
│   │    Ghassen Bargougui — SE            │          │
│   │                                      │          │
│   │  $ contact --email                   │          │
│   │    ghassen.brg16@gmail.com           │          │
│   │                                      │          │
│   │  $ send-message --interactive        │          │
│   │    name:    [_______________]         │          │
│   │    email:   [_______________]         │          │
│   │    message: [_______________]         │          │
│   │                                      │          │
│   │    > submit_  █                      │          │
│   │                                      │          │
│   └──────────────────────────────────────┘          │
│                                                     │
│   © 2026 Ghassen Bargougui                          │
│   Made with Vue 3 + Nuxt 3                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Animation Choreography

### 3.1 Page Load Sequence

```
Timeline:
0.0s  → Black screen
0.2s  → "GB" logo fades in at center (scale 0.8 → 1.0)
0.6s  → Logo expands into a circle mask, revealing page beneath
1.0s  → Mask fully expanded, page visible
1.2s  → Logo shrinks to top-left corner position
1.4s  → Side nav dots fade in (stagger 50ms each)
1.6s  → Hero content begins animation sequence
```

### 3.2 Hero Entrance

```
Timeline (starts after page load):
0.0s  → Particle field begins rendering (fade in over 1s)
0.3s  → Name letters appear one by one (stagger 40ms, y: 40→0, opacity: 0→1)
1.5s  → Title begins typewriter effect (30ms per character)
3.0s  → Contact pills slide up (stagger 100ms)
3.5s  → Social buttons pop in (stagger 80ms, scale: 0→1)
4.0s  → Scroll indicator fades in + begins bounce loop
```

### 3.3 Section Scroll Reveals

Each section uses ScrollTrigger with consistent patterns:

```javascript
// Section title reveal
gsap.from('.section-title', {
  scrollTrigger: { trigger: '.section', start: 'top 80%' },
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out'
})

// Content stagger
gsap.from('.section-content > *', {
  scrollTrigger: { trigger: '.section', start: 'top 60%' },
  y: 40,
  opacity: 0,
  stagger: 0.15,
  duration: 0.6,
  ease: 'power2.out'
})
```

### 3.4 Experience Horizontal Scroll

```javascript
// Pin the section and scroll horizontally
const cards = gsap.utils.toArray('.experience-card')
gsap.to(cards, {
  scrollTrigger: {
    trigger: '.experience-section',
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => `+=${cards.length * window.innerWidth * 0.8}`,
  },
  xPercent: -100 * (cards.length - 1),
  ease: 'none'
})
```

### 3.5 Project Card Stack

```javascript
// Each card scales down and moves up as the next one enters
projects.forEach((card, i) => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top top',
      scrub: true,
      pin: true,
      pinSpacing: false,
    },
    scale: 0.9 - (i * 0.02),
    y: i * -20,
    opacity: 0.6,
  })
})
```

### 3.6 Counter Animations (About Section)

```javascript
// Animate numbers counting up
gsap.to(counterElement, {
  scrollTrigger: { trigger: '.about-stats', start: 'top 70%' },
  textContent: targetNumber,
  snap: { textContent: 1 },
  duration: 2,
  ease: 'power1.inOut'
})
```

---

## 4. Responsive Strategy

### 4.1 Breakpoints

```css
/* Mobile first approach */
--bp-xs:  475px;     /* Large phones */
--bp-sm:  640px;     /* Small tablets */
--bp-md:  768px;     /* Tablets */
--bp-lg:  1024px;    /* Small laptops */
--bp-xl:  1280px;    /* Desktops */
--bp-2xl: 1536px;    /* Large screens */
```

### 4.2 Section Adaptations

| Section | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Hero** | Particle canvas + full viewport | Reduced particles | Static gradient bg, no canvas |
| **Nav** | Side dot rail (right) | Side dot rail | Bottom sheet hamburger |
| **About** | 2-column split | 2-column | Single column stacked |
| **Experience** | Horizontal pinned scroll | Horizontal scroll | Vertical stacked cards |
| **Skills** | Constellation/orbital | Circular grid | Accordion panels |
| **Projects** | Stacked card peel | Stacked cards | Vertical scroll cards |
| **Languages** | Radial chart | Radial chart | Horizontal bar chart |
| **Contact** | Terminal window | Terminal (compact) | Simplified form |

### 4.3 Touch Adaptations

- Magnetic button effects disabled on touch
- Custom cursor hidden on touch devices
- Horizontal scroll gets swipe gesture support
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables all GSAP animations, falls back to CSS opacity transitions only

---

## 5. Accessibility Requirements

| Area | Requirement |
|---|---|
| **Semantics** | Use `<main>`, `<section>`, `<nav>`, `<article>`, `<header>`, `<footer>` |
| **Headings** | Single `<h1>` (hero name), proper h2→h6 hierarchy per section |
| **ARIA** | Navigation dots get `aria-label`, active state via `aria-current` |
| **Focus** | Visible focus rings on all interactive elements (`:focus-visible`) |
| **Color contrast** | WCAG AA minimum (4.5:1 for text, 3:1 for large text) — validated with amber on dark bg |
| **Motion** | `prefers-reduced-motion` media query disables animations |
| **Keyboard** | Full keyboard navigation, `Escape` closes modals |
| **Screen readers** | Decorative canvas/particles get `aria-hidden="true"` |
| **Skip links** | "Skip to main content" link at top of page |
| **Images** | All images have descriptive `alt` text |
| **Forms** | Contact form has proper labels, error messages, and validation |

---

## 6. Asset Requirements

| Asset | Type | Source | Notes |
|---|---|---|---|
| CV PDF | PDF | Keep existing | `/public/CV_Ghassen_Bargougui.pdf` |
| OCP Badge | PNG | Keep existing | `/public/ocp11.png` |
| Favicon | SVG | Keep existing or redesign | "GB" monogram |
| OG Image | PNG | Generate new | 1200×630, name + title + design preview |
| Fonts | WOFF2 | Google Fonts / self-hosted | Space Grotesk + DM Sans + JetBrains Mono |
| Devicons | SVG | `@iconify/vue` | Tree-shaken per-icon imports |

---

## 7. Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Total Blocking Time (TBT) | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Bundle size (initial JS) | < 150KB gzipped |
| Page weight (total) | < 1MB |

---

## 8. SEO Specification

```typescript
// nuxt.config.ts - default meta
useSeoMeta({
  title: 'Ghassen Bargougui — Software Engineer',
  description: 'Full-Stack & Backend Software Engineer based in Luxembourg. 5+ years of experience in Java, Spring Boot, Angular, and microservices. Oracle Certified Java SE 11 Developer.',
  ogTitle: 'Ghassen Bargougui — Software Engineer',
  ogDescription: 'Full-Stack & Backend Specialist | Luxembourg',
  ogImage: '/og-image.png',
  ogUrl: 'https://ghassen.io',
  twitterCard: 'summary_large_image',
})
```

**Structured Data** (JSON-LD):
- `Person` schema with name, jobTitle, url, sameAs (social links)
- `WebSite` schema with name and url
