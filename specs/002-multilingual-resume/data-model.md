# Data Model: Multilingual Resume Translations

## Entities

### Resume Translation Dataset

- Purpose: Represents one complete resume content source for a single published language.
- Source: A public JSON file following the `cv-data-{lang}.json` naming convention.
- Core fields:
  - `languageCode`: Canonical language identifier derived from the filename, such as `en`, `fr`,
    or `jp`
  - `dataset`: Resume content payload matching the existing `CVData` structure
  - `isValid`: Whether the dataset passes resume validation required for runtime use
  - `isDefault`: Whether the dataset is the English fallback dataset
- Validation rules:
  - Filename must resolve to a non-empty language code
  - Payload must satisfy the required `CVData` structure
  - Invalid datasets are excluded from the visitor-facing available-language list

### Available Language

- Purpose: Represents a language option safe to present in the UI.
- Derived from: Valid `Resume Translation Dataset` entries
- Core fields:
  - `code`: Canonical published language code
  - `label`: Visitor-facing language label for the selector
  - `datasetPath`: Public path used to load the translation dataset
  - `isDefault`: Whether the language is the English fallback
- Validation rules:
  - Must map to a valid translation dataset
  - English must always be present as an available language

### Language Preference

- Purpose: Represents ordered language hints from the visitor's client.
- Source: Browser or client locale metadata
- Core fields:
  - `orderedLocales`: Full ordered locale identifiers, such as `fr-CA`, `en-US`
  - `orderedBaseLanguages`: Derived base language codes, such as `fr`, `en`
- Validation rules:
  - Empty or missing preferences are treated as unknown
  - Locale comparison is case-insensitive

### Language Selection

- Purpose: Represents the currently active resume language during a visit.
- Core fields:
  - `activeCode`: The currently displayed language code
  - `source`: Whether the selection came from `auto`, `fallback`, or `manual`
  - `fallbackReason`: Optional explanation when English is selected due to unsupported or invalid
    locale resolution
- Validation rules:
  - `activeCode` must reference an `Available Language`
  - Manual selection takes precedence over auto-detection for the rest of the visit

### Language Analytics Event

- Purpose: Represents privacy-safe instrumentation related to language behavior.
- Core fields:
  - `eventName`: Language-related event identifier
  - `resolvedLanguage`: Final language shown to the visitor
  - `requestedLanguage`: Optional requested locale or language when relevant
  - `selectionSource`: Whether the event came from automatic resolution or explicit change
  - `fallbackReason`: Optional reason when English fallback is used
- Validation rules:
  - Must not include personally identifying values
  - Must not include contact message or email content

## Relationships

- One `Resume Translation Dataset` produces zero or one `Available Language`.
- One ordered `Language Preference` resolves to one `Language Selection`.
- One `Language Selection` points to exactly one `Available Language`.
- `Language Analytics Event` entries describe transitions into or between `Language Selection`
  states.

## State Transitions

### Initial Resolution

1. Start with English as the guaranteed fallback candidate.
2. Read ordered client language preferences when available.
3. Attempt to match an available full locale.
4. If no full locale matches, attempt to match an available base language.
5. If no usable match exists, activate English with fallback source metadata.

### Manual Switch

1. Visitor opens the language selector.
2. Visitor selects an available language.
3. Active selection changes to the chosen language with `manual` source.
4. Resume content is reloaded or rebound from the chosen dataset.
5. Manual choice remains active for the current visit.

### Invalid Dataset Handling

1. A dataset fails to load or validate.
2. The language mapped to that dataset is excluded from available options.
3. If that language was being considered for initial selection, the resolver continues through the
   preference chain or falls back to English.
4. If that language had been requested explicitly in the same visit, the experience recovers to
   English rather than rendering partial content.
