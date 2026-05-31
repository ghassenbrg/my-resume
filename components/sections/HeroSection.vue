<template>
  <header id="hero" class="hero" data-screen-label="hero">
    <canvas ref="canvasRef" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="hero-fade"></div>

    <div v-if="hero" class="container hero-inner">
      <div class="hero-copy">
        <div v-if="openToOpportunities" class="status-pill">
          <span class="status-dot"></span>
          {{ uiCopy.actions.available }}
        </div>

        <h1 class="hero-name">{{ hero.name }}</h1>

        <div class="hero-title">
          <span class="grad-text">{{ hero.title }}</span>
          <span class="hero-loc">
            <AppIcon name="pin" :size="16" />
            {{ hero.location }}
          </span>
        </div>

        <p class="hero-tag">{{ tagline }}</p>

        <div class="hero-cta">
          <a
            v-if="cvLink"
            class="btn btn-primary"
            :href="cvLink"
            download
            @click="trackFollowUpClick(uiCopy.actions.downloadCV, cvLink)"
          >
            <AppIcon name="download" :size="17" />
            {{ uiCopy.actions.downloadCV }}
          </a>
          <a class="btn btn-ghost" href="#contact">
            {{ uiCopy.actions.contactMe }}
            <AppIcon name="arrow" :size="16" />
          </a>

          <div class="hero-social">
            <a
              v-if="social.github"
              class="icon-btn"
              :href="social.github"
              target="_blank"
              rel="noopener"
              :aria-label="uiCopy.actions.github"
            >
              <AppIcon name="github" :size="18" />
            </a>
            <a
              v-if="social.linkedin"
              class="icon-btn"
              :href="social.linkedin"
              target="_blank"
              rel="noopener"
              :aria-label="uiCopy.actions.linkedin"
            >
              <AppIcon name="linkedin" :size="18" />
            </a>
            <a
              v-if="email"
              class="icon-btn"
              :href="`mailto:${email}`"
              :aria-label="uiCopy.actions.email"
            >
              <AppIcon name="mail" :size="18" />
            </a>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-card">
          <div class="hero-card-top">
            <BrandMonogram :size="92" />
            <div class="hc-meta">
              <span class="hc-name">{{ hero.name }}</span>
              <span class="hc-role">{{ hero.title }}</span>
            </div>
          </div>
          <div class="hero-card-terminal">
            <div class="term-line">
              <span class="tk-key">role</span>: <span class="tk-str">"Application Engineer"</span>
            </div>
            <div class="term-line">
              <span class="tk-key">stack</span>: [<span class="tk-str">Java, K8s, GCP</span>]
            </div>
            <div class="term-line">
              <span class="tk-key">scale</span>: <span class="tk-num">25_000_000</span> members
            </div>
            <div class="term-line">
              <span class="tk-key">base</span>: <span class="tk-str">"Fukuoka, JP 🇯🇵"</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-hint no-print">
      <span>Scroll</span>
      <span class="scroll-track"><span class="scroll-thumb"></span></span>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'
import BrandMonogram from '~/components/ui/BrandMonogram.vue'

const { cvData, cvConfig, uiCopy } = useCvData()
const { trackFollowUpClick } = useAnalytics()

const hero = computed(() => cvData.value?.hero ?? null)
const tagline = computed(
  () => hero.value?.tagline ?? cvData.value?.about.paragraphs[0] ?? '',
)

// Shared, non-translatable values come from cv-config.json.
const openToOpportunities = computed(() => cvConfig.value?.openToOpportunities ?? false)
const cvLink = computed(() => cvConfig.value?.cvLink ?? '')
const email = computed(() => cvConfig.value?.contact.email ?? '')
const social = computed(() => cvConfig.value?.social ?? { github: '', linkedin: '' })

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  c: string
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const css = getComputedStyle(document.documentElement)
  const gold = (css.getPropertyValue('--gold') || '#e8a838').trim()
  const teal = (css.getPropertyValue('--teal') || '#56c4b8').trim()

  let raf = 0
  let width = 0
  let height = 0
  let nodes: Node[] = []
  let running = true

  const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const count = Math.round(Math.min(64, Math.max(26, (width * height) / 22000)))
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.6,
      c: Math.random() > 0.5 ? gold : teal,
    }))
  }

  const draw = () => {
    if (!running) {
      return
    }

    ctx.clearRect(0, 0, width, height)
    const lineBase = isLight() ? '20,20,31' : '245,240,232'

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i]
      a.x += a.vx
      a.y += a.vy
      if (a.x < 0 || a.x > width) a.vx *= -1
      if (a.y < 0 || a.y > height) a.vy *= -1

      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d = Math.hypot(dx, dy)
        if (d < 122) {
          ctx.strokeStyle = `rgba(${lineBase},${(1 - d / 122) * (isLight() ? 0.1 : 0.13)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      ctx.fillStyle = a.c
      ctx.globalAlpha = isLight() ? 0.55 : 0.7
      ctx.beginPath()
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(draw)
  }

  resize()

  if (!prefersReduced) {
    draw()
  } else {
    // Render a single static frame.
    running = true
    draw()
    running = false
  }

  window.addEventListener('resize', resize)

  onBeforeUnmount(() => {
    running = false
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  })
})
</script>
