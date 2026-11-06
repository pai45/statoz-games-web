# Athlete asset toolchain

Offline pipeline that authors Hoop Legacy's athletes from CC0 sources and ships them as compressed
glTF and KTX2 files in `public/athletes/`. It runs on a developer machine or in the Make sandbox,
never at app runtime. The runtime loader is `src/game/world/athlete/assets.ts`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm athletes:fetch` | Downloads the pinned inputs from `sources.json` into `.cache/athletes/` and verifies them against `sources.lock.json`. Pass names to fetch a subset: `blender`, `ktx`, `makehuman`, `systemAssets`. |
| `pnpm athletes:build` | Exports the rig, runs the Blender stages headless, then packs. Options: `--only a,b` (stages), `--force` (ignore stamps), `--skip-pack`. |
| `pnpm athletes:check` | Validates `public/athletes/` against `contract.json`: file hashes and sizes, budgets, licenses, bone, morph and slot names, print zones, stale or unreferenced files. Exits non-zero on any violation. |

Regenerate everything from a clean checkout:

```bash
pnpm install
pnpm athletes:fetch          # ~650 MB download, ~1.4 GB in .cache/athletes
pnpm athletes:build
pnpm athletes:check
```

Then commit `public/athletes/`, `public/basis/` and any changed `tools/athletes/` files.

## Layout

```
tools/athletes/
  sources.json        pinned inputs (URLs, commit SHA, file list, license)
  sources.lock.json   generated: sha256, size, license and retrieval date of every input
  contract.json       bones, levels, slots, morph names, texture channels, print zones, budgets
  fetch.mjs           pnpm athletes:fetch
  export-rig.ts       writes build/rig.json from src/game/world/character/rig.ts
  build.mjs           pnpm athletes:build (stage runner with input-hash stamps)
  pack.mjs            gltf-transform + meshoptimizer + toktx -> public/athletes
  check.mjs           pnpm athletes:check
  lib/paths.mjs       shared paths
  blender/common.py   shared Blender helpers (axes, armature, skinning, shape keys, export)
  blender/*.py        one script per stage
  build/              gitignored intermediate output (GLB, PNG, meta/*.json, stamps)
.cache/athletes/      gitignored downloads: blender/, ktx/, makehuman/, mhsys/, dl/
public/athletes/      shipped: <level>/<asset>.<hash>.glb, <level>/tex/<name>.<hash>.ktx2,
                      manifest.json, LICENSES.md, sources.lock.json
public/basis/         shipped: three.js Basis transcoder (basis_transcoder.js/.wasm)
```

## Pinned inputs

| Input | Version | License | Shipped? |
| --- | --- | --- | --- |
| Blender | 4.2.23 LTS, Linux x64 (sha256 from blender.org) | GNU GPL | No (build tool) |
| KTX-Software (`toktx`) | 4.4.2, Linux x86_64 | Apache-2.0 | No (build tool) |
| MakeHuman assets | `makehumancommunity/makehuman` at `a8bc2d54`: `base.obj`, selected targets, high-poly eyes | CC0 1.0 (`LICENSE.ASSETS.md`) | Derived data only |
| MakeHuman system assets | `makehuman_system_assets_cc0.zip`: brows, lashes, teeth, eye textures, proxies, skins | CC0 1.0 (per-asset `license` in `packs/makehuman_system_assets.json`) | Derived data only |

Only MakeHuman **asset data** is used. MakeHuman's program code is AGPL and is neither used nor
shipped; the Blender scripts parse `.obj`, `.target` and `.mhclo` files themselves.

To change an input, edit `sources.json`, delete its entry in `sources.lock.json`, and re-run
`pnpm athletes:fetch`. A hash mismatch against the lock always fails the fetch.

## Contracts

### Space and rig

- **Units:** normalized, athlete height = 1. The runtime scales the rig object by the player's
  height in metres.
- **Axes:** three.js, Y up, the athlete faces +Z, the athlete's left is +X. Blender scripts author in
  three.js coordinates and convert with `common.to_bl` (three `(x, y, z)` to Blender `(x, -z, y)`);
  the glTF exporter (`export_yup`) converts back.
- **Bind pose:** the rig's A-pose: arms abducted `ARM_A` = 0.6 rad, legs `LEG_A` = 0.12 rad. Joint
  positions come from `build/rig.json`, generated from `rig.ts`; never hand-copy rig numbers.
- **Bones** (index order = `B` in `rig.ts`): `hips, spine, chest, neck, head, upperArmL, forearmL,
  handL, upperArmR, forearmR, handR, thighL, shinL, footL, thighR, shinR, footR, clavicleL,
  clavicleR`. glTF joint order does not matter: the loader remaps joints to rig indices by name.
- **Skinning:** at most 4 influences per vertex, weights normalized.
- **Rest state:** export with the armature in its rest pose. The loader bakes the exact rest-pose
  skinning transform (`world * bindMatrixInverse * boneMatrix * bindMatrix`) into the geometry,
  which also absorbs the dequantization that meshopt folds into the inverse bind matrices. The
  scene graph is discarded.
- **UVs:** within [0, 1] (quantized texcoords have no material to carry a texture transform).

### Levels and slots

Levels: `lod1` (low tier and medium handhelds), `lod0` (desktop gameplay), `hero` (close-ups,
lazy-loaded). Each asset fills one slot (see `contract.json`):

| Slot | Morphs | Notes |
| --- | --- | --- |
| `body` | `build_lean`, `build_heavy`, `build_muscular` | driven continuously from `bulk` |
| `head` | `face_*` (about 28) | cranium targets capped at ±4% |
| `eyes`, `brows`, `lashes`, `teeth` | (head morphs transferred where needed) | teeth hidden by default |
| `jersey`, `shorts` | build morphs | cloth-simulated per build key |
| `shoes` | none | weighted to the foot bones |
| `hair` | none | `variant`: one of the 9 `HairStyle` values with geometry (`bald` has none) |
| `facialHairCards` | none | `variant`: `beard` or `full`, hero only |
| `headband`, `wristbands` | none | gear |
| `smoke` | `smoke_inflate` | Phase 0 pipeline test, lab only, excluded from budgets |

### Texture channels

Texture roles and their channel meanings are listed in `contract.json` under `textures`, for
example `skinDetail` (R luminance variation, G redness/flush, B melanin/darkening, A lips),
`clothMask` (R base, G trim, B trim2, A panel/piping) and `shoeMask` (R upper, G accent, B midsole,
A outsole). Codecs: normal maps UASTC + zstd (linear), color ETC1S (sRGB), masks ETC1S (linear).

### Print zones

Uniform assets carry `extras.printZones`: `{ zone: [x, y, w, h] }` in UV space (origin top-left),
for `jersey_front_number`, `jersey_front_wordmark`, `jersey_back_name`, `jersey_back_number`,
`shorts_left_logo` and `shorts_right_number`. Rectangles must lie in [0, 1] and must not overlap.

### Budgets (per athlete; enforced by `athletes:check`)

| Level | Triangles | Draw calls | Download |
| --- | --- | --- | --- |
| `lod1` | ≤ 55k | ≤ 8 | ≤ 4 MB |
| `lod0` | ≤ 110k | ≤ 9 | ≤ 8 MB |
| `hero` | ≤ 300k | ≤ 10 | ≤ 20 MB |

The athlete total counts every slot once, using the most expensive variant of slots with variants.

## Manifest schema (`public/athletes/manifest.json`)

```jsonc
{
  "version": 1,
  "bones": ["hips", "spine", ...],            // must equal the rig table
  "levels": {
    "lod0": {
      "bytes": 123456,                          // GLBs + textures of this level
      "assets": {
        "<name>": {
          "slot": "body", "variant": null, "license": "CC0-1.0 ...",
          "glb": { "file": "lod0/body.<hash>.glb", "bytes": 0, "sha256": "..." },
          "triangles": 0, "vertices": 0, "drawCalls": 1,
          "meshes": [{ "name": "body", "morphs": ["build_lean", ...] }],
          "joints": ["hips", ...],
          "textures": { "<role>": "<texture stem>" },
          "extras": { "printZones": { ... }, "anchors": { ... } }
        }
      },
      "textures": {
        "<stem>": { "file": "lod0/tex/<stem>.<hash>.ktx2", "bytes": 0, "sha256": "...", "codec": "etc1s", "srgb": true }
      }
    }
  },
  "license": { "summary": "...", "file": "LICENSES.md", "sources": "sources.lock.json" }
}
```

File names are content-hashed, so browsers can cache them indefinitely; only `manifest.json` is
revalidated.

## Writing a Blender stage

1. Add `blender/<stage>.py`. Start with `sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))`
   and `import common`; read `--rig`, `--build` and `--cache` with `common.args()`.
2. Build an armature with `common.build_armature(rig)`, meshes with `common.make_mesh` (three.js
   coordinates), weights with `common.skin_to`, morphs with `common.add_shape_keys`, and export with
   `common.export_glb(build/<level>/<asset>.glb, ...)`. Save textures as PNG under
   `build/textures/<level>/`.
3. Write `build/meta/<asset>.json` with `common.write_meta`: `name`, `slot`, optional `variant`,
   `license`, and per level the `glb` path, `textures` (`{ role: { file, codec, srgb } }`) and
   `extras`.
4. Register the stage in `STAGES` in `build.mjs`, with any extra input files that should invalidate
   it.

## Troubleshooting

- **Downloads:** `fetch.mjs` uses `curl` with retries rather than `fetch()`, because Node 22's
  undici can hit an uncatchable internal assertion when many streamed downloads run in parallel.
- **`toktx` libraries:** `toktx` needs `.cache/athletes/ktx/lib` on `LD_LIBRARY_PATH`; `pack.mjs`
  sets it.
- **Disk:** Blender takes about 1.3 GB extracted. Archives are deleted after extraction; the
  system-asset zip is kept in `.cache/athletes/dl/` so members can be re-extracted.
