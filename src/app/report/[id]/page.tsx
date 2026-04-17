"use client"

import { useEffect, useState } from "react"
import { ReportView } from "@/components/report-view"
import { LoadingState } from "@/components/loading-state"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Home } from "lucide-react"
import { Report } from "@/types"
import Link from "next/link"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Report not found')
          } else {
            setError('Failed to load report')
          }
          return
        }
        
        const reportData = await response.json()
        setReport(reportData)
      } catch (err) {
        console.error('Error fetching report:', err)
        setError('Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading security report..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center cyber-border">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {error}
          </h2>
          <p className="text-slate-400 mb-6">
            The requested security report could not be found or loaded.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/">
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/scan">
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
                <Shield className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (!report) {
    return null
  }

  return (
    <div className="min-h-screen py-8">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-8 no-print">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button 
              variant="outline"
              size="sm" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="text-sm text-slate-500">
            Report ID: {report.reportId}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <ReportView report={report} />
    </div>
  )
}