import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ReportInsert, ReportUpdate } from '@/types/supabase'

// GET /api/reports - Get all reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    let query = supabase
      .from('reports')
      .select('*, projects (id, name, password)')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: reports, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(reports)
  } catch (error: any) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const reportData: ReportInsert = body

    const { data: report, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select('*, projects (id, name, password)')
      .single()

    if (error) throw error

    return NextResponse.json(report, { status: 201 })
  } catch (error: any) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create report' },
      { status: 500 }
    )
  }
}
