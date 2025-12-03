export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('dark')

  const isDark = computed(() => mode.value === 'dark')
  const isLight = computed(() => mode.value === 'light')

  // Logo paths based on theme
  const logo = computed(() => {
    return mode.value === 'dark'
      ? '/assets/images/logo/hauboard_logo_white.webp'
      : '/assets/images/logo/hauboard_logo_black.webp'
  })

  const setTheme = (theme: ThemeMode) => {
    mode.value = theme

    if (import.meta.client) {
      // Update document class for Tailwind dark mode
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }

      // Persist to localStorage
      localStorage.setItem('theme', theme)
    }
  }

  const toggleTheme = () => {
    setTheme(mode.value === 'dark' ? 'light' : 'dark')
  }

  const initTheme = () => {
    if (import.meta.client) {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme') as ThemeMode | null

      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }

      // Add theme-ready class to enable transitions after initial load
      setTimeout(() => {
        document.documentElement.classList.add('theme-ready')
      }, 100)
    }
  }

  return {
    mode,
    isDark,
    isLight,
    logo,
    setTheme,
    toggleTheme,
    initTheme,
  }
})
