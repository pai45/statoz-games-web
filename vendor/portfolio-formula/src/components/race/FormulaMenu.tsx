import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, Flag, LockKeyhole, Settings2, Trophy } from "lucide-react"
import { caseStudies, getCaseStudy } from "@/data/caseStudies"
import { useStore } from "@/state/store"
import { useRaceStore } from "@/race/raceStore"
import { CIRCUITS, circuitOf, type CircuitId } from "@/race/circuits"
import { TIERS, standings } from "@/race/career"
import { formatLap } from "@/race/format"
import { readRecord } from "@/race/records"
import { getTrack, trackMapPath } from "@/three/race/track"

// Keep accept/back latched across screen transitions until the button is released.
let menuPadLast = ""

export function CircuitMap({ id }: { id: CircuitId }) {
  const map = trackMapPath(getTrack(id))
  return <svg className="fm-track-map" viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={`${circuitOf(id).name} layout`}>
    <path d={map.path} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={map.start.x} cy={map.start.y} r="7" fill="var(--fm-accent)" />
  </svg>
}

/** Menu navigation owns focus; race inputs remain inactive until a race starts. */
export function MenuNavigation({ children, screen }: { children: ReactNode; screen: string }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const controls = () => Array.from((useRaceStore.getState().settingsOpen ? document.querySelector('[aria-labelledby="race-settings-title"]') : root.current)?.querySelectorAll<HTMLElement>("button:not(:disabled),summary,select,a[href]") ?? [])
      .filter(el => el.getClientRects().length > 0)
    if (!root.current?.contains(document.activeElement)) controls()[0]?.focus({ preventScroll: true })
    let frame = 0, last = menuPadLast, nextRepeat = 0, disposed = false
    const move = (delta: number) => {
      const items = controls()
      const i = items.indexOf(document.activeElement as HTMLElement)
      items[(i + delta + items.length) % items.length]?.focus()
    }
    const back = () => {
      const s = useRaceStore.getState()
      if (s.settingsOpen) s.setSettingsOpen(false)
      else if (s.paused) s.setPaused(false)
      else if (s.phase !== "select") s.backToSelect()
      else if (s.menu !== "lobby") s.openMenu("lobby")
    }
    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented || useRaceStore.getState().settingsOpen || (e.target as HTMLElement)?.tagName === "SELECT") return
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault(); move(e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1)
      } else if (e.key === "Escape") { e.preventDefault(); back() }
    }
    const tick = (now: number) => {
      if (disposed) return
      const pad = navigator.getGamepads?.().find(p => p?.connected)
      const pressed = (i: number) => pad?.buttons[i]?.pressed ?? false
      const action = pressed(0) ? "accept" : pressed(1) ? "back" : pressed(13) || pressed(15) || (pad?.axes[1] ?? 0) > .6 || (pad?.axes[0] ?? 0) > .6 ? "next"
        : pressed(12) || pressed(14) || (pad?.axes[1] ?? 0) < -.6 || (pad?.axes[0] ?? 0) < -.6 ? "prev" : ""
      if (action && (action !== last || (now > nextRepeat && ["next", "prev"].includes(action)))) {
        const repeat = action === last
        menuPadLast = action
        if (action === "accept") (document.activeElement as HTMLElement)?.click()
        else if (action === "back") back()
        else move(action === "next" ? 1 : -1)
        nextRepeat = now + (repeat ? 180 : 450)
      }
      last = action; menuPadLast = action; if (!disposed) frame = requestAnimationFrame(tick)
    }
    window.addEventListener("keydown", key)
    frame = requestAnimationFrame(tick)
    return () => { disposed = true; window.removeEventListener("keydown", key); cancelAnimationFrame(frame) }
  }, [screen])
  return <div ref={root}>{children}</div>
}

