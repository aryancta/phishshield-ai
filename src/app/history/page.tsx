"use client"

import { motion } from "framer-motion"
import { HistoryTable } from "@/components/history-table"
import { MetricsCards } from "@/components/metrics-cards"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  History, 
  Download, 
  Trash2, 
  FileText,
  Shield,
  AlertTriangle,
  XCircle,
  Activity
} from "lucide-react"
import { useHistory } from "@/hooks/use-history"
import { useEffect, useState } from "react"

export default function HistoryPage() {
  const { history, loading, refreshHistory } = useHistory()
  const [historyStats, setHistoryStats] = useState({
    total: 0,
    safe: 0,
    suspicious: 0,
    highRisk: 0
  })

  useEffect(() => {
    if (history.length > 0) {
      const stats = history.reduce(
        (acc, item) => {
          acc.total += 1
          if (item.verdict === 'safe') acc.safe += 1
          else if (item.verdict === 'suspicious') acc.suspicious += 1
          else if (item.verdict === 'high_risk') acc.highRisk += 1
          return acc
        },
        { total: 0, safe: 0, suspicious: 0, highRisk: 0 }
      )
      setHistoryStats(stats)
    }
  }, [history])

  const metrics = [
    {
      label: "Total Scans",
      value: historyStats.total,
      icon: Activity,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20"
    },
    {
      label: "Safe Messages",
      value: historyStats.safe,
      icon: Shield,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      label: "Suspicious",
      value: historyStats.suspicious,
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20"
    },
    {
      label: "High Risk",
      value: historyStats.highRisk,
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10 border-red-500/20"
    }
  ]

  const handleExportHistory = () => {
    const csvContent = [
      ['Date', 'Verdict', 'Risk Score', 'Source Type', 'Summary'],
      ...history.map(item => [
        new Date(item.createdAt).toLocaleDateString(),
        item.verdict,
        item.riskScore,
        item.sourceType,
        item.summary.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ]
    .map(row => row.join(','))
    .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `phishshield-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      // In a real app, this would call an API to clear history
      localStorage.removeItem('phishshield-storage')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30">
              <History className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Scan History
              </h1>
              <p className="text-lg text-slate-400">
                Review all your previous security analyses
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3 mt-4 lg:mt-0"
        >
          <Button
            onClick={handleExportHistory}
            variant="outline"
            disabled={history.length === 0}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            onClick={handleClearHistory}
            variant="outline"
            disabled={history.length === 0}
            className="border-red-600 text-red-300 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </motion.div>
      </div>

      {/* Statistics Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MetricsCards metrics={metrics} />
      </motion.section>

      {/* History Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <HistoryTable />
      </motion.section>

      {/* Help & Tips */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-6 cyber-border">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Managing Your Scan History
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>Export Data:</strong> Download your scan history as a CSV file for record-keeping or analysis.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>View Reports:</strong> Click the report icon to view detailed analysis results for any scan.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>Filter Results:</strong> Use the search and filter options to find specific scans by verdict or content.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>Privacy:</strong> All data is stored locally on your device and can be cleared at any time.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  )
}