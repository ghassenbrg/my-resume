# Tasks: Multilingual Resume Translations

**Input**: Design documents from `/specs/002-multilingual-resume/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Verification**: Every story MUST include verification tasks. Automated tests are REQUIRED when
the change adds non-trivial logic, state transitions, or regressions that are hard to validate
manually. Manual checks for build/generate, responsive behavior, keyboard/focus flow, and
reduced-motion handling are never optional for UI changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Nuxt application code lives at repository root under `components/`, `composables/`, `pages/`,
  `types/`, and `public/`
- Automated verification for this feature belongs in `tests/unit/`
- Feature documentation updates stay in `ANALYTICS.md` and `specs/002-multilingual-resume/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repo for multilingual implementation and test coverage

- [X] T001 Create `tests/unit/useCvData.spec.ts` for multilingual CV data tests
- [X] T002 [P] Review and normalize published resume dataset filenames in `public/cv-data-en.json`, `public/cv-data-fr.json`, and `public/cv-data-jp.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core multilingual runtime infrastructure that MUST be complete before any user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Extend multilingual CV types in `types/cv.ts` for available languages, language selection, and locale resolution metadata
- [X] T004 [P] Refactor shared validation helpers in `composables/useCvData.ts` to support loading locale-specific datasets instead of a single hardcoded dataset
- [X] T005 [P] Add multilingual analytics event types and payload support in `composables/useAnalytics.ts`
- [X] T006 Implement shared language discovery and dataset resolution utilities in `composables/useCvData.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Open in the right language by default (Priority: P1) 🎯 MVP

**Goal**: Resolve the initial resume language from browser preferences and fall back safely to English

**Independent Test**: A first-time visitor with a supported preferred locale sees a complete resume
in that language on first load, while unsupported or unknown locales show the English resume
without mixed-language content.

### Verification for User Story 1 ⚠️

- [X] T007 [P] [US1] Add unit tests for ordered locale matching and base-language fallback in `tests/unit/useCvData.spec.ts`
- [X] T008 [P] [US1] Add unit tests for English fallback when client locale is unknown or unsupported in `tests/unit/useCvData.spec.ts`
- [ ] T009 [US1] Verify first-load locale resolution scenarios from `specs/002-multilingual-resume/quickstart.md` on desktop and mobile

### Implementation for User Story 1

- [X] T010 [US1] Implement client language preference parsing and ordered locale matching in `composables/useCvData.ts`
- [X] T011 [US1] Implement initial multilingual CV dataset loading with guaranteed English fallback in `composables/useCvData.ts`
- [X] T012 [US1] Update consumers in `pages/index.vue` and `components/sections/HeroSection.vue` to wait for resolved multilingual CV data on first render
- [X] T013 [US1] Emit privacy-safe initial language resolution analytics from `composables/useCvData.ts` using `composables/useAnalytics.ts`

**Checkpoint**: User Story 1 is fully functional and independently testable as the MVP

---

## Phase 4: User Story 2 - Switch languages intentionally (Priority: P2)

**Goal**: Let visitors switch between published languages without losing the editorial flow or accessibility

**Independent Test**: A visitor can discover the active language, switch to another published
language, and continue using section navigation and primary resume actions without losing context.

### Verification for User Story 2 ⚠️

- [X] T014 [P] [US2] Add unit tests for manual language selection precedence during the current visit in `tests/unit/useCvData.spec.ts`
- [ ] T015 [US2] Verify keyboard access, focus visibility, reduced-motion behavior, and mobile discoverability for the language selector in `components/layout/AppNavigation.vue`

### Implementation for User Story 2

- [X] T016 [US2] Add active language state and manual language switching APIs to `composables/useCvData.ts`
- [X] T017 [P] [US2] Implement the language selector UI with active-language labeling in `components/layout/AppNavigation.vue`
- [X] T018 [P] [US2] Update language-dependent section copy and labels in `components/sections/AboutSection.vue` and `components/sections/LanguagesSection.vue` to react cleanly to language changes
- [X] T019 [US2] Integrate language switching into `pages/index.vue` so section content updates coherently without breaking navigation state
- [X] T020 [US2] Emit privacy-safe explicit language-switch analytics from `components/layout/AppNavigation.vue` through `composables/useAnalytics.ts`

**Checkpoint**: User Stories 1 and 2 both work independently, with explicit switching now available

---

## Phase 5: User Story 3 - Fail safely when translation data is incomplete (Priority: P3)

**Goal**: Hide unusable translations and recover to English whenever a translation cannot be used safely

**Independent Test**: A reviewer can simulate invalid or missing non-English datasets and confirm
that only usable languages appear in the selector and the resume recovers to English when needed.

