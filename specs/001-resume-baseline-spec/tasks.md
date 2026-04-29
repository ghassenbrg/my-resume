---

description: "Task list for implementing the editorial resume baseline experience"
---

# Tasks: Editorial Resume Experience

**Input**: Design documents from `/specs/001-resume-baseline-spec/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Verification**: Every story MUST include verification tasks. Automated tests are required for
shared composable logic and contact state transitions in this feature. Manual checks for
build/generate, responsive behavior, keyboard/focus flow, and reduced-motion handling are required
for every UI story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing
of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after dependencies are satisfied and when files do not overlap
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in every task description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the test and validation scaffolding needed for the feature.

- [X] T001 Add task-oriented test and validation scripts in `package.json`
- [X] T002 Create unit test configuration and Nuxt test bootstrap in `vitest.config.ts` and `tests/setup.ts`
- [X] T003 Create shared browser, motion, and fixture helpers in `tests/helpers/browser.ts` and `tests/fixtures/cv-data.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story work can begin.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Harden the typed resume-content normalization contract in `types/cv.ts` and `composables/useCvData.ts`
- [X] T005 [P] Centralize analytics event helpers and documented event taxonomy in `composables/useAnalytics.ts` and `ANALYTICS.md`
- [X] T006 [P] Normalize GSAP and smooth-scroll lifecycle fallbacks in `plugins/gsap.client.ts`, `plugins/lenis.client.ts`, `composables/useScrollAnimation.ts`, and `composables/useSmoothScroll.ts`
- [X] T007 [P] Strengthen global accessibility and editorial theme tokens in `layouts/default.vue`, `assets/css/main.css`, `assets/css/typography.css`, and `assets/css/animations.css`
- [X] T008 Add shared unit coverage for resume-data normalization and analytics helpers in `tests/unit/useCvData.spec.ts` and `tests/unit/useAnalytics.spec.ts`
- [X] T009 [P] Reconcile canonical resume content and public artifacts in `public/cv-data.json`, `public/CV_Ghassen_Bargougui.pdf`, `public/og-image.png`, and `public/ocp11.png`

**Checkpoint**: Foundation ready. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Present a Clear First Impression (Priority: P1) 🎯 MVP

**Goal**: Deliver a landing experience that immediately communicates identity, role, navigation,
and primary calls to action.

**Independent Test**: A first-time visitor can load the page, identify the candidate's role, move
between sections from navigation, and reach the CV or contact path without assistance.

### Verification for User Story 1

- [X] T010 [P] [US1] Add hero and navigation interaction coverage in `tests/unit/heroSection.spec.ts` and `tests/unit/appNavigation.spec.ts`
- [X] T011 [US1] Execute the first-impression QA scenarios in `specs/001-resume-baseline-spec/quickstart.md` against `pages/index.vue` and `layouts/default.vue`

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement hero copy, CTA state, and reduced-motion entry behavior in `components/sections/HeroSection.vue` and `composables/useTypewriter.ts`
- [X] T013 [P] [US1] Implement top-level section composition and lazy section loading in `pages/index.vue` and `components/ui/LazySectionMount.vue`
- [X] T014 [US1] Implement section navigation, active-state tracking, and mobile menu behavior in `components/layout/AppNavigation.vue` and `components/layout/AppScrollProgress.vue`
- [X] T015 [P] [US1] Finalize hero particle and magnetic-interaction fallbacks in `components/ui/ParticleCanvas.vue` and `components/ui/MagneticButton.vue`
- [X] T016 [US1] Update landing-page metadata and hero CTA instrumentation in `app.vue` and `ANALYTICS.md`

**Checkpoint**: User Story 1 is independently functional and ready for MVP review.

---

## Phase 4: User Story 2 - Evaluate Experience and Evidence (Priority: P2)

**Goal**: Deliver the evidence-rich sections that let recruiters and collaborators assess fit,
depth, and proof of work without a generic portfolio layout.

**Independent Test**: A reviewer can browse experience, skills, projects, education, languages, and
credentials, then summarize the candidate's background and verify the supporting artifacts.

### Verification for User Story 2

