<template>
  <section
    id="about"
    ref="sectionRef"
    class="about-section section"
    aria-labelledby="about-title"
  >
    <div class="section-container">
      <div class="about-section__header">
        <p class="section-eyebrow">{{ uiCopy.about.eyebrow }}</p>
        <h2 id="about-title" class="about-section__title">{{ uiCopy.about.title }}</h2>
      </div>

      <div v-if="cvData" class="about-section__split">
        <aside ref="statsRef" class="about-section__stats surface" :aria-label="uiCopy.about.professionalSummary">
          <dl class="about-section__stat-list">
            <div
              v-for="(stat, index) in stats"
              :key="stat.label"
              class="about-section__stat"
            >
              <dt>{{ stat.label }}</dt>
              <dd>
                <span
                  :ref="(element) => setStatValueRef(element, index)"
                  class="about-section__stat-value"
                >
                  {{ stat.current }}
                </span>
                <span v-if="stat.suffix" class="about-section__stat-suffix">{{ stat.suffix }}</span>
              </dd>
            </div>
          </dl>
        </aside>

        <div ref="copyRef" class="about-section__copy surface">
          <p
            v-for="paragraph in cvData.about.paragraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <div v-if="cvData" ref="bentoRef" class="about-section__bento" :aria-label="uiCopy.about.keyDifferentiators">
        <article v-if="primaryCertification" class="about-card about-card--cert">
          <div>
            <p class="about-card__kicker">{{ uiCopy.about.cards.certified }}</p>
            <h3>{{ primaryCertification.name }}</h3>
            <p>{{ primaryCertification.issuer }} · {{ primaryCertification.date }}</p>
          </div>
          <a
            v-if="primaryCertification.link"
            class="about-card__badge-link"
            :href="primaryCertification.link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${uiCopy.about.cards.openCredential} ${primaryCertification.name}`"
          >
            <img
              v-if="shouldShowCertificationImage(primaryCertification.image)"
              :src="primaryCertification.image"
              :alt="primaryCertification.name"
              width="148"
              height="148"
              loading="lazy"
              @error="markCertificationImageFailed(primaryCertification.image)"
            >
            <span
              v-else
              class="about-card__badge-fallback"
              aria-hidden="true"
            >
              OCP
            </span>
          </a>
          <img
            v-else-if="shouldShowCertificationImage(primaryCertification.image)"
            :src="primaryCertification.image"
            :alt="primaryCertification.name"
            width="148"
            height="148"
            loading="lazy"
            @error="markCertificationImageFailed(primaryCertification.image)"
          >
          <span
            v-else
            class="about-card__badge-fallback"
            :aria-label="uiCopy.about.cards.certificationUnavailable"
          >
            OCP
          </span>
        </article>

        <article class="about-card about-card--stack">
          <p class="about-card__kicker">{{ uiCopy.about.cards.fullStack }}</p>
          <h3>{{ uiCopy.about.cards.fullStackTitle }}</h3>
          <ul class="about-card__skill-icons" :aria-label="uiCopy.about.cards.highlightedTech">
            <li
              v-for="skill in highlightedSkills"
              :key="skill.name"
              :aria-label="skill.name"
            >
              <span aria-hidden="true">{{ skill.icon }}</span>
              <strong>{{ skill.name }}</strong>
            </li>
          </ul>
        </article>

        <article class="about-card about-card--languages">
          <p class="about-card__kicker">{{ uiCopy.about.cards.multilingual }}</p>
          <h3>{{ uiCopy.about.cards.multilingualTitle }}</h3>
          <ul class="about-card__language-list">
            <li
              v-for="language in cvData.languages"
              :key="language.language"
            >
              <span>{{ language.code ?? language.flag ?? language.language.slice(0, 2).toUpperCase() }}</span>
              <strong>{{ language.language }}</strong>
              <small>{{ language.level }}</small>
            </li>
          </ul>
        </article>

        <article class="about-card about-card--architecture">
          <p class="about-card__kicker">{{ uiCopy.about.cards.cleanArchitecture }}</p>
          <h3>{{ uiCopy.about.cards.architectureTitle }}</h3>
          <p>{{ architectureStatement }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Skill } from '~/types/cv'

interface StatItem {
  label: string
  target: number
  current: number
  suffix?: string
}

const sectionRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)
const bentoRef = ref<HTMLElement | null>(null)
const statValueRefs = ref<HTMLElement[]>([])
const scrollAnimation = useScrollAnimation()
const counterTweens: Array<{ kill: () => void; scrollTrigger?: { kill: () => void } | null }> = []
const { cvData, loadCvData, uiCopy } = useCvData()

const stats = reactive<StatItem[]>([
  {
    label: '',
    target: 0,
    current: 0,
    suffix: '+',
  },
  {
    label: '',
    target: 0,
    current: 0,
  },
  {
    label: '',
    target: 0,
    current: 0,
  },
])

