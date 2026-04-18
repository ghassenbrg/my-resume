# Resume SPA Full Rework — Vue 3 / Nuxt 3

## Goal

Rebuild the ghassen.io personal resume SPA from the ground up using **Vue 3 + Nuxt 3**, with a **radically different design, interaction model, and visual identity** — not a migration, but a completely new product. Visitors who see both versions should not recognize them as the same site.

---

## Current State Analysis

### Existing Tech Stack
| Layer | Current |
|---|---|
| Framework | React 19 + CRA (create-react-app) |
| Styling | Tailwind CSS 3 with custom config |
| Animation | Framer Motion |
| Icons | react-icons + devicon |
| Contact | emailjs-com |
| Analytics | Umami (self-hosted) |
| Deployment | Docker + NGINX |

### Current Design Characteristics (what we're **departing from**)
- Dark glassmorphism theme with blue/purple gradients
- Traditional long-scroll SPA with stacked full-width sections
- Standard gradient text headings + card grid layouts
- Framer Motion fade-in/slide-up on each section
- Floating action buttons (contact + scroll-to-top)
- Timeline-based experience display
- Category-tabbed skill chips
- Contact via modal form

> [!IMPORTANT]
> The new version must feel like a **completely different product** — different layout philosophy, color system, typography, animation style, and interaction patterns.

---

## New Design Direction: "Editorial Engineering"

### Design Philosophy
Move from the current "tech dashboard" aesthetic to an **editorial-magazine** meets **creative engineering** identity. Think: Stripe's documentation elegance × Vercel's bold minimalism × a high-end architectural portfolio.

### Visual Identity Comparison

| Aspect | Current (React) | New (Nuxt) |
|---|---|---|
| **Layout** | Stacked full-width sections | Bento grid, asymmetric panels, split-screen zones |
| **Color** | Dark base, blue/purple gradients | Rich charcoal (`#1a1a2e`) + warm amber accent (`#e8a838`) + crisp ivory (`#f5f0e8`) |
| **Typography** | Inter (functional) | **Space Grotesk** (headings) + **DM Sans** (body) — distinctive editorial feel (free Google Fonts) |
| **Sections** | Fade-in cards per section | Scroll-driven **narrative flow** — sections morph/transform into each other |
| **Animation** | Framer Motion (per-element) | **GSAP ScrollTrigger** with scrub, pin & horizontal scrolling |
| **Hero** | Static bg image + text overlay | Animated **particle constellation** (Three.js/canvas) or **interactive type kinetics** |
| **Dark/Light** | Toggle switch | **No toggle** — single curated theme (dark editorial) with luminous accents |
| **Experience** | Vertical alternating timeline | **Horizontal parallax journey** pinned to viewport |
| **Skills** | Tabbed chip grid | **Interactive radar/constellation chart** with category orbits |
| **Projects** | 3-col card grid | **Stacked card reveal** (scroll to peel back cards) |
| **Nav** | Sticky top bar | **Side dot navigation** + section indicators (think: Apple product pages) |
| **Contact** | Modal with form | **Inline terminal-style** contact section at bottom |

### Color System

```
--color-bg-primary:      #0d0d12     /* Deep space black */
--color-bg-secondary:    #1a1a2e     /* Rich charcoal */
--color-bg-card:         #16162a     /* Elevated surface */
--color-accent-primary:  #e8a838     /* Warm amber */
--color-accent-secondary:#56c4b8     /* Cool teal */
--color-accent-tertiary: #c77dff     /* Soft violet */
--color-text-primary:    #f5f0e8     /* Warm ivory */
--color-text-secondary:  #9898ac     /* Muted lavender */
--color-text-muted:      #5c5c72     /* Subtle gray */
--color-border:          #2a2a44     /* Card borders */
--color-glow:            rgba(232, 168, 56, 0.15)  /* Ambient glow */
```

### Typography

```
Headings:  "Space Grotesk" (Google Fonts, 600-700 weight) — free, geometric, editorial
Body:      "DM Sans" (Google Fonts, 400-500 weight) — free, clean, modern
Mono:      "JetBrains Mono" (for code/terminal elements)
```

---

## New Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Nuxt 3 (latest) | SSG, file-based routing, auto-imports, SEO, composables |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Vanilla CSS + CSS Custom Properties | Full control, no framework dependency, per web_application_development guidelines |
| **Animation** | GSAP (ScrollTrigger, SplitText) | Industry-standard scroll-driven animations |
| **3D/Canvas** | Three.js (via `@tresjs/core`) | Interactive hero particle constellation system |
| **State** | Pinia | Theme, UI state, analytics |
| **Images** | `@nuxt/image` | Auto WebP/AVIF, lazy loading, responsive |
| **Content** | JSON data file (migrated from current) | Maintainability, easy updates |
| **Icons** | `@iconify/vue` (unplugin-icons) | Massive icon library, tree-shaking |
| **Analytics** | Umami (keep existing) | Continuity + privacy-focused |
| **Contact** | EmailJS (client-side, keep existing) | Form handling — continuity with current setup |
| **Fonts** | `@fontsource/` packages or self-hosted | Performance, FOUT prevention |
| **Deployment** | Docker + NGINX (keep existing infra) | SSG via `nuxi generate`, served as static files |

