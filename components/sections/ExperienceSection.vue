<template>
  <section
    id="experience"
    ref="sectionRef"
    class="experience-section section"
    aria-labelledby="experience-title"
  >
    <div ref="pinRef" class="experience-section__pin">
      <div class="section-container experience-section__container">
        <div ref="headerRef" class="experience-section__header">
          <p class="section-eyebrow">Experience</p>
          <h2 id="experience-title" class="experience-section__title">Professional Experience</h2>
        </div>

        <div class="experience-section__viewport">
          <div ref="trackRef" class="experience-section__track">
            <article
              v-for="(experience, index) in cvData.experience"
              :key="`${experience.company}-${experience.period}`"
              ref="cardRefs"
              class="experience-card"
              :style="{ '--experience-accent': experience.accentColor ?? fallbackAccents[index % fallbackAccents.length] }"
            >
              <header class="experience-card__header">
                <div class="experience-card__mark" aria-hidden="true">
                  {{ getCompanyMark(experience.company) }}
                </div>

                <div class="experience-card__identity">
                  <p class="experience-card__company">{{ experience.company }}</p>
                  <h3>{{ experience.position }}</h3>
                  <p>{{ experience.location }} · {{ experience.period }}</p>
                </div>

                <span
                  v-if="isCurrentExperience(experience.period)"
                  class="experience-card__current"
                >
                  <span aria-hidden="true"></span>
                  Current
                </span>
              </header>

              <p class="experience-card__description">{{ experience.description }}</p>

              <ul class="experience-card__achievements">
                <li
                  v-for="achievement in experience.achievements"
                  :key="achievement"
                >
                  {{ achievement }}
                </li>
              </ul>
            </article>
          </div>
        </div>

        <div class="experience-section__progress" aria-hidden="true">
          <span class="experience-section__progress-track">
            <span ref="progressRef" class="experience-section__progress-bar"></span>
          </span>
          <ol class="experience-section__progress-labels">
            <li
              v-for="(experience, index) in cvData.experience"
              :key="experience.company"
            >
              Job {{ index + 1 }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Experience } from '~/types/cv'
import { cvData } from '~/data/cv-data'

const sectionRef = ref<HTMLElement | null>(null)
const pinRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const fallbackAccents = ['#56c4b8', '#e8a838', '#c77dff']
const scrollAnimation = useScrollAnimation()
const desktopQuery = ref<MediaQueryList | null>(null)
const animationCleanups: Array<() => void> = []

const isCurrentExperience = (period: string) => period.toLowerCase().includes('present')

const getCompanyMark = (company: string) => {
  const normalizedName = company.replace(/\(.+\)/, '').trim()

  return normalizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const clearAnimations = () => {
  while (animationCleanups.length) {
    animationCleanups.pop()?.()
  }
}

const setupHorizontalScroll = () => {
  const pin = pinRef.value
  const track = trackRef.value
  const progress = progressRef.value
  const cards = cardRefs.value
  const { gsap, ScrollTrigger } = scrollAnimation
  const { $prefersReducedMotion } = useNuxtApp()

  clearAnimations()

  if (!pin || !track || !progress || cards.length === 0 || $prefersReducedMotion) {
    return
  }

  gsap.set(progress, {
    scaleX: 0,
    transformOrigin: 'left center',
  })

  if (!(desktopQuery.value?.matches ?? false)) {
    return
  }

  const tween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${cards.length * window.innerWidth * 0.8}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(progress, {
          scaleX: self.progress,
        })
      },
    },
  })

  animationCleanups.push(() => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.set(track, { clearProps: 'transform' })
    gsap.set(progress, { clearProps: 'transform' })
  })

  ScrollTrigger.refresh()
}

onMounted(async () => {
  await nextTick()

  const { reveal } = scrollAnimation
  const { $prefersReducedMotion } = useNuxtApp()

  desktopQuery.value = window.matchMedia('(min-width: 1024px)')

  if (!$prefersReducedMotion) {
    reveal(headerRef, {
      trigger: sectionRef.value ?? undefined,
      start: 'top 78%',
      y: 48,
    })

    if (cardRefs.value.length) {
      reveal(cardRefs.value, {
        trigger: sectionRef.value ?? undefined,
        start: 'top 65%',
        y: 36,
        stagger: 0.12,
      })
    }
  }

  setupHorizontalScroll()
  desktopQuery.value.addEventListener('change', setupHorizontalScroll)
  window.addEventListener('resize', setupHorizontalScroll)
})

onBeforeUnmount(() => {
  desktopQuery.value?.removeEventListener('change', setupHorizontalScroll)
  window.removeEventListener('resize', setupHorizontalScroll)
  clearAnimations()
})
</script>

