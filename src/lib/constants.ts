export const VERDICT_THRESHOLDS = {
  SAFE: 30,
  SUSPICIOUS: 70,
} as const

export const RISK_LEVELS = {
  LOW: { min: 0, max: 30, color: 'emerald', label: 'Safe' },
  MEDIUM: { min: 31, max: 70, color: 'amber', label: 'Suspicious' },
  HIGH: { min: 71, max: 100, color: 'red', label: 'High Risk' }
} as const

export const SCAM_CATEGORIES = [
  'UPI fraud',
  'delivery scam', 
  'job scam',
  'bank alert',
  'impersonation',
  'investment scam'
] as const

export const SOURCE_TYPES = [
  'message',
  'sms', 
  'whatsapp',
  'email',
  'screenshot',
  'url'
] as const

export const SIGNAL_WEIGHTS = {
  urgency: 0.25,
  impersonation: 0.30,
  paymentRequest: 0.25,
  urlRisk: 0.15,
  brandMismatch: 0.05
} as const

export const UI_LABELS = {
  VERDICTS: {
    safe: 'Safe',
    suspicious: 'Suspicious', 
    high_risk: 'High Risk'
  },
  SEVERITIES: {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  },
  CATEGORIES: {
    urgency: 'Urgency Tactics',
    impersonation: 'Impersonation',
    payment: 'Payment Request',
    url: 'Suspicious Links',
    brand_mismatch: 'Brand Mismatch'
  }
} as const

export const RECOMMENDED_ACTIONS = {
  safe: [
    'Message appears to be legitimate',
    'Continue with normal caution',
    'Verify sender if unsure'
  ],
  suspicious: [
    'Do not click any links immediately',
    'Verify sender through official channels',
    'Check for spelling/grammar errors',
    'Be cautious with personal information'
  ],
  high_risk: [
    'DO NOT click any links',
    'DO NOT provide personal information',
    'DO NOT make any payments',
    'Block the sender immediately',
    'Report to relevant authorities',
    'Verify claims through official channels only'
  ]
} as const

export const DEMO_CONFIG = {
  ANALYSIS_DELAY: 2000,
  PROGRESS_STEPS: [
    'Scanning message content...',
    'Analyzing suspicious patterns...',
    'Checking URL reputation...',
    'Generating risk assessment...',
    'Preparing recommendations...'
  ]
} as const

export const APP_METADATA = {
  name: 'PhishShield AI',
  description: 'Paste a suspicious message, get a risk score, explanation, and safe next steps in seconds.',
  version: '1.0.0',
  author: 'Aryan Choudhary',
  email: 'aryancta@gmail.com'
} as const