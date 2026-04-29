<template>
  <header class="site-chrome" :aria-label="uiCopy.navigation.siteChrome">
    <button class="site-logo" type="button" :aria-label="uiCopy.navigation.goToHero" @click="navigateTo('hero')">
      GB
    </button>

    <div class="site-chrome__controls">
      <div class="language-switcher" ref="languageSwitcherRef">
        <button
          class="language-switcher__trigger"
          type="button"
          :aria-label="uiCopy.languageLabel"
          :aria-expanded="isLanguageMenuOpen"
          aria-haspopup="true"
          @click="toggleLanguageMenu"
        >
          <span class="language-switcher__token" aria-hidden="true">
            {{ activeLanguageVisual.flag }}
          </span>
          <span class="language-switcher__copy">
            <small>{{ uiCopy.languageLabel }}</small>
            <strong>{{ activeLanguageEntry?.label ?? activeLanguage }}</strong>
          </span>
          <span class="language-switcher__chevron" aria-hidden="true">▾</span>
        </button>

        <Transition name="language-menu">
          <div
            v-if="isLanguageMenuOpen"
            class="language-switcher__menu"
            role="menu"
            :aria-label="uiCopy.languageLabel"
          >
            <button
              v-for="language in availableLanguages"
              :key="language.code"
              class="language-switcher__option"
              :class="{ 'language-switcher__option--active': language.code === activeLanguage }"
              type="button"
              role="menuitemradio"
              :aria-checked="language.code === activeLanguage"
              @click="selectLanguage(language.code)"
            >
              <span class="language-switcher__token" aria-hidden="true">
                {{ getLanguageVisual(language.code).flag }}
              </span>
              <span class="language-switcher__option-copy">
                <strong>{{ language.label }}</strong>
                <small>{{ getLanguageVisual(language.code).shortLabel }}</small>
              </span>
              <span v-if="language.code === activeLanguage" class="language-switcher__active-mark" aria-hidden="true">•</span>
            </button>
          </div>
        </Transition>
      </div>

      <button
        class="mobile-menu-button"
        type="button"
        :aria-label="uiCopy.navigation.openSectionNavigation"
        aria-controls="mobile-section-navigation"
        :aria-expanded="isMobileMenuOpen"
        @click="isMobileMenuOpen = true"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>
  </header>

  <nav class="side-nav" :aria-label="uiCopy.navigation.sectionNavigation">
    <div class="side-nav__track" aria-hidden="true">
      <span class="side-nav__progress" :style="{ height: `${navProgress}%` }"></span>
    </div>
    <ol class="side-nav__list">
      <li v-for="section in sections" :key="section.id">
        <button
          class="side-nav__dot"
          type="button"
          :class="{ 'side-nav__dot--active': activeSection === section.id }"
          :aria-label="buildSectionAriaLabel(section.label)"
          :aria-current="activeSection === section.id ? 'true' : undefined"
          @click="navigateTo(section.id)"
        >
          <span class="side-nav__label">{{ section.label }}</span>
        </button>
      </li>
    </ol>
  </nav>

  <Teleport to="body">
    <div
      v-if="isMobileMenuOpen"
      class="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-section-navigation-title"
      @click.self="isMobileMenuOpen = false"
    >
      <nav id="mobile-section-navigation" class="mobile-nav__sheet" :aria-label="uiCopy.navigation.sectionNavigation">
        <div class="mobile-nav__header">
          <p id="mobile-section-navigation-title">{{ uiCopy.navigation.sectionsTitle }}</p>
          <button type="button" :aria-label="uiCopy.navigation.closeSectionNavigation" @click="isMobileMenuOpen = false">
            {{ uiCopy.navigation.closeSectionNavigation }}
          </button>
        </div>

        <div class="language-switcher language-switcher--mobile" :aria-label="uiCopy.languageLabel">
          <p class="language-switcher__mobile-label">{{ uiCopy.languageLabel }}</p>
          <div class="language-switcher__mobile-list">
            <button
              v-for="language in availableLanguages"
              :key="`${language.code}-mobile`"
              class="language-switcher__option"
              :class="{ 'language-switcher__option--active': language.code === activeLanguage }"
              type="button"
              :aria-pressed="language.code === activeLanguage"
              @click="selectLanguage(language.code)"
            >
              <span class="language-switcher__token" aria-hidden="true">
                {{ getLanguageVisual(language.code).flag }}
              </span>
              <span class="language-switcher__option-copy">
                <strong>{{ language.label }}</strong>
                <small>{{ getLanguageVisual(language.code).shortLabel }}</small>
              </span>
            </button>
          </div>
        </div>

        <ol class="mobile-nav__list">
          <li v-for="section in sections" :key="section.id">
            <button
              type="button"
              :aria-current="activeSection === section.id ? 'true' : undefined"
              @click="navigateTo(section.id)"
            >
              <span>{{ section.label }}</span>
              <span aria-hidden="true">{{ activeSection === section.id ? uiCopy.navigation.current : uiCopy.navigation.open }}</span>
            </button>
          </li>
        </ol>
      </nav>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { SECTION_IDS, languageVisuals, type ResumeSectionId } from '~/data/resume-ui'