const syncStats = () => {
  stats[0].label = uiCopy.value.about.stats.years
  stats[1].label = uiCopy.value.about.stats.companies
  stats[2].label = uiCopy.value.about.stats.certification

  if (!cvData.value) {
    return
  }

  stats[0].target = cvData.value.about.stats.yearsExperience
  stats[0].current = cvData.value.about.stats.yearsExperience
  stats[1].target = cvData.value.about.stats.companiesWorked
  stats[1].current = cvData.value.about.stats.companiesWorked
  stats[2].target = cvData.value.about.stats.certificationsCount
  stats[2].current = cvData.value.about.stats.certificationsCount
}

const primaryCertification = computed(() => cvData.value?.certifications[0] ?? null)
const failedCertificationImages = ref<Set<string>>(new Set())
const architectureStatement = computed(() => {
  const paragraphs = cvData.value?.about.paragraphs ?? []

  return (
    paragraphs.find((paragraph) => paragraph.toLowerCase().includes('clean architecture')) ??
    paragraphs[paragraphs.length - 1] ??
    ''
  )
})

const highlightedSkills = computed(() => {
  const fullStackSkills = Object.values(cvData.value?.skills ?? {})
    .flat()
    .filter((skill) => skill.highlight)
  const iconLabels: Record<string, string> = {
    Java: 'J',
    'Spring Boot': 'SB',
    Angular: 'A',
    TypeScript: 'TS',
  }

  return fullStackSkills
    .slice(0, 4)
    .map((skill): Skill => ({
      ...skill,
      icon: iconLabels[skill.name] ?? skill.name.slice(0, 2).toUpperCase(),
    }))
})

const setStatValueRef = (element: Element | ComponentPublicInstance | null, index: number) => {
  if (element instanceof HTMLElement) {
    statValueRefs.value[index] = element
  }
}

const shouldShowCertificationImage = (image?: string) => {
  return Boolean(image && !failedCertificationImages.value.has(image))
}

const markCertificationImageFailed = (image?: string) => {
  if (!image) {
    return
  }

  failedCertificationImages.value = new Set([...failedCertificationImages.value, image])
}

onMounted(async () => {
  await loadCvData()
  syncStats()
  await nextTick()

  const { $loadGsap, $prefersReducedMotion } = useNuxtApp()
  const { reveal, refresh } = scrollAnimation

  if ($prefersReducedMotion) {
    for (const stat of stats) {
      stat.current = stat.target
    }
    return
  }

  const { gsap } = await $loadGsap()

  for (const stat of stats) {
    stat.current = 0
  }

  await reveal(sectionRef, {
    trigger: sectionRef.value ?? undefined,
    start: 'top 78%',
    y: 50,
  })

  const paragraphElements = copyRef.value?.querySelectorAll('p')
  if (paragraphElements?.length) {
    await reveal(Array.from(paragraphElements), {
      trigger: copyRef.value ?? undefined,
      start: 'top 70%',
      y: 32,
      stagger: 0.12,
      duration: 0.7,
    })
  }

  const bentoCards = bentoRef.value?.children ? Array.from(bentoRef.value.children) : []
  if (bentoCards.length) {
    await reveal(bentoCards, {
      trigger: bentoRef.value ?? undefined,
      start: 'top 75%',
      y: 36,
      stagger: 0.1,
      duration: 0.65,
    })
  }

  for (const [index, element] of statValueRefs.value.entries()) {
    const stat = stats[index]

    if (!stat) {
      continue
    }

    const counterTween = gsap.to(stat, {
      current: stat.target,
      duration: 2,
      ease: 'power1.inOut',
      snap: {
        current: 1,
      },
      scrollTrigger: {
        trigger: statsRef.value,
        start: 'top 70%',
      },
      onUpdate: () => {
        element.textContent = String(stat.current)
      },
      onComplete: () => {
        element.textContent = String(stat.target)
      },
    })

    counterTweens.push(counterTween)
  }

  await refresh()
})

onBeforeUnmount(() => {
  for (const tween of counterTweens) {
    tween.scrollTrigger?.kill()
    tween.kill()
  }

  counterTweens.length = 0
})

watch([cvData, uiCopy], () => {
  syncStats()
})
</script>

<style scoped>
.about-section {
  background:
    linear-gradient(180deg, rgba(9, 9, 15, 0), rgba(26, 26, 46, 0.54) 44%, rgba(9, 9, 15, 0)),
    var(--bg-1);
}

.about-section__header {
  max-width: 44rem;
  margin-bottom: var(--space-12);
}

.about-section__title {
  max-width: 12ch;
  color: var(--text-0);
  font-size: var(--text-h1);
  letter-spacing: 0;
  line-height: var(--leading-snug);
}

.about-section__split {
  display: grid;
  grid-template-columns: minmax(15rem, 0.8fr) minmax(0, 1.4fr);
  gap: var(--space-6);
  align-items: stretch;
}

