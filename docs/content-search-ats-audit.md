# Resume content, recruitment, ATS, and discovery audit

Reviewed 3 October 2026. This is an editorial audit with proposed changes, not a claim that the present resume passes every hiring system. The website content and PDFs have not been changed by this audit.

## Overall assessment

The resume is credible and has useful evidence. Its strongest story is broader than the current opening suggests: **an Application Engineer who connects Java application development, cloud/platform implementation, performance diagnosis, and operational delivery**. Personal products add evidence of end-to-end ownership and developer tooling.

The main weaknesses are evidence selection, vague impact statements, and uneven availability of the same facts across website, PDF, and crawler-visible HTML. These matter more than adding fashionable keywords.

| Audience | Assessment | Main improvement |
| --- | --- | --- |
| Recruiter / HR | Clear career history and relevant financial-services experience; current title alone undersells functional breadth. | Add a functional descriptor and a shorter, more focused summary. |
| Technical interviewer | Concrete upgrade, pipeline, and Kubernetes details are useful; several older bullets sound generic. | Show diagnosis, engineering decisions, and bounded ownership. |
| ATS text extraction | English/French extraction is broadly coherent. Japanese text is present but dates and mixed-script reading order vary by extractor. | Reduce title/date ambiguity, linearize skills, and address Japanese reading-order/Unicode differences. |
| ATS selection / screening | Cannot be judged against an unspecified job, employer rules, or inaccessible scoring model. | Tailor evidence to the actual job description and answer application questions accurately. |
| Search / AI retrieval: local update | Main content is in initial HTML, with language metadata and a valid sitemap. | Include all important achievements in the HTML body, not just the client payload. |
| Search / AI retrieval: live site | The live site still serves the older JavaScript page shell. | Deploy the reviewed update before expecting its content to be discovered. |

## Evidence and limits

Reviewed the three resume JSON files, interface copy, PDF generation logic, generated HTML, actual PDF text, and live HTTP responses. Used normal, layout-preserving, and raw PDF text extraction. Also reviewed relevant personal-project documentation and accessible earlier project conversations. Four independent subagents reviewed recruitment wording, translation, crawlability, and ATS extraction.

The user's clarification during this audit establishes additional Rakuten responsibilities: hybrid-cloud architecture and implementation; Kubernetes, deployments and pipelines; Cloud Logging compatibility; moving application/trace logging from files toward Kafka/Confluent; k6/JMeter performance testing and bottleneck remedies; and involvement in a Java agent application with Redis sessions, service-to-service APIs and LLM calls. These facts are not all reflected in the current resume. Internal application disclosure and delivery stage need confirmation before public wording is finalized. Streaming/socket implementation was not established.

Previous conversations and project documentation support personal-project ownership and capabilities. They do not establish unmentioned employer accomplishments, adoption, revenue, team size, or measured gains. No proprietary ATS was used, and the CV was not uploaded to a third-party scoring service. A public search result check cannot establish whether every URL is indexed; Search Console and crawler logs were not available.

## Priority findings

### 1. Make the professional identity easier to recognize

**Priority: high.** “Application Engineer” is the correct official title. Alone, it does not explain the kind of engineering you perform. Preserve it in employment history, and add a functional descriptor near the opening:

> Application Engineer | Java Applications, Cloud & Platform Engineering

This describes the work without claiming an official Platform Engineer, SRE, architect, manager, or AI researcher title. Full-stack experience remains valuable supporting context. Avoid presenting every technology as an equally strong specialization.

Suggested website opening:

> I build and modernize Java applications and the cloud platforms they run on. At Rakuten Card's Technology Incubation Team, my work spans hybrid-cloud migration, Kubernetes deployments, API development, performance testing, and application observability.

Suggested PDF profile:

> Application Engineer with seven years of Java and full-stack experience across banking, insurance, and card payments in Tunisia, Luxembourg, and Japan. At Rakuten Card's Technology Incubation Team, work spans hybrid-cloud migration, Kubernetes delivery, API development, performance testing, and observability. Creator of Slide Agent, Pockito, and SubMate.

