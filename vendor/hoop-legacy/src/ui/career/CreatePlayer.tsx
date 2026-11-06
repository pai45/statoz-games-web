import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, PersonStanding, RotateCw, ScanFace, Shuffle } from 'lucide-react'
import { ARCHETYPES, BADGES, attrCap, getArchetype, heightToStr, overall } from '../../data/attributes'
import { HAIR_COLORS, SKIN_TONES, FIRST_NAMES, LAST_NAMES } from '../../data/names'
import { newCareer, type CreateDraft } from '../../data/career'
import { DIFFICULTY_LABEL } from '../../game/sim/shooting'
import { getEngine } from '../../game/engine/runtime'
import { Showcase } from '../../game/sim/Showcase'
import type { Appearance, AttrKey, Difficulty, FacialHair, HairStyle, PlayerProfile, Position } from '../../game/types'
import { commitCareer, go, store, useStore } from '../../state/store'
import { Button, cx, OvrBadge, Panel, RatingBar, ScreenHeader, Segmented, sfx } from '../kit'

const POS_HEIGHT: Record<Position, [number, number]> = { PG: [180, 196], SG: [186, 201], SF: [194, 206], PF: [199, 211], C: [204, 221] }
const HAIRS: { id: HairStyle; label: string }[] = [
  { id: 'fade', label: 'Fade' },
  { id: 'buzz', label: 'Buzz' },
  { id: 'waves', label: 'Waves' },
  { id: 'twists', label: 'Twists' },
  { id: 'afro', label: 'Afro' },
  { id: 'hightop', label: 'High Top' },
  { id: 'braids', label: 'Cornrows' },
  { id: 'locs', label: 'Locs' },
  { id: 'bun', label: 'Man Bun' },
  { id: 'bald', label: 'Bald' },
]
export const FACIAL_HAIR: { id: FacialHair; label: string }[] = [
  { id: 'clean', label: 'Clean' },
  { id: 'stubble', label: 'Stubble' },
  { id: 'goatee', label: 'Goatee' },
  { id: 'beard', label: 'Beard' },
  { id: 'full', label: 'Full Beard' },
]
export function facialHairOf(a: Appearance): FacialHair {
  return a.facialHair ?? (a.beard ? 'beard' : 'clean')
}
export function facialHairPatch(v: FacialHair): Partial<Appearance> {
  return { facialHair: v, beard: v === 'goatee' || v === 'beard' || v === 'full' }
}
const STEPS = ['Identity', 'Archetype', 'Body', 'Look', 'Confirm'] as const
export const STREET_JERSEY = { base: '#ff5b14', trim: '#14161c', number: '#ffffff', shorts: '#14161c' }

function previewProfile(d: CreateDraft): PlayerProfile {
  const arch = getArchetype(d.archetype)
  const attributes = { ...arch.base }
  for (const k of Object.keys(attributes) as AttrKey[]) attributes[k] = Math.min(attrCap(arch, k, d.heightCm), attributes[k])
  return {
    id: 'preview',
    firstName: d.firstName || 'Your',
    lastName: d.lastName || 'Name',
    number: d.number,
    position: d.position,
    heightCm: d.heightCm,
    attributes,
    badges: { [arch.signatureBadge]: 1 },
    appearance: d.appearance,
    archetype: arch.id,
  }
}

