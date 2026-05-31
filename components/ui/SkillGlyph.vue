<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'

/* Skill-category glyphs (simple geometric line icons).
 * Ported from the design's catGlyph(). Keyed by the English category name;
 * falls back to category index so translated category names (fr/ja) — which
 * keep the same order — still render the matching glyph. */

type GlyphChild = [tag: string, attrs: Record<string, string | number>]

const GLYPH_ORDER: GlyphChild[][] = [
  // Backend & Full-Stack Development
  [['path', { d: 'M8 6 3 12l5 6M16 6l5 6-5 6M13 4l-2 16' }]],
  // Database & Data Processing
  [
    ['ellipse', { cx: 12, cy: 6, rx: 7, ry: 3 }],
    ['path', { d: 'M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3' }],
  ],
  // API Development
  [
    ['path', { d: 'M4 12h4M16 12h4' }],
    ['circle', { cx: 12, cy: 12, r: 4 }],
  ],
  // Microservices & Event-Driven Systems
  [
    ['circle', { cx: 6, cy: 6, r: 2.4 }],
    ['circle', { cx: 18, cy: 6, r: 2.4 }],
    ['circle', { cx: 12, cy: 18, r: 2.4 }],
    ['path', { d: 'M7.6 7.6 10.6 16M16.4 7.6 13.4 16M8 6h8' }],
  ],
  // DevOps & Infrastructure
  [
    ['circle', { cx: 12, cy: 12, r: 3 }],
    ['path', { d: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1' }],
  ],
  // Testing & Code Quality
  [['path', { d: 'm4 13 5 5L20 6' }]],
  // Security
  [
    ['path', { d: 'M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z' }],
    ['path', { d: 'm9 12 2 2 4-4' }],
  ],
  // High-Performance Computing
  [['path', { d: 'M13 3 4 14h7l-1 7 9-11h-7z' }]],
  // Agile & Collaboration
  [
    ['path', { d: 'M3 12a9 9 0 0 1 15-6.7M21 12a9 9 0 0 1-15 6.7' }],
    ['path', { d: 'M17 4v4h-4M7 20v-4h4' }],
  ],
]

const GLYPH_BY_NAME: Record<string, GlyphChild[]> = {
  'Backend & Full-Stack Development': GLYPH_ORDER[0],
  'Database & Data Processing': GLYPH_ORDER[1],
  'API Development': GLYPH_ORDER[2],
  'Microservices & Event-Driven Systems': GLYPH_ORDER[3],
  'DevOps & Infrastructure': GLYPH_ORDER[4],
  'Testing & Code Quality': GLYPH_ORDER[5],
  Security: GLYPH_ORDER[6],
  'High-Performance Computing': GLYPH_ORDER[7],
  'Agile & Collaboration': GLYPH_ORDER[8],
}

const FALLBACK: GlyphChild[] = [['circle', { cx: 12, cy: 12, r: 6 }]]

export default defineComponent({
  name: 'SkillGlyph',
  props: {
    category: { type: String, default: '' },
    index: { type: Number as PropType<number>, default: -1 },
    size: { type: Number, default: 18 },
  },
  render() {
    const children =
      GLYPH_BY_NAME[this.category] ?? GLYPH_ORDER[this.index] ?? FALLBACK

    return h(
      'svg',
      {
        width: this.size,
        height: this.size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.6,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
      },
      children.map(([tag, attrs]) => h(tag, attrs)),
    )
  },
})
</script>
