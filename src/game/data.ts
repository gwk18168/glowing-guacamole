import type { ChapterNode, Collectible, DialogueLine } from './types'

export const FAN_DISCLAIMER =
  '本作为 MeUmy（咩栗 / 呜米）粉丝向同人冒险解谜，非官方作品。未使用任何官方曲目、立绘或 MV 素材。'

export const CHAPTERS: ChapterNode[] = [
  {
    id: 'ch1',
    title: '哈索尔',
    subtitle: '古埃及梦境',
    status: 'playable',
    blurb: '爱与音乐之神的祭典将启。电击小羊与光能雪狼，魂穿法老，踏上首站。',
  },
  {
    id: 'ch2',
    title: '蜀月行歌',
    subtitle: '巴蜀仙侠梦境',
    status: 'locked',
    blurb: '月下蜀道、仙侠气韵……尚在下一场梦里。',
  },
  {
    id: 'ch3',
    title: '创世烟火',
    subtitle: '都市万人舞台',
    status: 'locked',
    blurb: '灯海与烟火还未点亮。等哈索尔的神殿门打开再说。',
  },
  {
    id: 'ch4',
    title: '育空河',
    subtitle: '冰雪河畔 · 偏咩栗',
    status: 'locked',
    blurb: '极北的河水还结着冰。',
  },
  {
    id: 'ch5',
    title: '致你的骑士',
    subtitle: '异世界城堡 · 偏呜米',
    status: 'locked',
    blurb: '骑士的旗帜尚未升起。',
  },
  {
    id: 'finale',
    title: '大结局',
    subtitle: '找到彼此的城堡',
    status: 'finale',
    blurb: '咩栗跋山涉水，找到呜米所在的城堡——然后，她们终于生活在一起。',
  },
]

export const COLLECTIBLES: Collectible[] = [
  {
    id: 'kick-out',
    name: '「我被踢出群了！」石碑拓片',
    hint: '神殿侧廊石碑旁',
    detail:
      '古埃及管理员误把电击小羊踢出「法老群聊」。石碑上用圣书体刻着那句出圈呐喊——据说刷到过的路人都会忍不住复读。',
  },
  {
    id: 'kirakira',
    name: 'KiraKira 祭典徽章',
    hint: '节奏祭典通关奖励',
    detail:
      '哈索尔神殿的节奏祭典徽章。台上要 KiraKira，台下小棉花与小米星一起打 call。',
  },
  {
    id: 'lowbrow',
    name: '「靠低俗是走不远的」箴言莎草纸',
    hint: '市集货摊',
    detail:
      '旅人抄写的箴言。狼羊的舞台梦，不靠低俗，靠把歌一首一首做好。',
  },
  {
    id: 'together-push',
    name: '辩论结论木牌',
    hint: '神殿入口告示',
    detail:
      '「推咩栗还是推呜米？」祭司辩论三天三夜，最终刻下结论：应该两个人一起推。',
  },
  {
    id: 'wolf-fall',
    name: '「狼攻倒了」碎陶片',
    hint: '沙丘遗迹',
    detail:
      '二创考古队挖出的陶片。正面写「狼攻天下第一」，背面被人偷偷补了一句「倒了！」。',
  },
  {
    id: 'plate-steel',
    name: '钢板共鸣铃',
    hint: '三消宝库通关奖励',
    detail:
      '敲一下会发出清脆「钢板」声的共鸣铃。小羊硬核之时，铃声最响。',
  },
  {
    id: 'cotton-star',
    name: '小棉花 · 小米星双色灯',
    hint: '章节通关后自动点亮',
    detail:
      '祭典观众席的荧光棒：一边是小棉花的柔光，一边是小米星的寒芒。合在一起，就是 MeUmy 大草原的星空。',
  },
]

export const INTRO_DIALOGUE: DialogueLine[] = [
  {
    speaker: '旁白',
    text: '三年前的约定像一颗流星，落进 MeUmy 大草原。胆小鬼们长大了一点，梦却更远了。',
  },
  {
    speaker: '咩栗',
    text: '大家好，我是来自 MeUmy 大草原的电击小羊，咩栗！今晚……好像要做一场很长的梦。',
  },
  {
    speaker: '呜米',
    text: '我是来自 MeUmy 草原的光能雪狼，呜米。羊，抓住我的手。哈索尔在等我们。',
  },
  {
    speaker: '旁白',
    text: '爱与美、音乐与舞蹈之神哈索尔的祭典将启。两人以法老之身坠入古埃及——这是《梦游全世界》的首站。',
  },
]

