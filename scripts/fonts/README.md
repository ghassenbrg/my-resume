# Japanese CV fonts

`NotoSansJP-Regular-JIS.woff2` and `NotoSansJP-Bold-JIS.woff2` are subsets of
[Noto Sans JP](https://github.com/google/fonts/tree/main/ofl/notosansjp)
(variable `NotoSansJP[wght].ttf`, SHA-256
`c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f`), licensed
under the SIL Open Font License 1.1 ([OFL.txt](OFL.txt)). Rebuild them with
[`build-noto-sans-jp-subset.py`](build-noto-sans-jp-subset.py).

Why `scripts/generate-resume.mjs` uses them for the Japanese PDF instead of a
system font:

- Chromium embeds the macOS Japanese system fonts (Hiragino, YuGothic, Toppan
  Bunkyu) as Type 3 fonts. These subsets embed as CID TrueType.
- Those fonts map Kangxi radicals (U+2F00–U+2FDF) and the ideographs to the
  same glyphs. The PDF text layer then records e.g. `⽇` (U+2F47) instead of
  `日` (U+65E5), which some extractors return unnormalized. The subsets contain
  no radical or compatibility-ideograph mappings.
- One font for Latin digits and kanji keeps date rows such as `2025年12月`
  on a single text run.

Coverage is Latin, Japanese punctuation, kana, full-width forms and the JIS X
0208 kanji. The generator fails if a Japanese PDF still contains a Type 3
font, which would indicate text outside this coverage.
