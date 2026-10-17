<template>
  <div
    class="monogram"
    :class="{ 'monogram-glow': glow }"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <span class="mono-text" :style="{ fontSize: `${size * 0.42}px` }">{{ text }}</span>
    <span class="mono-bar"></span>
    <span class="mono-dot"></span>
  </div>
</template>

<script setup lang="ts">
/* Brand monogram: "GB" inside an ink-rimmed paper disc (the Snib head shape),
 * with an orange underline and spark. Purely decorative (aria-hidden). */
withDefaults(
  defineProps<{
    size?: number
    text?: string
    glow?: boolean
  }>(),
  {
    size: 116,
    text: 'GB',
    glow: true,
  },
)
</script>
