import { useEffect, useRef, useState } from 'react'
import { RHYTHM_CLEAR, RHYTHM_INTRO } from '../game/data'
import { DialogueBox } from '../components/DialogueBox'
import { useGame } from '../game/store'
import { playHit, playMiss, playClear, resumeAudio } from '../game/audio'

type Phase = 'intro' | 'play' | 'result' | 'outro'

interface Note {
  id: number
  lane: number
  time: number
  hit?: 'perfect' | 'good' | 'miss'
}

const LANES = 4
const KEYS = ['d', 'f', 'j', 'k']
const KEY_LABELS = ['D', 'F', 'J', 'K']
const TRAVEL_MS = 1600
const PERFECT = 70
const GOOD = 140
const TARGET_HITS = 18

function buildChart(): Note[] {
  const notes: Note[] = []
  let t = 1200
  let id = 0
  const pattern = [0, 1, 2, 3, 1, 2, 0, 3, 0, 2, 1, 3, 0, 1, 3, 2, 1, 0, 2, 3, 0, 1]
  for (let i = 0; i < pattern.length; i++) {
    notes.push({ id: id++, lane: pattern[i], time: t })
    t += i % 5 === 4 ? 520 : 380
    if (i % 7 === 6) {
      notes.push({ id: id++, lane: (pattern[i] + 2) % 4, time: t - 40 })
    }
  }
  return notes
}

export function RhythmGame() {
  const { setScreen, markRhythmCleared, progress } = useGame()
  const [phase, setPhase] = useState<Phase>(progress.rhythmCleared ? 'play' : 'intro')
  const [notes, setNotes] = useState<Note[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [now, setNow] = useState(0)
  const startRef = useRef(0)
  const notesRef = useRef<Note[]>([])
  const comboRef = useRef(0)
  const hitsRef = useRef(0)
  const judged = useRef(new Set<number>())
  const rafRef = useRef(0)
  const finishedRef = useRef(false)
  const judgeRef = useRef<(lane: number) => void>(() => {})

  const startPlay = () => {
    resumeAudio()
    const chart = buildChart()
    notesRef.current = chart
    judged.current = new Set()
    comboRef.current = 0
    hitsRef.current = 0
    finishedRef.current = false
    setNotes(chart)
    setScore(0)
    setCombo(0)
    setHits(0)
    setMisses(0)
    startRef.current = performance.now()
    setPhase('play')
  }

  useEffect(() => {
    judgeRef.current = (lane: number) => {
      if (finishedRef.current || phase !== 'play') return
      const elapsed = performance.now() - startRef.current
      let best: Note | null = null
      let bestDiff = Infinity
      for (const n of notesRef.current) {
        if (n.lane !== lane || judged.current.has(n.id) || n.hit) continue
        const diff = Math.abs(elapsed - n.time)
        if (diff < bestDiff) {
          bestDiff = diff
          best = n
        }
      }
      if (!best || bestDiff > GOOD) {
        playMiss()
        comboRef.current = 0
        setCombo(0)
        setMisses((m) => m + 1)
        return
      }
      const targetId = best.id
      judged.current.add(targetId)
      const grade: 'perfect' | 'good' = bestDiff <= PERFECT ? 'perfect' : 'good'
      const updated: Note[] = notesRef.current.map((n) =>
        n.id === targetId ? { ...n, hit: grade } : n,
      )
      notesRef.current = updated
      playHit(lane)
      comboRef.current += 1
      hitsRef.current += 1
      setCombo(comboRef.current)
      setHits(hitsRef.current)
      setScore((s) => s + (grade === 'perfect' ? 300 : 100) + Math.min(comboRef.current, 20) * 5)
      setNotes(updated)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'play') return

    const finish = (hitTotal: number) => {
      if (finishedRef.current) return
      finishedRef.current = true
      setHits(hitTotal)
      setPhase('result')
    }

    const tick = (t: number) => {
      const elapsed = t - startRef.current
      setNow(elapsed)

      let missCount = 0
      const nextNotes = notesRef.current.map((n) => {
        if (judged.current.has(n.id) || n.hit) return n
        if (elapsed - n.time > GOOD) {
          judged.current.add(n.id)
          missCount++
          return { ...n, hit: 'miss' as const }
        }
        return n
      })

      if (missCount) {
        notesRef.current = nextNotes
        setNotes(nextNotes)
        setMisses((m) => m + missCount)
        comboRef.current = 0
        setCombo(0)
        playMiss()
      }

      const hitTotal = notesRef.current.filter(
        (n) => n.hit === 'perfect' || n.hit === 'good',
      ).length
      const allDone = notesRef.current.every((n) => judged.current.has(n.id) || n.hit)

      if (allDone || hitTotal >= TARGET_HITS) {
        finish(hitTotal)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onKey = (e: KeyboardEvent) => {
      const lane = KEYS.indexOf(e.key.toLowerCase())
      if (lane < 0) return
      e.preventDefault()
      judgeRef.current(lane)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase])

  const passed = hits >= TARGET_HITS && misses < 12

  if (phase === 'intro') {
    return (
      <section className="screen game-screen">
        <DialogueBox lines={RHYTHM_INTRO} doneLabel="开始祭典" onDone={startPlay} />
      </section>
    )
  }

  if (phase === 'outro') {
    return (
      <section className="screen game-screen">
        <DialogueBox
          lines={RHYTHM_CLEAR}
          doneLabel="返回神殿"
          onDone={() => setScreen('chapter1')}
        />
      </section>
    )
  }

  if (phase === 'result') {
    return (
      <section className="screen game-screen result-screen">
        <h2>{passed ? '祭典成功 · KiraKira！' : '节拍乱了……'}</h2>
        <p>
          命中 {hits} · Miss {misses} · 得分 {score}
        </p>
        <p className="muted">目标：至少命中 {TARGET_HITS} 次，Miss 少于 12。</p>
        <div className="cta-row">
          {passed ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                markRhythmCleared()
                playClear()
                setPhase('outro')
              }}
            >
              收下徽章
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={startPlay}>
              再试一次
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={() => setScreen('chapter1')}>
            返回
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="screen game-screen rhythm-screen">
      <header className="topbar">
        <button type="button" className="btn btn--ghost" onClick={() => setScreen('chapter1')}>
          放弃
        </button>
        <h1>节奏祭典</h1>
        <span>
          {score} · COMBO {combo}
        </span>
      </header>

      <p className="hint">键盘 D F J K，或点击轨道底部按钮。追上落下的圣光！</p>

      <div className="rhythm-board">
        {Array.from({ length: LANES }).map((_, lane) => (
          <div key={lane} className="rhythm-lane">
            {notes
              .filter((n) => n.lane === lane && !n.hit)
              .map((n) => {
                const y = ((now - (n.time - TRAVEL_MS)) / TRAVEL_MS) * 100
                if (y < -10 || y > 120) return null
                return <div key={n.id} className="rhythm-note" style={{ top: `${y}%` }} />
              })}
            <div className="rhythm-judge" />
            <button
              type="button"
              className="rhythm-key"
              onClick={() => judgeRef.current(lane)}
            >
              {KEY_LABELS[lane]}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
