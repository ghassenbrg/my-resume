<template>
  <section
    id="skills"
    ref="sectionRef"
    class="skills-section section"
    aria-labelledby="skills-title"
  >
    <div class="section-container">
      <div ref="headerRef" class="skills-section__header">
        <p class="section-eyebrow">{{ uiCopy.skills.eyebrow }}</p>
        <h2 id="skills-title" class="skills-section__title">{{ uiCopy.skills.title }}</h2>
      </div>

      <div v-if="cvData" ref="summaryRef" class="skills-section__summary" :aria-label="uiCopy.skills.summary">
        <article>
          <strong>{{ cvData.about.stats.yearsExperience }}+</strong>
          <span>{{ uiCopy.skills.stats.years }}</span>
        </article>
        <article>
          <strong>{{ coreSkillCount }}</strong>
          <span>{{ uiCopy.skills.stats.coreSkills }}</span>
        </article>
        <article>
          <strong>{{ skillCategories.length }}</strong>
          <span>{{ uiCopy.skills.stats.categories }}</span>
        </article>
      </div>

      <SkillOrbit
        v-if="cvData"
        ref="orbitRef"
        class="skills-section__orbit"
        :categories="skillCategories"
        :active-key="activeCategoryKey"
        @focus-category="setActiveCategory"
      />

      <div v-if="cvData" ref="accordionRef" class="skills-section__accordion">
        <article
          v-for="category in skillCategories"
          :key="category.key"
          class="skills-accordion"
          :class="{ 'skills-accordion--open': activeCategoryKey === category.key }"
        >
          <button
            class="skills-accordion__trigger"
            type="button"
            :aria-expanded="activeCategoryKey === category.key"
            :aria-controls="`skills-panel-${category.key}`"
            @click="setActiveCategory(category.key)"
          >
            <span>{{ category.shortLabel }}</span>
            <strong>{{ category.skills.length }}</strong>
          </button>

          <div
            v-show="activeCategoryKey === category.key"
            :id="`skills-panel-${category.key}`"
            class="skills-accordion__panel"
          >
            <ul>
              <li
                v-for="skill in category.skills"
                :key="skill.name"
                :class="{ 'skills-accordion__skill--core': skill.highlight }"
              >
                <Icon
                  class="skills-accordion__icon"
                  :icon="skill.icon"
                  aria-hidden="true"
                />
                <span>{{ skill.name }}</span>
                <strong v-if="skill.highlight">{{ uiCopy.skills.core }}</strong>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import angularIcon from '@iconify-icons/devicon/angular'
import apacheIcon from '@iconify-icons/devicon/apache'
import awsIcon from '@iconify-icons/devicon/amazonwebservices-wordmark'
import confluenceIcon from '@iconify-icons/devicon/confluence'
import cssIcon from '@iconify-icons/devicon/css3'
import deviconIcon from '@iconify-icons/devicon/devicon'
import dockerIcon from '@iconify-icons/devicon/docker'
import gitIcon from '@iconify-icons/devicon/git'
import gitlabIcon from '@iconify-icons/devicon/gitlab'
import hibernateIcon from '@iconify-icons/devicon/hibernate'
import htmlIcon from '@iconify-icons/devicon/html5'
import javaIcon from '@iconify-icons/devicon/java'
import javascriptIcon from '@iconify-icons/devicon/javascript'
import jenkinsIcon from '@iconify-icons/devicon/jenkins'
import jiraIcon from '@iconify-icons/devicon/jira'
import junitIcon from '@iconify-icons/devicon/junit'
import linuxIcon from '@iconify-icons/devicon/linux'
import mongodbIcon from '@iconify-icons/devicon/mongodb'
import mysqlIcon from '@iconify-icons/devicon/mysql'
import nginxIcon from '@iconify-icons/devicon/nginx'
import nodeIcon from '@iconify-icons/devicon/nodejs'
import oauthIcon from '@iconify-icons/devicon/oauth'
import openapiIcon from '@iconify-icons/devicon/openapi'
import oracleIcon from '@iconify-icons/devicon/oracle'
import postgresIcon from '@iconify-icons/devicon/postgresql'
import redhatIcon from '@iconify-icons/devicon/redhat'
import rxjsIcon from '@iconify-icons/devicon/rxjs'
import sonarqubeIcon from '@iconify-icons/devicon/sonarqube'
import springIcon from '@iconify-icons/devicon/spring'
import tomcatIcon from '@iconify-icons/devicon/tomcat'
import typescriptIcon from '@iconify-icons/devicon/typescript'
import nuxtIcon from '@iconify-icons/devicon/nuxtjs'
import vueIcon from '@iconify-icons/devicon/vuejs'
import type { IconifyIcon } from '@iconify/types'
import SkillOrbit, { type OrbitCategory } from '~/components/ui/SkillOrbit.vue'

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const summaryRef = ref<HTMLElement | null>(null)
const orbitRef = ref<InstanceType<typeof SkillOrbit> | null>(null)
const accordionRef = ref<HTMLElement | null>(null)
const scrollAnimation = useScrollAnimation()
const { cvData, loadCvData, uiCopy } = useCvData()

