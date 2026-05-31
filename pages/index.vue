<template>
  <HeroSection />
  <AboutSection />
  <SkillsSection />
  <ExperienceSection />
  <ProjectsSection />
  <CredentialsSection />
  <ContactSection />
</template>

<script setup lang="ts">
import HeroSection from '~/components/sections/HeroSection.vue'
import AboutSection from '~/components/sections/AboutSection.vue'
import SkillsSection from '~/components/sections/SkillsSection.vue'
import ExperienceSection from '~/components/sections/ExperienceSection.vue'
import ProjectsSection from '~/components/sections/ProjectsSection.vue'
import CredentialsSection from '~/components/sections/CredentialsSection.vue'
import ContactSection from '~/components/sections/ContactSection.vue'

const { loadCvData } = useCvData()

onMounted(() => {
  void loadCvData()
})
</script>
