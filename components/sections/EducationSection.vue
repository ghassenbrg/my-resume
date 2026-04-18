<template>
  <section
    id="education"
    ref="sectionRef"
    class="education-section section"
    aria-labelledby="education-title"
  >
    <div class="section-container education-section__container">
      <div ref="headerRef" class="education-section__header">
        <p class="section-eyebrow">Credentials</p>
        <h2 id="education-title" class="education-section__title">Education & Certifications</h2>
      </div>

      <div ref="wallRef" class="education-section__wall">
        <article
          v-if="primaryCertification"
          class="credential-card credential-card--certification"
        >
          <div class="credential-card__badge-wrap">
            <img
              v-if="primaryCertification.image"
              class="credential-card__badge"
              :src="primaryCertification.image"
              :alt="`${primaryCertification.name} badge`"
              width="240"
              height="240"
              loading="lazy"
            >
          </div>

          <div class="credential-card__content">
            <div class="credential-card__topline">
              <span>{{ primaryCertification.issuer }}</span>
              <strong>{{ primaryCertification.date }}</strong>
            </div>

            <h3>{{ primaryCertification.name }}</h3>

            <a
              v-if="primaryCertification.link"
              class="credential-card__verify"
              :href="primaryCertification.link"
              target="_blank"
              rel="noreferrer"
              :aria-label="`Verify ${primaryCertification.name}`"
            >
              <span aria-hidden="true"></span>
              Verify credential
            </a>
          </div>
        </article>

        <article
          v-for="(education, index) in cvData.education"
          :key="`${education.degree}-${education.period}`"
          class="education-card"
          :style="{ '--education-accent': educationAccents[index % educationAccents.length] }"
        >
          <p class="education-card__period">{{ education.period }}</p>
          <h3>{{ education.degree }}</h3>
          <p class="education-card__institution">{{ education.institution }}</p>
          <p class="education-card__location">{{ education.location }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvData } from '~/data/cv-data'

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const wallRef = ref<HTMLElement | null>(null)
const scrollAnimation = useScrollAnimation()

const primaryCertification = cvData.certifications[0]
const educationAccents = ['#56c4b8', '#c77dff']

onMounted(async () => {
  await nextTick()

  const { reveal } = scrollAnimation
  const { $prefersReducedMotion } = useNuxtApp()

  if ($prefersReducedMotion) {
    return
  }

  await reveal(headerRef, {
    trigger: sectionRef.value ?? undefined,
    start: 'top 78%',
    y: 48,
  })

  const cards = wallRef.value?.children ? Array.from(wallRef.value.children) : []
  if (cards.length) {
    await reveal(cards, {
      trigger: wallRef.value ?? undefined,
      start: 'top 72%',
      y: 36,
      stagger: 0.12,
    })
  }
})
</script>

<style scoped>
.education-section {
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(245, 240, 232, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 78% 22%, rgba(232, 168, 56, 0.1), transparent 30%),
    linear-gradient(180deg, rgba(13, 13, 18, 0.96), rgba(9, 9, 15, 0.98));
  background-size:
    3rem 3rem,
    auto,
    auto;
}

.education-section__container {
  display: grid;
  gap: var(--space-10);
  padding-block: var(--space-24);
}

.education-section__header {
  display: grid;
  gap: var(--space-3);
}

.education-section__title {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h1);
  line-height: var(--leading-snug);
}

.education-section__wall {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.7fr);
  grid-template-rows: repeat(2, minmax(16rem, auto));
  gap: var(--space-5);
  align-items: stretch;
}

.credential-card,
.education-card {
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(26, 26, 46, 0.94), rgba(9, 9, 15, 0.96));
  box-shadow: var(--shadow-card);
}

.credential-card--certification {
  display: grid;
  grid-row: 1 / span 2;
  grid-template-columns: minmax(12rem, 0.42fr) minmax(0, 0.58fr);
  gap: var(--space-8);
  align-items: center;
  border-color: rgba(232, 168, 56, 0.42);
  background:
    radial-gradient(circle at 28% 50%, rgba(232, 168, 56, 0.16), transparent 34%),
    linear-gradient(145deg, rgba(232, 168, 56, 0.08), transparent 42%),
    linear-gradient(180deg, rgba(26, 26, 46, 0.96), rgba(9, 9, 15, 0.98));
  padding: var(--space-8);
  box-shadow:
    var(--shadow-card),
    var(--shadow-glow);
}

.credential-card__badge-wrap {
  display: grid;
  place-items: center;
  min-width: 0;
}

.credential-card__badge {
  width: min(100%, 15rem);
  height: auto;
  filter: drop-shadow(0 24px 42px rgba(0, 0, 0, 0.38));
}

.credential-card__content {
  display: grid;
  min-width: 0;
  gap: var(--space-6);
}

.credential-card__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--accent-teal);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.credential-card__topline strong {
  color: var(--text-2);
  font-weight: 500;
}

.credential-card h3 {
  max-width: 14ch;
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h2);
  line-height: var(--leading-snug);
}

.credential-card__verify {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid rgba(232, 168, 56, 0.46);
  border-radius: 8px;
  background: rgba(232, 168, 56, 0.12);
  color: var(--accent-amber);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-decoration: none;
  text-transform: uppercase;
}

.credential-card__verify span {
  position: relative;
  width: 0.9rem;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--accent-teal);
  box-shadow: 0 0 18px rgba(86, 196, 184, 0.42);
}

.credential-card__verify span::after {
  position: absolute;
  top: 0.2rem;
  left: 0.32rem;
  width: 0.22rem;
  height: 0.42rem;
  border-right: 2px solid #09090f;
  border-bottom: 2px solid #09090f;
  transform: rotate(42deg);
  content: '';
}

.credential-card__verify:hover,
.credential-card__verify:focus-visible {
  border-color: var(--accent-amber);
  background: rgba(232, 168, 56, 0.18);
}

.education-card {
  --education-accent: var(--accent-teal);

  display: grid;
  gap: var(--space-4);
  align-content: end;
  border-color: color-mix(in srgb, var(--education-accent) 34%, var(--border-subtle));
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--education-accent) 9%, transparent), transparent 46%),
    linear-gradient(180deg, rgba(22, 22, 42, 0.94), rgba(13, 13, 18, 0.96));
  padding: var(--space-6);
}

.education-card__period {
  margin: 0;
  color: var(--education-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.education-card h3 {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h3);
  line-height: var(--leading-snug);
}

.education-card__institution,
.education-card__location {
  margin: 0;
  color: var(--text-1);
  line-height: var(--leading-normal);
}

.education-card__location {
  color: var(--text-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

@keyframes verified-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .credential-card__verify span {
    animation: verified-pulse 2.4s ease-in-out infinite;
  }
}

@media (max-width: 1023px) {
  .education-section__wall {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .credential-card--certification {
    grid-row: auto;
  }
}

@media (max-width: 767px) {
  .education-section__container {
    gap: var(--space-6);
    padding-block: var(--space-16);
  }

  .education-section__wall {
    gap: var(--space-4);
  }

  .credential-card--certification {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding: var(--space-5);
  }

  .credential-card__content {
    gap: var(--space-4);
  }

  .credential-card h3 {
    max-width: none;
  }

  .education-card {
    padding: var(--space-5);
  }
}
</style>
