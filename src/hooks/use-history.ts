import { useState, useEffect } from 'react'
import { SavedAnalysis, VerdictType } from '@/types'
import { toast } from 'sonner'

interface HistoryFilters {
  verdict?: VerdictType
  query?: string
  limit?: number
  offset?: number
}

export function useHistory() {
  const [history, setHistory] = useState<SavedAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async (filters: HistoryFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams()
      
      if (filters.verdict) searchParams.set('verdict', filters.verdict)
      if (filters.query) searchParams.set('q', filters.query)
      if (filters.limit) searchParams.set('limit', filters.limit.toString())
      if (filters.offset) searchParams.set('offset', filters.offset.toString())
      
      const response = await fetch(`/api/history?${searchParams}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch history')
      }
      
      const data = await response.json()
      setHistory(data.items || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch history'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const refreshHistory = () => {
    fetchHistory()
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return {
    history,
    loading,
    error,
    fetchHistory,
    refreshHistory
  }
}