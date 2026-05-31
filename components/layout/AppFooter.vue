<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <BrandMonogram :size="44" :radius="12" :glow="false" />
        <div>
          <div class="footer-name">{{ name }}</div>
          <div class="footer-role">{{ role }}</div>
        </div>
      </div>
      <p class="footer-note">{{ uiCopy.footer.builtWith }}</p>
      <div class="footer-bottom">© {{ year }} {{ name }}. {{ uiCopy.footer.rights }}</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BrandMonogram from '~/components/ui/BrandMonogram.vue'

const { cvData, uiCopy } = useCvData()

const name = computed(() => cvData.value?.hero.name ?? 'Ghassen Bargougui')
const role = computed(() => cvData.value?.hero.title ?? '')
const year = new Date().getFullYear()
</script>
