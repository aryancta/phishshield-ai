import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleTemplates = [
  {
    category: 'UPI fraud',
    title: 'Fake UPI Payment Request',
    preview: 'Urgent: Complete KYC verification to avoid account suspension...',
    fullText: `🚨 URGENT ACTION REQUIRED 🚨

Dear Customer,

Your UPI account will be SUSPENDED in 24 hours due to incomplete KYC verification.

To avoid suspension, complete verification immediately:
👆 Click: https://upi-kyc-verify.co.in/update

Failure to verify will result in:
❌ Account blocking
❌ Fund freezing  
❌ Service termination

Complete now to avoid inconvenience.

- State Bank of India
Customer Care: 9876543210`,
    sourceType: 'sms',
    riskHint: 'Fake urgency, suspicious domain, impersonation'
  },
  {
    category: 'delivery scam',
    title: 'Fake Delivery Alert',
    preview: 'Package delivery failed. Pay ₹50 redelivery fee to receive...',
    fullText: `📦 DELIVERY UPDATE

Package delivery attempt failed at your address.

Package ID: DEL2024789456
Sender: Amazon India
Value: ₹2,499

To schedule redelivery, pay ₹50 processing fee:
💳 Pay now: https://delivery-update.net/pay

Package will be returned to sender if payment not received within 6 hours.

Track: https://bit.ly/track-pkg
Support: delivery@amazonindia.co.in`,
    sourceType: 'whatsapp',
    riskHint: 'Delivery fee scam, fake domain, urgent timeline'
  },
  {
    category: 'job scam',
    title: 'Fake Job Offer',
    preview: 'Congratulations! Selected for ₹45,000/month work from home job...',
    fullText: `🎉 CONGRATULATIONS! 🎉

You have been SELECTED for:
Position: Data Entry Executive
Company: Reliance Industries Ltd
Salary: ₹45,000/month
Location: Work From Home

Selection based on your profile review.

To confirm joining:
1. Pay registration fee: ₹2,500
2. Submit documents
3. Start immediately

Payment link: https://reliance-careers.co/join
WhatsApp: +91-9876543210

Limited seats available. Confirm within 24 hours.

HR Manager
Reliance Industries Ltd`,
    sourceType: 'email',
    riskHint: 'Upfront payment request, fake company domain'
  },
  {
    category: 'bank alert',
    title: 'Fake Bank Account Freeze',
    preview: 'ALERT: Your account has been temporarily frozen due to suspicious activity...',
    fullText: `⚠️ SECURITY ALERT ⚠️

Account: XXXX4567
Status: TEMPORARILY FROZEN

Reason: Suspicious transaction detected

Immediate action required to unfreeze:
1. Verify identity
2. Confirm recent transactions
3. Update security details

🔗 Secure login: https://sbi-secure-banking.org/verify
📞 Call: 1800-11-22-33

Failure to verify within 2 hours will result in permanent account closure.

State Bank of India
Security Team`,
    sourceType: 'sms',
    riskHint: 'Account freeze threat, fake domain, time pressure'
  },
  {
    category: 'impersonation',
    title: 'Fake Tech Support',
    preview: 'Microsoft Security Alert: Virus detected on your computer...',
    fullText: `🛡️ MICROSOFT SECURITY CENTER 🛡️

CRITICAL SECURITY ALERT

Your Windows computer (IP: 192.168.1.101) has been infected with:
• Trojan.Win32.Malware
• Keylogger.SpyBot
• Ransomware.Crypto

Immediate action required to prevent:
❌ Data theft
❌ Identity fraud
❌ System corruption

Call Microsoft Certified Technician immediately:
📞 TOLL-FREE: 1800-209-8765

DO NOT use your computer for banking or shopping until resolved.

Case ID: MS2024-7891
Technician will provide free scan and removal.

Microsoft Corporation
Security Response Team`,
    sourceType: 'email',
    riskHint: 'Tech support scam, fake Microsoft alert, phone number'
  },
  {
    category: 'investment scam',
    title: 'Fake Investment Opportunity',
    preview: 'Exclusive: Government-backed scheme offering 200% returns...',
    fullText: `💰 EXCLUSIVE INVESTMENT OPPORTUNITY 💰

🏛️ GOVERNMENT OF INDIA BACKED SCHEME

Invest ₹10,000 - Get ₹20,000 in 30 days
✅ 200% guaranteed returns
✅ No risk - Government guarantee
✅ Limited time offer

Scheme Details:
• PM Investment Yojana 2024
• RBI approved
• Tax free returns
• Minimum investment: ₹5,000

Only 100 slots remaining!

Apply now: https://pm-investment-scheme.co.in/apply
WhatsApp: +91-8765432109

Hurry! Offer closes in 48 hours.

Investment Advisory Services
Government of India`,
    sourceType: 'whatsapp',
    riskHint: 'Too good to be true returns, fake government scheme'
  }
]

const defaultPreferences = {
  theme: 'dark',
  demoMode: true,
  showAdvancedSignals: false
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.report.deleteMany()
  await prisma.analysisReason.deleteMany()
  await prisma.analysis.deleteMany()
  await prisma.sampleTemplate.deleteMany()
  await prisma.userPreference.deleteMany()

  // Seed sample templates
  for (const template of sampleTemplates) {
    await prisma.sampleTemplate.create({
      data: template
    })
  }

  // Seed default preferences
  await prisma.userPreference.create({
    data: defaultPreferences
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📋 Created ${sampleTemplates.length} sample templates`)
  console.log('⚙️ Created default user preferences')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })