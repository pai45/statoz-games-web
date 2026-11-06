import type { AudioEngine } from './audio'

/**
 * Broadcast booth: a play-by-play voice, a color analyst and the arena PA announcer.
 *
 * Lines are spoken with the Web Speech API (no audio files) and always published as captions, so a browser
 * without voices still gets the broadcast. Calls carry a priority: a slam or the final buzzer cuts in, routine
 * plays wait their turn and expire if the moment has passed, and a global cooldown keeps the booth from
 * talking over every possession. The crowd and music duck while anyone speaks.
 */

export type Speaker = 'pbp' | 'color' | 'pa'

export interface Caption {
  id: number
  speaker: Speaker
  text: string
}

interface Line {
  speaker: Speaker
  text: string
  priority: number
  /** performance.now() after which the line is stale and dropped */
  expires: number
  excited: number
  /** spoken right after this one (the analyst's follow-up) */
  then?: Line
}

export type Vars = Record<string, string | number | undefined>

const fill = (t: string, v: Vars) => t.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ''))
const pickLine = (xs: string[]) => xs[Math.floor(Math.random() * xs.length)]

/** Line banks; {name} placeholders are filled from the call's vars. */
export const LINES = {
  tipoff: ['Welcome in, everybody. {home} hosting {away} tonight.', "It's {home} and {away}. Let's get it on.", '{away} visiting {home}. This one should be fun.'],
  tipoffColor: ['Both teams come in confident. Execution wins this one.', 'Watch the pace early. Whoever controls it, controls the game.', 'I want to see who wants it more on the glass tonight.'],
  three: ['{last} from downtown!', '{last} for three... got it!', 'Bang! {last} knocks down the three.', 'From way out there... {last}, count it!', 'Splash! {last} with the triple.'],
  greenThree: ['Nothing but net! Perfect release from {last}.', "{last} from deep... wet! That one never had a doubt.", 'Cash! {last} lets it fly and it is pure.'],
  stepbackThree: ['Step-back three... {last}, are you kidding me!', '{last} creates the space... and buries it!', 'Step back, splash! {last} is cold-blooded.'],
  jumper: ['{last} pulls up... good.', '{last} knocks down the jumper.', 'Mid-range, {last}, nothing but net.', '{last} rises and hits.'],
  layup: ['{last} lays it in.', 'Easy two for {last}.', '{last} finishes at the rim.', '{last} gets to the cup.'],
  euro: ['Euro step, and {last} lays it in! Beautiful footwork.', '{last} with the euro... and the finish!'],
  dunk: ['{last} throws it down!', 'Oh, what a slam by {last}!', '{last}, with authority!', 'Hammer dunk! {last}!', '{last} rocks the rim!'],
  poster: ['{last} just put {victim} on a poster!', 'Oh my! {last} dunks all over {victim}!', 'Get the cameras! {last} posterizes {victim}!'],
  alleyOop: ['Lob... slam! {passer} to {last}, alley-oop!', '{passer} throws it up, {last} throws it down!', 'Alley-oop! {passer} finds {last} in the air!'],
  putback: ['Putback slam by {last}!', '{last} cleans it up with authority!', 'Off the miss... {last} hammers it home!'],
  andOne: ['And one! {last} scores through the contact!', 'Bucket, and the foul! {last} has a chance for the old-fashioned three-point play.', 'Got it, and the whistle! And one for {last}!'],
  block: ['Rejected by {last}!', 'Get that outta here! {last} with the block!', '{last} swats it away!', 'Denied! {last} at the rim!'],
  steal: ['Picked off by {last}!', '{last} with the steal!', 'Stripped! {last} takes it away.', '{last} jumps the lane!'],
  ankles: ['Oh! {last} broke his ankles!', '{victim} hits the floor! {last} with the crossover!', 'Somebody help {victim} up! {last} with the shake!'],
  shook: ['{last} with the shake.', 'Nice move by {last}, creates a little space.'],
  airball: ['Airball from {last}.', 'Way off the mark from {last}.'],
  foul: ['Whistle. Foul on {last}.', 'And there is a foul called on {last}.', '{last} gets caught reaching.'],
  shootingFoul: ['{last} was fouled on the shot. {n} free throws.', 'Foul on the shot! {last} will go to the line for {n}.'],
  ftMake: ['{last} knocks down the free throw.', 'Good from the line.', '{last} makes it.'],
  ftMiss: ['Rattles out.', '{last} misses the free throw.', 'Front rim, no good.'],
  heatingUp: ['{last} is heating up!', 'Look out, {last} is starting to feel it.'],
  onFire: ['{last} is on fire!', '{last} cannot miss right now!', 'Somebody call the fire department, {last} is on fire!'],
  cooled: ['{last} has cooled off.', 'The fire is out for {last}.'],
  leadChange: ['And that gives {team} the lead!', '{team} back on top.', 'Lead change! {team} in front.'],
  tie: ["We're all tied up at {score}!", 'Tie ballgame, {score} apiece.'],
  run: ["That's a {run} to nothing run for {team}.", '{team} on a {run} to nothing run, and the building is rocking.'],
  gamePoint: ['{team} one bucket away from the win.', 'Game point, {team}.'],
  clutch: ['Under thirty seconds to go, {score}.', 'Crunch time. Under thirty seconds left.'],
  overtime: ["We're going to overtime! Next basket wins.", 'Free basketball, folks! Next bucket takes it.'],
  shotClock: ['Shot clock violation.', 'And they could not get a shot off in time.'],
  outOfBounds: ['Out of bounds.', 'Lost it out of bounds.'],
  final: ["And that's the ballgame! {team} win it, {score}.", 'Final buzzer! {team} take it, {score}.', 'It is over! {team} win, {score}.'],
  finalColor: ['{star} led the way with {pts} points. What a performance.', 'Hats off to {star}, {pts} points tonight.', '{star} was the difference, {pts} points.'],
  // analyst follow-ups by play type
  colorDunk: ["You can't teach that kind of athleticism.", "That's going on the highlight reel.", 'He was looking for that from the moment he caught it.'],
  colorThree: ["That's why you can't leave him open.", 'Quick release, great balance. That is money.', 'When he gets that much space, it is automatic.'],
  colorBlock: ['Great timing. He waited for the shooter to commit.', 'Rim protection like that changes the whole game.'],
  colorSteal: ['Quick hands. He read that all the way.', 'You cannot be careless with the ball against him.'],
  colorAnkles: ["That's just disrespectful.", 'He had him leaning the wrong way. Textbook.'],
  colorFire: ['When he gets going like this, you just have to get the ball out of his hands.', 'Every shot looks like it is going in right now.'],
  colorRun: ['They need a stop here. Somebody has to step up.', 'Momentum is a real thing, and they have all of it.'],
  colorAlley: ['What a read! The timing on that has to be perfect.', 'That is chemistry. They practice that every day.'],
  // PA announcer for the starting lineups
  paIntro: ['Ladies and gentlemen... here are your starting lineups!'],
  paPlayer: ['At {pos}, number {num}... {first} {last}!', 'Number {num}, {pos}... {first} {last}!'],
} satisfies Record<string, string[]>

