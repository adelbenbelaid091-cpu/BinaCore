import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.appSettings.findFirst()

    if (!settings) {
      settings = await db.appSettings.create({
        data: {
          language: 'en',
          theme: 'light',
          notifications: true,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { language, theme, notifications } = body

    let settings = await db.appSettings.findFirst()

    if (!settings) {
      settings = await db.appSettings.create({
        data: {
          language: language || 'en',
          theme: theme || 'light',
          notifications: notifications !== undefined ? notifications : true,
        },
      })
    } else {
      settings = await db.appSettings.update({
        where: { id: settings.id },
        data: {
          language: language !== undefined ? language : settings.language,
          theme: theme !== undefined ? theme : settings.theme,
          notifications: notifications !== undefined ? notifications : settings.notifications,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
