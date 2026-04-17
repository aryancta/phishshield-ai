"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, ExternalLink, RefreshCw } from "lucide-react"
import { VerdictBadge } from "@/components/verdict-badge"
import { useHistory } from "@/hooks/use-history"
import { SavedAnalysis, VerdictType } from "@/types"
import { formatTimestamp, truncateText } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface HistoryTableProps {
  showSearch?: boolean
  showFilters?: boolean
  limit?: number
  className?: string
}

export function HistoryTable({ 
  showSearch = true, 
  showFilters = true, 
  limit = 10,
  className 
}: HistoryTableProps) {
  const { history, loading, fetchHistory, refreshHistory } = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [verdictFilter, setVerdictFilter] = useState<VerdictType | 'all'>('all')
  const [filteredHistory, setFilteredHistory] = useState<SavedAnalysis[]>([])

  // Filter history based on search and filters
  useEffect(() => {
    let filtered = history

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply verdict filter
    if (verdictFilter !== 'all') {
      filtered = filtered.filter(item => item.verdict === verdictFilter)
    }

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    setFilteredHistory(filtered)
  }, [history, searchQuery, verdictFilter, limit])

  const handleRefresh = () => {
    refreshHistory()
  }

  const openReport = (reportId: string) => {
    window.open(`/report/${reportId}`, '_blank')
  }

  return (
    <Card className={cn("cyber-border", className)}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Recent Scans</h3>
            <p className="text-sm text-slate-400">
              {filteredHistory.length} of {history.length} scans
            </p>
          </div>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search scans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            )}
            
            {showFilters && (
              <Select value={verdictFilter} onValueChange={(value) => setVerdictFilter(value as any)}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-white">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="safe">Safe Only</SelectItem>
                  <SelectItem value="suspicious">Suspicious Only</SelectItem>
                  <SelectItem value="high_risk">High Risk Only</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && (
          <>
            {filteredHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-transparent">
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Summary</TableHead>
                      <TableHead className="text-slate-300">Verdict</TableHead>
                      <TableHead className="text-slate-300">Risk</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-slate-700 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="text-slate-400 font-mono text-xs">
                          {formatTimestamp(item.createdAt).split(',')[0]}
                        </TableCell>
                        <TableCell className="text-slate-300 max-w-xs">
                          <div className="truncate" title={item.summary}>
                            {truncateText(item.summary, 80)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <VerdictBadge verdict={item.verdict as VerdictType} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                item.riskScore <= 30 ? "bg-emerald-400" :
                                item.riskScore <= 70 ? "bg-amber-400" :
                                "bg-red-400"
                              )}
                            />
                            <span className="text-sm text-slate-300">
                              {item.riskScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                            {item.sourceType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => openReport(item.reportId)}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-cyan-300 hover:bg-slate-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-500" />
                </div>
                <h4 className="text-lg font-medium text-slate-300 mb-2">No Scans Found</h4>
                <p className="text-slate-500 text-sm">
                  {searchQuery || verdictFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Your scan history will appear here after you analyze messages.'}
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Load More */}
        {!loading && filteredHistory.length === limit && history.length > limit && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => fetchHistory({ limit: limit + 10 })}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}