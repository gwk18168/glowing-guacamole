import { useState } from 'react'
import { FAN_DISCLAIMER } from '../game/data'
import { resumeAudio, playTone } from '../game/audio'
import { useGame } from '../game/store'

export function TitleScreen() {
  const { setScreen, progress, resetProgress } = useGame()
  const [showDisclaimer, setShowDisclaimer] = useState(true)

  const start = () => {
    resumeAudio()
    playTone(440, 0.1)
    if (progress.seenIntro) setScreen('map')
    else setScreen('intro')
  }

  return (
    <section className="screen title-screen">
      <div className="title-screen__sky" aria-hidden />
      <div className="title-screen__sand" aria-hidden />
      <div className="title-screen__content">
        <p className="eyebrow">粉丝向 · 非官方</p>
        <h1 className="brand">MeUmy 梦游</h1>
        <p className="tagline">第一章 · 哈索尔</p>
        <p className="lead">
          电击小羊与光能雪狼坠入古埃及祭典。完成节奏与宝库试炼，点亮通往下一场梦的门。
        </p>
        <div className="cta-row">
          <button type="button" className="btn btn--primary btn--lg" onClick={start}>
            {progress.chapter1Cleared ? '再次入梦' : '进入大草原'}
          </button>
          {progress.seenIntro && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                if (confirm('确定清空本地进度？')) resetProgress()
              }}
            >
              重置进度
            </button>
          )}
        </div>
      </div>

      {showDisclaimer && (
        <div className="modal-backdrop">
          <div className="modal modal--narrow" role="alertdialog">
            <h2>关于本作</h2>
            <p>{FAN_DISCLAIMER}</p>
            <p className="muted">
              玩法为原创冒险解谜切片；对白与彩蛋致敬公开流传的粉丝文化梗，不涉及中之人隐私。
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowDisclaimer(false)}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
