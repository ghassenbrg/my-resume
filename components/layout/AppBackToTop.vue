<template>
  <button
    class="back-top no-print"
    :class="{ show }"
    type="button"
    :aria-label="uiCopy.actions.backToTop"
    @click="scrollToTop"
  >
    <AppIcon name="up" :size="18" />
  </button>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'

const { uiCopy } = useCvData()
const show = ref(false)

const onScroll = () => {
  show.value = window.scrollY > 700
}

const scrollToTop = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
