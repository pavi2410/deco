import { persistentAtom } from '@nanostores/persistent'
import { computed } from 'nanostores'

export type Theme = 'dark' | 'light' | 'system'

// Persistent theme store
export const themeStore = persistentAtom<Theme>('deco-ui-theme', 'dark', {
  encode: (value) => value,
  decode: (value) => {
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value
    }
    return 'dark'
  },
})

// Computed store that resolves 'system' to actual theme
export const resolvedTheme = computed(themeStore, (theme) => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
})

// Helper function to set theme
export function setTheme(theme: Theme) {
  themeStore.set(theme)
}

// Apply theme to document
export function applyTheme(theme: 'dark' | 'light') {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

// Watch for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  mediaQuery.addEventListener('change', () => {
    if (themeStore.get() === 'system') {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      applyTheme(systemTheme)
    }
  })
}
