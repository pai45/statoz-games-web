import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from '../src/App';
import {destroyEngine, getEngine, onEngine} from '../src/game/engine/runtime';
import {keepAwake} from '../src/game/engine/mobile';
import {store, useStore} from '../src/state/store';
import {authoredStats} from './athletes/assets';
import {inspectAthleteBounds} from './athletes/diagnostics';

declare module '../src/game/engine/Engine' {
  interface Engine {hostPaused: boolean}
}

declare global {
  interface Window {
    __STATOZ_HOST__: {emit(type: string, payload?: unknown): void; command: ((type: string) => void) | null};
    __HOOP_LEGACY__: (options?:{geometry?:boolean}) => unknown;
  }
}

const host = window.__STATOZ_HOST__;
const root = createRoot(document.getElementById('root')!);
let disposed = false;
let suspended = false;

function suspendAudio() {
  const engine = getEngine();
  engine?.commentary.stop();
  void engine?.audio.ctx?.suspend().catch(() => {});
}

function Integration() {
  const screen = useStore(state => state.screen.id);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const pause = () => {
      suspended = true;
      const engine = getEngine();
      if (engine) {
        engine.hostPaused = true;
        engine.input.setEnabled(false);
        engine.input.update();
      }
      suspendAudio();
      setPaused(true);
    };
    host.command = command => {
      if (disposed) return;
      if (command === 'pause') pause();
      // Returning to a visible tab requires an explicit player action.
      if (command === 'dispose') {
        disposed = true;
        const engine = getEngine();
        engine?.audio.stopMusic();
        engine?.audio.stopCrowd();
        void engine?.audio.ctx?.close().catch(() => {});
        root.unmount();
        destroyEngine();
        void keepAwake(false);
      }
    };
    const off = onEngine(engine => {
      engine.hostPaused = suspended;
      host.emit('ready');
    });
    const background = () => {if (document.hidden) pause();};
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', background);
    return () => {
      off();
      window.removeEventListener('blur', pause);
      document.removeEventListener('visibilitychange', background);
    };
  }, []);
  const resume = () => {
    suspended = false;
    const engine = getEngine();
    if (engine) {
      // Discard key-up/touch events queued while the host was suspended.
      engine.input.setEnabled(false);
      engine.input.update();
      engine.hostPaused = false;
      engine.input.setEnabled(!engine.paused);
      void engine.audio.ctx?.resume().catch(() => {});
    }
    setPaused(false);
    host.emit('resume');
  };
  return <>
    <App />
    {(screen === 'title' || screen === 'menu') && <button className="host-return" onClick={() => host.emit('exit')}>Back to Games</button>}
    {paused && <div role="dialog" aria-modal="true" aria-label="Game paused" className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 bg-ink-950/95 text-white">
      <h1 className="font-display text-4xl font-black uppercase italic">Game paused</h1>
      <button autoFocus onClick={resume} className="rounded-full bg-blaze px-8 py-3 font-bold">Resume</button>
      <button onClick={() => host.emit('exit')} className="rounded-full border border-white/30 px-6 py-3">Back to Games</button>
    </div>}
  </>;
}

// Read-only diagnostics used by the integration/browser checks; no debug gameplay shortcuts.
window.__HOOP_LEGACY__ = (options) => {
  const state = store.get();
  const engine = getEngine();
  const activeAthletes:unknown[]=[];
  engine?.scene.traverse(object=>{if(object.userData.authoredAthlete)activeAthletes.push(object.userData.authoredAthlete);});
  return {ready: !!engine, screen: state.screen.id, mode: state.screen.id === 'game' ? state.screen.session.kind : null,
    athletes:{...authoredStats,active:activeAthletes,...(options?.geometry&&engine?{bounds:inspectAthleteBounds(engine.scene)}:{})},
    renderer:engine?{...engine.renderer.info.render,textures:engine.renderer.info.memory.textures,geometries:engine.renderer.info.memory.geometries}:null,
    hostPaused: suspended, paused: engine?.paused, quality: engine?.quality.level,
    input: engine ? {move: {...engine.input.move}, held: {...engine.input.held}, pressed: {...engine.input.pressed}, released: {...engine.input.released}} : null,
    slots: state.slots.map(slot => slot ? {name: slot.player.firstName, chapter: slot.chapter} : null),
    records: state.records, settings: state.settings,
    simulation: engine?.mode ? {name: engine.mode.constructor.name, hud: 'hud' in engine.mode ? engine.mode.hud : null} : null};
};
root.render(<Integration />);
