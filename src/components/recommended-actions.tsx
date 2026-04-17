"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertTriangle, Shield, Phone, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VerdictType } from "@/types"
import { cn } from "@/lib/utils"

interface RecommendedActionsProps {
  actions: string[]
  verdict: VerdictType
  onCreateReport?: () => void
  className?: string
}

const verdictConfig = {
  safe: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    title: 'Safe to Proceed',
    subtitle: 'This message appears legitimate'
  },
  suspicious: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    title: 'Exercise Caution',
    subtitle: 'Some suspicious patterns detected'
  },
  high_risk: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    title: 'High Risk Detected',
    subtitle: 'Strong indicators of phishing/scam'
  }
}

const additionalActions = {
  safe: [
    'Continue with normal security practices',
    'Still verify sender if unsure'
  ],
  suspicious: [
    'Double-check sender authenticity',
    'Look for spelling/grammar errors',
    'Verify through official channels before acting'
  ],
  high_risk: [
    'Report to cyber crime authorities',
    'Block the sender immediately',
    'Warn others about this scam',
    'Contact your bank if financial info was shared'
  ]
}

export function RecommendedActions({ 
  actions, 
  verdict, 
  onCreateReport,
  className 
}: RecommendedActionsProps) {
  const config = verdictConfig[verdict]
  const Icon = config.icon
  const extraActions = additionalActions[verdict]

  return (
    <Card className={cn("cyber-border", className)}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={cn(
            "p-3 rounded-lg border",
            config.bgColor,
            config.borderColor
          )}>
            <Icon className={cn("w-6 h-6", config.color)} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{config.title}</h3>
            <p className="text-sm text-slate-400">{config.subtitle}</p>
          </div>
        </div>

        {/* Primary actions */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Immediate Actions
          </h4>
          {actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                verdict === 'high_risk' ? 'bg-red-500/20 text-red-400' :
                verdict === 'suspicious' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              )}>
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
              <span className="text-slate-200 leading-relaxed">{action}</span>
            </motion.div>
          ))}
        </div>

        {/* Additional recommendations */}
        {extraActions.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Additional Recommendations
            </h4>
            {extraActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (actions.length + index) * 0.1, duration: 0.4 }}
                className="flex items-start space-x-3 text-sm text-slate-300"
              >
                <div className="w-2 h-2 bg-slate-500 rounded-full flex-shrink-0 mt-2" />
                <span>{action}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
          {onCreateReport && (
            <Button
              onClick={onCreateReport}
              variant="outline"
              className="flex items-center space-x-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </Button>
          )}
          
          {verdict === 'high_risk' && (
            <Button
              variant="outline"
              className="flex items-center space-x-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={() => {
                window.open('https://cybercrime.gov.in/webform/crime_against_women.htm', '_blank')
              }}
            >
              <Phone className="w-4 h-4" />
              <span>Report to Authorities</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            onClick={() => {
              navigator.share?.({
                title: 'PhishShield Analysis Result',
                text: `I used PhishShield AI to analyze a suspicious message. Result: ${verdict.replace('_', ' ')} risk level.`,
                url: window.location.href
              }) || navigator.clipboard?.writeText(window.location.href)
            }}
          >
            <Shield className="w-4 h-4" />
            <span>Share Analysis</span>
          </Button>
        </div>

        {/* Safety reminder */}
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Remember:</strong>{' '}
            {verdict === 'high_risk' 
              ? 'Never provide personal information, passwords, or make payments based on suspicious messages. When in doubt, contact the organization directly through official channels.'
              : verdict === 'suspicious'
              ? 'Trust your instincts. If something feels off, verify through official channels before taking any action.'
              : 'Even legitimate messages should be handled with appropriate security awareness. Stay vigilant online.'}
          </p>
        </div>
      </div>
    </Card>
  )
}