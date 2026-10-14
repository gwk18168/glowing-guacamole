import { useState } from 'react'
import {
  CHAPTER1_INTRO,
  HUB_SPOTS,
  COLLECTIBLES,
} from '../game/data'
import { DialogueBox } from '../components/DialogueBox'
import { CollectiblesModal } from '../components/CollectiblesModal'
import { useGame } from '../game/store'
import { playTone, resumeAudio, playClear } from '../game/audio'
import type { CollectibleId } from '../game/types'

export function Chapter1Hub() {
  const {
    setScreen,
    progress,
    unlockCollectible,
    hasCollectible,
    markChapterCleared,
  } = useGame()
  const [phase, setPhase] = useState<'intro' | 'hub'>(
    progress.rhythmCleared || progress.match3Cleared ? 'hub' : 'intro',
  )
  const [bagOpen, setBagOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const bothClear = progress.rhythmCleared && progress.match3Cleared

  const pickup = (id: CollectibleId) => {
    if (hasCollectible(id)) {
      setToast('已经收集过这件文物了。')
      return
    }
    resumeAudio()
    playTone(700, 0.12)
    unlockCollectible(id)
    const name = COLLECTIBLES.find((c) => c.id === id)?.name ?? '文物'
    setToast(`获得：${name}`)
  }

  const tryFinish = () => {
    if (!bothClear) {
      setToast('还需完成「节奏祭典」与「尼罗宝库」两场试炼。')
      return
    }
    resumeAudio()
    playClear()
    markChapterCleared()
    setScreen('clear')
  }

  return (
    <section className="screen hub-screen">
      <header className="topbar">
        <button type="button" className="btn btn--ghost" onClick={() => setScreen('map')}>
          梦境星图
        </button>
        <h1>哈索尔 · 神殿庭院</h1>
        <button type="button" className="btn btn--ghost" onClick={() => setBagOpen(true)}>
          文物 {progress.collectibles.length}/7
        </button>
      </header>

      <div className="hub-hero" aria-hidden>
        <div className="pyramid" />
        <div className="nile" />
        <div className="obelisk obelisk--l" />
        <div className="obelisk obelisk--r" />
      </div>

      <div className="hub-status">
        <span className={progress.rhythmCleared ? 'ok' : ''}>
          节奏祭典 {progress.rhythmCleared ? '✓' : '○'}
        </span>
        <span className={progress.match3Cleared ? 'ok' : ''}>
          尼罗宝库 {progress.match3Cleared ? '✓' : '○'}
        </span>
      </div>

      {phase === 'intro' ? (
        <DialogueBox
          lines={CHAPTER1_INTRO}
          doneLabel="开始探索"
          onDone={() => setPhase('hub')}
        />
      ) : (
        <>
          <div className="spot-grid">
            {HUB_SPOTS.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className={`spot-card${
                  spot.collectible && hasCollectible(spot.collectible) ? ' spot-card--done' : ''
                }${
                  (spot.id === 'rhythm' && progress.rhythmCleared) ||
                  (spot.id === 'vault' && progress.match3Cleared)
                    ? ' spot-card--done'
                    : ''
                }`}
                onClick={() => {
                  resumeAudio()
                  if (spot.id === 'rhythm') {
                    setScreen('rhythm')
                    return
                  }
                  if (spot.id === 'vault') {
                    setScreen('match3')
                    return
                  }
                  if (spot.collectible) pickup(spot.collectible)
                }}
              >
                <strong>{spot.title}</strong>
                <span>{spot.desc}</span>
              </button>
            ))}
          </div>

          <div className="hub-actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={tryFinish}
              disabled={!bothClear}
            >
              {bothClear ? '完成祭典 · 通关第一章' : '完成两场试炼后可通关'}
            </button>
          </div>
        </>
      )}

      {toast && (
        <div className="toast" role="status">
          <p>{toast}</p>
          <button type="button" className="btn btn--ghost" onClick={() => setToast(null)}>
            好
          </button>
        </div>
      )}

      <CollectiblesModal open={bagOpen} onClose={() => setBagOpen(false)} />
    </section>
  )
}
