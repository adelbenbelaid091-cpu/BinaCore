'use client'

import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Languages, Sun, Moon, Bell, Globe } from 'lucide-react'

export function Settings() {
  const { t, language, setLanguage, theme, setTheme } = useApp()

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
  ]

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('settings')}</h1>
        <p className="text-muted-foreground mt-1">Customize your BinaCore experience</p>
      </div>

      {/* Language Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-foreground">{lang.name}</span>
              </div>
              <Button
                variant={language === lang.code ? 'default' : 'outline'}
                onClick={() => setLanguage(lang.code)}
              >
                {language === lang.code ? 'Selected' : 'Select'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('theme')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer ${
              theme === 'light' ? 'bg-primary/5 border-primary/20' : ''
            }`}
            onClick={() => setTheme('light')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <span className="font-medium text-foreground block">{t('lightMode')}</span>
                <span className="text-xs text-muted-foreground">Clean and bright interface</span>
              </div>
            </div>
            {theme === 'light' && <Switch checked readOnly />}
          </div>

          <div
            className={`flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer ${
              theme === 'dark' ? 'bg-primary/5 border-primary/20' : ''
            }`}
            onClick={() => setTheme('dark')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="font-medium text-foreground block">{t('darkMode')}</span>
                <span className="text-xs text-muted-foreground">Easy on the eyes</span>
              </div>
            </div>
            {theme === 'dark' && <Switch checked readOnly />}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <Label className="font-medium text-foreground">{t('enableNotifications')}</Label>
              <p className="text-xs text-muted-foreground mt-1">Receive alerts for project updates</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>About BinaCore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-foreground font-medium">1.0.0</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Build</span>
            <span className="text-foreground font-medium">2024.01</span>
          </div>
          <Separator />
          <p className="pt-2">
            BinaCore is a modern construction project management application designed for engineers and
            construction professionals to track projects, manage floors, and generate professional reports.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