const iconNames: Record<string, IconifyIcon> = {
  activemq: apacheIcon,
  angular: angularIcon,
  api: openapiIcon,
  async: nodeIcon,
  aws: awsIcon,
  coding: gitIcon,
  confluence: confluenceIcon,
  css: cssIcon,
  docker: dockerIcon,
  git: gitIcon,
  gitlab: gitlabIcon,
  hibernate: hibernateIcon,
  html: htmlIcon,
  java: javaIcon,
  javaee: javaIcon,
  jenkins: jenkinsIcon,
  jpa: javaIcon,
  jprofiler: javaIcon,
  junit: junitIcon,
  keycloak: oauthIcon,
  linux: linuxIcon,
  mockito: javaIcon,
  mongodb: mongodbIcon,
  mysql: mysqlIcon,
  ngrx: angularIcon,
  nginx: nginxIcon,
  node: nodeIcon,
  nuxtjs: nuxtIcon,
  openapi: openapiIcon,
  oracle: oracleIcon,
  poi: apacheIcon,
  postgres: postgresIcon,
  primeng: angularIcon,
  rxjs: rxjsIcon,
  scrum: jiraIcon,
  sonarqube: sonarqubeIcon,
  spring: springIcon,
  springcloud: springIcon,
  test: junitIcon,
  threads: javaIcon,
  tomcat: tomcatIcon,
  typescript: typescriptIcon,
  vuejs: vueIcon,
  wildfly: redhatIcon,
  javascript: javascriptIcon,
}

const shortLabels: Record<string, string> = {
  'Backend & Full-Stack Development': 'Backend',
  'Database & Data Processing': 'Database',
  'API Development': 'API',
  'Microservices & Event-Driven Systems': 'Systems',
  'DevOps & Infrastructure': 'DevOps',
  'Testing & Code Quality': 'Testing',
  Security: 'Security',
  'High-Performance Computing': 'Performance',
  'Agile & Collaboration': 'Agile',
}

const skillCategories = computed<OrbitCategory[]>(() => {
  return Object.entries(cvData.value?.skills ?? {}).map(([label, skills]) => ({
    key: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    label,
    shortLabel: shortLabels[label] ?? label,
    skills: skills.map((skill) => ({
      name: skill.name,
      icon: iconNames[skill.icon] ?? deviconIcon,
      highlight: skill.highlight,
    })),
  }))
})

const activeCategoryKey = ref(skillCategories.value[0]?.key ?? '')
watch(skillCategories, (categories) => {
  if (!activeCategoryKey.value && categories[0]) {
    activeCategoryKey.value = categories[0].key
  }
})
const coreSkillCount = computed(() => {
  return skillCategories.value.reduce((total, category) => {
    return total + category.skills.filter((skill) => skill.highlight).length
  }, 0)
})

const setActiveCategory = (key: string) => {
  activeCategoryKey.value = key
}