export type LineKey = keyof typeof LINES

const POSITION_WORD: Record<string, string> = { PG: 'guard', SG: 'guard', SF: 'forward', PF: 'forward', C: 'center' }
export const positionWord = (p: string) => POSITION_WORD[p] ?? 'forward'

/** Preferred voices by name fragment (natural / neural voices first), per speaker. */
const PREFS: Record<Speaker, string[]> = {
  pbp: ['Guy Online (Natural)', 'Christopher Online (Natural)', 'Eric Online (Natural)', 'Google US English', 'Aaron', 'Alex', 'Microsoft David', 'Daniel'],
  color: ['Davis Online (Natural)', 'Roger Online (Natural)', 'Ryan Online (Natural)', 'Google UK English Male', 'Daniel', 'Arthur', 'Microsoft Mark', 'Fred'],
  pa: ['Andrew Online (Natural)', 'Brian Online (Natural)', 'Guy Online (Natural)', 'Google US English', 'Alex', 'Aaron', 'Microsoft David'],
}

export class Commentary {
  volume = 0.85
  captions = true
  private audio: AudioEngine
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
  private voices: Partial<Record<Speaker, SpeechSynthesisVoice | null>> = {}
  private current: Line | null = null
  private queue: Line[] = []
  private lastEnd = 0
  private lastByKey = new Map<string, number>()
  private recent: string[] = []
  private live = new Set<SpeechSynthesisUtterance>()
  private captionId = 1
  private captionTimer: number | null = null
  private listeners = new Set<(c: Caption | null) => void>()
  /** Fallback timer when a browser never fires `end` (or has no voices). */
  private watchdog: number | null = null

