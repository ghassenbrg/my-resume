<template>
  <div
    class="monogram"
    :class="{ 'monogram-glow': glow }"
    :style="{ width: `${size}px`, height: `${size}px`, borderRadius: `${radius}px` }"
    aria-hidden="true"
  >
    <span class="mono-text" :style="{ fontSize: `${size * 0.42}px` }">{{ text }}</span>
    <span class="mono-bar"></span>
    <span class="mono-dot"></span>
  </div>
</template>

<script setup lang="ts">
/* Brand monogram tile derived from the GB logo. Ported from the design's
 * <Monogram>. Purely decorative (aria-hidden). */
withDefaults(
  defineProps<{
    size?: number
    text?: string
    radius?: number
    glow?: boolean
  }>(),
  {
    size: 116,
    text: 'GB',
    radius: 26,
    glow: true,
  },
)
</script>
