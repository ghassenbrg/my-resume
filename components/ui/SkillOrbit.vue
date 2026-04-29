<template>
  <div class="skill-orbit" aria-label="Interactive skill constellation">
    <div class="skill-orbit__map">
      <span class="skill-orbit__ring skill-orbit__ring--outer"></span>
      <span class="skill-orbit__ring skill-orbit__ring--inner"></span>

      <div class="skill-orbit__core">
        <span>Core</span>
        <strong>Software Engineer</strong>
      </div>

      <button
        v-for="(category, index) in categories"
        :key="category.key"
        class="skill-orbit__node"
        :class="{ 'skill-orbit__node--active': activeKey === category.key }"
        :style="getNodeStyle(index)"
        type="button"
        :aria-label="`Focus ${category.shortLabel} skills`"
        @focus="emit('focus-category', category.key)"
        @mouseenter="emit('focus-category', category.key)"
        @click="emit('focus-category', category.key)"
      >
        <span>{{ category.shortLabel }}</span>
        <small>{{ category.skills.length }}</small>
      </button>
    </div>

    <article
      class="skill-orbit__panel"
      :class="{ 'skill-orbit__panel--can-scroll-down': canScrollDown }"
      data-lenis-prevent
      aria-label="Active skill category"
    >
      <div
        ref="panelRef"
        class="skill-orbit__panel-scroll"
        data-lenis-prevent
        aria-label="Scrollable active skill category"
        @scroll="updateScrollState"
      >
        <p class="skill-orbit__panel-kicker">{{ activeCategory.skills.length }} skills</p>
        <h3>{{ activeCategory.label }}</h3>
        <ul class="skill-orbit__skills">
          <li
            v-for="skill in activeCategory.skills"
            :key="skill.name"
            :class="{ 'skill-orbit__skill--core': skill.highlight }"
          >
            <Icon
              class="skill-orbit__icon"
              :icon="skill.icon"
              aria-hidden="true"
            />
            <span>{{ skill.name }}</span>
            <strong v-if="skill.highlight">Core</strong>
          </li>
        </ul>
      </div>
      <div
        v-if="canScrollDown"
        class="skill-orbit__scroll-cue"
        aria-hidden="true"
      >
        <span class="skill-orbit__scroll-cue-line"></span>
        <span class="skill-orbit__scroll-cue-arrow">↓</span>
        <span class="skill-orbit__scroll-cue-text">Scroll</span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IconifyIcon } from '@iconify/types'

export interface OrbitSkill {
  name: string
  icon: IconifyIcon
  highlight: boolean
}

export interface OrbitCategory {
  key: string
  label: string
  shortLabel: string
  skills: OrbitSkill[]
}

const props = defineProps<{
  categories: OrbitCategory[]
  activeKey: string
}>()

const emit = defineEmits<{
  'focus-category': [key: string]
}>()

const panelRef = ref<HTMLElement | null>(null)
const canScrollUp = ref(false)
const canScrollDown = ref(false)
let panelResizeObserver: ResizeObserver | null = null

const activeCategory = computed(() => {
  return props.categories.find((category) => category.key === props.activeKey) ?? props.categories[0]
})

const updateScrollState = () => {
  const panel = panelRef.value

  if (!panel) {
    canScrollUp.value = false
    canScrollDown.value = false
    return
  }

  const scrollThreshold = 4
  canScrollUp.value = panel.scrollTop > scrollThreshold
  canScrollDown.value = panel.scrollTop + panel.clientHeight < panel.scrollHeight - scrollThreshold
}

const getNodeStyle = (index: number) => {
  const angle = -Math.PI / 2 + ((Math.PI * 2) / props.categories.length) * index
  const radius = index % 2 === 0 ? 40 : 32
  const x = 50 + Math.cos(angle) * radius
  const y = 50 + Math.sin(angle) * radius

  return {
    '--node-x': `${x}%`,
    '--node-y': `${y}%`,
  }
}

watch(
  () => props.activeKey,
  async () => {
    await nextTick()

    const panel = panelRef.value

    if (panel) {
      panel.scrollTop = 0
    }

    updateScrollState()
  },
)

onMounted(async () => {
  await nextTick()
  updateScrollState()

  panelResizeObserver = new ResizeObserver(() => {
    updateScrollState()
  })

  if (panelRef.value) {
    panelResizeObserver.observe(panelRef.value)
  }
})

onBeforeUnmount(() => {
  panelResizeObserver?.disconnect()
  panelResizeObserver = null
})
</script>

<style scoped>
.skill-orbit {
  display: grid;
  grid-template-columns: minmax(28rem, 1fr) minmax(20rem, 0.72fr);
  gap: var(--space-8);
  align-items: center;
}

