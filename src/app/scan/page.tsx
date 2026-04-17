"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AnalysisInput } from "@/components/analysis-input"
import { LoadingState } from "@/components/loading-state"
import { RiskMeter } from "@/components/risk-meter"
import { VerdictBadge } from "@/components/verdict-badge"
import { ExplainabilityPanel } from "@/components/explainability-panel"
import { RecommendedActions } from "@/components/recommended-actions"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, 
  Zap, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Target,
  Eye,
  Link as LinkIcon,
  CreditCard,
  RefreshCw
} from "lucide-react"
import { useAnalysis } from "@/hooks/use-analysis"
import { useAppStore } from "@/store/use-app-store"
import { AnalysisRequest, DetectedUrl, AnalysisSignals } from "@/types"
import { formatTimestamp } from "@/lib/utils"

export default function ScanPage() {
  const { analyzeMessage } = useAnalysis()
  const { currentAnalysis, isAnalyzing } = useAppStore()
  const [showAnalysisResult, setShowAnalysisResult] = useState(false)

  const handleAnalyze = async (request: AnalysisRequest) => {
    try {
      setShowAnalysisResult(false)
      await analyzeMessage(request)
      setShowAnalysisResult(true)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleCreateReport = () => {
    if (!currentAnalysis) return
    window.open(`/report/${currentAnalysis.reportId}`, '_blank')
  }

  const handleReset = () => {
    setShowAnalysisResult(false)
    useAppStore.getState().resetAnalysis()
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Deep Scan Workspace
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive threat analysis with detailed explanations and actionable recommendations
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Analysis Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnalysisInput onAnalyze={handleAnalyze} />
        </motion.div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <LoadingState />
          </motion.div>
        )}

        {/* Analysis Results */}
        {showAnalysisResult && currentAnalysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-8"
          >
            {/* Result Header */}
            <Card className="p-6 cyber-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-white">Scan Complete</h2>
                  <Badge variant="outline" className="text-slate-300">
                    ID: {currentAnalysis.analysisId.slice(0, 8)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <VerdictBadge verdict={currentAnalysis.verdict} size="lg" />
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-slate-400">
                Analyzed at {formatTimestamp(new Date())} • 
                Confidence: {Math.round(currentAnalysis.confidence * 100)}%
              </div>
            </Card>

            {/* Risk Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Score */}
              <Card className="p-6 cyber-border">
                <div className="text-center space-y-4">
                  <RiskMeter score={currentAnalysis.riskScore} size="lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Risk Assessment</h3>
                    <p className="text-sm text-slate-400">
                      {currentAnalysis.riskScore <= 30 
                        ? 'Low risk - appears legitimate'
                        : currentAnalysis.riskScore <= 70
                        ? 'Medium risk - suspicious patterns detected'
                        : 'High risk - likely phishing attempt'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <Card className="lg:col-span-2 p-6 cyber-border">
                <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  {currentAnalysis.summary}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="text-xl font-bold text-white">
                      {currentAnalysis.reasons.length}
                    </div>
                    <div className="text-xs text-slate-400">Threats</div>
                  </div>
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="text-xl font-bold text-white">
                      {currentAnalysis.detectedUrls.length}
                    </div>
                    <div className="text-xs text-slate-400">URLs</div>
                  </div>
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="text-xl font-bold text-white">
                      {Math.round(currentAnalysis.confidence * 100)}%
                    </div>
                    <div className="text-xs text-slate-400">Confidence</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Signal Breakdown */}
            <Card className="p-6 cyber-border">
              <h3 className="text-lg font-semibold text-white mb-4">Threat Signals</h3>
              <SignalBreakdown signals={currentAnalysis.signals} />
            </Card>

            {/* URL Analysis */}
            {currentAnalysis.detectedUrls.length > 0 && (
              <Card className="p-6 cyber-border">
                <h3 className="text-lg font-semibold text-white mb-4">URL Analysis</h3>
                <UrlAnalysisGrid urls={currentAnalysis.detectedUrls} />
              </Card>
            )}

            {/* Detailed Analysis */}
            <Tabs defaultValue="threats" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="threats">Threat Details</TabsTrigger>
                <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
                <TabsTrigger value="report">Generate Report</TabsTrigger>
              </TabsList>
              
              <TabsContent value="threats">
                <ExplainabilityPanel reasons={currentAnalysis.reasons} />
              </TabsContent>
              
              <TabsContent value="actions">
                <RecommendedActions
                  actions={currentAnalysis.recommendedActions}
                  verdict={currentAnalysis.verdict}
                  onCreateReport={handleCreateReport}
                />
              </TabsContent>
              
              <TabsContent value="report">
                <ReportPreview analysis={currentAnalysis} onCreateReport={handleCreateReport} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Empty State */}
        {!isAnalyzing && !showAnalysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter a suspicious message, URL, or upload a screenshot above to begin comprehensive threat analysis.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Signal Breakdown Component
function SignalBreakdown({ signals }: { signals: AnalysisSignals }) {
  const signalInfo = [
    { key: 'urgency', label: 'Urgency Tactics', icon: AlertTriangle, color: 'amber' },
    { key: 'impersonation', label: 'Impersonation', icon: Shield, color: 'red' },
    { key: 'paymentRequest', label: 'Payment Request', icon: CreditCard, color: 'orange' },
    { key: 'urlRisk', label: 'URL Risk', icon: LinkIcon, color: 'purple' },
    { key: 'brandMismatch', label: 'Brand Mismatch', icon: Eye, color: 'pink' },
  ]

  return (
    <div className="space-y-4">
      {signalInfo.map((signal) => {
        const score = signals[signal.key as keyof AnalysisSignals]
        const Icon = signal.icon
        
        return (
          <div key={signal.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  {signal.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">{score}/100</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    score > 70 ? 'text-red-400 border-red-500/20' :
                    score > 30 ? 'text-amber-400 border-amber-500/20' :
                    'text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {score > 70 ? 'High' : score > 30 ? 'Medium' : 'Low'}
                </Badge>
              </div>
            </div>
            <Progress 
              value={score} 
              className={`h-2 ${
                score > 70 ? 'bg-red-900' :
                score > 30 ? 'bg-amber-900' :
                'bg-emerald-900'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}

// URL Analysis Grid Component
function UrlAnalysisGrid({ urls }: { urls: DetectedUrl[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {urls.map((url, index) => (
        <div
          key={index}
          className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-3">
              <div className="text-sm font-medium text-white truncate">
                {url.domain}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {url.url}
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                url.risk === 'high_risk'
                  ? 'text-red-400 border-red-500/20'
                  : url.risk === 'suspicious'
                  ? 'text-amber-400 border-amber-500/20'
                  : 'text-emerald-400 border-emerald-500/20'
              }
            >
              {url.risk.replace('_', ' ')}
            </Badge>
          </div>
          
          {url.notes.length > 0 && (
            <div className="space-y-1">
              {url.notes.map((note, noteIndex) => (
                <div key={noteIndex} className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-400">{note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Report Preview Component
function ReportPreview({ 
  analysis, 
  onCreateReport 
}: { 
  analysis: any; 
  onCreateReport: () => void 
}) {
  return (
    <Card className="p-6 cyber-border">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Report Preview</h3>
          <p className="text-sm text-slate-400">
            Generate a comprehensive incident report for documentation and sharing.
          </p>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">PhishShield AI Report</h4>
            <VerdictBadge verdict={analysis.verdict} />
          </div>
          
          <div className="text-sm text-slate-300 space-y-2">
            <div>Risk Score: {analysis.riskScore}/100</div>
            <div>Threats Detected: {analysis.reasons.length}</div>
            <div>Analysis Confidence: {Math.round(analysis.confidence * 100)}%</div>
            <div>Report ID: {analysis.reportId}</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onCreateReport}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Full Report
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'PhishShield Analysis Result',
                  text: `Risk Score: ${analysis.riskScore}/100 - ${analysis.verdict}`,
                  url: window.location.href
                })
              }
            }}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Share Analysis
          </Button>
        </div>
      </div>
    </Card>
  )
}