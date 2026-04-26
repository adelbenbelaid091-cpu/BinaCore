'use client'

import { Home, FolderOpen, FileText, Settings, AlertTriangle } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { currentPage, setCurrentPage, t } = useApp()

  const navItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'projects', icon: FolderOpen, label: t('projects') },
    { id: 'issues', icon: AlertTriangle, label: t('issues') },
    { id: 'reports', icon: FileText, label: t('reports') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-50">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                'flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200',
                isActive
                  ? 'text-accent bg-accent/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
