import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ocrSchema = z.object({
  imageBase64: z.string().min(1, 'Image data is required'),
  fileName: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = ocrSchema.parse(body)
    
    // Mock OCR implementation - in a real app, you'd use an OCR service
    // For demo purposes, we'll return sample text based on filename or provide generic text
    
    let extractedText = ''
    const confidence = 0.85
    
    if (validated.fileName) {
      const fileName = validated.fileName.toLowerCase()
      
      if (fileName.includes('upi') || fileName.includes('payment')) {
        extractedText = `🚨 URGENT ACTION REQUIRED 🚨
        
Your UPI account will be SUSPENDED in 24 hours due to incomplete KYC verification.

To avoid suspension, complete verification immediately:
👆 Click: https://upi-kyc-verify.co.in/update

Complete now to avoid inconvenience.
- State Bank of India`
      } else if (fileName.includes('delivery') || fileName.includes('amazon')) {
        extractedText = `📦 DELIVERY UPDATE

Package delivery attempt failed at your address.

Package ID: DEL2024789456
Sender: Amazon India

To schedule redelivery, pay ₹50 processing fee:
💳 Pay now: https://delivery-update.net/pay`
      } else if (fileName.includes('bank') || fileName.includes('alert')) {
        extractedText = `⚠️ SECURITY ALERT ⚠️

Account: XXXX4567
Status: TEMPORARILY FROZEN

🔗 Secure login: https://sbi-secure-banking.org/verify
📞 Call: 1800-11-22-33

State Bank of India Security Team`
      } else {
        extractedText = `Sample extracted text from uploaded image. 

This is a demonstration of OCR functionality. In a real implementation, this would use an actual OCR service to extract text from the uploaded image.

The extracted text would then be analyzed for phishing patterns and suspicious content.`
      }
    } else {
      extractedText = `Demo OCR: Extracted text from image

This is a sample OCR result. The actual implementation would process the uploaded image and return the extracted text content for analysis.

Contact support: customer.care@example.com
Verify account: https://secure-verify.example.com/login`
    }
    
    return NextResponse.json({
      extractedText,
      confidence
    })
  } catch (error) {
    console.error('OCR error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid image data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'OCR processing failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'PhishShield AI OCR API', 
    note: 'This is a demo implementation. Upload an image to extract text.' 
  })
}