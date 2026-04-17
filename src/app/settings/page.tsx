"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Shield, 
  Lock, 
  Database, 
  Trash2, 
  Download,
  Eye,
  Moon,
  Sun,
  Zap,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react"
import { useAppStore } from "@/store/use-app-store"
import { useTheme } from "next-themes"
import { useState } from "react"
import { APP_METADATA } from "@/lib/constants"

export default function SettingsPage() {
  const { preferences, setPreferences, demoMode, setDemoMode } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [localStorageSize, setLocalStorageSize] = useState(0)

  // Calculate local storage usage
  const calculateStorageSize = () => {
    try {
      const storage = JSON.stringify(localStorage)
      return new Blob([storage]).size
    } catch {
      return 0
    }
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This includes scan history, preferences, and cached results.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleExportSettings = () => {
    const settingsData = {
      preferences,
      demoMode,
      theme,
      exportDate: new Date().toISOString(),
      version: APP_METADATA.version
    }

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `phishshield-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-xl border border-slate-500/30">
            <Settings className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Settings & Privacy
          </h1>
        </div>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Configure your PhishShield AI experience and manage your data
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Appearance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 cyber-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-purple-400" />
                ) : (
                  <Sun className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Appearance</h2>
                <p className="text-sm text-slate-400">Customize the visual theme</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Theme</div>
                  <div className="text-sm text-slate-400">
                    Choose between light and dark mode
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="border-slate-600"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="border-slate-600"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Analysis Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 cyber-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Analysis Settings</h2>
                <p className="text-sm text-slate-400">Configure detection behavior</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Demo Mode</div>
                  <div className="text-sm text-slate-400">
                    Use sample data and simulated analysis results
                  </div>
                </div>
                <Switch
                  checked={demoMode}
                  onCheckedChange={setDemoMode}
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Advanced Signals</div>
                  <div className="text-sm text-slate-400">
                    Show detailed signal breakdowns in results
                  </div>
                </div>
                <Switch
                  checked={preferences.showAdvancedSignals}
                  onCheckedChange={(checked) => 
                    setPreferences({ showAdvancedSignals: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Privacy & Security */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 cyber-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
                <p className="text-sm text-slate-400">Your data protection settings</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Privacy Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      Local Processing
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    All analysis happens on your device
                  </p>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      No External Calls
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Messages are never sent to external servers
                  </p>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      Local Storage Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Data stays in your browser's local storage
                  </p>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      User Control
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    You can clear all data at any time
                  </p>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-cyan-300 font-medium mb-1">
                      Privacy-First Design
                    </div>
                    <p className="text-cyan-100/80">
                      PhishShield AI is designed with privacy as a core principle. All message 
                      analysis happens locally in your browser using JavaScript-based detection 
                      algorithms. No message content is ever transmitted to external servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Data Management */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 cyber-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <Database className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Data Management</h2>
                <p className="text-sm text-slate-400">Export or clear your local data</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Local Storage Usage</div>
                  <div className="text-sm text-slate-400">
                    Data stored in your browser: ~{(calculateStorageSize() / 1024).toFixed(1)} KB
                  </div>
                </div>
                <Badge variant="outline" className="text-slate-300">
                  {localStorage.length} items
                </Badge>
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleExportSettings}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>

                <Button
                  onClick={handleClearData}
                  variant="outline"
                  className="border-red-600 text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-amber-300 font-medium mb-1">
                      Data Clearing Warning
                    </div>
                    <p className="text-amber-100/80">
                      Clearing all data will permanently remove your scan history, preferences, 
                      and any cached analysis results. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 cyber-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-slate-500/20 rounded-lg border border-slate-500/30">
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">About PhishShield AI</h2>
                <p className="text-sm text-slate-400">Application information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Version</div>
                  <div className="text-white font-medium">{APP_METADATA.version}</div>
                </div>
                <div>
                  <div className="text-slate-400">Created by</div>
                  <div className="text-white font-medium">{APP_METADATA.author}</div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <p className="text-sm text-slate-300 leading-relaxed">
                {APP_METADATA.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => window.open('mailto:' + APP_METADATA.email)}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Contact Support
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => window.open('https://github.com/aryancta/phishshield-ai')}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Source
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}