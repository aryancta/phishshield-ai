import { 
  AnalysisRequest, 
  AnalysisResult, 
  AnalysisReason, 
  AnalysisSignals,
  DetectedUrl
} from "@/types"
import { 
  calculateUrgencyScore, 
  calculateImpersonationScore, 
  calculatePaymentScore,
  extractSuspiciousPatterns,
  checkRedFlagCombinations
} from "./scam-patterns"
import { analyzeUrlsInText, calculateUrlRiskScore } from "./url-analysis"
import { calculateVerdict, generateId } from "./utils"
import { SIGNAL_WEIGHTS, RECOMMENDED_ACTIONS } from "./constants"

export class PhishShieldAnalysisEngine {
  async analyzeMessage(request: AnalysisRequest): Promise<AnalysisResult> {
    const { text, sourceType } = request
    
    // Extract suspicious patterns
    const patterns = extractSuspiciousPatterns(text)
    
    // Calculate individual signal scores
    const urgencyScore = calculateUrgencyScore(text)
    const impersonationScore = calculateImpersonationScore(text)
    const paymentScore = calculatePaymentScore(text)
    
    // Analyze URLs in the text
    const detectedUrls = analyzeUrlsInText(text)
    const urlRiskScore = calculateUrlRiskScore(detectedUrls)
    
    // Calculate brand mismatch score
    const brandMismatchScore = this.calculateBrandMismatchScore(text, detectedUrls)
    
    // Combine signals with weights
    const signals: AnalysisSignals = {
      urgency: urgencyScore,
      impersonation: impersonationScore,
      paymentRequest: paymentScore,
      urlRisk: urlRiskScore,
      brandMismatch: brandMismatchScore
    }
    
    // Calculate overall risk score
    const riskScore = this.calculateOverallRiskScore(signals)
    
    // Determine verdict
    const verdict = calculateVerdict(riskScore)
    
    // Generate reasons
    const reasons = this.generateReasons(patterns, signals, detectedUrls, text)
    
    // Calculate confidence
    const confidence = this.calculateConfidence(signals, reasons.length)
    
    // Get recommended actions
    const recommendedActions = [...RECOMMENDED_ACTIONS[verdict]]
    
    // Generate summary
    const summary = this.generateSummary(verdict, riskScore, patterns, detectedUrls)
    
    return {
      analysisId: generateId(),
      verdict,
      riskScore,
      confidence,
      summary,
      reasons,
      signals,
      recommendedActions,
      detectedUrls,
      reportId: generateId()
    }
  }
  
  private calculateOverallRiskScore(signals: AnalysisSignals): number {
    const weightedScore = 
      signals.urgency * SIGNAL_WEIGHTS.urgency +
      signals.impersonation * SIGNAL_WEIGHTS.impersonation +
      signals.paymentRequest * SIGNAL_WEIGHTS.paymentRequest +
      signals.urlRisk * SIGNAL_WEIGHTS.urlRisk +
      signals.brandMismatch * SIGNAL_WEIGHTS.brandMismatch
    
    return Math.min(100, Math.round(weightedScore))
  }
  
  private calculateBrandMismatchScore(text: string, detectedUrls: DetectedUrl[]): number {
    // Check if URLs have brand mismatches
    const hasBrandMismatch = detectedUrls.some(url => 
      url.notes.some(note => note.toLowerCase().includes('impersonates'))
    )
    
    if (hasBrandMismatch) return 60
    
    // Check for display text vs actual URL mismatches
    const urlRegex = /https?:\/\/[^\s]+/g
    const textUrls = text.match(urlRegex) || []
    
    for (const url of textUrls) {
      // Simple check for display text that doesn't match URL
      const displayTextRegex = new RegExp(`[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`, 'g')
      const displayTexts = text.match(displayTextRegex) || []
      
      for (const displayText of displayTexts) {
        if (!url.includes(displayText) && displayText !== url) {
          return 40 // Potential display text mismatch
        }
      }
    }
    
    return 0
  }
  
