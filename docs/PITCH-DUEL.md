# Pitch Duel (Future Web Games)

Pitch Duel is a landscape-first solo football card game at `/play/pitch-duel`. Its rules, UI, and save live in `src/features/games/pitch-duel-next`. The old four-round engine and v1 records remain for historical compatibility; the launcher mounts the new game.

## Game loop

- Build a club from two owned attackers, two owned defenders, a keeper, and eight unique owned tactics: three attack, three defence, two flexible.
- A match has six highlights, alternating attack and defence. Each presents eligible players, up to three compatible unused tactics, and four routes or responses.
- Player traits, tactic style, route, consecutive successful style, and a correct defensive read contribute to the decision. A successful attack scores; a failed defence concedes. A played tactic leaves the hand, leaving two cards unused at full time.
- Wins grant three league points, draws one. Every nine points promotes the club, up to division five. Promotion grants an original fictional player card. Matches grant coins through the existing economy ledger.

## Collection and saves

The first visit drafts a new deck from the existing football loadout and owned cards. If the collection lacks the two flexible tactics, a one-time guaranteed grant supplies bronze tactics. Owned cards, IDs, rarity, pack inventory, and the old football deck are preserved. The new Pitch Duel record uses `statoz.games.web.pitch-duel.reboot.v2`, included in local account switching. Historical v1 Pitch Duel results remain in their original key and are not added to the new league.

The four promotion cards (`pd2-*`) are fictional, visibly identified in the Pitch Duel club screen, and playable only in Pitch Duel. Real-athlete cards continue to come from the existing catalog; their presence does not imply endorsement.

## Verification

Run `npx tsx --test tests/pitch-duel-next.test.ts`, `npm run typecheck`, `npm run lint`, and `npm run build`. The web browser may not permit orientation locking, so portrait mode presents a rotate prompt. Match presentation supports browser reduced-motion settings through the absence of required animation timing; results are decided synchronously by the rules engine.
