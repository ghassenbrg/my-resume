<template>
  <section
    id="projects"
    ref="sectionRef"
    class="projects-section section"
    aria-labelledby="projects-title"
  >
    <div class="section-container projects-section__container">
      <div ref="headerRef" class="projects-section__header">
        <p class="section-eyebrow">Projects</p>
        <h2 id="projects-title" class="projects-section__title">Featured Projects</h2>
      </div>

      <div v-if="cvData" ref="stackRef" class="projects-section__stack">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          ref="cardRefs"
          class="project-card"
          :class="{ 'project-card--featured': project.featured }"
          :style="{
            '--project-accent': projectAccents[index % projectAccents.length],
            '--project-offset': `${index * 0.75}rem`,
            '--project-index': projects.length - index,
          }"
        >
          <div class="project-card__shell">
            <header class="project-card__header">
              <p class="project-card__number">Project {{ index + 1 }}</p>
              <span class="project-card__role">{{ project.role }}</span>
            </header>

            <div class="project-card__body">
              <div class="project-card__intro">
                <h3>{{ project.title }}</h3>

                <a
                  v-if="project.link"
                  class="project-card__cta"
                  :href="project.link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ project.linkLabel ?? 'View' }}
                </a>
              </div>

              <ul class="project-card__outcomes">
                <li
                  v-for="outcome in project.outcomes.slice(0, 3)"
                  :key="outcome"
                >
                  {{ outcome }}
                </li>
              </ul>

              <ul class="project-card__technologies" aria-label="Technology stack">
                <li
                  v-for="technology in project.technologies"
                  :key="technology"
                >
                  {{ technology }}
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <ol v-if="cvData" class="projects-section__dots" aria-label="Project position">
        <li
          v-for="(project, index) in projects"
          :key="`${project.title}-dot`"
          :class="{ 'projects-section__dot--active': activeProjectIndex === index }"
        >
          <span class="sr-only">{{ project.title }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const stackRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const activeProjectIndex = ref(0)
const desktopQuery = ref<MediaQueryList | null>(null)
const animationCleanups: Array<() => void> = []
const scrollAnimation = useScrollAnimation()
const { cvData, loadCvData } = useCvData()

const projectAccents = ['#e8a838', '#56c4b8', '#c77dff', '#ff6b8a']
const projects = computed(() => cvData.value?.projects ?? [])

const clearStackAnimation = () => {
  while (animationCleanups.length) {
    animationCleanups.pop()?.()
  }
}

const setupStackAnimation = async () => {
  const cards = cardRefs.value
  const { $prefersReducedMotion } = useNuxtApp()

  clearStackAnimation()
  activeProjectIndex.value = 0

  if (!cards.length || $prefersReducedMotion || !(desktopQuery.value?.matches ?? false)) {
    return
  }

  const { gsap, ScrollTrigger } = await scrollAnimation.load()

  gsap.set(cards, { clearProps: 'transform,opacity' })

  cards.forEach((card, index) => {
    const tween = gsap.to(card, {
      scale: 0.9 - index * 0.02,
      y: index * -20,
      opacity: 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top top',
        scrub: true,
        pin: true,
        pinSpacing: false,
        onEnter: () => {
          activeProjectIndex.value = index
        },
        onEnterBack: () => {
          activeProjectIndex.value = index
        },
      },
    })

    animationCleanups.push(() => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(card, { clearProps: 'transform,opacity' })
    })
  })

  ScrollTrigger.refresh()
}

onMounted(async () => {
  await loadCvData()
  await nextTick()

  const { reveal } = scrollAnimation
  const { $prefersReducedMotion } = useNuxtApp()

  desktopQuery.value = window.matchMedia('(min-width: 1024px)')

  if (!$prefersReducedMotion) {
    await reveal(headerRef, {
      trigger: sectionRef.value ?? undefined,
      start: 'top 78%',
      y: 48,
    })

    if (cardRefs.value.length) {
      await reveal(cardRefs.value, {
        trigger: stackRef.value ?? undefined,
        start: 'top 72%',
        y: 36,
        stagger: 0.1,
      })
    }
  }

  await setupStackAnimation()
  desktopQuery.value.addEventListener('change', setupStackAnimation)
  window.addEventListener('resize', setupStackAnimation)
})

onBeforeUnmount(() => {
  desktopQuery.value?.removeEventListener('change', setupStackAnimation)
  window.removeEventListener('resize', setupStackAnimation)
  clearStackAnimation()
})
</script>

