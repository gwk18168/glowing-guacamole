let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function resumeAudio() {
  const c = getCtx()
  if (c.state === 'suspended') void c.resume()
}

/** Short procedural blip — no copyrighted music. */
export function playTone(
  freq: number,
  duration = 0.12,
  type: OscillatorType = 'triangle',
  gain = 0.08,
) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.value = gain
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(g)
    g.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
  } catch {
    /* audio optional */
  }
}

export function playHit(lane: number) {
  const freqs = [392, 440, 523, 659]
  playTone(freqs[lane] ?? 440, 0.1, 'sine', 0.1)
}

export function playMiss() {
  playTone(120, 0.15, 'sawtooth', 0.04)
}

export function playMatch() {
  playTone(660, 0.08, 'square', 0.05)
  setTimeout(() => playTone(880, 0.1, 'square', 0.05), 60)
}

export function playClear() {
  ;[523, 659, 784, 1046].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.18, 'triangle', 0.09), i * 90)
  })
}
