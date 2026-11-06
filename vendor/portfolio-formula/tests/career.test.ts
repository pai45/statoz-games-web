import assert from "node:assert/strict"
import test from "node:test"
import { caseStudies } from "../src/data/caseStudies"
import { CAREER_KEY, TIERS, beginSeason, completeRound, emptyCareer, loadCareer, saveCareer, standings, validCareer } from "../src/race/career"
import { CIRCUITS, seededGrid } from "../src/race/circuits"
import { getTrack, locate, pointAt, trackMapPath } from "../src/three/race/track"
import { RaceSim, STEP } from "../src/three/race/sim"
import { gridSlot } from "../src/three/layout"
import { readRecord, saveRecord } from "../src/race/records"
import { paintedStudy } from "../src/race/paints"

const slugs = caseStudies.map(c => c.slug)
function orderAt(position: number) { const rivals = slugs.slice(1); rivals.splice(position - 1, 0, slugs[0]); return rivals }
function storage(run: (values: Map<string,string>) => void) {
  const values = new Map<string,string>()
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage")
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string,v: string) => values.set(k,v) } })
  try { run(values) } finally { if (previous) Object.defineProperty(globalThis, "localStorage", previous); else Reflect.deleteProperty(globalThis, "localStorage") }
}
test("four championships promote top-three finishers, award cosmetics, and retain winner trophies", () => {
  let c = emptyCareer()
  for (let tier = 0; tier < 4; tier++) {
    c = beginSeason(c, tier, slugs[0], 91)
    assert.equal(c.active!.tier, tier)
    for (let round = 0; round < 3; round++) c = completeRound(c, `${c.active!.id}:${round}`, orderAt(tier === 3 ? 1 : 3))
    assert.equal(c.best[tier], tier === 3 ? 1 : 3)
    assert.equal(c.unlockedTier, Math.min(3, tier + 1))
    assert.equal(validCareer(c), true)
  }
  const best = [...c.best]
  c = beginSeason(c, 3, slugs[0], 92)
  for (let i=0;i<3;i++) c = completeRound(c, `${c.active!.id}:${i}`, orderAt(8))
  assert.deepEqual(c.best, best)
})
test("failed championship can be retried; locked tiers and an unfinished season cannot be replaced", () => {
  let c = emptyCareer()
  assert.equal(beginSeason(c, 1, slugs[0], 1), c)
  c = beginSeason(c, 0, slugs[0], 1)
  assert.equal(beginSeason(c, 0, slugs[1], 2), c)
  for (let i=0;i<3;i++) c = completeRound(c, `1:${i}`, orderAt(8))
  assert.equal(c.unlockedTier, 0)
  assert.equal(c.best[0], 8)
  const retry = beginSeason(c,0,slugs[1],2)
  assert.equal(retry.active!.id,2)
  assert.equal(retry.best[0],8)
})
test("career accepts an ordered complete classification exactly once", () => {
  const c = beginSeason(emptyCareer(),0,slugs[0],1)
  assert.equal(completeRound(c,"1:1",slugs),c)
  assert.equal(completeRound(c,"1:0",slugs.slice(1)),c)
  assert.equal(completeRound(c,"1:0",slugs.map(() => slugs[0])),c)
  const next = completeRound(c,"1:0",slugs)
  assert.equal(completeRound(next,"1:0",slugs),next)
  assert.deepEqual(standings(next.active!).map(r => r.points),[10,8,6,5,4,3,2,1])
})
test("equal championship points use finishing-position countback then the final round", () => {
  let c = beginSeason(emptyCareer(),0,slugs[0],1)
  c = completeRound(c,"1:0",[slugs[0],slugs[2],slugs[1],...slugs.slice(3)])
  c = completeRound(c,"1:1",[slugs[1],slugs[2],slugs[0],...slugs.slice(3)])
  const table = standings(c.active!)
  assert.equal(table[0].points,16)
  assert.equal(table[0].slug,slugs[1])
  assert.equal(table[1].slug,slugs[0])
  assert.equal(table[2].slug,slugs[2])
})
test("career survives reload, keeps a valid backup, and preserves malformed or newer data", () => storage(values => {
  let c = beginSeason(emptyCareer(),0,slugs[0],31)
  assert.equal(saveCareer(c,true),"")
  c = completeRound(c,"1:0",slugs)
  assert.equal(saveCareer(c,true),"")
  assert.deepEqual(loadCareer().career,c)
  values.set(CAREER_KEY,'{"version":9}')
  const recovered=loadCareer()
  assert.equal(recovered.writable,false)
  assert.equal(recovered.career.active!.results.length,0)
  saveCareer(c,recovered.writable)
  assert.equal(values.get(CAREER_KEY),'{"version":9}')
  assert.equal(validCareer({...c,active:{...c.active,results:[{eventId:"1:0",circuit:"night",order:["bad"]}]}}),false)
}))
test("legacy bests migrate only to Night Circuit; all circuit records remain separate", () => storage(values => {
  const legacy=JSON.stringify({statoz:{lap:85,races:{"1":88}}})
  values.set("statoz.portfolio-formula.records.v1",legacy)
  assert.deepEqual(readRecord("statoz",1,"night"),{lap:85,race:88})
  assert.deepEqual(readRecord("statoz",1,"harbor"),{lap:null,race:null})
  saveRecord("statoz",1,70,69,"harbor")
  assert.deepEqual(readRecord("statoz",1,"harbor"),{lap:69,race:70})
  assert.deepEqual(readRecord("statoz",1,"night"),{lap:85,race:88})
  assert.equal(values.get("statoz.portfolio-formula.records.v1"),legacy)
  values.set("statoz.portfolio-formula.records.v2",'{"version":3}')
  saveRecord("statoz",1,60,59,"night")
  assert.equal(values.get("statoz.portfolio-formula.records.v2"),'{"version":3}')
}))
test("a storage write failure reports the problem and retains the last completed save", () => storage(() => {
  const c = beginSeason(emptyCareer(),0,slugs[0],31)
  saveCareer(c,true)
  const next = completeRound(c,"1:0",slugs)
  localStorage.setItem = () => { throw new Error("Storage quota exceeded") }
  assert.match(saveCareer(next,true),/could not save/)
  assert.deepEqual(loadCareer().career,c)
}))
test("grid order is deterministic and independent of livery; paints preserve car identity", () => {
  assert.deepEqual(seededGrid(slugs,301),seededGrid(slugs,301))
  assert.notDeepEqual(seededGrid(slugs,301),seededGrid(slugs,302))
  assert.deepEqual([...seededGrid(slugs,301)].sort(),[...slugs].sort())
  for (let i=0;i<4;i++) { const painted=paintedStudy(caseStudies[0],i); assert.equal(painted.slug,slugs[0]); assert.equal(painted.livery.primary,TIERS[i].color) }
})
for (const circuit of CIRCUITS) {
  test(`${circuit.name}: geometry, start straight, map, sectors and reset agree`, () => {
    const track=getTrack(circuit.id)
    assert.ok(track.length>500)
    assert.equal(getTrack(circuit.id),track)
    assert.ok(track.sectors[0]<track.sectors[1] && track.sectors[1]<track.length)
    const map=trackMapPath(track)
    assert.ok(map.path.startsWith("M") && map.path.endsWith("Z"))
    for(let i=0;i<60;i++) {
      const point={x:0,z:0,heading:0},location={index:0,s:0,d:0}
      pointAt(track,track.length*i/60,0,point);locate(track,point.x,point.z,-1,location)
      assert.ok(Math.abs(location.d)<.25)
      assert.ok(Number.isFinite(track.speed[location.index]) && track.speed[location.index]>0)
    }
    for(let i=1;i<=8;i++) { const p=gridSlot(i),l={index:0,s:0,d:0}; locate(track,p.x,p.z,-1,l); assert.ok(Math.abs(l.d)<6); assert.ok(l.s>track.length-100) }
  })
  for(const tier of TIERS) test(`${circuit.name}: ${tier.name} seeded full-distance race completes`, () => {
    const grid=seededGrid(slugs,42).map((slug,i)=> { const p=gridSlot(i+1);return {slug,x:p.x,z:p.z,player:slug===slugs[0]} })
    const sim=new RaceSim(getTrack(circuit.id),grid,{laps:tier.laps,difficulty:tier.difficulty,seed:42})
    sim.player.autopilot=true;sim.player.skill=.97;sim.start()
    for(let i=0;i<120*600 && sim.cars.some(c=>!c.finished);i++) sim.step(STEP,{throttle:0,brake:0,steer:0})
    assert.ok(sim.cars.every(c=>c.finished),`stuck: ${sim.cars.filter(c=>!c.finished).map(c=>c.slug+":"+c.laps+":"+c.speed.toFixed(1))}`)
    assert.ok(sim.cars.every(c=>c.sectorTimes.every(t=>t!==null && t>0)))
  })
}
