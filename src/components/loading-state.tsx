"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Search, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { DEMO_CONFIG } from "@/lib/constants"
import { useEffect, useState } from "react"

const steps = [
  { icon: Search, label: "Scanning message content" },
  { icon: Zap, label: "Analyzing suspicious patterns" },
  { icon: Shield, label: "Checking URL reputation" }, 
  { icon: Shield, label: "Generating risk assessment" },
  { icon: CheckCircle, label: "Preparing recommendations" }
]

interface LoadingStateProps {
  message?: string
  onComplete?: () => void
  duration?: number
}

export function LoadingState({ 
  message = "Analyzing message for threats...", 
  onComplete,
  duration = DEMO_CONFIG.ANALYSIS_DELAY
}: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepDuration = duration / steps.length
    const progressIncrement = 100 / steps.length

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1
        setProgress(next * progressIncrement)
        
        if (next >= steps.length) {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 200)
          return prev
        }
        
        return next
      })
    }, stepDuration)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  return (
    <Card className="p-6 cyber-border">
      <div className="space-y-6">
        {/* Main scanning animation */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-slate-700 border-t-cyan-400 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2 bg-slate-700"
          />
          <div className="text-center text-sm text-slate-400">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Current step indicator */}
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-1">{message}</h3>
            <p className="text-sm text-slate-400">
              Please wait while we analyze your message
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.3,
                    scale: isActive ? 1.02 : 1
                  }}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    isActive ? 'bg-cyan-500/10 border border-cyan-500/20' : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${
                    isCompleted ? 'text-emerald-400' :
                    isActive ? 'text-cyan-400' : 
                    'text-slate-500'
                  }`} />
                  <span className={`text-sm ${
                    isActive ? 'text-white' : 
                    isCompleted ? 'text-emerald-400' :
                    'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />
                  )}
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Scanning line effect */}
        <div className="relative overflow-hidden h-1 bg-slate-700/50 rounded-full">
          <div className="absolute inset-0 scan-line" />
        </div>
      </div>
    </Card>
  )
}