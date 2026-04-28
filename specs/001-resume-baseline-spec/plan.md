# Implementation Plan: Editorial Resume Experience

**Branch**: `001-resume-baseline-spec` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-resume-baseline-spec/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Deliver the baseline public resume experience as a static-first Nuxt single-page application that
communicates Ghassen's profile through a distinct editorial interface, preserves structured content
and privacy-safe instrumentation, and supports accessible navigation, reduced-motion fallbacks, and
clear contact conversion paths.

## Technical Context

**Language/Version**: TypeScript 5.x with Vue 3 single-file components on Nuxt 3  
**Primary Dependencies**: Nuxt 3, Vue 3, GSAP, Three.js via `@tresjs/core`, Lenis, `@iconify/vue`, EmailJS  
**Storage**: Structured static content in `public/cv-data.json`; static assets in `public/` and `assets/`  
**Testing**: `npm run test:unit`, `npm run generate`, manual responsive/keyboard/reduced-motion QA, analytics smoke checks, and targeted automated coverage for non-trivial composable logic  
**Target Platform**: Modern desktop and mobile browsers, with static hosting through Docker + NGINX  
**Project Type**: Static-generated single-page portfolio/resume web application  
**Performance Goals**: Fast first-read access to hero content and navigation, smooth motion on capable desktop hardware, and graceful fallback on touch or reduced-motion contexts  
**Constraints**: Preserve the editorial redesign direction, single curated theme, privacy-safe analytics, keyboard accessibility, downloadable CV integrity, and static-generation deployment compatibility  
**Scale/Scope**: One primary landing page with eight major sections, one structured resume dataset, one contact workflow, and a small set of documented analytics events

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: Distinct editorial direction is anchored to `docs/implementation_plan.md` and
  `docs/design_specification.md`, and the feature explicitly avoids the legacy stacked portfolio
  patterns the constitution forbids.
- PASS: The solution fits the static-first Nuxt 3 + Vue 3 + strict TypeScript architecture already
  used in the repository and keeps deployment compatible with `npm run generate` and Docker + NGINX.
- PASS: Accessibility, keyboard flow, reduced-motion behavior, and mobile fallback are part of the
  feature spec and are captured again in design artifacts and quickstart validation steps.
- PASS: Content-source consistency and privacy-safe analytics are scoped as first-class planning
  concerns, with their runtime documentation already centralized in `ANALYTICS.md`.
- PASS: Verification scope includes static generation, responsive QA, focus/accessibility review,
  reduced-motion checks, and analytics/contact smoke validation.

## Project Structure

### Documentation (this feature)

```text
specs/001-resume-baseline-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── resume-experience.md
└── tasks.md
```

### Source Code (repository root)

```text
app.vue
nuxt.config.ts
assets/
├── css/
├── fonts/
└── images/
components/
├── layout/
├── sections/
└── ui/
composables/
data/
docs/
layouts/
pages/
plugins/
public/
├── cv-data.json
├── CV_Ghassen_Bargougui.pdf
├── og-image.png
└── ocp11.png
types/
├── cv.ts
Dockerfile
docker-compose.yml
ANALYTICS.md
```

**Structure Decision**: Keep the existing single-project Nuxt application structure. Core page
composition remains in `pages/`, reusable presentation in `components/`, behavior in
`composables/`, typed content contracts in `types/`, and structured resume content in
`public/cv-data.json`.

## Phase 0 Research

- Research output: [research.md](./research.md)
- Key decisions cover static-first deployment, structured content sourcing, motion progressive
  enhancement, contact workflow behavior, analytics scope, and verification strategy.

## Phase 1 Design Artifacts

- Data model: [data-model.md](./data-model.md)
- Interface contract: [contracts/resume-experience.md](./contracts/resume-experience.md)
- Validation workflow: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- PASS: The design keeps the "Editorial Engineering" direction explicit through section-level
  interaction contracts rather than generic card-grid fallback.
- PASS: The data model preserves one structured content source of truth and derived runtime view
  models instead of duplicating facts across components.
- PASS: Contracts require keyboard access, visible focus, reduced-motion behavior, and touch/mobile
  alternatives for motion-heavy sections.
- PASS: Contact and analytics design keep privacy boundaries explicit and document the permitted
  event taxonomy.
- PASS: Quickstart validation includes build/generate, responsive walkthroughs, accessibility
  checks, and contact/analytics smoke tests, satisfying the constitution's verification rule.