The PDF profile currently repeats product descriptions and all four language levels that appear later. Removing that duplication creates room for stronger professional evidence. The website can retain a conversational first-person voice; concise action-led PDF bullets are an editorial preference, not an ATS requirement.

### 2. Add the newly clarified performance and observability work

**Priority: high.** k6, JMeter, and Confluent are absent from the current resume. The current logging bullet describes JSON formatting but does not capture the delivery changes you explained. Suggested bullets, based on your clarification:

> Run performance tests with k6 and JMeter, diagnose bottlenecks, and address them through application-design changes and resource adjustments.

> Modify application logging for Cloud Logging and help migrate file-based application and trace logs to Kafka/Confluent.

The second bullet deliberately avoids claiming that Cloud Logging and Kafka form one specific pipeline. Confirm the relationship before explaining the architecture in more detail. “Trace logs” does not establish distributed tracing, OpenTelemetry, or ownership of an observability platform.

Keep the existing concrete troubleshooting example, including the Kafka/CDI bean-scope diagnosis, where it is public-safe. That demonstrates investigation and technical judgment more clearly than “focusing on security and performance.” A useful future addition would be one bounded example: affected component, observed bottleneck, chosen remedy, and verified result. Do not invent latency, throughput, percentile, or cost figures.

### 3. Represent shared leadership naturally

**Priority: medium.** The present wording is honest but “with my manager and project manager” makes the reporting arrangement more prominent than your contribution.

Suggested role description:

> Work across application development and cloud/platform engineering in the Technology Incubation Team, helping lead hybrid-cloud migration with the project leadership team and coordinating implementation with development, infrastructure, CI/CD, and security teams.

The project leadership arrangement includes the user, manager and PM; the migration involves many other teams. Avoid “led Rakuten's cloud transformation,” which is much broader than the established scope.

### 4. The internal agent application is potentially valuable professional evidence

**Priority: high if disclosure is permitted.** This could connect your professional role to the AI tooling already shown by your personal projects.

Public-safe candidate wording, subject to disclosure and stage confirmation:

> Contribute to an internal agent application across Kubernetes infrastructure and Java API development, including Redis-backed session management, service-to-service integration, and LLM API calls.

Use “developing” for ongoing implementation. Use a deployed outcome only if deployment is confirmed. Do not publish the internal name from the voice transcription without confirmation. Do not add RAG, model training, autonomous decision-making, streaming, WebSockets, production adoption, or business impact unless established.

### 5. Replace automatic truncation with intentional PDF evidence selection

**Priority: high.** The generator takes the first three achievements for each job and first two outcomes for each featured project. It makes a neat two-page PDF, but the choice of evidence is arbitrary.

Confirmed omissions:

| Item | Present on website/source, absent from PDF | Why it matters |
| --- | --- | --- |
| Rakuten | Structured logging; deployment/connectivity troubleshooting; Kafka/CDI diagnosis; cross-team coordination | Demonstrates operational engineering and delivery judgment. |
| VERMEG | UML/sequence diagrams; cross-team design clarification; Keycloak access control; CI/CD/rollback | Supports design ownership and application security. |
| Slide Agent | Published package, CLI, library API and MCP server; CSV template filling | Demonstrates shipped developer tooling, not just a rendering engine. |
| Pockito | Kubernetes deployment/rollback, tests and release checks | Demonstrates delivery ownership. |
| SubMate | Optional cloud providers, four-language interface and RTL | Distinguishes integration work and makes “on-device by default” easier to interpret. |

For the current role, allocate space across **application modernization**, **cloud delivery**, and **performance/observability**. Keep four concise bullets if necessary; three is not an inherent quality rule. Preserve the e-Navi upgrade as specific engineering evidence. Select project bullets by relevance rather than source-array position. A short profile and removal of duplicate task descriptions can recover space without making the type smaller.

### 6. Percentage claims need defined measurements

**Priority: high.** Current claims include 50% API response-time reduction, 40% ActiveMQ processing efficiency, 35% PackManager execution-time reduction, and 30% fewer manual processes. They may be valid, but the wording does not establish what was measured. The previous “kind of yes” answer did not resolve the distinction between throughput, duration, and efficiency.

