import { INTRO_DIALOGUE } from '../game/data'
import { DialogueBox } from '../components/DialogueBox'
import { useGame } from '../game/store'

export function IntroScreen() {
  const { setScreen, markIntroSeen } = useGame()

  return (
    <section className="screen intro-screen">
      <div className="intro-screen__art" aria-hidden>
        <div className="prairie" />
        <div className="meteor" />
      </div>
      <DialogueBox
        lines={INTRO_DIALOGUE}
        doneLabel="打开梦境地图"
        onDone={() => {
          markIntroSeen()
          setScreen('map')
        }}
      />
    </section>
  )
}
