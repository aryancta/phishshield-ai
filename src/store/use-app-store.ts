import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AnalysisResult, UserPreferences, AppState } from '@/types'

interface AppStore extends AppState {
  // Actions
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  setDemoMode: (demoMode: boolean) => void
  setPreferences: (preferences: Partial<UserPreferences>) => void
  resetAnalysis: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentAnalysis: null,
      isAnalyzing: false,
      demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
      preferences: {
        theme: 'dark',
        demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
        showAdvancedSignals: false
      },

      // Actions
      setCurrentAnalysis: (analysis) => 
        set({ currentAnalysis: analysis }),

      setIsAnalyzing: (isAnalyzing) => 
        set({ isAnalyzing }),

      setDemoMode: (demoMode) => 
        set({ 
          demoMode,
          preferences: { 
            ...get().preferences, 
            demoMode 
          }
        }),

      setPreferences: (newPreferences) =>
        set({
          preferences: {
            ...get().preferences,
            ...newPreferences
          }
        }),

      resetAnalysis: () =>
        set({ 
          currentAnalysis: null, 
          isAnalyzing: false 
        }),
    }),
    {
      name: 'phishshield-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        demoMode: state.demoMode,
      }),
    }
  )
)