<!--
Sync Impact Report
Version change: N/A -> 1.0.0
Modified principles:
- Template placeholder -> I. Distinct Editorial Identity
- Template placeholder -> II. Static-First Typed Architecture
- Template placeholder -> III. Accessible Motion and Responsive Resilience
- Template placeholder -> IV. Structured Content and Privacy-Safe Instrumentation
- Template placeholder -> V. Verification Before Merge
Added sections:
- Delivery Constraints
- Workflow and Review Standards
Removed sections:
- None
Templates requiring updates:
- ✅ updated .specify/templates/plan-template.md
- ✅ updated .specify/templates/spec-template.md
- ✅ updated .specify/templates/tasks-template.md
- ⚠ pending .specify/templates/commands/*.md (directory not present; nothing to update)
Follow-up TODOs:
- None
-->
# Ghassen.io Resume Constitution

## Core Principles

### I. Distinct Editorial Identity
- Every shipped UI change MUST reinforce the "Editorial Engineering" direction in
  `docs/implementation_plan.md` and `docs/design_specification.md`.
- New presentation work MUST NOT reintroduce the previous resume patterns this rewrite is replacing:
  generic long-scroll stacking, interchangeable card grids, default font stacks, purple-first
  gradients, or motion that exists only as ornament.
- Any feature that changes layout, typography, color, or motion MUST describe its visual intent,
  section transition behavior, and mobile fallback in the feature spec or plan before coding starts.
- Rationale: the redesign only succeeds if the site remains recognizably different from the
  previous product and preserves a deliberate visual voice.

### II. Static-First Typed Architecture
- Product code MUST remain centered on Nuxt 3, Vue 3, and strict TypeScript, with static output as
  the default delivery model.
- Resume content, SEO metadata, and section copy MUST come from structured sources and composables
  instead of being duplicated ad hoc across components.
- New dependencies, server-side runtime behavior, or client-heavy subsystems MUST be justified in
  the plan with their impact on prerendering, bundle size, and Docker/NGINX deployment.
- Rationale: the site is content-driven and should stay maintainable, type-safe, and compatible
  with static hosting.

### III. Accessible Motion and Responsive Resilience
- Every interactive or animated feature MUST provide keyboard access, visible focus treatment, and
  a reduced-motion path that preserves content access.
- Desktop-enhanced behaviors such as pinned scroll, particle fields, and magnetic interactions MUST
  degrade cleanly on touch devices, smaller viewports, and constrained hardware.
- No section is complete until it is readable and operable without hover and without animation
  assumptions on both mobile and desktop layouts.
- Rationale: this product uses motion as part of storytelling, so fallback behavior is a core
  requirement rather than optional polish.

### IV. Structured Content and Privacy-Safe Instrumentation
- Resume data, credentials, links, and derived summaries MUST remain structured and reusable so one
  source of truth can drive every section.
- Analytics MUST be minimal, privacy-safe, and limited to interaction signals that inform product
  decisions; personally identifying data and message contents MUST NOT be tracked.
- Every new analytics event MUST be documented with its trigger and purpose in the relevant runtime
  guidance before the change is considered complete.
- Rationale: the site evolves through content updates, and analytics only remains trustworthy when
  event ownership and privacy boundaries are explicit.

### V. Verification Before Merge
- Every change MUST include a verification plan proportional to its risk and the surfaces it
  touches.
- At minimum, UI-affecting work MUST verify a production build or static generate, responsive
  behavior, keyboard and focus flow, and reduced-motion handling for the changed experience.
- Documentation covering changed behavior, analytics, data sources, or deployment expectations MUST
  be updated in the same change.
- Rationale: experiential regressions are easy to miss in a portfolio product, so deliberate
  verification is required to keep quality visible.

## Delivery Constraints

- The default implementation stack is Nuxt 3, Vue 3, strict TypeScript, and CSS custom properties.
  Replacing that baseline requires an explicit plan-level exception.
- Motion libraries such as GSAP and Three.js/TresJS MAY be used when they materially improve the
  experience, but each use MUST have a fallback for reduced motion and non-desktop contexts.
- Deployment MUST remain compatible with `npm run generate`, Docker image creation, and static file
  serving through NGINX unless a documented amendment changes the hosting model.
- Public-facing content changes MUST preserve SEO metadata, asset integrity, and canonical resume
  artifacts such as the downloadable CV and social preview image.

## Workflow and Review Standards

- Every feature spec MUST capture experience intent, accessibility and motion fallback, analytics or
  content-source impact, and success criteria that can be verified without relying on implementation
  details.
- Every implementation plan MUST pass a Constitution Check that covers visual distinctiveness,
  architectural fit, accessibility fallback, instrumentation changes, and verification scope.
- Every task list MUST include verification work. Automated tests are required when the change adds
  non-trivial logic or state transitions; manual checks are still required for responsive behavior,
  focus flow, and reduced motion when the UI changes.
- Code review and self-review MUST reject changes that skip required documentation, bypass fallbacks,
  or introduce architecture that cannot be justified against these principles.

## Governance

- This constitution supersedes ad hoc delivery preferences for this repository. When supporting docs
  conflict with it, the constitution wins until those docs are updated.
- Amendments MUST be recorded in `.specify/memory/constitution.md`, include the affected principle
  or section changes, and update dependent templates or runtime guidance in the same change.
- Versioning policy for this constitution follows semantic versioning: MAJOR for incompatible
  governance changes or principle removals, MINOR for new principles or materially expanded rules,
  and PATCH for clarifications that do not change project obligations.
- Compliance review is required during planning, implementation, and review. Any exception MUST be
  documented in the implementation plan's Complexity Tracking section with a concrete justification.

**Version**: 1.0.0 | **Ratified**: 2026-04-27 | **Last Amended**: 2026-04-27
