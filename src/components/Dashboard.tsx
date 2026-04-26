'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText, Calendar, TrendingUp, Building2, Clock, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/contexts/AppContext'

interface Activity {
  id: string
  project: string
  action: string
  time: string
}

export function Dashboard() {
  const { t } = useApp()
  const [projects, setProjects] = useState([])

  const [activities] = useState<Activity[]>([])

  const quickActions = [
    { icon: Plus, label: t('addProject'), color: 'bg-accent' },
    { icon: FileText, label: t('viewReports'), color: 'bg-primary' },
    { icon: Calendar, label: t('dailyUpdate'), color: 'bg-secondary' },
  ]

  const getStatusColor = (progress: number) => {
    if (progress >= 75) return 'text-green-600 dark:text-green-400'
    if (progress >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getStatusBadge = (progress: number) => {
    if (progress >= 75) return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">{t('completed')}</Badge>
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">{t('inProgress')}</Badge>
    return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">{t('notStarted')}</Badge>
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard')}</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Engineer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                <p className="text-xs text-muted-foreground">{t('totalProjects')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0%</p>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm col-span-2 md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activities.length}</p>
                <p className="text-xs text-muted-foreground">{t('recentActivities')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm col-span-2 md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Pending Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto flex-col gap-2 p-6 hover:scale-105 transition-transform ${action.color} hover:opacity-90 text-white border-0`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-medium">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Projects Progress */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No projects yet. Create your first project to get started!</p>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">{project.floors} floors</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getStatusColor(project.progress)}`}>
                        {project.progress}%
                      </span>
                      {getStatusBadge(project.progress)}
                    </div>
                  </div>
                  <Progress
                    value={project.progress}
                    className="h-2"
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t('recentActivities')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activities yet.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.project}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
