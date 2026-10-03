# Resume review and release readiness

Reviewed against the user's current LinkedIn profile in their signed-in Chrome session on 3 October 2026, the existing resume, and the local personal-project repositories. The user's explicit corrections take precedence.

## Content decisions

- Seven years of professional experience, beginning October 2019, across **three** countries: Tunisia, Luxembourg, and Japan.
- Rakuten: official title **Application Engineer**. The resume names Rakuten Card to identify the business whose systems the user works on; LinkedIn uses the Rakuten company page and explicitly describes Rakuten Card responsibilities.
- Migration leadership is shared with the user's manager and project manager and requires coordination across teams. The resume does not imply sole leadership or use company-wide card/member totals as personal impact.
- Sogeti: **Software Engineer**, on assignment at BGL BNP Paribas, February-November 2025.
- CBTW: **Java Full-Stack Engineer**, September 2024-January 2025, matching LinkedIn.
- VERMEG: **Analyst Developer**, January 2023-August 2024, following **Software Developer**, October 2019-December 2022. Both titles are shown with their own date ranges on the website and in the PDFs (`roles` in the data).
- ESPRIT: software architecture engineering, September 2019-July 2023; ISIMM: computer science, September 2015-June 2019. No study schedule is disclosed.
- Oracle Java SE 11 certification: September 2022. Japanese is described as basic; no JLPT qualification is claimed.
- The public PDFs include the phone number with the user's approval.
- The early Proxym internship and older student project are intentionally omitted from this focused seven-year resume. LinkedIn may retain the longer history.
- Employer percentage claims (API response time, ActiveMQ efficiency, PackManager execution time, manual processes) were replaced with qualitative outcomes on 3 October 2026 because their measurement basis was not established. Reintroduce a number only with a defined measurement. Removed unsupported personal-project benchmarks and counts.
- Rakuten work now includes the confirmed performance testing (k6/JMeter), Cloud Logging and Kafka/Confluent logging, and application/infrastructure design. The internal agent application is intentionally omitted until its disclosure and delivery stage are confirmed.

## Presentation

Experience precedes Skills. There are 39 skills in seven groups ordered by emphasis (Java application engineering, cloud delivery, performance/observability first). Slide Agent, Pockito, and SubMate are featured; Orbit Ways and Traffic Forward are compact personal entries. TermLoom and the Rust skill are removed. Client projects remain attached to the appropriate employment entries, with expandable details; additional achievements use a native disclosure so they are present in the initial HTML.

The English, French, and Japanese PDFs use the same structured data and contain two pages each. Each entry's `pdf` selection names the bullets and company projects the PDF prints (no positional truncation). Skills are printed one category per line, and each title shares one line with its employer and dates. The old PDF URL remains an English compatibility alias. Generated text is selectable, links print their destinations, and the PDFs are tagged. The generator also updates the share image without stale location or availability claims.

## Reproduce

```sh
npm ci
npx playwright install chromium
npm run resume:pdf
npm run validate
```

`resume:pdf` uses Chromium for font shaping and PDF export. The Japanese PDF uses the bundled Noto Sans JP subsets in `scripts/fonts/` (see its README): system Japanese fonts were embedded as Type 3 fonts and produced Kangxi-radical text such as `⽇` for `日`. The generator fails if a CV exceeds two pages or the Japanese CV contains a Type 3 font. Inspect the PDFs with Poppler and render them with `pdftoppm` when updating the content. Author the PDFs before `generate` so the published output includes their latest versions.

Use `npm run dev` for editing. Run the generated site through the provided Nginx configuration for final header, caching, CSP, and 404 checks. Do not rebuild `.nuxt` while relying on a running Nuxt development server.

## Static delivery and deployment

- `/`, `/fr`, and `/ja` contain the resume in generated HTML with canonical and language-alternate metadata; the root keeps automatic browser-language selection after hydration.
- Browser visitors refresh runtime-mounted JSON after hydration; crawlers and users without JavaScript see the build-time content. Rebuild after content changes when crawler-visible content or the share image must change.
- All CV buttons resolve through `cvLinks` in `public/cv-config.json`, falling back to the legacy `cvLink` for older configurations.
- The Docker image includes the translated PDFs. Compose and Kubernetes examples support mounting all three PDFs plus the compatibility alias. The Kubernetes PDF example uses a persistent volume because the full PDF set exceeds the 1 MiB ConfigMap limit; populate the referenced claim before applying that example.
- Nginx applies security headers and cache rules to HTML, JSON, PDFs, assets, and errors. Unknown paths return a meaningful 404. TLS terminates at the hosting ingress; configure HSTS there for the HTTPS domain.
- EmailJS code, dependency, and runtime-config generation were removed. Remove obsolete deployment environment variables and disable the old EmailJS template in the account as a separate operational action; repository changes cannot revoke previously exposed identifiers.
- The browser language override is in-session. Direct `/fr` or `/ja` visits use that URL's language.