  constructor(audio: AudioEngine) {
    this.audio = audio
    this.synth?.addEventListener?.('voiceschanged', () => (this.voices = {}))
  }

  get enabled() {
    return this.volume > 0.01
  }

  /** iOS and some desktop browsers only allow speech after a user gesture: prime it on the first tap. */
  unlock() {
    if (!this.synth) return
    try {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      this.synth.speak(u)
    } catch {
      /* speech unavailable */
    }
  }

  onCaption(cb: (c: Caption | null) => void) {
    this.listeners.add(cb)
    return () => {
      this.listeners.delete(cb)
    }
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (!this.enabled) this.stop()
  }

  /**
   * Queues a call. `key` picks the line bank; `priority` 1 (routine) to 3 (cuts in); `follow` adds the analyst's
   * take with the given chance. Returns true when the call was accepted.
   */
  call(key: LineKey, vars: Vars = {}, opts: { priority?: number; follow?: LineKey; followChance?: number; excited?: number; speaker?: Speaker; ttl?: number } = {}) {
    if (!this.enabled) return false
    const now = performance.now()
    const priority = opts.priority ?? 1
    // the same kind of call needs a breather, so a streak of layups is not narrated identically
    const since = now - (this.lastByKey.get(key) ?? -1e9)
    if (priority < 3 && since < 6000) return false
    if (priority === 1 && (this.current || now - this.lastEnd < 1800)) return false
    const text = this.compose(key, vars)
    const line: Line = { speaker: opts.speaker ?? 'pbp', text, priority, expires: now + (opts.ttl ?? 2600), excited: opts.excited ?? (priority >= 3 ? 1 : priority === 2 ? 0.5 : 0) }
    if (opts.follow && Math.random() < (opts.followChance ?? 0.45)) line.then = { speaker: 'color', text: this.compose(opts.follow, vars), priority: 1, expires: now + 9000, excited: 0 }
    this.lastByKey.set(key, now)
    if (this.current && priority > this.current.priority) {
      // a bigger moment cuts in
      this.queue.length = 0
      this.cancelSpeech()
      this.speak(line)
    } else if (this.current) {
      this.queue = this.queue.filter((l) => l.priority >= priority)
      if (this.queue.length < 2) this.queue.push(line)
    } else this.speak(line)
    return true
  }

  /** Lines spoken in order regardless of cooldowns (lineup introductions). */
  sequence(lines: { key: LineKey; vars?: Vars; speaker?: Speaker }[]) {
    if (!this.enabled) return
    this.stop()
    const now = performance.now()
    for (const l of lines) this.queue.push({ speaker: l.speaker ?? 'pa', text: this.compose(l.key, l.vars ?? {}), priority: 2, expires: now + 30000, excited: 0.3 })
    const first = this.queue.shift()
    if (first) this.speak(first)
  }

  /** Silences the booth (pause, quitting a game). */
  stop() {
    this.queue.length = 0
    this.cancelSpeech()
    this.publish(null)
  }

  private compose(key: LineKey, vars: Vars) {
    const bank = LINES[key]
    // avoid repeating one of the last few lines verbatim
    let raw = pickLine(bank)
    for (let i = 0; i < 4 && this.recent.includes(raw) && bank.length > 1; i++) raw = pickLine(bank)
    this.recent.push(raw)
    if (this.recent.length > 12) this.recent.shift()
    return fill(raw, vars).replace(/\s+/g, ' ').trim()
  }

