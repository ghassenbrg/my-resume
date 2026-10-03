"""Rebuild the Japanese CV font subsets.

Usage: python3 build-noto-sans-jp-subset.py NotoSansJP[wght].ttf scripts/fonts
Requires: pip install fonttools brotli

Source: https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf
(SIL Open Font License 1.1, see OFL.txt). Instances wght 400/700, keeps Latin,
Japanese punctuation, kana and JIS X 0208 kanji, and drops every Kangxi/CJK
radical and compatibility-ideograph mapping (see README.md).
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

# JIS X 0208 (levels 1 and 2) via the EUC-JP codec, plus Latin and Japanese punctuation/kana blocks.
chars = set()
for hi in range(0xA1, 0xFF):
    for lo in range(0xA1, 0xFF):
        try:
            chars.update(bytes([hi, lo]).decode('euc_jp'))
        except UnicodeDecodeError:
            pass
ranges = [(0x20,0x7E),(0xA0,0x17F),(0x2000,0x206F),(0x2190,0x21FF),(0x2200,0x22FF),(0x2460,0x24FF),(0x25A0,0x25FF),(0x3000,0x30FF),(0x31F0,0x31FF),(0xFF00,0xFFEF)]
for a,b in ranges: chars.update(chr(c) for c in range(a,b+1))
# Never map compatibility/radical code points: they share glyphs with unified ideographs,
# and Chromium's ToUnicode reverse map would otherwise emit e.g. U+2F47 instead of U+65E5.
chars = {c for c in chars if not (0x2E80 <= ord(c) <= 0x2FDF or 0xF900 <= ord(c) <= 0xFAFF)}
print('codepoints', len(chars))
for wght, name in [(400,'Regular'),(700,'Bold')]:
    f = TTFont(sys.argv[1])
    f = instancer.instantiateVariableFont(f, {'wght': wght}, updateFontNames=False)
    # Static instance names (the variable font's defaults describe the Thin master).
    for name_id, value in [(1, 'Noto Sans JP'), (2, name), (4, f'Noto Sans JP {name}'), (6, f'NotoSansJP-{name}'), (16, None), (17, None)]:
        f['name'].removeNames(nameID=name_id)
        if value:
            f['name'].setName(value, name_id, 3, 1, 0x409)
    f['OS/2'].usWeightClass = wght
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs=['*']; opts.notdef_outline=True; opts.drop_tables += ['STAT']
    s = subset.Subsetter(opts); s.populate(unicodes=[ord(c) for c in chars]); s.subset(f)
    cmap = f.getBestCmap()
    assert not any(0x2E80 <= c <= 0x2FDF or 0xF900 <= c <= 0xFAFF for c in cmap)
    out = f'{sys.argv[2]}/NotoSansJP-{name}-JIS.woff2'; f.flavor='woff2'; f.save(out); print(out, len(cmap))
