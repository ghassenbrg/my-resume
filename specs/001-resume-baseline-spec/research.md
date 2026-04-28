# Research: Editorial Resume Experience

**Date**: 2026-04-27  
**Spec**: [spec.md](./spec.md)

## Decision 1: Keep the deployment model static-first

**Decision**: Use Nuxt's static generation flow as the primary delivery mode, with Docker + NGINX
serving the generated output.

**Rationale**: The current repository already generates a static site, the constitution requires
static-hosting compatibility by default, and the product's content is mostly editorial rather than
user-specific.

**Alternatives considered**:

- Full server-rendered runtime: rejected because it adds operational complexity without changing the
  user value for a public resume.
- Client-only SPA output: rejected because it weakens SEO and does not improve the content model.

## Decision 2: Preserve one structured content source of truth

**Decision**: Keep resume content and supporting assets centrally defined in `public/cv-data.json`
with typed normalization in the app runtime.

**Rationale**: The resume experience spans multiple sections that reuse the same facts, links, and
artifacts. A single structured source prevents drift between hero, about, projects, credentials,
and downloadable assets.

**Alternatives considered**:

- Hard-coded content per section component: rejected because it increases duplication and makes
  future content edits error-prone.
- Split data files per section: rejected because the current content volume does not justify the
  added coordination cost.

## Decision 3: Treat motion as progressive enhancement

**Decision**: Keep motion-rich interactions for capable desktop contexts, but require reduced-motion
and mobile-safe fallbacks for every animated surface.

**Rationale**: The design system depends on narrative motion to feel distinctive, but the
constitution prohibits access or comprehension from depending on animation. Progressive enhancement
allows the experience to stay expressive without excluding keyboard, touch, or reduced-motion users.

**Alternatives considered**:

- Disable advanced motion entirely: rejected because it would collapse the visual direction into a
  safer but less distinctive portfolio.
- Force the same motion on every device: rejected because it creates accessibility and performance
  risk.

## Decision 4: Keep contact lightweight and explicit

**Decision**: Preserve the client-side contact workflow, validate inputs before submission, and show
clear status states for success and failure.

**Rationale**: The resume needs a direct conversion path without requiring accounts or complex back
office infrastructure. The current runtime configuration already supports outbound messaging, and the
main planning need is to make validation and user feedback explicit.

**Alternatives considered**:

- External contact-only links with no inline form: rejected because it weakens the direct outreach
  path described in the feature spec.
- Full custom backend submission flow: rejected because it adds operational scope unrelated to the
  core product goal.

## Decision 5: Limit analytics to privacy-safe engagement signals

**Decision**: Track only section discovery, navigation, and contact outcome events, and keep the
event taxonomy documented in `ANALYTICS.md`.

**Rationale**: The owner needs enough signal to understand how visitors move through the resume and
whether contact flows work, but the constitution disallows collecting message content or personal
analytics payloads.

**Alternatives considered**:

- No analytics beyond page views: rejected because it leaves navigation and contact effectiveness
  opaque.
- Rich behavioral tracking with detailed payloads: rejected because it conflicts with the privacy
  boundary set by the constitution.

## Decision 6: Use verification centered on build and experience QA

**Decision**: Validate this feature primarily through `npm run generate`, manual walkthroughs of the
three user stories, keyboard/reduced-motion/responsive checks, and analytics/contact smoke tests.

**Rationale**: The repository currently exposes a content-heavy UI experience without an established
test harness. Build and manual experience validation are the minimum reliable gates, while targeted
automated tests should be added only when future work introduces logic that is costly to verify by
hand.

**Alternatives considered**:

- Manual QA only: rejected because the constitution requires production-build verification.
- Introduce a full automated UI suite as part of planning: rejected because that would be a separate
  feature-sized investment rather than a prerequisite for the baseline plan.
