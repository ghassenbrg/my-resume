<template>
  <div class="tl-item reveal" :style="revealDelay(Math.min(index, 3))">
    <div class="tl-marker">
      <span class="tl-dot" :class="{ 'tl-dot-live': isPresent }"></span>
    </div>

    <div class="tl-card card">
      <div class="tl-head">
        <div class="company-logo" :style="logoStyle">
          <img
            v-if="exp.logo"
            :src="`/${exp.logo}`"
            :alt="`${exp.company} logo`"
            loading="lazy"
            decoding="async"
          />
          <template v-else>{{ initials(exp.company) }}</template>
        </div>

        <div class="tl-headtext">
          <h3 class="tl-position">{{ exp.position }}</h3>
          <div class="tl-company">{{ exp.company }}</div>
        </div>

        <span v-if="isPresent" class="now-badge">
          <span class="now-dot"></span>{{ uiCopy.meta.present }}
        </span>
      </div>

      <div class="tl-meta">
        <span>{{ dateRange }}</span>
        <span class="tl-meta-sep">·</span>
        <span>{{ duration }}</span>
        <template v-if="exp.location">
          <span class="tl-meta-sep">·</span>
          <span class="tl-loc"><AppIcon name="pin" :size="13" />{{ exp.location }}</span>
        </template>
      </div>

      <p v-if="exp.description" class="tl-desc">{{ exp.description }}</p>

      <ul v-if="achievements.length" class="ach-list">
        <li v-for="(achievement, i) in visibleAchievements" :key="i" class="ach-item">
          <span class="ach-tick"></span>
          <span>{{ achievement }}</span>
        </li>
      </ul>

      <button v-if="needsToggle" class="ach-toggle" type="button" @click="open = !open">
        {{ open ? uiCopy.actions.showLess : `${uiCopy.actions.showMore} (${achievements.length})` }}
        <AppIcon
          name="chevron"
          :size="15"
          :style="{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import AppIcon from '~/components/ui/AppIcon.vue'
import type { Experience } from '~/types/cv'
import { formatDateRange, formatDuration, initials, tileGradient } from '~/utils/cvFormat'
import { revealDelay } from '~/utils/reveal'

const props = defineProps<{ exp: Experience; index: number }>()

const { uiCopy } = useCvData()

const COLLAPSED = 3
const open = ref(false)

const isPresent = computed(() => !props.exp.endDate)
const achievements = computed(() => props.exp.achievements ?? [])
const needsToggle = computed(() => achievements.value.length > COLLAPSED)
const visibleAchievements = computed(() =>
  open.value || !needsToggle.value ? achievements.value : achievements.value.slice(0, COLLAPSED),
)

const dateRange = computed(() =>
  formatDateRange(props.exp.startDate, props.exp.endDate, uiCopy.value.meta.present),
)
const duration = computed(() =>
  formatDuration(props.exp.startDate, props.exp.endDate, uiCopy.value.meta.durationUnits),
)

// Real logos sit on a clean white tile so any brand mark stays legible in both
// themes; companies without a logo fall back to a hue-tinted initial monogram.
const logoStyle = computed<CSSProperties>(() =>
  props.exp.logo ? { background: '#ffffff' } : { background: tileGradient(props.exp.company) },
)
</script>
