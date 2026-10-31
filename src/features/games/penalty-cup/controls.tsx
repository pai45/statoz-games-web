import { useState, type PointerEvent } from 'react';
import styles from './screen.module.css';

export function AimStick({onAim,disabled,label}:{onAim:(x:number,y:number)=>void;disabled:boolean;label:string}){
 const [position,setPosition]=useState({x:0,y:0});
 const move=(e:PointerEvent<HTMLDivElement>)=>{if(disabled||!e.currentTarget.hasPointerCapture(e.pointerId))return;const r=e.currentTarget.getBoundingClientRect(),rotated=innerHeight>innerWidth&&!!e.currentTarget.closest('[data-cup-landscape]'),dx=(e.clientX-r.left-r.width/2)/(r.width*.35),dy=(e.clientY-r.top-r.height/2)/(r.height*.35),x=rotated?dy:dx,y=rotated?dx:-dy,length=Math.max(1,Math.hypot(x,y)),p={x:x/length,y:y/length};setPosition(p);onAim(p.x,p.y);};
 const reset=()=>{setPosition({x:0,y:0});onAim(0,0);};
 return <div className={styles.stickWrap}><div className={styles.stick} role="group" aria-label={`${label} virtual stick`} aria-disabled={disabled} onPointerDown={e=>{if(disabled)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);move(e);}} onPointerMove={move} onPointerUp={reset} onPointerCancel={reset} onLostPointerCapture={reset}><i style={{transform:`translate(${position.x*26}px,${-position.y*26}px)`}}/></div><small>{disabled?'AIM LOCKED':label}</small></div>;
}
export function DivePad({onDive,disabled}:{onDive:(x:number,y:number)=>void;disabled:boolean}){
 const [choice,setChoice]=useState('');
 const dive=(x:number,y:number)=>{setChoice(`${x}:${y}`);onDive(x,y);};
 return <div className={styles.divePad} role="group" aria-label="Goalkeeper dive controls">{[[-1,1,'↖'],[0,1,'↑'],[1,1,'↗'],[-1,0,'←'],[0,0,'HOLD'],[1,0,'→'],[-1,-1,'↙'],[0,-1,'↓'],[1,-1,'↘']].map(([x,y,label])=><button key={`${x}:${y}`} disabled={disabled} aria-pressed={choice===`${x}:${y}`} aria-label={x===0&&y===0?'Hold centre':`Dive ${Number(x)<0?'left':Number(x)>0?'right':'centre'} ${Number(y)>0?'high':Number(y)<0?'low':'middle'}`} onPointerDown={e=>{e.preventDefault();dive(Number(x),Number(y));}} onClick={e=>{if(e.detail===0)dive(Number(x),Number(y));}}>{label}</button>)}</div>;
}