export function FormulaMenu() {
  const s = useRaceStore()
  const ready = useStore(v => v.sceneReady)
  const [tab, setTab] = useState("calendar")
  const [browseCareer, setBrowseCareer] = useState(false)
  const [tier, setTier] = useState(s.career.unlockedTier)
  const activeSeason = s.career.active
  const selectedTier = activeSeason && activeSeason.results.length < 3 ? activeSeason.tier : tier
  const season = s.menu === "career" && activeSeason?.tier !== selectedTier ? null : activeSeason
  const live = season && season.results.length < 3
  const board = season ? standings(season) : []
  const rank = season ? board.findIndex(r => r.slug === season.slug) + 1 : null
  const title = s.menu === "lobby" ? "Your place on the grid." : s.menu === "quick" ? "Quick Match" : "Career"
  const accent = getCaseStudy(s.slug)?.livery.accent ?? "#ff3b30"
  const finished = season?.results.length === 3
  const record = readRecord(s.slug, s.laps, s.circuit)

  return <MenuNavigation screen={`${s.menu}:${tab}:${s.career.serial}:${season?.results.length}`}>
    <section className={`formula-menu fm-${s.menu}`} style={{ "--fm-accent": accent } as CSSProperties} inert={s.settingsOpen} aria-label="Formula menu">
      <header className="fm-header">
        <button className="fm-quiet" onClick={() => s.menu === "lobby" ? window.__STATOZ_HOST__.emit("exit") : s.openMenu("lobby")}><ArrowLeft size={16} />{s.menu === "lobby" ? "Motorsport" : "Lobby"}</button>
        <span className="fm-wordmark">FORMULA<span> / RACING CLUB</span></span>
        <button className="fm-quiet" onClick={() => s.setSettingsOpen(true)}><Settings2 size={16} />Settings</button>
      </header>
      <div className="fm-content">
        <div className="fm-heading"><h1>{title}</h1></div>
        {s.saveWarning && <p className="fm-warning" role="status">{s.saveWarning}</p>}
        {s.menu === "lobby" ? <>
          <div className="fm-mode-grid">
            <button className="fm-mode fm-career-card" data-primary onClick={() => s.openMenu("career")}>
              <Trophy size={30} strokeWidth={1.25} />
              <strong>Career</strong>
              <span className="fm-career-progress">{season ? `${TIERS[season.tier].name} · ${finished ? `Finished P${rank}` : `Round ${season.results.length + 1} / 3${season.results.length ? ` · P${rank} overall` : ""}`}` : "Rookie → Club → Pro → Champion"}</span>
              <span className="fm-card-cta">{season ? "Continue Career" : "Start Career"}<ArrowRight size={20} /></span>
            </button>
            <button className="fm-mode" onClick={() => s.openMenu("quick")}>
              <Flag size={30} strokeWidth={1.25} />
              <strong>Quick Match</strong><span className="fm-career-progress">3 circuits</span>
              <span className="fm-card-cta">Set up a race<ArrowRight size={20} /></span>
            </button>
          </div>
        </> : s.menu === "quick" ? <div className="fm-quick-layout">
          <div className="fm-circuit-list" role="group" aria-label="Circuit">
            {CIRCUITS.map((c, i) => <button key={c.id} className={`fm-circuit ${c.id === s.circuit ? "is-selected" : ""}`} aria-pressed={s.circuit === c.id} onClick={() => s.setCircuit(c.id)}>
              <CircuitMap id={c.id} /><span><small>0{i + 1} / {c.character}</small><strong>{c.name}</strong><span>{c.description}</span></span>
            </button>)}
          </div>
          <div className="fm-panel fm-setup">
            <CarPicker locked={false} /><PaintPicker />
            <div className="fm-setting-row"><button onClick={() => s.setLaps([1,3,5][([1,3,5].indexOf(s.laps)+1)%3])}>Laps: {s.laps} <ArrowRight size={14} /></button>
              <button onClick={() => s.setDifficulty((["easy","medium","hard"] as const)[(["easy","medium","hard"].indexOf(s.difficulty)+1)%3])}>Rivals: {s.difficulty} <ArrowRight size={14} /></button></div>
            <p className="fm-best">{circuitOf(s.circuit).name} · Best lap {formatLap(record.lap)}</p>
            <button className="fm-primary" disabled={!ready} onClick={s.start}>{ready ? "Start race" : "Preparing circuit…"}<ArrowRight size={18} /></button>
          </div>
        </div> : <div className="fm-career-layout">
          <aside className="fm-panel fm-career-aside">
            {browseCareer && <div className="fm-tier-list" aria-label="Career tiers">{TIERS.map((t,i) => <button key={t.name} disabled={i > s.career.unlockedTier || !!live && i !== season.tier} aria-pressed={selectedTier === i} className={selectedTier === i ? "is-selected" : ""} onClick={() => setTier(i)}><span>0{i + 1}</span>{t.name}{i > s.career.unlockedTier ? <LockKeyhole size={14} /> : s.career.best[i] === 1 ? <Trophy size={15} /> : s.career.best[i] !== null ? <span className="fm-badge">P{s.career.best[i]}</span> : null}</button>)}</div>}
            <div className="fm-career-summary"><strong>{TIERS[selectedTier].name} Championship</strong><p>Finish top three overall to {selectedTier === 3 ? "complete your career" : "earn promotion"}.</p><span>3 races · {TIERS[selectedTier].laps} {TIERS[selectedTier].laps === 1 ? "lap" : "laps"}</span></div>
            {browseCareer && <CarPicker locked={!!live} />}
            <button className="fm-primary" disabled={!ready} onClick={() => { if (!live) s.newSeason(selectedTier); s.start() }}>{live ? `Race ${season.results.length + 1} / 3` : finished && season.tier === selectedTier ? "Retry Championship" : "Begin Championship"}<ArrowRight size={17} /></button>
          </aside>
          <div className="fm-panel fm-career-detail">
            {!browseCareer && <button className="fm-secondary" aria-expanded={false} onClick={() => setBrowseCareer(true)}>Browse career<ArrowRight size={16} /></button>}
            {!browseCareer ? <div className="fm-calendar" data-ui-role="next-career-event">
              <p className="fm-kicker">{finished ? 'CHAMPIONSHIP COMPLETE' : `NEXT RACE · ${Math.min(3, (season?.results.length ?? 0) + 1)} / 3`}</p>
              <CircuitMap id={CIRCUITS[Math.min(2, season?.results.length ?? 0)].id} />
              <h2>{finished ? `Finished P${rank}` : CIRCUITS[season?.results.length ?? 0].name}</h2>
            </div> : <>
            <nav className="fm-tabs" aria-label="Career details"><button onClick={() => setBrowseCareer(false)}>Next race</button>{["calendar", "standings", "rewards"].map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</nav>
            {tab === "calendar" ? <div className="fm-calendar">
              {finished && <div className="fm-season-verdict"><Trophy size={23} /><span><strong>{rank === 1 ? `${TIERS[season.tier].name} champion` : rank! <= 3 ? season.tier === 3 ? "Career complete" : "Promotion earned" : "Keep chasing the podium"}</strong><p>P{rank} overall · {TIERS[season.tier].paint} paint + tier badge earned{rank === 1 ? " + winner’s trophy" : ""}</p></span></div>}
              {CIRCUITS.map((c,i) => <div className={`fm-calendar-row ${live && i === season.results.length ? "is-next" : ""}`} key={c.id}><span className="fm-round">0{i+1}</span><CircuitMap id={c.id} /><span><small>{live && i === season.results.length ? "UP NEXT" : season?.results[i] ? "COMPLETED" : c.character}</small><strong>{c.name}</strong></span><span>{season?.results[i] ? `P${season.results[i].order.indexOf(season.slug) + 1}` : `${TIERS[selectedTier].laps} LAP${TIERS[selectedTier].laps > 1 ? "S" : ""}`}</span></div>)}
              <p className="fm-detail-note">10 · 8 · 6 · 5 · 4 · 3 · 2 · 1 points for P1–P8. Restart an unfinished race anytime; completed results are final.</p>
            </div> : tab === "standings" ? <div className="fm-standings"><div className="fm-table-head"><span>POS</span><span>DRIVER / CAR</span><span>POINTS</span></div>{(season ? board : caseStudies.map(c => ({slug:c.slug,points:0}))).map((row,i) => { const car = getCaseStudy(row.slug)!; return <div key={row.slug} className={row.slug === season?.slug ? "is-player" : ""}><span>{i+1}</span><span><strong>{car.driverName}{row.slug === season?.slug ? " · YOU" : ""}</strong><small>{car.name}</small></span><strong>{row.points}</strong></div> })}</div> : <div className="fm-rewards"><p className="fm-detail-note">Complete a championship to earn its paint and badge. Win it to collect its trophy. All paints keep the same performance.</p>{TIERS.map((t,i) => <div key={t.name} style={{"--reward-color": t.color} as CSSProperties}><span className="fm-paint-swatch" /><span><strong>{t.paint}</strong><small>{s.career.best[i] === null ? `${t.name} completion reward` : `${t.name} badge · Best P${s.career.best[i]}`}</small></span>{s.career.best[i] === 1 ? <Trophy aria-label="Trophy earned" size={21} /> : s.career.best[i] === null ? <LockKeyhole size={17} /> : <span className="fm-badge">EARNED</span>}</div>)}<PaintPicker /></div>}
            </>}
          </div>
        </div>}
      </div>
    </section>
  </MenuNavigation>
}

function CarPicker({ locked }: { locked: boolean }) {
  const s = useRaceStore()
  const i = caseStudies.findIndex(c => c.slug === s.slug)
  const car = caseStudies[i] ?? caseStudies[0]
  return <div className="fm-car-picker"><span className="fm-label">{locked ? "CHAMPIONSHIP CAR · LOCKED" : "YOUR CAR · EQUAL PERFORMANCE"}</span><div><button aria-label="Previous car" disabled={locked} onClick={() => s.setSlug(caseStudies[(i+7)%8].slug)}><ArrowLeft size={16} /></button><span><strong>{car.name}</strong><small>{car.driverName}</small></span><button aria-label="Next car" disabled={locked} onClick={() => s.setSlug(caseStudies[(i+1)%8].slug)}><ArrowRight size={16} /></button></div></div>
}

function PaintPicker() {
  const s = useRaceStore()
  return <div className="fm-paints" aria-label="Paint"><span className="fm-label">PAINT</span><button aria-pressed={s.paint === -1} onClick={() => s.setPaint(-1)}>Original</button>{TIERS.map((t,i) => s.career.best[i] !== null && <button key={t.paint} aria-pressed={s.paint === i} onClick={() => s.setPaint(i)}>{t.paint}</button>)}</div>
}
