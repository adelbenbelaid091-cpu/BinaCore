import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { FloorUpdate } from '@/types/supabase'

// GET /api/floors/[id] - Get a single floor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: floor, error } = await supabase
      .from('floors')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    if (!floor) {
      return NextResponse.json(
        { error: 'Floor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(floor)
  } catch (error: any) {
    console.error('Error fetching floor:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch floor' },
      { status: 500 }
    )
  }
}

// PATCH /api/floors/[id] - Update a floor
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData: FloorUpdate = body

    const { data: floor, error } = await supabase
      .from('floors')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(floor)
  } catch (error: any) {
    console.error('Error updating floor:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update floor' },
      { status: 500 }
    )
  }
}

// DELETE /api/floors/[id] - Delete a floor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('floors')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting floor:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete floor' },
      { status: 500 }
    )
  }
}
