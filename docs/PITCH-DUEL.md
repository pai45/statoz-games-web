# Pitch Duel (Future Web Games)

Pitch Duel is a landscape-first solo football card game at `/play/pitch-duel`. Its gameplay and layout follow the card-football structure of [Ballers](https://github.com/kiellzz/ballers-game): a zone ladder, one duel per decision, set-piece pick-ems and a three-column match screen. It adds one thing Ballers lacks: the CPU commits a hidden counter every turn. It is skinned entirely in the StatOz design system: Orbitron and Space Grotesk, token colours, chamfered plates and the shared `PlayerCard`. No Ballers art, fonts or palette are used.

All code is in `src/features/games/pitch-duel`:

| Folder | Contents |
|---|---|
| `engine/` | The pure rules. No React or window access, so it can be tested in Node. |
| `state/` | The save store and the match hook. |
| `components/` | The screens. |

## Match loop

**The pitch** is a ladder of 8 zones × 3 lanes. Progress is counted from the attacking side: 1 is its own box, 8 is the opponent's box. Both boxes use the centre lane only.

**When you have the ball**, the buttons are fixed for each zone and lane (3–4 of them, from `attackMenu`). They come from five families:

| Family | Actions |
|---|---|
| PASS | Short pass, Forward pass |
| CARRY | Dribble, Sprint, Cut inside |
| THROUGH | Through ball, Long ball |
| WIDE | Switch play, Cross |
| SHOT | Shoot, Long shot |

There is always a carry option. Shoot is always offered in the box, and Long shot from the final third.

**When the CPU has the ball**, you pick a defence. Each one fully counters one family and partly counters another:

| Defence | Fully counters | Partly counters | Notes |
|---|---|---|---|
| Intercept | PASS | THROUGH | |
| Tackle | CARRY | PASS | |
| Hold line | THROUGH | SHOT | |
| Aerial duel | WIDE | CARRY | |
| Block | SHOT | WIDE | |
| Slide tackle | — | CARRY + THROUGH | Bigger swings, about 3× foul risk |
| Clearance | — | Everything | Box only |

**The mind game.** At the start of each turn the CPU commits its pick from the match state. That pick is `cpuIntent`, and it is set before the human chooses.
- A full counter shifts the duel by −13, a partial by −4, a wrong read by +4.
- The Mind Game tactic shows the committed pick early. It never changes it.

**Duel resolution:**
- `k = action base + 0.5 × (weighted attacker stats − weighted defender stats) + lane fit + counter + formation + division edge + man advantage + bonus + tactic`.
- Add a triangular random swing of ±24 × volatility.
- Four outcomes: big fail, fail, success, big success. `outcomeProbabilities` gives the exact odds.

**Card stats.** Cards only carry rating, position and trait. `deriveStats` turns them into deterministic PAC/SHO/PAS/DRI/DEF/PHY plus keeper DIV/REF/HAN/POS.

**Shots** go to a keeper stage. Goal odds depend on where the shot comes from (box, header, long shot) and on the shooter's SHO against the keeper.

**Fouls** can happen when the attacker loses a duel. They bring yellow cards, second yellows and reds. A foul in the box gives a penalty; a central foul near goal gives a free kick.

**Set pieces** (penalty, free kick, corner, one-on-one) are pick-one choices for both sides. The tables are in `engine/set-pieces.ts`.

**The clock** runs to 90'. Each decision costs 1–4 minutes, with a pacing governor aiming at 3.2 minutes per decision. That gives about 31 decisions per match. Half-time is at 45 plus stoppage time.

**Draws stay draws.**

## CPU

- **Learning:** it keeps a recency-weighted memory of your last 10 picks per zone band. Its belief is spread over move families, not buttons.
- **Division tables** (`difficulty` in `engine/situation.ts`) set how much it trusts what it has learned, how greedy it is, the softmax temperature, its edge, and its once-per-match boosts.
- **Fairness:** players who mix move families stay hard to read. Predictable players get countered much more in the top division. `tests/pitch-duel-cpu.test.ts` holds this to fixed limits.
- **Attacking picks** are chosen by expected value against its belief about your defending, with a late-game lead/trail bias and a penalty for repeating itself.
- **Squads** come from the shared `generateShootoutOpponent()`, with ratings of about 76–88 by division.

## Club, league and saves

**Club:** a keeper, four outfield players, a formation and up to 3 owned tactic cards. Each tactic card works once per match.

| Formation | Name |
|---|---|
| 2-2 | Balanced |
| 1-2-1 | Diamond |
| 3-1 | Lockdown |
| 1-3 | All-Out |

The first club is drafted from the football loadout and owned cards.

**League:** 3 points for a win, 1 for a draw, with promotion every 9 points up to division 5. Promotion grants an original fictional `pd2-*` card, marked FICTIONAL in the lineup screen. The grant ids are the same as v2, so nobody is rewarded twice. Coins are 120, 75 or 45 per match.

**Saves:**
- The save key is `statoz.games.web.pitch-duel.v3`, and it is included in local account switching.
- A v2 save (`statoz.games.web.pitch-duel.reboot.v2`) is migrated automatically. Points, XP, results, streaks and history (which the streak calendar reads) carry over. The v2 deck becomes the club, and the rules guide shows once more.
- The v2 key is never deleted.

The fictional cards are playable only in Pitch Duel. Real-athlete cards still come from the existing catalog, and their presence does not imply endorsement.

## Mobile

- On phones the shared `MobileGameViewport` gives the game a landscape viewport.
- The match screen fits about 640×360 to 932×430 without scrolling. Player cards scale with the screen height, and every touch target is at least 44px.
- A narrow portrait desktop window gets a stacked layout and is never blank.
- With reduced motion turned on, the flips, pulses and stamps are removed, and every result is still shown as text.

## Verification

- `npm run test:pitch-duel`: engine, CPU and career tests. These include calibration bands for match length, goals and draws.
- `npm run typecheck`, `npm run lint` and `npm run build`.
- `npm run test:mobile-viewport:browser` for the landscape frame.
