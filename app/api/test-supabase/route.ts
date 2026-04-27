import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test connection by fetching projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error: 'Supabase connection failed', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase!',
      projects: projects || [],
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    )
  }
}
