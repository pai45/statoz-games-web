/* Original local adapter for pinned EmulatorJS 4.2.3. Vendor licences are retained separately. */
(() => {
  'use strict';
  const query = new URLSearchParams(location.search), session = query.get('session');
  if (!session || !/^[a-f0-9-]{20,64}$/.test(session)) throw Error('Missing arcade session');
  const scope = /^[a-f0-9]{24}$/.test(query.get('scope') || '') ? query.get('scope') : 'guest';
  // All persistent emulator databases are isolated by the signed-in host's opaque account scope.
  for (const method of ['open', 'deleteDatabase']) {
    const native = IDBFactory.prototype[method];
    IDBFactory.prototype[method] = function(name, ...args) { return native.call(this, `statoz.retro-football-2.${scope}.${name}`, ...args); };
  }
  // Suppress the pinned vendor's automatic update lookup; all runtime resources are local.
  let Emulator;
  Object.defineProperty(window, 'EmulatorJS', { configurable: true, get: () => Emulator, set: value => { value.prototype.checkForUpdates = () => {}; Emulator = value; } });
  // Pin the native system directory so FBNeo can locate its reviewed cartridge override.
  let GameManager;
  Object.defineProperty(window, 'EJS_GameManager', { configurable: true, get: () => GameManager, set: value => {
    // Pinned external-file loading supplies ArrayBuffer; FS.writeFile needs a byte view.
    const write = value.prototype.writeFile;
    value.prototype.writeFile = function(path, data) { return write.call(this, path, data instanceof ArrayBuffer ? new Uint8Array(data) : data); };
    const config = value.prototype.getRetroArchCfg;
    value.prototype.getRetroArchCfg = function() { return config.call(this) + '\nsystem_directory = "/native"\n'; };
    GameManager = value;
  } });
  const emit = (type, payload = {}) => parent.postMessage({ protocol: 'retro-football-2-local', version: 1, session, type, payload }, location.origin);
  let ready = false, booted = false, disposed = false, pendingStart = false, paused = false, watcher = 0;
  const timers = new Set();
  const held = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (!disposed) fn(); }, ms); timers.add(id); };
  const manager = () => window.EJS_emulator?.gameManager;
  const input = (button, value) => {
    if (!ready || disposed || !Number.isInteger(button) || ![0,1,2,3,4,5,6,7,8].includes(button) || ![0,1].includes(value)) return;
    if (paused && value) return;
    manager().simulateInput(0, button, value);
    if (value) held.add(button); else held.delete(button);
    window.__retroFootball2Debug.lastInput = { button, value };
    window.__retroFootball2Debug.inputCount++;
  };
  const clear = () => { for (const button of held) manager()?.simulateInput(0, button, 0); held.clear(); };
  const pulse = button => { input(button, 1); later(() => input(button, 0), button === 3 ? 600 : 100); };
  const audio = () => {
    const emu = window.EJS_emulator;
    for (const source of emu?.Module?.AL?.currentCtx?.sources || []) source?.gain?.context?.resume?.().catch(() => {});
  };
  const start = () => { if (!booted) { pendingStart = true; return; } pendingStart = false; audio(); pulse(2); later(() => pulse(3), 350); };
  window.__retroFootball2Debug = { ready: false, booted: false, inputCount: 0, lastInput: null, get held() { return [...held]; }, get paused() { return paused; }, get frames() { return manager()?.getFrameNum?.() || 0; }, scope };
  window.__retroFootball2Unlock = audio;
  window.addEventListener('message', event => {
    const message = event.data;
    if (event.source !== parent || event.origin !== location.origin || message?.protocol !== 'retro-football-2-local' || message.version !== 1 || message.session !== session || disposed) return;
    if (message.type === 'input') input(message.button, message.value);
    else if (message.type === 'release') clear();
    else if (message.type === 'start') start();
    else if (message.type === 'coin' && booted) pulse(2);
    else if (message.type === 'start-only' && booted) pulse(3);
    else if (message.type === 'pause') { clear(); paused = true; if (ready) window.EJS_emulator.pause(); }
    else if (message.type === 'resume') { paused = false; if (ready) { audio(); window.EJS_emulator.play(); } }
    else if (message.type === 'volume' && typeof message.value === 'number') window.EJS_emulator?.setVolume(Math.max(0, Math.min(1, message.value)));
    else if (message.type === 'dispose') { clear(); disposed = true; clearInterval(watcher); for (const timer of timers) clearTimeout(timer); manager()?.toggleMainLoop(0); }
  });
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clear(); if (ready) window.EJS_emulator.pause(); emit('interrupted'); } });
  window.addEventListener('error', event => emit('error', { message: event.message || 'The arcade runtime could not start.' }));
  Object.assign(window, {
    EJS_player: '#game', EJS_core: 'fbneo', EJS_gameUrl: 'roms/ssideki2.zip', EJS_biosUrl: 'roms/arcade.7z', EJS_gameName: 'ssideki2', EJS_gameID: 10190,
    EJS_externalFiles: {'/native/fbneo/patched/ssideki2.zip': 'roms/ssideki2-nologo.zip'},
    EJS_pathtodata: 'data/', EJS_startOnLoaded: true, EJS_threads: false, EJS_disableAutoLang: true,
    EJS_disableDatabases: true, EJS_disableLocalStorage: true, EJS_noAutoFocus: true, EJS_volume: 0.65,
    EJS_Buttons: { playPause:false,restart:false,mute:false,settings:false,fullscreen:false,saveState:false,loadState:false,gamepad:false,cheat:false,volume:false,saveSavFiles:false,loadSavFiles:false,quickSave:false,quickLoad:false,screenshot:false,cacheManager:false,exitEmulation:false,contextMenu:false },
    EJS_defaultOptions: { 'shader': 'disabled', 'vsync': 'enabled', 'rewindEnabled': 'disabled', 'ff-ratio': 1, 'fbneo-dipswitch-ssideki2-Free_play': 'On', 'fbneo-allow-patched-romsets': 'enabled' },
    EJS_onGameStart() {
      if (disposed) return;
      ready = true; window.__retroFootball2Debug.ready = true;
      manager().functions.setKeyboardEnabled(0);
      if (window.EJS_emulator.virtualGamepad) window.EJS_emulator.virtualGamepad.style.display = 'none';
      window.EJS_emulator.elements.bottomBar.contextMenu?.[0]?.style.setProperty('display', 'none', 'important');
      if (paused) window.EJS_emulator.pause();
      emit('ready');
      // Native BIOS needs to finish before Coin/Start can be accepted. Count emulated frames, not wall time.
      watcher = setInterval(() => {
        if (disposed || booted || paused) return;
        if (manager().getFrameNum() >= 1200) { booted = true; window.__retroFootball2Debug.booted = true; clearInterval(watcher); emit('booted'); if (pendingStart) start(); }
      }, 100);
    }
  });
  // Convert vendor load failures into a useful shell error rather than an endless loading state.
  later(() => { if (!ready) emit('error', { message: 'Retro Football 2 could not load its local game and emulator files. Retry loading.' }); }, 90000);
})();