| Claim | Clarification needed | Safe fallback when unavailable |
| --- | --- | --- |
| 50% response time | Which API/workflow, comparable workload, average/percentile or another measure? | “Improved API response times through query optimization and caching.” |
| 40% efficiency | Duration, records per interval, resource use, or manual effort? | “Automated bulk-processing workflows with ActiveMQ.” |
| 35% execution time | Which operation/job, measurement boundary, before/after conditions? | “Profiled Java execution and memory usage with JProfiler and optimized the identified bottlenecks.” |
| 30% manual processes | Fewer steps, hours of effort, cases requiring intervention, or another quantity? | “Migrated insurance workflows to Camunda BPM to reduce manual processing.” |

Retain a number when you can explain its basis in an interview. Do not convert one kind of improvement into another. The 40% claim is also repeated in a job and a project; these are the same evidence, not separate gains. The large 50% highlight deserves particularly clear scope. Company-wide member/card counts remain unnecessary for demonstrating your own impact.

### 7. Give VERMEG's promotion its own title/date lines

**Priority: high for factual interpretation and parsing.** The heading currently associates “Analyst Developer” with October 2019-August 2024, although the description says that title began January 2023. The paragraph corrects the chronology for a careful reader, but a parser may associate the whole range with the top title.

Recommended structure under one employer:

> VERMEG — Tunis, Tunisia  
> Analyst Developer | Jan 2023-Aug 2024  
> Software Developer | Oct 2019-Dec 2022

Keep the total tenure if useful, but make both role intervals independently clear. Put relevant achievements beneath the appropriate role where attribution is known. This is preferable to changing the official titles to sound more senior.

### 8. Tighten generic and duplicate wording

**Priority: medium.** The resume repeatedly says “I developed,” “enterprise applications,” “focusing on security and performance,” and “requirements.” Some repetition is normal; the problem is that a few statements communicate little beyond the technology list.

| Current wording | Suggested replacement | Reason |
| --- | --- | --- |
| Sogeti “on mission at BGL BNP Paribas” | “Sogeti — client assignment at BGL BNP Paribas” | More natural English and clearer employer/client distinction. |
| “within an Agile tribe and squad” | Remove, unless collaboration responsibilities are substantive | The delivery model is less useful than what you delivered. |
| CBTW description and first bullet both say developed enterprise applications with the same stack | Keep one concise description; use the bullet for refactoring/integration work | Recovers space and avoids repeating the same evidence. |
| “with attention to versioning, security, and documentation” | State the actual API/design responsibility, using the confirmed work | Aspirational wording does not show what changed. |
| “I owned core backend components” | Name the component/domain or qualify responsibility where public-safe | Ownership becomes credible through scope. |
| “Engineer's Degree in Software Architecture Engineering” | “Engineering Degree — Software Architecture,” subject to diploma wording | Reduces tautology without inventing a master's equivalence. |
| “Advanced, Fluent” / “Beginner, Basic Proficiency” | “Fluent” / “Basic” | Less redundant; no unsupported CEFR or JLPT conversion. |

Keep specific Spring Batch/mandate management, query optimization, Camunda, authentication, and deployment evidence. Proprietary project-name lists without outcomes add less value than a relevant accomplishment. An internship is optional supporting history, not necessary to fill an apparent gap in the current chronology.

### 9. Improve personal-project evidence without turning the CV into marketing

**Priority: medium.** Keep Slide Agent, Pockito and SubMate. They demonstrate different engineering capabilities. On the broad website, the existing order is reasonable. In an application emphasizing Java/cloud work, Pockito may deserve the first slot. For developer tooling, Slide Agent should lead.

Suggested concise summaries:

