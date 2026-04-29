<template>
  <section
    id="contact"
    ref="sectionRef"
    class="contact-section section"
    aria-labelledby="contact-title"
  >
    <div class="section-container contact-section__container">
      <div ref="headerRef" class="contact-section__header">
        <p class="section-eyebrow">Contact</p>
        <h2 id="contact-title" class="contact-section__title">Terminal Contact</h2>
      </div>

      <div v-if="cvData" ref="terminalRef" class="contact-terminal">
        <header class="contact-terminal__chrome">
          <span>Terminal</span>
          <div aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </div>
        </header>

        <div class="contact-terminal__body">
          <div class="terminal-command">
            <p class="terminal-command__line">$ whoami</p>
            <p>{{ cvData.hero.name }} &mdash; Software Engineer</p>
          </div>

          <div class="terminal-command">
            <p class="terminal-command__line">$ contact --email</p>
            <p>
              <a :href="`mailto:${cvData.hero.email}`">{{ cvData.hero.email }}</a>
            </p>
          </div>

          <div class="terminal-command">
            <p class="terminal-command__line">$ connect --social</p>
            <ul class="contact-terminal__links">
              <li>
                <a :href="cvData.hero.github" target="_blank" rel="noreferrer">github.com/ghassenbrg</a>
              </li>
              <li>
                <a :href="cvData.hero.linkedin" target="_blank" rel="noreferrer">linkedin.com/in/ghassenbrg</a>
              </li>
            </ul>
          </div>

          <form class="contact-terminal__form" novalidate @submit.prevent="submitMessage">
            <p class="terminal-command__line">$ send-message --interactive</p>

            <div class="terminal-field">
              <label for="contact-name">name:</label>
              <input
                id="contact-name"
                v-model.trim="form.name"
                name="name"
                type="text"
                autocomplete="name"
                :aria-invalid="Boolean(errors.name)"
                aria-describedby="contact-name-error"
                @input="handleFieldInput('name')"
                @blur="validateField('name')"
              >
              <p
                v-if="errors.name"
                id="contact-name-error"
                class="terminal-field__error"
              >
                {{ errors.name }}
              </p>
            </div>

            <div class="terminal-field">
              <label for="contact-email">email:</label>
              <input
                id="contact-email"
                v-model.trim="form.email"
                name="email"
                type="email"
                autocomplete="email"
                :aria-invalid="Boolean(errors.email)"
                aria-describedby="contact-email-error"
                @input="handleFieldInput('email')"
                @blur="validateField('email')"
              >
              <p
                v-if="errors.email"
                id="contact-email-error"
                class="terminal-field__error"
              >
                {{ errors.email }}
              </p>
            </div>

            <div class="terminal-field terminal-field--message">
              <label for="contact-message">message:</label>
              <textarea
                id="contact-message"
                v-model.trim="form.message"
                name="message"
                rows="4"
                :aria-invalid="Boolean(errors.message)"
                aria-describedby="contact-message-error"
                @input="handleFieldInput('message')"
                @blur="validateField('message')"
              ></textarea>
              <p
                v-if="errors.message"
                id="contact-message-error"
                class="terminal-field__error"
              >
                {{ errors.message }}
              </p>
            </div>

            <button
              class="contact-terminal__submit"
              type="submit"
              :disabled="status === 'sending'"
            >
              &gt; {{ status === 'sending' ? 'sending_' : 'submit_' }} <span aria-hidden="true"></span>
            </button>

            <p
              v-if="statusMessage"
              class="contact-terminal__status"
              :class="{
                'contact-terminal__status--success': status === 'sent',
                'contact-terminal__status--error': status === 'error',
              }"
              role="status"
              aria-live="polite"
            >
              {{ statusMessage }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type ContactField = 'name' | 'email' | 'message'
type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const terminalRef = ref<HTMLElement | null>(null)
const scrollAnimation = useScrollAnimation()
const config = useRuntimeConfig()
const { trackEvent } = useAnalytics()
const { cvData, loadCvData } = useCvData()

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const errors = reactive<Record<ContactField, string>>({
  name: '',
  email: '',
  message: '',
})

const status = ref<ContactStatus>('idle')
const statusMessage = ref('')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateField = (field: ContactField) => {
  if (field === 'name') {
    errors.name = form.name ? '' : 'Name is required.'
  }

  if (field === 'email') {
    errors.email = form.email
      ? emailPattern.test(form.email)
        ? ''
        : 'Enter a valid email address.'
      : 'Email is required.'
  }

  if (field === 'message') {
    errors.message = form.message ? '' : 'Message is required.'
  }

  return !errors[field]
}

const validateForm = () => {
  const results = (['name', 'email', 'message'] as ContactField[]).map((field) => validateField(field))

  return results.every(Boolean)
}

const handleFieldInput = (field: ContactField) => {
  if (errors[field]) {
    validateField(field)
  }

  if (status.value === 'error') {
    statusMessage.value = ''
  }
}

const submitMessage = async () => {
  statusMessage.value = ''

  if (!validateForm()) {
    status.value = 'error'
    statusMessage.value = 'Fix the highlighted fields and run submit again.'
    return
  }

  const serviceId = config.public.emailjsServiceId
  const templateId = config.public.emailjsTemplateId
  const publicKey = config.public.emailjsPublicKey

  if (!serviceId || !templateId || !publicKey) {
    status.value = 'error'
    statusMessage.value = 'EmailJS configuration is missing.'
    return
  }

  status.value = 'sending'
  trackEvent('contact_form_submit', {
    source: 'contact_terminal',
    timestamp: new Date().toISOString(),
  })

  try {
    const { default: emailjs } = await import('emailjs-com')

    await emailjs.send(
      serviceId,
      templateId,
      {
        name: form.name,
        email: form.email,
        title: 'Portfolio contact',
        message: form.message,
      },
      publicKey,
    )

    status.value = 'sent'
    statusMessage.value = '✓ Message sent successfully. Expect a reply within 24h.'
    form.name = ''
    form.email = ''
    form.message = ''
    trackEvent('contact_form_success', {
      source: 'contact_terminal',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    status.value = 'error'
    statusMessage.value = 'Message failed to send. Email directly or try again later.'
    trackEvent('contact_form_error', {
      source: 'contact_terminal',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })
  }
}

onMounted(async () => {
  await loadCvData()
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

  await reveal(terminalRef, {
    trigger: terminalRef.value ?? undefined,
    start: 'top 72%',
    y: 36,
  })
})
</script>

<style scoped>
.contact-section {
  overflow: hidden;
  background:
    radial-gradient(circle at 80% 18%, rgba(232, 168, 56, 0.1), transparent 32%),
    linear-gradient(180deg, rgba(13, 13, 18, 0.96), rgba(9, 9, 15, 1));
}

.contact-section__container {
  display: grid;
  gap: var(--space-10);
  padding-block: var(--space-24);
}

.contact-section__header {
  display: grid;
  gap: var(--space-3);
}

.contact-section__title {
  margin: 0;
  color: var(--text-0);
  font-size: var(--text-h1);
  line-height: var(--leading-snug);
}

.contact-terminal {
  width: min(100%, 64rem);
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid rgba(232, 168, 56, 0.32);
  border-radius: 8px;
  background: rgba(9, 9, 15, 0.94);
  box-shadow:
    var(--shadow-card),
    var(--shadow-glow);
}

.contact-terminal__chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(26, 26, 46, 0.92);
  padding: var(--space-3) var(--space-5);
}

.contact-terminal__chrome span {
  color: var(--text-1);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.contact-terminal__chrome div {
  display: flex;
  gap: var(--space-2);
}

.contact-terminal__chrome i {
  width: 0.7rem;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
}

.contact-terminal__chrome i:nth-child(1) {
  background: var(--accent-rose);
}

.contact-terminal__chrome i:nth-child(2) {
  background: var(--accent-amber);
}

.contact-terminal__chrome i:nth-child(3) {
  background: var(--accent-teal);
}

.contact-terminal__body {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-8);
  font-family: var(--font-mono);
}

.terminal-command,
.contact-terminal__form {
  display: grid;
  gap: var(--space-2);
}

.terminal-command p,
.contact-terminal__links,
.contact-terminal__form p {
  margin: 0;
}

.terminal-command__line {
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  color: var(--accent-amber);
  white-space: nowrap;
}

.terminal-command p:not(.terminal-command__line),
.contact-terminal__links a {
  color: var(--text-1);
}

.contact-terminal__links {
  display: grid;
  gap: var(--space-2);
  padding: 0;
  list-style: none;
}

.contact-terminal__links a,
.terminal-command a {
  color: var(--accent-teal);
  text-decoration: none;
}

.contact-terminal__links a::before {
  color: var(--text-2);
  content: '-> ';
}

.contact-terminal__links a:hover,
.contact-terminal__links a:focus-visible,
.terminal-command a:hover,
.terminal-command a:focus-visible {
  color: var(--text-0);
}

.terminal-field {
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: var(--space-3);
  align-items: start;
}

.terminal-field label {
  color: var(--text-2);
  padding-top: var(--space-3);
}

.terminal-field input,
.terminal-field textarea {
  width: 100%;
  min-width: 0;
  border: 0;
  border-bottom: 1px solid var(--border-hover);
  border-radius: 0;
  background: transparent;
  color: var(--text-0);
  padding: var(--space-3) 0;
  font: inherit;
}

.terminal-field textarea {
  resize: vertical;
}

.terminal-field input:focus-visible,
.terminal-field textarea:focus-visible {
  outline: 0;
  border-color: var(--accent-amber);
  box-shadow: 0 1px 0 var(--accent-amber);
}

.terminal-field input[aria-invalid='true'],
.terminal-field textarea[aria-invalid='true'] {
  border-color: var(--accent-rose);
}

.terminal-field__error {
  grid-column: 2;
  color: var(--accent-rose);
  font-size: var(--text-xs);
}

.contact-terminal__submit {
  width: fit-content;
  border: 1px solid var(--accent-amber);
  border-radius: 8px;
  background: rgba(232, 168, 56, 0.12);
  color: var(--accent-amber);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-mono);
}

.contact-terminal__submit:hover,
.contact-terminal__submit:focus-visible {
  background: rgba(232, 168, 56, 0.18);
  color: var(--text-0);
}

.contact-terminal__submit:disabled {
  cursor: wait;
  opacity: 0.72;
}

.contact-terminal__submit span {
  display: inline-block;
  width: 0.5rem;
  height: 1em;
  margin-left: var(--space-1);
  background: currentColor;
  vertical-align: -0.15em;
}

.contact-terminal__status {
  color: var(--text-1);
}

.contact-terminal__status--success {
  color: var(--accent-teal);
}

.contact-terminal__status--error {
  color: var(--accent-rose);
}

@keyframes terminal-type {
  from {
    max-width: 0;
  }

  to {
    max-width: 32ch;
  }
}

@keyframes terminal-caret {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .terminal-command__line {
    animation: terminal-type 900ms steps(32, end) both;
  }

  .terminal-command:nth-child(2) .terminal-command__line {
    animation-delay: 120ms;
  }

  .terminal-command:nth-child(3) .terminal-command__line {
    animation-delay: 240ms;
  }

  .contact-terminal__form .terminal-command__line {
    animation-delay: 360ms;
  }

  .contact-terminal__submit span {
    animation: terminal-caret 1s step-end infinite;
  }
}

@media (max-width: 1023px) {
  .contact-terminal__body {
    padding: var(--space-6);
  }
}

@media (max-width: 767px) {
  .contact-section {
    scroll-margin-top: var(--space-20);
  }

  .contact-section__container {
    gap: var(--space-6);
    padding-block: var(--space-32) var(--space-16);
  }

  .contact-terminal__chrome {
    padding-inline: var(--space-4);
  }

  .contact-terminal__body {
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .terminal-field {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }

  .terminal-field label {
    padding-top: 0;
  }

  .terminal-field__error {
    grid-column: 1;
  }

  .contact-terminal__submit {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-command__line,
  .contact-terminal__submit span {
    animation: none;
  }
}
</style>