---

## Architecture

### Project Structure

```
my-resume/
├── app.vue                    # Root app shell
├── nuxt.config.ts             # Nuxt configuration
├── assets/
│   ├── css/
│   │   ├── main.css           # Global styles + design tokens
│   │   ├── typography.css     # Type system
│   │   ├── animations.css     # Keyframes + utility classes
│   │   └── components/        # Per-component styles
│   ├── fonts/                 # Self-hosted fonts
│   └── images/                # Static images (cert badge, etc.)
├── components/
│   ├── layout/
│   │   ├── AppNavigation.vue  # Side dot nav
│   │   ├── AppCursor.vue      # Custom cursor effect
│   │   └── AppLoader.vue      # Page loading animation
│   ├── sections/
│   │   ├── HeroSection.vue    # Particle hero
│   │   ├── AboutSection.vue   # Split-panel intro
│   │   ├── ExperienceSection.vue  # Horizontal journey
│   │   ├── SkillsSection.vue  # Interactive constellation
│   │   ├── ProjectsSection.vue    # Stacked card reveal
│   │   ├── EducationSection.vue   # Credential showcase
│   │   ├── LanguagesSection.vue   # Visual proficiency
│   │   └── ContactSection.vue     # Terminal-style contact
│   ├── ui/
│   │   ├── GlowCard.vue       # Reusable glow-border card
│   │   ├── AnimatedText.vue   # GSAP text reveal
│   │   ├── MagneticButton.vue # Button with magnetic hover
│   │   ├── ParticleCanvas.vue # Hero background
│   │   └── SkillOrbit.vue     # Orbital skill visualization
│   └── icons/                 # Custom SVG icon components
├── composables/
│   ├── useScrollAnimation.ts  # GSAP ScrollTrigger wrapper
│   ├── useAnalytics.ts        # Umami analytics composable
│   ├── useMagneticEffect.ts   # Mouse-follow magnetic effect
│   ├── useTypewriter.ts       # Typewriter text effect
│   └── useSmoothScroll.ts     # Lenis smooth scroll wrapper
├── data/
│   └── cv-data.ts             # Typed CV data (ported from JSON)
├── layouts/
│   └── default.vue            # Main layout with nav + cursor
├── pages/
│   └── index.vue              # Single page, all sections
├── plugins/
│   ├── gsap.client.ts         # GSAP + ScrollTrigger registration
│   └── lenis.client.ts        # Smooth scroll initialization
├── public/
│   ├── CV_Ghassen_Bargougui.pdf
│   ├── ocp11.png
│   ├── favicon.svg
│   └── og-image.png           # New OG image for social sharing
└── types/
    └── cv.ts                  # TypeScript interfaces for CV data
```

---

## Detailed Section Designs

### 1. Hero Section — "Particle Constellation"

**Concept**: Full-viewport immersive entry. No background image. Instead, an animated **particle field** (dots connected by lines) forms a subtle constellation pattern. The user's mouse position influences particle movement (interactive parallax).

**Elements**:
- Full viewport height with centered content
- Name displayed with **letter-by-letter staggered reveal** (GSAP SplitText)
- Title types itself out via a **typewriter effect** with blinking cursor
- Compact contact pills (location, availability status) at bottom
- Social links as **magnetic hover buttons** (icons that attract toward cursor)
- Subtle scroll indicator at bottom (animated chevron)
- NO background image — pure canvas/CSS particle system

**Key Difference from Current**: Removes the programmer stock photo. Replaces with a living, interactive environment. Name presentation is dramatic and cinematic vs. static gradient text.

---

### 2. About Section — "Split Reveal"

**Concept**: Two-panel split screen. Left side: large "5+" years counter with animated number counting up. Right side: flowing paragraphs that reveal line-by-line on scroll.

**Elements**:
- Left panel: Big stats (years exp, companies, certifications)  with counter animation
- Right panel: Bio paragraphs with a subtle vertical line accent
- Key differentiators displayed as **bento grid cards** below:
  - Oracle Certified badge (with actual cert image)
  - "Full-Stack" chip + related tech icons
  - "Multilingual" with mini flag indicators
  - "Clean Architecture" ethos statement

**Key Difference**: Moves from a text-heavy "About Me" to a **data-driven visual story**. Stats animate into view, and the bento layout is far more scannable.

---