- **Slide Agent:** “Open-source engine and MCP tooling for generating editable PowerPoint presentations with native charts and layout validation.” Include package/CLI distribution among the PDF bullets. Avoid making every font/schema detail equally prominent.
- **Pockito:** “Personal and shared finance platform with Flutter and web clients, backed by Java services and REST/MCP interfaces.” Stronger than an abstract “shared domain service” opening. One architectural decision or financial-data correctness example is useful underneath.
- **SubMate:** “Chrome extension for synchronized subtitle translation, using on-device translation by default and optional cloud providers.” Keep supported platforms in the website detail. This preserves the distinction between a backend-free default and optional external translation.
- **Traffic Forward:** “Spring Boot HTTP forwarding tool with configurable routing and request/response diagnostics.” Keep it compact, as requested.
- **Orbit Ways:** Keep on the website; optional in a tailored application PDF. Its strongest engineering detail is real-time state/WebSocket work, not simply “playable.”

The featured group includes a private product, so “Personal & open-source” should not imply every entry is open source. “Selected personal projects” with individual open-source labels is clearer. “From idea to production” also needs project-specific release status; a working site or prototype does not establish a production release for every component. Add dates to PDF project entries, which currently omit the source's periods.

### 10. There is stronger Pockito evidence available than a longer framework list

**Priority: medium; optional replacement evidence.** Accessible project documentation describes financial-data correctness and permission boundaries that the current resume does not explain: idempotent create operations, version checks against stale updates, and capability-based authorization shared across REST/MCP integrations. These are potentially valuable examples for Java/platform interviews.

Candidate bullet grounded in the local API documentation:

> Implemented idempotency keys for create-request retries and version checks that reject stale updates.

Candidate bullet grounded in the architecture/MCP documentation:

> Applied shared authorization rules across REST and MCP interfaces, with integration revocation enforced on the request path.

These are candidates for your confirmation of personal contribution and release status, not independently measured production outcomes. They are more informative than adding every database or framework from an old toolbox. Earlier project audit discussions corroborate work on these mechanisms but also contain unfinished release tasks; avoid inferring an app-store release or production hardening claim from those discussions.

### 11. Prioritize skills supported by your actual work

**Priority: medium.** The existing skills are relevant, but the flat breadth can obscure your strengths. Use three emphasis levels without numerical proficiency ratings:

1. Java application engineering: Java, Spring Boot, Helidon/MicroProfile, REST APIs, SQL/PostgreSQL/Oracle, Redis.
2. Cloud delivery and application reliability: Kubernetes/GKE, GCP, Docker, GitHub Actions/Jenkins, CI/CD, Kafka/Confluent, Cloud Logging, k6/JMeter.
3. Supporting full-stack and product work: Angular, TypeScript, Vue/Nuxt, Flutter, MCP/LLM integration, testing/security tools.

SQL, Maven, CI/CD, and application/system design have support in the existing work descriptions. k6/JMeter and Confluent have support in the new user clarification. Choose what fits the application instead of expanding the 34-skill list indefinitely. Expand acronyms once where helpful: Google Cloud Platform (GCP), Google Kubernetes Engine (GKE), Model Context Protocol (MCP), continuous integration and delivery (CI/CD). Avoid AWS, Azure, Terraform, OpenTelemetry, RAG or model training additions without actual evidence.

## ATS findings from the actual files

All PDFs have two pages, selectable text, no encryption, and recoverable contact information. File sizes are 283,684 bytes (English), 288,763 (French), and 704,483 (Japanese). Poppler extraction found no replacement-character errors, which alone does not establish reliable field association. English extraction contains about 915 whitespace-delimited words; the same count is not meaningful for Japanese. English/French job titles and dates extract coherently. Standard professional experience, technical skills, education/certification, and language sections are present.

There are avoidable ambiguities:

