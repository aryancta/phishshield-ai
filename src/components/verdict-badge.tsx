"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, XCircle } from "lucide-react"
import { VerdictType } from "@/types"
import { cn } from "@/lib/utils"

interface VerdictBadgeProps {
  verdict: VerdictType
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export function VerdictBadge({ 
  verdict, 
  size = 'md', 
  showIcon = true, 
  className 
}: VerdictBadgeProps) {
  const config = {
    safe: {
      label: 'Safe',
      icon: Shield,
      className: 'verdict-safe'
    },
    suspicious: {
      label: 'Suspicious',
      icon: AlertTriangle,
      className: 'verdict-suspicious'
    },
    high_risk: {
      label: 'High Risk',
      icon: XCircle,
      className: 'verdict-high-risk'
    }
  }
  
  const verdictConfig = config[verdict]
  const Icon = verdictConfig.icon
  
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-semibold border",
        verdictConfig.className,
        sizes[size],
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(
          "mr-1.5",
          size === 'sm' ? 'w-3 h-3' : 
          size === 'md' ? 'w-4 h-4' : 
          'w-5 h-5'
        )} />
      )}
      {verdictConfig.label}
    </Badge>
  )
}