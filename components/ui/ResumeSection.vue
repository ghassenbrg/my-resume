<template>
  <section :id="id" class="section" :data-screen-label="id">
    <div class="container">
      <div v-if="kicker || title" class="section-head reveal">
        <span v-if="kicker" class="kicker">{{ kicker }}</span>
        <h2 v-if="title" class="section-title">{{ title }}</h2>
        <p v-if="lead" class="section-lead">{{ lead }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/* Standard section wrapper: id anchor + centered container + kicker/title head.
 * Ported from the design's <Section>. */
defineProps<{
  id: string
  kicker?: string
  title?: string
  lead?: string
}>()
</script>