  private voiceFor(s: Speaker): SpeechSynthesisVoice | null {
    if (this.voices[s] !== undefined) return this.voices[s] ?? null
    const all = (this.synth?.getVoices() ?? []).filter((v) => v.lang?.toLowerCase().startsWith('en'))
    let found: SpeechSynthesisVoice | null = null
    for (const pref of PREFS[s]) {
      found = all.find((v) => v.name.includes(pref)) ?? null
      if (found) break
    }
    if (!found) found = all.find((v) => /en[-_]US/i.test(v.lang)) ?? all[0] ?? null
    // the analyst should sound like a different person when the browser offers one
    if (s === 'color' && found && found === this.voiceFor('pbp')) found = all.find((v) => v !== found && v.lang.toLowerCase().startsWith('en')) ?? found
    if (all.length) this.voices[s] = found
    return found
  }

  private speak(line: Line) {
    if (performance.now() > line.expires) {
      this.next()
      return
    }
    this.current = line
    this.publish({ id: this.captionId++, speaker: line.speaker, text: line.text })
    const done = () => this.finish(line)
    // the caption stays up for a reading-speed duration even if speech is unavailable
    const readMs = 900 + line.text.length * 55
    this.clearWatchdog()
    this.watchdog = window.setTimeout(done, readMs + 2500)
    const synth = this.synth
    const voice = synth ? this.voiceFor(line.speaker) : null
    if (!synth || !voice) {
      this.clearWatchdog()
      this.watchdog = window.setTimeout(done, readMs)
      return
    }
    try {
      const u = new SpeechSynthesisUtterance(line.text)
      u.voice = voice
      u.lang = voice.lang
      u.volume = this.volume
      const ex = line.excited
      if (line.speaker === 'pa') {
        u.rate = 0.86
        u.pitch = 0.78
      } else if (line.speaker === 'color') {
        u.rate = 1.0
        u.pitch = 0.92
      } else {
        u.rate = 1.04 + ex * 0.14
        u.pitch = 1.0 + ex * 0.12
      }
      u.onstart = () => this.audio.duck(line.speaker === 'pa' ? 0.6 : 1)
      u.onend = () => {
        this.live.delete(u)
        done()
      }
      u.onerror = () => {
        this.live.delete(u)
        done()
      }
      // keep a reference: Chrome drops callbacks of garbage-collected utterances
      this.live.add(u)
      synth.speak(u)
    } catch {
      this.clearWatchdog()
      this.watchdog = window.setTimeout(done, readMs)
    }
  }

  private finish(line: Line) {
    if (this.current !== line) return
    this.clearWatchdog()
    this.current = null
    this.lastEnd = performance.now()
    this.audio.duck(0)
    if (line.then) this.queue.unshift(line.then)
    this.next()
  }

  private next() {
    const now = performance.now()
    while (this.queue.length && now > this.queue[0].expires) this.queue.shift()
    const n = this.queue.shift()
    if (n) {
      this.speak(n)
      return
    }
    // let the last caption linger briefly, then clear it
    if (this.captionTimer !== null) window.clearTimeout(this.captionTimer)
    this.captionTimer = window.setTimeout(() => {
      if (!this.current) this.publish(null)
    }, 1400)
  }

  private cancelSpeech() {
    this.clearWatchdog()
    this.current = null
    this.live.clear()
    try {
      this.synth?.cancel()
    } catch {
      /* speech unavailable */
    }
    this.audio.duck(0)
  }

  private clearWatchdog() {
    if (this.watchdog !== null) window.clearTimeout(this.watchdog)
    this.watchdog = null
  }

  private publish(c: Caption | null) {
    if (c && this.captionTimer !== null) {
      window.clearTimeout(this.captionTimer)
      this.captionTimer = null
    }
    for (const l of this.listeners) l(this.captions || !c ? c : null)
  }
}
