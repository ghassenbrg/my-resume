<template>
  <section
    id="languages"
    ref="sectionRef"
    class="languages-section section"
    aria-labelledby="languages-title"
  >
    <div class="section-container languages-section__container">
      <div ref="headerRef" class="languages-section__header">
        <p class="section-eyebrow">{{ uiCopy.languages.eyebrow }}</p>
        <h2 id="languages-title" class="languages-section__title">{{ uiCopy.languages.title }}</h2>
      </div>

      <div v-if="cvData" class="languages-section__content languages-section__visual">
        <div ref="chartRef" class="language-chart" :aria-label="uiCopy.languages.radialChart">
          <svg
            class="language-chart__svg"
            viewBox="0 0 420 420"
            role="img"
            aria-labelledby="language-chart-title"
          >
            <title id="language-chart-title">{{ uiCopy.languages.radialChartTitle }}</title>
            <circle
              v-for="language in visualLanguages"
              :key="`${language.language}-track`"
              class="language-chart__track"
              cx="210"
              cy="210"
              :r="language.radius"
              :stroke-width="language.strokeWidth"
            />
            <circle
              v-for="language in visualLanguages"
              :key="language.language"
              class="language-chart__arc"
              cx="210"
              cy="210"
              :r="language.radius"
              :stroke-width="language.strokeWidth"
              :stroke="language.accent"
              :stroke-dasharray="language.circumference"
              :stroke-dashoffset="getStrokeOffset(language)"
            />
          </svg>

          <div class="language-chart__core">
            <strong>{{ visualLanguages.length }}</strong>
            <span>{{ uiCopy.languages.countLabel }}</span>
          </div>
        </div>

        <div ref="labelsRef" class="languages-section__labels">
          <article
            v-for="language in visualLanguages"
            :key="language.language"
            class="language-label"
            :style="{ '--language-accent': language.accent }"
          >
            <span class="language-label__marker">{{ language.code }}</span>
            <div>
              <h3>{{ language.language }}</h3>
              <p>{{ language.level }}</p>
            </div>
            <strong>{{ Math.round(language.current) }}%</strong>
          </article>
        </div>
      </div>

      <div v-if="cvData" ref="barsRef" class="languages-section__bars" :aria-label="uiCopy.languages.barsLabel">
        <article
          v-for="language in visualLanguages"
          :key="`${language.language}-bar`"
          class="language-bar"
          :style="{ '--language-accent': language.accent, '--language-progress': `${language.current}%` }"
        >
          <header>
            <span>{{ language.code }}</span>
            <h3>{{ language.language }}</h3>
            <strong>{{ Math.round(language.current) }}%</strong>
          </header>
          <p>{{ language.level }}</p>
          <div class="language-bar__track" aria-hidden="true">
            <span></span>
          </div>
        </article>
      </div>

      <p ref="contextRef" class="languages-section__context">
        {{ uiCopy.languages.context }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Language } from '~/types/cv'

interface VisualLanguage extends Language {
  code: string
  accent: string
  radius: number
  strokeWidth: number
  circumference: number
  current: number
}

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const chartRef = ref<HTMLElement | null>(null)
const labelsRef = ref<HTMLElement | null>(null)
const barsRef = ref<HTMLElement | null>(null)
const contextRef = ref<HTMLElement | null>(null)
const scrollAnimation = useScrollAnimation()
const { cvData, loadCvData, uiCopy } = useCvData()
const progressTweens: Array<{ kill: () => void; scrollTrigger?: { kill: () => void } | null }> = []

const languageAccents = ['#e8a838', '#56c4b8', '#c77dff', '#ff6b8a']
const outerRadius = 176
const radiusStep = 34
const strokeWidth = 12

const visualLanguages = ref<VisualLanguage[]>([])

const syncVisualLanguages = () => {
  visualLanguages.value = (cvData.value?.languages ?? []).map((language, index) => {
    const radius = outerRadius - index * radiusStep

    return {
      ...language,
      code: language.code ?? language.flag ?? language.language.slice(0, 2).toUpperCase(),
      accent: languageAccents[index % languageAccents.length],
      radius,
      strokeWidth,
      circumference: 2 * Math.PI * radius,
      current: language.percentage,
    }
  })
}

const getStrokeOffset = (language: VisualLanguage) => {
  return language.circumference * (1 - language.current / 100)
}

const clearProgressTweens = () => {
  while (progressTweens.length) {
    const tween = progressTweens.pop()
    tween?.scrollTrigger?.kill()
    tween?.kill()
  }
}

onMounted(async () => {
  await loadCvData()
  syncVisualLanguages()
  await nextTick()

  const { reveal } = scrollAnimation
  const { $prefersReducedMotion } = useNuxtApp()

  if ($prefersReducedMotion) {
    for (const language of visualLanguages.value) {
      language.current = language.percentage
    }
    return
  }

  const { gsap } = await scrollAnimation.load()

  await reveal(headerRef, {
    trigger: sectionRef.value ?? undefined,
    start: 'top 78%',
    y: 48,
  })

  if (chartRef.value) {
    await reveal(chartRef, {
      trigger: chartRef.value,
      start: 'top 72%',
      y: 36,
    })
  }

  const labelCards = labelsRef.value?.children ? Array.from(labelsRef.value.children) : []
  if (labelCards.length) {
    await reveal(labelCards, {
      trigger: labelsRef.value ?? undefined,
      start: 'top 74%',
      y: 28,
      stagger: 0.08,
    })
  }

  const barCards = barsRef.value?.children ? Array.from(barsRef.value.children) : []
  if (barCards.length) {
    await reveal(barCards, {
      trigger: barsRef.value ?? undefined,
      start: 'top 78%',
      y: 28,
      stagger: 0.08,
    })
  }

  await reveal(contextRef, {
    trigger: contextRef.value ?? undefined,
    start: 'top 82%',
    y: 24,
  })

  for (const language of visualLanguages.value) {
    language.current = 0

    const tween = gsap.to(language, {
      current: language.percentage,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value ?? chartRef.value ?? undefined,
        start: 'top 68%',
      },
    })

    progressTweens.push(tween)
  }
})

