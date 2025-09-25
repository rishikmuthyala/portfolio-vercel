import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo (in production, use a database)
const viewCounts = new Map<string, number>()

// Initialize with some default counts
viewCounts.set('building-scalable-nextjs-apps-2024', 0)
viewCounts.set('cybersecurity-ai-implementation-guide', 0)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Increment view count
    const currentViews = viewCounts.get(slug) || 0
    const newViews = currentViews + 1
    viewCounts.set(slug, newViews)

    console.log(`Blog post "${slug}" viewed. New count: ${newViews}`)

    return NextResponse.json({
      success: true,
      views: newViews,
      slug
    })

  } catch (error) {
    console.error('Blog view API error (POST):', error)
    return NextResponse.json(
      { error: 'Failed to process view' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const views = viewCounts.get(slug) || 0

    return NextResponse.json({
      success: true,
      views,
      slug
    })

  } catch (error) {
    console.error('Blog view API error (GET):', error)
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    )
  }
}
