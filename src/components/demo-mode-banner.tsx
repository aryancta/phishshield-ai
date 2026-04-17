"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    setIsDemoMode(demoMode)
    
    // Show banner only in demo mode and if not previously dismissed
    if (demoMode) {
      const dismissed = localStorage.getItem('demo-banner-dismissed')
      if (!dismissed) {
        setIsVisible(true)
      }
    }
  }, [])

  const dismissBanner = () => {
    setIsVisible(false)
    localStorage.setItem('demo-banner-dismissed', 'true')
  }

  if (!isVisible || !isDemoMode) {
    return null
  }

  return (
    <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-400 rounded-none border-x-0 border-t-0">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Demo Mode:</strong> This is a demonstration of PhishShield AI. 
          All analysis results are generated locally for security.
        </span>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={dismissBanner}
          className="h-6 w-6 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}