<template>
  <HeroSection />
  <LazySectionMount section-id="about" label="About" :component="AboutSection" />
  <LazySectionMount section-id="experience" label="Experience" :component="ExperienceSection" />
  <LazySectionMount section-id="skills" label="Skills" :component="SkillsSection" />
  <LazySectionMount section-id="projects" label="Projects" :component="ProjectsSection" />
  <LazySectionMount section-id="education" label="Education" :component="EducationSection" />
  <LazySectionMount section-id="languages" label="Languages" :component="LanguagesSection" />
  <LazySectionMount section-id="contact" label="Contact" :component="ContactSection" />
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
</script>
