# Cricketer character remake — 1 November 2026

The previous player used separate cylinder/sphere body parts. The remake uses the supplied **Indian Cricket Player Rigged** body/face as a continuous skinned mesh, with original Cricketer kits/equipment and selected motion from the retained Stick Cricket character conversion. The maintained runtime is Future Games Web. Original source files in Downloads and the installed Stick Cricket game were not edited.

## Sources and REA evidence

| Source | Verified facts |
| --- | --- |
| User GLB | 1,325,344 bytes; SHA-256 `b14ca1dd8f7e3fb01f36b04e7dab808fda26566a35f587040bc375317608a341`; 10 meshes, 10,749 triangles, 83 skin joints, no supplied animation clips |
| User ZIP | SHA-256 `eaec752ac8cce1b52d7aaa602feecc5315156e248b4e910805c939cd4ac283fc`; glTF, binary buffer, textures and credit/license file; CC-BY-4.0 / numaan.k99 |
| Retained native conversion | Original research GLB SHA-256 `c35cc760640c566314104dc40fdbe93127ff2498f91c44bc60935c2d99955824`; 51 native-curve-derived clips; source models are research only |
| Motion-only runtime selection | 1,218,496 bytes; SHA-256 `8bb1bd776f9162e9a528f87952ac2d8b608a10accf3b23cefb057acd22b80801`; 10 selected clips, hierarchy and animation buffers; no native meshes, skins, material maps or audio |

REA inspected the supplied ZIP as an archive and the separate local research snapshot of the retained Stick Cricket conversion. Evidence IDs: `ev_6c9b61163a7266c131222659ecfa423f28baeeccf69f4b8605f13a88301a8326` and `ev_1c0a5087db1c5f5fbefa51101144d2701b466961a6b03e7a2d4e720a6e8f1479`. Exported canonical receipts are in Designer's `output/research/cricketer-character-remake-2026-11-01`. Those REA inventories establish archive coverage and byte identities; they do not establish glTF animation behavior. Additional format-aware glTF parsing and local Three.js renders supplied bone, geometry and runtime observations.

The native research snapshot is a wrapper around the already retained conversion, not a claim to have recovered the original Unity project. Its source curves were re-solved through Unity2022; original Unity6000 controller state, hand/foot IK and four unresolved intro bindings are not recovered by this remake. The selected ten clips avoid those intros. Local source notices remain in force.

## Design and animation changes

- Modeled face, beard, hair, torso, elbows, knees, hands, clothing and shoes replace disconnected body shapes. Sunglasses are hidden; iris/pupil details make the uncovered eyes legible. Batting hair is hidden under the fitted helmet.
- Original red/ivory batting kit and green fielding kit replace the supplied national-kit maps. Original numbered lettering is sampled in the bind surface and follows skin deformation, without a floating number plate.
- The helmet has a fitted shell, peak and modeled grille. Pads have separate ribs, knee rolls and straps. Glove surfaces, finger padding and cuffs follow the hand/finger bones. The bat has a tapered shoulder, rounded toe, rear spine and grip rings.
- Ten native-curve-derived clips provide six stroke families, stance/backlift, ambient and victory material. Geometric bone-frame mapping transfers their motion to the supplied proportions. A contact-pose correction, two-bone arm constraints and planted-foot crouch keep the wrist targets reachable without extending bone lengths. Original role poses drive bowling, fielding and running on the skin.
- Static field/ready poses are reused. Animation uses simulation time and does not consume match RNG. Existing game rules, input bindings, progression and save schema remain unchanged.

## Validation and limits

`npm run test:cricketer:characters` renders front/back/side views and all six contact/follow-through families. Thirty contact cases cover six shots at 0.22, 0.45, 0.75, 1.10 and 1.32m heights. All posed bounds are finite, both feet remain near the ground (sampled minimum −2.8mm), and the analytic wrist-to-grip target errors are below 1mm. This is an IK target check plus visual review; it is not a measurement of every finger's physical contact.

The existing gameplay suite also checks the actual 83-bone skinned rig and contact targets while completing the lessons and all twelve chases. Unit, browser and production-build results are recorded in `CRICKETER-VALIDATION.md`. Screenshots and JSON evidence are under `test-results/cricketer-characters`, `test-results/cricketer` and `test-results/cricketer-app`.

The shared model is CC-BY-4.0 with the author/model/license credit retained in files, the menu and bundle notices. Stick Sports motion has no independently established redistribution license; the user explicitly authorized this GitHub Pages release. Do not treat the model license as a license for the motion. No Flutter import is included. Physical-phone/WebView acceptance remains pending. Native animation/controller equivalence is not claimed.
