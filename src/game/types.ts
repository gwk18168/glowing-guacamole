export type Screen =
  | 'title'
  | 'intro'
  | 'map'
  | 'chapter1'
  | 'rhythm'
  | 'match3'
  | 'clear'

export type CollectibleId =
  | 'kick-out'
  | 'kirakira'
  | 'lowbrow'
  | 'together-push'
  | 'wolf-fall'
  | 'plate-steel'
  | 'cotton-star'

export interface Collectible {
  id: CollectibleId
  name: string
  hint: string
  detail: string
}

export interface DialogueLine {
  speaker: string
  text: string
}

export interface ChapterNode {
  id: string
  title: string
  subtitle: string
  status: 'playable' | 'locked' | 'finale'
  blurb: string
}

export interface GameProgress {
  rhythmCleared: boolean
  match3Cleared: boolean
  collectibles: CollectibleId[]
  chapter1Cleared: boolean
  seenIntro: boolean
}
