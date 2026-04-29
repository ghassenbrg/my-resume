# Feature Specification: Multilingual Resume Translations

**Feature Branch**: `002-multilingual-resume`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "our resume should be have mulitlanguage translations, using the cv-data-{lang}.json file, and that's how we decide how what languages are available, byt those files. and we need to be able to swothc them, also the lagnuage to be decided depending on the default browser or client language, otherwise if cant know fall back to english."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open in the right language by default (Priority: P1)

As a first-time visitor, I want the resume to open in the language that best matches my browser or
device preference so I can start reading immediately without manual setup.

**Why this priority**: Default language selection affects every visitor and determines whether the
resume feels accessible from the first screen.

**Independent Test**: A first-time visitor with a supported preferred language can open the resume
and see the full experience in that language without using the language switcher.

**Acceptance Scenarios**:

1. **Given** a visitor's preferred client language matches one of the published resume
   translations, **When** the resume loads for the first time, **Then** the full translatable
   resume content is shown in that matching language.
2. **Given** a visitor's preferred client language is unavailable or cannot be determined,
   **When** the resume loads, **Then** the full translatable resume content is shown in English.
3. **Given** a visitor's preferred client language includes a regional variant, **When** the base
   language is available, **Then** the resume selects the matching base language rather than
   defaulting immediately to English.

---

### User Story 2 - Switch languages intentionally (Priority: P2)

As a visitor, I want to switch the resume language at any time so I can compare versions or read in
the language I prefer.

**Why this priority**: Automatic selection is not enough on its own; visitors need explicit control
over the language they read.

**Independent Test**: A visitor can change the language from the interface and immediately see the
resume update to the newly selected translation without losing access to any major section.

**Acceptance Scenarios**:

1. **Given** multiple resume translations are published, **When** a visitor opens the language
   selector, **Then** the selector lists only the languages that are actually available.
2. **Given** a visitor selects a different available language, **When** the selection is applied,
   **Then** all translatable resume content updates to that language as one coherent view.
3. **Given** a visitor has manually chosen a language during the current visit, **When** they
   continue navigating the resume, **Then** the chosen language remains active until they change it
   again or leave the experience.

---

### User Story 3 - Fail safely when translation data is incomplete (Priority: P3)

As the resume owner, I want missing or unusable translation data to fail safely so visitors still
receive a complete readable resume instead of a broken mixed-language experience.

**Why this priority**: Translation support increases content complexity and can undermine trust if a
published language is only partially usable.

**Independent Test**: A reviewer can remove or corrupt a non-default translation dataset and verify
that visitors still receive a complete English resume and only see selectable languages that are
usable.

**Acceptance Scenarios**:

1. **Given** a non-default translation dataset is missing or unusable, **When** the resume
   determines the available languages, **Then** that language is not offered as a selectable
   option.
2. **Given** a visitor would otherwise land on an unavailable or unusable translation, **When** the
   resume resolves the initial language, **Then** it falls back to English instead of showing
   incomplete content.

---

### Edge Cases

- What happens when only English is published and no other translation files exist?
- What happens when the browser reports a regional locale such as `fr-CA` or `ja-JP` but only the
  base language translation is published?
- What happens when the browser reports multiple preferred languages and the first one is
  unsupported?
- What happens when a translation file exists but is incomplete, malformed, or cannot be read at
  load time?
- What happens when a visitor switches languages while focused on a deep section of the resume?
- What happens when the selected language is no longer published in a later deployment?

## Experience & Quality Constraints *(mandatory)*

### Experience Intent

- Visual direction: The language control must feel like a native part of the editorial resume
  experience, integrated into the existing hierarchy rather than appearing as a generic utility
  banner or detached settings panel.
- Distinction from prior experience: Multilingual support must preserve the curated single-page
  storytelling flow while allowing visitors to read the same resume narrative in different
  languages.

### Accessibility & Motion

- Keyboard/focus behavior: Visitors must be able to discover the current language, open the
  language selector, and change languages using keyboard-only navigation with visible focus states.
- Reduced-motion fallback: Changing language must not rely on animation to communicate success; the
  updated content must remain understandable when motion is reduced or disabled.
- Mobile/responsive fallback: Language selection must remain easy to find and operate on small
  screens without obscuring primary resume actions or section navigation.

### Content & Instrumentation

- Content/data source impact: Locale-specific resume datasets named with the `cv-data-{lang}.json`
  pattern become the source of truth for translated resume content, with published language
  availability derived from which translated resume datasets are present alongside the English
  fallback dataset.
- Analytics impact: Track privacy-safe signals for initial language resolution and explicit
  language-switch actions so the owner can understand language demand without storing personal
  visitor content.
- Documentation impact: Content maintenance guidance, language-availability rules, and any visitor
  language analytics must be documented alongside the feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST determine the set of available resume languages from the published
  locale-specific resume datasets and MUST only present those languages as selectable options.
- **FR-002**: The system MUST treat English as the required fallback language for the resume
  experience.
- **FR-003**: The system MUST attempt to choose the initial resume language from the visitor's
  browser or client language preferences before the visitor interacts with the page.
- **FR-004**: The system MUST select the matching base language when the visitor preference includes
  a regional variant and that base language is available.
- **FR-005**: The system MUST fall back to English when the visitor's preferred language cannot be
  determined or does not match an available resume translation.
- **FR-006**: Users MUST be able to change the resume language explicitly from within the resume
  experience at any time after the page loads.
- **FR-007**: When a visitor changes language, the system MUST update all translatable resume
  content within the current experience to the selected language as one coherent version.
- **FR-008**: The system MUST preserve access to all major resume sections and primary actions after
  a language change.
- **FR-009**: The system MUST prevent unavailable, malformed, or incomplete translation datasets
  from being shown as active visitor-facing language options.
- **FR-010**: If a chosen or auto-selected translation cannot be used, the system MUST recover by
  presenting the English resume rather than a mixed or partial translation.
- **FR-011**: The system MUST keep the visitor's manually selected language active throughout the
  current visit unless the visitor changes it again.
- **FR-012**: The system MUST expose the current language choice in a way that is understandable to
  assistive technology users.
- **FR-013**: The system MUST keep non-translatable assets, links, and resume facts aligned across
  all published language versions so visitors are not shown conflicting professional information.

### Key Entities *(include if feature involves data)*

- **Resume Translation Dataset**: A complete visitor-facing resume content set for one language,
  including translated labels, summaries, sections, and resume-specific descriptive text.
- **Available Language**: A published language option that can be safely offered to visitors
  because its dataset is present and usable.
- **Language Preference**: The ordered language information provided by the visitor's browser or
  client, used to choose the initial resume language.
- **Language Selection**: The current active resume language chosen automatically or explicitly by
  the visitor during a session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing across supported languages, 100% of first loads display a
  complete resume in either a matching available translation or the English fallback, with no
  mixed-language sections.
- **SC-002**: In manual review on desktop and mobile, 100% of published language options can be
  discovered and switched within 10 seconds from landing on the page.
- **SC-003**: In scripted verification for unsupported or unknown client locales, 100% of sessions
  fall back to English on first load without blocking access to resume content.
- **SC-004**: In accessibility review, keyboard-only users can identify the active language and
  complete a language change without losing section access in 100% of tested flows.

## Assumptions

- English remains the canonical fallback resume language and is always published.
- Published language availability is determined solely by the presence of complete usable resume
  translation datasets, not by a separate manual configuration list.
- The multilingual feature applies to the public resume reading experience and does not require
  visitor accounts, profile personalization, or machine-generated translation.
- A visitor's manual language choice only needs to persist for the current visit unless later
  requirements expand that behavior.
