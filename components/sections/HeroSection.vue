<template>
  <section id="hero" class="hero-section" aria-labelledby="hero-title">
    <ParticleCanvas v-if="showParticles" />

    <div v-if="cvData" class="hero-section__content">
      <img
        ref="markRef"
        class="hero-section__mark"
        src="/favicon.svg"
        width="128"
        height="128"
        alt="GB monogram"
        decoding="async"
      />

      <p ref="eyebrowRef" class="section-eyebrow">Editorial Engineering</p>

      <h1 id="hero-title" ref="nameRef" class="hero-section__name">
        <span>{{ firstName }}</span>
        <span>{{ lastName }}</span>
      </h1>

      <p ref="titleRef" class="hero-section__title" aria-live="polite">
        <span>{{ typedTitle }}</span>
        <span class="hero-section__cursor animate-cursor-blink" aria-hidden="true"></span>
      </p>

      <ul ref="pillsRef" class="hero-section__pills" aria-label="Contact summary">
        <li>{{ cvData.hero.location }}</li>
        <li>{{ cvData.hero.email }}</li>
        <li v-if="cvData.hero.availabilityStatus">{{ cvData.hero.availabilityStatus }}</li>
      </ul>

      <div ref="actionsRef" class="hero-section__actions" aria-label="Primary links">
        <MagneticButton :href="cvData.hero.github" external variant="ghost" analytics-label="github">GH</MagneticButton>
        <MagneticButton :href="cvData.hero.linkedin" external variant="ghost" analytics-label="linkedin">LI</MagneticButton>
        <MagneticButton :href="`mailto:${cvData.hero.email}`" variant="secondary" analytics-label="email">Email</MagneticButton>
        <MagneticButton :href="cvData.hero.cvLink" variant="primary" analytics-label="cv">CV</MagneticButton>
      </div>
    </div>

    <button
      ref="scrollRef"
      class="hero-section__scroll"
      type="button"
      aria-label="Scroll to about section"
      @click="scrollTo('#about')"
    >
      <span aria-hidden="true"></span>
    </button>
  </section>
</template>

<script setup lang="ts">
import MagneticButton from '~/components/ui/MagneticButton.vue'

const ParticleCanvas = defineAsyncComponent(() => import('~/components/ui/ParticleCanvas.vue'))
const { cvData, loadCvData } = useCvData()

const nameParts = computed(() => cvData.value?.hero.name.split(' ') ?? [])
const firstName = computed(() => nameParts.value[0] ?? cvData.value?.hero.name ?? '')
const lastName = computed(() => nameParts.value.slice(1).join(' '))
const heroTitle = computed(() => cvData.value?.hero.title ?? '')

const markRef = ref<HTMLImageElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const pillsRef = ref<HTMLElement | null>(null)
const actionsRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const showParticles = ref(false)

const { output: typedTitle, start: startTypewriter } = useTypewriter(heroTitle, {
  delay: 30,
  startDelay: 1500,
})
const { scrollTo } = useSmoothScroll()

let splitText: { chars: Element[]; revert: () => void } | null = null
let particleQuery: MediaQueryList | null = null
let particleMotionQuery: MediaQueryList | null = null

const updateParticleState = () => {
  const canRenderParticles = particleQuery?.matches ?? false
  const allowsMotion = !(particleMotionQuery?.matches ?? false)

  showParticles.value = canRenderParticles && allowsMotion
}

onMounted(async () => {
  await loadCvData()
  await nextTick()

  const { $loadGsap, $prefersReducedMotion } = useNuxtApp()

  particleQuery = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
  particleMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateParticleState()
  particleQuery.addEventListener('change', updateParticleState)
  particleMotionQuery.addEventListener('change', updateParticleState)

  if ($prefersReducedMotion) {
    startTypewriter()
    return
  }

  const name = nameRef.value
  const pills = pillsRef.value?.children ? Array.from(pillsRef.value.children) : []
  const actions = actionsRef.value?.children ? Array.from(actionsRef.value.children) : []

  if (!name) {
    startTypewriter()
    return
  }

  const { gsap, SplitText } = await $loadGsap()

  splitText = new SplitText(name, {
    type: 'chars',
  })

  gsap
    .timeline()
    .from(markRef.value, {
      scale: 0.86,
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power3.out',
    })
    .from(eyebrowRef.value, {
      y: 24,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, 0.15)
    .from(
      splitText.chars,
      {
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: 'power3.out',
      },
      0.3,
    )
    .from(
      titleRef.value,
      {
        y: 20,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power3.out',
      },
      1.3,
    )
    .from(
      pills,
      {
        y: 22,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      },
      3,
    )
    .from(
      actions,
      {
        scale: 0,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      },
      3.5,
    )
    .from(
      scrollRef.value,
      {
        autoAlpha: 0,
        y: -8,
        duration: 0.4,
        ease: 'power2.out',
      },
      4,
    )

  startTypewriter()
})

onBeforeUnmount(() => {
  particleQuery?.removeEventListener('change', updateParticleState)
  particleMotionQuery?.removeEventListener('change', updateParticleState)
  splitText?.revert()
})
</script>

<style scoped>
.hero-section {
  position: relative;
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: var(--space-20) var(--space-8);
}

.hero-section__content {
  position: relative;
  z-index: var(--z-card);
  display: grid;
  justify-items: center;
  gap: var(--space-6);
  text-align: center;
}

.hero-section__mark {
  width: clamp(4.5rem, 8vw, 6rem);
  height: auto;
  filter: drop-shadow(0 1.25rem 2.5rem rgba(232, 168, 56, 0.24));
}

.hero-section__name {
  display: grid;
  gap: var(--space-1);
  max-width: 11ch;
  color: var(--text-0);
  font-size: var(--text-display);
  letter-spacing: 0;
  line-height: var(--leading-tight);
  text-transform: uppercase;
}

.hero-section__title {
  min-height: calc(var(--text-body) * var(--leading-normal) * 2);
  max-width: 34rem;
  color: var(--text-1);
}

.hero-section__cursor {
  display: inline-block;
  width: 0.08em;
  height: 1.1em;
  margin-left: var(--space-1);
  translate: 0 0.16em;
  background: var(--accent-amber);
}

.hero-section__pills,
.hero-section__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-section__pills {
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hero-section__pills li {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background: rgba(13, 13, 18, 0.72);
  color: var(--text-1);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-small);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(14px);
}

.hero-section__actions {
  gap: var(--space-3);
}

.hero-section__scroll {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  z-index: var(--z-card);
  width: 2.75rem;
  aspect-ratio: 1;
  translate: -50% 0;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background: rgba(13, 13, 18, 0.72);
  box-shadow: var(--shadow-card);
}

.hero-section__scroll span {
  display: block;
  width: 0.65rem;
  height: 0.65rem;
  margin: auto;
  border-right: 2px solid var(--accent-amber);
  border-bottom: 2px solid var(--accent-amber);
  rotate: 45deg;
  animation: scroll-bounce 1.5s ease-in-out infinite;
}

@media (max-width: 767px) {
  .hero-section {
    min-height: 100svh;
    background:
      radial-gradient(circle at 50% 30%, rgba(232, 168, 56, 0.16), transparent 34%),
      linear-gradient(180deg, var(--bg-0), var(--bg-1));
    padding: var(--space-16) var(--space-6);
  }

  .hero-section__content {
    gap: var(--space-5);
  }

  .hero-section__title {
    min-height: calc(var(--text-body) * var(--leading-normal) * 3);
  }

  .hero-section__pills {
    gap: var(--space-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-section__scroll span {
    animation: none;
  }
}
</style>
