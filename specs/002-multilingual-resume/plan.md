# Implementation Plan: Multilingual Resume Translations

**Branch**: `002-multilingual-resume` | **Date**: 2026-04-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-multilingual-resume/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add multilingual resume delivery to the existing static-first Nuxt single-page application by
deriving available languages from `cv-data-{lang}.json` files, selecting an initial language from
browser preferences with English fallback, and allowing explicit in-session language switching
without breaking the editorial flow, accessibility, or privacy-safe analytics model.

## Technical Context

**Language/Version**: TypeScript 5.x with Vue 3 single-file components on Nuxt 3  
**Primary Dependencies**: Nuxt 3, Vue 3, Vitest, existing composables/state utilities, Umami
analytics helper in `composables/useAnalytics.ts`  
**Storage**: Structured static JSON files in `public/` using `cv-data-{lang}.json` naming, plus
client-side in-session state for active language selection  
**Testing**: `npm run test:unit`, targeted unit coverage for locale resolution/data validation,
`npm run generate`, and manual desktop/mobile keyboard and reduced-motion QA  
**Target Platform**: Modern desktop and mobile browsers consuming the statically generated Nuxt site  
**Project Type**: Static-generated single-page resume web application  
**Performance Goals**: Preserve fast first render of hero content, avoid visible mixed-language
states during initial resolution, and keep language switching responsive on mid-range mobile and
desktop hardware  
**Constraints**: Must remain compatible with static generation and Docker/NGINX deployment, must
use structured resume files as the source of truth, must default safely to English, must not expose
broken translation options, and must keep analytics privacy-safe  
**Scale/Scope**: One landing page, one resume dataset schema, three currently published language
files, one language switcher surface, and small supporting changes in composables, types, docs, and
tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: The feature preserves the editorial single-page experience by integrating language choice
  into the existing resume flow rather than adding a detached settings experience.
- PASS: The implementation stays within the static-first Nuxt 3 + Vue 3 + strict TypeScript
  architecture and uses structured JSON resume files as the content source of truth.
- PASS: Accessibility, keyboard flow, reduced-motion behavior, and responsive fallback are in scope
  for the language switcher and for post-switch content continuity.
- PASS: Content-source changes and privacy-safe analytics additions are identified, with
  documentation updates required in `ANALYTICS.md` and feature docs.
- PASS: Verification includes static generation, unit coverage for non-trivial locale logic, and
  manual responsive/focus/reduced-motion checks.

## Project Structure

### Documentation (this feature)

```text
specs/002-multilingual-resume/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── multilingual-resume.md
└── tasks.md
```

### Source Code (repository root)

```text
app.vue
nuxt.config.ts
components/
├── layout/
│   └── AppNavigation.vue
├── sections/
│   ├── HeroSection.vue
│   ├── AboutSection.vue
│   ├── ExperienceSection.vue
│   ├── SkillsSection.vue
│   ├── ProjectsSection.vue
│   ├── EducationSection.vue
│   ├── LanguagesSection.vue
│   └── ContactSection.vue
composables/
├── useAnalytics.ts
└── useCvData.ts
pages/
└── index.vue
public/
├── cv-data-en.json
├── cv-data-fr.json
└── cv-data-jp.json
tests/
└── unit/
types/
└── cv.ts
ANALYTICS.md
AGENTS.md
```

**Structure Decision**: Keep the existing single-project Nuxt application structure. Multilingual
behavior will live primarily in `composables/useCvData.ts`, with view integration in existing
layout/section components, typed support in `types/cv.ts`, static content in `public/`, and
verification in `tests/unit`.

## Phase 0 Research

- Research output: [research.md](./research.md)
- Key decisions cover language file discovery, locale matching and English fallback, validation
  rules for publishable translations, in-session override behavior, analytics additions, and test
  coverage expectations.

## Phase 1 Design Artifacts

- Data model: [data-model.md](./data-model.md)
- Interface contract: [contracts/multilingual-resume.md](./contracts/multilingual-resume.md)
- Validation workflow: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- PASS: The design keeps the editorial resume intact by treating language switching as a lightweight
  control layered into the existing experience, not a separate UI mode.
- PASS: The data model preserves one structured dataset per locale and a single runtime resolution
  path instead of duplicating translatable facts ad hoc across components.
- PASS: The contract requires keyboard-accessible selection, visible active-language state,
  reduced-motion-safe switching, and mobile discoverability.
- PASS: Analytics additions are limited to privacy-safe language resolution and language-switch
  events, with documentation updates explicitly required.
- PASS: Quickstart validation includes unit tests, static generation, locale fallback checks, and
  responsive accessibility review, satisfying the constitution's verification rule.
