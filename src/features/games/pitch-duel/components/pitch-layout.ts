import { formations } from "../engine/lineup";
import type { Lane, MatchState, Side } from "../engine/types";

/**
 * Where every player stands on the pitch view. Pure, so it can be tested.
 * Coordinates are 0–1: x runs from the home goal (0) to the away goal (1),
 * y from the left touchline (0) to the right (1). Home attacks to the right.
 */
export type Token = {
  side: Side;
  id: string;
  x: number;
  y: number;
  keeper: boolean;
  /** Has the ball. */
  carrier: boolean;
  /** One of the two players in this duel. */
  duel: boolean;
};

export type PitchScene = { tokens: Token[]; ball: { x: number; y: number } };

export type SceneInput = {
  /** Ladder column 1–8, left to right. */
  x: number;
  lane: Lane;
  possession: Side;
  /** The duelling player on each side. */
  duel: Record<Side, string>;
  /** Where the play is when it is not a zone centre (a corner flag, the spot). The duellists gather here. */
  spot?: { x: number; y: number };
  /** Sends the ball alone somewhere else, such as into the net. */
  ballAt?: { x: number; y: number };
};

export const laneY: Record<Lane, number> = { left: 0.2, center: 0.5, right: 0.8 };
const lineDepth = { back: 0.2, mid: 0.36, front: 0.52 } as const;

/** Centre of a ladder column 1–8 on the 0–1 pitch. */
export const columnX = (column: number) => (column - 0.5) / 8;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function pitchScene(state: Pick<MatchState, "teams" | "players">, view: SceneInput): PitchScene {
  const bx = view.spot?.x ?? columnX(view.x);
  const by = view.spot?.y ?? laneY[view.lane];
  const attackDir = view.possession === "home" ? 1 : -1;
  const tokens: Token[] = [];

  for (const side of ["home", "away"] as const) {
    const team = state.teams[side];
    const dir = side === "home" ? 1 : -1;
    const abs = (depth: number) => (side === "home" ? depth : 1 - depth);
    const ballDepth = side === "home" ? bx : 1 - bx;
    const attacking = side === view.possession;
    const slots = formations[team.formation].slots;
    const duelId = view.duel[side];

    team.outfield.forEach((id, index) => {
      if (state.players[`${side}:${id}`]?.red) return;
      const slot = slots[index];
      if (!slot) return;
      if (id === duelId) {
        // The carrier sits just behind the ball; the defender just goal-side of it.
        tokens.push({
          side,
          id,
          x: clamp(attacking ? bx - attackDir * 0.04 : bx + attackDir * 0.05, 0.04, 0.94),
          y: clamp(attacking ? by : by + 0.09, 0.05, 0.95),
          keeper: false,
          carrier: attacking,
          duel: true,
        });
        return;
      }
      const shift = (ballDepth - 0.5) * 0.55 + (attacking ? 0.1 : -0.04);
      // Never behind their own keeper, never past the other one.
      const depth = clamp(lineDepth[slot.line] + shift, 0.13, 0.88);
      const home = slot.lanes.reduce((sum, lane) => sum + laneY[lane], 0) / slot.lanes.length;
      const y = home + (by - home) * (attacking ? 0.25 : 0.35);
      tokens.push({ side, id, x: abs(depth), y, keeper: false, carrier: false, duel: false });
    });

    const keeperDuel = team.keeperId === duelId;
    const keeperAtBall = keeperDuel && attacking;
    tokens.push({
      side,
      id: team.keeperId,
      x: keeperAtBall ? bx - dir * 0.04 : abs(0.035),
      y: keeperAtBall ? by : 0.5 + (by - 0.5) * 0.3,
      keeper: true,
      carrier: keeperAtBall,
      duel: keeperDuel,
    });
  }

  spread(tokens);
  return { tokens, ball: view.ballAt ?? { x: bx, y: by } };
}

/** Nudges players apart so no two discs sit on top of each other. Duellists stay put. */
function spread(tokens: Token[]) {
  const aspect = 1.55;
  const min = 0.095;
  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = 0; i < tokens.length; i += 1) {
      for (let j = i + 1; j < tokens.length; j += 1) {
        const a = tokens[i];
        const b = tokens[j];
        const dx = (b.x - a.x) * aspect;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d >= min) continue;
        const push = (min - d) / 2;
        const ux = d ? dx / d : 0;
        const uy = d ? dy / d : 1;
        const moveA = !a.duel && !a.keeper;
        const moveB = !b.duel && !b.keeper;
        const share = moveA && moveB ? 1 : 2;
        if (moveA) {
          a.x = clamp(a.x - (ux * push * share) / aspect, 0.06, 0.94);
          a.y = clamp(a.y - uy * push * share, 0.06, 0.94);
        }
        if (moveB) {
          b.x = clamp(b.x + (ux * push * share) / aspect, 0.06, 0.94);
          b.y = clamp(b.y + uy * push * share, 0.06, 0.94);
        }
      }
    }
  }
}
