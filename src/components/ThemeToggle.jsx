import React, { useState, useEffect, useCallback } from "react"
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button"

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light')
  const { startTransition } = useThemeTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // 1️⃣ Intentar cargar el tema desde localStorage
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      return
    }

    // 2️⃣ Si no había guardado, usar el tema del sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const systemTheme = prefersDark ? "dark" : "light"

    setTheme(systemTheme)
    document.documentElement.classList.toggle("dark", prefersDark)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark"

    startTransition(() => {
      setTheme(newTheme)

      // Cambiar clase HTML
      document.documentElement.classList.toggle("dark", newTheme === "dark")

      // Guardarlo en storage
      localStorage.setItem("theme", newTheme)
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
