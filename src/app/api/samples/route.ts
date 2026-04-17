import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { SCAM_CATEGORIES } from '@/lib/constants'

const samplesQuerySchema = z.object({
  category: z.enum(SCAM_CATEGORIES as readonly [string, ...string[]]).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    const validated = samplesQuerySchema.parse(params)
    
    const where: any = {}
    
    if (validated.category) {
      where.category = validated.category
    }
    
    const templates = await prisma.sampleTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    const items = templates.map(template => ({
      id: template.id,
      category: template.category,
      title: template.title,
      preview: template.preview,
      fullText: template.fullText,
      sourceType: template.sourceType,
      riskHint: template.riskHint
    }))
    
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Samples fetch error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch samples', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}