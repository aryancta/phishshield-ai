import { useState } from 'react'
import { toast } from 'sonner'
import { AnalysisRequest, AnalysisResult } from '@/types'
import { useAppStore } from '@/store/use-app-store'

export function useAnalysis() {
  const { setCurrentAnalysis, setIsAnalyzing } = useAppStore()

  const analyzeMessage = async (request: AnalysisRequest): Promise<AnalysisResult> => {
    setIsAnalyzing(true)
    
    try {
      // Handle screenshot analysis differently
      if (request.sourceType === 'screenshot') {
        // Mock OCR call first
        const ocrResponse = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: 'mock-base64-data',
            fileName: request.text // Use the filename from the input
          })
        })
        
        if (!ocrResponse.ok) {
          throw new Error('OCR processing failed')
        }
        
        const ocrResult = await ocrResponse.json()
        
        // Update request with extracted text
        request.text = ocrResult.extractedText
        request.sourceType = 'message' // Convert to message for analysis
      }
      
      // Perform main analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Analysis failed')
      }

      const result: AnalysisResult = await response.json()
      setCurrentAnalysis(result)
      
      toast.success(`Analysis complete: ${result.verdict.replace('_', ' ')} risk detected`)
      
      return result
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Analysis failed')
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }

  const scanUrl = async (url: string) => {
    try {
      const response = await fetch('/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'URL scan failed')
      }

      return await response.json()
    } catch (error) {
      console.error('URL scan error:', error)
      toast.error(error instanceof Error ? error.message : 'URL scan failed')
      throw error
    }
  }

  return {
    analyzeMessage,
    scanUrl
  }
}