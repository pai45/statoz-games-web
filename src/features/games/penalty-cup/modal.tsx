import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from './screen.module.css';

export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose?:()=>void}){
 const ref=useRef<HTMLDivElement>(null),close=useRef(onClose);
 useLayoutEffect(()=>{close.current=onClose;});
 useEffect(()=>{const previous=document.activeElement as HTMLElement;ref.current?.querySelector<HTMLElement>('button,input,select')?.focus();const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();close.current?.();}if(e.key!=='Tab')return;const nodes=Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,[tabindex="0"]')??[]);if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0]?.focus();}};document.addEventListener('keydown',key);return ()=>{document.removeEventListener('keydown',key);previous?.focus();};},[]);
 return <div className={styles.modalShade}><div ref={ref} className={styles.modal} role="dialog" aria-modal="true" aria-label={title}><h2>{title}</h2>{children}</div></div>;
}
