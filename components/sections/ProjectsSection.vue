<template>
  <ResumeSection
    v-if="projects.length"
    id="projects"
    :kicker="uiCopy.sections.projectsKicker"
    :title="uiCopy.sections.projectsTitle"
  >
    <div class="proj-grid">
      <article
        v-for="(project, index) in projects"
        :key="`${project.title}-${index}`"
        class="proj-card card reveal"
        :style="revealDelay(Math.min(index, 5))"
      >
        <div class="proj-top">
          <div class="proj-glyph" :style="{ background: tileGradient(project.title, 0.3, 0.18, 0.08) }">
            <span>{{ initials(project.title) }}</span>
          </div>
          <a
            v-if="project.link"
            class="proj-link-btn"
            :href="project.link"
            target="_blank"
            rel="noopener"
            :aria-label="project.linkLabel || uiCopy.actions.viewProject"
            @click="onProjectLink(project)"
          >
            <AppIcon name="arrow-ur" :size="16" />
          </a>
        </div>

        <h3 class="proj-title">{{ project.title }}</h3>

        <div v-if="project.role" class="proj-role">
          <span class="proj-role-dot"></span>{{ project.role }}
        </div>

        <ul v-if="project.outcomes?.length" class="proj-outcomes">
          <li v-for="(outcome, outcomeIndex) in project.outcomes" :key="outcomeIndex">
            <span class="ach-tick"></span>
            <span>{{ outcome }}</span>
          </li>
        </ul>

        <div v-if="project.technologies?.length" class="proj-tech">
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
          @click="onProjectLink(project)"
        >
          {{ project.linkLabel || uiCopy.actions.viewProject }}
          <AppIcon name="arrow" :size="15" />
        </a>
      </article>
    </div>
  </ResumeSection>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'
import ResumeSection from '~/components/ui/ResumeSection.vue'
import type { Project } from '~/types/cv'
import { initials, tileGradient } from '~/utils/cvFormat'
import { revealDelay } from '~/utils/reveal'

const { cvData, uiCopy } = useCvData()
const { trackFollowUpClick } = useAnalytics()

const projects = computed(() => cvData.value?.projects ?? [])

const onProjectLink = (project: Project) => {
  if (project.link) {
    trackFollowUpClick(project.linkLabel || uiCopy.value.actions.viewProject, project.link)
  }
}
</script>