export function CreatePlayer({ slot }: { slot: number }) {
  const settings = useStore((s) => s.settings)
  const [step, setStep] = useState(0)
  const [d, setD] = useState<CreateDraft>(() => ({
    firstName: '',
    lastName: '',
    number: 7,
    position: 'SG',
    archetype: 'sharpshooter',
    heightCm: 196,
    difficulty: settings.difficulty,
    appearance: {
      skin: SKIN_TONES[4],
      hair: 'fade',
      hairColor: HAIR_COLORS[0],
      beard: false,
      headband: null,
      armSleeve: null,
      legSleeve: null,
      wristbands: null,
      shoeColor: '#f2f2f2',
      shoeAccent: '#111318',
      sockColor: '#f5f5f5',
    },
  }))
  const set = (p: Partial<CreateDraft>) => setD((x) => ({ ...x, ...p }))
  const look = (p: Partial<Appearance>) => setD((x) => ({ ...x, appearance: { ...x.appearance, ...p } }))
  const profile = useMemo(() => previewProfile(d), [d])
  const arch = getArchetype(d.archetype)
  const archOptions = ARCHETYPES.filter((a) => a.positions.includes(d.position))

  useEffect(() => {
    store.set({ preview: { profile, jersey: STREET_JERSEY } })
  }, [profile])
  useEffect(() => () => store.set({ preview: null }), [])

  useEffect(() => {
    if (!arch.positions.includes(d.position)) set({ archetype: archOptions[0].id })
    const [lo, hi] = POS_HEIGHT[d.position]
    if (d.heightCm < lo || d.heightCm > hi) set({ heightCm: Math.round((lo + hi) / 2) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.position])

  // camera: frame the face while styling the look, the full body otherwise
  const [closeUp, setCloseUp] = useState(false)
  useEffect(() => setCloseUp(step === 3), [step])
  useEffect(() => {
    const m = getEngine()?.mode
    if (m instanceof Showcase) m.setFocus(closeUp ? 'face' : 'body')
  }, [closeUp, profile])
  useEffect(
    () => () => {
      const m = getEngine()?.mode
      if (m instanceof Showcase) m.setFocus('body')
    },
    [],
  )
  const camToggle = (
    <button
      onClick={() => {
        sfx()
        setCloseUp((v) => !v)
      }}
      className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-black/60"
      aria-label={closeUp ? 'Show full body' : 'Show face close-up'}
    >
      {closeUp ? <PersonStanding className="size-3.5" /> : <ScanFace className="size-3.5" />}
      {closeUp ? 'Body' : 'Face'}
    </button>
  )

  // drag to rotate the turntable
  const drag = useRef<{ x: number; id: number } | null>(null)
  const rotate = (dx: number) => {
    const m = getEngine()?.mode
    if (m instanceof Showcase) m.yaw += dx
  }

  const canNext = step !== 0 || (d.firstName.trim().length > 0 && d.lastName.trim().length > 0)
  const finish = () => {
    const save = newCareer(slot, d)
    commitCareer(save)
    sfx('levelUp')
    go({ id: 'career', tab: 'home' })
  }
  const randomName = () => {
    set({ firstName: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)], lastName: LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)] })
  }

  return (
    <div className="absolute inset-0 z-10 flex">
      <div className="flex w-full min-w-0 flex-col bg-gradient-to-r from-ink-950/96 via-ink-950/88 to-ink-950/40 md:w-[min(560px,58vw)] max-md:mt-[38dvh] max-md:rounded-t-3xl max-md:bg-ink-950/94">
        <ScreenHeader title="Create Player" kicker={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`} onBack={() => (step === 0 ? go({ id: 'careerSlots' }) : setStep(step - 1))} right={<OvrBadge value={overall(profile.attributes, profile.position)} size="sm" />} />
        <div className="safe-pad flex gap-1 px-4 sm:px-6">
          {STEPS.map((s, i) => (
            <div key={s} className={cx('h-1 flex-1 rounded-full transition', i <= step ? 'bg-blaze' : 'bg-white/12')} />
          ))}
        </div>
        <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {step === 0 && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <TextField label="First name" value={d.firstName} onChange={(v) => set({ firstName: v })} />
                <TextField label="Last name" value={d.lastName} onChange={(v) => set({ lastName: v })} />
              </div>
              <Button size="sm" variant="ghost" icon={<Shuffle className="size-4" />} onClick={randomName} className="self-start">
                Random name
              </Button>
              <Panel title="Jersey number">
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={() => set({ number: (d.number + 99) % 100 })}>
                    −
                  </Button>
                  <div className="w-16 text-center font-display text-4xl font-black italic tabular-nums">{d.number}</div>
                  <Button size="sm" onClick={() => set({ number: (d.number + 1) % 100 })}>
                    +
                  </Button>
                </div>
              </Panel>
              <Panel title="Position">
                <Segmented className="w-full" options={(['PG', 'SG', 'SF', 'PF', 'C'] as Position[]).map((p) => ({ value: p, label: p }))} value={d.position} onChange={(p) => set({ position: p })} />
              </Panel>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-2.5">
              {archOptions.map((a) => {
                const top = (Object.keys(a.base) as AttrKey[]).sort((x, y) => a.base[y] - a.base[x]).slice(0, 4)
                const badge = BADGES.find((b) => b.id === a.signatureBadge)!
                const active = a.id === d.archetype
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      sfx()
                      set({ archetype: a.id })
                    }}
                    className={cx('rounded-2xl border p-3.5 text-left transition', active ? 'border-blaze bg-blaze/12' : 'border-white/10 bg-white/[0.04] hover:border-white/30')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-display text-xl font-black uppercase italic">{a.name}</div>
                      {active && <Check className="size-5 text-blaze" />}
                    </div>
                    <div className="text-sm text-white/60">{a.tagline}</div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      {top.map((k) => (
                        <RatingBar key={k} label={k === 'perimD' ? 'DEF' : k.toUpperCase()} value={a.base[k]} cap={a.caps[k]} compact />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gold">Signature badge: {badge.name}</div>
                  </button>
                )
              })}
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              <Panel title="Height">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-5xl font-black italic">{heightToStr(d.heightCm)}</div>
                  <div className="text-sm text-white/50">{d.heightCm} cm</div>
                </div>
                <input type="range" min={POS_HEIGHT[d.position][0]} max={POS_HEIGHT[d.position][1]} value={d.heightCm} onChange={(e) => set({ heightCm: Number(e.target.value) })} className="mt-3 w-full accent-[#ff5b14]" />
                <p className="mt-2 text-sm text-white/55">Taller players raise their rebounding, blocking and dunking caps but give up speed and handles.</p>
              </Panel>
              <Panel title="Potential (attribute caps)">
                <div className="flex flex-col gap-1.5">
                  {(['three', 'handles', 'speed', 'dunk', 'rebound', 'block'] as AttrKey[]).map((k) => (
                    <RatingBar key={k} label={k === 'three' ? '3PT' : k.toUpperCase()} value={attrCap(arch, k, d.heightCm)} compact />
                  ))}
                </div>
              </Panel>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <Panel title="Skin tone">
                <Swatches colors={SKIN_TONES} value={d.appearance.skin} onChange={(c) => look({ skin: c })} />
              </Panel>
              <Panel title="Hair">
                <ChipGroup options={HAIRS} value={d.appearance.hair} onChange={(v) => look({ hair: v })} />
                <div className="mt-3">
                  <Swatches colors={HAIR_COLORS} value={d.appearance.hairColor} onChange={(c) => look({ hairColor: c })} />
                </div>
              </Panel>
              <Panel title="Facial hair">
                <ChipGroup options={FACIAL_HAIR} value={facialHairOf(d.appearance)} onChange={(v) => look(facialHairPatch(v))} />
              </Panel>
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col gap-3">
              <Panel>
                <div className="flex items-center gap-3">
                  <OvrBadge value={overall(profile.attributes, profile.position)} size="lg" />
                  <div>
                    <div className="font-display text-3xl font-black uppercase italic leading-none">
                      {d.firstName} {d.lastName}
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                      #{d.number} · {d.position} · {arch.name} · {heightToStr(d.heightCm)}
                    </div>
                  </div>
                </div>
              </Panel>
              <Panel title="Difficulty">
                <Segmented className="w-full" options={(['rookie', 'pro', 'allstar', 'superstar', 'hof'] as Difficulty[]).map((x) => ({ value: x, label: DIFFICULTY_LABEL[x].replace('Hall of Fame', 'HOF') }))} value={d.difficulty} onChange={(x) => set({ difficulty: x })} />
                <p className="mt-2 text-xs text-white/50">Higher difficulty: smarter AI, tighter green window, more XP per game.</p>
              </Panel>
              <Panel title="Your journey">
                <ol className="flex flex-col gap-1.5 text-sm text-white/70">
                  <li>1 · The Blacktop — take down five park legends 1v1</li>
                  <li>2 · City Circuit — recruit a crew, win the 3v3 tournament</li>
                  <li>3 · The Combine — shooting test and prospect showdown</li>
                  <li>4 · Draft Night & the Pro Hoops League — seasons, All-Star Weekend, playoffs, the Hall of Fame</li>
                </ol>
              </Panel>
            </div>
          )}
        </div>
        <div className="safe-pad flex shrink-0 items-center justify-between gap-2 border-t border-white/8 px-4 py-3 sm:px-6">
          <Button variant="ghost" icon={<ArrowLeft className="size-4" />} onClick={() => (step === 0 ? go({ id: 'careerSlots' }) : setStep(step - 1))}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" icon={<ArrowRight className="size-4" />} disabled={!canNext} onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="primary" size="lg" icon={<Check className="size-5" />} sound="confirm" onClick={finish}>
              Start Career
            </Button>
          )}
        </div>
      </div>
      <div
        className="relative hidden flex-1 touch-none md:block"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, id: e.pointerId }
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drag.current || drag.current.id !== e.pointerId) return
          rotate((e.clientX - drag.current.x) * 0.012)
          drag.current.x = e.clientX
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/60 backdrop-blur">
            <RotateCw className="size-3.5" /> Drag to rotate
          </div>
          {camToggle}
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-0 h-[38dvh] touch-none md:hidden"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, id: e.pointerId }
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drag.current || drag.current.id !== e.pointerId) return
          rotate((e.clientX - drag.current.x) * 0.012)
          drag.current.x = e.clientX
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <div className="pointer-events-none absolute bottom-3 right-3">{camToggle}</div>
      </div>
    </div>
  )
}

export function ChipGroup<T extends string>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => {
            sfx()
            onChange(o.id)
          }}
          className={cx('rounded-lg px-3 py-1.5 font-display text-sm font-bold uppercase transition', value === o.id ? 'bg-white text-ink-950' : 'bg-white/8 text-white/75 hover:bg-white/15')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">{label}</span>
      <input
        value={value}
        maxLength={14}
        onChange={(e) => onChange(e.target.value.replace(/[^\p{L}\p{N}' .-]/gu, ''))}
        className="h-11 rounded-xl border border-white/12 bg-white/6 px-3 font-display text-lg font-bold uppercase tracking-wide text-white outline-none placeholder:text-white/30 focus:border-blaze"
        placeholder={label}
      />
    </label>
  )
}

export function Swatches({ colors, value, onChange }: { colors: string[]; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          aria-label={c}
          onClick={() => {
            sfx()
            onChange(c)
          }}
          className={cx('size-9 rounded-full border-2 transition', value === c ? 'scale-110 border-white' : 'border-transparent hover:scale-105')}
          style={{ background: c }}
        />
      ))}
    </div>
  )
}
