import { CHAPTER_CLEAR_DIALOGUE } from '../game/data'
import { DialogueBox } from '../components/DialogueBox'
import { useGame } from '../game/store'

export function ClearScreen() {
  const { setScreen, progress } = useGame()

  return (
    <section className="screen clear-screen">
      <div className="clear-screen__banner">
        <p className="eyebrow">第一章通关</p>
        <h1>哈索尔的门缓缓合上</h1>
        <p>
          已收集文物 {progress.collectibles.length}/7 · 后续梦境仍为占位，敬请期待蜀月行歌。
        </p>
      </div>
      <DialogueBox
        lines={CHAPTER_CLEAR_DIALOGUE}
        doneLabel="回到梦境星图"
        onDone={() => setScreen('map')}
      />
    </section>
  )
}
