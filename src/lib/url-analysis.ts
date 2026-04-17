import { DetectedUrl, UrlScanResult } from "@/types"
import { SUSPICIOUS_DOMAINS, BRAND_VARIANTS } from "./scam-patterns"
import { extractDomain, validateUrl } from "./utils"

export interface UrlAnalysisResult {
  originalUrl: string
  domain: string
  risk: 'safe' | 'suspicious' | 'high_risk'
  riskScore: number
  reasons: string[]
  resolvedUrl?: string
  brandMismatch: boolean
  domainAge?: string
  isShortened: boolean
  redirects: string[]
}

const SHORTENER_DOMAINS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly',
  'short.link', 'tiny.cc', 'is.gd', 'v.gd', 'rb.gy'
]

const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.co.in', '.net.in', '.org.in'
]

const LEGITIMATE_DOMAINS = [
  'amazon.in', 'flipkart.com', 'paytm.com', 'phonepe.com',
  'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
  'google.com', 'microsoft.com', 'gov.in', 'nic.in'
]

export function extractUrlsFromText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*)/g
  const matches = text.match(urlRegex) || []
  
  return matches.map(url => {
    if (!url.startsWith('http')) {
      return url.startsWith('www.') ? `https://${url}` : `https://${url}`
    }
    return url
  })
}

export function analyzeUrl(url: string): UrlAnalysisResult {
  if (!validateUrl(url)) {
    return {
      originalUrl: url,
      domain: url,
      risk: 'high_risk',
      riskScore: 100,
      reasons: ['Invalid URL format'],
      brandMismatch: false,
      isShortened: false,
      redirects: []
    }
  }

  const domain = extractDomain(url)
  let riskScore = 0
  const reasons: string[] = []
  let brandMismatch = false
  
  // Check if it's a URL shortener
  const isShortened = SHORTENER_DOMAINS.some(shortener => 
    domain.includes(shortener)
  )
  if (isShortened) {
    riskScore += 30
    reasons.push('Uses URL shortening service')
  }

  // Check suspicious TLDs
  const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(tld => 
    domain.endsWith(tld)
  )
  if (hasSuspiciousTLD) {
    riskScore += 25
    reasons.push('Uses suspicious domain extension')
  }

  // Check for domain impersonation
  const impersonationResult = checkBrandImpersonation(domain)
  if (impersonationResult.isImpersonation) {
    riskScore += 40
    brandMismatch = true
    reasons.push(`Impersonates ${impersonationResult.targetBrand}`)
  }

  // Check against suspicious domain patterns
  const suspiciousDomainResult = checkSuspiciousDomainPatterns(domain)
  if (suspiciousDomainResult.isSuspicious) {
    riskScore += suspiciousDomainResult.score
    reasons.push(...suspiciousDomainResult.reasons)
  }

  // Check if domain is in whitelist
  const isLegitimate = LEGITIMATE_DOMAINS.some(legitDomain =>
    domain === legitDomain || domain.endsWith(`.${legitDomain}`)
  )
  if (isLegitimate) {
    riskScore = Math.max(0, riskScore - 30)
    if (riskScore === 0) {
      reasons.length = 0
      reasons.push('Domain appears legitimate')
    }
  }

  // Additional suspicious patterns
  if (domain.includes('-') && (domain.includes('bank') || domain.includes('pay'))) {
    riskScore += 20
    reasons.push('Suspicious use of hyphens in financial domain')
  }

  if (domain.length > 30) {
    riskScore += 15
    reasons.push('Unusually long domain name')
  }

  // Check for multiple subdomains
  const subdomains = domain.split('.').length - 2
  if (subdomains > 2) {
    riskScore += 10
    reasons.push('Multiple suspicious subdomains')
  }

  const risk = calculateUrlRisk(riskScore)

  return {
    originalUrl: url,
    domain,
    risk,
    riskScore: Math.min(100, riskScore),
    reasons,
    brandMismatch,
    isShortened,
    redirects: [] // Would be populated by actual URL following
  }
}

function checkBrandImpersonation(domain: string): { isImpersonation: boolean; targetBrand?: string } {
  for (const [brand, variants] of Object.entries(BRAND_VARIANTS)) {
    // Check if domain contains brand variants but isn't the official domain
    for (const variant of variants) {
      if (domain.includes(variant) && !LEGITIMATE_DOMAINS.includes(domain)) {
        return { isImpersonation: true, targetBrand: brand }
      }
    }
    
    // Check for common impersonation patterns
    const brandPatterns = [
      `${brand}-`,
      `-${brand}`,
      `${brand}online`,
      `${brand}secure`,
      `${brand}official`,
      `my${brand}`,
      `${brand}app`
    ]
    
    for (const pattern of brandPatterns) {
      if (domain.includes(pattern) && !LEGITIMATE_DOMAINS.includes(domain)) {
        return { isImpersonation: true, targetBrand: brand }
      }
    }
  }
  
  return { isImpersonation: false }
}

function checkSuspiciousDomainPatterns(domain: string): { isSuspicious: boolean; score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  
  // Check against known suspicious patterns
  for (const pattern of SUSPICIOUS_DOMAINS) {
    if (domain.includes(pattern)) {
      score += 20
      reasons.push(`Contains suspicious pattern: ${pattern}`)
    }
  }
  
  // Check for homograph attacks (similar looking characters)
  if (containsHomographs(domain)) {
    score += 30
    reasons.push('Contains potentially confusing characters')
  }
  
  // Check for keyword stuffing
  const keywordCount = ['bank', 'pay', 'secure', 'official', 'india'].filter(keyword => 
    domain.includes(keyword)
  ).length
  if (keywordCount >= 2) {
    score += 15
    reasons.push('Suspicious keyword combinations in domain')
  }
  
  return {
    isSuspicious: score > 0,
    score,
    reasons
  }
}

function containsHomographs(domain: string): boolean {
  // Simple check for common homograph characters
  const homographs = ['0', 'о', 'а', 'е', 'р', 'с', 'х'] // Cyrillic lookalikes
  return homographs.some(char => domain.includes(char))
}

function calculateUrlRisk(score: number): 'safe' | 'suspicious' | 'high_risk' {
  if (score <= 20) return 'safe'
  if (score <= 60) return 'suspicious'
  return 'high_risk'
}

export function analyzeUrlsInText(text: string): DetectedUrl[] {
  const urls = extractUrlsFromText(text)
  
  return urls.map(url => {
    const analysis = analyzeUrl(url)
    return {
      url: analysis.originalUrl,
      domain: analysis.domain,
      risk: analysis.risk,
      notes: analysis.reasons
    }
  })
}

export async function scanUrl(url: string): Promise<UrlScanResult> {
  const analysis = analyzeUrl(url)
  
  return {
    url: analysis.originalUrl,
    domain: analysis.domain,
    riskScore: analysis.riskScore,
    verdict: analysis.risk,
    reasons: analysis.reasons,
    resolvedUrl: analysis.resolvedUrl,
    brandMismatch: analysis.brandMismatch
  }
}

export function calculateUrlRiskScore(detectedUrls: DetectedUrl[]): number {
  if (detectedUrls.length === 0) return 0
  
  const totalRisk = detectedUrls.reduce((sum, url) => {
    switch (url.risk) {
      case 'high_risk': return sum + 40
      case 'suspicious': return sum + 20
      case 'safe': return sum + 0
      default: return sum
    }
  }, 0)
  
  return Math.min(100, totalRisk)
}