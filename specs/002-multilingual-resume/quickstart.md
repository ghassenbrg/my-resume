# Quickstart: Multilingual Resume Translations

## Goal

Verify that multilingual resume support resolves the right default language, exposes only published
usable translations, and preserves the current editorial experience across desktop and mobile.

## Prerequisites

- Install dependencies with `npm install`
- Ensure the published resume files in `public/` include at minimum `cv-data-en.json`
- Use a browser where preferred language order can be changed for manual QA

## Automated Verification

1. Run `npm run test:unit`
2. Confirm locale resolution, fallback handling, and translation availability tests pass
3. Run `npm run generate`
4. Confirm static generation succeeds with multilingual resume assets included

## Manual Verification

### Supported Locale Resolution

1. Configure the browser's top preferred language to French
2. Open the generated or dev resume site
3. Confirm the initial resume content renders in French
4. Repeat with Japanese and confirm the initial resume content renders in Japanese

### Unsupported Locale Fallback

1. Configure the browser's top preferred language to an unsupported language such as Spanish
2. Open the resume site
3. Confirm the initial resume content renders in English
4. Confirm no broken or partial translation content is shown

### Regional Locale Matching

1. Configure the browser's top preferred language to a regional locale such as `fr-CA`
2. Open the resume site
3. Confirm the resume resolves to the published French translation instead of English

### Language Switching

1. Load the resume in any supported language
2. Use the language selector to switch to another published language
3. Confirm hero, about, section copy, experience text, projects text, education text, and language
   labels update coherently
4. Confirm section navigation and follow-up links remain usable after the switch

### Invalid Translation Exclusion

1. Temporarily make one non-English translation unavailable or invalid in a local test branch
2. Load the site
3. Confirm that translation is not listed in the selector
4. Confirm the site recovers to English when that language would otherwise have been selected

### Accessibility and Responsive QA

1. Navigate to the language selector using keyboard only
2. Confirm focus visibility, active-language clarity, and successful selection without pointer use
3. Enable reduced motion and confirm language changes remain understandable without animation cues
4. Repeat key flows on a narrow mobile viewport and confirm the selector remains discoverable and
   does not block primary navigation

## Documentation Verification

1. Confirm `ANALYTICS.md` documents every new language-related event and payload
2. Confirm feature docs still point to the correct multilingual planning artifacts

## Content Maintenance Notes

- Publish each translation as `public/cv-data-{lang}.json`
- Keep `public/cv-data-en.json` valid at all times because it is the required English fallback
- Add structured `experience[].startDate` and `experience[].endDate` values plus per-language
  `languages[].code` values to every translation file so runtime stats and language badges do not
  depend on locale-specific text parsing
- Treat a translation as publishable only when the dataset validates against the shared CV data
  contract and loads without recovery fallback