### 3. Experience Section — "Horizontal Journey"

**Concept**: **Pinned horizontal scroll**. The section locks to the viewport and scrolls horizontally as the user scrolls vertically. Each job is a full "screen" card that slides in from right.

**Elements**:
- Each experience gets a "card" that fills ~80% viewport width
- Company name + logo area (even if just styled text)
- Role + period displayed prominently
- "Current" badge with live green pulse indicator
- Achievements listed with small progress chips
- Color accent changes per company (warm, cool, neutral) to create visual variety
- A subtle **progress bar** runs along the bottom showing where you are in the career journey

**Key Difference**: Completely eliminates the vertical timeline. Horizontal scroll is tactile and memorable. Each job gets breathing room instead of being stacked.

---

### 4. Skills Section — "Constellation Map"

**Concept**: An **interactive orbital diagram** where skill categories are planetary bodies and individual skills orbit them. Hovering a category reveals its skills. Clicking toggles focus.

**Fallback/alternative if orbital is too complex**: **Animated skill bars** in a radial/circular gauge layout, grouped in **hexagonal bento cards** per category.

**Elements**:
- Central core: "Software Engineer" label
- Category orbitals: Backend, Frontend, DevOps, Database, Testing, etc.
- Each skill displayed with its devicon logo
- "Core Skills" highlighted with a glow ring
- Category stats summary: total count per domain
- Responsive: on mobile, falls back to a styled accordion with animated reveals

**Key Difference**: Replaces the flat tabbed chip grid with an **immersive, explorable visualization**. It invites interaction instead of passive scanning.

---

### 5. Projects Section — "Stacked Card Reveal"

**Concept**: Projects are layered as **stacked cards** (like a deck). Scrolling "peels" each card backward to reveal the next one underneath. Inspired by Apple product page showcases.

**Elements**:
- Each project card contains:
  - Project title with role tag
  - Tech stack as small pills
  - Key outcomes (3 max, expandable)
  - CTA button for "Play" / "View" if external link exists
- Cards have distinct accent borders per project
- The topmost card casts a subtle shadow onto the ones beneath
- Optional: cards slightly rotate/tilt as they're peeled away

**Key Difference**: Replaces the 3-column grid with a **sequential, curated reveal**. Gives each project its moment of focus instead of competing for attention.

---

### 6. Education & Certifications — "Credential Wall"

**Concept**: A **masonry/bento grid** layout mixing education cards and certification badges. The Oracle certification gets a **featured, oversized card** with the actual badge image and a glow border.

**Elements**:
- Education entries as clean cards with institution, degree, period
- Certification card: large format with badge image, issuer, verification link
- Subtle "verified" check animation on the certification
- Background: subtle geometric pattern

**Key Difference**: Replaces the symmetrical 2-column layout with an asymmetric masonry grid that creates visual hierarchy — the OCP cert is clearly the hero.

---

### 7. Languages Section — "Globe Visualization"

**Concept**: A **circular radial chart** where each language is a ring segment. Native = full ring, Fluent = 85% ring, Basic = small arc. Clean and immediately clear.

**Elements**:
- Central circle with "4 Languages" count
- Concentric arcs for each language with animated fill on scroll
- Language labels with level descriptors
- Small flag or emoji indicators
- Below: a brief context statement about multilingual communication

**Key Difference**: Replaces the 4-card grid with a **single cohesive visualization** that communicates proficiency levels at a glance.

---

### 8. Contact Section — "Terminal"

**Concept**: A **terminal-style** contact area — dark background with monospace text, simulating a command-line prompt. It's on-brand for an engineer and highly memorable.

**Elements**:
```
$ whoami
  Ghassen Bargougui — Software Engineer

$ contact --email
  ghassen.brg16@gmail.com

$ connect --social
  → github.com/ghassenbrg
  → linkedin.com/in/ghassenbrg

$ send-message --interactive
  [Name]     _______________
  [Email]    _______________  
  [Message]  _______________
  
  > submit_                              [Enter]
```
- Terminal window with chrome (minimize/maximize/close dots)
- Typewriter reveal of each "command" line
- The form inputs are styled to look like terminal prompts
- Success response: `✓ Message sent successfully. Expect a reply within 24h.`

**Key Difference**: Replaces the generic modal form with a **thematic, immersive contact experience** that is memorable and playful.

---

### 9. Navigation — "Side Dots + Progress"

**Concept**: Instead of a top navbar, use **side-rail dot navigation** (right side, vertically centered). Each dot represents a section. The active section's dot is highlighted and labeled on hover.

**Elements**:
- Fixed right-side rail with 8 dots
- Active dot: expanded with amber glow + section label tooltip
- A thin vertical progress line connects dots, filling as you scroll
- Mobile: converts to a **bottom sheet** hamburger menu
- Top-left: Logo/initials "GB" as a home link
- Top-right (optional): CV download button (subtle)