- [X] T017 [P] [US2] Add structured-rendering coverage for evidence sections in `tests/unit/aboutSection.spec.ts`, `tests/unit/experienceSection.spec.ts`, and `tests/unit/skillsSection.spec.ts`
- [X] T018 [US2] Execute the experience-and-evidence QA scenarios in `specs/001-resume-baseline-spec/quickstart.md` against `components/sections/ExperienceSection.vue` and `components/sections/ProjectsSection.vue`
- [X] T037 [US2] Verify adaptive desktop overflow fallback for tall Professional Experience entries in `specs/001-resume-baseline-spec/quickstart.md` against `components/sections/ExperienceSection.vue`
- [X] T039 [P] [US2] Add Featured Projects motion-trigger regression coverage in `tests/unit/projectsSection.spec.ts` and `components/sections/ProjectsSection.vue`

### Implementation for User Story 2

- [X] T019 [US2] Expand and validate structured resume content for evidence sections in `public/cv-data.json` and `types/cv.ts`
- [X] T020 [P] [US2] Implement profile stats and credential storytelling in `components/sections/AboutSection.vue` and `components/sections/EducationSection.vue`
- [X] T021 [P] [US2] Implement the horizontal experience journey in `components/sections/ExperienceSection.vue` and `composables/useScrollAnimation.ts`
- [X] T022 [P] [US2] Implement the skills constellation and mobile accordion fallback in `components/sections/SkillsSection.vue` and `components/ui/SkillOrbit.vue`
- [X] T023 [P] [US2] Implement featured projects and language proficiency sections in `components/sections/ProjectsSection.vue` and `components/sections/LanguagesSection.vue`
- [X] T024 [US2] Verify resume-proof assets and social metadata in `app.vue`, `public/CV_Ghassen_Bargougui.pdf`, `public/og-image.png`, and `public/ocp11.png`
- [X] T035 [US2] Verify missing CV, credential image, and social-preview asset fallback behavior using `specs/001-resume-baseline-spec/quickstart.md`, `components/sections/AboutSection.vue`, `components/sections/EducationSection.vue`, and `public/CV_Ghassen_Bargougui.pdf`
- [X] T038 [US2] Implement adaptive pinned-versus-readable overflow behavior for long Professional Experience entries in `components/sections/ExperienceSection.vue` and `specs/001-resume-baseline-spec/contracts/resume-experience.md`
- [X] T040 [US2] Implement section-scoped Featured Projects reveal/fade timing safeguards in `components/sections/ProjectsSection.vue`, `composables/useScrollAnimation.ts`, and `specs/001-resume-baseline-spec/quickstart.md`

**Checkpoint**: User Stories 1 and 2 both work independently, with evidence surfaces ready for
review.

---

## Phase 5: User Story 3 - Initiate Follow-up Contact (Priority: P3)

**Goal**: Deliver a reliable follow-up path that validates input, provides clear status feedback,
and tracks only privacy-safe interaction outcomes.

**Independent Test**: A visitor can submit the contact flow with valid data, recover from invalid
or failed attempts, and use outbound follow-up links with clear feedback.

### Verification for User Story 3

- [X] T025 [P] [US3] Add contact validation and status-transition coverage in `tests/unit/contactSection.spec.ts`
- [X] T026 [US3] Execute the deterministic contact and outbound-follow-up QA scenarios in `specs/001-resume-baseline-spec/quickstart.md` against `components/sections/ContactSection.vue`

### Implementation for User Story 3

- [X] T027 [US3] Implement terminal contact validation, submission feedback, and recovery states in `components/sections/ContactSection.vue`
- [X] T028 [P] [US3] Implement outbound profile and CV follow-up tracking in `components/sections/HeroSection.vue`, `components/layout/AppNavigation.vue`, and `components/ui/MagneticButton.vue`
- [X] T029 [US3] Align contact runtime configuration and privacy-safe instrumentation in `nuxt.config.ts` and `ANALYTICS.md`
- [X] T030 [US3] Validate external follow-up paths and CTA behavior in `components/ui/MagneticButton.vue` and `public/CV_Ghassen_Bargougui.pdf`

**Checkpoint**: All user stories are independently functional, with direct follow-up flows ready
for validation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish quality, documentation, and release validation work that spans multiple stories.

