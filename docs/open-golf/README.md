# Open Golf

Original game by Michael Gerdes: https://github.com/mgerdes/Open-Golf (MIT).

The original public golf.js, golf.worker.js and golf.wasm remain unchanged with SHA-256 provenance. The shipped game uses golf-mobile.js and golf-mobile.wasm, rebuilt from source revision b9029f1e80c3110ae3d4fc9300854bdaeef96508 using Emscripten 3.1.64. Asset loading and GPU finalization run synchronously on the render thread, without pthread workers, shared memory, cross-origin isolation or a service-worker reload. This addresses startup failure in Android WebView and non-isolated browser frames. Courses, physics, graphics and controls remain upstream. Course loading may briefly block rendering.

The compiler stack is explicitly 5 MB (matching the original toolchain), with ordinary growable WebAssembly memory up to 256 MB. A smaller stack can crash during nested UI/GIF initialization. The adapter embeds runtime bytes, preserves account-scoped storage and lifecycle handling, and makes no remote game requests during play.

Routes: /?sport=golf, /games/golf, /play/open-golf. Build: node scripts/build-game-bundles.mjs --game=open-golf. The downloadable bundle embeds all bytes in embedded-games/open-golf/index.html and is included in the device asset manifest.

To rebuild, extract vendor/open-golf/upstream-source.zip to a scratch source directory and install/activate Emscripten 3.1.64 locally. Run python scripts/rebuild-open-golf-mobile.py --source <extracted-source-root> --sdk <emsdk-directory> --output <scratch-build-directory>. Copy golf.js/golf.wasm to vendor/open-golf/golf-mobile.js/golf-mobile.wasm, update their hashes in provenance.json, then rebuild the game bundle. The script records the source adaptation; it leaves the source archive unchanged. No cross-project synchronization is used.

Local verification covers startup in a non-isolated srcdoc frame with SharedArrayBuffer unavailable, course rendering, storage and pause/resume/dispose. Physical-device validation remains required. No publication is performed.

Third-party notices and the source archive preserve upstream attribution.
