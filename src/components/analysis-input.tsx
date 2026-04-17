"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Scan, Upload, Link as LinkIcon, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { AnalysisRequest, SourceType } from "@/types"
import { useAppStore } from "@/store/use-app-store"
import { cn } from "@/lib/utils"

interface AnalysisInputProps {
  onAnalyze: (request: AnalysisRequest) => Promise<void>
  className?: string
}

const samplePrompts = [
  "Paste suspicious SMS, WhatsApp, or email here...",
  "Check if that delivery message is legitimate...",
  "Verify if that UPI request is safe...", 
  "Scan that job offer for red flags..."
]

export function AnalysisInput({ onAnalyze, className }: AnalysisInputProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'url' | 'screenshot'>('message')
  const [messageText, setMessageText] = useState('')
  const [urlText, setUrlText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { isAnalyzing } = useAppStore()
  
  const [currentPrompt, setCurrentPrompt] = useState(samplePrompts[0])

  const handleSubmit = async () => {
    if (isAnalyzing) return

    let text = ''
    let sourceType: SourceType = 'message'

    switch (activeTab) {
      case 'message':
        if (!messageText.trim()) {
          toast.error('Please enter a message to analyze')
          return
        }
        text = messageText.trim()
        sourceType = 'message'
        break

      case 'url':
        if (!urlText.trim()) {
          toast.error('Please enter a URL to analyze')
          return
        }
        text = urlText.trim()
        sourceType = 'url'
        break

      case 'screenshot':
        if (!file) {
          toast.error('Please upload a screenshot to analyze')
          return
        }
        // For demo purposes, we'll use mock OCR
        text = `Screenshot uploaded: ${file.name}`
        sourceType = 'screenshot'
        break
    }

    const request: AnalysisRequest = {
      text,
      sourceType,
      includeUrlScan: true
    }

    try {
      await onAnalyze(request)
      
      // Clear inputs after successful analysis
      if (activeTab === 'message') setMessageText('')
      if (activeTab === 'url') setUrlText('')
      if (activeTab === 'screenshot') setFile(null)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Analysis failed. Please try again.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      if (!uploadedFile.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      
      if (uploadedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setFile(uploadedFile)
    }
  }

  const loadSampleMessage = (sampleText: string) => {
    setMessageText(sampleText)
    setActiveTab('message')
    toast.success('Sample loaded! Click Analyze to scan.')
  }

  return (
    <Card className={cn("p-6 cyber-border", className)}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Message Security Scanner
          </h2>
          <p className="text-slate-400">
            Paste any suspicious message, URL, or upload a screenshot for instant analysis
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="message" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <span>URL</span>
            </TabsTrigger>
            <TabsTrigger value="screenshot" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Screenshot</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="space-y-4">
            <div>
              <Textarea
                placeholder={currentPrompt}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">
                  {messageText.length}/2000 characters
                </span>
                {messageText.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessageText('')}
                    className="text-slate-400 hover:text-white"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Input
                placeholder="https://suspicious-link.example.com/verify"
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                disabled={isAnalyzing}
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter any URL to check for phishing, malware, or suspicious patterns
              </p>
            </div>
          </TabsContent>

          <TabsContent value="screenshot" className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="screenshot-upload"
                disabled={isAnalyzing}
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                {file ? (
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium mb-2">
                      Click to upload screenshot
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                )}
              </label>
            </div>
            <p className="text-xs text-slate-500 text-center">
              We'll extract text from your screenshot and analyze it for threats
            </p>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4 mr-2" />
                Analyze {activeTab === 'url' ? 'URL' : activeTab === 'screenshot' ? 'Screenshot' : 'Message'}
              </>
            )}
          </Button>
        </div>

        {/* Sample prompts for message tab */}
        {activeTab === 'message' && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-300">
              Try these examples:
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-700 text-slate-300 border-slate-600"
                  onClick={() => setCurrentPrompt(prompt)}
                >
                  {prompt.split('...')[0]}...
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}