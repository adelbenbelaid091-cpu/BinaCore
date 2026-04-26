'use client'

import { useState } from 'react'
import { Plus, AlertTriangle, CheckCircle2, Clock, Edit, Trash2, Filter, Lock, LockIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/contexts/AppContext'
import { useProjectAuth } from '@/contexts/ProjectAuthContext'
import { toast } from '@/hooks/use-toast'

interface Issue {
  id: string
  projectId: string
  projectName: string
  title: string
  description: string
  type: 'structural' | 'safety' | 'material' | 'quality' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
  resolvedAt?: string
  floor?: string
}

interface ProjectWithPassword {
  id: string
  name: string
  password?: string
}

export function Issues() {
  const { t } = useApp()
  const { isProjectUnlocked, unlockProject } = useProjectAuth()

  // Projects with their passwords (should match projects in Projects.tsx)
  const projects: ProjectWithPassword[] = [
    { id: '1', name: 'Residential Tower A', password: '1234' },
    { id: '2', name: 'Commercial Complex B' },
    { id: '3', name: 'Villa Project C' },
  ]

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      projectId: '1',
      projectName: 'Residential Tower A',
      title: 'Crack in concrete - Floor 5',
      description: 'Minor crack observed in the slab of floor 5. Needs investigation and repair.',
      type: 'structural',
      severity: 'medium',
      status: 'open',
      createdAt: '2024-01-16T10:30:00',
      floor: 'Floor 5',
    },
    {
      id: '2',
      projectId: '1',
      projectName: 'Residential Tower A',
      title: 'Safety equipment missing',
      description: 'Hard hats and safety vests not available for workers on floor 3.',
      type: 'safety',
      severity: 'high',
      status: 'in_progress',
      createdAt: '2024-01-15T14:00:00',
      floor: 'Floor 3',
    },
    {
      id: '3',
      projectId: '2',
      projectName: 'Commercial Complex B',
      title: 'Material delay - Steel bars',
      description: 'Steel bars delivery delayed by 2 days.',
      type: 'material',
      severity: 'low',
      status: 'resolved',
      createdAt: '2024-01-12T09:00:00',
      resolvedAt: '2024-01-14T16:00:00',
      floor: 'Foundation',
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [projectToUnlock, setProjectToUnlock] = useState<ProjectWithPassword | null>(null)
  const [passwordInput, setPasswordInput] = useState('')

  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    type: 'other' as 'structural' | 'safety' | 'material' | 'quality' | 'other',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    floor: '',
  })

  const handleCreateIssue = () => {
    const project = projects.find(p => p.id === formData.projectId)
    const newIssue: Issue = {
      id: Date.now().toString(),
      projectId: formData.projectId,
      projectName: project?.name || 'Unknown Project',
      title: formData.title,
      description: formData.description,
      type: formData.type,
      severity: formData.severity,
      status: 'open',
      createdAt: new Date().toISOString(),
      floor: formData.floor || undefined,
    }

    setIssues([newIssue, ...issues])
    setShowCreateDialog(false)
    setFormData({
      projectId: '',
      title: '',
      description: '',
      type: 'other',
      severity: 'medium',
      floor: '',
    })
    toast({
      title: t('success'),
      description: 'Issue created successfully',
    })
  }

  const handleDeleteIssue = (id: string) => {
    setIssues(issues.filter(i => i.id !== id))
    toast({
      title: t('success'),
      description: 'Issue deleted successfully',
    })
  }

  const handleUpdateStatus = (id: string, status: 'open' | 'in_progress' | 'resolved') => {
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          status,
          resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
        }
      }
      return issue
    }))
    toast({
      title: t('success'),
      description: 'Issue status updated',
    })
  }

  const filteredIssues = issues.filter(issue => {
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false
    if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false
    return true
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">{t('resolved')}</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">{t('inProgress')}</Badge>
      default:
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">{t('open')}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'structural':
        return <Badge variant="outline">{t('structural')}</Badge>
      case 'safety':
        return <Badge variant="outline" className="border-red-500 text-red-700 dark:text-red-400">{t('safety')}</Badge>
      case 'material':
        return <Badge variant="outline">{t('material')}</Badge>
      case 'quality':
        return <Badge variant="outline">{t('quality')}</Badge>
      default:
        return <Badge variant="outline">{t('other')}</Badge>
    }
  }

  const isIssueUnlocked = (issue: Issue) => {
    const project = projects.find(p => p.id === issue.projectId)
    return isProjectUnlocked(issue.projectId, project?.password)
  }

  const handleUnlockProject = () => {
    if (!projectToUnlock) return

    if (unlockProject(projectToUnlock.id, projectToUnlock.password, passwordInput)) {
      setShowPasswordDialog(false)
      setPasswordInput('')
      setProjectToUnlock(null)
      toast({
        title: t('success'),
        description: t('projectUnlockedSuccess'),
      })
    } else {
      toast({
        title: t('error'),
        description: t('incorrectPassword'),
        variant: 'destructive',
      })
    }
  }

  const requestUnlockProject = (issue: Issue) => {
    const project = projects.find(p => p.id === issue.projectId)
    if (project) {
      setProjectToUnlock(project)
      setShowPasswordDialog(true)
      setPasswordInput('')
    }
  }

  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('issues')}</h1>
          <p className="text-muted-foreground mt-1">Track and manage site problems</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          {t('createIssue')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('totalIssues')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.open}</p>
                <p className="text-xs text-muted-foreground">{t('openIssues')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">{t('resolvedIssues')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t('filter')}:</span>
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">{t('open')}</SelectItem>
                <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
                <SelectItem value="resolved">{t('resolved')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={(value: any) => setFilterSeverity(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">{t('low')}</SelectItem>
                <SelectItem value="medium">{t('medium')}</SelectItem>
                <SelectItem value="high">{t('high')}</SelectItem>
                <SelectItem value="critical">{t('critical')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('noIssues')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredIssues.map((issue) => {
            const unlocked = isIssueUnlocked(issue)
            const project = projects.find(p => p.id === issue.projectId)
            const isProtected = project?.password

            return (
              <Card key={issue.id} className={`shadow-sm ${issue.status === 'resolved' ? 'opacity-60' : ''} ${!unlocked && isProtected ? 'opacity-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${!unlocked && isProtected ? 'bg-muted/50' : issue.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30' : issue.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-muted'}`}>
                      {!unlocked && isProtected ? (
                        <LockIcon className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        getStatusIcon(issue.status)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {unlocked ? (
                        <>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className="font-semibold text-foreground">{issue.title}</h3>
                                {getStatusBadge(issue.status)}
                                <Badge className={getSeverityColor(issue.severity)}>{t(issue.severity)}</Badge>
                                {getTypeBadge(issue.type)}
                                {isProtected && (
                                  <Badge variant="secondary" className="gap-1">
                                    <LockIcon className="w-3 h-3" />
                                    {t('projectProtected')}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{issue.projectName}</span>
                                {issue.floor && <span>• {issue.floor}</span>}
                                <span>• {new Date(issue.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {issue.status !== 'resolved' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(issue.id, 'resolved')}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Resolve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(issue.id, 'in_progress')}
                                  >
                                    <Clock className="w-4 h-4 mr-1" />
                                    In Progress
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteIssue(issue.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{issue.title}</h3>
                            <Badge className={getSeverityColor(issue.severity)}>{t(issue.severity)}</Badge>
                            {isProtected && (
                              <Badge variant="secondary" className="gap-1">
                                <LockIcon className="w-3 h-3" />
                                {t('projectProtected')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">This issue is protected. Enter the project password to view details.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => requestUnlockProject(issue)}
                          >
                            <Lock className="w-4 h-4" />
                            Unlock to View
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Create Issue Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createIssue')}</DialogTitle>
            <DialogDescription>Report a new site issue or problem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('issueTitle')}</Label>
              <Input
                placeholder="Enter issue title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('description')}</Label>
              <Textarea
                placeholder="Describe the issue in detail"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('issueType')}</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structural">{t('structural')}</SelectItem>
                    <SelectItem value="safety">{t('safety')}</SelectItem>
                    <SelectItem value="material">{t('material')}</SelectItem>
                    <SelectItem value="quality">{t('quality')}</SelectItem>
                    <SelectItem value="other">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('issueSeverity')}</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('low')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="high">{t('high')}</SelectItem>
                    <SelectItem value="critical">{t('critical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Floor / Location</Label>
              <Input
                placeholder="e.g., Floor 5, Foundation, Roof"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateIssue}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('enterPassword')}</DialogTitle>
            <DialogDescription>
              This project is protected. Please enter the password to access its issues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('projectName')}</Label>
              <Input value={projectToUnlock?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>{t('projectPassword')} *</Label>
              <Input
                type="password"
                placeholder="Enter project password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUnlockProject()
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleUnlockProject}>
              {t('unlockProject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