- [X] T031 [P] Refresh feature documentation references in `specs/001-resume-baseline-spec/spec.md`, `specs/001-resume-baseline-spec/plan.md`, and `specs/001-resume-baseline-spec/contracts/resume-experience.md`
- [X] T032 Tune performance and reduced-motion cleanup in `components/ui/ParticleCanvas.vue`, `plugins/lenis.client.ts`, and `components/sections/ProjectsSection.vue`
- [X] T033 Apply final accessibility audit fixes in `layouts/default.vue`, `components/layout/AppNavigation.vue`, `components/sections/HeroSection.vue`, `components/sections/ContactSection.vue`, and `assets/css/main.css`
- [X] T034 Run static build validation using `package.json` and `specs/001-resume-baseline-spec/quickstart.md`
- [X] T036 Run Docker and NGINX container smoke validation using `Dockerfile`, `docker-compose.yml`, and `specs/001-resume-baseline-spec/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. Blocks all user stories.
- **User Story Phases (Phase 3-5)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on completion of the desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on the other stories.
- **User Story 2 (P2)**: Starts after Foundational. Independent of US1 except for shared design
  tokens and normalized content infrastructure.
- **User Story 3 (P3)**: Starts after Foundational. Independent of US1 and US2 except for shared
  analytics and CTA components.

### Within Each User Story

- Automated tests MUST be written and fail before the related implementation task when tests are
  included.
- Shared data and supporting assets come before section-specific rendering.
- Component and composable work comes before instrumentation and final QA.
- Verification and documentation updates complete the story before sign-off.

### Parallel Opportunities

- After T004, T005, T006, T007, and T009 can run in parallel.
- After T019, T020, T021, T022, and T023 can be split across separate contributors.
- T039 can run before T040 to lock the Projects section reveal/fade regression against `components/sections/ProjectsSection.vue`.
- T027 and T028 can run in parallel after the shared foundational analytics helpers are complete.
- T031 can run in parallel with T032 once all three user stories are complete.

---

## Parallel Example: User Story 1

```bash
# Verification that can proceed together after foundational setup:
Task: "T010 Add hero and navigation interaction coverage in tests/unit/heroSection.spec.ts and tests/unit/appNavigation.spec.ts"
Task: "T011 Execute the first-impression QA scenarios in specs/001-resume-baseline-spec/quickstart.md against pages/index.vue and layouts/default.vue"

# Implementation split across non-overlapping files:
Task: "T012 Implement hero copy, CTA state, and reduced-motion entry behavior in components/sections/HeroSection.vue and composables/useTypewriter.ts"
Task: "T013 Implement top-level section composition and lazy section loading in pages/index.vue and components/ui/LazySectionMount.vue"
Task: "T015 Finalize hero particle and magnetic-interaction fallbacks in components/ui/ParticleCanvas.vue and components/ui/MagneticButton.vue"
```

## Parallel Example: User Story 2

```bash
# Section implementations that can run in parallel after T019:
Task: "T020 Implement profile stats and credential storytelling in components/sections/AboutSection.vue and components/sections/EducationSection.vue"
Task: "T021 Implement the horizontal experience journey in components/sections/ExperienceSection.vue and composables/useScrollAnimation.ts"
Task: "T022 Implement the skills constellation and mobile accordion fallback in components/sections/SkillsSection.vue and components/ui/SkillOrbit.vue"
Task: "T023 Implement featured projects and language proficiency sections in components/sections/ProjectsSection.vue and components/sections/LanguagesSection.vue"

# Projects motion regression work after baseline US2 rendering:
Task: "T039 Add Featured Projects motion-trigger regression coverage in tests/unit/projectsSection.spec.ts and components/sections/ProjectsSection.vue"
Task: "T040 Implement section-scoped Featured Projects reveal/fade timing safeguards in components/sections/ProjectsSection.vue, composables/useScrollAnimation.ts, and specs/001-resume-baseline-spec/quickstart.md"
```

## Parallel Example: User Story 3

```bash
# After the shared analytics helpers are in place:
Task: "T027 Implement terminal contact validation, submission feedback, and recovery states in components/sections/ContactSection.vue"
Task: "T028 Implement outbound profile and CV follow-up tracking in components/sections/HeroSection.vue, components/layout/AppNavigation.vue, and components/ui/MagneticButton.vue"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the landing experience as the MVP

### Incremental Delivery

1. Ship the landing and navigation experience with User Story 1
2. Add evidence-rich evaluation sections with User Story 2
3. Add direct follow-up flows with User Story 3
4. Finish with polish, accessibility, and build/container validation

### Parallel Team Strategy

1. One contributor completes Setup and Foundational work
2. After T019, separate contributors can own About/Education, Experience, Skills, and Projects/Languages
3. Contact follow-up work can proceed in parallel with final documentation and polish once the
   shared analytics layer is stable

---

## Notes

- Total tasks: 40
- Tasks for US1: 7
- Tasks for US2: 13
- Tasks for US3: 6
- Suggested MVP scope: complete through Phase 3 (User Story 1)
- All tasks follow the required checklist format with task IDs, story labels where required, and
  explicit file paths
