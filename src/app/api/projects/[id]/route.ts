import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ProjectUpdate } from '@/types/supabase'

// GET /api/projects/[id] - Get a single project with blocks and floors
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        blocks (
          *,
          floors (*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData: ProjectUpdate = body

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(project)
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    )
  }
}
