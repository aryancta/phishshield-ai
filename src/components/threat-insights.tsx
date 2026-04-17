"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  CreditCard, 
  Smartphone,
  Mail,
  Building,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ThreatCategory {
  name: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'neutral'
  trendValue: number
  icon: typeof AlertTriangle
  color: string
  description: string
}

const threatCategories: ThreatCategory[] = [
  {
    name: 'UPI Fraud',
    count: 89,
    percentage: 35,
    trend: 'up',
    trendValue: 23,
    icon: CreditCard,
    color: 'text-red-400',
    description: 'Fake payment requests and KYC scams'
  },
  {
    name: 'Delivery Scams',
    count: 67,
    percentage: 26,
    trend: 'up',
    trendValue: 15,
    icon: Smartphone,
    color: 'text-orange-400',
    description: 'Fake delivery alerts and redelivery fees'
  },
  {
    name: 'Job Scams',
    count: 45,
    percentage: 18,
    trend: 'down',
    trendValue: 8,
    icon: Briefcase,
    color: 'text-amber-400',
    description: 'Fake job offers with upfront payments'
  },
  {
    name: 'Bank Alerts',
    count: 34,
    percentage: 13,
    trend: 'neutral',
    trendValue: 2,
    icon: Building,
    color: 'text-blue-400',
    description: 'Fake account freeze and security alerts'
  },
  {
    name: 'Impersonation',
    count: 21,
    percentage: 8,
    trend: 'down',
    trendValue: 12,
    icon: Shield,
    color: 'text-purple-400',
    description: 'Tech support and authority impersonation'
  }
]

const topThreats = [
  {
    title: 'PhonePe KYC Urgent',
    impact: 'High',
    victims: '450+',
    description: 'Fake PhonePe KYC verification messages with malicious links'
  },
  {
    title: 'Amazon Delivery Failed',
    impact: 'Medium', 
    victims: '280+',
    description: 'Fake delivery failure messages demanding redelivery fees'
  },
  {
    title: 'SBI Account Freeze',
    impact: 'High',
    victims: '190+',
    description: 'Fake State Bank security alerts threatening account closure'
  }
]

interface ThreatInsightsProps {
  className?: string
}

export function ThreatInsights({ className }: ThreatInsightsProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Threat Categories */}
      <Card className="p-6 cyber-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Threat Categories</h3>
            <p className="text-sm text-slate-400">Most common scam types detected</p>
          </div>
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
        </div>

        <div className="space-y-5">
          {threatCategories.map((category, index) => {
            const Icon = category.icon
            const isIncreasing = category.trend === 'up'
            const isDecreasing = category.trend === 'down'
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={cn("w-4 h-4", category.color)} />
                    <div>
                      <div className="font-medium text-white text-sm">
                        {category.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {category.description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-300 font-medium">
                      {category.count}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        isIncreasing 
                          ? 'text-red-400 border-red-500/20 bg-red-500/10'
                          : isDecreasing
                          ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                          : 'text-slate-400 border-slate-500/20 bg-slate-500/10'
                      )}
                    >
                      {isIncreasing ? '+' : isDecreasing ? '-' : '±'}
                      {category.trendValue}%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={category.percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{category.percentage}% of total threats</span>
                    <span>
                      {category.trend === 'up' ? 'Increasing' : 
                       category.trend === 'down' ? 'Decreasing' : 'Stable'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1">Weekly Summary:</div>
          <div className="text-sm text-slate-300">
            UPI fraud attempts increased by 23% this week, primarily targeting 
            PhonePe and GPay users with fake KYC verification messages.
          </div>
        </div>
      </Card>

      {/* Top Active Threats */}
      <Card className="p-6 cyber-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Active Threats</h3>
            <p className="text-sm text-slate-400">Currently circulating scam campaigns</p>
          </div>
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            3 Active
          </Badge>
        </div>

        <div className="space-y-4">
          {topThreats.map((threat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white text-sm">
                  {threat.title}
                </h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    threat.impact === 'High'
                      ? 'text-red-400 border-red-500/20'
                      : 'text-amber-400 border-amber-500/20'
                  )}
                >
                  {threat.impact} Impact
                </Badge>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {threat.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <span className="text-slate-500">Victims:</span>
                  <span className="text-red-400 font-medium">{threat.victims}</span>
                </div>
                <div className="text-slate-500">Last 7 days</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-300">
              <div className="font-medium mb-1">Security Advisory:</div>
              <div>
                Multiple UPI-related phishing campaigns are active. Users should 
                verify any KYC requests through official app channels only.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}