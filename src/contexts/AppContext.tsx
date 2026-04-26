'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, TranslationKey } from '@/lib/i18n'

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  currentPage: string
  setCurrentPage: (page: string) => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedLanguage = localStorage.getItem('binacore-language') as Language
    const savedTheme = localStorage.getItem('binacore-theme') as 'light' | 'dark'

    if (savedLanguage) setLanguageState(savedLanguage)
    if (savedTheme) setThemeState(savedTheme)

    // Apply theme to document
    if (savedTheme === 'dark' || (!savedTheme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('binacore-language', lang)
  }

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
    localStorage.setItem('binacore-theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        theme,
        setTheme: handleSetTheme,
        currentPage,
        setCurrentPage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
