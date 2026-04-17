import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { scanUrl } from '@/lib/url-analysis'

const urlScanSchema = z.object({
  url: z.string().url('Valid URL is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = urlScanSchema.parse(body)
    
    const result = await scanUrl(validated.url)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('URL scan error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL format', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'URL scan failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'PhishShield AI URL Scanner API' })
}