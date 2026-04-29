<template>
  <HeroSection />
  <LazySectionMount section-id="about" :label="sectionLabels.about" :component="AboutSection" />
  <LazySectionMount section-id="experience" :label="sectionLabels.experience" :component="ExperienceSection" />
  <LazySectionMount section-id="skills" :label="sectionLabels.skills" :component="SkillsSection" />
  <LazySectionMount section-id="projects" :label="sectionLabels.projects" :component="ProjectsSection" />
  <LazySectionMount section-id="education" :label="sectionLabels.education" :component="EducationSection" />
  <LazySectionMount section-id="languages" :label="sectionLabels.languages" :component="LanguagesSection" />
  <LazySectionMount section-id="contact" :label="sectionLabels.contact" :component="ContactSection" />
</template>

<script setup lang="ts">
import HeroSection from '~/components/sections/HeroSection.vue'
import LazySectionMount from '~/components/ui/LazySectionMount.vue'

const AboutSection = defineAsyncComponent(() => import('~/components/sections/AboutSection.vue'))
const ExperienceSection = defineAsyncComponent(() => import('~/components/sections/ExperienceSection.vue'))
const SkillsSection = defineAsyncComponent(() => import('~/components/sections/SkillsSection.vue'))
const ProjectsSection = defineAsyncComponent(() => import('~/components/sections/ProjectsSection.vue'))
const EducationSection = defineAsyncComponent(() => import('~/components/sections/EducationSection.vue'))
const LanguagesSection = defineAsyncComponent(() => import('~/components/sections/LanguagesSection.vue'))
const ContactSection = defineAsyncComponent(() => import('~/components/sections/ContactSection.vue'))
const { loadCvData, uiCopy } = useCvData()

const sectionLabels = computed(() => uiCopy.value.navigation.sections)

onMounted(() => {
  void loadCvData()
})
</script>
