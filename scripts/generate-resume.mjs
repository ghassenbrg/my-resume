import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

// The web resume JSON is also the source for every downloadable CV.
const config = JSON.parse(await readFile('public/cv-config.json', 'utf8'))
const escape = (value = '') => String(value).replace(/[\u2010-\u2015]/g, '-').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const labels = {
  en: { summary: 'Profile', experience: 'Professional experience', projects: 'Personal projects', skills: 'Technical skills', education: 'Education & certification', languages: 'Languages', present: 'Present', more: 'Also built', continued: 'Projects & skills', source: 'Source', web: 'Website' },
  fr: { summary: 'Profil', experience: 'Expérience professionnelle', projects: 'Projets personnels', skills: 'Compétences techniques', education: 'Formation & certification', languages: 'Langues', present: 'À ce jour', more: 'Également développé', continued: 'Projets & compétences', source: 'Code source', web: 'Site web' },
  jp: { summary: 'プロフィール', experience: '職務経歴', projects: '個人プロジェクト', skills: '技術スキル', education: '学歴・資格', languages: '言語', present: '現在', more: 'その他の個人開発', continued: 'プロジェクト・スキル', source: 'ソースコード', web: 'Webサイト' },
}
const locale = { en: 'en-US', fr: 'fr-FR', jp: 'ja-JP' }
const month = (iso, lang) => new Date(iso + 'T00:00:00Z').toLocaleDateString(locale[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' })
const bulletList = items => `<ul>${items.map(x => `<li>${escape(x)}</li>`).join('')}</ul>`
const link = (url, label) => `<a href="${escape(url)}">${escape(label)}</a>`
const browser = await chromium.launch({ headless: true })
await mkdir('output/pdf', { recursive: true })
try {
  for (const lang of ['en', 'fr', 'jp']) {
    const d = JSON.parse(await readFile(`public/cv-data-${lang}.json`, 'utf8'))
    const l = labels[lang]
    const header = `<header><h1>${escape(d.hero.name)}</h1><div class="title">${escape(d.hero.title)} <span>· ${escape(d.hero.location)}</span></div><div class="contact">${escape(config.contact.phone)} · ${link('mailto:' + config.contact.email, config.contact.email)}<br>${link(config.meta.siteUrl, 'ghassen.io')} · ${link(config.social.linkedin, 'linkedin.com/in/ghassenbrg')} · ${link(config.social.github, 'github.com/ghassenbrg')}</div></header>`
    const experience = d.experience.map(e => `<article><div class="row"><h3>${escape(e.position)}</h3><span>${month(e.startDate, lang)} - ${e.endDate ? month(e.endDate, lang) : l.present}</span></div><div class="company">${escape(e.company)} · ${escape(e.location)}</div><p>${escape(e.description)}</p>${bulletList(e.achievements.slice(0, 3))}${e.projects?.length ? `<p class="small"><b>${l.projects === '個人プロジェクト' ? '主な業務プロジェクト' : lang === 'fr' ? 'Projets sélectionnés' : 'Selected company projects'}:</b> ${e.projects.map(p => escape(p.title)).join(' · ')}</p>` : ''}</article>`).join('')
    const projects = d.projects.filter(p => p.featured).map(p => `<article><div class="row"><h3>${escape(p.title)}</h3><span>${escape(p.role)}</span></div><p>${escape(p.summary)}</p>${bulletList(p.outcomes.slice(0, 2))}<p class="small">${escape(p.technologies.join(' · '))}</p><p class="links">${p.link ? link(p.link, new URL(p.link).host) : ''}${p.repo ? ` · ${link(p.repo, l.source)}` : ''}</p></article>`).join('')
    const small = d.projects.filter(p => !p.featured).map(p => `<b>${link(p.link || p.repo, p.title)}</b>: ${escape(p.summary)}`).join('<br>')
    const html = `<!doctype html><html lang="${lang === 'jp' ? 'ja' : lang}"><head><meta charset="utf-8"><title>${escape(d.hero.name)} - ${escape(d.hero.title)}</title><style>
      @page { size: A4; margin: 14mm 16mm 16mm; }
      * { box-sizing: border-box; } body { margin: 0; color: #1f2937; font: 9.1pt/1.35 Arial, 'Hiragino Kaku Gothic ProN', 'Noto Sans CJK JP', sans-serif; } h1,h2,h3,p { margin: 0; } h1 { color: #152737; font-size: 23pt; letter-spacing: -.5px; } .title { font-size: 12pt; font-weight: bold; margin-top: 3px; } .title span { font-weight: normal; font-size: 10pt; } .contact { font-size: 8.4pt; margin-top: 7px; color: #435465; } a { color: #12635a; text-decoration: none; } h2 { font-size: 10pt; letter-spacing: .4px; color: #12635a; padding-bottom: 4px; margin: 12px 0 7px; border-bottom: 1px solid #cad7d5; } h3 { font-size: 10pt; color: #152737; } article { margin-bottom: 9px; break-inside: avoid; } .row { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; } .row > span { flex-shrink: 0; font-size: 8pt; color: #435465; } .company { font-weight: bold; font-size: 8.6pt; margin: 3px 0 4px; } p { margin-top: 4px; } ul { margin: 5px 0 0; padding-left: 14px; } li { margin-bottom: 2px; } .small,.links { font-size: 8pt; color: #435465; } .page { break-after: page; } .page:last-child { break-after: auto; } .continuation { display: flex; justify-content: space-between; padding-bottom: 7px; border-bottom: 2px solid #152737; font-size: 9pt; } .skills { columns: 2; column-gap: 18px; } .skills p { margin: 0 0 6px; break-inside: avoid; font-size: 8.5pt; } .education p { margin: 3px 0; } .jp { font-size: 8.7pt; line-height: 1.5; } .jp .row > span { font-size: 7.8pt; }
      </style></head><body class="${lang}"><section class="page">${header}<h2>${l.summary}</h2><p>${escape(d.about.paragraphs[0])} ${escape(d.about.paragraphs.find(p => /Slide Agent/.test(p)) || '')}</p><h2>${l.experience}</h2>${experience}</section><section class="page"><div class="continuation"><b>${escape(d.hero.name)}</b><span>${l.continued}</span></div><h2>${l.projects}</h2>${projects}<p class="small">${l.more}:<br>${small}</p><h2>${l.skills}</h2><div class="skills">${Object.entries(d.skills).map(([category, items]) => `<p><b>${escape(category)}:</b> ${escape(items.map(x => x.name).join(' · '))}</p>`).join('')}</div><h2>${l.education}</h2><div class="education">${d.education.map(e => `<p><b>${escape(e.degree)}</b> · ${escape(e.institution)} · ${escape(e.period)}</p>`).join('')}${d.certifications.map(c => `<p>${escape(c.name)} · ${escape(c.issuer)} · ${escape(c.date)}</p>`).join('')}</div><h2>${l.languages}</h2><p>${d.languages.map(x => `${escape(x.language)}: ${escape(x.level)}`).join(' · ')}</p></section></body></html>`
    const page = await browser.newPage({ viewport: { width: 673, height: 1010 } })
    await page.setContent(html)
    await page.evaluate(() => document.fonts.ready)
    const overflow = await page.locator('.page').evaluateAll(pages => pages.map(p => ({height: p.getBoundingClientRect().height, limit: 267 * 96 / 25.4})))
    if (overflow.some(p => p.height > p.limit)) throw new Error(`${lang} CV exceeds a page: ${JSON.stringify(overflow)}`)
    const filename = `CV_Ghassen_Bargougui-${lang}.pdf`
    await page.pdf({ path: `public/${filename}`, format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: `<div style="width:100%;font-family:Arial;font-size:8px;color:#6b7280;text-align:center">ghassen.io · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`, margin: { top: '14mm', bottom: '16mm', left: '16mm', right: '16mm' } })
    await copyFile(`public/${filename}`, `output/pdf/${filename}`)
    await writeFile(`output/pdf/${lang}.html`, html)
    await page.close()
    console.log(`Generated ${filename} (${overflow.map(p => Math.round(p.height)).join(', ')}px)`)
  }
  await copyFile('public/CV_Ghassen_Bargougui-en.pdf', 'public/CV_Ghassen_Bargougui.pdf')
  // A deterministic share image with current positioning, no availability claims.
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(`<html><style>body{margin:0;background:#0e0e18;color:#f5f0e8;font-family:Arial,sans-serif}.wrap{padding:82px 90px;height:630px;box-sizing:border-box;border-bottom:12px solid #56c4b8}.kicker{color:#56c4b8;font-size:24px;letter-spacing:3px}h1{font-size:67px;line-height:1.1;margin:45px 0 25px}h2{font-size:34px;color:#e8a838;margin:0 0 28px}p{font-size:24px;color:#c5c1d0;line-height:1.6}.site{margin-top:35px;font-size:23px;color:#f5f0e8}</style><div class="wrap"><div class="kicker">ENGINEERING · JAPAN</div><h1>Ghassen Bargougui</h1><h2>Application Engineer · Rakuten Card</h2><p>Java · Full-stack systems · Cloud modernization<br>Creator of Slide Agent, Pockito & SubMate</p><div class="site">ghassen.io</div></div></html>`)
  await page.screenshot({ path: 'public/og-image.png' })
  await page.close()
} finally { await browser.close() }