**Key Difference**: Eliminates the traditional sticky header. Creates a cleaner, more immersive experience with the side-rail pattern used by Apple, Stripe, and other premium sites.

---

## Global Interactive Elements

### Custom Cursor
A custom cursor that changes shape based on context:
- Default: small dot with slightly larger circle follower
- Hoverable elements: circle expands with "View" or "Click" text
- Magnetic buttons: cursor gets attracted toward the center

### Smooth Scrolling
Integrate **Lenis** (or equivalent) for buttery smooth scroll behavior with easing.

### Page Transitions
GSAP-powered page loading animation:
1. Logo "GB" appears centered
2. Expands outward as a mask reveal
3. Content renders beneath

### Scroll Progress
A thin amber line at the very top of the page showing total scroll progress (0% to 100%).

---

## Data Model (TypeScript)

```typescript
interface CVData {
  hero: {
    name: string
    title: string
    location: string
    phone: string
    email: string
    github: string
    linkedin: string
    cvLink: string
    availabilityStatus?: string  // NEW: "Available for opportunities"
  }
  about: {
    paragraphs: string[]
    stats: {                      // NEW: structured stats
      yearsExperience: number
      companiesWorked: number
      certificationsCount: number
    }
  }
  skills: Record<string, Skill[]>
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  languages: Language[]
}

interface Skill {
  name: string
  icon: string
  highlight: boolean
  proficiency?: number           // NEW: 0-100 for visualization
}

interface Experience {
  company: string
  position: string
  location: string
  period: string
  description: string
  achievements: string[]
  accentColor?: string           // NEW: per-company color accent
}

interface Project {
  title: string
  role: string
  link?: string
  linkLabel?: string
  outcomes: string[]
  technologies: string[]
  featured?: boolean             // NEW: flag for emphasis
}

interface Education {
  degree: string
  institution: string
  location: string
  period: string
}

interface Certification {
  name: string
  issuer: string
  date: string
  link?: string
  image?: string
}

interface Language {
  language: string
  level: string
  percentage: number
  flag?: string                  // NEW: emoji or ISO code
}
```

---

## Finalized Decisions

| Decision | Choice | Notes |
|---|---|---|
| **Fonts** | ✅ Space Grotesk + DM Sans (free) | Google Fonts, no licensing needed |
| **3D Hero** | ✅ Three.js particle constellation | Interactive canvas via `@tresjs/core` |
| **Experience Layout** | ✅ Horizontal scroll + mobile fallback | Desktop: pinned horizontal scroll · Mobile/tablet: vertical stacked cards |
| **Contact** | ✅ EmailJS (client-side) | Keep existing integration, no server routes needed |
| **Deployment** | ✅ Docker + NGINX (keep) | Update Dockerfile for `nuxi generate` output |

---

## Phased Execution Roadmap

### Phase 1: Foundation (Day 1)
- Initialize Nuxt 3 project with TypeScript
- Setup CSS design system (tokens, typography, utilities)
- Configure GSAP plugin + Lenis smooth scroll
- Port CV data to TypeScript
- Setup project structure (dirs, types, composables)

### Phase 2: Layout Shell (Day 1-2)
- Build default layout with side-dot navigation
- Implement custom cursor
- Add scroll progress bar
- Create page loader animation
- Build reusable UI components (GlowCard, AnimatedText, MagneticButton)

### Phase 3: Core Sections (Day 2-4)
- Hero with particle field + text animation
- About with split-panel + bento stats
- Experience with horizontal scroll journey
- Skills with interactive visualization
- Projects with stacked card reveal

### Phase 4: Supporting Sections (Day 4-5)
- Education & Certifications bento grid
- Languages radial chart
- Contact terminal
- Footer

### Phase 5: Polish & Deploy (Day 5-6)
- Mobile responsive pass
- Performance optimization (Lighthouse 90+)
- SEO meta tags (`useSeoMeta`)
- OG image generation
- Analytics integration (Umami)
- Dockerfile update for Nuxt SSG
- Cross-browser testing

---

## Verification Plan

### Automated Tests
- `nuxi build` — verify SSG builds without errors
- Lighthouse CI — target scores: Performance ≥90, Accessibility ≥95, SEO ≥95
- `npx nuxi typecheck` — TypeScript validation

### Manual Verification
- Side-by-side comparison with current site to confirm **visual distinctiveness**
- Test all interactive elements: scroll animations, hover effects, navigation, contact form
- Mobile responsiveness on iPhone/Android viewports
- Cross-browser: Chrome, Firefox, Safari
- PDF download link works
- Social links open correctly
- Analytics events fire properly

### Browser Testing
- Use the browser tool to navigate the new site and verify each section renders correctly
- Take screenshots for walkthrough documentation
