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
    const saved = sessionStorage.getItem('binacore-unlockedProjects')
    if (saved) {
      try {
        setUnlockedProjects(new Set(JSON.parse(saved)))
      } catch (error) {
        console.error('Failed to load unlocked projects:', error)
      }
    }
  }, [])

  // Save unlocked projects to session storage
  useEffect(() => {
    sessionStorage.setItem('binacore-unlockedProjects', JSON.stringify(Array.from(unlockedProjects)))
  }, [unlockedProjects])

  const isProjectUnlocked = (projectId: string, projectPassword?: string): boolean => {
    // If no password is set, project is always unlocked
    if (!projectPassword) return true
    // Otherwise, check if it's in the unlocked set
    return unlockedProjects.has(projectId)
  }

  const unlockProject = (projectId: string, projectPassword: string | undefined, passwordInput: string): boolean => {
    // If no password is set, automatically unlock
    if (!projectPassword) {
      setUnlockedProjects(new Set([...unlockedProjects, projectId]))
      return true
    }
    // Verify password
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
