/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy debug state/optional offline host are external boundaries. */
/** A DOM shell around existing controls. Every gameplay button retains its owner,
 * event handlers and simulation action; no secondary input or scoring engine.
 */
export function installCricketConsole() {
  const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const old = document.querySelector('body > main')!;
  const shell = document.createElement('main');
  shell.id = 'console';
  shell.setAttribute('aria-label', 'StatOz handheld cricket console');
  shell.innerHTML = `
    <header class="console-top"><span class="console-wordmark">STATOZ <b>POCKET CRICKET</b></span>
      <span class="console-private">PRIVATE PREVIEW</span>
      <nav aria-label="Console"><button id="console-fullscreen" aria-label="Enter fullscreen">FULLSCREEN</button><button id="console-menu" aria-haspopup="dialog">MENU</button><button id="console-exit">EXIT</button></nav>
    </header>
    <div class="console-body">
      <section class="grip grip-left" aria-label="Movement and running">
        <p class="grip-label">DIRECTION</p><div id="console-pad" class="console-pad"></div>
        <div id="console-left-actions" class="console-left-actions"></div>
        <div class="speaker" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </section>
      <section class="screen-bay" aria-label="Cricket screen">
        <div class="screen-lip"><span><i></i> MATCH / LIVE</span><span id="console-score" aria-label="Match score"></span></div>
        <div id="console-display"></div>
        <div class="screen-caption"><span id="console-cue"></span><span id="console-over"></span></div>
      </section>
      <section class="grip grip-right" aria-label="Batting and bowling">
        <p class="grip-label">STROKES</p><div id="console-strokes" class="console-strokes"></div>
        <div id="console-right-actions" class="console-right-actions"></div>
        <div class="speaker" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </section>
    </div>
    <footer class="console-bottom"><span id="console-feedback" role="status"></span><span class="keyboard-hint">A / D / S · SPACE · R RUN</span></footer>
    <p class="rotate-hint">Rotate your phone to landscape for the full console.</p>
    <dialog id="console-dialog" aria-labelledby="console-dialog-title"><header><h2 id="console-dialog-title">MATCH MENU</h2><button id="console-close">RETURN TO GAME</button></header>
      <p>Six legal balls or three wickets per innings. Bat first, then bowl and field to defend your score. The source-style score reads wickets / runs.</p>
      <div id="console-settings"></div><details><summary>Controls &amp; reference notes</summary><p>A / D / S: leg / off / defend. Space follows the indicated stroke. Hold Q / E for loft / power. R runs, V reverses. Arrows move guard before release and steer the selected fielder when defending. J / K select the return end. C switches fielders. Esc pauses.</p><p>Source-derived reference art; private preview. Keeper receives and holds. Keeper pursuit, throw and dive remain unfinished. Frame holds and shortened rules are authored adaptations.</p></details>
      <p id="console-error" role="alert"></p></dialog>`;
  document.body.appendChild(shell);
  const move = (id: string, parent: string, label?: string) => {
    const element = get(id); if (!element) return;
    if (label) { element.setAttribute('aria-label', label); element.dataset.consoleLabel = label; }
    get(parent).appendChild(element);
  };
  for (const [id, label] of [['up','Up'],['left','Left'],['right','Right'],['down','Down']]) move(id, 'console-pad', label);
  for (const id of ['run','reverse','loft']) move(id, 'console-left-actions');
  for (const id of ['stroke-leg','stroke-off','stroke-defend']) move(id, 'console-strokes');
  for (const id of ['primary','power','throwS','throwB','switch']) move(id, 'console-right-actions');
  move('viewport','console-display');
  // A hidden legacy host retains IDs used by the original state renderer. There is
  // still one control of each kind and one authoritative input binding.
  old.setAttribute('aria-hidden', 'true'); (old as HTMLElement).hidden = true;
  for (const id of ['pause','restart','bowlControls','sfx','music','volume','record','fatal']) move(id,'console-settings');
  const volume = get<HTMLInputElement>('volume'); volume.setAttribute('aria-label','Audio volume');
  const volumeLabel=document.createElement('label');volumeLabel.textContent='Audio volume';volume.before(volumeLabel);volumeLabel.appendChild(volume);
  const dialog = get<HTMLDialogElement>('console-dialog');
  let before: HTMLElement | null = null;
  let resumeOnClose = false;
  const pauseIfPlaying = () => {
    const s = window.gameState as any;
    if (s?.status === 'playing' && !s.paused) get<HTMLButtonElement>('pause').click();
  };
  const openMenu = () => { before = document.activeElement as HTMLElement;const s=window.gameState as any;resumeOnClose=s?.status==='playing'&&!s.paused;pauseIfPlaying(); if (!dialog.open) dialog.showModal(); };
  const closeMenu = () => { dialog.close();const s=window.gameState as any;if(resumeOnClose&&s?.paused)get<HTMLButtonElement>('pause').click();resumeOnClose=false;before?.focus(); };
  get('console-menu').onclick = openMenu;
  get('console-close').onclick = closeMenu;
  // Closing an explicitly opened menu resumes only the pause owned by that menu.
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(); }
  });
  get('console-exit').onclick = () => {
    pauseIfPlaying();
    const embedded = (window as any).__STATOZ_HOST__;
    if (embedded) embedded.emit('exit');
    else if (window.parent !== window) window.parent.postMessage({type:'statoz.games.web.retro-innings:exit',version:1},window.location.origin);
    else { openMenu(); get('console-error').textContent='Standalone preview. Close this tab to exit, or return to the game.'; }
  };
  get('console-fullscreen').onclick = async () => {
    try {
      if (document.fullscreenElement) { await document.exitFullscreen(); return; }
      await document.documentElement.requestFullscreen();
      const orientation = screen.orientation as ScreenOrientation & {lock?: (value: string) => Promise<void>};
      try { await orientation.lock?.('landscape'); } catch { /* Browser may require manual rotation. */ }
    } catch {
      get('console-fullscreen').textContent='FILL SCREEN';
      get('console-fullscreen').title='This browser uses the fitted viewport; rotate to landscape and hide browser controls for more space.';
    }
  };
  const fit = () => {
    const box = get('console-display').getBoundingClientRect();
    const available = Math.min(box.width / 256, box.height / 224);
    // Integer scale when there is room. Fractional nearest-neighbour fitting on
    // short phones avoids the old 1x/224px cap while preserving 8:7 geometry.
    const scale = available >= 2 ? Math.floor(available) : available;
    for (const id of ['game','referenceGame']) {
      const canvas = get<HTMLCanvasElement>(id);
      if (canvas) { canvas.style.width = Math.floor(256 * scale) + 'px'; canvas.style.height = Math.floor(224 * scale) + 'px'; }
    }
  };
  const observer=new ResizeObserver(fit);observer.observe(get('console-display'));
  const sync = () => {
    const s=window.gameState as any;if(!s)return;
    get('console-score').textContent=(s.innings===1?'HARBOUR':'ORCHARD')+' '+s.wickets+'/'+s.runs+' WKTS/RUNS';
    get('console-over').textContent=Math.floor(s.legal/6)+'.'+s.legal%6+' OV'+(s.target?' · T'+s.target:'');
    get('console-cue').textContent=s.paused?'PAUSED':s.battingCue?.text||'';
    get('console-feedback').textContent=s.message;
    shell.dataset.innings=String(s.innings);shell.dataset.phase=s.phase;shell.dataset.paused=String(s.paused);
    for(const id of ['throwS','throwB','switch'])get(id).hidden=s.innings!==2||!s.ball?.hit;
    for(const id of ['stroke-leg','stroke-off','stroke-defend','run','reverse','loft','power'])get(id).hidden=s.innings!==1;
    fit();
  };
  const dispose=()=>{observer.disconnect();};
  window.addEventListener('pagehide',dispose,{once:true});
  document.addEventListener('fullscreenchange',()=>{get('console-fullscreen').textContent=document.fullscreenElement?'WINDOWED':'FULLSCREEN';fit();});
  fit();sync();return {fit,sync,dispose};
}