onMounted(async () => {
  await loadCvData()
  activeCategoryKey.value = skillCategories.value[0]?.key ?? ''
  await nextTick()

  const { reveal } = scrollAnimation
  const { $prefersReducedMotion } = useNuxtApp()

  if ($prefersReducedMotion) {
    return
  }

  await reveal(headerRef, {
    trigger: sectionRef.value ?? undefined,
    start: 'top 78%',
    y: 48,
  })

  const summaryCards = summaryRef.value?.children ? Array.from(summaryRef.value.children) : []
  if (summaryCards.length) {
    await reveal(summaryCards, {
      trigger: summaryRef.value ?? undefined,
      start: 'top 75%',
      y: 28,
      stagger: 0.1,
    })
  }

  if (orbitRef.value?.$el instanceof Element) {
    await reveal(orbitRef.value.$el, {
      trigger: orbitRef.value.$el,
      start: 'top 70%',
      y: 36,
    })
  }

  const accordionCards = accordionRef.value?.children ? Array.from(accordionRef.value.children) : []
  if (accordionCards.length) {
    await reveal(accordionCards, {
      trigger: accordionRef.value ?? undefined,
      start: 'top 78%',
      y: 28,
      stagger: 0.08,
    })
  }
})
</script>

<style scoped>
.skills-section {
  overflow: hidden;
  background:
    radial-gradient(circle at 72% 18%, rgba(199, 125, 255, 0.08), transparent 34%),
    linear-gradient(180deg, rgba(13, 13, 18, 0.94), rgba(9, 9, 15, 0.98));
}

.skills-section__header {
  display: grid;
  gap: var(--space-3);
  justify-items: center;
  margin-bottom: var(--space-8);
  text-align: center;
}

.skills-section__title {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h1);
  line-height: var(--leading-snug);
}

.skills-section__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
  max-width: 44rem;
  margin: 0 auto var(--space-10);
}

.skills-section__summary article {
  display: grid;
  justify-items: center;
  gap: var(--space-1);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(245, 240, 232, 0.035);
  padding: var(--space-5);
  text-align: center;
}

.skills-section__summary strong {
  color: var(--accent-amber);
  font-family: var(--font-heading);
  font-size: var(--text-h2);
  line-height: 1;
}

.skills-section__summary span {
  color: var(--text-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.skills-section__orbit {
  margin-inline: auto;
}

.skills-section__accordion {
  display: none;
}

.skills-accordion {
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(22, 22, 42, 0.82);
  box-shadow: var(--shadow-card);
}

.skills-accordion--open {
  border-color: rgba(232, 168, 56, 0.38);
}

.skills-accordion__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  border-radius: 8px;
  padding: var(--space-4);
  text-align: left;
}

.skills-accordion__trigger span {
  color: var(--text-0);
  font-family: var(--font-heading);
  font-weight: 700;
}

.skills-accordion__trigger strong {
  display: grid;
  width: 2rem;
  aspect-ratio: 1;
  place-items: center;
  border-radius: var(--radius-full);
  background: rgba(232, 168, 56, 0.13);
  color: var(--accent-amber);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.skills-accordion__panel {
  padding: 0 var(--space-4) var(--space-4);
}

.skills-accordion__panel ul {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.skills-accordion__panel li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-3);
  align-items: center;
  min-width: 0;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(245, 240, 232, 0.035);
  padding: var(--space-3);
}

.skills-accordion__skill--core {
  border-color: rgba(232, 168, 56, 0.42);
}

.skills-accordion__icon {
  width: 1.5rem;
  height: 1.5rem;
}

.skills-accordion__panel span {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--text-1);
}

.skills-accordion__panel li > strong {
  border-radius: var(--radius-full);
  background: rgba(232, 168, 56, 0.12);
  color: var(--accent-amber);
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

@media (max-width: 1023px) {
  .skills-section__orbit {
    display: block;
  }
}

@media (max-width: 767px) {
  .skills-section__orbit {
    display: none;
  }

  .skills-section__summary {
    grid-template-columns: 1fr;
    margin-bottom: var(--space-6);
  }

  .skills-section__accordion {
    display: grid;
    gap: var(--space-3);
  }
}
</style>