type SectionId = ResumeSectionId
type VisibleSection = {
  id: SectionId
  viewportOffset: number
}

const activeSection = ref<SectionId>('hero')
const isMobileMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)
const languageSwitcherRef = ref<HTMLElement | null>(null)
const { scrollTo } = useSmoothScroll()
const { trackEvent, trackSectionView } = useAnalytics()
const { activeLanguage, availableLanguages, loadAvailableLanguages, loadCvData, setActiveLanguage, uiCopy } = useCvData()
const trackedSections = new Set<SectionId>()
const sections = computed(() => {
  return SECTION_IDS.map((id) => ({
    id,
    label: uiCopy.value.navigation.sections[id],
  }))
})

const activeIndex = computed(() => {
  const index = sections.value.findIndex((section) => section.id === activeSection.value)
  return Math.max(index, 0)
})

const activeLanguageEntry = computed(() => {
  return availableLanguages.value.find((language) => language.code === activeLanguage.value) ?? null
})

const activeLanguageVisual = computed(() => getLanguageVisual(activeLanguage.value))

const navProgress = computed(() => {
  if (sections.value.length <= 1) {
    return 0
  }

  return (activeIndex.value / (sections.value.length - 1)) * 100
})

const navigateTo = (sectionId: SectionId) => {
  activeSection.value = sectionId
  isMobileMenuOpen.value = false
  window.history.replaceState(null, '', `#${sectionId}`)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
  scrollTo(`#${sectionId}`)
  trackEvent('navigation_click', {
    section: sectionId,
  })
}

const trackSectionViewOnce = (sectionId: SectionId) => {
  if (trackedSections.has(sectionId)) {
    return
  }

  if (trackSectionView(sectionId)) {
    trackedSections.add(sectionId)
  }
}

const updateActiveSection = () => {
  const visibleSections = sections.value
    .map((section) => {
      const element = document.getElementById(section.id)

      if (!element) {
        return null
      }

      const rect = element.getBoundingClientRect()
      const viewportOffset = Math.abs(rect.top - window.innerHeight * 0.35)

      return {
        id: section.id,
        viewportOffset,
      }
    })
    .filter((section): section is VisibleSection => section !== null)

  const nearestSection = visibleSections.sort((a, b) => a.viewportOffset - b.viewportOffset)[0]

  if (nearestSection) {
    activeSection.value = nearestSection.id
    trackSectionViewOnce(nearestSection.id)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isMobileMenuOpen.value = false
    isLanguageMenuOpen.value = false
  }
}

const buildSectionAriaLabel = (sectionLabel: string) => `${uiCopy.value.navigation.open} ${sectionLabel}`

const getLanguageVisual = (languageCode: string) => {
  return languageVisuals[languageCode] ?? {
    flag: '◌',
    shortLabel: languageCode.toUpperCase(),
  }
}

const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

const selectLanguage = async (languageCode: string) => {
  isLanguageMenuOpen.value = false
  await setActiveLanguage(languageCode)
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (!languageSwitcherRef.value?.contains(target)) {
    isLanguageMenuOpen.value = false
  }
}

onMounted(() => {
  void loadAvailableLanguages()
  void loadCvData()
  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('resize', updateActiveSection)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('pointerdown', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('resize', updateActiveSection)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('pointerdown', handleClickOutside)
})
</script>

<style scoped>
.site-chrome {
  position: fixed;
  inset: var(--space-6) var(--space-6) auto var(--space-6);
  z-index: var(--z-nav);
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.site-chrome__controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  pointer-events: auto;
}

.site-logo,
.mobile-menu-button {
  pointer-events: auto;
}

.language-switcher {
  position: relative;
  pointer-events: auto;
}

.language-switcher__trigger,
.language-switcher__option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 1px solid var(--border-subtle);
  color: var(--text-0);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(16px);
}

.language-switcher__trigger {
  min-width: 12.5rem;
  justify-content: space-between;
  border-radius: 999px;
  background:
    radial-gradient(circle at 18% 20%, rgba(232, 168, 56, 0.26), transparent 38%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(13, 13, 18, 0.9));
  padding: 0.38rem 0.45rem 0.38rem 0.38rem;
}

