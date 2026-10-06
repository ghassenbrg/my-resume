import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { displayUrl, selectPdfContent } from './resume-content.mjs'

// The web resume JSON is also the source for every downloadable CV. Which
// bullets each CV prints is decided by the `pdf` selections in that JSON.
const config = JSON.parse(await readFile('public/cv-config.json', 'utf8'))
const MAX_PAGES = 2
const escape = (value = '') => String(value).replace(/[‐-―]/g, '-').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const labels = {
  en: { summary: 'Profile', experience: 'Professional experience', projects: 'Personal projects', skills: 'Technical skills', education: 'Education, certification & languages', languages: 'Languages', present: 'Present', companyProjects: 'Selected company projects', otherCompanyProjects: 'Other company projects', technologies: 'Technologies', more: 'Other personal projects', verify: 'Oracle CertView', page: 'Page' },
  fr: { summary: 'Profil', experience: 'Expérience professionnelle', projects: 'Projets personnels', skills: 'Compétences techniques', education: 'Formation, certification & langues', languages: 'Langues', present: 'À ce jour', companyProjects: 'Projets d’entreprise sélectionnés', otherCompanyProjects: 'Autres projets d’entreprise', technologies: 'Technologies', more: 'Autres projets personnels', verify: 'Oracle CertView', page: 'Page' },
  jp: { summary: '職務要約', experience: '職務経歴', projects: '個人プロジェクト', skills: '技術スキル', education: '学歴・資格・語学', languages: '言語', present: '現在', companyProjects: '主な業務プロジェクト', otherCompanyProjects: 'その他の業務プロジェクト', technologies: '使用技術', more: 'その他の個人プロジェクト', verify: 'Oracle CertView', page: 'ページ', document: '職務経歴書', asOf: '現在' },
}
const locale = { en: 'en-US', fr: 'fr-FR', jp: 'ja-JP' }
const month = (iso, lang) => new Date(iso + 'T00:00:00Z').toLocaleDateString(locale[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' })
const range = (start, end, lang) => `${month(start, lang)} - ${end ? month(end, lang) : labels[lang].present}`
const link = (url) => `<a href="${escape(url)}">${escape(displayUrl(url))}</a>`
const bullets = items => items.length ? `<ul>${items.map(x => `<li>${escape(x)}</li>`).join('')}</ul>` : ''
const sep = lang => lang === 'jp' ? '、' : ', '
// Label punctuation: French takes a (non-breaking) space before the colon.
const colon = lang => ({ fr: '\u00a0: ', jp: '：' })[lang] ?? ': '
const paren = (value, lang) => lang === 'jp' ? `（${value}）` : ` (${value})`
// Keep a date range on one line: a line-end hyphen is dropped by dehyphenating extractors.
const when = value => `<span class="nowrap">${escape(value)}</span>`
// French: no capital after a label colon ("SalesFlow : pilotage…").
const lead = (text, lang) => lang === 'fr' ? text.charAt(0).toLocaleLowerCase('fr') + text.slice(1) : text
// Japanese lines break between any two characters; keep multi-word product
// names whole without altering the extracted text (no NBSP substitution).
const JP_KEEP = /\b(?:Spring Boot|Spring Batch|Slide Agent|Prime Video|Cloud Logging|GitHub Actions|Artifact Registry|Angular Material|Translator API|Technology Incubation Team|Rakuten Card|Manifest V3|Redis Streams|Apache POI|Google Cloud Platform|Google Kubernetes Engine|Chrome Extensions)\b/g
const keep = (html, lang) => lang === 'jp' ? html.replace(JP_KEEP, name => `<span class="nowrap">${name}</span>`) : html

// Japanese uses one bundled font for kana, kanji and Latin text: see scripts/fonts/README.md.
const fontsDir = pathToFileURL(resolve('scripts/fonts')).href
const fontFaces = `
  @font-face { font-family: 'CV Noto Sans JP'; font-weight: 400; src: url('${fontsDir}/NotoSansJP-Regular-JIS.woff2') format('woff2'); }
  @font-face { font-family: 'CV Noto Sans JP'; font-weight: 700; src: url('${fontsDir}/NotoSansJP-Bold-JIS.woff2') format('woff2'); }`

const render = (lang, d) => {
  const l = labels[lang]
  const content = selectPdfContent(d)
  const today = new Date()
  const asOf = lang === 'jp' ? `<div class="doc">${l.document}（${today.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}${l.asOf}）</div>` : ''
  const header = `<header>${asOf}<h1>${escape(d.hero.name)}</h1><div class="title">${escape(d.hero.title)}${d.hero.headline ? ` | ${escape(d.hero.headline)}` : ''}</div><div class="contact">${escape(d.hero.location)} · ${escape(config.contact.phone)} · ${`<a href="mailto:${escape(config.contact.email)}">${escape(config.contact.email)}</a>`}<br>${link(config.meta.siteUrl)} · ${link(config.social.linkedin)} · ${link(config.social.github)}</div></header>`

  const experience = content.experience.map(e => {
    // Title, employer and dates share one text run per official title: a
    // right-aligned date column is extracted out of order by some parsers.
    const org = `<span class="org"> - <b>${escape(e.company)}</b>${e.assignment ? ` · ${escape(e.assignment)}` : ''} · ${escape(e.location)}</span>`
    const roles = e.roles.map(r => `<h3 class="role">${escape(r.position)}${org}<span class="dates"> | ${when(range(r.startDate, r.endDate, lang))}</span></h3>`).join('')
    const projects = e.projects.length
      ? `<p class="sub">${l.companyProjects}</p><ul>${e.projects.map(p => `<li><b>${escape(p.title)}</b>${p.period ? paren(when(p.period), lang) : ''}${colon(lang)}${escape(lead(p.outcomes.join(lang === 'jp' ? '' : ' '), lang))}</li>`).join('')}</ul>`
      : ''
    // Keep the PDF focused on the selected project evidence. The website
    // carries the full company-project list and its expandable details.
    return `<article>${roles}<p>${escape(e.description)}</p>${bullets(e.achievements)}${projects}</article>`
  }).join('')

  const skills = content.skills.map(s => `<p><b>${escape(s.category)}${colon(lang)}</b>${escape(s.names.join(sep(lang)))}</p>`).join('')

  const projects = content.featuredProjects.map(p => `<article><h3 class="role">${escape(p.title)} <span class="org">· ${escape([p.role, p.status].filter(Boolean).join(' · '))}</span>${p.period ? `<span class="dates"> | ${when(p.period)}</span>` : ''}</h3><p>${escape(p.summary)}</p>${bullets(p.outcomes)}<p class="small">${l.technologies}${colon(lang)}${escape(p.technologies.join(sep(lang)))} · ${[p.link, p.repo].filter(Boolean).map(link).join(' · ')}</p></article>`).join('')
  const otherProjects = content.otherProjects.map(p => `<li><b>${escape(p.title)}</b>${p.period ? paren(when(p.period), lang) : ''}${colon(lang)}${escape(lead(p.summary, lang))} ${[p.link, p.repo].filter(Boolean).map(link).join(' · ')}</li>`).join('')

  const education = d.education.map(e => `<p><b>${escape(e.degree)}</b> · ${escape(e.institution)}${sep(lang)}${escape(e.location)} · ${when(e.period)}</p>`).join('')
  const certifications = d.certifications.map(c => `<p><b>${escape(c.name)}</b> · ${escape(c.issuer)} · ${when(c.date)}${c.link ? ` · ${l.verify}${colon(lang)}${link(c.link)}` : ''}</p>`).join('')
  const languages = d.languages.map(x => `${escape(x.language)}${paren(escape(x.level), lang)}`).join(sep(lang))

  const body = keep(`${header}<h2>${l.summary}</h2><p>${escape(content.profile)}</p><h2>${l.experience}</h2>${experience}<h2>${l.skills}</h2><div class="skills">${skills}</div><h2>${l.projects}</h2>${projects}${otherProjects ? `<p class="sub">${l.more}</p><ul>${otherProjects}</ul>` : ''}<h2>${l.education}</h2><div class="education">${education}${certifications}<p><b>${l.languages}${colon(lang)}</b>${languages}</p></div>`, lang)

  return `<!doctype html><html lang="${lang === 'jp' ? 'ja' : lang}"><head><meta charset="utf-8"><title>${escape(d.hero.name)} - ${escape(d.hero.title)} CV</title><style>${fontFaces}
    * { box-sizing: border-box; } body { margin: 0; color: #1f2937; font: 9.4pt/1.32 Arial, 'Liberation Sans', sans-serif; }
    h1,h2,h3,p { margin: 0; } h1 { color: #152737; font-size: 22pt; letter-spacing: -.4px; }
    .doc { font-size: 9pt; color: #435465; margin-bottom: 2px; }
    .title { font-size: 11.5pt; font-weight: bold; margin-top: 3px; color: #152737; } .contact { font-size: 9pt; margin-top: 5px; color: #435465; }
    a { color: #12635a; text-decoration: none; }
    h2 { font-size: 10.5pt; letter-spacing: .3px; color: #12635a; padding-bottom: 3px; margin: 9px 0 5px; border-bottom: 1px solid #cad7d5; break-after: avoid; }
    h3 { font-size: 10pt; color: #152737; } h3.role { break-after: avoid; } h3 .dates { font-weight: normal; color: #435465; white-space: nowrap; }
    article { margin-bottom: 7px; } .org { font-weight: normal; color: #1f2937; } article > h3 + p { margin-top: 2px; }
    .nowrap { white-space: nowrap; }
    p { margin-top: 3px; } ul { margin: 3px 0 0; padding-left: 14px; } li { margin-bottom: 1px; break-inside: avoid; }
    .sub { font-weight: bold; margin-top: 4px; break-after: avoid; } .sub + ul { break-inside: avoid; } .small { font-size: 8.8pt; color: #435465; }
    .skills { break-inside: avoid; } .skills p { margin: 0 0 2px; } .education p { margin: 0 0 4px; }
    body.jp { font-family: 'CV Noto Sans JP', sans-serif; font-size: 9pt; line-height: 1.38; } .jp h1 { font-size: 20pt; letter-spacing: 0; } .jp h3 { font-size: 9.6pt; }
    </style></head><body class="${lang}">${body}</body></html>`
}

const browser = await chromium.launch({ headless: true })
await mkdir('output/pdf', { recursive: true })
try {
  for (const lang of ['en', 'fr', 'jp']) {
    const d = JSON.parse(await readFile(`public/cv-data-${lang}.json`, 'utf8'))
    const html = render(lang, d)
    // Load from a file URL so the bundled font files resolve.
    const htmlPath = resolve(`output/pdf/${lang}.html`)
    await writeFile(htmlPath, html)
    const page = await browser.newPage()
    await page.goto(pathToFileURL(htmlPath).href)
    await page.evaluate(() => document.fonts.ready)
    if (lang === 'jp') {
      const loaded = await page.evaluate(() => [...document.fonts].filter(f => f.family.includes('CV Noto Sans JP') && f.status === 'loaded').length)
      if (loaded < 2) throw new Error('Japanese CV fonts did not load (scripts/fonts).')
    }
    const filename = `CV_Ghassen_Bargougui-${lang}.pdf`
    const pdf = await page.pdf({
      path: `public/${filename}`,
      format: 'A4',
      printBackground: true,
      // Tagged PDF and outline give the text layer a semantic structure.
      tagged: true,
      outline: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;font-family:Arial,sans-serif;font-size:8px;color:#6b7280;text-align:center">${escape(d.hero.name)} · ghassen.io · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
      margin: { top: '12mm', bottom: '14mm', left: '14mm', right: '14mm' },
    })
    const text = pdf.toString('latin1')
    const pages = (text.match(/\/Type\s*\/Page[^s]/g) ?? []).length
    if (pages > MAX_PAGES) throw new Error(`${lang} CV has ${pages} pages; the limit is ${MAX_PAGES}.`)
    // A Type 3 font means Japanese text fell back to a system font (see scripts/fonts/README.md).
    if (/\/Subtype\s*\/Type3/.test(text)) throw new Error(`${lang} CV contains a Type 3 font; some characters are outside the bundled font coverage.`)
    await copyFile(`public/${filename}`, `output/pdf/${filename}`)
    await page.close()
    console.log(`Generated ${filename} (${pages} pages, ${pdf.length} bytes)`)
  }
  await copyFile('public/CV_Ghassen_Bargougui-en.pdf', 'public/CV_Ghassen_Bargougui.pdf')
  // A deterministic share image with current positioning, no availability claims.
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(`<html><style>body{margin:0;background:#0e0e18;color:#f5f0e8;font-family:Arial,sans-serif}.wrap{padding:82px 90px;height:630px;box-sizing:border-box;border-bottom:12px solid #56c4b8}.kicker{color:#56c4b8;font-size:24px;letter-spacing:3px}h1{font-size:67px;line-height:1.1;margin:45px 0 25px}h2{font-size:34px;color:#e8a838;margin:0 0 28px}p{font-size:24px;color:#c5c1d0;line-height:1.6}.site{margin-top:35px;font-size:23px;color:#f5f0e8}</style><div class="wrap"><div class="kicker">ENGINEERING · JAPAN</div><h1>Ghassen Bargougui</h1><h2>Application Engineer · Rakuten</h2><p>Java applications · Cloud &amp; platform engineering<br>Creator of Slide Agent, Pockito &amp; SubMate</p><div class="site">ghassen.io</div></div></html>`)
  await page.screenshot({ path: 'public/og-image.png' })
  await page.close()
} finally { await browser.close() }
