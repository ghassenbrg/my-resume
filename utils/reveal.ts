import type { CSSProperties } from 'vue'

/* Staggered reveal delay for `.reveal` elements, capped so long lists don't
 * lag. Mirrors the design's Reveal stagger (Math.min(i, 8) * 70ms). */
export const revealDelay = (index: number): CSSProperties => ({
  transitionDelay: `${Math.min(index, 8) * 70}ms`,
})
