"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp } from "lucide-react"

const trendData = [
  { date: 'Jan 1', safe: 45, suspicious: 12, high_risk: 3, total: 60 },
  { date: 'Jan 2', safe: 52, suspicious: 15, high_risk: 2, total: 69 },
  { date: 'Jan 3', safe: 38, suspicious: 8, high_risk: 4, total: 50 },
  { date: 'Jan 4', safe: 67, suspicious: 18, high_risk: 5, total: 90 },
  { date: 'Jan 5', safe: 71, suspicious: 14, high_risk: 3, total: 88 },
  { date: 'Jan 6', safe: 59, suspicious: 22, high_risk: 7, total: 88 },
  { date: 'Jan 7', safe: 84, suspicious: 16, high_risk: 4, total: 104 },
]

const pieData = [
  { name: 'Safe', value: 416, color: '#10b981' },
  { name: 'Suspicious', value: 105, color: '#f59e0b' },
  { name: 'High Risk', value: 28, color: '#ef4444' },
]

interface TrendChartProps {
  className?: string
}

export function TrendChart({ className }: TrendChartProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Line Chart */}
      <Card className="lg:col-span-2 p-6 cyber-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Scan Activity Trend</h3>
            <p className="text-sm text-slate-400">Daily scan volume over the last 7 days</p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            +23% this week
          </Badge>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="safe" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="suspicious" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: '#f59e0b' }}
              />
              <Line 
                type="monotone" 
                dataKey="high_risk" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full" />
            <span className="text-slate-300">Safe Messages</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full" />
            <span className="text-slate-300">Suspicious</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className="text-slate-300">High Risk</span>
          </div>
        </div>
      </Card>

      {/* Pie Chart */}
      <Card className="p-6 cyber-border">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">Distribution</h3>
          <p className="text-sm text-slate-400">Threat level breakdown</p>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.name}</span>
              </div>
              <div className="text-sm font-medium text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
          Total: {pieData.reduce((sum, item) => sum + item.value, 0)} scans
        </div>
      </Card>
    </div>
  )
}