# Open Golf

Original browser runtime by Michael Gerdes: https://github.com/mgerdes/Open-Golf (MIT).

The exact public golf.js, golf.worker.js and golf.wasm bytes are vendored with SHA-256 provenance. The inspected source revision is b9029f1e80c3110ae3d4fc9300854bdaeef96508; this is recorded separately from the precompiled public browser build. Gameplay, course data, physics, graphics and controls remain upstream. The adapter embeds runtime bytes, binds lifecycle events and redirects persistent storage into the existing account-scoped bundle host. No remote game requests occur during play.

Golf is a game category, separate from card/deck sports. Routes: /?sport=golf, /games/golf, /play/open-golf. Cover is an actual local game capture.

Build: node scripts/build-game-bundles.mjs --game=open-golf. Full build and device manifest include the game automatically. The existing downloadable game bundle contains all bytes in embedded-games/open-golf/index.html.

The original pthread WebAssembly build requires SharedArrayBuffer and cross-origin isolation. The local server supplies headers on the golf route. On static hosting the existing game asset service worker adds equivalent headers to golf navigation, with one reload on first launch. Browsers without that capability show a clear error. Android/iOS WebView support has not been verified. No native Flutter import or publication is performed.

Third-party notices and the source archive preserve upstream attribution. Local changes only.
