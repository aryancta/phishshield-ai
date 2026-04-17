"use client"

import { TopNav } from "@/components/top-nav"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Cyber grid background */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      
      {/* Main content */}
      <div className="relative z-10">
        <TopNav />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
      
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}