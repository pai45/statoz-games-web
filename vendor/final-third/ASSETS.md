# Asset sources

| File | Source | Licence / status |
|---|---|---|
| `public/assets/athlete.glb` | Built by `art/author-motion.py` from `art/source/athlete-base-v5.blend` (copy of `statoz-games-web/docs/penalty-shootout/assets/athlete-source-v5.blend`, runtime `character-model-5`): StatOz-authored rig, kits, gloves and 35 clips on Blender Studio's Human Base Meshes v1.4.1, plus 23 original movement clips and a shoulder re-weight authored in this project. | Base mesh CC0-1.0. StatOz adaptation approved for local StatOz games. New clips are code-authored poses; no external or reference-game motion data. Kit colours, numbers and the two club identities are recoloured at runtime. |
| Motion capture in `public/assets/athlete.glb` (run, jog, walk, shots; more as added) | CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), BVH conversion via github.com/Shriinivas/cmubvh: trials 16_46, 16_35, 16_15, 10_02. Mixamo (Adobe) clips listed in `art/retarget-spec.json` once downloaded. Retargeted onto the StatOz rig by `art/retarget.py`. | CMU: free for any use (credit appreciated: "The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217."). Mixamo: royalty-free use in projects under Adobe's terms; raw files are not redistributed (kept in gitignored `art/mocap/`). |
| `public/assets/audio/kick.wav`, `goal.wav`, `whistle.wav`, `glove.wav`, `frame.wav`, `result.wav` | Copied from the same Penalty Shootout audio folder. | Original deterministic StatOz synthesis. |
| `public/assets/audio/crowd.ogg` | "Stadium Crowd" by stomachache, freesound.org/people/stomachache/sounds/274516/ (via Penalty Shootout). | CC0-1.0. |
| Pitch, lines, goal, net, stands, crowd, ad boards, ball design, HUD | Drawn in code in this project. | Original. |
| Barlow Condensed font | Loaded from Google Fonts at runtime. | SIL Open Font License 1.1. |

Club names ("Harbour Blues", "Redmoor Athletic") and board slogans are invented.
Production assets contain no reference-game files. The private development preview can mount the existing Soccer REAL study copy outside this project, including its character, native clips and team/keeper atlases. These files are copyrighted by splax.net; no redistribution rights are recorded. They are excluded from production builds. See `art/soccer-real-study.json` and the README local-study section.