- The skills use two columns. Normal extraction changes category order, while layout extraction places categories alongside each other. The keywords survive, so this is **not evidence of a complete parse failure**. A single reading column is the lower-risk application format.
- Japanese normal/layout extraction separates `2025年12月 - 現在` into fragments such as `年 月 - 現在` and `2025 12`. Sogeti employer text also changes reading position. Raw extraction preserves the intended sequence. This is a reproduced extraction issue, not a proven error in a particular ATS. Review mixed-font date/title rows and use a linear layout.
- An independent Python extractor returns 70 Japanese compatibility radicals, including `⽇本` instead of `日本`; NFKC normalization restores those characters. They look similar but are different Unicode strings. Some consumers normalize them and some may not. Review font/export choices and test another independent extraction method before claiming Japanese keyword matching is reliable.
- VERMEG's promoted title is associated visually with the full company tenure; give each role its own dates.
- Personal-project dates are not printed. Add them and retain the clear “Personal projects” heading so these roles are less likely to be mistaken for employers.
- GitHub links on featured projects are labelled “Source.” The annotations work, but a plain-text extraction does not carry the repository URL. The PDF also omits the certification link. Print meaningful destination text if source/credential access is important.
- The PDF is not tagged. That is relevant to semantic reading/accessibility, but it is not proof that an ATS cannot read its text. Regeneration can improve tagging and reading order, followed by another extraction check.
- The main body is 9.1 pt in English/French and 8.7 pt in Japanese. This saves space but makes the application dense. Aim for more readable body text by cutting repetition, rather than claiming a particular font size changes ATS ranking.
- Name/contact information are in ordinary extracted page text. The HTML `<header>` used by the generator is not, by itself, proof that contact information sits in an inaccessible PDF running header.

