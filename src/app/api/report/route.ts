import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const reportCreateSchema = z.object({
  analysisId: z.string().min(1, 'Analysis ID is required'),
  includeMessage: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = reportCreateSchema.parse(body)
    
    // Check if analysis exists
    const analysis = await prisma.analysis.findUnique({
      where: { id: validated.analysisId }
    })
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    // Create or find existing report
    let report = await prisma.report.findFirst({
      where: { analysisId: validated.analysisId }
    })
    
    if (!report) {
      report = await prisma.report.create({
        data: {
          analysisId: validated.analysisId,
          shareSlug: analysis.reportId,
          includeMessage: validated.includeMessage,
          title: `PhishShield Report - ${analysis.verdict.toUpperCase()}`,
          status: 'active'
        }
      })
    }
    
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/report/${report.shareSlug}`
    
    return NextResponse.json({
      reportId: report.shareSlug,
      shareUrl
    })
  } catch (error) {
    console.error('Report creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create report', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'PhishShield AI Report Generation API' })
}