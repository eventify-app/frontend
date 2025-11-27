import React, { useState, useEffect, useCallback } from "react"
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button"

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light') // estado local del tema
  const { startTransition } = useThemeTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Para evitar desajustes entre SSR y cliente
    setMounted(true)

    // Opcional: inicializar con el tema del sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    startTransition(() => {
      setTheme(newTheme)
      // Cambiar clase en el body para Tailwind dark
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })
  }, [theme, startTransition])

  if (!mounted) return null

  return (
      <div className="flex flex-col items-center gap-3">
        <ThemeToggleButton 
          theme={theme}
          onClick={handleThemeToggle}
          variant="circle"
          start="center"
        />
      </div>
  )
}

export default ThemeToggle
