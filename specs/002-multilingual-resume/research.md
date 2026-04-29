# Research: Multilingual Resume Translations

## Decision 1: Use `cv-data-{lang}.json` files as the only publishable language source

- Decision: Derive supported resume languages from locale-specific JSON files in `public/` named
  with the `cv-data-{lang}.json` pattern, with English treated as the required baseline dataset.
- Rationale: The feature spec explicitly defines file presence as the source of truth for language
  availability. Keeping availability coupled to published files avoids duplicated configuration and
  keeps static hosting simple.
- Alternatives considered:
  - Manual language list in runtime config: rejected because it can drift from the actual published
    files.
  - One monolithic translations file: rejected because the repository already organizes resume
    content as complete per-locale datasets and the user requested the file-based pattern.

## Decision 2: Resolve initial locale from ordered browser preferences with base-language matching

- Decision: Inspect the client language preference list in order, normalize entries to lowercase,
  and match full locale first, then base language, before falling back to English.
- Rationale: This honors the visitor's preference more accurately than checking only a single
  language value, while still supporting regional variants like `fr-CA` when only `fr` is
  published.
- Alternatives considered:
  - Match only `navigator.language`: rejected because it ignores secondary preferences and degrades
    accuracy for multilingual users.
  - Require exact locale matches only: rejected because most published resume files will likely use
    base language codes.

## Decision 3: Treat unusable translation files as unavailable before they reach the UI

- Decision: A translation dataset is publishable only if it can be loaded and passes the existing
  resume data validation rules required for runtime use.
- Rationale: Visitors should not see a selectable language that resolves to partial or broken
  content. The current `useCvData.ts` already validates required sections and required strings, so
  extending that validation model is lower risk than allowing soft failure in the UI.
- Alternatives considered:
  - Show all files and fail after selection: rejected because it creates visible dead ends.
  - Allow partial translation fallback per field: rejected because the spec requires coherent
    language versions and no mixed-language sections.

## Decision 4: Keep manual language choice for the current visit only

- Decision: Maintain the visitor's chosen language in client-side runtime state for the current
  visit and do not introduce cross-visit persistence in this feature.
- Rationale: The spec explicitly scopes persistence to the current visit by default. This avoids
  adding storage behavior that was not requested and keeps the implementation compatible with the
  existing lightweight state model.
- Alternatives considered:
  - Persist across visits in local storage or cookies: rejected because it expands privacy and
    product behavior beyond the requested scope.
  - Re-run auto-detection after every navigation event: rejected because it would override explicit
    visitor choice.

## Decision 5: Add privacy-safe analytics only for resolution and explicit switching

- Decision: Add one event for initial language resolution and one event for visitor-initiated
  language changes, with payloads limited to non-identifying language metadata and fallback reason
  where relevant.
- Rationale: This is enough to understand language demand and fallback frequency without collecting
  message content or personal identifiers, aligning with the repository's analytics rules.
- Alternatives considered:
  - No language analytics: rejected because the feature spec explicitly calls for understanding
    demand.
  - Per-section language tracking: rejected because it adds noise and does not materially inform
    product decisions.

## Decision 6: Verify the feature with unit tests for logic and manual QA for integrated behavior

- Decision: Add targeted unit tests around locale resolution, language availability filtering, and
  fallback behavior, then verify end-to-end behavior through `npm run generate` and manual desktop
  and mobile QA.
- Rationale: The new risk in this feature is primarily logic and state orchestration rather than a
  new backend interface. Unit tests cover deterministic rules efficiently, while manual QA confirms
  the editorial UI, keyboard flow, and switching experience.
- Alternatives considered:
  - Manual QA only: rejected because locale resolution and fallback behavior are deterministic and
  should be regression-tested automatically.
  - Full browser automation first: rejected because the logic can be validated more directly and
  cheaply at the unit layer for the initial implementation.
