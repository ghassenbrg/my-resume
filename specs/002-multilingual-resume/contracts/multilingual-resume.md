# Multilingual Resume Contract

## Purpose

Define the visitor-facing contract for multilingual resume behavior so implementation, QA, and
future content updates share the same expectations.

## Published Language Source

- The public resume experience recognizes published translations from files matching the
  `cv-data-{lang}.json` pattern.
- English is the required fallback language and must remain publishable at all times.
- A language is visitor-selectable only when its dataset is loadable and satisfies resume data
  validation rules.

## Initial Language Resolution Contract

### Inputs

- Ordered client language preferences when available.
- The set of currently publishable resume languages.

### Resolution Rules

1. Check client preferences in order.
2. Prefer a direct match to a publishable language.
3. If no direct match exists, prefer a base-language match when a regional locale was supplied.
4. If no usable match exists or client preferences cannot be determined, use English.
5. The first render shown to the visitor must be a complete coherent resume in the resolved
   language.

### Acceptance Conditions

- The visitor never sees a selectable language that resolves to broken or partial content.
- The visitor never sees mixed-language sections caused by partial fallback.
- English remains available even when other translations fail.

## Language Switcher Contract

### Interaction Rules

- The current active language must be visible in the interface.
- The language switcher must list only publishable languages.
- The switcher must be operable by mouse, touch, and keyboard.
- A visitor may switch languages at any time after page load.
- Switching languages updates the entire translatable resume experience as one coherent view.

### Accessibility Rules

- The switcher exposes an accessible name and active state.
- Focus remains visible throughout switcher interaction.
- A language change does not trap focus or remove access to section navigation.
- Reduced-motion users receive the same content update without depending on animation cues.

## Failure Recovery Contract

- If a requested translation cannot be loaded or validated, the system recovers to English.
- Unusable translations are not advertised in the switcher.
- Recovery behavior must preserve access to primary resume actions and major sections.

## Analytics Contract

### Event Types

- `language_auto_resolved`: Fired after initial language resolution completes.
- `language_switched`: Fired after a visitor explicitly changes language.

### Allowed Payload Shape

- `resolved_language`
- `requested_language`
- `selection_source`
- `fallback_reason`

### Privacy Constraints

- No personally identifying values are allowed.
- No contact form message or email content may be attached.
- Payloads must remain limited to language behavior needed for product understanding.
