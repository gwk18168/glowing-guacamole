import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CollectibleId, GameProgress, Screen } from './types'

const STORAGE_KEY = 'meumy-dream-ch1-progress'

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultProgress()
}

function defaultProgress(): GameProgress {
  return {
    rhythmCleared: false,
    match3Cleared: false,
    collectibles: [],
    chapter1Cleared: false,
    seenIntro: false,
  }
}

interface GameStore {
  screen: Screen
  setScreen: (s: Screen) => void
  progress: GameProgress
  unlockCollectible: (id: CollectibleId) => void
  markRhythmCleared: () => void
  markMatch3Cleared: () => void
  markChapterCleared: () => void
  markIntroSeen: () => void
  resetProgress: () => void
  hasCollectible: (id: CollectibleId) => boolean
}

const Ctx = createContext<GameStore | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('title')
  const [progress, setProgress] = useState<GameProgress>(loadProgress)

  const persist = useCallback((next: GameProgress) => {
    setProgress(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const unlockCollectible = useCallback(
    (id: CollectibleId) => {
      setProgress((prev) => {
        if (prev.collectibles.includes(id)) return prev
        const next = { ...prev, collectibles: [...prev.collectibles, id] }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [],
  )

  const markRhythmCleared = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, rhythmCleared: true }
      if (!next.collectibles.includes('kirakira')) {
        next.collectibles = [...next.collectibles, 'kirakira']
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const markMatch3Cleared = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, match3Cleared: true }
      if (!next.collectibles.includes('plate-steel')) {
        next.collectibles = [...next.collectibles, 'plate-steel']
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const markChapterCleared = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, chapter1Cleared: true }
      if (!next.collectibles.includes('cotton-star')) {
        next.collectibles = [...next.collectibles, 'cotton-star']
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const markIntroSeen = useCallback(() => {
    persist({ ...progress, seenIntro: true })
  }, [persist, progress])

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress()
    persist(fresh)
    setScreen('title')
  }, [persist])

  const hasCollectible = useCallback(
    (id: CollectibleId) => progress.collectibles.includes(id),
    [progress.collectibles],
  )

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      progress,
      unlockCollectible,
      markRhythmCleared,
      markMatch3Cleared,
      markChapterCleared,
      markIntroSeen,
      resetProgress,
      hasCollectible,
    }),
    [
      screen,
      progress,
      unlockCollectible,
      markRhythmCleared,
      markMatch3Cleared,
      markChapterCleared,
      markIntroSeen,
      resetProgress,
      hasCollectible,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useGame() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
