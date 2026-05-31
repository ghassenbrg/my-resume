<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'

/* Inline SVG icon set, theme-aware via currentColor.
 * Ported from the design's icons.jsx. */

type IconChild = [tag: string, attrs: Record<string, string | number>]
type IconDef = { filled?: boolean; children: IconChild[] }

const ICONS: Record<string, IconDef> = {
  github: {
    filled: true,
    children: [
      ['path', { d: 'M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z' }],
    ],
  },
  linkedin: {
    filled: true,
    children: [
      ['path', { d: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z' }],
    ],
  },
  star: {
    filled: true,
    children: [
      ['path', { d: 'M12 2.5l2.6 6.1 6.6.5-5 4.3 1.6 6.5L12 16.9 6.2 20.4l1.6-6.5-5-4.3 6.6-.5z' }],
    ],
  },
  mail: {
    children: [
      ['rect', { x: 3, y: 5, width: 18, height: 14, rx: 3 }],
      ['path', { d: 'm3.5 7 8.5 6 8.5-6' }],
    ],
  },
  download: {
    children: [
      ['path', { d: 'M12 3v12' }],
      ['path', { d: 'm7 11 5 5 5-5' }],
      ['path', { d: 'M5 21h14' }],
    ],
  },
  arrow: {
    children: [
      ['path', { d: 'M5 12h14' }],
      ['path', { d: 'm13 6 6 6-6 6' }],
    ],
  },
  'arrow-ur': {
    children: [
      ['path', { d: 'M7 17 17 7' }],
      ['path', { d: 'M8 7h9v9' }],
    ],
  },
  chevron: {
    children: [['path', { d: 'm6 9 6 6 6-6' }]],
  },
  sun: {
    children: [
      ['circle', { cx: 12, cy: 12, r: 4.2 }],
      ['path', { d: 'M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8' }],
    ],
  },
  moon: {
    children: [['path', { d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' }]],
  },
  pin: {
    children: [
      ['path', { d: 'M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z' }],
      ['circle', { cx: 12, cy: 10, r: 2.4 }],
    ],
  },
  up: {
    children: [
      ['path', { d: 'M12 19V5' }],
      ['path', { d: 'm6 11 6-6 6 6' }],
    ],
  },
  cert: {
    children: [
      ['circle', { cx: 12, cy: 9, r: 5 }],
      ['path', { d: 'M9 13.5 8 22l4-2.2L16 22l-1-8.5' }],
    ],
  },
  cap: {
    children: [
      ['path', { d: 'm2 8 10-4 10 4-10 4z' }],
      ['path', { d: 'M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5' }],
      ['path', { d: 'M22 8v5' }],
    ],
  },
  globe: {
    children: [
      ['circle', { cx: 12, cy: 12, r: 9 }],
      ['path', { d: 'M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18' }],
    ],
  },
}

export default defineComponent({
  name: 'AppIcon',
  props: {
    name: { type: String as PropType<keyof typeof ICONS | string>, required: true },
    size: { type: Number, default: 20 },
    strokeWidth: { type: Number, default: 1.7 },
  },
  render() {
    const def = ICONS[this.name]

    if (!def) {
      return null
    }

    const base = {
      width: this.size,
      height: this.size,
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
    }

    const attrs = def.filled
      ? { ...base, fill: 'currentColor' }
      : {
          ...base,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': this.strokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }

    return h(
      'svg',
      attrs,
      def.children.map(([tag, childAttrs]) => h(tag, childAttrs)),
    )
  },
})
</script>
