"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Hero } from "@/components/hero"
import { AnalysisInput } from "@/components/analysis-input"
import { LoadingState } from "@/components/loading-state"
import { RiskMeter } from "@/components/risk-meter"
import { VerdictBadge } from "@/components/verdict-badge"
import { ExplainabilityPanel } from "@/components/explainability-panel"
import { RecommendedActions } from "@/components/recommended-actions"
import { SampleTemplateGrid } from "@/components/sample-template-grid"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, Zap, Brain, Users, ArrowRight, CheckCircle, Target, Globe, Lock } from "lucide-react"
import { useAnalysis } from "@/hooks/use-analysis"
import { useSamples } from "@/hooks/use-samples"
import { useAppStore } from "@/store/use-app-store"
import { AnalysisRequest, SampleTemplate } from "@/types"
import { toast } from "sonner"

export default function HomePage() {
  const analysisInputRef = useRef<HTMLDivElement>(null)
  const { analyzeMessage } = useAnalysis()
  const { samples } = useSamples()
  const { currentAnalysis, isAnalyzing } = useAppStore()
  const [showAnalysisResult, setShowAnalysisResult] = useState(false)

  const scrollToAnalyzer = () => {
    analysisInputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAnalyze = async (request: AnalysisRequest) => {
    try {
      setShowAnalysisResult(false)
      await analyzeMessage(request)
      setShowAnalysisResult(true)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleLoadSample = (sample: SampleTemplate) => {
    const request: AnalysisRequest = {
      text: sample.fullText,
      sourceType: sample.sourceType as any,
      includeUrlScan: true
    }
    handleAnalyze(request)
    scrollToAnalyzer()
  }

  const handleCreateReport = () => {
    if (!currentAnalysis) return
    
    // Navigate to report page
    window.open(`/report/${currentAnalysis.reportId}`, '_blank')
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms trained on thousands of phishing patterns",
      color: "text-cyan-400"
    },
    {
      icon: Target,
      title: "India-Specific Patterns",
      description: "Specialized detection for UPI fraud, delivery scams, and local threat vectors",
      color: "text-emerald-400"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get comprehensive threat assessment and explanations in under 2 seconds",
      color: "text-amber-400"
    },
    {
      icon: Lock,
      title: "Privacy-First",
      description: "All analysis happens locally. Your data never leaves your device",
      color: "text-purple-400"
    }
  ]

  return (
    <div className="min-h-screen space-y-16">
      {/* Hero Section */}
      <section>
        <Hero onGetStarted={scrollToAnalyzer} />
      </section>

      {/* Analysis Section */}
      <section ref={analysisInputRef} className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try It Now
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Paste any suspicious message below to see PhishShield AI in action
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnalysisInput onAnalyze={handleAnalyze} />
          
          {/* Analysis Results */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <LoadingState />
            </motion.div>
          )}

          {showAnalysisResult && currentAnalysis && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {/* Result Summary */}
              <Card className="p-6 cyber-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
                  <VerdictBadge verdict={currentAnalysis.verdict} size="lg" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <RiskMeter score={currentAnalysis.riskScore} size="lg" />
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Summary</h4>
                      <p className="text-slate-300 leading-relaxed">
                        {currentAnalysis.summary}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div>
                        <span className="font-medium">Confidence:</span>{' '}
                        {Math.round(currentAnalysis.confidence * 100)}%
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div>
                        <span className="font-medium">Threats Found:</span>{' '}
                        {currentAnalysis.reasons.length}
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div>
                        <span className="font-medium">URLs Scanned:</span>{' '}
                        {currentAnalysis.detectedUrls.length}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExplainabilityPanel reasons={currentAnalysis.reasons} />
                <RecommendedActions 
                  actions={currentAnalysis.recommendedActions}
                  verdict={currentAnalysis.verdict}
                  onCreateReport={handleCreateReport}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Sample Templates Section */}
      <section id="demo-section" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Common Scam Examples
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Try analyzing these real-world scam examples to see how PhishShield AI identifies threats
          </p>
        </div>

        <SampleTemplateGrid samples={samples} onLoadSample={handleLoadSample} />
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose PhishShield AI?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Built specifically for the Indian threat landscape with cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full cyber-border hover:border-cyan-500/30 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full bg-slate-800/50 border border-slate-700 group-hover:border-current transition-colors ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <Card className="max-w-4xl mx-auto p-12 cyber-border bg-gradient-to-br from-slate-900/50 to-slate-800/50">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Protect Yourself?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join thousands of users who trust PhishShield AI to keep them safe from phishing and scams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToAnalyzer}
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg group"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Scanning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.open('/dashboard', '_blank')}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg"
              >
                View Dashboard
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Privacy-first</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-12 pb-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold text-white">PhishShield AI</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Advanced phishing detection powered by AI. Built for India, trusted globally.
          </p>
          <div className="text-xs text-slate-500">
            <p>© 2024 PhishShield AI. All rights reserved.</p>
            <p className="mt-1">
              Created by <span className="text-cyan-400">Aryan Choudhary</span> • 
              <a href="mailto:aryancta@gmail.com" className="text-cyan-400 hover:text-cyan-300 ml-1">
                aryancta@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}