import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'

const UIContext = createContext(null)

const HIDE_KEY = 'hb_hide_amounts'
const THEME_KEY = 'hb_theme'

// Paletas: solo claro y oscuro
const THEMES = {
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8f6f7',
    '--bg-card': '#ffffff',
    '--bg-hover': '#fafafa',
    '--text-primary': '#1f2430',
    '--text-secondary': '#6b6b7b',
    '--text-muted': '#9ca3af',
    '--text-inverse': '#ffffff',
    '--border': '#f0e6ea',
    '--border-strong': '#e5d9dd',
    '--brand-red': '#e2132b',
    '--brand-red-dark': '#b50f22',
    '--brand-red-light': '#fef2f2',
    '--brand-yellow': '#fbc02d',
    '--brand-yellow-dark': '#d97706',
    '--brand-yellow-light': '#fef9e7',
    '--success': '#16a34a',
    '--success-light': '#e6f4ea',
    '--warning': '#d97706',
    '--warning-light': '#fef3e2',
    '--error': '#dc2626',
    '--error-light': '#fdeaea',
    '--info': '#2563eb',
    '--info-light': '#eef4ff',
    '--shadow-sm': '0 1px 3px rgba(16,24,40,0.06)',
    '--shadow-md': '0 4px 12px rgba(16,24,40,0.08)',
    '--shadow-lg': '0 8px 24px rgba(16,24,40,0.12)',
  },
  dark: {
    '--bg-primary': '#1a1a2e',
    '--bg-secondary': '#16162a',
    '--bg-card': '#22223a',
    '--bg-hover': '#2a2a44',
    '--text-primary': '#e8e8f0',
    '--text-secondary': '#a0a0b8',
    '--text-muted': '#6b6b85',
    '--text-inverse': '#1a1a2e',
    '--border': '#2e2e4a',
    '--border-strong': '#3a3a58',
    '--brand-red': '#ff4d6a',
    '--brand-red-dark': '#e2132b',
    '--brand-red-light': '#2a1a22',
    '--brand-yellow': '#fbc02d',
    '--brand-yellow-dark': '#f59e0b',
    '--brand-yellow-light': '#2a2518',
    '--success': '#22c55e',
    '--success-light': '#1a2e20',
    '--warning': '#f59e0b',
    '--warning-light': '#2e2a1a',
    '--error': '#ef4444',
    '--error-light': '#2e1a1a',
    '--info': '#3b82f6',
    '--info-light': '#1a2236',
    '--shadow-sm': '0 1px 3px rgba(0,0,0,0.3)',
    '--shadow-md': '0 4px 12px rgba(0,0,0,0.4)',
    '--shadow-lg': '0 8px 24px rgba(0,0,0,0.5)',
  },
}

export function UIProvider({ children }) {
  const [hideAmounts, setHideAmounts] = useState(() => localStorage.getItem(HIDE_KEY) === '1')
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark')

  useEffect(() => {
    const colors = isDark ? THEMES.dark : THEMES.light
    const root = document.documentElement
    Object.entries(colors).forEach(([k, v]) => root.style.setProperty(k, v))
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleHideAmounts = useCallback(() => {
    setHideAmounts((p) => {
      const n = !p
      localStorage.setItem(HIDE_KEY, n ? '1' : '0')
      return n
    })
  }, [])

  const toggleTheme = useCallback(() => setIsDark((p) => !p), [])

  const value = useMemo(() => ({
    hideAmounts, toggleHideAmounts,
    isDark, toggleTheme,
  }), [hideAmounts, toggleHideAmounts, isDark, toggleTheme])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) return { hideAmounts: false, toggleHideAmounts: () => {}, isDark: false, toggleTheme: () => {} }
  return ctx
}
