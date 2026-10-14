import { useEffect, useRef, useState } from 'react'
import type { DialogueLine } from '../game/types'
import { playTone, resumeAudio } from '../game/audio'

interface Props {
  lines: DialogueLine[]
  onDone: () => void
  doneLabel?: string
}

export function DialogueBox({ lines, onDone, doneLabel = '继续' }: Props) {
  const [index, setIndex] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const safeLen = Math.max(lines.length, 1)
  const clamped = Math.min(index, safeLen - 1)
  const line = lines[clamped] ?? { speaker: '', text: '' }
  const last = clamped >= lines.length - 1

  useEffect(() => {
    if (lines.length === 0) onDoneRef.current()
  }, [lines.length])

  const advanceRef = useRef(() => {})
  advanceRef.current = () => {
    resumeAudio()
    playTone(520, 0.05, 'sine', 0.04)
    if (last) onDoneRef.current()
    else setIndex((i) => i + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        advanceRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const advance = () => advanceRef.current()

  return (
    <div
      className="dialogue"
      role="dialog"
      aria-live="polite"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        advance()
      }}
    >
      <div className="dialogue__speaker">{line.speaker}</div>
      <p className="dialogue__text">{line.text}</p>
      <div className="dialogue__footer">
        <span className="dialogue__progress">
          {lines.length === 0 ? '0 / 0' : `${clamped + 1} / ${lines.length}`}
        </span>
        <button type="button" className="btn btn--primary" onClick={advance}>
          {last ? doneLabel : '下一句'}
        </button>
      </div>
    </div>
  )
}
