# Quickstart: Editorial Resume Experience

**Date**: 2026-04-27  
**Plan**: [plan.md](./plan.md)

## Goal

Validate the baseline resume experience against the feature spec, constitution, and interface
contract.

## Prerequisites

- Node.js 20+ and npm
- Project dependencies installed with `npm install`
- Access to the repository root

## Local Run

```bash
npm install
npm run dev
```

Open the local Nuxt application in a browser and keep DevTools available for responsive and
analytics checks.

## Build Validation

```bash
npm run generate
```

Success criteria for this step:

- Static generation completes without errors.
- Generated output still includes the public assets required by the resume experience.
- The generated `CV_Ghassen_Bargougui.pdf`, `og-image.png`, and `ocp11.png` assets return HTTP
  200 from the generated preview.

## User Story Validation

### User Story 1: First Impression

1. Load the landing page as a first-time visitor.
2. Confirm the candidate name, role, and primary actions are visible immediately.
3. Use the main navigation to jump across sections.
4. Confirm the active section indication changes as the viewport changes.

### User Story 2: Experience and Evidence

1. Review experience, skills, projects, education, certifications, and language sections.
2. Confirm each section has distinct hierarchy and remains readable without relying on motion.
3. Open any available credential proof and the CV artifact.
4. Confirm links work and the resume content remains consistent across sections.
5. Temporarily simulate missing CV, credential, and social-preview assets in a generated preview and
   confirm the page keeps core resume content accessible with no broken layout or blocked navigation.

### User Story 3: Follow-up Contact

1. Attempt contact submission with missing required fields and confirm validation feedback appears.
2. Attempt 20 valid submissions across success and forced-failure EmailJS configurations; confirm at
   least 19 attempts show success or failure feedback within 5 seconds.
3. Open external professional links from the hero or contact section and confirm they resolve.

## Accessibility and Motion Validation

1. Navigate the full experience using keyboard only.
2. Confirm visible focus states on navigation, links, buttons, and form fields.
3. Enable reduced-motion in the browser or operating system and confirm the site remains fully
   navigable and understandable.
4. Repeat a short walkthrough in a mobile viewport and confirm motion-heavy sections fall back to a
   usable layout.

## Analytics Validation

1. Open DevTools and confirm the Umami script loads.
2. Trigger section navigation and contact interactions.
3. Confirm the documented analytics events are emitted without exposing contact message content.

## Optional Container Smoke Test

```bash
docker compose up --build
```

Open `http://localhost:8080` and confirm the generated site and public assets are served correctly.
