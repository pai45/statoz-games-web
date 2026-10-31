import { useState } from 'react';
import { nations, groups } from './nations';
import { currentFixture, nation, standings, thirdStandings } from './tournament';
import { Flag } from './flag';
import { stageNames, type Cup, type MatchResult, type Stage, type Standing } from './types';
import styles from './screen.module.css';

export function Pager({page,count,onChange}:{page:number;count:number;onChange:(n:number)=>void}) {
  if(count<2)return null;
  return <div className={styles.pager}><button aria-label="Previous page" disabled={page===0} onClick={()=>onChange(page-1)}>←</button><span>{page+1} / {count}</span><button aria-label="Next page" disabled={page+1>=count} onClick={()=>onChange(page+1)}>→</button></div>;
}
export function Home({cup,ready,onCup,onRandom,onContinue,onHistory}:{cup:Cup|null;ready:boolean;onCup:()=>void;onRandom:()=>void;onContinue:()=>void;onHistory:()=>void}) {
  return <main className={styles.home} data-screen-content>
    <div className={styles.homeIdentity}><Trophy/><h1>PENALTY<br/><em>CUP</em></h1></div>
    <div className={styles.homeActions}>
      {cup&&<button className={styles.continue} onClick={onContinue}><Flag id={cup.team}/><span>{cup.status==='active'?'Continue Cup':'Last cup'}<small>{nation(cup.team).name}</small></span><b>→</b></button>}
      <button className={styles.primary} disabled={!ready} onClick={onCup}>Penalty Cup <span>→</span></button>
      <button disabled={!ready} onClick={onRandom}>Random Game <span>→</span></button>
      <button className={styles.textButton} onClick={onHistory}>Cup history</button>
    </div>
  </main>;
}
export function TeamSelect({selected,onSelect,onPlay,random}:{selected:string;onSelect:(id:string)=>void;onPlay:()=>void;random:boolean}) {
  const [page,setPage]=useState(Math.floor(nations.findIndex(n=>n.id===selected)/8));
  return <main className={styles.selection} data-screen-content>
    <div className={styles.selectionTitle}><h2>Choose your nation</h2><span>{random?'Random Game':'Penalty Cup'}</span></div>
    <div className={styles.teamGrid}>{nations.slice(page*8,page*8+8).map(n=><button key={n.id} data-nation={n.id} aria-label={n.name} aria-pressed={selected===n.id} className={styles.teamTile} onClick={()=>onSelect(n.id)}><Flag id={n.id}/><b>{n.name}</b><small>{n.id} · {n.group}</small></button>)}</div>
    <footer className={styles.selectionFooter}><Pager page={page} count={6} onChange={setPage}/><div className={styles.selectedNation}><Flag id={selected}/><b>{nation(selected).name}</b></div><button className={styles.primary} onClick={onPlay}>{random?'Play':'Start Cup'} →</button></footer>
  </main>;
}
const rounds:Stage[]=['round32','round16','quarter','semi','final','bronze'];
const statusText:Record<Cup['status'],string>={active:'Next match',champion:'Champions',eliminated:'Cup complete','runner-up':'Runners-up',third:'Third place',fourth:'Fourth place'};
export function CupHub({cup,onPlay,onNew}:{cup:Cup;onPlay:()=>void;onNew:()=>void}) {
  const [tab,setTab]=useState<'group'|'third'|'results'|'bracket'>('group'),[group,setGroup]=useState(nation(cup.team).group),[round,setRound]=useState<Stage>(cup.stage==='group'?'round32':cup.stage),[page,setPage]=useState(0);
  const f=currentFixture(cup),opponent=f?nation(f.home===cup.team?f.away:f.home):null;
  const third=thirdStandings(cup),results=cup.fixtures.filter(x=>x.home===cup.team||x.away===cup.team),fixtures=cup.fixtures.filter(x=>x.stage===round);
  const count=tab==='third'?3:tab==='results'?Math.ceil(results.length/4):tab==='bracket'?Math.max(1,Math.ceil(fixtures.length/4)):1;
  const visiblePage=Math.min(page,count-1);
  return <main className={styles.hub} data-screen-content>
    <aside className={styles.nextMatch}>
      <small>{cup.status==='active'?stageNames[cup.stage]:statusText[cup.status]}</small>
      {cup.status==='champion'?<Trophy/>:<div className={styles.fixtureTeams}><div><Flag id={cup.team}/><b>{cup.team}</b></div>{opponent&&<><span>VS</span><div><Flag id={opponent.id}/><b>{opponent.id}</b></div></>}</div>}
      <span className={styles.cupNation}>{nation(cup.team).name}</span>
      {cup.status==='active'?<button className={styles.primary} onClick={onPlay}>{cup.pending?'Result':cup.checkpoint?'Resume match':'Play match'} →</button>:<button className={styles.primary} onClick={onNew}>New Cup →</button>}
    </aside>
    <section className={styles.hubPanel}>
      <nav className={styles.tabs} aria-label="Cup information">{(['group','third','results','bracket'] as const).map((t,i)=><button key={t} aria-pressed={tab===t} onClick={()=>{setTab(t);setPage(0);}}>{['Groups','Third place','Results','Bracket'][i]}</button>)}</nav>
      <div className={styles.panelToolbar}>{tab==='group'?<select aria-label="Group standings" value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(g=><option key={g} value={g}>Group {g}</option>)}</select>:tab==='bracket'?<select aria-label="Knockout round" value={round} onChange={e=>{setRound(e.target.value as Stage);setPage(0);}}>{rounds.map(s=><option key={s} value={s}>{stageNames[s]}</option>)}</select>:<span>{tab==='third'?'Best eight qualify':'Your matches'}</span>}<small>{cup.stage==='group'?`Matchday ${cup.day+1}`:'Penalty Cup'}</small></div>
      <div className={styles.panelBody}>
        {tab==='group'&&<StandingTable rows={standings(cup,group)} selected={cup.team}/>}
        {tab==='third'&&<StandingTable rows={third.slice(visiblePage*4,visiblePage*4+4)} selected={cup.team} offset={visiblePage*4} third/>}
        {tab==='results'&&<div className={styles.resultsList}>{results.slice(visiblePage*4,visiblePage*4+4).map(x=><div key={x.id}><small>{x.stage==='group'?`Group ${x.day+1}`:stageNames[x.stage]}</small><Flag id={x.home}/><b>{x.home}</b><strong>{x.score?`${x.score[0]} – ${x.score[1]}`:'–'}</strong><b>{x.away}</b><Flag id={x.away}/></div>)}</div>}
        {tab==='bracket'&&(fixtures.length?<div className={styles.bracket}>{fixtures.slice(visiblePage*4,visiblePage*4+4).map(x=><div className={styles.bracketFixture} data-player={x.home===cup.team||x.away===cup.team} key={x.id}>{[x.home,x.away].map((id,i)=><div key={id}><Flag id={id}/><b>{id}</b><strong>{x.score?.[i]??'–'}</strong></div>)}</div>)}</div>:<div className={styles.empty}>After qualification</div>)}
      </div>
      <Pager page={visiblePage} count={count} onChange={setPage}/>
    </section>
  </main>;
}
function StandingTable({rows,selected,offset=0,third=false}:{rows:Standing[];selected:string;offset?:number;third?:boolean}) {
  return <table className={styles.table}><thead><tr><th>#</th><th>Nation</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>{rows.map((r,i)=><tr key={r.team} data-selected={r.team===selected} data-qualified={i+offset<(third?8:2)}><td>{i+offset+1}</td><th scope="row"><Flag id={r.team}/><span>{r.team}</span></th><td>{r.played}</td><td>{r.gd}</td><td>{r.points}</td></tr>)}</tbody></table>;
}
export function MatchResultView({result,team,opponent,cup,onAccept,onRetry,onRematch,onNewOpponent,onHome}:{result:MatchResult;team:string;opponent:string;cup:Cup|null;onAccept:()=>void;onRetry:()=>void;onRematch:()=>void;onNewOpponent:()=>void;onHome:()=>void}) {
  return <main className={styles.resultScreen} data-screen-content>
    <h1>{result.outcome==='win'?'WIN':result.outcome==='draw'?'DRAW':'LOSS'}</h1>
    <div className={styles.resultScore}><div><Flag id={team}/><b>{nation(team).name}</b><PenaltyDots result={result} role="shooting"/></div><strong>{result.score[0]} – {result.score[1]}</strong><div><Flag id={opponent}/><b>{nation(opponent).name}</b><PenaltyDots result={result} role="keeping"/></div></div>
    <div className={styles.resultActions}>{cup?<>{result.outcome==='loss'&&cup.stage!=='group'&&<button className={styles.primary} onClick={onRetry}>Retry match</button>}<button className={result.outcome==='loss'&&cup.stage!=='group'?undefined:styles.primary} onClick={onAccept}>{result.outcome==='loss'&&cup.stage!=='group'?'Accept result':'Continue Cup'} →</button></>:<><button className={styles.primary} onClick={onRematch}>Rematch</button><button onClick={onNewOpponent}>New opponent</button><button onClick={onHome}>Home</button></>}</div>
  </main>;
}
function PenaltyDots({result,role}:{result:MatchResult;role:'shooting'|'keeping'}) {return <div className={styles.kickDots}>{result.kicks.filter(k=>k.role===role).slice(-5).map(k=><i data-goal={k.outcome==='goal'} key={k.id}>{k.outcome==='goal'?'●':'×'}</i>)}</div>;}
export function History({cups}:{cups:Cup[]}) {
  const [page,setPage]=useState(0),cup=cups[page];
  if(!cup)return <p>No completed cups</p>;
  return <><div className={styles.historySummary}><Flag id={cup.team}/><b>{nation(cup.team).name}</b><span>{statusText[cup.status]}</span></div><div className={styles.historyResults}>{cup.fixtures.filter(f=>f.score&&(f.home===cup.team||f.away===cup.team)).map(f=><div key={f.id}><span>{f.home}</span><b>{f.score![0]} – {f.score![1]}</b><span>{f.away}</span></div>)}</div><Pager page={page} count={cups.length} onChange={setPage}/></>;
}
export function Trophy() {return <svg className={styles.trophy} viewBox="0 0 120 140" aria-label="Penalty Cup trophy" role="img"><path d="M35 22H15v17q0 24 32 31M85 22h20v17q0 24-32 31" fill="none" stroke="#c29d53" strokeWidth="7"/><path d="M33 12h54l-5 46q-2 18-17 22v21l17 10v7H38v-7l17-10V80q-15-4-17-22Z" fill="#e7c56f"/><path d="m60 27 4 11h11l-9 7 3 11-9-7-9 7 3-11-9-7h11Z" fill="#876933"/><path d="M35 118h50l4 13H31Z" fill="#374a39"/><path d="M31 125h58v5H31Z" fill="#c29d53"/></svg>;}
