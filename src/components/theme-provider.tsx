import { useEffect } from "react"
import { useStore } from '@nanostores/react'
import { themeStore, resolvedTheme, setTheme as setThemeStore, applyTheme, type Theme } from '@/stores/theme'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const resolved = useStore(resolvedTheme)

  // Initialize theme if needed
  useEffect(() => {
    if (!themeStore.get()) {
      themeStore.set(defaultTheme)
    }
  }, [defaultTheme])

  // Apply theme changes
  useEffect(() => {
    applyTheme(resolved)
  }, [resolved])

  return <>{children}</>
}

export const useTheme = () => {
  const theme = useStore(themeStore)
  const resolved = useStore(resolvedTheme)

  return {
    theme,
    resolvedTheme: resolved,
    setTheme: setThemeStore,
  }
}
