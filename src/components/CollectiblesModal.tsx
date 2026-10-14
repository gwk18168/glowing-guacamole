import { COLLECTIBLES } from '../game/data'
import { useGame } from '../game/store'

interface Props {
  open: boolean
  onClose: () => void
}

export function CollectiblesModal({ open, onClose }: Props) {
  const { hasCollectible, progress } = useGame()
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="收集物"
      >
        <header className="modal__head">
          <h2>草原传说文物</h2>
          <p>
            已收集 {progress.collectibles.length} / {COLLECTIBLES.length}
          </p>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            关闭
          </button>
        </header>
        <ul className="collect-list">
          {COLLECTIBLES.map((c) => {
            const got = hasCollectible(c.id)
            return (
              <li key={c.id} className={got ? 'got' : 'locked'}>
                <strong>{got ? c.name : '？？？'}</strong>
                <span>{got ? c.detail : `线索：${c.hint}`}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
