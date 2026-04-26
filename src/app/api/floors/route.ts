import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { FloorInsert, FloorUpdate } from '@/types/supabase'

// GET /api/floors - Get all floors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get('block_id')

    let query = supabase.from('floors').select('*')

    if (blockId) {
      query = query.eq('block_id', blockId)
    }

    const { data: floors, error } = await query.order('floor_number', { ascending: true })

    if (error) throw error

    return NextResponse.json(floors)
  } catch (error: any) {
    console.error('Error fetching floors:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch floors' },
      { status: 500 }
    )
  }
}

// POST /api/floors - Create a new floor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const floorData: FloorInsert = body

    const { data: floor, error } = await supabase
      .from('floors')
      .insert(floorData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(floor, { status: 201 })
  } catch (error: any) {
    console.error('Error creating floor:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create floor' },
      { status: 500 }
    )
  }
}
