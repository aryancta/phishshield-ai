"use client"

import { cn } from "@/lib/utils"
import { getRiskColor } from "@/lib/utils"

interface RiskMeterProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function RiskMeter({ 
  score, 
  size = 'md', 
  showLabel = true, 
  className 
}: RiskMeterProps) {
  const normalizedScore = Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = `${(normalizedScore / 100) * circumference} ${circumference}`
  const color = getRiskColor(normalizedScore)
  
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-sm', stroke: 4 },
    md: { container: 'w-24 h-24', text: 'text-base', stroke: 6 },
    lg: { container: 'w-32 h-32', text: 'text-lg', stroke: 8 }
  }
  
  const sizeConfig = sizes[size]
  
  const getGlowClass = () => {
    if (normalizedScore <= 30) return 'risk-glow-safe'
    if (normalizedScore <= 70) return 'risk-glow-suspicious'
    return 'risk-glow-high'
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-full",
        sizeConfig.container,
        getGlowClass()
      )}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth={sizeConfig.stroke}
            fill="none"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={`rgb(var(--${color}-500))`}
            strokeWidth={sizeConfig.stroke}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px rgb(var(--${color}-500) / 0.3))`
            }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-bold",
            sizeConfig.text,
            {
              'text-emerald-400': normalizedScore <= 30,
              'text-amber-400': normalizedScore > 30 && normalizedScore <= 70,
              'text-red-400': normalizedScore > 70,
            }
          )}>
            {normalizedScore}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="mt-2 text-center">
          <div className="text-xs text-slate-400">Risk Score</div>
          <div className={cn(
            "text-sm font-medium",
            {
              'text-emerald-400': normalizedScore <= 30,
              'text-amber-400': normalizedScore > 30 && normalizedScore <= 70,
              'text-red-400': normalizedScore > 70,
            }
          )}>
            {normalizedScore <= 30 ? 'Safe' : 
             normalizedScore <= 70 ? 'Suspicious' : 
             'High Risk'}
          </div>
        </div>
      )}
    </div>
  )
}