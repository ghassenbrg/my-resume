# Data Model: Editorial Resume Experience

**Date**: 2026-04-27  
**Spec**: [spec.md](./spec.md)

## Overview

The experience is driven by one structured resume dataset plus a small number of runtime-derived
view models and interaction records. The public content model is editorial, not transactional, but
the contact and analytics flows introduce light state transitions that must still be explicit.

## Entities

### ResumeProfile

**Purpose**: Represents the identity and summary information used in the hero and about sections.

**Fields**:

- `name`: required string
- `title`: required string
- `location`: required string
- `email`: required email string
- `github`: required URL
- `linkedin`: required URL
- `cvLink`: required asset path or URL
- `availabilityStatus`: optional short status string
- `aboutParagraphs`: ordered list of summary paragraphs
- `stats`: derived summary values for years of experience, companies worked, and certifications

**Validation Rules**:

- Links must resolve to valid destinations.
- Email must be present anywhere contact or hero summary exposes it.
- Stats must remain consistent with the underlying experience and credential records.

### ExperienceEntry

**Purpose**: Captures one professional role in the experience journey.

**Fields**:

- `company`: required string
- `position`: required string
- `location`: required string
- `period`: required display string
- `description`: required summary paragraph
- `achievements`: non-empty ordered list of outcome statements
- `accentColor`: optional presentation hint

**Validation Rules**:

- Entries must remain chronologically understandable.
- Achievements must be concise and evidence-oriented.
- Current-role labeling must be derivable from the displayed period without creating ambiguity.

### SkillCategory

**Purpose**: Groups related capabilities for orbital and accordion presentations.

**Fields**:

- `label`: required category name
- `shortLabel`: derived compact label for constrained layouts
- `skills`: non-empty list of `SkillItem`

**Validation Rules**:

- Each category must communicate a coherent domain of expertise.
- Highlighted skills should be reserved for core strengths.

### SkillItem

**Purpose**: Represents one named skill inside a category.

**Fields**:

- `name`: required string
- `icon`: required icon key
- `highlight`: optional boolean
- `proficiency`: optional numeric indicator

**Validation Rules**:

- Icon keys must map to a renderable icon or a safe fallback.
- Highlight flags must stay sparse enough to preserve meaning.

### ProjectEntry

**Purpose**: Describes one featured project in the sequential project showcase.

**Fields**:

- `title`: required string
- `role`: required string
- `link`: optional URL
- `linkLabel`: optional CTA label
- `outcomes`: ordered list of project outcomes
- `technologies`: ordered list of technology labels
- `featured`: optional boolean

**Validation Rules**:

- Outcomes must describe user, business, or engineering value rather than raw tasks.
- Links are optional, but when present they must open a trustworthy destination.

### Credential

**Purpose**: Represents formal education or certification proof.

**Fields**:

- `name` or `degree`: required display name
- `issuer` or `institution`: required source organization
- `date` or `period`: required display date or range
- `location`: optional for education, expected for academic history
- `link`: optional verification destination
- `image`: optional supporting badge asset

**Validation Rules**:

- Verification links must exist when presented as actionable proof.
- Images must degrade safely when unavailable.

### LanguageProficiency

**Purpose**: Describes spoken language capabilities for summary and chart presentations.

**Fields**:

- `language`: required string
- `level`: required display label
- `percentage`: required numeric display value
- `flag`: optional decorative asset or token

**Validation Rules**:

- Percentages must remain within display bounds.
- Level labels should stay human-readable and consistent.

### NavigationSection

**Purpose**: Defines the public section map for site navigation and active-section tracking.

**Fields**:

- `id`: required stable section identifier
- `label`: required navigation label
- `order`: required display order
- `hasPrimaryAction`: derived boolean

**Validation Rules**:

- Section ids must stay unique and match the rendered DOM anchors.
- Ordering must align with the narrative flow defined by the experience.

### ContactSubmission

**Purpose**: Represents one visitor outreach attempt.

**Fields**:

- `name`: required string
- `email`: required email string
- `message`: required string
- `status`: one of `idle`, `sending`, `sent`, `error`
- `statusMessage`: optional user-facing feedback string

**Validation Rules**:

- Name, email, and message are required before submission.
- Email must match a basic valid-address pattern.
- Message content must never be copied into analytics payloads.

**State Transitions**:

- `idle -> sending`: submission starts after validation passes
- `sending -> sent`: outbound message accepted
- `sending -> error`: outbound failure or runtime issue
- `error -> idle`: visitor edits fields and retries

### AnalyticsEvent

**Purpose**: Records privacy-safe engagement signals.

**Fields**:

- `eventName`: required string
- `context`: small key/value payload
- `timestamp`: runtime-generated occurrence time

**Validation Rules**:

- Event names must be documented in `ANALYTICS.md`.
- Payloads must exclude message contents and personally identifying analytics detail.

## Relationships

- One `ResumeProfile` references many `ExperienceEntry`, `SkillCategory`, `ProjectEntry`,
  `Credential`, and `LanguageProficiency` records.
- One `NavigationSection` maps to one rendered page section and may expose one or more primary
  actions.
- One `ContactSubmission` may emit multiple `AnalyticsEvent` records for submit, success, or error.
- One visitor session can trigger many `AnalyticsEvent` records across navigation and section
  discovery.

## Derived Views

- `RuntimeCVData` enriches the base resume dataset with computed stats and normalized skill flags.
- Section summaries and SEO metadata derive from the same profile content rather than separate copy.
- Active navigation state derives from viewport position, not a separate persisted model.
