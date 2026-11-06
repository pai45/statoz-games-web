# Yorker credits

Yorker is an original bowling game. Its simulation (ball flight, batter AI, fielding, LBW and ball tracking), rules,
interface, stadium, crowd, kits, authored bowling/fielding/umpiring motion and synthesised impact sounds were made for
this project. Third-party files are listed in PROVENANCE.json with source URLs, licences and SHA-256 hashes.

## Players (CC BY 4.0)

All players are adapted from **Virat Kohli Cricket Batting Animation - Low Poly** by **bhagathartworks**, licensed under
CC BY 4.0. The same texture-free runtime body ships with Cricketer in this repository.

- Model: https://sketchfab.com/3d-models/virat-kohli-cricket-batting-animation-low-poly-a21f5e7ee14f4b6aa5cf6c94a1016932
- Author: https://sketchfab.com/bhagathartworks
- Licence: https://creativecommons.org/licenses/by/4.0/ (supplied notice preserved in PLAYER-LICENSE.txt)

Changes: no source textures ship. The body is repainted in fictional Yorker kits and refined with shared subdivision
and camera-selected detail levels. The source's head, hair, beard and fragmented shirt/collar patches are replaced at
runtime by original anatomical heads and continuous skeleton-weighted jerseys; facial features, headwear fitting,
fabric surfaces, fictional crests, names/numbers and laces are original work. Players do not represent any real person, team or brand. Bowling, keeping,
fielding, running and umpire signals are original motion authored on the same credited rig; the preserved batting
cycle drives shots with bat-to-ball constraints. The licensed source GLB and its notice remain unchanged.

## Original refinement assets

Anatomical head topology, facial features, hair and beard profiles, continuous jerseys, fitted collars/caps/hats, textile and willow maps,
fictional uniform artwork, spectator atlas, pitch marks and surface detail, stadium structure and pavilion detailing
are authored procedurally in `src/features/games/yorker/`. They are generated locally with no third-party image,
face, team, sponsor or brand content and no remote runtime requests. The CC0 gear geometry below is preserved, with
original material treatments for lacquer, leather, padding, rubber, wood grain and stitching.

## CC0 models (3DAssets.dev, Cricket Ground and Pavilion pack)

Three Stump Wicket, Bail Pair, Cricket Helmet, Cricket Bat, Batting Pad Pair, Batting Glove Pair, Wicketkeeping Glove
Pair and Seamed Cricket Ball. CC0 1.0 Universal. https://creativecommons.org/publicdomain/zero/1.0/

## CC0 skies and textures

- Skies: Poly Haven HDRIs (tonemapped, downscaled): Kloofendal 48d Partly Cloudy (Pure Sky) by Greg Zaal and Jarod Guest,
  Belfast Sunset (Pure Sky) and Qwantani Night (Pure Sky). CC0. https://polyhaven.com
- Grass 005 and Ground 102 colour maps: ambientCG. CC0. https://ambientcg.com

## CC0 crowd recordings (freesound.org)

- Crowd Talking Quietly Stadium by FunWithSound (381373)
- Crowd Cheer by FoolBoyMedia (397434)
- Short Crowd Cheer by qubodup (182571)
- Crowd Sigh In Disappointment by ShangusBurger (763880)
- Large crowd applause by Bansemer (160493)

Trimmed, mixed to mono and loudness-normalised. All CC0 1.0.

## Fonts and libraries

Barlow Condensed: SIL OFL 1.1 (OFL-barlow-condensed.txt). Three.js, React and React DOM: MIT (see the shared LICENSES.txt).
