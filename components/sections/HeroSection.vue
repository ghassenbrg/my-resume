<template>
  <header id="hero" class="hero" data-screen-label="hero" tabindex="-1">
    <!-- Static doodle backdrop (replaces the old animated network canvas). -->
    <div class="hero-doodles" aria-hidden="true"></div>

    <div v-if="hero" class="container hero-inner">
      <div class="hero-copy">
        <div v-if="openToOpportunities" class="status-pill">
          <span class="status-dot"></span>
          {{ uiCopy.actions.available }}
        </div>

        <h1 class="hero-name">{{ hero.name }}</h1>

        <div class="hero-title">
          <span class="grad-text">{{ hero.title }}</span>
          <span class="hero-loc">
            <AppIcon name="pin" :size="16" />
            {{ hero.location }}
          </span>
        </div>

        <!-- Functional descriptor; the official title above stays unchanged. -->
        <p v-if="hero.headline" class="hero-headline">{{ hero.headline }}</p>

        <p class="hero-tag">{{ tagline }}</p>

        <div class="hero-cta">
          <a
            v-if="cvLink"
            class="btn btn-primary"
            :href="cvLink"
            download
            @click="trackFollowUpClick(uiCopy.actions.downloadCV, cvLink)"
          >
            <AppIcon name="download" :size="17" />
            {{ uiCopy.actions.downloadCV }}
          </a>
          <a class="btn btn-ghost" href="#contact">
            {{ uiCopy.actions.contactMe }}
            <AppIcon name="arrow" :size="16" />
          </a>

          <div class="hero-social">
            <a
              v-if="social.github"
              class="icon-btn"
              :href="social.github"
              target="_blank"
              rel="noopener"
              :aria-label="uiCopy.actions.github"
            >
              <AppIcon name="github" :size="18" />
            </a>
            <a
              v-if="social.linkedin"
              class="icon-btn"
              :href="social.linkedin"
              target="_blank"
              rel="noopener"
              :aria-label="uiCopy.actions.linkedin"
            >
              <AppIcon name="linkedin" :size="18" />
            </a>
            <a
              v-if="email"
              class="icon-btn"
              :href="`mailto:${email}`"
              :aria-label="uiCopy.actions.email"
            >
              <AppIcon name="mail" :size="18" />
            </a>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <span class="hero-blob" aria-hidden="true"></span>
        <figure class="hero-portrait illo">
          <img
            src="/illustrations/hero-portrait.webp"
            :alt="hero.name"
            width="1000"
            height="1000"
            fetchpriority="high"
            decoding="async"
          />
        </figure>
        <!-- Orange energy marks drawn around the panel, as on the Snib sheets. -->
        <svg class="hero-marks" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <g stroke="#ff6b2d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M318 30l6-22M340 44l16-16M350 70l22-6" />
            <path d="M22 318l-14 10M30 340l-20 4M44 356l-12 16" />
            <path d="M372 300c-14 4-10 18 2 16s16 12 2 18" />
          </g>
          <path
            d="M44 52l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z"
            stroke="#ff6b2d"
            stroke-width="6"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="scroll-hint no-print" aria-hidden="true">
      <span>{{ uiCopy.hero.scroll }}</span>
      <span class="scroll-track"><span class="scroll-thumb"></span></span>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'

const { cvData, cvConfig, cvLink, uiCopy } = useCvData()
const { trackFollowUpClick } = useAnalytics()

const hero = computed(() => cvData.value?.hero ?? null)
const tagline = computed(
  () => hero.value?.tagline ?? cvData.value?.about.paragraphs[0] ?? '',
)

// Shared, non-translatable values come from cv-config.json.
const openToOpportunities = computed(() => cvConfig.value?.openToOpportunities ?? false)
const email = computed(() => cvConfig.value?.contact.email ?? '')
const social = computed(() => cvConfig.value?.social ?? { github: '', linkedin: '' })
</script>