  private generateReasons(
    patterns: any, 
    signals: AnalysisSignals, 
    detectedUrls: DetectedUrl[],
    text: string
  ): AnalysisReason[] {
    const reasons: AnalysisReason[] = []
    
    // Urgency-related reasons
    if (signals.urgency > 30) {
      const urgentWords = patterns.urgentLanguage.slice(0, 3).join(', ')
      reasons.push({
        category: 'urgency',
        title: 'Urgent Language Detected',
        detail: `Message uses high-pressure tactics to create urgency and prompt immediate action.`,
        severity: signals.urgency > 60 ? 'high' : 'medium',
        evidence: urgentWords ? `Found words: ${urgentWords}` : 'Urgent language patterns detected'
      })
    }
    
    // Impersonation-related reasons
    if (signals.impersonation > 20) {
      const impersonationWords = patterns.impersonation.slice(0, 3).join(', ')
      reasons.push({
        category: 'impersonation',
        title: 'Brand/Authority Impersonation',
        detail: `Message appears to impersonate legitimate organizations to gain trust.`,
        severity: signals.impersonation > 50 ? 'high' : 'medium',
        evidence: impersonationWords ? `Mentions: ${impersonationWords}` : 'Impersonation patterns detected'
      })
    }
    
    // Payment-related reasons
    if (signals.paymentRequest > 20) {
      const paymentWords = patterns.paymentRequests.slice(0, 3).join(', ')
      reasons.push({
        category: 'payment',
        title: 'Payment Request Detected',
        detail: `Message requests money or financial information, which is a common scam tactic.`,
        severity: signals.paymentRequest > 50 ? 'high' : 'medium',
        evidence: paymentWords ? `Payment terms: ${paymentWords}` : 'Payment request detected'
      })
    }
    
    // URL-related reasons
    if (signals.urlRisk > 20) {
      const suspiciousUrls = detectedUrls.filter(url => url.risk !== 'safe')
      if (suspiciousUrls.length > 0) {
        reasons.push({
          category: 'url',
          title: 'Suspicious Links Found',
          detail: `Message contains ${suspiciousUrls.length} suspicious link(s) that may lead to malicious websites.`,
          severity: signals.urlRisk > 60 ? 'high' : 'medium',
          evidence: `Suspicious domains: ${suspiciousUrls.map(u => u.domain).join(', ')}`
        })
      }
    }
    
    // Brand mismatch reasons
    if (signals.brandMismatch > 20) {
      reasons.push({
        category: 'brand_mismatch',
        title: 'Brand Mismatch Detected',
        detail: `The sender claims to represent a brand but uses unofficial or suspicious domains.`,
        severity: 'medium',
        evidence: 'Link text doesn\'t match actual destination'
      })
    }
    
    // Red flag combinations
    const redFlags = checkRedFlagCombinations(text)
    if (redFlags.length > 0) {
      reasons.push({
        category: 'urgency',
        title: 'Multiple Threat Indicators',
        detail: `Message combines multiple scam tactics, significantly increasing its threat level.`,
        severity: 'high',
        evidence: `Dangerous combinations: ${redFlags.join(', ')}`
      })
    }
    
    // If no specific reasons but score is high, add generic reason
    if (reasons.length === 0 && signals.urgency + signals.impersonation + signals.paymentRequest > 40) {
      reasons.push({
        category: 'urgency',
        title: 'Suspicious Content Detected',
        detail: 'Message contains patterns commonly found in phishing and scam attempts.',
        severity: 'medium',
        evidence: 'Multiple suspicious indicators found'
      })
    }
    
    // Add positive reason for safe messages
    if (reasons.length === 0) {
      reasons.push({
        category: 'urgency',
        title: 'No Immediate Threats Detected',
        detail: 'Message appears to follow normal communication patterns.',
        severity: 'low',
        evidence: 'No suspicious patterns identified'
      })
    }
    
    return reasons
  }
  
  private calculateConfidence(signals: AnalysisSignals, reasonCount: number): number {
    let confidence = 0.5 // Base confidence
    
    // Higher confidence with more signals
    const signalStrength = Object.values(signals).reduce((sum, val) => sum + val, 0) / 500
    confidence += signalStrength * 0.3
    
    // Higher confidence with more reasons
    confidence += Math.min(reasonCount * 0.1, 0.3)
    
    // Adjust based on signal consistency
    const signalVariance = this.calculateSignalVariance(signals)
    confidence -= signalVariance * 0.1
    
    return Math.max(0.1, Math.min(1.0, confidence))
  }
  
  private calculateSignalVariance(signals: AnalysisSignals): number {
    const values = Object.values(signals)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    return variance / 10000 // Normalize to 0-1 range
  }
  
  private generateSummary(
    verdict: string, 
    riskScore: number, 
    patterns: any, 
    detectedUrls: DetectedUrl[]
  ): string {
    const suspiciousUrls = detectedUrls.filter(url => url.risk !== 'safe').length
    
    switch (verdict) {
      case 'safe':
        return `This message appears legitimate with a low risk score of ${riskScore}%. No immediate threats detected.`
      
      case 'suspicious':
        return `This message shows suspicious patterns with a ${riskScore}% risk score. ${
          suspiciousUrls > 0 ? `Contains ${suspiciousUrls} potentially unsafe link(s). ` : ''
        }Exercise caution before taking any action.`
      
      case 'high_risk':
        return `This message is highly suspicious with a ${riskScore}% risk score. ${
          suspiciousUrls > 0 ? `Contains ${suspiciousUrls} dangerous link(s). ` : ''
        }Strong indicators of phishing or scam attempt detected.`
      
      default:
        return `Analysis completed with ${riskScore}% risk score.`
    }
  }
}

// Singleton instance
export const analysisEngine = new PhishShieldAnalysisEngine()