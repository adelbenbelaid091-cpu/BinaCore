'use client'

import { useApp } from '@/contexts/AppContext'
import { Dashboard } from '@/components/Dashboard'
import { Projects } from '@/components/Projects'
import { Reports } from '@/components/Reports'
import { Issues } from '@/components/Issues'
import { Settings } from '@/components/Settings'
import { BottomNav } from '@/components/BottomNav'
import { Building2 } from 'lucide-react'

export default function Home() {
  const { currentPage } = useApp()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'projects':
        return <Projects />
      case 'issues':
        return <Issues />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Logo - Only show on dashboard */}
        {currentPage === 'dashboard' && (
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">BinaCore</h1>
              <p className="text-xs text-muted-foreground">Construction Management</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
