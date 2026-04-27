'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProjectAuth {
  unlockedProjects: Set<string>
  isProjectUnlocked: (projectId: string, projectPassword?: string) => boolean
  unlockProject: (projectId: string, projectPassword?: string, passwordInput: string) => boolean
  lockProject: (projectId: string) => void
}

const ProjectAuthContext = createContext<ProjectAuth | undefined>(undefined)

export function ProjectAuthProvider({ children }: { children: ReactNode }) {
  const [unlockedProjects, setUnlockedProjects] = useState<Set<string>>(new Set())
  // Load unlocked projects from session storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem('binacore-unlockedProjects')
    if (saved) {
      try {
        const projects = JSON.parse(saved)
        setUnlockedProjects(new Set(projects))
      } catch (error) {
        console.error('Failed to load unlocked projects:', error)
      }
    }
  }, [])

  // Save unlocked projects to session storage
  useEffect(() => {
    if (typeof window !== 'undefined' && unlockedProjects.size > 0) {
      sessionStorage.setItem('binacore-unlockedProjects', JSON.stringify(Array.from(unlockedProjects)))
    }
  }, [unlockedProjects])

  const isProjectUnlocked = (projectId: string, projectPassword?: string): boolean => {
    if (!projectPassword) return true
    return unlockedProjects.has(projectId)
  }

  const unlockProject = (projectId: string, projectPassword: string | undefined, passwordInput: string): boolean => {
    if (!projectPassword) {
      setUnlockedProjects(new Set([...unlockedProjects, projectId]))
      return true
    }
    if (passwordInput === projectPassword) {
      setUnlockedProjects(new Set([...unlockedProjects, projectId]))
      return true
    }
    return false
  }

  const lockProject = (projectId: string) => {
    const newUnlocked = new Set(unlockedProjects)
    newUnlocked.delete(projectId)
    setUnlockedProjects(newUnlocked)
  }

  return (
    <ProjectAuthContext.Provider
      value={{
        unlockedProjects,
        isProjectUnlocked,
        unlockProject,
        lockProject,
      }}
    >
      {children}
    </ProjectAuthContext.Provider>
  )
}

export function useProjectAuth() {
  const context = useContext(ProjectAuthContext)
  if (context === undefined) {
    throw new Error('useProjectAuth must be used within a ProjectAuthProvider')
  }
  return context
}
