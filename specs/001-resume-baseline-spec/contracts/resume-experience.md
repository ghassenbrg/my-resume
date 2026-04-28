# Contract: Resume Experience

**Date**: 2026-04-27  
**Spec**: [../spec.md](../spec.md)

## Purpose

This contract defines the public interaction surface of the resume experience: section navigation,
primary actions, contact behavior, analytics events, and accessibility guarantees. It is a UI
contract rather than a network API.

## Section Registry Contract

The page MUST expose the following sections in this order with stable anchor ids:

| Order | Section ID | Label | Required Outcome |
|-------|------------|-------|------------------|
| 1 | `hero` | Hero | Present identity, role, and primary actions immediately |
| 2 | `about` | About | Provide concise professional positioning and supporting stats |
| 3 | `experience` | Experience | Present chronological professional evidence |
| 4 | `skills` | Skills | Show grouped technical strengths and highlighted core skills |
| 5 | `projects` | Projects | Show featured work with outcomes and optional destinations |
| 6 | `education` | Education | Show education and certification proof |
| 7 | `languages` | Languages | Show language proficiency clearly |
| 8 | `contact` | Contact | Provide direct outreach and external follow-up paths |

## Navigation Contract

- Navigation MUST allow direct movement to every section in the registry.
- Active-section indication MUST update as the visitor moves through the page.
- Keyboard users MUST be able to reach and activate every navigation control.
- Reduced-motion users MUST still reach every section without relying on animated cues.

## Primary Action Contract

The experience MUST expose these primary outward actions:

| Action | Location | Behavior |
|--------|----------|----------|
| CV access | Hero and/or supporting sections | Open or download the latest resume artifact |
| Professional profile links | Hero and contact areas | Open the selected external destination safely |
| Contact submission | Contact section | Validate fields, attempt delivery, and report status clearly |

## Contact Interaction Contract

### Inputs

| Field | Required | Validation |
|-------|----------|------------|
| `name` | Yes | Must be non-empty |
| `email` | Yes | Must match a valid email format |
| `message` | Yes | Must be non-empty |

### Status States

| State | Meaning | Visitor Feedback |
|-------|---------|------------------|
| `idle` | No submission in progress | Form is editable and ready |
| `sending` | Submission is in progress | Loading feedback is visible |
| `sent` | Submission succeeded | Success message is visible |
| `error` | Submission failed or validation blocked it | Error message explains next action |

## Analytics Event Contract

Only privacy-safe events are allowed for this feature.

| Event Name | Trigger | Allowed Payload Shape |
|------------|---------|-----------------------|
| `navigation_click` | Visitor jumps to a section from navigation | `section` |
| `section_view` | A section becomes active in the viewport | `section` |
| `contact_form_submit` | Valid contact submission is attempted | `source` |
| `contact_form_success` | Contact delivery succeeds | `source` |
| `contact_form_error` | Contact delivery fails | `source`, `reason` |
| `follow_up_click` | Visitor opens CV, email, GitHub, or LinkedIn follow-up action | `label`, `destination` |

Rules:

- Payloads MUST NOT include raw contact message text.
- Payloads MUST remain small and contextual.
- New event names MUST be added to `ANALYTICS.md` before release.

## Accessibility and Fallback Contract

- Every primary action and navigation control MUST have visible focus treatment.
- Desktop-enhanced motion patterns MUST have reduced-motion and touch-friendly fallbacks.
- Content hierarchy MUST remain understandable when animations are disabled.
- Failure to load a decorative asset MUST NOT block access to core resume information.
