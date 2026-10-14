import { useState } from 'react'
import { CHAPTERS } from '../game/data'
import { CollectiblesModal } from '../components/CollectiblesModal'
import { useGame } from '../game/store'
import { playTone, resumeAudio } from '../game/audio'

export function DreamMap() {
  const { setScreen, progress } = useGame()
  const [bagOpen, setBagOpen] = useState(false)

  return (
    <section className="screen map-screen">
      <header className="topbar">
        <button type="button" className="btn btn--ghost" onClick={() => setScreen('title')}>
          标题
        </button>
        <h1>梦境星图</h1>
        <button type="button" className="btn btn--ghost" onClick={() => setBagOpen(true)}>
          文物 {progress.collectibles.length}/7
        </button>
      </header>

      <p className="map-lead">
        现实侧草原的约定已落成流星。点亮首站哈索尔，其余梦境仍在沉睡。
      </p>

      <div className="dream-map">
        {CHAPTERS.map((ch, i) => {
          const playable = ch.status === 'playable'
          const cleared = playable && progress.chapter1Cleared
          return (
            <button
              key={ch.id}
              type="button"
              className={`dream-node dream-node--${ch.status}${cleared ? ' dream-node--cleared' : ''}`}
              style={{ ['--i' as string]: i }}
              disabled={!playable}
              onClick={() => {
                if (!playable) return
                resumeAudio()
                playTone(523, 0.1)
                setScreen('chapter1')
              }}
            >
              <span className="dream-node__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="dream-node__title">{ch.title}</span>
              <span className="dream-node__sub">{ch.subtitle}</span>
              <span className="dream-node__blurb">{ch.blurb}</span>
              <span className="dream-node__badge">
                {playable
                  ? cleared
                    ? '已通关 · 可重玩'
                    : '可进入'
                  : ch.status === 'finale'
                    ? '终章占位'
                    : '未解锁'}
              </span>
            </button>
          )
        })}
      </div>

      <CollectiblesModal open={bagOpen} onClose={() => setBagOpen(false)} />
    </section>
  )
}
