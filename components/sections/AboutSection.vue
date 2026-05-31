<template>
  <ResumeSection
    id="about"
    :kicker="uiCopy.sections.aboutKicker"
    :title="uiCopy.sections.aboutTitle"
  >
    <div v-if="about" class="about-grid">
      <div class="about-copy">
        <p class="about-lead reveal" :style="revealDelay(0)">{{ lead }}</p>
        <p
          v-for="(paragraph, index) in rest"
          :key="index"
          class="about-para reveal"
          :style="revealDelay(index + 1)"
        >
          {{ paragraph }}
        </p>
      </div>

      <div v-if="highlights.length" class="about-stats">
        <div
          v-for="(highlight, index) in highlights"
          :key="index"
          class="stat-card card reveal"
          :style="revealDelay(index)"
        >
          <span class="stat-val grad-text">{{ highlight.value }}</span>
          <span class="stat-label">{{ highlight.label }}</span>
        </div>
      </div>
    </div>
  </ResumeSection>
</template>

<script setup lang="ts">
import ResumeSection from '~/components/ui/ResumeSection.vue'
import { revealDelay } from '~/utils/reveal'

const { cvData, uiCopy } = useCvData()

const about = computed(() => cvData.value?.about ?? null)
const lead = computed(() => about.value?.paragraphs[0] ?? '')
const rest = computed(() => about.value?.paragraphs.slice(1) ?? [])
const highlights = computed(() => about.value?.highlights ?? [])
</script>
