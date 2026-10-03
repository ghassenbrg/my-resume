# Audit closure: content, recruitment, ATS and search discovery

Closes [content-search-ats-audit.md](content-search-ats-audit.md). Completed 3 October 2026 in the local repository. **Nothing has been deployed:** `https://ghassen.io` still serves the previous build (checked 3 October 2026; see [Local readiness versus production](#local-readiness-versus-production)).

This report covers extraction preflight and editorial accuracy. It is not an ATS score, a vendor-compatibility result, a ranking or citation forecast, or a hiring prediction.

## Outcome

| Area | Result |
| --- | --- |
| Original priority findings (1–11) | 9 resolved. 2 intentionally not applied pending your input: the internal agent application and the Pockito documentation bullets. |
| PDF/ATS extraction findings | All resolved. Japanese text contains no Kangxi radicals in six extraction methods, and every title shares one extracted line with its employer and dates. |
| French/Japanese wording table | All 7 rows applied. Further wording fixes came from the repeat audit. |
| Search/AI discovery (local) | All achievements are in the initial HTML. Localized title and description, `ProfilePage`/`Person` JSON-LD and plain language links are present. |
| Independent repeat audit | No constraint violations. 14 follow-up items: 11 fixed, 2 partly applied, 1 left for you (see [Repeat audit](#independent-repeat-audit)). |
| Production | Not deployed. The live `/fr` and `/ja` redirect issue is outside the repository build. |

## What changed

- **Content** (`public/cv-data-{en,fr,jp}.json`)
  - Rewritten headline, summary, experience and projects.
  - New fields: `hero.headline`, `about.profile`, `meta`, `experience[].roles`, `experience[].assignment`, and `pdf` selections.
  - Validated in `composables/useCvData.ts` and typed in `types/cv.ts`.
- **PDF generator**
  - `scripts/resume-content.mjs` holds the evidence selection as tested pure functions.
  - `scripts/generate-resume.mjs` holds layout, export and guards.
  - `scripts/fonts/` contains the Japanese font subsets with their licence, provenance and rebuild script.
- **Website**
  - Per-title dates and the client assignment (`ExperienceCard.vue`).
  - Native disclosure for additional achievements.
  - Hero headline.
  - Footer language links (`AppFooter.vue`).
  - Metadata and JSON-LD (`app.vue`).
  - Skill groups, glyphs and icons.
  - UI copy (`data/resume-ui.ts`).
- **Tests:** `tests/unit/resumeContent.spec.ts` adds 13 tests, covering:
  - identical facts across languages;
  - official titles and VERMEG dates;
  - no `%`, JLPT or TermLoom text;
  - PDF selection order and evidence coverage;
  - no positional truncation;
  - the disclosure markup.
- **Regenerated:** three PDFs plus the English compatibility alias, the share image and the static site.
- **Docs:** `docs/resume-readiness.md` is updated, since its statements about metrics, skills and fonts were stale.

## Findings, resolutions and verification

### Priority findings

| # | Finding | Resolution | Verification |
| --- | --- | --- | --- |
| 1 | Professional identity is hard to recognize | Official title kept in all languages, with a separate functional headline: "Java Applications, Cloud & Platform Engineering" (FR "Ingénierie applicative Java et plateformes cloud", JP "Javaアプリケーション・クラウド基盤開発"). The new opening sentence is not a technology list. FR and JP previously glossed the title ("Ingénieur d'application", "アプリケーションエンジニア"); the hero now shows the official "Application Engineer", and JP keeps the katakana in its summary. | Test: hero title and all four positions equal the official titles in every language. |
| 2 | Performance/observability work missing | Added k6/JMeter testing with bottleneck remedies, the Cloud Logging rework, and "currently helping move file-based application and trace logs to Kafka/Confluent". No pipeline architecture, distributed tracing or numbers are claimed. k6, JMeter, Cloud Logging, Log4j2, Kafka/Confluent and Maven added to skills. | Keyword presence checked in all PDFs with 6 extractors; test asserts this evidence is selected for the PDF. |
| 3 | Shared leadership | "help lead a hybrid-cloud migration alongside my manager and project manager, coordinating implementation with development, infrastructure, CI/CD, and security teams". FR "je contribue au pilotage … aux côtés de"; JP "とともに…推進に携わり". The redundant coordination bullet was merged into this sentence. | Repeat audit: resolved and consistent across languages. |
| 4 | Internal agent application | **Not published.** Disclosure and delivery stage are unresolved. No Redis-session, LLM-call or agent-application wording appears in Rakuten text. | Repeat audit: correctly excluded. |
| 5 | Automatic PDF truncation | Each entry's `pdf` selection names the printed bullets and company projects, in order. Unselected entries print in full. | Tests on selection order, the projects named, and the absence of `.slice(0, 2/3)`. Contents: all 6 Rakuten bullets; Keycloak/CI/CD/rollback; SalesFlow (Camunda, ActiveMQ); PackManager (JProfiler); Slide Agent distribution (npm, CLI, MCP server); Pockito Kubernetes deploy/rollback; SubMate optional cloud and RTL. |
| 6 | Undefined percentages | All four claims (50%, 40%, 35%, 30%) replaced with the audit's qualitative fallbacks in every language, the highlights and the PDFs. The "50%" highlight is now "JDK 25 — e-Navi API upgrade at Rakuten Card". The duplicate ActiveMQ claim now appears only under SalesFlow. | Test: no `\d %` in any language's content. HTML and PDF text checked. |
| 7 | VERMEG promotion dates | `roles`: Analyst Developer Jan 2023–Aug 2024 and Software Developer Oct 2019–Dec 2022. PDF prints one line per title with employer and dates. The website card is headed by the employer, lists each title with its own range, and keeps the overall tenure. | Test on role dates. All 6 extractors keep "Analyst Developer - VERMEG … \| Jan 2023 - Aug 2024" intact. Generated HTML checked. |
| 8 | Generic and duplicate wording | Applied every row of the audit table:<br>• Sogeti is now the employer, with "Client assignment at BGL BNP Paribas" as a separate field.<br>• Removed "Agile tribe and squad".<br>• Removed the duplicate CBTW bullet.<br>• Removed "with attention to".<br>• Qualified ownership.<br>• Degree reads "Engineering Degree (Diplôme d'ingénieur) in Software Architecture".<br>• Language levels are "Fluent" and "Basic". | Repeat audit: resolved; residual phrasing fixed afterwards. |
| 9 | Personal projects | Heading "Selected personal projects". Projects are labelled "Open source" individually; Slide Agent and SubMate have MIT LICENSE files, Pockito is "Personal project", and Traffic Forward has no licence, so no label. "From idea to production" removed. Summaries follow the audit. PDF entries show dates. Traffic Forward stays compact and Orbit Ways proportional. TermLoom stays excluded. | Licences checked in the local repositories. Repeat audit confirmed the public repositories and the `@slide-agent/core` npm package. |
| 10 | Pockito correctness evidence | **Not added.** Your instruction was to confirm ownership before using project documentation. | — |
| 11 | Skills emphasis | Seven groups ordered by emphasis: Java application engineering; cloud delivery and CI/CD; performance and observability; data and messaging; frontend/mobile; AI tooling; quality and security. Highlights reduced to Java, Spring Boot, Kubernetes, GCP and Angular. Acronyms expanded. No AWS, Terraform, OpenTelemetry or RAG added. | Rendered on the website and as one line per category in the PDFs. |

### ATS findings from the actual files

| Finding | Resolution | Verification |
| --- | --- | --- |
| Two-column skills | One line per category, comma-separated. | `-layout` output is linear in all languages. |
| Japanese date fragmentation | One bundled font (Noto Sans JP subset) for kana, kanji and digits. Each title, employer and date range is one text run (`… \| 2025年12月 - 現在`). | `2025年12月 - 現在` and every role line extract intact with Poppler default, `-layout` and `-raw`, pypdf, pdfminer and PyMuPDF. |
| Compatibility radicals (`⽇` instead of `日`) | Root cause: Chromium embeds every macOS Japanese system font tried (Hiragino, YuGothic, Toppan Bunkyu) as **Type 3**, and its ToUnicode map picks the Kangxi radical for glyphs shared with ideographs. The subsets have no radical or compatibility-ideograph cmap entries and embed as CID TrueType. The generator fails if a Japanese PDF contains a Type 3 font. | Before: 72 radicals with pypdf and pdfminer, and 97 font objects (Type 3). After: 0 radicals and 0 U+FFFD in all 6 extractors, and 3 fonts (all CID TrueType). The only remaining NFKC differences are intentional: full-width `（）：` in Japanese and no-break spaces in French. File size went from 704,483 to 167,150 bytes. |
| Title associated with full VERMEG tenure | See finding 7. | — |
| Project dates missing | Printed for every project whose data has a period. | Orbit Ways, Solife and Magikforms have no date in the data (see [Limitations](#remaining-limitations)). |
| "Source" link labels; certification link omitted | Links print their destinations (`github.com/ghassenbrg/SubMate`, `slide-agent.ghassen.io`, …). The credential prints as "Oracle CertView: bit.ly/ocp11gb". | 12 link annotations per PDF; the printed text matches the URIs. |
| Untagged PDF | Tagged export with outline. | `pdfinfo`: Tagged yes. The structure tree is present, with document language en/fr/ja. |
| Dense body text | Text grew to 9.4 pt in English and French (was 9.1) and stayed at 9.0 pt in Japanese (was 8.7). The space comes from removing repetition, a shorter profile, and merging languages into the education section. | 2 pages each, enforced by the generator. All six pages rendered and inspected: no clipping, missing glyphs or orphaned headings. The JP company-project list stays on one page. |
| French typography | Typographic apostrophes; no-break spaces before `:` and `;`; lowercase after a label colon; no-wrap date ranges. A line-end hyphen was being dropped by dehyphenating extractors, so date ranges no longer wrap. | `sept. 2015 - juin 2019` now extracts intact. |

### French and Japanese wording table

All seven rows were applied:

- custom Cloud Logging formatter;
- identification only (no fix claimed) for the CDI scope;
- APIのバージョニング;
- aligned leadership wording;
- explicit "does not collect telemetry";
- Pockito descriptions in French and Japanese.

Also added:

- 職務経歴書 with an as-of date, and 職務要約;
- "マンデート（委任）管理", which keeps the original term while its meaning is unconfirmed;
- the original foreign degree wording, "Diplôme d'ingénieur（エンジニア学位）…専攻";
- consistent language levels.

### Search and AI discovery (local build)

| Check | Result |
| --- | --- |
| Initial HTML without JavaScript | Script, style and noscript were excluded. Every achievement, role, company-project outcome, featured-project outcome and About paragraph is present as text in `/`, `/fr` and `/ja` (about 11.1k, 12.8k and 7.1k characters). Additional achievements sit in native `<details>`, which works without JavaScript. |
| Title and description | Localized, for example "Ghassen Bargougui \| Application Engineer — Java & Cloud Platforms". The description states the official title and employer. |
| Canonical, hreflang, Open Graph | Canonical per route; en/fr/ja/x-default alternates; `og:url` and `og:locale` are correct. |
| JSON-LD | `ProfilePage` with `mainEntity` `Person`: official job title, current employer, LinkedIn and GitHub `sameAs`, education, certification and highlighted skills. Everything is a visible fact; no ratings or awards. |
| Language hyperlinks | Plain `<a hreflang>` links in the footer to `/`, `/fr` and `/ja`, with `aria-current` on the active language. |
| Sitemap and robots | XML sitemap with alternates; robots names it. Both are unchanged. |

### Independent repeat audit

A separate subagent repeated the audit read-only. It checked:

- all PDFs with 6 extractors, fonts, tags and rendered pages;
- the HTML of all routes;
- the data in every language;
- live link destinations, the npm registry and repository licences.

It found no constraint violations: no new titles, percentages, agent-application content or JLPT claim. The phone number, the three countries and the absence of any study schedule were all preserved.

Its follow-up items:

| Item | Action |
| --- | --- |
| Website VERMEG heading still paired the promoted title with the full tenure (medium) | Fixed: the card is headed by the employer, each title shows its own dates, and the range under the heading is the overall tenure. |
| JP company-project list split across pages (medium) | Fixed: the list is kept together. |
| English profile sentence lacked a subject (medium) | Fixed: "my work spans". |
| Mixed tense; "Took responsibility for…" | Fixed. |
| French wording: pipeline, ownership, Keycloak/rollback, category name, SalesFlow role | Fixed. |
| French typography | Fixed (see [ATS findings](#ats-findings-from-the-actual-files)). |
| Japanese wording | Partly applied:<br>• Applied: location order "福岡（日本）", degree wording, "社内向け銀行業務アプリケーション".<br>• Not applied: "楽天カード（Rakuten Card）" headings, because employer names are shared across languages and that depends on [Limitations](#remaining-limitations) item 2. |
| JP line breaks inside product names | Fixed with no-wrap spans; the extracted text is unchanged (no NBSP substitution). |
| Inconsistent English month abbreviations | Fixed: "Sep 2019 – Jul 2023". |
| Open-source label copy | Fixed: "Open-source projects are labelled." |
| Stale build | Fixed: everything was regenerated after the final edits. |
| Page balance (EN page 2 has about 120 pt free) | Partly applied: the two-page limit and readable size take priority, and page 1 is full by design. |
| Shortened credential link | Not changed. It resolves to Oracle CertView; switching to the long Oracle URL is your choice. |

## Verification record (final state)

| Check | Result |
| --- | --- |
| `npm run validate` | Unit tests: **62 passed in 8 files**. `nuxt typecheck` (strict): clean. `nuxt generate`: 8 routes prerendered. |
| PDF generation | `npm run resume:pdf`: 3 PDFs, 2 pages each, tagged. Japanese has no Type 3 fonts. Built-site copies and the compatibility alias are byte-identical to the generated files. |
| PDF text | Poppler (default, `-layout`, `-raw`), pypdf, pdfminer.six and PyMuPDF found:<br>• contact details: phone, email, site, LinkedIn, GitHub;<br>• every date range;<br>• confirmed keywords;<br>• 0 radicals and 0 U+FFFD. |
| PDF visuals | All 6 pages rendered with `pdftoppm` and inspected. |
| Website | Desktop and 375 px phone checks in the browser:<br>• no horizontal overflow;<br>• the disclosure opens and closes with a click and is natively keyboard-focusable;<br>• no console or CSP errors on the containerized site. |
| Container | Repository `Dockerfile` built with Podman 5.7.1; `nginx -t` passed. Responses:<br>• `/`, `/fr`, `/ja`, `robots.txt`, `sitemap.xml` (`text/xml`), 3 PDFs and the alias: all 200;<br>• `/fr/`: 200 with no redirect;<br>• unknown path: 404.<br>Served PDFs match the local SHA-256 hashes. Security and cache headers are present. |

## Local readiness versus production

**Local:** ready. The repository, generated site, PDFs and container image reflect every change above.

**Production:** not updated.

- On 3 October 2026, `https://ghassen.io/` served the old page title, and `/fr` and `/ja` returned **301 to `http://ghassen.io/fr/` and `/ja/`**: an HTTPS-to-HTTP downgrade plus a trailing slash, contrary to the canonical URLs.
- The repository's Nginx config serves `/fr` directly. Check the deployed config or ingress after release.

**After deploying:**

1. Confirm that `/fr` and `/ja` return 200 over HTTPS.
2. Inspect the three URLs in Search Console URL Inspection.
3. Resubmit the sitemap.
4. Refresh the PDFs on any mounted volume. The Kubernetes example mounts them from a persistent volume, and the Compose file mounts `public/` copies.

Updating the mounted JSON alone does not change the crawler-visible HTML; rebuild the image.

## Remaining limitations

1. **Internal agent application:** omitted until disclosure and delivery stage are confirmed. Draft wording for when they are: *"Contribute to an internal agent application across Kubernetes infrastructure and Java API development, including Redis-backed session management, service-to-service integration, and LLM API calls."* Use "developing" until deployment is confirmed.
2. **Employer naming:** headings and `worksFor` say "Rakuten Card", while LinkedIn uses the Rakuten company page. Confirm the contracting entity if it matters for background checks.
3. **Unconfirmed details:**
   - project dates for Orbit Ways, Solife Digital & Generali Portal, and Magikforms;
   - the banking meaning of "mandate" in Japanese;
   - the Pockito idempotency and authorization bullets.
4. **No measured impact:** none is stated. Add a number only with a defined measurement (component, metric, workload, before/after).
5. **Translation review:** French and Japanese have had no native-speaker or recruiter review.
6. **Generation-dependent output:** the Japanese PDF's as-of date is the generation date, so each regeneration changes the file. English and French rely on Arial (Liberation Sans on Linux); the generator's page check catches overflow caused by metric differences.
7. **ATS scope:** extraction preflight only. No proprietary ATS, Greenhouse, Workday or Lever upload, and no ranking or citation result, was tested or is claimed.
