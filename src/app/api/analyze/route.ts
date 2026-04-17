import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analysisEngine } from '@/lib/analysis-engine'
import { createReport } from '@/lib/report-utils'
import prisma from '@/lib/db'

const analyzeSchema = z.object({
  text: z.string().min(1, 'Message text is required'),
  sourceType: z.enum(['message', 'sms', 'whatsapp', 'email', 'screenshot', 'url']),
  languageHint: z.string().optional(),
  includeUrlScan: z.boolean().optional().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = analyzeSchema.parse(body)
    
    // Perform analysis
    const result = await analysisEngine.analyzeMessage(validated)
    
    // Save analysis to database
    const analysis = await prisma.analysis.create({
      data: {
        id: result.analysisId,
        reportId: result.reportId,
        sourceType: validated.sourceType,
        inputText: validated.text,
        verdict: result.verdict,
        riskScore: result.riskScore,
        confidence: result.confidence,
        summary: result.summary,
        recommendedActions: JSON.stringify(result.recommendedActions),
        signals: JSON.stringify(result.signals),
        detectedUrls: JSON.stringify(result.detectedUrls),
        isDemo: process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
      }
    })
    
    // Create analysis reasons
    for (const reason of result.reasons) {
      await prisma.analysisReason.create({
        data: {
          analysisId: result.analysisId,
          category: reason.category,
          title: reason.title,
          detail: reason.detail,
          severity: reason.severity,
          evidence: reason.evidence
        }
      })
    }
    
    // Create shareable report
    await createReport(result, true)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Analysis failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'PhishShield AI Analysis API' })
}