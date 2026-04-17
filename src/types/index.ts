export interface AnalysisRequest {
  text: string
  sourceType: 'message' | 'sms' | 'whatsapp' | 'email' | 'screenshot'
  languageHint?: string
  includeUrlScan?: boolean
}

export interface UrlScanRequest {
  url: string
}

export interface AnalysisReason {
  category: string
  title: string
  detail: string
  severity: 'low' | 'medium' | 'high'
  evidence: string
}

export interface DetectedUrl {
  url: string
  domain: string
  risk: 'safe' | 'suspicious' | 'high_risk'
  notes: string[]
}

export interface AnalysisSignals {
  urgency: number
  impersonation: number
  paymentRequest: number
  urlRisk: number
  brandMismatch: number
}

export interface AnalysisResult {
  analysisId: string
  verdict: 'safe' | 'suspicious' | 'high_risk'
  riskScore: number
  confidence: number
  summary: string
  reasons: AnalysisReason[]
  signals: AnalysisSignals
  recommendedActions: string[]
  detectedUrls: DetectedUrl[]
  reportId: string
}

export interface UrlScanResult {
  url: string
  domain: string
  riskScore: number
  verdict: 'safe' | 'suspicious' | 'high_risk'
  reasons: string[]
  resolvedUrl?: string
  brandMismatch: boolean
}

export interface SavedAnalysis {
  id: string
  createdAt: string
  verdict: string
  riskScore: number
  sourceType: string
  summary: string
  reportId: string
}

export interface SampleTemplate {
  id: string
  category: string
  title: string
  preview: string
  fullText: string
  sourceType: string
  riskHint: string
}

export interface Report {
  reportId: string
  createdAt: string
  messageText: string
  sourceType: string
  verdict: string
  riskScore: number
  confidence: number
  summary: string
  reasons: AnalysisReason[]
  recommendedActions: string[]
  detectedUrls: DetectedUrl[]
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  demoMode: boolean
  showAdvancedSignals: boolean
}

export interface AppState {
  currentAnalysis: AnalysisResult | null
  isAnalyzing: boolean
  demoMode: boolean
  preferences: UserPreferences
}

export type VerdictType = 'safe' | 'suspicious' | 'high_risk'
export type SourceType = 'message' | 'sms' | 'whatsapp' | 'email' | 'screenshot' | 'url'
export type ScamCategory = 'UPI fraud' | 'delivery scam' | 'job scam' | 'bank alert' | 'impersonation' | 'investment scam'