### Verification for User Story 3 ⚠️

- [X] T021 [P] [US3] Add unit tests for invalid dataset exclusion and recovery-to-English behavior in `tests/unit/useCvData.spec.ts`
- [ ] T022 [US3] Verify unavailable and malformed translation scenarios from `specs/002-multilingual-resume/quickstart.md` using local invalid dataset fixtures

### Implementation for User Story 3

- [X] T023 [US3] Implement publishable language filtering based on dataset load and validation results in `composables/useCvData.ts`
- [X] T024 [US3] Add runtime recovery handling for failed auto-selected or manually requested translations in `composables/useCvData.ts`
- [X] T025 [US3] Update the language selector to hide unusable languages and preserve access to resume actions in `components/layout/AppNavigation.vue`

**Checkpoint**: All user stories are independently functional, including safe failure behavior

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, cross-story verification, and release readiness

- [X] T026 [P] Document `language_auto_resolved` and `language_switched` events in `ANALYTICS.md`
- [X] T027 [P] Add multilingual content maintenance notes to `specs/002-multilingual-resume/quickstart.md`
- [X] T028 Run `npm run test:unit` and fix any regressions affecting `tests/unit/useCvData.spec.ts`
- [X] T029 Run `npm run generate` and verify the generated site still serves multilingual resume assets from `public/`
- [ ] T030 Perform final cross-story QA for supported locale resolution, switching, keyboard flow, reduced motion, and mobile behavior using `specs/002-multilingual-resume/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies, can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and benefits from User Story 1 runtime resolution being in place
- **User Story 3 (Phase 5)**: Depends on Foundational completion and should land after User Story 1 because it hardens the same loading path
- **Polish (Phase 6)**: Depends on completion of all desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories; this is the MVP
- **User Story 2 (P2)**: Builds on the multilingual runtime from US1 but remains independently testable once implemented
- **User Story 3 (P3)**: Hardens the multilingual runtime and selector behavior introduced by US1 and US2

### Within Each User Story

- Automated tests must be written and fail before implementation changes for that story
- Shared runtime logic in `composables/useCvData.ts` must land before dependent UI wiring
- Selector UI changes in `components/layout/AppNavigation.vue` must land before final accessibility verification
- Story-specific verification and documentation updates must complete before sign-off

### Parallel Opportunities

- T002 can run in parallel with T001
- T004 and T005 can run in parallel after T003 starts the shared type contract
- Within US1, T007 and T008 can run in parallel, then T010 and T011 can proceed
- Within US2, T017 and T018 can run in parallel after T016
- Within US3, T021 and T022 can run in parallel before T023 and T024
- T026 and T027 can run in parallel during polish

---

## Parallel Example: User Story 1

```bash
# Launch verification work together:
Task: "Add unit tests for ordered locale matching and base-language fallback in tests/unit/useCvData.spec.ts"
Task: "Add unit tests for English fallback when client locale is unknown or unsupported in tests/unit/useCvData.spec.ts"

# After runtime API shape is clear, implementation can split:
Task: "Implement client language preference parsing and ordered locale matching in composables/useCvData.ts"
Task: "Implement initial multilingual CV dataset loading with guaranteed English fallback in composables/useCvData.ts"
```

## Parallel Example: User Story 2

```bash
# After manual switching state exists:
Task: "Implement the language selector UI with active-language labeling in components/layout/AppNavigation.vue"
Task: "Update language-dependent section copy and labels in components/sections/AboutSection.vue and components/sections/LanguagesSection.vue to react cleanly to language changes"
```

## Parallel Example: User Story 3

```bash
# Run hardening verification together:
Task: "Add unit tests for invalid dataset exclusion and recovery-to-English behavior in tests/unit/useCvData.spec.ts"
Task: "Verify unavailable and malformed translation scenarios from specs/002-multilingual-resume/quickstart.md using local invalid dataset fixtures"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate first-load locale resolution before expanding scope

### Incremental Delivery

1. Land setup and foundational multilingual runtime support
2. Deliver User Story 1 as the first shippable increment
3. Add User Story 2 for explicit switching and verify accessibility
4. Add User Story 3 for resilience and invalid dataset handling
5. Finish with docs, generate validation, and cross-story QA

### Parallel Team Strategy

1. One developer handles foundational runtime and test scaffolding
2. After Phase 2, one developer can focus on locale resolution while another prepares switcher UI
3. Once US1 lands, hardening and selector refinement can proceed in parallel

---

## Notes

- [P] tasks touch different files or can be validated independently
- [US1], [US2], and [US3] map directly to the user stories in `spec.md`
- Every task includes an exact repository path and is written to be immediately executable
