"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Shield, CreditCard, Link as LinkIcon, Eye, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AnalysisReason } from "@/types"
import { cn } from "@/lib/utils"

interface ExplainabilityPanelProps {
  reasons: AnalysisReason[]
  className?: string
}

const categoryIcons = {
  urgency: AlertTriangle,
  impersonation: Shield,
  payment: CreditCard,
  url: LinkIcon,
  brand_mismatch: Eye,
}

const categoryLabels = {
  urgency: 'Urgency Tactics',
  impersonation: 'Impersonation',
  payment: 'Payment Request',
  url: 'Suspicious Links',
  brand_mismatch: 'Brand Mismatch',
}

const severityColors = {
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export function ExplainabilityPanel({ reasons, className }: ExplainabilityPanelProps) {
  if (reasons.length === 0) {
    return (
      <Card className={cn("p-6 cyber-border", className)}>
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Threats Detected</h3>
          <p className="text-slate-400">
            This message appears to follow normal communication patterns.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("cyber-border", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Threat Analysis</h3>
          <Badge variant="outline" className="text-slate-300">
            {reasons.length} indicator{reasons.length !== 1 ? 's' : ''} found
          </Badge>
        </div>

        <div className="space-y-4">
          {reasons.map((reason, index) => {
            const Icon = categoryIcons[reason.category as keyof typeof categoryIcons] || AlertTriangle
            const categoryLabel = categoryLabels[reason.category as keyof typeof categoryLabels] || reason.category
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`reason-${index}`} className="border-slate-700">
                    <AccordionTrigger className="hover:no-underline group">
                      <div className="flex items-center space-x-4 text-left">
                        <div className={cn(
                          "p-2 rounded-lg border",
                          severityColors[reason.severity as keyof typeof severityColors]
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                              {reason.title}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                severityColors[reason.severity as keyof typeof severityColors]
                              )}
                            >
                              {reason.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-400">
                            {categoryLabel}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-90 transition-transform" />
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="pt-4 pb-2">
                      <div className="ml-12 space-y-3">
                        <p className="text-slate-300 leading-relaxed">
                          {reason.detail}
                        </p>
                        
                        {reason.evidence && (
                          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                            <div className="text-xs font-medium text-slate-400 mb-1">
                              Evidence Found:
                            </div>
                            <code className="text-sm text-cyan-300 font-mono">
                              {reason.evidence}
                            </code>
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                          <strong>Why this matters:</strong> This pattern is commonly used in 
                          {reason.severity === 'high' ? ' sophisticated' : 
                           reason.severity === 'medium' ? ' typical' : ' basic'} scam attempts 
                          to {reason.category === 'urgency' ? 'pressure victims into quick decisions' :
                               reason.category === 'impersonation' ? 'appear legitimate and trustworthy' :
                               reason.category === 'payment' ? 'extract money or financial information' :
                               reason.category === 'url' ? 'redirect to malicious websites' :
                               'mislead and deceive recipients'}.
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            )
          })}
        </div>

        {/* Summary note */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="text-sm text-slate-300">
            <strong className="text-white">Analysis Summary:</strong>{' '}
            {reasons.filter(r => r.severity === 'high').length > 0 
              ? 'Multiple high-risk indicators detected. This appears to be a sophisticated scam attempt.'
              : reasons.filter(r => r.severity === 'medium').length > 1
              ? 'Several suspicious patterns found. Exercise caution and verify through official channels.'
              : 'Some concerning elements detected. While not definitively malicious, proceed with caution.'}
          </div>
        </div>
      </div>
    </Card>
  )
}