<style scoped>
.experience-section {
  min-height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 28%, rgba(86, 196, 184, 0.08), transparent 34%),
    linear-gradient(180deg, rgba(9, 9, 15, 0), rgba(13, 13, 18, 0.92));
}

.experience-section__pin {
  min-height: 100svh;
  padding-block: var(--space-20);
}

.experience-section__container {
  display: grid;
  min-height: calc(100svh - var(--space-32));
  align-content: center;
  gap: var(--space-10);
}

.experience-section__header {
  display: grid;
  gap: var(--space-3);
}

.experience-section__title {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h1);
  line-height: var(--leading-snug);
}

.experience-section__viewport {
  min-width: 0;
  overflow: visible;
}

.experience-section__track {
  display: flex;
  gap: var(--space-6);
  width: max-content;
  will-change: transform;
}

.experience-card {
  --experience-accent: var(--accent-amber);

  display: grid;
  flex: 0 0 min(80vw, 58rem);
  min-height: 28rem;
  gap: var(--space-6);
  align-content: start;
  border: 1px solid color-mix(in srgb, var(--experience-accent) 38%, var(--border-subtle));
  border-radius: 8px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--experience-accent) 9%, transparent), transparent 44%),
    linear-gradient(180deg, rgba(26, 26, 46, 0.94), rgba(13, 13, 18, 0.96));
  padding: var(--space-8);
  box-shadow: var(--shadow-card);
}

.experience-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-5);
  align-items: start;
}

.experience-card__mark {
  display: grid;
  width: 4.5rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--experience-accent) 46%, var(--border-subtle));
  border-radius: 8px;
  background: color-mix(in srgb, var(--experience-accent) 12%, transparent);
  color: var(--experience-accent);
  font-family: var(--font-heading);
  font-size: var(--text-h3);
  font-weight: 700;
}

.experience-card__identity {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}

.experience-card__company {
  margin: 0;
  color: var(--experience-accent);
  font-family: var(--font-mono);
  font-size: var(--text-small);
}

.experience-card h3 {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h2);
  line-height: var(--leading-snug);
}

.experience-card__identity p:last-child,
.experience-card__description {
  margin: 0;
  color: var(--text-2);
}

.experience-card__current {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid rgba(86, 196, 184, 0.34);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-3);
  color: var(--accent-teal);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.experience-card__current span {
  width: 0.55rem;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--accent-teal);
  box-shadow: 0 0 0 0 rgba(86, 196, 184, 0.5);
  animation: pulse 1.8s infinite;
}

.experience-card__description {
  max-width: 56ch;
  font-size: var(--text-body);
}

.experience-card__achievements {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.experience-card__achievements li {
  flex: 1 1 18rem;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(245, 240, 232, 0.035);
  padding: var(--space-3) var(--space-4);
  color: var(--text-1);
  font-size: var(--text-small);
  line-height: var(--leading-normal);
}

.experience-section__progress {
  display: grid;
  gap: var(--space-3);
}

.experience-section__progress-track {
  display: block;
  height: 0.2rem;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: var(--border-subtle);
}

.experience-section__progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--gradient-amber);
  transform: scaleX(0);
  transform-origin: left center;
}

.experience-section__progress-labels {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  color: var(--text-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  list-style: none;
}

@media (max-width: 1023px) {
  .experience-section {
    overflow: hidden;
  }

  .experience-section__pin {
    min-height: auto;
  }

  .experience-section__container {
    min-height: auto;
  }

  .experience-section__viewport {
    overflow-x: auto;
    padding-bottom: var(--space-4);
    scroll-snap-type: x mandatory;
  }

  .experience-section__track {
    width: max-content;
  }

  .experience-card {
    flex-basis: min(82vw, 42rem);
    scroll-snap-align: start;
  }

  .experience-section__progress-bar {
    transform: scaleX(1);
  }
}

@media (max-width: 767px) {
  .experience-section {
    overflow: visible;
  }

  .experience-section__track {
    display: grid;
    width: 100%;
  }

  .experience-section__viewport {
    overflow: visible;
    padding-bottom: 0;
    scroll-snap-type: none;
  }

  .experience-card {
    flex-basis: auto;
    min-height: auto;
    padding: var(--space-5);
  }

  .experience-card__header {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .experience-card__current {
    grid-column: 1 / -1;
    width: fit-content;
  }

  .experience-card__mark {
    width: 3.5rem;
  }

  .experience-card__achievements {
    display: grid;
  }

  .experience-card__achievements li {
    flex-basis: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-section__track {
    transform: none !important;
  }

  .experience-card__current span {
    animation: none;
  }
}
</style>
