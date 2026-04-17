import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const historyQuerySchema = z.object({
  verdict: z.enum(['safe', 'suspicious', 'high_risk']).optional(),
  q: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    const validated = historyQuerySchema.parse(params)
    
    const where: any = {}
    
    if (validated.verdict) {
      where.verdict = validated.verdict
    }
    
    if (validated.q) {
      where.OR = [
        { inputText: { contains: validated.q } },
        { summary: { contains: validated.q } }
      ]
    }
    
    const analyses = await prisma.analysis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: validated.limit,
      skip: validated.offset,
      select: {
        id: true,
        reportId: true,
        createdAt: true,
        sourceType: true,
        verdict: true,
        riskScore: true,
        summary: true
      }
    })
    
    const items = analyses.map(analysis => ({
      id: analysis.id,
      createdAt: analysis.createdAt.toISOString(),
      verdict: analysis.verdict,
      riskScore: analysis.riskScore,
      sourceType: analysis.sourceType,
      summary: analysis.summary,
      reportId: analysis.reportId
    }))
    
    return NextResponse.json({ items })
  } catch (error) {
    console.error('History fetch error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch history', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}