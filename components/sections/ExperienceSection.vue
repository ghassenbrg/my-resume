<template>
  <ResumeSection
    v-if="experiences.length"
    id="experience"
    :kicker="uiCopy.sections.experienceKicker"
    :title="uiCopy.sections.experienceTitle"
  >
    <div class="timeline">
      <div class="tl-spine"></div>
      <ExperienceCard
        v-for="(exp, index) in experiences"
        :key="`${exp.company}-${index}`"
        :exp="exp"
        :index="index"
      />
    </div>
  </ResumeSection>
</template>

<script setup lang="ts">
import ResumeSection from '~/components/ui/ResumeSection.vue'
import ExperienceCard from '~/components/sections/ExperienceCard.vue'

const { cvData, uiCopy } = useCvData()

const experiences = computed(() => cvData.value?.experience ?? [])
</script>
