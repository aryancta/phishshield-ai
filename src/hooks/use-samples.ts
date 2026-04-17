import { useState, useEffect } from 'react'
import { SampleTemplate, ScamCategory } from '@/types'
import { toast } from 'sonner'

export function useSamples() {
  const [samples, setSamples] = useState<SampleTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSamples = async (category?: ScamCategory) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams()
      if (category) searchParams.set('category', category)
      
      const response = await fetch(`/api/samples?${searchParams}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch samples')
      }
      
      const data = await response.json()
      setSamples(data.items || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch samples'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getSamplesByCategory = (category: ScamCategory) => {
    return samples.filter(sample => sample.category === category)
  }

  const getRandomSample = () => {
    if (samples.length === 0) return null
    return samples[Math.floor(Math.random() * samples.length)]
  }

  useEffect(() => {
    fetchSamples()
  }, [])

  return {
    samples,
    loading,
    error,
    fetchSamples,
    getSamplesByCategory,
    getRandomSample
  }
}