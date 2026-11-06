import { useState, type CSSProperties } from "react"
import { ArrowLeft, ArrowRight, Settings2, Trophy } from "lucide-react"
import { getCaseStudy } from "@/data/caseStudies"
import { useRaceStore } from "@/race/raceStore"
import { POINTS, TIERS, standings } from "@/race/career"
import { circuitOf } from "@/race/circuits"
import { formatGap, formatLap } from "@/race/format"
import { MenuNavigation } from "./FormulaMenu"

export function FormulaResults() {
  const s = useRaceStore()
  const [tab, setTab] = useState("classification")
  const result = s.result!
  const career = s.config?.mode === "career"
  const season = s.career.active
  const rows = career && tab === "championship" && season ? standings(season) : null
  const complete = career && season?.results.length === 3
  const rank = season ? standings(season).findIndex(r => r.slug === season.slug) + 1 : 0
  return <MenuNavigation screen={`results:${tab}`}>
    <section className="formula-menu fm-results" role="dialog" aria-modal="true" aria-labelledby="fm-results-title" inert={s.settingsOpen}
      style={{ "--fm-accent": getCaseStudy(result.slug)!.livery.accent } as CSSProperties}>
      <header className="fm-header"><button className="fm-quiet" onClick={() => s.openMenu("lobby")}><ArrowLeft size={16} />Lobby</button><span className="fm-wordmark">FORMULA<span> / CHEQUERED FLAG</span></span><button className="fm-quiet" onClick={() => s.setSettingsOpen(true)}><Settings2 size={16} />Settings</button></header>
      <div className="fm-content">
        <div className="fm-result-layout">
          <div className="fm-result-summary"><p className="fm-kicker">{circuitOf(result.circuit).name} · {result.laps} {result.laps === 1 ? "lap" : "laps"}</p><h1 id="fm-results-title"><span>P</span>{result.position}</h1><h2>{result.position === 1 ? "Winner." : result.position <= 3 ? "On the podium." : "Race complete."}</h2>
            <div className="fm-result-stats"><div><small>RACE TIME</small><strong>{formatLap(result.time)}</strong></div><div><small>BEST LAP{result.record.lap ? " · PERSONAL BEST" : ""}</small><strong>{formatLap(result.bestLap)}</strong></div></div>
            {career && <div className="fm-result-reward"><Trophy size={20} /><span><strong>+{POINTS[result.position-1]} championship points</strong><small>{complete ? `${TIERS[season!.tier].paint} paint + badge earned${rank === 1 ? " · Trophy earned" : ""}` : `Round ${season?.results.length} / 3 · P${rank} overall`}</small>{complete && <small>{rank === 1 ? `${TIERS[season!.tier].name} champion!` : rank <= 3 ? season!.tier === 3 ? "Career complete!" : "Promotion earned!" : "Retry the championship to chase promotion."}</small>}</span></div>}
            {s.saveWarning && <p className="fm-warning" role="status">{s.saveWarning}</p>}
            <div className="fm-result-actions"><button className="fm-primary" onClick={career ? s.backToSelect : s.start}>{career ? "Continue Career" : "Race again"}<ArrowRight size={18} /></button>{!career && <button className="fm-secondary" onClick={s.backToSelect}>Race setup</button>}</div>
          </div>
          <details className="fm-panel"><summary className="fm-quiet" style={{minHeight:44,cursor:'pointer'}}>Race details</summary><nav className="fm-tabs" aria-label="Results"><button aria-pressed={tab === "classification"} onClick={() => setTab("classification")}>Classification</button>{career && <button aria-pressed={tab === "championship"} onClick={() => setTab("championship")}>Championship</button>}</nav><div className="fm-standings"><div className="fm-table-head"><span>POS</span><span>DRIVER / CAR</span><span>{rows ? "POINTS" : "GAP"}</span></div>{(rows ?? result.rows).map((row,i) => { const car = getCaseStudy(row.slug)!; return <div key={row.slug} className={row.slug === result.slug ? "is-player" : ""}><span>{i+1}</span><span><strong>{car.driverName}{row.slug === result.slug ? " · YOU" : ""}</strong><small>{car.name}</small></span><strong>{"points" in row ? row.points : row.gap === null ? "LEAD" : formatGap(row.gap)}</strong></div> })}</div></details>
        </div>
      </div>
    </section>
  </MenuNavigation>
}
