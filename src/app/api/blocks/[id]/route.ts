import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { BlockUpdate } from '@/types/supabase'

// PATCH /api/blocks/[id] - Update a block
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData: BlockUpdate = body

    const { data: block, error } = await supabase
      .from('blocks')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(block)
  } catch (error: any) {
    console.error('Error updating block:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update block' },
      { status: 500 }
    )
  }
}

// DELETE /api/blocks/[id] - Delete a block
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting block:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete block' },
      { status: 500 }
    )
  }
}