.language-switcher__token {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 1rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.language-switcher__copy,
.language-switcher__option-copy {
  display: grid;
  min-width: 0;
  justify-items: start;
}

.language-switcher__copy {
  flex: 1;
}

.language-switcher__copy small,
.language-switcher__mobile-label,
.language-switcher__option-copy small {
  color: var(--text-muted);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.language-switcher__copy strong,
.language-switcher__option-copy strong {
  font-size: 0.92rem;
  font-weight: 600;
}

.language-switcher__chevron {
  color: var(--accent-amber);
  font-size: 0.9rem;
}

.language-switcher__menu {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  display: grid;
  gap: 0.45rem;
  width: min(15rem, calc(100vw - 2rem));
  border: 1px solid color-mix(in srgb, var(--accent-amber) 30%, var(--border-subtle));
  border-radius: 1.25rem;
  background:
    linear-gradient(180deg, rgba(18, 18, 28, 0.96), rgba(9, 9, 15, 0.98)),
    rgba(13, 13, 18, 0.96);
  padding: 0.6rem;
  box-shadow:
    var(--shadow-card),
    0 1rem 2.5rem rgba(0, 0, 0, 0.35);
}

.language-switcher__option {
  width: 100%;
  justify-content: flex-start;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem 0.6rem;
}

.language-switcher__option--active {
  border-color: color-mix(in srgb, var(--accent-amber) 54%, var(--border-subtle));
  background:
    linear-gradient(135deg, rgba(232, 168, 56, 0.14), rgba(86, 196, 184, 0.08)),
    rgba(255, 255, 255, 0.04);
}

.language-switcher__active-mark {
  margin-left: auto;
  color: var(--accent-amber);
  font-size: 1.15rem;
  line-height: 1;
}

.language-switcher--mobile {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.language-switcher__mobile-list {
  display: grid;
  gap: 0.55rem;
}

.language-menu-enter-active,
.language-menu-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.language-menu-enter-from,
.language-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.35rem) scale(0.98);
}

.site-logo {
  display: inline-grid;
  width: 3rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background: rgba(13, 13, 18, 0.78);
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: var(--text-small);
  font-weight: 700;
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(16px);
}

.site-logo:hover {
  border-color: var(--accent-amber);
  box-shadow: var(--shadow-glow);
}

.mobile-menu-button {
  display: none;
}

.side-nav {
  position: fixed;
  top: 50%;
  right: var(--space-8);
  z-index: var(--z-nav);
  transform: translateY(-50%);
  display: grid;
  place-items: center;
}

.side-nav__track {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 50%;
  width: 1px;
  overflow: hidden;
  transform: translateX(-50%);
  background: var(--border-subtle);
}

.side-nav__progress {
  display: block;
  width: 100%;
  background: var(--accent-amber);
  box-shadow: var(--shadow-glow);
  transition: height 180ms ease;
}

.side-nav__list,
.mobile-nav__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.side-nav__list {
  position: relative;
  display: grid;
  gap: var(--space-4);
}

.side-nav__dot {
  position: relative;
  display: grid;
  width: 1rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background: var(--bg-1);
  transition:
    width 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.side-nav__dot::after {
  content: "";
  width: 0.375rem;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--text-2);
  transition:
    width 180ms ease,
    background 180ms ease;
}

.side-nav__dot:hover,
.side-nav__dot--active {
  border-color: var(--accent-amber);
  background: var(--bg-2);
}

.side-nav__dot--active {
  width: 1.375rem;
  box-shadow: var(--shadow-glow);
}

.side-nav__dot--active::after {
  width: 0.5rem;
  background: var(--accent-amber);
}

.side-nav__label {
  position: absolute;
  right: calc(100% + var(--space-3));
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: rgba(13, 13, 18, 0.92);
  color: var(--text-0);
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.side-nav__dot:hover .side-nav__label,
.side-nav__dot:focus-visible .side-nav__label,
.side-nav__dot--active .side-nav__label {
  transform: translate(-0.25rem, -50%);
  opacity: 1;
}

.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: grid;
  align-items: end;
  background: rgba(9, 9, 15, 0.72);
}

.mobile-nav__sheet {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  background: var(--bg-2);
  padding: var(--space-5);
  box-shadow: var(--shadow-lg);
}

.mobile-nav__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.mobile-nav__header p {
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: var(--text-h3);
  font-weight: 600;
}

.mobile-nav__header button {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--text-1);
}

.mobile-nav__list {
  display: grid;
  gap: var(--space-2);
}

.mobile-nav__list button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-3);
  padding: var(--space-3);
  color: var(--text-0);
  text-align: left;
}

.mobile-nav__list button[aria-current="true"] {
  border-color: var(--accent-amber);
  box-shadow: var(--shadow-glow);
}

.mobile-nav__list span:last-child {
  color: var(--text-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

@media (max-width: 767px) {
  .site-chrome {
    inset: var(--space-4) var(--space-4) auto var(--space-4);
  }

  .mobile-menu-button {
    display: grid;
    width: 3rem;
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-full);
    background: rgba(13, 13, 18, 0.78);
    box-shadow: var(--shadow-card);
    backdrop-filter: blur(16px);
  }

  .mobile-menu-button span {
    display: block;
    width: 1rem;
    height: 1px;
    background: var(--text-0);
  }

  .mobile-menu-button span + span {
    margin-top: -0.75rem;
  }

  .side-nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .side-nav__dot,
  .side-nav__dot::after,
  .side-nav__label,
  .side-nav__progress {
    transition: none;
  }
}
</style>