[Greenhouse's parser documentation](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse) identifies columned layouts and complex formatting as possible parsing problems and has a 2.5 MB parser limit. These files are below that limit. Vendor behavior varies; ordinary text extraction is a useful preflight, not an actual Greenhouse/Workday/Lever acceptance test.

Parsing, relevance matching, and application rules are separate. Some systems can auto-reject based on an application answer; [Greenhouse documents this explicitly](https://support.greenhouse.io/hc/en-us/articles/360000653472-Auto-reject). A CV rewrite cannot remove an employer's location, language, work-authorization, or other genuine requirement. Do not add visa status, notice period, relocation, or JLPT claims without confirmation. Tailor the emphasis and terminology to a real job description while retaining the same facts and official titles. There is no defensible universal “ATS score” for this resume.

## French and Japanese professional wording

The translations preserve all four employers, six company projects, five personal projects, 34 skills, and the source's titles/dates/percentage values. There are no missing source entries. Several phrases nevertheless deserve correction or clarification:

| Wording | Issue | Suggested wording |
| --- | --- | --- |
| FR logging: “un formateur compatible avec Cloud Logging” | Ambiguous as a standalone professional sentence and omits “custom.” | “un composant de formatage personnalisé compatible avec Cloud Logging” |
| JP Kafka diagnosis: “特定・修正しました” | Adds a specific repair where the English only establishes identifying the cause. | “CDI Beanのスコープ設定の誤りを特定しました”; retain “修正” only if that repair is confirmed. |
| JP API work: “バージョン管理” | Can mean source-code version control rather than API versioning. | “APIのバージョニング” |
| FR migration: “je copilote” versus EN “I help lead” | Different strength of leadership wording; shared leadership is supported by the user. | Align the intended level across languages, e.g. “Je contribue au pilotage… aux côtés de mon responsable et du chef de projet.” |
| JP SubMate: telemetry collection “不要” | Says unnecessary rather than clearly saying it does not occur. | “利用状況データ（テレメトリー）を収集しません”, scoped to SubMate and accompanied by the optional-cloud explanation. |
| FR Pockito: “Gestion d’argent personnelle et partagée” | Awkward product description. | “Application de gestion des finances personnelles et partagées…” |
| JP Pockito: “資金管理” | May suggest treasury management beyond the product's scope. | “個人のお金や共同の支出を管理するアプリ” |

Use a functional descriptor alongside the official title, for example **Ingénierie applicative Java et plateformes cloud** / **Javaアプリケーション・クラウド基盤開発**. These describe the work rather than changing the contractual title.

Suggested current-role summaries:

> FR: Application Engineer au sein de la Technology Incubation Team de Rakuten Card, j’interviens sur la conception applicative, l’infrastructure cloud, les déploiements Kubernetes et les pipelines CI/CD. Mon expérience couvre également le développement backend Java, l’observabilité et le diagnostic de performances.

> JP: 楽天カードのTechnology Incubation TeamでApplication Engineerとして、アプリケーション設計、クラウド基盤、Kubernetesによるデプロイ、CI/CDパイプラインの整備に携わっています。Javaバックエンド開発に加え、可観測性の改善や性能ボトルネックの調査にも取り組んでいます。

Keep canonical technology names and expand important acronyms once. Optional local glosses can clarify official English titles. Make language proficiency consistent between the profile and language section; do not add CEFR/JLPT equivalence. Japanese “委任管理” needs the banking meaning confirmed before choosing a more specific translation: payment mandates and customer/account authority are different concepts.

For a Japanese application document, consider **職務経歴書** as the document title, **職務要約** for the summary, and an “as of” date. Prioritize responsibilities, technologies, contributions and outcomes. A Western two-page layout is not automatically invalid: [Hello Work guidance](https://jsite.mhlw.go.jp/tokyo-hellowork/content/contents/002594022.pdf) describes a flexible format and the document's purpose. Supply a separate 履歴書 when the employer requests one. Preserve the original foreign degree wording without asserting Japanese equivalence.

This review is not a native-recruiter or certified-translator sign-off. A native reviewer would be particularly useful for Japanese banking terminology, degree wording, and the final French/Japanese register after the factual revisions.

## Search engines and AI agents

### Observed local-versus-live content

| Check | Local reviewed update | Live `https://ghassen.io` at audit time |
| --- | --- | --- |
| Initial body text excluding scripts/styles | About 10,013 EN, 11,445 FR and 6,214 JA characters, using the same parser | About 553 characters on each tested route |
| Rakuten / Slide Agent in initial text | Present in English body | Not present in tested body |
| `/`, `/fr`, `/ja` | Substantial localized content | Same older English page shell in initial responses |
| Canonical and language alternates | Present | Canonical absent from tested responses |
| `/sitemap.xml` | XML sitemap | HTML page fallback with HTTP 200 |
| `robots.txt` | Allows crawling and names sitemap | Allows crawling; no sitemap reference |
| Profile JSON-LD | Absent | Absent from inspected responses |

These are HTTP observations, not proof that Google never renders or indexes the live site. Google can process JavaScript, whereas a basic fetch-based agent may receive only the shell. The reviewed local update must be deployed before its improvements can affect public discovery. Updating runtime-mounted JSON alone will not refresh crawler-visible build-time HTML.

### High-priority content exposure gap

The website's extra job achievements are generated only after “Show all achievements” is activated. Initial body text excludes Rakuten's logging, connectivity/CDI troubleshooting, and cross-team coordination bullets, and VERMEG's design-documentation and Keycloak/CI/CD bullets. Those facts occur in the serialized client data, but an ordinary HTML-text extractor does not retrieve them as resume prose.

Render important achievements in the initial body even when the interface initially collapses them. Native expandable details can preserve a short reading experience while keeping the content in HTML. The existing company-project details already do this. Do not create hidden keyword lists or a separate inflated bot-only resume. The same real accomplishments should be available to people and machines.

[Google's loading guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading) states that its crawler does not interact with the page to load content. A button requiring a click is therefore an inappropriate primary mechanism for exposing important resume evidence.

Compact side-project outcomes and technology lists are also not in the initial body, by design. That is a lower-priority tradeoff: their short descriptions remain available, and not every detail needs equal prominence. Add one descriptive technical phrase if one of these projects becomes a target-role differentiator.

### Metadata and entity clarity

Suggested English page title:

> Ghassen Bargougui | Java Application & Cloud Engineer

The title is a functional description; official employment titles remain unchanged. Suggested description:

> Application Engineer at Rakuten Card in Japan. Seven years in Java, APIs and financial systems, with Kubernetes delivery, performance testing and AI-enabled products.

Use natural translated equivalents for French/Japanese. There is no guaranteed character-count cutoff or ranking gain. The current name and official title are valid, but a more descriptive title helps people understand the result before opening it.

Optional `ProfilePage`/`Person` JSON-LD can express the same visible identity, profile URL, official title and verified LinkedIn/GitHub links using a stable identifier. It is an entity-clarity improvement, not a ranking prerequisite. [Google's profile guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page) covers pages focused on one affiliated person and requires markup to follow its guidelines. Do not fabricate awards, ratings, seniority, credentials, or current employers in markup.

Clear employment/project labels, dates, acronym expansions, bounded claims and concrete engineering decisions help both human readers and agents summarize the resume accurately. Small public case studies on one migration challenge or product design decision could provide deeper evidence later, with public-safe scope and real outputs. They are optional; the resume does not need a large blog or dozens of query-targeted pages.

Provide ordinary language hyperlinks as well as the interactive switcher. The current language options are buttons: the sitemap/head annotations expose the routes, but an anchor to each route also helps basic agents and visitors without JavaScript reach the translation directly.

### Bots and actual indexing

The permissive robots rules allow compliant crawlers; they do not prove a CDN, WAF or hosting layer will admit a real crawler. **OAI-SearchBot is for ChatGPT search; GPTBot is for training**, with independent controls. Allowing training is not necessary for allowing search. The current catch-all allowance permits both; that is an observation, not a proposal to change the user's policy. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) explains the distinction and published IP ranges.

[Google's current AI-search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) centers ordinary SEO, useful original content, accessible pages and verified indexing. It does not require `llms.txt`, special AI markup, keyword stuffing or tiny content chunks. A maintained plain-text/JSON export could be convenient for a specific integration, but it is not a general discovery requirement. Existing JSON helps an agent that knows its URL; its existence does not mean every crawler finds or understands the schema.

After deployment, verify the three URLs with Search Console's URL Inspection, confirm the sitemap is XML and accepted, inspect the crawled/rendered content, and review crawler logs for real access. Search appearances and AI citations cannot be guaranteed. A user-agent header spoof is not proof of actual bot access.

PDFs themselves can be indexed; [Google lists PDF as an indexable file type](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types). Keep their facts consistent with the page and refresh public files after content changes. If the old English compatibility URL creates unwanted duplicate PDF results, choose a deliberate canonical/indexing policy later; duplication alone does not establish a penalty.

## Recommended next content pass

1. Preserve official titles and introduce the functional application/cloud descriptor.
2. Shorten the profile and move performance/observability evidence into the current role's primary bullets.
3. Finalize public-safe agent-application wording and release-stage language.
4. Resolve or remove undefined percentage claims; show VERMEG's two role intervals explicitly.
5. Curate the PDF evidence intentionally, add project dates, and linearize skills.
6. Tighten generic language, clarify employer/client assignments, and keep personal project descriptions proportional.
7. Make important expanded content part of the initial HTML; add descriptive metadata and optional truthful entity markup.
8. Synchronize French/Japanese after the facts and English emphasis are settled; then extract and inspect all three PDFs again.
9. Deploy and verify public indexing separately. The audit establishes local and live observations, not successful search ranking or a hiring outcome.

The content should communicate **what you built, the decisions you made, the problems you diagnosed, and the scope you actually owned**. Your new examples supply that evidence without needing exaggerated titles or unverified scale.

## Local evidence references

- [English content](/Users/ghassenbrg/git/my-resume/public/cv-data-en.json), [French content](/Users/ghassenbrg/git/my-resume/public/cv-data-fr.json), [Japanese content](/Users/ghassenbrg/git/my-resume/public/cv-data-jp.json).
- [PDF selection/export logic](/Users/ghassenbrg/git/my-resume/scripts/generate-resume.mjs:23) and [initially collapsed achievement logic](/Users/ghassenbrg/git/my-resume/components/sections/ExperienceCard.vue:91).
- [Pockito retry/version semantics](/Users/ghassenbrg/git/pockito/docs/api.md:29) and [integration authorization](/Users/ghassenbrg/git/pockito/docs/architecture.md:209).
- [Slide Agent package/tooling documentation](/Users/ghassenbrg/git/slide-agent/README.md:87).

Reproducible PDF checks use Poppler's `pdftotext` in default, `-layout`, and `-raw` modes, plus `pypdf` extraction and Unicode NFKC comparison. HTTP checks inspect `/`, `/fr`, `/ja`, `/robots.txt` and `/sitemap.xml` on both the local reviewed image and the live domain. A script/style-excluding HTML parser establishes what is present as body text, rather than counting serialized application data as readable resume content.
