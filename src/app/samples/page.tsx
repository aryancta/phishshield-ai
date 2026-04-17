"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SampleTemplateGrid } from "@/components/sample-template-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { 
  FileText, 
  Search, 
  Filter,
  CreditCard,
  Smartphone,
  Briefcase,
  Building,
  Shield,
  TrendingUp
} from "lucide-react"
import { useSamples } from "@/hooks/use-samples"
import { useAnalysis } from "@/hooks/use-analysis"
import { SampleTemplate, ScamCategory, AnalysisRequest } from "@/types"
import { SCAM_CATEGORIES } from "@/lib/constants"
import { toast } from "sonner"

const categoryInfo = {
  'UPI fraud': {
    icon: CreditCard,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    description: 'Fake payment verification and KYC scams targeting UPI users'
  },
  'delivery scam': {
    icon: Smartphone,
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    description: 'Fake delivery notifications demanding redelivery fees'
  },
  'job scam': {
    icon: Briefcase,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
    description: 'Fake job offers requiring upfront registration payments'
  },
  'bank alert': {
    icon: Building,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    description: 'Fake banking security alerts and account freeze warnings'
  },
  'impersonation': {
    icon: Shield,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    description: 'Tech support and authority figure impersonation scams'
  },
  'investment scam': {
    icon: TrendingUp,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 border-pink-500/20',
    description: 'Fake investment schemes promising guaranteed returns'
  }
}

export default function SamplesPage() {
  const { samples, loading } = useSamples()
  const { analyzeMessage } = useAnalysis()
  const [activeCategory, setActiveCategory] = useState<ScamCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSamples = samples.filter(sample => {
    const matchesCategory = activeCategory === 'all' || sample.category === activeCategory
    const matchesSearch = !searchQuery || 
      sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const handleLoadSample = async (sample: SampleTemplate) => {
    const request: AnalysisRequest = {
      text: sample.fullText,
      sourceType: sample.sourceType as any,
      includeUrlScan: true
    }

    try {
      await analyzeMessage(request)
      window.location.href = '/scan'
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const getCategoryStats = (category: ScamCategory) => {
    return samples.filter(s => s.category === category).length
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Scam Template Library
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real-world phishing examples to test PhishShield AI's detection capabilities
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {samples.length} Examples
            </Badge>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              {SCAM_CATEGORIES.length} Categories
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              India-Specific
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-4 cyber-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search examples by title, content, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
          <div className="overflow-x-auto">
            <TabsList className="inline-flex bg-slate-800/50 p-1 min-w-full justify-start">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <span>All Categories</span>
                <Badge variant="outline" className="ml-1 text-xs">
                  {samples.length}
                </Badge>
              </TabsTrigger>
              {SCAM_CATEGORIES.map((category) => {
                const info = categoryInfo[category]
                const Icon = info?.icon || FileText
                const count = getCategoryStats(category)
                
                return (
                  <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{category}</span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {count}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="all">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <SampleTemplateGrid 
                  samples={filteredSamples} 
                  onLoadSample={handleLoadSample} 
                />
              </motion.div>
            </TabsContent>

            {SCAM_CATEGORIES.map((category) => (
              <TabsContent key={category} value={category}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Category Info */}
                  <Card className="p-6 cyber-border">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg border ${categoryInfo[category]?.bgColor}`}>
                        {categoryInfo[category]?.icon && (
                          <categoryInfo[category].icon className={`w-6 h-6 ${categoryInfo[category]?.color}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white capitalize mb-2">
                          {category} Scams
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          {categoryInfo[category]?.description}
                        </p>
                        <div className="mt-3">
                          <Badge className={categoryInfo[category]?.bgColor}>
                            {getCategoryStats(category)} examples available
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <SampleTemplateGrid 
                    samples={filteredSamples} 
                    onLoadSample={handleLoadSample} 
                  />
                </motion.div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </motion.div>

      {/* Educational Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-300 mb-2">
                Educational Purpose
              </h3>
              <p className="text-amber-100/80 leading-relaxed text-sm">
                These examples are based on real phishing attempts but have been modified for educational purposes. 
                All URLs and contact information have been made safe. Use these samples to understand common 
                scam tactics and test PhishShield AI's detection capabilities.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}