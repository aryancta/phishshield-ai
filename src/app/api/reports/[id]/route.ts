import { NextRequest, NextResponse } from 'next/server'
import { getReport } from '@/lib/report-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }
    
    const report = await getReport(id)
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(report)
  } catch (error) {
    console.error('Report fetch error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch report', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}