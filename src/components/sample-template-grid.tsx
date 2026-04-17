"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" 
import { Button } from "@/components/ui/button"
import { Smartphone, Mail, MessageSquare, CreditCard, Briefcase, Building, Play } from "lucide-react"
import { SampleTemplate } from "@/types"
import { truncateText } from "@/lib/utils"

interface SampleTemplateGridProps {
  samples: SampleTemplate[]
  onLoadSample: (sample: SampleTemplate) => void
  className?: string
}

const categoryIcons = {
  'UPI fraud': CreditCard,
  'delivery scam': Smartphone,
  'job scam': Briefcase, 
  'bank alert': Building,
  'impersonation': MessageSquare,
  'investment scam': CreditCard,
}

const categoryColors = {
  'UPI fraud': 'bg-red-500/10 text-red-400 border-red-500/20',
  'delivery scam': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'job scam': 'bg-green-500/10 text-green-400 border-green-500/20',
  'bank alert': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'impersonation': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'investment scam': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

const sourceTypeIcons = {
  sms: Smartphone,
  whatsapp: MessageSquare,
  email: Mail,
  mixed: MessageSquare,
}

export function SampleTemplateGrid({ 
  samples, 
  onLoadSample, 
  className 
}: SampleTemplateGridProps) {
  if (samples.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">No Samples Available</h3>
        <p className="text-slate-500">Sample templates will appear here when loaded.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {samples.map((sample, index) => {
        const CategoryIcon = categoryIcons[sample.category as keyof typeof categoryIcons] || MessageSquare
        const SourceIcon = sourceTypeIcons[sample.sourceType as keyof typeof sourceTypeIcons] || MessageSquare
        const categoryColorClass = categoryColors[sample.category as keyof typeof categoryColors] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'

        return (
          <motion.div
            key={sample.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="h-full cyber-border hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border ${categoryColorClass}`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {sample.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={categoryColorClass}>
                          {sample.category}
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                          <SourceIcon className="w-3 h-3 mr-1" />
                          {sample.sourceType.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview content */}
                <div className="flex-1 mb-4">
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 mb-3">
                    <p className="text-sm text-slate-300 leading-relaxed font-mono">
                      {truncateText(sample.preview, 120)}
                    </p>
                  </div>
                  
                  {/* Risk hint */}
                  <div className="flex items-start space-x-2 text-xs">
                    <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span className="text-slate-400 italic">
                      <strong className="text-amber-400">Why suspicious:</strong> {sample.riskHint}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <Button
                  onClick={() => onLoadSample(sample)}
                  className="w-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Load & Analyze
                </Button>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}