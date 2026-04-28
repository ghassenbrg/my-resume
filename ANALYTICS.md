# Umami Analytics Integration

This Nuxt 3 application uses Umami to capture privacy-safe interaction data for the resume
experience.

## Setup

The analytics script is injected from [app.vue](/Users/ghassenbrg/git/my-resume/app.vue:1) with
`useHead()`:

```ts
useHead({
  script: [
    {
      key: 'umami-analytics',
      src: 'https://umami.ghassen.io/analytics.js',
      defer: true,
      'data-website-id': '50b3cd1c-0757-4aac-bc88-ccbf97d38a19',
      'data-domains': 'ghassen.io,www.ghassen.io',
      'data-auto-track': 'true',
    },
  ],
})
```

Manual event helpers live in [composables/useAnalytics.ts](/Users/ghassenbrg/git/my-resume/composables/useAnalytics.ts:1).

## Available Tracking Functions

### `trackEvent(eventName, eventData?)`

Sends a custom Umami event when the client-side script is available.

```ts
const { trackEvent } = useAnalytics()

trackEvent('contact_form_submit', {
  source: 'contact_terminal',
})
```

### `trackFollowUpClick(label, href)`

Convenience wrapper for link interactions.

```ts
const { trackFollowUpClick } = useAnalytics()

trackFollowUpClick('github', 'https://github.com/ghassenbrg')
```

### `trackSectionView(section)`

Used by the section navigation to emit a section-view event once per section.

```ts
const { trackSectionView } = useAnalytics()

trackSectionView('about')
```

## Events Currently Emitted by the UI

- `navigation_click`: Fired from the section navigation when a visitor jumps to a section.
- `section_view`: Fired once per section when it becomes the active viewport section.
- `contact_form_submit`: Fired when the contact form is submitted after validation passes.
- `contact_form_success`: Fired after EmailJS accepts the message submission.
- `contact_form_error`: Fired when contact submission fails.
- `follow_up_click`: Fired when a visitor opens a CV, email, GitHub, or LinkedIn follow-up link.

## Event Payloads

| Event | Payload |
|-------|---------|
| `navigation_click` | `section` |
| `section_view` | `section` |
| `contact_form_submit` | `source` |
| `contact_form_success` | `source` |
| `contact_form_error` | `source`, `reason` |
| `follow_up_click` | `label`, `destination` |

## Privacy Rules

- Do not send personally identifying analytics payloads.
- Do not send raw contact message contents.
- Keep event payloads limited to interaction context that helps product decisions.
- Document every new event name, trigger, and purpose in this file when instrumentation changes.

## Verification

- Confirm the Umami script loads in the browser network panel.
- Confirm `window.umami?.track` exists before relying on analytics during QA.
- Exercise the instrumented interaction and verify the expected event appears in the Umami
  dashboard.
- Re-check that analytics changes still respect reduced-motion and accessibility fallbacks when they
  are tied to navigation or animated sections.