<style scoped>
.projects-section {
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 12%, rgba(232, 168, 56, 0.1), transparent 34%),
    linear-gradient(180deg, rgba(9, 9, 15, 0.98), rgba(13, 13, 18, 0.94));
}

.projects-section__container {
  display: grid;
  gap: var(--space-10);
  padding-block: var(--space-24);
}

.projects-section__header {
  display: grid;
  gap: var(--space-3);
}

.projects-section__title {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h1);
  line-height: var(--leading-snug);
}

.projects-section__stack {
  display: grid;
  gap: 28svh;
  min-width: 0;
}

.project-card {
  --project-accent: var(--accent-amber);
  --project-offset: 0;
  --project-index: 1;

  position: relative;
  z-index: var(--project-index);
  width: min(100%, 60rem);
  margin-inline: auto;
  padding-top: var(--project-offset);
  transform-origin: top center;
  will-change: transform, opacity;
}

.project-card__shell {
  display: grid;
  min-height: 30rem;
  align-content: space-between;
  gap: var(--space-8);
  border: 1px solid color-mix(in srgb, var(--project-accent) 42%, var(--border-subtle));
  border-radius: 8px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--project-accent) 10%, transparent), transparent 48%),
    linear-gradient(180deg, rgba(26, 26, 46, 0.96), rgba(9, 9, 15, 0.97));
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.44),
    0 4px 0 color-mix(in srgb, var(--project-accent) 26%, transparent);
  padding: var(--space-8);
}

.project-card--featured .project-card__shell {
  box-shadow:
    0 28px 88px rgba(0, 0, 0, 0.5),
    0 0 34px color-mix(in srgb, var(--project-accent) 16%, transparent),
    0 4px 0 color-mix(in srgb, var(--project-accent) 32%, transparent);
}

.project-card__header,
.project-card__intro {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-6);
}

.project-card__number {
  margin: 0;
  color: var(--accent-teal);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.project-card__role {
  border: 1px solid color-mix(in srgb, var(--project-accent) 42%, var(--border-subtle));
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--project-accent) 12%, transparent);
  color: var(--text-0);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.project-card__body {
  display: grid;
  gap: var(--space-8);
}

.project-card h3 {
  max-width: 13ch;
  margin: 0;
  color: var(--text-0);
  font-size: clamp(2.25rem, 6vw, 5.5rem);
  line-height: var(--leading-tight);
}

.project-card__cta {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--accent-amber);
  border-radius: 8px;
  background: var(--accent-amber);
  color: #09090f;
  padding: var(--space-3) var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
}

.project-card__cta:hover,
.project-card__cta:focus-visible {
  background: var(--text-0);
  border-color: var(--text-0);
}

.project-card__outcomes {
  display: grid;
  max-width: 42rem;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card__outcomes li {
  position: relative;
  padding-left: var(--space-5);
  color: var(--text-1);
  font-size: var(--text-body);
  line-height: var(--leading-normal);
}

.project-card__outcomes li::before {
  position: absolute;
  top: 0.75em;
  left: 0;
  width: 0.45rem;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--project-accent);
  content: '';
}

.project-card__technologies {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card__technologies li {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background: rgba(245, 240, 232, 0.045);
  color: var(--text-1);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.projects-section__dots {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.projects-section__dots li {
  width: 0.65rem;
  aspect-ratio: 1;
  border: 1px solid var(--border-hover);
  border-radius: var(--radius-full);
  background: transparent;
}

.projects-section__dot--active {
  border-color: var(--accent-amber) !important;
  background: var(--accent-amber) !important;
}

@media (max-width: 1023px) {
  .projects-section__stack {
    gap: var(--space-6);
  }

  .project-card {
    padding-top: var(--project-offset);
  }

  .project-card__shell {
    min-height: 28rem;
  }
}

@media (max-width: 767px) {
  .projects-section__container {
    gap: var(--space-6);
    padding-block: var(--space-16);
  }

  .projects-section__stack {
    gap: var(--space-5);
  }

  .project-card {
    padding-top: 0;
  }

  .project-card__shell {
    min-height: auto;
    gap: var(--space-6);
    padding: var(--space-5);
  }

  .project-card__header,
  .project-card__intro {
    display: grid;
    gap: var(--space-4);
  }

  .project-card__role {
    justify-self: start;
  }

  .project-card h3 {
    max-width: none;
    font-size: var(--text-h1);
  }

  .project-card__cta {
    justify-self: start;
  }

  .project-card__outcomes li {
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    will-change: auto;
  }
}
</style>
