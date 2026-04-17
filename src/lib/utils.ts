import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { VerdictType } from "@/types"
import { VERDICT_THRESHOLDS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateVerdict(riskScore: number): VerdictType {
  if (riskScore <= VERDICT_THRESHOLDS.SAFE) return 'safe'
  if (riskScore <= VERDICT_THRESHOLDS.SUSPICIOUS) return 'suspicious'
  return 'high_risk'
}

export function getVerdictColor(verdict: VerdictType): string {
  switch (verdict) {
    case 'safe': return 'emerald'
    case 'suspicious': return 'amber'
    case 'high_risk': return 'red'
    default: return 'slate'
  }
}

export function getRiskColor(score: number): string {
  if (score <= 30) return 'emerald'
  if (score <= 70) return 'amber'
  return 'red'
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*)/g
  return text.match(urlRegex) || []
}

export function normalizeScore(score: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, Math.round(score)))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export function isValidIndianPhone(phone: string): boolean {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

export function maskSensitiveData(text: string): string {
  return text
    .replace(/\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g, 'XXXX XXXX XXXX XXXX') // Credit card
    .replace(/\d{10,12}/g, 'XXXXXXXXXX') // Phone numbers
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***@***.***') // Emails
}

export function parseJsonSafely<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}