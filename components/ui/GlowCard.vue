<template>
  <component
    :is="as"
    class="glow-card"
    :class="[`glow-card--${tone}`]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
    tone?: 'amber' | 'teal' | 'violet'
  }>(),
  {
    as: 'article',
    tone: 'amber',
  },
)
</script>

<style scoped>
.glow-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--gradient-surface);
  box-shadow: var(--shadow-card);
}

.glow-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease;
}

.glow-card--amber::before {
  box-shadow: inset 0 0 0 1px var(--accent-amber), var(--shadow-glow);
}

.glow-card--teal::before {
  box-shadow: inset 0 0 0 1px var(--accent-teal), 0 0 24px rgba(86, 196, 184, 0.18);
}

.glow-card--violet::before {
  box-shadow: inset 0 0 0 1px var(--accent-violet), 0 0 24px rgba(199, 125, 255, 0.18);
}

.glow-card:hover::before,
.glow-card:focus-within::before {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .glow-card::before {
    transition: none;
  }
}
</style>
