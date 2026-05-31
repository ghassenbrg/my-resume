<template>
  <ResumeSection
    v-if="hasContent"
    id="education"
    :kicker="uiCopy.sections.educationKicker"
    :title="uiCopy.sections.educationTitle"
  >
    <div class="cred-grid">
      <!-- Education column -->
      <div v-if="education.length" class="cred-col">
        <div
          v-for="(item, index) in education"
          :key="index"
          class="edu-card card reveal"
          :style="revealDelay(index)"
        >
          <div class="edu-icon"><AppIcon name="cap" :size="20" /></div>
          <div>
            <h3 class="edu-degree">{{ item.degree }}</h3>
            <div class="edu-inst">{{ item.institution }}</div>
            <div class="edu-meta">
              <span v-if="item.period">{{ item.period }}</span>
              <span v-if="item.period && item.location" class="tl-meta-sep">·</span>
              <span v-if="item.location" class="edu-loc">
                <AppIcon name="pin" :size="12" />{{ item.location }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Certifications + Languages -->
      <div class="cred-col">
        <div v-if="certifications.length" class="cred-block">
          <h3 class="cred-subhead reveal">
            <AppIcon name="cert" :size="16" />{{ uiCopy.sections.certificationsTitle }}
          </h3>
          <div
            v-for="(cert, index) in certifications"
            :key="index"
            class="cert-card card reveal"
            :style="revealDelay(index + 1)"
          >
            <div class="cert-badge"><AppIcon name="cert" :size="22" /></div>
            <div>
              <h4 class="cert-name">{{ cert.name }}</h4>
              <div class="cert-meta">{{ certMeta(cert) }}</div>
            </div>
            <a
              v-if="cert.link"
              class="cert-link"
              :href="cert.link"
              target="_blank"
              rel="noopener"
              :aria-label="uiCopy.actions.viewCredential"
              @click="onCertLink(cert)"
            >
              <AppIcon name="arrow-ur" :size="15" />
            </a>
          </div>
        </div>

        <div v-if="languages.length" class="cred-block">
          <h3 class="cred-subhead reveal">
            <AppIcon name="globe" :size="16" />{{ uiCopy.sections.languagesTitle }}
          </h3>
          <div class="lang-card card reveal" :style="revealDelay(1)">
            <LanguageBar
              v-for="(language, index) in languages"
              :key="language.code ?? index"
              :lng="language"
              :index="index"
              :show-percentage="showLanguagePercentage"
            />
          </div>
        </div>
      </div>
    </div>
  </ResumeSection>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'
import ResumeSection from '~/components/ui/ResumeSection.vue'
import LanguageBar from '~/components/sections/LanguageBar.vue'
import type { Certification } from '~/types/cv'

const { cvData, cvConfig, uiCopy } = useCvData()
const { trackFollowUpClick } = useAnalytics()

// Shared display option: show the numeric proficiency value, or just the bar.
const showLanguagePercentage = computed(() => cvConfig.value?.display.languagePercentage ?? true)

const education = computed(() => cvData.value?.education ?? [])
const certifications = computed(() => cvData.value?.certifications ?? [])
const languages = computed(() => cvData.value?.languages ?? [])
const hasContent = computed(
  () => education.value.length > 0 || certifications.value.length > 0 || languages.value.length > 0,
)

const certMeta = (cert: Certification) => `${cert.issuer}${cert.date ? ` · ${cert.date}` : ''}`

const onCertLink = (cert: Certification) => {
  if (cert.link) {
    trackFollowUpClick(uiCopy.value.actions.viewCredential, cert.link)
  }
}
</script>
