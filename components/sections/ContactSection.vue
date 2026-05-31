<template>
  <section id="contact" class="section contact-section" data-screen-label="contact">
    <div class="container">
      <div class="contact-card card reveal">
        <div class="contact-glow"></div>

        <span class="kicker">{{ uiCopy.sections.contactKicker }}</span>

        <h2 class="contact-title">
          {{ uiCopy.sections.contactTitlePre
          }}<span class="grad-text">{{ uiCopy.sections.contactTitleAccent }}</span
          >{{ uiCopy.sections.contactTitlePost }}
        </h2>

        <p class="contact-lead">{{ uiCopy.sections.contactLead }}</p>

        <div class="contact-actions">
          <a
            v-if="email"
            class="btn btn-primary"
            :href="`mailto:${email}`"
            @click="trackFollowUpClick(uiCopy.actions.email, `mailto:${email}`)"
          >
            <AppIcon name="mail" :size="17" />
            {{ email }}
          </a>
          <a
            v-if="cvLink"
            class="btn btn-ghost"
            :href="cvLink"
            download
            @click="trackFollowUpClick(uiCopy.actions.downloadCV, cvLink)"
          >
            <AppIcon name="download" :size="16" />
            {{ uiCopy.actions.downloadCV }}
          </a>
        </div>

        <div class="contact-socials">
          <a
            v-if="social.github"
            class="contact-soc"
            :href="social.github"
            target="_blank"
            rel="noopener"
            @click="trackFollowUpClick(uiCopy.actions.github, social.github)"
          >
            <AppIcon name="github" :size="17" />
            {{ uiCopy.actions.github }}
          </a>
          <a
            v-if="social.linkedin"
            class="contact-soc"
            :href="social.linkedin"
            target="_blank"
            rel="noopener"
            @click="trackFollowUpClick(uiCopy.actions.linkedin, social.linkedin)"
          >
            <AppIcon name="linkedin" :size="17" />
            {{ uiCopy.actions.linkedin }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'

const { cvConfig, uiCopy } = useCvData()
const { trackFollowUpClick } = useAnalytics()

// Contact/social links + cvLink are shared, non-translatable config.
const email = computed(() => cvConfig.value?.contact.email ?? '')
const cvLink = computed(() => cvConfig.value?.cvLink ?? '')
const social = computed(() => cvConfig.value?.social ?? { github: '', linkedin: '' })
</script>
