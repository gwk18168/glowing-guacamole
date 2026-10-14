import { useCallback, useState } from 'react'
import { MATCH3_CLEAR, MATCH3_INTRO } from '../game/data'
import { DialogueBox } from '../components/DialogueBox'
import { useGame } from '../game/store'
import { playMatch, playClear, playMiss, resumeAudio } from '../game/audio'

type Phase = 'intro' | 'play' | 'result' | 'outro'

const SIZE = 6
const TYPES = ['太陽', '聖甲', '蓮花', '安卡', '狼耳', '羊角'] as const
const TARGET_SCORE = 800

type Cell = (typeof TYPES)[number] | null

function randType(): Cell {
  return TYPES[Math.floor(Math.random() * TYPES.length)]
}

function createBoard(): Cell[][] {
  const board: Cell[][] = []
  for (let r = 0; r < SIZE; r++) {
    board[r] = []
    for (let c = 0; c < SIZE; c++) {
      let t = randType()
      while (
        (c >= 2 && board[r][c - 1] === t && board[r][c - 2] === t) ||
        (r >= 2 && board[r - 1][c] === t && board[r - 2][c] === t)
      ) {
        t = randType()
      }
      board[r][c] = t
    }
  }
  return board
}

function findMatches(board: Cell[][]): Set<string> {
  const matched = new Set<string>()
  for (let r = 0; r < SIZE; r++) {
    let run = 1
    for (let c = 1; c <= SIZE; c++) {
      if (c < SIZE && board[r][c] && board[r][c] === board[r][c - 1]) run++
      else {
        if (run >= 3) {
          for (let k = 0; k < run; k++) matched.add(`${r},${c - 1 - k}`)
        }
        run = 1
      }
    }
  }
  for (let c = 0; c < SIZE; c++) {
    let run = 1
    for (let r = 1; r <= SIZE; r++) {
      if (r < SIZE && board[r][c] && board[r][c] === board[r - 1][c]) run++
      else {
        if (run >= 3) {
          for (let k = 0; k < run; k++) matched.add(`${r - 1 - k},${c}`)
        }
        run = 1
      }
    }
  }
  return matched
}

function collapse(board: Cell[][]): { board: Cell[][]; gained: number } {
  const next = board.map((row) => [...row])
  let gained = 0
  let guard = 0
  while (guard++ < 20) {
    const matched = findMatches(next)
    if (matched.size === 0) break
    gained += matched.size * 40
    for (const key of matched) {
      const [r, c] = key.split(',').map(Number)
      next[r][c] = null
    }
    for (let c = 0; c < SIZE; c++) {
      let write = SIZE - 1
      for (let r = SIZE - 1; r >= 0; r--) {
        if (next[r][c] !== null) {
          next[write][c] = next[r][c]
          if (write !== r) next[r][c] = null
          write--
        }
      }
      for (let r = write; r >= 0; r--) next[r][c] = randType()
    }
  }
  return { board: next, gained }
}

export function Match3Game() {
  const { setScreen, markMatch3Cleared, progress } = useGame()
  const [phase, setPhase] = useState<Phase>(progress.match3Cleared ? 'play' : 'intro')
  const [board, setBoard] = useState<Cell[][]>(() => createBoard())
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(22)
  const [busy, setBusy] = useState(false)

  const startPlay = () => {
    resumeAudio()
    setBoard(createBoard())
    setScore(0)
    setMoves(22)
    setSelected(null)
    setPhase('play')
  }

  const swap = useCallback(
    (a: [number, number], b: [number, number]) => {
      if (busy) return
      const [[r1, c1], [r2, c2]] = [a, b]
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) {
        setSelected(b)
        return
      }
      setBusy(true)
      const next = board.map((row) => [...row])
      ;[next[r1][c1], next[r2][c2]] = [next[r2][c2], next[r1][c1]]
      const matched = findMatches(next)
      if (matched.size === 0) {
        playMiss()
        setSelected(null)
        setBusy(false)
        setMoves((m) => {
          const left = m - 1
          if (left <= 0) setPhase('result')
          return left
        })
        return
      }
      playMatch()
      const { board: collapsed, gained } = collapse(next)
      setBoard(collapsed)
      setScore((s) => {
        const total = s + gained
        setMoves((m) => {
          const left = m - 1
          if (total >= TARGET_SCORE || left <= 0) setPhase('result')
          return left
        })
        return total
      })
      setSelected(null)
      setBusy(false)
    },
    [board, busy],
  )

  const onCell = (r: number, c: number) => {
    if (busy || phase !== 'play') return
    if (!selected) {
      setSelected([r, c])
      return
    }
    if (selected[0] === r && selected[1] === c) {
      setSelected(null)
      return
    }
    swap(selected, [r, c])
  }

  if (phase === 'intro') {
    return (
      <section className="screen game-screen">
        <DialogueBox lines={MATCH3_INTRO} doneLabel="进入宝库" onDone={startPlay} />
      </section>
    )
  }

  if (phase === 'outro') {
    return (
      <section className="screen game-screen">
        <DialogueBox
          lines={MATCH3_CLEAR}
          doneLabel="返回神殿"
          onDone={() => setScreen('chapter1')}
        />
      </section>
    )
  }

  if (phase === 'result') {
    const passed = score >= TARGET_SCORE
    return (
      <section className="screen game-screen result-screen">
        <h2>{passed ? '宝库开启！' : '宝石尚未对齐'}</h2>
        <p>
          得分 {score} / {TARGET_SCORE} · 剩余步数 {Math.max(moves, 0)}
        </p>
        <div className="cta-row">
          {passed ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                markMatch3Cleared()
                playClear()
                setPhase('outro')
              }}
            >
              收下钢板共鸣铃
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
    <section className="screen game-screen match-screen">
      <header className="topbar">
        <button type="button" className="btn btn--ghost" onClick={() => setScreen('chapter1')}>
          放弃
        </button>
        <h1>尼罗宝库</h1>
        <span>
          {score}/{TARGET_SCORE} · 步数 {moves}
        </span>
      </header>

      <p className="hint">相邻交换，连成三枚以上同款圣物。目标 {TARGET_SCORE} 分。</p>

      <div className="match-board" style={{ ['--size' as string]: SIZE }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className={`match-cell match-cell--${TYPES.indexOf(cell as (typeof TYPES)[number])}${
                selected && selected[0] === r && selected[1] === c ? ' selected' : ''
              }`}
              onClick={() => onCell(r, c)}
            >
              {cell}
            </button>
          )),
        )}
      </div>
    </section>
  )
}
