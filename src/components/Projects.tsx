'use client'

import { useState } from 'react'
import { Plus, Building2, ChevronDown, ChevronRight, Layers, CheckCircle2, Trash2, Lock, LockIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/contexts/AppContext'
import { useProjectAuth } from '@/contexts/ProjectAuthContext'
import { toast } from '@/hooks/use-toast'

interface Project {
  id: string
  projectCode: string
  name: string
  description: string
  password?: string
  blocks: Block[]
}

interface Block {
  id: string
  projectId: string
  name: string
  floors: Floor[]
}

interface Floor {
  id: string
  blockId: string
  floorNumber: number
  floorName: string | null
  notes: string | null
  concreteDate: string | null
  concreteReview: string | null
  groOeuvreProgress: number
  cetProgress: number
  cesProgress: number
}

export function Projects() {
  const { t } = useApp()
  const { isProjectUnlocked, unlockProject } = useProjectAuth()
  const [projects, setProjects] = useState<Project[]>([])

  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const [showAddBlockDialog, setShowAddBlockDialog] = useState(false)
  const [showAddFloorDialog, setShowAddFloorDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [projectToUnlock, setProjectToUnlock] = useState<Project | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [deleteType, setDeleteType] = useState<'project' | 'block' | 'floor' | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ projectId: string; blockId?: string; floorId?: string } | null>(null)
  const [selectedProjectForBlock, setSelectedProjectForBlock] = useState<string | null>(null)
  const [selectedBlockForFloor, setSelectedBlockForFloor] = useState<string | null>(null)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())

  const [projectFormData, setProjectFormData] = useState({
    projectCode: '',
    name: '',
    description: '',
    password: '',
  })

  const [blockFormData, setBlockFormData] = useState({
    name: '',
  })

  const [floorFormData, setFloorFormData] = useState({
    floorNumber: 1,
    floorName: '',
    notes: '',
    concreteDate: '',
    concreteReview: '',
    groOeuvreProgress: 0,
    cetProgress: 0,
    cesProgress: 0,
  })

  const handleCreateProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      projectCode: projectFormData.projectCode,
      name: projectFormData.name,
      description: projectFormData.description,
      password: projectFormData.password || undefined,
      blocks: [],
    }

    setProjects([newProject, ...projects])
    setShowCreateProjectDialog(false)
    setProjectFormData({ projectCode: '', name: '', description: '', password: '' })
    toast({
      title: t('success'),
      description: 'Project created successfully',
    })
  }

  const handleCreateBlock = () => {
    if (!selectedProjectForBlock) return

    const newBlock: Block = {
      id: 'block-' + Date.now(),
      projectId: selectedProjectForBlock,
      name: blockFormData.name,
      floors: [],
    }

    setProjects(projects.map((project) => {
      if (project.id === selectedProjectForBlock) {
        return {
          ...project,
          blocks: [...project.blocks, newBlock],
        }
      }
      return project
    }))

    setShowAddBlockDialog(false)
    setBlockFormData({ name: '' })
    setSelectedProjectForBlock(null)
    toast({
      title: t('success'),
      description: 'Block created successfully',
    })
  }

  const handleCreateFloor = () => {
    if (!selectedBlockForFloor) return

    const newFloor: Floor = {
      id: 'floor-' + Date.now(),
      blockId: selectedBlockForFloor,
      floorNumber: floorFormData.floorNumber,
      floorName: floorFormData.floorName || null,
      notes: floorFormData.notes || null,
      concreteDate: floorFormData.concreteDate || null,
      concreteReview: floorFormData.concreteReview || null,
      groOeuvreProgress: floorFormData.groOeuvreProgress,
      cetProgress: floorFormData.cetProgress,
      cesProgress: floorFormData.cesProgress,
    }

    setProjects(projects.map((project) => {
      const updatedBlocks = project.blocks.map((block) => {
        if (block.id === selectedBlockForFloor) {
          return {
            ...block,
            floors: [...block.floors, newFloor],
          }
        }
        return block
      })

      return {
        ...project,
        blocks: updatedBlocks,
      }
    }))

    setShowAddFloorDialog(false)
    setFloorFormData({
      floorNumber: 1,
      floorName: '',
      notes: '',
      concreteDate: '',
      concreteReview: '',
      groOeuvreProgress: 0,
      cetProgress: 0,
      cesProgress: 0,
    })
    setSelectedBlockForFloor(null)
    toast({
      title: t('success'),
      description: 'Floor created successfully',
    })
  }

  const toggleBlockExpanded = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks)
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId)
    } else {
      newExpanded.add(blockId)
    }
    setExpandedBlocks(newExpanded)
  }

  const handleDelete = () => {
    if (!itemToDelete || !deleteType) return

    if (deleteType === 'project') {
      setProjects(projects.filter(p => p.id !== itemToDelete.projectId))
      toast({
        title: t('success'),
        description: 'Project deleted successfully',
      })
    } else if (deleteType === 'block') {
      setProjects(projects.map(project => {
        if (project.id === itemToDelete.projectId) {
          return {
            ...project,
            blocks: project.blocks.filter(b => b.id !== itemToDelete.blockId)
          }
        }
        return project
      }))
      toast({
        title: t('success'),
        description: 'Block deleted successfully',
      })
    } else if (deleteType === 'floor') {
      setProjects(projects.map(project => {
        if (project.id === itemToDelete.projectId) {
          const updatedBlocks = project.blocks.map(block => {
            if (block.id === itemToDelete.blockId) {
              return {
                ...block,
                floors: block.floors.filter(f => f.id !== itemToDelete.floorId)
              }
            }
            return block
          })
          return { ...project, blocks: updatedBlocks }
        }
        return project
      }))
      toast({
        title: t('success'),
        description: 'Floor deleted successfully',
      })
    }

    setShowDeleteDialog(false)
    setDeleteType(null)
    setItemToDelete(null)
  }

  const confirmDelete = (type: 'project' | 'block' | 'floor', projectId: string, blockId?: string, floorId?: string) => {
    setDeleteType(type)
    setItemToDelete({ projectId, blockId, floorId })
    setShowDeleteDialog(true)
  }

  const calculateOverallProgress = (floor: Floor) => {
    return Math.round((floor.groOeuvreProgress + floor.cetProgress + floor.cesProgress) / 3)
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

  const requestUnlockProject = (project: Project) => {
    setProjectToUnlock(project)
    setShowPasswordDialog(true)
    setPasswordInput('')
  }

  const toggleProjectExpanded = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project?.password && !isProjectUnlocked(projectId, project.password)) {
      requestUnlockProject(project)
      return
    }

    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
    } else {
      newExpanded.add(projectId)
    }
    setExpandedProjects(newExpanded)
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('projects')}</h1>
          <p className="text-muted-foreground mt-1">Manage your construction projects</p>
        </div>
        <Button onClick={() => setShowCreateProjectDialog(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          {t('createProject')}
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => toggleProjectExpanded(project.id)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant="outline">{project.projectCode}</Badge>
                    {project.password && (
                      <Badge variant="secondary" className="gap-1">
                        <LockIcon className="w-3 h-3" />
                        {isProjectUnlocked(project.id, project.password) ? t('projectUnlocked') : t('projectProtected')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{project.blocks.length} {project.blocks.length === 1 ? 'Block' : 'Blocks'}</span>
                    <span>•</span>
                    <span>
                      {project.blocks.reduce((acc, block) => acc + block.floors.length, 0)} Floors Total
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete('project', project.id)}
                    title={t('delete')}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  {project.password && !isProjectUnlocked(project.id, project.password) ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleProjectExpanded(project.id)}
                      title="Unlock project"
                      className="text-primary hover:text-primary"
                    >
                      <Lock className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => toggleProjectExpanded(project.id)}>
                      {expandedProjects.has(project.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedProjects.has(project.id) && (
              <CardContent className="pt-0 space-y-3">
                {project.blocks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No blocks yet</p>
                    <Button
                      onClick={() => {
                        setSelectedProjectForBlock(project.id)
                        setShowAddBlockDialog(true)
                      }}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('addBlock')}
                    </Button>
                  </div>
                ) : (
                  project.blocks.map((block) => (
                    <div key={block.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => toggleBlockExpanded(block.id)}>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{block.name}</h3>
                            <Badge variant="secondary">{block.floors.length} Floors</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProjectForBlock(project.id)
                              setShowAddBlockDialog(true)
                            }}
                            className="gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Block
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete('block', project.id, block.id)}
                            title={t('delete')}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleBlockExpanded(block.id)}>
                            {expandedBlocks.has(block.id) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {expandedBlocks.has(block.id) && (
                        <div className="space-y-3 pl-2">
                          {block.floors.length === 0 ? (
                            <div className="text-center py-4 border border-dashed border-border rounded-lg">
                              <p className="text-sm text-muted-foreground mb-3">No floors yet</p>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedBlockForFloor(block.id)
                                  setShowAddFloorDialog(true)
                                }}
                                className="gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                {t('addFloor')}
                              </Button>
                            </div>
                          ) : (
                            block.floors.map((floor) => (
                              <div key={floor.id} className="bg-muted/50 rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-medium text-foreground">
                                        {t('floor')} {floor.floorNumber}
                                      </h4>
                                      {floor.floorName && (
                                        <Badge variant="outline">{floor.floorName}</Badge>
                                      )}
                                    </div>
                                    {floor.notes && (
                                      <p className="text-sm text-muted-foreground">{floor.notes}</p>
                                    )}
                                    {floor.concreteDate && (
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                                        <span>{new Date(floor.concreteDate).toLocaleString()}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => confirmDelete('floor', project.id, block.id, floor.id)}
                                      title={t('delete')}
                                      className="text-destructive hover:text-destructive h-8 w-8"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">{t('groOeuvre')}</span>
                                      <span className="font-medium">{floor.groOeuvreProgress}%</span>
                                    </div>
                                    <Progress value={floor.groOeuvreProgress} className="h-2" />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">CET</span>
                                      <span className="font-medium">{floor.cetProgress}%</span>
                                    </div>
                                    <Progress value={floor.cetProgress} className="h-2" />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">CES</span>
                                      <span className="font-medium">{floor.cesProgress}%</span>
                                    </div>
                                    <Progress value={floor.cesProgress} className="h-2" />
                                  </div>

                                  <div className="space-y-1 pt-2 border-t border-border">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Overall Progress</span>
                                      <span className="font-bold text-primary">
                                        {calculateOverallProgress(floor)}%
                                      </span>
                                    </div>
                                    <Progress value={calculateOverallProgress(floor)} className="h-2" />
                                  </div>
                                </div>

                                {floor.concreteReview && (
                                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg">
                                    <span className="text-sm font-medium text-foreground">
                                      {t('concreteReview')}
                                    </span>
                                    <Badge>{floor.concreteReview}</Badge>
                                  </div>
                                )}

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBlockForFloor(block.id)
                                    setShowAddFloorDialog(true)
                                  }}
                                  className="w-full gap-1"
                                >
                                  <Plus className="w-4 h-4" />
                                  {t('addFloor')}
                                </Button>
                              </div>
                            ))
                          )}

                          {block.floors.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBlockForFloor(block.id)
                                setShowAddFloorDialog(true)
                              }}
                              className="w-full gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              {t('addFloor')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createProject')}</DialogTitle>
            <DialogDescription>Create a new construction project</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('projectCode')} *</Label>
              <Input
                placeholder="e.g., PRJ-2024-001"
                value={projectFormData.projectCode}
                onChange={(e) => setProjectFormData({ ...projectFormData, projectCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('projectName')} *</Label>
              <Input
                placeholder="Enter project name"
                value={projectFormData.name}
                onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('description')}</Label>
              <Textarea
                placeholder="Enter project description"
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('passwordOptional')}</Label>
              <Input
                type="password"
                placeholder="Leave empty for no password"
                value={projectFormData.password}
                onChange={(e) => setProjectFormData({ ...projectFormData, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProjectDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateProject}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddBlockDialog} onOpenChange={setShowAddBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
            <DialogDescription>Add a new block to project</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('blockName')} *</Label>
              <Input
                placeholder="e.g., Block A"
                value={blockFormData.name}
                onChange={(e) => setBlockFormData({ ...blockFormData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBlockDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateBlock}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddFloorDialog} onOpenChange={setShowAddFloorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('addFloor')}</DialogTitle>
            <DialogDescription>Add a new floor with tracking details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>{t('floor')} Number *</Label>
              <Input
                type="number"
                min="1"
                value={floorFormData.floorNumber}
                onChange={(e) => setFloorFormData({ ...floorFormData, floorNumber: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('floorName')}</Label>
              <Input
                placeholder="e.g., Ground Floor, First Floor"
                value={floorFormData.floorName}
                onChange={(e) => setFloorFormData({ ...floorFormData, floorName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('notes')}</Label>
              <Textarea
                placeholder="Add notes about this floor"
                value={floorFormData.notes}
                onChange={(e) => setFloorFormData({ ...floorFormData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('concreteDate')}</Label>
              <Input
                type="datetime-local"
                value={floorFormData.concreteDate}
                onChange={(e) => setFloorFormData({ ...floorFormData, concreteDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('concreteReview')}</Label>
              <Input
                placeholder="e.g., Approved, Pending, Rejected"
                value={floorFormData.concreteReview}
                onChange={(e) => setFloorFormData({ ...floorFormData, concreteReview: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">Progress Tracking</h4>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{t('groOeuvre')}</Label>
                    <span className="font-bold text-primary">{floorFormData.groOeuvreProgress}%</span>
                  </div>
                  <Progress value={floorFormData.groOeuvreProgress} />
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={floorFormData.groOeuvreProgress}
                    onChange={(e) => setFloorFormData({ ...floorFormData, groOeuvreProgress: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>CET</Label>
                    <span className="font-bold text-primary">{floorFormData.cetProgress}%</span>
                  </div>
                  <Progress value={floorFormData.cetProgress} />
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={floorFormData.cetProgress}
                    onChange={(e) => setFloorFormData({ ...floorFormData, cetProgress: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>CES</Label>
                    <span className="font-bold text-primary">{floorFormData.cesProgress}%</span>
                  </div>
                  <Progress value={floorFormData.cesProgress} />
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={floorFormData.cesProgress}
                    onChange={(e) => setFloorFormData({ ...floorFormData, cesProgress: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFloorDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateFloor}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteType === 'project' && 'Delete Project'}
              {deleteType === 'block' && 'Delete Block'}
              {deleteType === 'floor' && 'Delete Floor'}
            </DialogTitle>
            <DialogDescription>
              {deleteType === 'project' && 'Are you sure you want to delete this project? All blocks and floors within it will also be deleted. This action cannot be undone.'}
              {deleteType === 'block' && 'Are you sure you want to delete this block? All floors within it will also be deleted. This action cannot be undone.'}
              {deleteType === 'floor' && 'Are you sure you want to delete this floor? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('enterPassword')}</DialogTitle>
            <DialogDescription>
              This project is protected. Please enter the password to access its details.
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
