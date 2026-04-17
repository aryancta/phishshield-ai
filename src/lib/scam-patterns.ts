// India-specific scam patterns and detection rules

export const URGENCY_KEYWORDS = [
  // English urgency terms
  'urgent', 'immediately', 'asap', 'expire', 'expiry', 'expires',
  'suspend', 'suspended', 'block', 'blocked', 'freeze', 'frozen',
  'deadline', 'limited time', 'act now', 'hurry', 'quick', 'fast',
  'within 24 hours', 'within 2 hours', 'today only', 'last chance',
  
  // Hindi/Indian context urgency
  'turant', 'jaldi', 'abhi', 'foran', 'bandh', 'ruko'
]

export const IMPERSONATION_KEYWORDS = [
  // Banks
  'state bank', 'sbi', 'hdfc', 'icici', 'axis bank', 'pnb', 'bank of india',
  'yes bank', 'kotak', 'indusind', 'canara bank', 'union bank',
  
  // Government
  'government of india', 'income tax', 'gst', 'aadhaar', 'pan card',
  'passport office', 'rto', 'municipality', 'collector office',
  
  // Companies
  'amazon', 'flipkart', 'paytm', 'phonepe', 'google pay', 'bharatpe',
  'jio', 'airtel', 'vi', 'bsnl', 'reliance', 'tata', 'microsoft',
  
  // Services
  'customer care', 'support team', 'technical support', 'help desk',
  'security team', 'fraud prevention'
]

export const PAYMENT_KEYWORDS = [
  // Payment terms
  'pay now', 'payment', 'amount', 'rupees', 'rs.', '₹', 'upi',
  'bank transfer', 'netbanking', 'credit card', 'debit card',
  'wallet', 'recharge', 'bill', 'fine', 'penalty', 'fee',
  
  // UPI specific
  'upi id', 'scan qr', 'qr code', 'gpay', 'paytm', 'phonepe',
  'bhim', 'send money', 'request money', 'collect payment',
  
  // Scam payment tactics
  'registration fee', 'processing fee', 'delivery charges',
  'security deposit', 'verification fee', 'activation fee'
]

export const SUSPICIOUS_PHRASES = [
  // Too good to be true
  'congratulations', 'selected', 'winner', 'lottery', 'prize',
  'free', 'no cost', 'guaranteed', '100% sure', 'risk free',
  'double your money', 'instant money', 'work from home',
  
  // Fake offers
  'limited slots', 'exclusive offer', 'special discount',
  'cashback', 'reward points', 'bonus', 'gift voucher',
  
  // Threats
  'legal action', 'arrest warrant', 'court notice', 'police',
  'cybercrime', 'investigation', 'case filed against you',
  
  // Verification scams
  'verify account', 'update details', 'confirm identity',
  'kyc update', 'document verification', 'aadhar verification'
]

export const SUSPICIOUS_DOMAINS = [
  // Common suspicious patterns
  '.co.in', '.net.in', '.org.in', '.tk', '.ml', '.ga', '.cf',
  'bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly',
  
  // Bank impersonation patterns
  'sbi-', 'hdfc-', 'icici-', 'axis-', 'bankof',
  'secure-banking', 'netbanking-', 'mobile-banking',
  
  // Company impersonation
  'amazon-', 'flipkart-', 'paytm-', 'jio-', 'airtel-',
  'government-', 'income-tax', 'pan-card', 'aadhaar-'
]

export const BRAND_VARIANTS = {
  'amazon': ['amaz0n', 'amazom', 'amazon-india', 'amazone'],
  'flipkart': ['flikart', 'flipkart-india', 'flipcart'],
  'sbi': ['state-bank', 'sbi-bank', 'statebankof'],
  'hdfc': ['hdfc-bank', 'hdfcbank'],
  'paytm': ['paytm-wallet', 'paytm-payments'],
  'google': ['g00gle', 'googIe', 'google-pay'],
  'microsoft': ['micr0soft', 'micrоsoft', 'microsft']
}

export const PHONE_PATTERNS = [
  // Common scam phone patterns
  /^\+?91[6-9]\d{9}$/, // Valid Indian mobile
  /^1800\d{6,7}$/, // Toll-free but suspicious context
  /^0\d{10,11}$/, // Landline impersonation
  /^\d{10}$/ // 10-digit numbers
]

export const FINANCIAL_INDICATORS = [
  // Financial terms that indicate money requests
  'account number', 'ifsc code', 'cvv', 'pin', 'otp', 'password',
  'card details', 'expiry date', 'card number', 'sort code',
  'routing number', 'account balance', 'transaction id', 'reference number'
]

export const RED_FLAG_COMBINATIONS = [
  // Dangerous combinations that increase risk significantly
  ['urgent', 'suspend', 'verify'],
  ['congratulations', 'selected', 'pay'],
  ['government', 'fine', 'pay now'],
  ['amazon', 'delivery', 'failed', 'pay'],
  ['bank', 'frozen', 'verify', 'immediately'],
  ['job', 'selected', 'registration fee'],
  ['lottery', 'winner', 'claim fee'],
  ['microsoft', 'virus', 'call now']
]

export function calculateUrgencyScore(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 0
  
  for (const keyword of URGENCY_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += keyword.length > 10 ? 15 : 10 // Longer phrases are more suspicious
    }
  }
  
  // Check for time pressure patterns
  if (lowerText.match(/\d+\s?(hour|minute|day)s?/)) score += 20
  if (lowerText.includes('expire') || lowerText.includes('deadline')) score += 25
  
  return Math.min(score, 100)
}

export function calculateImpersonationScore(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 0
  
  for (const keyword of IMPERSONATION_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += 20
    }
  }
  
  // Check for official-sounding language
  if (lowerText.includes('customer care') || lowerText.includes('security team')) score += 15
  if (lowerText.match(/case\s*(id|number)/)) score += 10
  
  return Math.min(score, 100)
}

export function calculatePaymentScore(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 0
  
  for (const keyword of PAYMENT_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += 15
    }
  }
  
  // Higher score for specific payment requests
  if (lowerText.match(/₹\s*\d+|rs\.?\s*\d+/)) score += 25
  if (lowerText.includes('pay immediately') || lowerText.includes('pay now')) score += 30
  
  return Math.min(score, 100)
}

export function checkRedFlagCombinations(text: string): string[] {
  const lowerText = text.toLowerCase()
  const foundCombinations: string[] = []
  
  for (const combination of RED_FLAG_COMBINATIONS) {
    if (combination.every(keyword => lowerText.includes(keyword.toLowerCase()))) {
      foundCombinations.push(combination.join(' + '))
    }
  }
  
  return foundCombinations
}

export function extractSuspiciousPatterns(text: string) {
  const patterns = {
    urgentLanguage: [] as string[],
    impersonation: [] as string[],
    paymentRequests: [] as string[],
    suspiciousPhrases: [] as string[],
    redFlags: [] as string[]
  }
  
  const lowerText = text.toLowerCase()
  
  // Extract urgent language
  for (const keyword of URGENCY_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      patterns.urgentLanguage.push(keyword)
    }
  }
  
  // Extract impersonation attempts
  for (const keyword of IMPERSONATION_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      patterns.impersonation.push(keyword)
    }
  }
  
  // Extract payment requests
  for (const keyword of PAYMENT_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      patterns.paymentRequests.push(keyword)
    }
  }
  
  // Extract suspicious phrases
  for (const phrase of SUSPICIOUS_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      patterns.suspiciousPhrases.push(phrase)
    }
  }
  
  // Check red flag combinations
  patterns.redFlags = checkRedFlagCombinations(text)
  
  return patterns
}