.skill-orbit__map {
  position: relative;
  min-height: 40rem;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background:
    radial-gradient(circle at center, rgba(232, 168, 56, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(26, 26, 46, 0.72), rgba(13, 13, 18, 0.94));
  box-shadow: var(--shadow-card);
}

.skill-orbit__ring {
  position: absolute;
  inset: 11%;
  border: 1px solid rgba(245, 240, 232, 0.09);
  border-radius: var(--radius-full);
}

.skill-orbit__ring--inner {
  inset: 24%;
  border-color: rgba(232, 168, 56, 0.16);
}

.skill-orbit__core {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 13rem;
  aspect-ratio: 1;
  place-items: center;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(232, 168, 56, 0.42);
  border-radius: var(--radius-full);
  background: rgba(9, 9, 15, 0.86);
  box-shadow: var(--shadow-glow);
  text-align: center;
}

.skill-orbit__core span {
  align-self: end;
  color: var(--accent-amber);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.skill-orbit__core strong {
  align-self: start;
  max-width: 10ch;
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: var(--text-h3);
  line-height: var(--leading-snug);
}

.skill-orbit__node {
  position: absolute;
  top: var(--node-y);
  left: var(--node-x);
  display: grid;
  min-width: 7.5rem;
  gap: var(--space-1);
  transform: translate(-50%, -50%);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(22, 22, 42, 0.92);
  padding: var(--space-3) var(--space-4);
  color: var(--text-1);
  text-align: left;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}

.skill-orbit__node span {
  font-family: var(--font-heading);
  font-weight: 700;
}

.skill-orbit__node small {
  color: var(--text-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.skill-orbit__node--active,
.skill-orbit__node:hover,
.skill-orbit__node:focus-visible {
  border-color: var(--accent-amber);
  color: var(--text-0);
  box-shadow: var(--shadow-glow);
}

.skill-orbit__panel {
  position: relative;
  min-width: 0;
  max-height: 40rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(26, 26, 46, 0.9), rgba(9, 9, 15, 0.94));
  box-shadow: var(--shadow-card);
}

.skill-orbit__panel-scroll {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: var(--space-5);
  height: 100%;
  max-height: 40rem;
  overflow: auto;
  overscroll-behavior: contain;
  padding: var(--space-6);
  scrollbar-gutter: stable;
}

.skill-orbit__panel-kicker {
  margin: 0;
  color: var(--accent-teal);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.skill-orbit__panel h3 {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h2);
  line-height: var(--leading-snug);
}

.skill-orbit__skills {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0 0 var(--space-10);
  list-style: none;
}

.skill-orbit__skills li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-3);
  align-items: center;
  min-width: 0;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(245, 240, 232, 0.035);
  padding: var(--space-3);
}

.skill-orbit__skill--core {
  border-color: rgba(232, 168, 56, 0.42);
  box-shadow: 0 0 20px rgba(232, 168, 56, 0.09);
}

.skill-orbit__icon {
  width: 1.6rem;
  height: 1.6rem;
}

.skill-orbit__skills span {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--text-1);
}

.skill-orbit__skills strong {
  border-radius: var(--radius-full);
  background: rgba(232, 168, 56, 0.12);
  color: var(--accent-amber);
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.skill-orbit__scroll-cue {
  position: absolute;
  right: var(--space-6);
  bottom: var(--space-4);
  z-index: 2;
  display: grid;
  justify-items: center;
  gap: 0.2rem;
  padding: var(--space-6) 0 0;
  background: linear-gradient(0deg, rgba(9, 9, 15, 0.96) 35%, rgba(9, 9, 15, 0));
  color: var(--accent-amber);
  pointer-events: none;
}

.skill-orbit__scroll-cue-line {
  width: 1px;
  height: 1.75rem;
  background: color-mix(in srgb, var(--accent-amber) 72%, transparent);
}

.skill-orbit__scroll-cue-arrow {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  line-height: 1;
}

.skill-orbit__scroll-cue-text {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@media (max-width: 1279px) {
  .skill-orbit {
    grid-template-columns: 1fr;
  }

  .skill-orbit__map {
    min-height: 34rem;
  }

  .skill-orbit__panel {
    max-height: 34rem;
  }

  .skill-orbit__panel-scroll {
    max-height: 34rem;
  }
}

@media (max-width: 1023px) {
  .skill-orbit__map {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    min-height: auto;
    gap: var(--space-3);
    padding: var(--space-5);
  }

  .skill-orbit__ring {
    display: none;
  }

  .skill-orbit__core,
  .skill-orbit__node {
    position: static;
    transform: none;
  }

  .skill-orbit__core {
    grid-column: 1 / -1;
    width: auto;
    aspect-ratio: auto;
    border-radius: 8px;
    padding: var(--space-5);
  }

  .skill-orbit__core span,
  .skill-orbit__core strong {
    align-self: auto;
  }

  .skill-orbit__core strong {
    max-width: none;
  }

  .skill-orbit__node {
    min-width: 0;
    justify-items: center;
    text-align: center;
  }

  .skill-orbit__panel {
    max-height: none;
  }

  .skill-orbit__panel-scroll {
    max-height: none;
    overflow: visible;
  }

  .skill-orbit__scroll-cue {
    display: none;
  }
}

@media (max-width: 767px) {
  .skill-orbit {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-orbit__node {
    transition: none;
  }
}
</style>
