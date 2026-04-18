<template>
  <component
    :is="componentTag"
    ref="buttonRef"
    class="magnetic-button"
    :class="[`magnetic-button--${variant}`]"
    :href="isLink ? href : undefined"
    :target="isLink && external ? '_blank' : undefined"
    :rel="isLink && external ? 'noopener noreferrer' : undefined"
    :type="isLink ? undefined : type"
    data-cursor-label="Click"
  >
    <span class="magnetic-button__content">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href?: string
    external?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost'
  }>(),
  {
    external: false,
    type: 'button',
    variant: 'primary',
  },
)

const buttonRef = ref<HTMLElement | null>(null)
const isLink = computed(() => Boolean(props.href))
const componentTag = computed(() => (isLink.value ? 'a' : 'button'))

useMagneticEffect(buttonRef, {
  strength: 0.18,
  maxDistance: 96,
})
</script>

<style scoped>
.magnetic-button {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-5);
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: var(--text-small);
  font-weight: 600;
  line-height: var(--leading-snug);
  text-decoration: none;
  box-shadow: var(--shadow-card);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease;
  will-change: transform;
}

.magnetic-button--primary {
  border-color: transparent;
  background: var(--gradient-amber);
  color: var(--bg-0);
}

.magnetic-button--secondary {
  border-color: var(--accent-teal);
  background: rgba(86, 196, 184, 0.12);
  color: var(--text-0);
}

.magnetic-button--ghost {
  background: rgba(13, 13, 18, 0.72);
  color: var(--text-1);
}

.magnetic-button:hover {
  border-color: var(--accent-amber);
  box-shadow: var(--shadow-glow);
}

.magnetic-button__content {
  pointer-events: none;
}

@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
  .magnetic-button {
    transform: none !important;
    transition: none;
    will-change: auto;
  }
}
</style>
