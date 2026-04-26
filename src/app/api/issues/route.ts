import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { IssueInsert, IssueUpdate } from '@/types/supabase'

// GET /api/issues - Get all issues
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')

    let query = supabase
      .from('issues')
      .select('*, projects (id, name, password)')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (severity && severity !== 'all') {
      query = query.eq('severity', severity)
    }

    const { data: issues, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(issues)
  } catch (error: any) {
    console.error('Error fetching issues:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}

// POST /api/issues - Create a new issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const issueData: IssueInsert = body

    const { data: issue, error } = await supabase
      .from('issues')
      .insert(issueData)
      .select('*, projects (id, name, password)')
      .single()

    if (error) throw error

    return NextResponse.json(issue, { status: 201 })
  } catch (error: any) {
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create issue' },
      { status: 500 }
    )
  }
}
