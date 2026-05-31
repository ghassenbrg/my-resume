/* Dark / light theme state. Default = dark; the choice is remembered per
 * visitor in localStorage and reflected on <html data-theme>. A pre-paint
 * inline script (see app.vue) applies the stored value before hydration to
 * avoid a flash; this composable keeps Vue state in sync afterwards. */

export type ThemeName = 'dark' | 'light'

const STORAGE_KEY = 'cv-theme'

export const useTheme = () => {
  const theme = useState<ThemeName>('cv-theme', () => 'dark')

  // Whether the visitor has an explicit saved preference (vs. a default).
  const hasStoredPreference = useState<boolean>('cv-theme-stored', () => false)

  const applyDataTheme = (value: ThemeName) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', value)
    }
  }

  const persist = (value: ThemeName) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, value)
        hasStoredPreference.value = true
      } catch {
        /* storage unavailable — ignore */
      }
    }
  }

  // Explicit user choice (or an applied config default): update + remember it.
  const setTheme = (value: ThemeName) => {
    theme.value = value
    persist(value)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    let stored: ThemeName | null = null

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      stored = raw === 'light' || raw === 'dark' ? raw : null
    } catch {
      stored = null
    }

    if (stored) {
      hasStoredPreference.value = true

      if (stored !== theme.value) {
        theme.value = stored
      }
    }

    // Reflect the resolved theme without persisting a non-choice.
    applyDataTheme(theme.value)
  })

  watch(theme, applyDataTheme)

  return { theme, setTheme, toggleTheme, hasStoredPreference }
}
