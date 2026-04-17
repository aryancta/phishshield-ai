"use client"

import { motion } from "framer-motion"
import { MetricsCards, defaultMetrics } from "@/components/metrics-cards"
import { TrendChart } from "@/components/trend-chart"
import { HistoryTable } from "@/components/history-table"
import { ThreatInsights } from "@/components/threat-insights"
import { AnalysisInput } from "@/components/analysis-input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Activity,
  Eye,
  Download
} from "lucide-react"
import { useAnalysis } from "@/hooks/use-analysis"
import { useAppStore } from "@/store/use-app-store"
import { AnalysisRequest } from "@/types"
import Link from "next/link"

export default function DashboardPage() {
  const { analyzeMessage } = useAnalysis()
  const { currentAnalysis } = useAppStore()

  const handleQuickScan = async (request: AnalysisRequest) => {
    try {
      await analyzeMessage(request)
      // Redirect to scan page to see results
      window.location.href = '/scan'
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const quickActions = [
    {
      title: 'New Deep Scan',
      description: 'Comprehensive message analysis',
      icon: Shield,
      href: '/scan',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'View Samples',
      description: 'Try example scam messages',
      icon: Eye,
      href: '/samples',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Full History',
      description: 'All scan records',
      icon: Activity,
      href: '/history',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Export Data',
      description: 'Download scan reports',
      icon: Download,
      href: '/settings',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20'
    }
  ]

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
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Security Dashboard
              </h1>
              <p className="text-lg text-slate-400">
                Monitor threats and analyze suspicious messages
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
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
            System Online
          </Badge>
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time Protection
          </Badge>
        </motion.div>
      </div>

      {/* Metrics Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MetricsCards metrics={defaultMetrics} />
      </motion.section>

      {/* Quick Scan Panel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Quick Scan</h2>
          <Link href="/scan">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Open Full Scanner
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <AnalysisInput onAnalyze={handleQuickScan} />
      </motion.section>

      {/* Analytics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-white">Analytics & Trends</h2>
        <TrendChart />
      </motion.section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <Link href="/history">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <HistoryTable limit={8} />
        </motion.div>

        {/* Right Column - Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card className="p-6 cyber-border">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={index} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${action.bgColor}`}>
                          <Icon className={`w-4 h-4 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                            {action.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            {action.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </Card>

          {/* Current Analysis Status */}
          {currentAnalysis && (
            <Card className="p-6 cyber-border">
              <h3 className="text-lg font-semibold text-white mb-4">Latest Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Risk Score</span>
                  <span className="text-white font-semibold">
                    {currentAnalysis.riskScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Verdict</span>
                  <Badge
                    className={
                      currentAnalysis.verdict === 'high_risk'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : currentAnalysis.verdict === 'suspicious'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }
                  >
                    {currentAnalysis.verdict.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Threats Found</span>
                  <span className="text-white font-semibold">
                    {currentAnalysis.reasons.length}
                  </span>
                </div>
                <Button
                  onClick={() => window.open(`/report/${currentAnalysis.reportId}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          )}

          {/* System Status */}
          <Card className="p-6 cyber-border">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Detection Engine</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pattern Database</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Updated
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">URL Scanner</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Response Time</span>
                <span className="text-emerald-400 text-sm font-medium">
                  &lt;2s
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Threat Intelligence */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Threat Intelligence</h2>
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            3 Active Campaigns
          </Badge>
        </div>
        <ThreatInsights />
      </motion.section>
    </div>
  )
}