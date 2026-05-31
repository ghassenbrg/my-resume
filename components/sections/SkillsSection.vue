<template>
  <ResumeSection
    id="skills"
    :kicker="uiCopy.sections.skillsKicker"
    :title="uiCopy.sections.skillsTitle"
  >
    <div class="skill-tabs reveal">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="skill-tab"
        :class="{ active: active === tab.key }"
        type="button"
        :aria-pressed="active === tab.key"
        @click="setActive(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="skill-legend reveal">
      <AppIcon name="star" :size="13" />
      <span>{{ uiCopy.meta.highlighted }}</span>
    </div>

    <div class="skill-groups">
      <div
        v-for="(group, index) in shown"
        :key="group.category"
        class="skill-group reveal"
        :style="revealDelay(index)"
      >
        <div class="skill-group-head">
          <span class="skill-cat-icon">
            <SkillGlyph :category="group.category" :index="group.index" />
          </span>
          <h3 class="skill-cat-name">{{ group.category }}</h3>
          <span class="skill-count">{{ group.items.length }}</span>
        </div>
        <div class="chips">
          <span
            v-for="(skill, skillIndex) in group.items"
            :key="skillIndex"
            class="chip"
            :class="{ 'chip-hi': skill.highlight }"
          >
            <Icon
              v-if="skillIcon(skill.icon)"
              :icon="skillIcon(skill.icon)!"
              class="chip-logo"
              aria-hidden="true"
            />
            <span>{{ skill.name }}</span>
            <AppIcon v-if="skill.highlight" name="star" :size="11" />
          </span>
        </div>
      </div>
    </div>
  </ResumeSection>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import AppIcon from '~/components/ui/AppIcon.vue'
import SkillGlyph from '~/components/ui/SkillGlyph.vue'
import ResumeSection from '~/components/ui/ResumeSection.vue'
import { revealDelay } from '~/utils/reveal'
import { skillIcon } from '~/utils/skillIcons'

const { cvData, uiCopy } = useCvData()
const { bumpReveal } = useRevealController()

const ALL = '__all'
const active = ref<string>(ALL)

const groups = computed(() =>
  Object.entries(cvData.value?.skills ?? {}).map(([category, items], index) => ({
    category,
    index,
    items,
  })),
)

const tabs = computed(() => [
  { key: ALL, label: uiCopy.value.sections.skillsAll },
  ...groups.value.map((group) => ({ key: group.category, label: group.category })),
])

const shown = computed(() =>
  active.value === ALL
    ? groups.value
    : groups.value.filter((group) => group.category === active.value),
)

const setActive = (key: string) => {
  active.value = key
  // New `.reveal` groups were rendered — ask the layout observer to re-scan.
  bumpReveal()
}

// Reset to "All" if the active category disappears after a language switch.
watch(groups, () => {
  if (active.value !== ALL && !groups.value.some((group) => group.category === active.value)) {
    active.value = ALL
  }
})
</script>
