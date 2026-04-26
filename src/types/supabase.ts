export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ==================== PROJECTS ====================
export type DatabaseProject = {
  id: string
  project_code: string
  name: string
  description: string | null
  password: string | null
  created_at: string
  updated_at: string
}

export type ProjectInsert = Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>
export type ProjectUpdate = Partial<ProjectInsert>

// ==================== BLOCKS ====================
export type DatabaseBlock = {
  id: string
  project_id: string
  name: string
  created_at: string
}

export type BlockInsert = Omit<DatabaseBlock, 'id' | 'created_at'>
export type BlockUpdate = Partial<BlockInsert>

// ==================== FLOORS ====================
export type DatabaseFloor = {
  id: string
  block_id: string
  floor_number: number
  floor_name: string | null
  notes: string | null
  concrete_date: string | null
  concrete_review: string | null
  gro_oeuvre_progress: number
  cet_progress: number
  ces_progress: number
  created_at: string
  updated_at: string
}

export type FloorInsert = Omit<DatabaseFloor, 'id' | 'created_at' | 'updated_at'>
export type FloorUpdate = Partial<FloorInsert>

// ==================== REPORTS ====================
export type DatabaseReport = {
  id: string
  project_id: string
  type: 'PV_Visite' | 'PV_Constat'
  title: string
  description: string
  created_at: string
}

export type ReportInsert = Omit<DatabaseReport, 'id' | 'created_at'>
export type ReportUpdate = Partial<ReportInsert>

// ==================== ISSUES ====================
export type DatabaseIssue = {
  id: string
  project_id: string
  title: string
  description: string
  type: 'structural' | 'safety' | 'material' | 'quality' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved'
  floor: string | null
  created_at: string
  resolved_at: string | null
}

export type IssueInsert = Omit<DatabaseIssue, 'id' | 'created_at'>
export type IssueUpdate = Partial<IssueUpdate>
