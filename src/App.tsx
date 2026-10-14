import { GameProvider, useGame } from './game/store'
import { TitleScreen } from './screens/TitleScreen'
import { IntroScreen } from './screens/IntroScreen'
import { DreamMap } from './screens/DreamMap'
import { Chapter1Hub } from './screens/Chapter1Hub'
import { RhythmGame } from './screens/RhythmGame'
import { Match3Game } from './screens/Match3Game'
import { ClearScreen } from './screens/ClearScreen'

function Router() {
  const { screen } = useGame()
  switch (screen) {
    case 'title':
      return <TitleScreen />
    case 'intro':
      return <IntroScreen />
    case 'map':
      return <DreamMap />
    case 'chapter1':
      return <Chapter1Hub />
    case 'rhythm':
      return <RhythmGame />
    case 'match3':
      return <Match3Game />
    case 'clear':
      return <ClearScreen />
    default:
      return <TitleScreen />
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app-shell">
        <Router />
      </div>
    </GameProvider>
  )
}
