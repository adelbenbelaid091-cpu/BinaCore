import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { BlockInsert, BlockUpdate } from '@/types/supabase'

// GET /api/blocks - Get all blocks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    let query = supabase.from('blocks').select('*, floors(*)')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: blocks, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(blocks)
  } catch (error: any) {
    console.error('Error fetching blocks:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blocks' },
      { status: 500 }
    )
  }
}

// POST /api/blocks - Create a new block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const blockData: BlockInsert = body

    const { data: block, error } = await supabase
      .from('blocks')
      .insert(blockData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(block, { status: 201 })
  } catch (error: any) {
    console.error('Error creating block:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create block' },
      { status: 500 }
    )
  }
}