onBeforeUnmount(() => {
  clearProgressTweens()
})

watch(cvData, () => {
  syncVisualLanguages()
})
</script>

<style scoped>
.languages-section {
  scroll-margin-top: var(--space-20);
  overflow: hidden;
  background:
    radial-gradient(circle at 78% 28%, rgba(86, 196, 184, 0.1), transparent 34%),
    linear-gradient(180deg, rgba(9, 9, 15, 0.98), rgba(13, 13, 18, 0.96));
}

.languages-section__container {
  display: grid;
  gap: var(--space-10);
  padding-block: var(--space-24);
}

.languages-section__header {
  display: grid;
  gap: var(--space-3);
}

.languages-section__title {
  max-width: 12ch;
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h1);
  line-height: var(--leading-snug);
}

.languages-section__content {
  display: grid;
  grid-template-columns: minmax(20rem, 0.92fr) minmax(18rem, 0.78fr);
  gap: var(--space-10);
  align-items: center;
}

.language-chart {
  position: relative;
  display: grid;
  width: min(100%, 34rem);
  aspect-ratio: 1;
  place-items: center;
  margin-inline: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background:
    radial-gradient(circle at center, rgba(232, 168, 56, 0.12), transparent 26%),
    linear-gradient(180deg, rgba(26, 26, 46, 0.72), rgba(9, 9, 15, 0.9));
  box-shadow: var(--shadow-card);
}

.language-chart__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.language-chart__track,
.language-chart__arc {
  fill: none;
}

.language-chart__track {
  stroke: rgba(245, 240, 232, 0.08);
}

.language-chart__arc {
  stroke-linecap: round;
  transition: stroke-dashoffset 80ms linear;
}

.language-chart__core {
  position: absolute;
  display: grid;
  width: 11rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgba(232, 168, 56, 0.42);
  border-radius: var(--radius-full);
  background: rgba(9, 9, 15, 0.9);
  box-shadow: var(--shadow-glow);
  text-align: center;
}

.language-chart__core strong {
  align-self: end;
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: var(--text-h1);
  line-height: 1;
}

.language-chart__core span {
  align-self: start;
  color: var(--accent-amber);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.languages-section__labels {
  display: grid;
  gap: var(--space-3);
}

.language-label {
  --language-accent: var(--accent-amber);

  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-4);
  align-items: center;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--language-accent) 36%, var(--border-subtle));
  border-radius: 8px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--language-accent) 9%, transparent), transparent 46%),
    rgba(22, 22, 42, 0.86);
  padding: var(--space-4);
  box-shadow: var(--shadow-card);
}

.language-label__marker {
  display: grid;
  width: 3rem;
  aspect-ratio: 1;
  place-items: center;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--language-accent) 18%, transparent);
  color: var(--language-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 700;
}

.language-label h3,
.language-bar h3 {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h3);
  line-height: var(--leading-snug);
}

.language-label p,
.language-bar p {
  margin: var(--space-1) 0 0;
  color: var(--text-2);
  line-height: var(--leading-normal);
}

.language-label strong {
  color: var(--language-accent);
  font-family: var(--font-heading);
  font-size: var(--text-h3);
}

.languages-section__bars {
  display: none;
}

.languages-section__context {
  max-width: 54rem;
  margin: 0;
  border-left: 1px solid var(--accent-amber);
  color: var(--text-1);
  padding-left: var(--space-5);
  font-size: var(--text-body);
  line-height: var(--leading-normal);
}

.language-bar {
  --language-accent: var(--accent-amber);
  --language-progress: 0%;

  display: grid;
  gap: var(--space-3);
  border: 1px solid color-mix(in srgb, var(--language-accent) 36%, var(--border-subtle));
  border-radius: 8px;
  background: rgba(22, 22, 42, 0.86);
  padding: var(--space-4);
}

.language-bar header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-3);
  align-items: center;
}

.language-bar header span {
  display: grid;
  width: 2.5rem;
  aspect-ratio: 1;
  place-items: center;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--language-accent) 18%, transparent);
  color: var(--language-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 700;
}

.language-bar header strong {
  color: var(--language-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.language-bar__track {
  height: 0.65rem;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: rgba(245, 240, 232, 0.08);
}

.language-bar__track span {
  display: block;
  width: var(--language-progress);
  height: 100%;
  border-radius: inherit;
  background: var(--language-accent);
  transition: width 80ms linear;
}

@media (max-width: 1023px) {
  .languages-section__content {
    grid-template-columns: 1fr;
  }

  .languages-section__title {
    max-width: none;
  }
}

@media (max-width: 767px) {
  .languages-section__container {
    gap: var(--space-6);
    padding-block: var(--space-32) var(--space-16);
  }

  .languages-section__content {
    display: none;
  }

  .languages-section__bars {
    display: grid;
    gap: var(--space-3);
  }

  .languages-section__context {
    padding-left: var(--space-4);
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .language-chart__arc,
  .language-bar__track span {
    transition: none;
  }
}
</style>
