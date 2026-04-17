"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Zap, 
  Eye,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricData {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: typeof Shield
  color: string
  bgColor: string
}

interface MetricsCardsProps {
  metrics: MetricData[]
  className?: string
}

export function MetricsCards({ metrics, className }: MetricsCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === 'up' ? ArrowUp : 
                         metric.trend === 'down' ? ArrowDown : null
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="p-6 cyber-border hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-lg border",
                  metric.bgColor,
                  "group-hover:scale-110 transition-transform duration-300"
                )}>
                  <Icon className={cn("w-6 h-6", metric.color)} />
                </div>
                
                {metric.change !== undefined && TrendIcon && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      metric.trend === 'up' 
                        ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                        : metric.trend === 'down'
                        ? 'text-red-400 border-red-500/20 bg-red-500/10'
                        : 'text-slate-400 border-slate-500/20 bg-slate-500/10'
                    )}
                  >
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {Math.abs(metric.change)}%
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {metric.value}
                </div>
                <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {metric.label}
                </div>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={cn("absolute inset-0 rounded-lg blur-xl", metric.bgColor, "opacity-20")} />
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// Default metrics for demo
export const defaultMetrics: MetricData[] = [
  {
    label: "Total Scans",
    value: "1,247",
    change: 12.5,
    trend: 'up',
    icon: Zap,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border-cyan-500/20"
  },
  {
    label: "High Risk Alerts",
    value: "43",
    change: -8.2,
    trend: 'down',
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20"
  },
  {
    label: "Suspicious Messages",
    value: "156",
    change: 23.4,
    trend: 'up',
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20"
  },
  {
    label: "Safe Messages",
    value: "1,048",
    change: 15.7,
    trend: 'up',
    icon: Shield,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20"
  }
]