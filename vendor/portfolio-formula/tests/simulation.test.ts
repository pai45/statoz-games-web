import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { createHash } from "node:crypto";

import { caseStudies } from "../src/data/caseStudies";
import { CAR, RaceSim, STEP } from "../src/three/race/sim";
import { getTrack, locate, pointAt } from "../src/three/race/track";
import { gridSlot } from "../src/three/layout";
import { readRecord, saveRecord } from "../src/race/records";

function race() {
  return new RaceSim(getTrack(), caseStudies.map(car => {
    const at = gridSlot(car.position);
    return { slug: car.slug, x: at.x, z: at.z, player: car.slug === "statoz" };
  }), { laps: 1, difficulty: "medium", seed: 42 });
}

test("eight supplied cars retain their liveries and grid order", () => {
  assert.equal(caseStudies.length, 8);
  assert.deepEqual(caseStudies.map(car => car.position), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(new Set(caseStudies.map(car => car.slug)).size, 8);
  assert.equal(caseStudies[0].name, "Apex GP-01");
  assert.equal(caseStudies[0].livery.primary, "#0ea8e2");
});

test("supplied procedural car artwork keeps its original source hashes", () => {
  const source = JSON.parse(fs.readFileSync("vendor/portfolio-formula/SOURCE.json", "utf8"));
  for (const file of ["src/three/car/carGeometry.ts", "src/three/car/liveryArt.ts"]) {
    assert.equal(createHash("sha256").update(fs.readFileSync(`vendor/portfolio-formula/${file}`)).digest("hex"), source.files[file], file);
  }
});

test("fixed-step simulation is deterministic and a stationary grid never races itself", () => {
  const a = race(), b = race();
  for (let i = 0; i < 100; i++) a.step(STEP, { throttle: 1, brake: 0, steer: 0 });
  assert.equal(a.time, 0);
  assert.equal(a.player.speed, 0);
  a.start(); b.start();
  for (let i = 0; i < 240; i++) {
    const input = { throttle: 1, brake: 0, steer: 0 };
    a.step(STEP, input); b.step(STEP, input);
  }
  assert.deepEqual(a.cars.map(car => [car.x, car.z, car.speed]), b.cars.map(car => [car.x, car.z, car.speed]));
  assert.ok(a.player.speed > 10 && a.player.speed <= CAR.topSpeed);
  assert.ok(a.cars.filter(car => !car.player).every(car => car.speed > 0));
});

test("braking reduces speed and reset restores the car safely to the circuit", () => {
  const sim = race(); sim.start();
  for (let i = 0; i < 180; i++) sim.step(STEP, { throttle: 1, brake: 0, steer: 0 });
  const moving = sim.player.speed;
  for (let i = 0; i < 30; i++) sim.step(STEP, { throttle: 0, brake: 1, steer: 0 });
  assert.ok(sim.player.speed < moving);
  sim.resetCar(sim.player);
  assert.equal(sim.player.speed, 0);
  assert.ok(Math.abs(sim.player.loc.d) <= 3.1);
  assert.ok(sim.player.ghost > 0);
});

test("AI driving completes a real lap and records a complete finishing classification", () => {
  const sim = race(); sim.player.autopilot = true; sim.player.skill = 0.95; sim.start();
  for (let i = 0; i < 120 * 240 && !sim.player.finished; i++) sim.step(STEP, { throttle: 0, brake: 0, steer: 0 });
  assert.ok(sim.player.finished, `did not finish: progress=${sim.player.progress}, speed=${sim.player.speed}`);
  assert.ok(sim.player.finishTime! > 10);
  assert.ok(sim.player.bestLap! > 10);
  assert.equal(sim.player.sectorTimes.length, 3);
  assert.ok(sim.player.sectorTimes.every(value => value !== null && value > 0));
  assert.equal(sim.order().length, 8);
});

test("track sampling and location agree around the full circuit", () => {
  const track = getTrack();
  assert.ok(track.length > 500);
  for (let i = 0; i < 20; i++) {
    const s = track.length * i / 20;
    const point = { x: 0, z: 0, heading: 0 }, location = { index: 0, s: 0, d: 0 };
    pointAt(track, s, 0, point);
    locate(track, point.x, point.z, -1, location);
    assert.ok(Math.abs(location.d) < 0.2);
  }
});

test("personal bests persist locally and slower results never replace them", () => {
  const values = new Map<string, string>();
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
  try {
    assert.deepEqual(readRecord("statoz", 1), { race: null, lap: null });
    saveRecord("statoz", 1, 93, 90);
    saveRecord("statoz", 1, 100, 99);
    assert.deepEqual(readRecord("statoz", 1), { race: 93, lap: 90 });
    saveRecord("statoz", 1, 85, 84);
    assert.deepEqual(readRecord("statoz", 1), { race: 85, lap: 84 });
    assert.ok(values.has("statoz.portfolio-formula.records.v2"));
    assert.ok(!values.has("pd-race-records-v1"));
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
