"use client"

import * as React from "react"

type Theme =
  | "holographic"
  | "light"
  | "black"
  | "google"
  | "bharat"
  | "gov"
  | "tech"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "holographic",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "holographic",
  storageKey = "auditx-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [storageKey])

  React.useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    root.classList.remove(
      "theme-light",
      "theme-black",
      "theme-google",
      "theme-bharat",
      "theme-gov",
      "theme-tech",
    )

    if (theme === "light") {
      root.classList.add("theme-light")
    } else if (theme === "black") {
      root.classList.add("theme-black")
    } else if (theme === "google") {
      root.classList.add("theme-google")
    } else if (theme === "bharat") {
      root.classList.add("theme-bharat")
    } else if (theme === "gov") {
      root.classList.add("theme-gov")
    } else if (theme === "tech") {
      root.classList.add("theme-tech")
    }
    // holographic is the default in :root, so no class needed

    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey, mounted])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
