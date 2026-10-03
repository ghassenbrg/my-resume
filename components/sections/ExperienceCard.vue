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
          <!-- With several official titles, the employer heads the card and each
               title is listed below with its own dates (the range under it is the tenure). -->
          <h3 v-if="roles.length" class="tl-position">{{ exp.company }}</h3>
          <h3 v-else class="tl-position">{{ exp.position }}</h3>
          <div v-if="!roles.length || exp.assignment" class="tl-company">
            {{ exp.company }}<span v-if="exp.assignment" class="tl-assignment">{{ ` · ${exp.assignment}` }}</span>
          </div>
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

      <!-- Each official title keeps its own date range (e.g. a promotion). -->
      <ul v-if="roles.length" class="tl-roles">
        <li v-for="role in roles" :key="role.position + role.startDate" class="tl-role">
          <span class="tl-role-title">{{ role.position }}</span>
          <span class="tl-role-dates">{{ role.range }}</span>
        </li>
      </ul>

      <p v-if="exp.description" class="tl-desc">{{ exp.description }}</p>

      <ul v-if="achievements.length" class="ach-list">
        <li v-for="(achievement, i) in leadAchievements" :key="i" class="ach-item">
          <span class="ach-tick"></span>
          <span>{{ achievement }}</span>
        </li>
      </ul>

      <!-- Remaining achievements stay in the initial HTML for readers without
           JavaScript and for crawlers; native details keeps the card short. -->
      <details v-if="moreAchievements.length" class="ach-more">
        <summary class="ach-toggle">
          <span class="ach-when-closed">{{ uiCopy.actions.showMore }} ({{ achievements.length }})</span>
          <span class="ach-when-open">{{ uiCopy.actions.showLess }}</span>
          <AppIcon name="chevron" :size="15" class="ach-chevron" />
        </summary>
        <ul class="ach-list">
          <li v-for="(achievement, i) in moreAchievements" :key="i" class="ach-item">
            <span class="ach-tick"></span>
            <span>{{ achievement }}</span>
          </li>
        </ul>
      </details>

      <details v-if="exp.projects?.length" class="experience-projects">
        <summary>{{ projectLabel }} ({{ exp.projects.length }})</summary>
        <article v-for="project in exp.projects" :key="project.title" class="experience-project">
          <h4>{{ project.title }} <span v-if="project.period">{{ project.period }}</span></h4>
          <p v-if="project.summary">{{ project.summary }}</p>
          <ul v-if="project.outcomes?.length">
            <li v-for="outcome in project.outcomes" :key="outcome">{{ outcome }}</li>
          </ul>
          <p class="experience-project-tech">{{ project.technologies.join(' · ') }}</p>
        </article>
      </details>
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

const { uiCopy, activeLanguage, referenceDate } = useCvData()

const projectLabel = computed(() => ({ en: 'Selected company projects', fr: "Projets d’entreprise sélectionnés", jp: '主な業務プロジェクト' } as Record<string, string>)[activeLanguage.value] ?? 'Selected company projects')
const COLLAPSED = 4

const isPresent = computed(() => !props.exp.endDate)
const achievements = computed(() => props.exp.achievements ?? [])
const leadAchievements = computed(() => achievements.value.slice(0, COLLAPSED))
const moreAchievements = computed(() => achievements.value.slice(COLLAPSED))
const roles = computed(() =>
  (props.exp.roles ?? []).map((role) => ({
    ...role,
    range: formatDateRange(role.startDate, role.endDate, uiCopy.value.meta.present, activeLanguage.value),
  })),
)

const dateRange = computed(() =>
  formatDateRange(props.exp.startDate, props.exp.endDate, uiCopy.value.meta.present, activeLanguage.value),
)
const duration = computed(() =>
  formatDuration(props.exp.startDate, props.exp.endDate, uiCopy.value.meta.durationUnits, referenceDate.value),
)

// Real logos sit on a clean white tile so any brand mark stays legible in both
// themes; companies without a logo fall back to a hue-tinted initial monogram.
const logoStyle = computed<CSSProperties>(() =>
  props.exp.logo ? { background: '#ffffff' } : { background: tileGradient(props.exp.company) },
)
</script>
