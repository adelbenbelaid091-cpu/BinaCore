import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ProjectInsert, ProjectUpdate } from '@/types/supabase'

// GET /api/projects - Get all projects with blocks and floors
export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        blocks (
          *,
          floors (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const projectData: ProjectInsert = body

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}
