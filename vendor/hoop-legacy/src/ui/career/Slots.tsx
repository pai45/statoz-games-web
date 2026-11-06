import { useState } from 'react'
import { Plus, Trash2, Play } from 'lucide-react'
import { careerOvr, chapterName, getProTeam } from '../../data/career'
import { deleteCareer } from '../../state/persistence'
import { go, store, useStore } from '../../state/store'
import { fullName } from '../../game/types'
import { Button, Emblem, Modal, OvrBadge, Pill, ScreenHeader, formatNum } from '../kit'

export function CareerSlots() {
  const slots = useStore((s) => s.slots)
  const [confirm, setConfirm] = useState<number | null>(null)
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-ink-950/30">
      <ScreenHeader title="My Career" kicker="Choose a save" onBack={() => go({ id: 'menu' })} />
      <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <div className="grid gap-3 md:max-w-[980px] md:grid-cols-3">
          {slots.map((s, i) =>
            s ? (
              <div key={i} className="glass flex animate-rise flex-col gap-3 rounded-2xl p-4" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-center justify-between">
                  <Pill tone="blaze">Slot {i + 1}</Pill>
                  <span className="text-[11px] text-white/40">{new Date(s.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <OvrBadge value={careerOvr(s)} />
                  <div className="min-w-0">
                    <div className="truncate font-display text-2xl font-black uppercase italic leading-none">{fullName(s.player)}</div>
                    <div className="mt-1 text-xs text-white/55">
                      {s.player.position} · Level {s.level} · {formatNum(s.followers)} fans
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                  {s.chapter === 'pro' && <Emblem team={getProTeam(s)} size={28} />}
                  <span className="font-display font-bold uppercase tracking-wide text-white/80">{chapterName(s.chapter)}</span>
                  {s.pro && <span className="ml-auto text-white/50">S{s.pro.season}</span>}
                </div>
                <div className="text-xs text-white/50">
                  Record {s.stats.career.w}-{s.stats.career.l} · {s.trophies.length} trophies · Legacy {s.legacy}
                </div>
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    icon={<Play className="size-4" />}
                    sound="confirm"
                    onClick={() => {
                      store.set({ career: s })
                      go({ id: 'career', tab: 'home' })
                    }}
                  >
                    Continue
                  </Button>
                  <Button variant="ghost" icon={<Trash2 className="size-4" />} onClick={() => setConfirm(i)}>
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ) : (
              <button
                key={i}
                onClick={() => go({ id: 'careerCreate', slot: i })}
                className="group flex min-h-[220px] animate-rise flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.03] p-6 text-center transition hover:border-blaze/60 hover:bg-blaze/5"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="grid size-14 place-items-center rounded-full bg-blaze/15 text-blaze transition group-hover:scale-110">
                  <Plus className="size-7" />
                </span>
                <span className="font-display text-xl font-black uppercase italic">New Career</span>
                <span className="max-w-[220px] text-xs text-white/50">Slot {i + 1} · Create your player and start on the blacktop</span>
              </button>
            ),
          )}
        </div>
      </div>
      <Modal open={confirm !== null} onClose={() => setConfirm(null)} title="Delete career?">
        <p className="text-sm text-white/65">This permanently removes the save in slot {confirm !== null ? confirm + 1 : ''}. This cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm === null) return
              deleteCareer(confirm)
              const slots2 = [...store.get().slots]
              slots2[confirm] = null
              const career = store.get().career
              store.set({ slots: slots2, career: career && career.slot === confirm ? null : career })
              setConfirm(null)
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
