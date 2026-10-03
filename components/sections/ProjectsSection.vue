<template>
  <ResumeSection
    v-if="projects.length"
    id="projects"
    :kicker="uiCopy.sections.projectsKicker"
    :title="uiCopy.sections.projectsTitle"
  >
    <div
      v-for="group in groups"
      :key="group.kind"
      class="proj-group"
      :class="`proj-group--${group.kind}`"
    >
      <div class="proj-group-head reveal">
        <h3 class="proj-group-title">
          {{ group.title }}
          <span class="proj-group-count">{{ group.items.length }}</span>
        </h3>
        <p class="proj-group-lead">{{ group.lead }}</p>
      </div>

      <div class="proj-grid" :class="{ 'proj-grid--compact': group.compact }">
        <article
          v-for="(project, index) in group.items"
          :key="`${project.title}-${index}`"
          class="proj-card card reveal"
          :class="{ 'proj-card--personal': group.kind === 'personal' }"
          :style="revealDelay(Math.min(index, 5))"
        >
          <div class="proj-top">
            <div class="proj-glyph" :style="{ background: tileGradient(project.title, 0.3, 0.18, 0.08) }">
              <span>{{ initials(project.title) }}</span>
            </div>
            <div class="proj-top-actions">
              <a
                v-if="project.repo"
                class="proj-link-btn"
                :href="project.repo"
                target="_blank"
                rel="noopener"
                :aria-label="`${project.title} — ${uiCopy.actions.sourceCode}`"
                @click="onProjectLink(project, project.repo, uiCopy.actions.sourceCode)"
              >
                <AppIcon name="github" :size="16" />
              </a>
              <a
                v-if="project.link"
                class="proj-link-btn"
                :href="project.link"
                target="_blank"
                rel="noopener"
                :aria-label="`${project.title} — ${project.linkLabel || uiCopy.actions.viewProject}`"
                @click="onProjectLink(project, project.link, project.linkLabel)"
              >
                <AppIcon name="arrow-ur" :size="16" />
              </a>
            </div>
          </div>

          <div v-if="project.status || project.period" class="proj-meta">
            <span v-if="project.status" class="proj-status">{{ project.status }}</span>
            <span v-if="project.period" class="proj-period">{{ project.period }}</span>
          </div>

          <h4 class="proj-title">{{ project.title }}</h4>

          <div v-if="project.role || project.company" class="proj-role">
            <span class="proj-role-dot"></span>
            <span>{{ [project.role, project.company].filter(Boolean).join(' · ') }}</span>
          </div>

          <p v-if="project.summary" class="proj-summary">{{ project.summary }}</p>

          <ul v-if="!group.compact && project.outcomes?.length" class="proj-outcomes">
            <li v-for="(outcome, outcomeIndex) in project.outcomes" :key="outcomeIndex">
              <span class="ach-tick"></span>
              <span>{{ outcome }}</span>
            </li>
          </ul>

          <div v-if="!group.compact && project.technologies?.length" class="proj-tech">
            <span v-for="(tech, techIndex) in project.technologies" :key="techIndex" class="tech-chip">
              {{ tech }}
            </span>
          </div>

          <a
            v-if="project.link"
            class="proj-cta"
            :href="project.link"
            target="_blank"
            rel="noopener"
            @click="onProjectLink(project, project.link, project.linkLabel)"
          >
            {{ project.linkLabel || uiCopy.actions.viewProject }}
            <AppIcon name="arrow" :size="15" />
          </a>
        </article>
      </div>
    </div>
  </ResumeSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '~/components/ui/AppIcon.vue'
import ResumeSection from '~/components/ui/ResumeSection.vue'
import type { Project } from '~/types/cv'
import { initials, tileGradient } from '~/utils/cvFormat'
import { revealDelay } from '~/utils/reveal'

const { cvData, uiCopy, activeLanguage } = useCvData()
const { trackFollowUpClick } = useAnalytics()

const projects = computed(() => cvData.value?.projects ?? [])

/* The main products lead; smaller projects remain easy to find and try. */
const groups = computed(() => [
  {
    kind: 'personal' as const,
    compact: false,
    title: uiCopy.value.sections.projectsPersonalTitle,
    lead: uiCopy.value.sections.projectsPersonalLead,
    items: projects.value.filter((project) => project.featured),
  },
  {
    kind: 'side' as const,
    compact: true,
    title: ({ en: 'More personal projects', fr: 'Autres projets personnels', jp: 'その他の個人プロジェクト' } as Record<string, string>)[activeLanguage.value] ?? 'More personal projects',
    lead: '',
    items: projects.value.filter((project) => !project.featured),
  },
].filter((group) => group.items.length > 0))

const onProjectLink = (project: Project, url: string, label?: string) => {
  trackFollowUpClick(label || project.linkLabel || uiCopy.value.actions.viewProject, url)
}
</script>
