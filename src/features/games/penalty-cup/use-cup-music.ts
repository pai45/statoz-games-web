import { useEffect, useRef, useState } from 'react';
import { CupMusic } from './music';

export function useCupMusic({volume,muted,match,matchPaused,hostCommand}:{volume:number;muted:boolean;match:boolean;matchPaused:boolean;hostCommand?:{id:number;type:'pause'|'resume'|'dispose'}}){
  const music=useRef<CupMusic|null>(null),hostPaused=useRef(false),interacted=useRef(false);
  const [state,setState]=useState<'locked'|'playing'|'muted'|'paused'>('locked');
  const config=useRef({volume,muted,match,matchPaused});
  useEffect(()=>{
    const audio=new CupMusic(setState);music.current=audio;
    const update=()=>{const c=config.current;audio.configure(c.volume,c.muted,c.match,document.hidden||hostPaused.current||(c.match&&c.matchPaused));};
    const unlock=()=>{interacted.current=true;update();void audio.unlock();};
    const visibility=()=>{update();if(!document.hidden&&interacted.current)void audio.unlock();};
    document.addEventListener('pointerdown',unlock,true);document.addEventListener('keydown',unlock,true);document.addEventListener('visibilitychange',visibility);
    return()=>{document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true);document.removeEventListener('visibilitychange',visibility);audio.dispose();music.current=null;};
  },[]);
  useEffect(()=>{
    config.current={volume,muted,match,matchPaused};
    if(hostCommand)hostPaused.current=hostCommand.type!=='resume';
    music.current?.configure(volume,muted,match,document.hidden||hostPaused.current||(match&&matchPaused));
    // Resume is still subject to the browser's first-interaction audio policy.
    if(interacted.current&&!hostPaused.current&&!document.hidden)void music.current?.unlock();
  },[volume,muted,match,matchPaused,hostCommand]);
  return state;
}