.about-section__stats,
.about-section__copy,
.about-card {
  border-radius: 8px;
}

.about-section__stats {
  padding: var(--space-8);
}

.about-section__stat-list {
  display: grid;
  gap: var(--space-8);
  height: 100%;
  margin: 0;
}

.about-section__stat {
  display: grid;
  gap: var(--space-2);
  align-content: center;
  min-height: 7rem;
  border-bottom: 1px solid var(--border-subtle);
}

.about-section__stat:last-child {
  border-bottom: 0;
}

.about-section__stat dt {
  color: var(--text-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0;
  text-transform: uppercase;
}

.about-section__stat dd {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  margin: 0;
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 0.9;
}

.about-section__stat-suffix {
  color: var(--accent-amber);
  font-size: 0.55em;
}

.about-section__copy {
  position: relative;
  display: grid;
  align-content: center;
  gap: var(--space-5);
  padding: var(--space-8);
}

.about-section__copy::before {
  content: "";
  position: absolute;
  top: var(--space-8);
  bottom: var(--space-8);
  left: var(--space-5);
  width: 2px;
  background: linear-gradient(180deg, var(--accent-amber), rgba(86, 196, 184, 0.1));
}

.about-section__copy p {
  max-width: 58ch;
  margin: 0;
  padding-left: var(--space-8);
  color: var(--text-1);
  font-size: var(--text-body);
  line-height: var(--leading-relaxed);
}

.about-section__bento {
  display: grid;
  grid-template-columns: 1.15fr 0.9fr 0.95fr;
  grid-auto-rows: minmax(14rem, auto);
  gap: var(--space-5);
  margin-top: var(--space-6);
}

.about-card {
  position: relative;
  display: grid;
  gap: var(--space-5);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background: linear-gradient(145deg, rgba(22, 22, 42, 0.94), rgba(13, 13, 18, 0.94));
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}

.about-card--cert {
  grid-row: span 2;
  align-content: space-between;
}

.about-card--stack {
  border-color: rgba(232, 168, 56, 0.34);
}

.about-card--languages {
  border-color: rgba(86, 196, 184, 0.3);
}

.about-card--architecture {
  grid-column: span 2;
  border-color: rgba(199, 125, 255, 0.28);
}

.about-card__kicker {
  margin: 0;
  color: var(--accent-amber);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0;
  text-transform: uppercase;
}

.about-card h3 {
  max-width: 16ch;
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h3);
  letter-spacing: 0;
  line-height: var(--leading-snug);
}

.about-card p {
  margin: 0;
  color: var(--text-2);
}

.about-card__badge-link {
  display: inline-grid;
  width: fit-content;
  border-radius: 8px;
}

.about-card img {
  width: min(9.25rem, 52vw);
  height: auto;
  border-radius: 8px;
  background: var(--text-0);
  padding: var(--space-2);
}

.about-card__badge-fallback {
  display: grid;
  width: min(9.25rem, 52vw);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgba(232, 168, 56, 0.38);
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(232, 168, 56, 0.18), rgba(9, 9, 15, 0.94));
  color: var(--accent-amber);
  font-family: var(--font-heading);
  font-size: var(--text-h3);
  font-weight: 700;
}

.about-card__skill-icons,
.about-card__language-list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.about-card__skill-icons li,
.about-card__language-list li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.about-card__skill-icons span,
.about-card__language-list span {
  display: grid;
  flex: 0 0 auto;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(245, 240, 232, 0.04);
  color: var(--accent-amber);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 700;
}

.about-card__skill-icons strong,
.about-card__language-list strong {
  color: var(--text-1);
  font-weight: 600;
}

.about-card__language-list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: var(--space-3);
  row-gap: var(--space-1);
}

.about-card__language-list span {
  grid-row: span 2;
  color: var(--accent-teal);
}

.about-card__language-list small {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--text-2);
  font-size: var(--text-small);
}

@media (max-width: 1023px) {
  .about-section__split,
  .about-section__bento {
    grid-template-columns: 1fr 1fr;
  }

  .about-card--cert,
  .about-card--architecture {
    grid-column: span 2;
    grid-row: auto;
  }
}

@media (max-width: 767px) {
  .about-section__title {
    max-width: 100%;
  }

  .about-section__split,
  .about-section__bento {
    grid-template-columns: 1fr;
  }

  .about-card--cert,
  .about-card--architecture {
    grid-column: auto;
  }

  .about-section__stats,
  .about-section__copy,
  .about-card {
    padding: var(--space-5);
  }

  .about-section__stat-list {
    gap: var(--space-4);
  }

  .about-section__stat {
    min-height: auto;
    padding-bottom: var(--space-4);
  }

  .about-section__copy::before {
    left: var(--space-4);
  }

  .about-section__copy p {
    padding-left: var(--space-6);
  }
}
</style>