export const CHAPTER1_INTRO: DialogueLine[] = [
  {
    speaker: '祭司',
    text: '欢迎，两位魂穿而来的法老。神殿需要节奏，宝库需要秩序。完成两场试炼，祭典才能圆满。',
  },
  {
    speaker: '咩栗',
    text: '节奏我熟！不过要是音太碎……咳，我会一句一句录到满意为止的。',
  },
  {
    speaker: '呜米',
    text: '我习惯一遍过。拆开录我会找不到感觉……总之，这回一起上。',
  },
  {
    speaker: '祭司',
    text: '对了，神殿里散落着「草原传说」文物。收集它们，或许能听到熟悉的笑声。',
  },
]

export const RHYTHM_INTRO: DialogueLine[] = [
  {
    speaker: '哈索尔之影',
    text: '音乐与舞蹈是我的领域。跟着节拍点亮四道圣光——台上，要 KiraKira。',
  },
  {
    speaker: '小棉花（观众席）',
    text: '咩栗加油——！',
  },
  {
    speaker: '小米星（观众席）',
    text: '呜米最帅——！不对，应该两个人一起推！',
  },
]

export const RHYTHM_CLEAR: DialogueLine[] = [
  {
    speaker: '哈索尔之影',
    text: '很好。你们的舞台，已经开始发光了。',
  },
  {
    speaker: '咩栗',
    text: '呼……差点被踢出节奏群。等等，那不是这个意思！',
  },
]

export const MATCH3_INTRO: DialogueLine[] = [
  {
    speaker: '宝库守卫',
    text: '三消宝石，对齐尼罗的秩序。乱码的圣物会堵住通往下一梦的门。',
  },
  {
    speaker: '呜米',
    text: '靠低俗是走不远的——靠乱点也是。看准再消。',
  },
]

export const MATCH3_CLEAR: DialogueLine[] = [
  {
    speaker: '宝库守卫',
    text: '宝库开启。钢板共鸣铃在震动……像是在夸你。',
  },
  {
    speaker: '咩栗',
    text: '嘿嘿，钢板也能当乐器嘛。',
  },
]

export const CHAPTER_CLEAR_DIALOGUE: DialogueLine[] = [
  {
    speaker: '旁白',
    text: '祭典的灯火顺着尼罗河漂向远方。哈索尔的门缓缓合上，下一场梦的轮廓隐约浮现。',
  },
  {
    speaker: '呜米',
    text: '蜀月、烟火、育空河、骑士城堡……还有更远的地方。',
  },
  {
    speaker: '咩栗',
    text: '没关系。我会跋山涉水，找到你所在的城堡。然后——我们一起生活。',
  },
  {
    speaker: '旁白',
    text: '第一章 · 哈索尔 通关。后续章节仍在沉睡，敬请期待。',
  },
]

export const HUB_SPOTS = [
  {
    id: 'notice',
    title: '神殿告示',
    desc: '「推谁？」辩论结论木牌',
    collectible: 'together-push' as const,
  },
  {
    id: 'stele',
    title: '侧廊石碑',
    desc: '刻着奇怪呐喊的拓片',
    collectible: 'kick-out' as const,
  },
  {
    id: 'market',
    title: '市集货摊',
    desc: '箴言莎草纸',
    collectible: 'lowbrow' as const,
  },
  {
    id: 'dune',
    title: '沙丘遗迹',
    desc: '碎陶片闪着狼耳纹样',
    collectible: 'wolf-fall' as const,
  },
  {
    id: 'rhythm',
    title: '节奏祭典',
    desc: '四轨节奏 · 音乐试炼',
    collectible: null,
  },
  {
    id: 'vault',
    title: '尼罗宝库',
    desc: '三消宝石 · 秩序试炼',
    collectible: null,
  },
]