## LinkedIn follow-up

The website has been compared with LinkedIn. The LinkedIn headline still contains the spelling **MicroProfie**; correct it to **MicroProfile** when editing that profile. The resume deliberately adds personal projects beyond LinkedIn's shorter list. No external LinkedIn edits were made.

## Verification record

The 3 October 2026 content, ATS and discovery follow-up is recorded in [content-search-ats-audit-closure.md](content-search-ats-audit-closure.md). The record below predates it.


On 3 October 2026, `npm run validate` passed: **49 tests in seven files**, strict TypeScript checking, and static generation. An independent subagent reviewed the completed implementation and all six PDF pages. Its Japanese-route alias finding was fixed and covered by a regression test; its final review reported no outstanding findings.

| Area | Findings and completed changes | Verification and limits |
| --- | --- | --- |
| Resume accuracy | Reconciled titles, dates, education, countries, language proficiency, and shared migration leadership. Removed company-wide scale claims and speculative project benchmarks. | Compared with signed-in LinkedIn and user corrections. Employer impact percentages remain user-provided claims; underlying measurements were not independently audited. |
| Recruiter readability | Experience comes first; company work is attached to jobs. Three personal products are prominent, with two smaller side projects. Skills have seven groups. | Desktop and phone inspection; employer projects and additional achievements expand correctly. |
| Translation | English, French, and Japanese content, dates, interface labels, and PDF links align. `ja` routes normalize to the `jp` dataset. | Direct language routes, manual switching, and the alias regression checked. Translation accuracy has not had an independent native-speaker review. |
| PDFs | Three matching, selectable-text, two-page resumes with clickable links and approved public phone number. | All six rendered pages visually inspected for clipping, missing glyphs, and page balance. Generated files match static-build copies. |
| Responsive design | Removed the scroll hint that overlapped the phone hero. Featured cards and compact side projects adapt to narrow screens. | Phone viewport 375 × 812 and desktop 1280 × 900 inspected; phone content width equals viewport width, with no horizontal overflow. |
| Accessibility | Keyboard language menu, focus return, mobile menu focus handling, named links, expanded-state attributes, readable light-theme colors, and reduced-motion styles. | Keyboard and expansion interactions checked. This is a practical review, not a formal WCAG certification or a complete assistive-technology survey. |
| Search and sharing | Resume content is in initial HTML on all three routes; canonical URLs, language alternates, sitemap, robots, and refreshed share image are present. | Generated HTML inspected. Indexing and social-platform cache refresh require the deployed site. |
| Runtime reliability | Runtime JSON refresh preserves the static initial view; failures have a fallback. Unknown paths return a genuine 404. | Unit coverage, generated route checks, and local Nginx responses. No hydration or CSP errors observed during browser checks. |
| Links and contact | Project, repository, credential, email, and download destinations are clear; no private Pockito repository is advertised. | Public web destinations checked for successful responses; email delivery itself was not tested. |
| Performance | Static HTML provides content before JavaScript; static assets use caching. Share image is approximately 48 KiB. | Build inspected. Largest client JavaScript chunks are approximately 134 and 76 KiB gzip. No claim of measured production Core Web Vitals; fonts and analytics still involve external services. |
| Security and dependencies | Removed obsolete EmailJS integration; added Nginx response headers and CSP. Applied compatible dependency patches. | Production dependency audit: zero vulnerabilities. Full audit: 11 high advisories in development tooling, rooted in `braces` and `node-forge`, with no available patched range in the audited registry. |
| Delivery | Static artifacts, translated-PDF mounts, cache rules, and persistent-volume PDF example align. | The repository Dockerfile built successfully. The resulting image passed Nginx syntax checks; all three language routes and four PDF URLs returned 200, PDFs matched source hashes, and an unknown path returned 404. Headers and cache rules were checked on HTML, JSON, PDFs, sitemap, and errors. Actual hosting, ingress TLS/HSTS, volume provisioning, and production rollout remain environment-specific. |

The published site serves static assets through Nginx and contains no Node.js application server. Recheck the development-tool advisories before changing development-server exposure or accepting untrusted build inputs. Verify the actual deployment after publishing; local readiness does not mean production has been updated.
