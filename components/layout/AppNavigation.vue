<template>
  <header class="site-chrome" aria-label="Site chrome">
    <button class="site-logo" type="button" aria-label="Go to hero section" @click="navigateTo('hero')">
      GB
    </button>

    <button
      class="mobile-menu-button"
      type="button"
      aria-label="Open section navigation"
      aria-controls="mobile-section-navigation"
      :aria-expanded="isMobileMenuOpen"
      @click="isMobileMenuOpen = true"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </header>

  <nav class="side-nav" aria-label="Section navigation">
    <div class="side-nav__track" aria-hidden="true">
      <span class="side-nav__progress" :style="{ height: `${navProgress}%` }"></span>
    </div>
    <ol class="side-nav__list">
      <li v-for="section in sections" :key="section.id">
        <button
          class="side-nav__dot"
          type="button"
          :class="{ 'side-nav__dot--active': activeSection === section.id }"
          :aria-label="`Go to ${section.label}`"
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
      <nav id="mobile-section-navigation" class="mobile-nav__sheet" aria-label="Section navigation">
        <div class="mobile-nav__header">
          <p id="mobile-section-navigation-title">Sections</p>
          <button type="button" aria-label="Close section navigation" @click="isMobileMenuOpen = false">
            Close
          </button>
        </div>

        <ol class="mobile-nav__list">
          <li v-for="section in sections" :key="section.id">
            <button
              type="button"
              :aria-current="activeSection === section.id ? 'true' : undefined"
              @click="navigateTo(section.id)"
            >
              <span>{{ section.label }}</span>
              <span aria-hidden="true">{{ activeSection === section.id ? 'Current' : 'Open' }}</span>
            </button>
          </li>
        </ol>
      </nav>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'languages', label: 'Languages' },
  { id: 'contact', label: 'Contact' },
] as const

type SectionId = (typeof sections)[number]['id']
type VisibleSection = {
  id: SectionId
  viewportOffset: number
}

const activeSection = ref<SectionId>('hero')
const isMobileMenuOpen = ref(false)
const { scrollTo } = useSmoothScroll()
const { trackEvent, trackSectionView } = useAnalytics()
const trackedSections = new Set<SectionId>()

const activeIndex = computed(() => {
  const index = sections.findIndex((section) => section.id === activeSection.value)
  return Math.max(index, 0)
})

const navProgress = computed(() => {
  if (sections.length <= 1) {
    return 0
  }

  return (activeIndex.value / (sections.length - 1)) * 100
})

const navigateTo = (sectionId: SectionId) => {
  activeSection.value = sectionId
  isMobileMenuOpen.value = false
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
  const visibleSections = sections
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
  }
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('resize', updateActiveSection)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('resize', updateActiveSection)
  window.removeEventListener('keydown', handleKeydown)
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

.site-logo,
.mobile-menu-button {
  pointer-events: auto;
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
