import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const floorId = searchParams.get('floorId')

    const where = floorId ? { floorId } : {}

    const activities = await db.activity.findMany({
      where,
      include: {
        floor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { floorId, type, status, dateTime, notes } = body

    if (!floorId || !type) {
      return NextResponse.json({ error: 'Floor ID and type are required' }, { status: 400 })
    }

    const activity = await db.activity.create({
      data: {
        floorId,
        type,
        status: status || 'not_started',
        dateTime: dateTime ? new Date(dateTime) : null,
        notes,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
