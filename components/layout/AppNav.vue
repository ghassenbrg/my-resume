<template>
  <nav class="nav no-print" :class="{ 'nav-scrolled': scrolled }" :aria-label="uiCopy.a11y.primaryNav">
    <div class="container nav-inner">
      <a class="nav-brand" href="#hero" @click="handleNavClick('hero')">
        <BrandMonogram :size="38" :radius="11" :glow="false" />
        <span class="nav-brand-name">{{ brandName }}</span>
      </a>

      <div class="nav-links">
        <a
          v-for="id in navIds"
          :key="id"
          class="nav-link"
          :class="{ active: activeSection === id }"
          :href="`#${id}`"
          :aria-current="activeSection === id ? 'true' : undefined"
          @click="handleNavClick(id)"
        >
          {{ uiCopy.nav[id] }}
        </a>
      </div>

      <div class="nav-right">
        <!-- Language switch -->
        <div ref="langSwitchRef" class="lang-switch">
          <button
            class="lang-btn"
            type="button"
            :aria-label="uiCopy.languageLabel"
            aria-haspopup="true"
            :aria-expanded="langOpen"
            @click="langOpen = !langOpen"
          >
            <AppIcon name="globe" :size="16" />
            <span class="lang-cur">{{ currentLangShort }}</span>
            <AppIcon
              name="chevron"
              :size="14"
              :style="{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }"
            />
          </button>
          <div v-if="langOpen" class="lang-menu" role="menu">
            <button
              v-for="language in availableLanguages"
              :key="language.code"
              class="lang-opt"
              :class="{ active: language.code === activeLanguage }"
              type="button"
              role="menuitemradio"
              :aria-checked="language.code === activeLanguage"
              @click="selectLanguage(language.code)"
            >
              <span class="lang-opt-short">{{ shortLabel(language.code) }}</span>
              <span class="lang-opt-name">{{ language.label }}</span>
              <span v-if="language.code === activeLanguage" class="lang-opt-tick">✓</span>
            </button>
          </div>
        </div>

        <!-- Theme toggle -->
        <button
          class="icon-btn"
          type="button"
          :aria-label="uiCopy.a11y.toggleTheme"
          @click="toggleTheme"
        >
          <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
        </button>

        <!-- Download CV -->
        <a
          v-if="cvLink"
          class="btn btn-primary nav-cv"
          :href="cvLink"
          download
          @click="trackFollowUpClick(uiCopy.actions.downloadCV, cvLink)"
        >
          <AppIcon name="download" :size="15" />
          {{ uiCopy.actions.downloadCV }}
        </a>

        <!-- Burger -->
        <button
          class="nav-burger"
          type="button"
          :aria-label="menuOpen ? uiCopy.a11y.closeMenu : uiCopy.a11y.openMenu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span class="burger-box" :class="{ open: menuOpen }">
            <i></i><i></i><i></i>
          </span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile menu -->
  <div class="mobile-menu no-print" :class="{ open: menuOpen }">
    <div class="mobile-links">
      <a
        v-for="id in navIds"
        :key="id"
        class="nav-link"
        :class="{ active: activeSection === id }"
        :href="`#${id}`"
        :aria-current="activeSection === id ? 'true' : undefined"
        @click="handleNavClick(id)"
      >
        {{ uiCopy.nav[id] }}
      </a>
    </div>

    <a
      v-if="cvLink"
      class="btn btn-primary mobile-cv"
      :href="cvLink"
      download
      @click="onMobileCvClick"
    >
      <AppIcon name="download" :size="16" />
      {{ uiCopy.actions.downloadCV }}
    </a>

    <div class="mobile-social">
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
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'
import BrandMonogram from '~/components/ui/BrandMonogram.vue'
import { NAV_SECTION_IDS, SECTION_IDS, languageVisuals, type NavSectionId } from '~/data/resume-ui'

const navIds = [...NAV_SECTION_IDS] as NavSectionId[]

const {
  cvData,
  cvConfig,
  uiCopy,
  activeLanguage,
  availableLanguages,
  loadAvailableLanguages,
  loadConfig,
  setActiveLanguage,
} = useCvData()
const { theme, toggleTheme } = useTheme()
const { trackEvent, trackFollowUpClick, trackSectionView } = useAnalytics()

const hero = computed(() => cvData.value?.hero ?? null)
const brandName = computed(() => hero.value?.name.split(' ')[0] ?? 'GB')
// Contact/social links + cvLink are shared, non-translatable config.
const cvLink = computed(() => cvConfig.value?.cvLink ?? '')
const social = computed(() => cvConfig.value?.social ?? { github: '', linkedin: '' })
const email = computed(() => cvConfig.value?.contact.email ?? '')

const scrolled = ref(false)
const menuOpen = ref(false)
const langOpen = ref(false)
const activeSection = ref<string>('hero')
const langSwitchRef = ref<HTMLElement | null>(null)
const trackedSections = new Set<string>()

const currentLangShort = computed(() => shortLabel(activeLanguage.value))

const shortLabel = (code: string) => languageVisuals[code]?.shortLabel ?? code.toUpperCase()

const selectLanguage = async (code: string) => {
  langOpen.value = false
  await setActiveLanguage(code)
}

const handleNavClick = (id: string) => {
  // Native hash navigation handles the smooth scroll (scroll-behavior: smooth)
  // and updates the URL hash for deep-linking.
  menuOpen.value = false
  activeSection.value = id
  trackEvent('navigation_click', { section: id })
}

const onMobileCvClick = () => {
  menuOpen.value = false
  trackFollowUpClick(uiCopy.value.actions.downloadCV, cvLink.value)
}

// Header "scrolled" state uses a hysteresis dead-band so the translucent
// background never flickers when the scroll position hovers around a single
// threshold (momentum scroll, trackpad jitter, mobile URL-bar resize, etc.).
const SCROLL_ON = 64
const SCROLL_OFF = 16
let ticking = false

const updateActiveSection = () => {
  const y = window.scrollY + window.innerHeight * 0.32
  let current = SECTION_IDS[0] as string

  for (const id of SECTION_IDS) {
    const element = document.getElementById(id)

    if (element && element.offsetTop <= y) {
      current = id
    }
  }

  activeSection.value = current

  if (!trackedSections.has(current) && trackSectionView(current)) {
    trackedSections.add(current)
  }
}

const evaluateScroll = () => {
  ticking = false
  const y = window.scrollY

  // Only flip state when crossing the outer edges of the dead-band.
  if (!scrolled.value && y > SCROLL_ON) {
    scrolled.value = true
  } else if (scrolled.value && y < SCROLL_OFF) {
    scrolled.value = false
  }

  updateActiveSection()
}

// Coalesce scroll work into one rAF per frame — stable, no timers or debounce.
const onScroll = () => {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(evaluateScroll)
  }
}

const onClickOutside = (event: MouseEvent) => {
  if (event.target instanceof Node && !langSwitchRef.value?.contains(event.target)) {
    langOpen.value = false
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    menuOpen.value = false
    langOpen.value = false
  }
}

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onMounted(() => {
  void loadAvailableLanguages()
  void loadConfig()
  evaluateScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateActiveSection)
  window.addEventListener('pointerdown', onClickOutside)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateActiveSection)
  window.removeEventListener('pointerdown', onClickOutside)
  window.removeEventListener('keydown', onKeydown)

  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
