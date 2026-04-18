<template>
  <component
    :is="as"
    ref="textRef"
    class="animated-text"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    as?: string
    start?: string
    y?: number
    duration?: number
  }>(),
  {
    as: 'span',
    start: 'top 80%',
    y: 60,
    duration: 0.8,
  },
)

const textRef = ref<HTMLElement | null>(null)
const { reveal } = useScrollAnimation()

onMounted(() => {
  reveal(textRef, {
    start: props.start,
    y: props.y,
    duration: props.duration,
  })
})
</script>

<style scoped>
.animated-text {
  display: inline-block;
}
</style>
