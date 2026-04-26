import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ReportUpdate } from '@/types/supabase'

// PATCH /api/reports/[id] - Update a report
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData: ReportUpdate = body

    const { data: report, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(report)
  } catch (error: any) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update report' },
      { status: 500 }
    )
  }
}

// DELETE /api/reports/[id] - Delete a report
export async function DELETE(
  request: NextRequest,
  { params }: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete report' },
      { status: 500 }
    )
  }
}
