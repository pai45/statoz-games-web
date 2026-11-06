import type { ReactNode } from 'react';

export function CupIcon({name}:{name:'ball'|'cup'|'play'|'history'|'check'|'sound'|'mute'|'back'|'settings'}) {
  const shapes:Record<typeof name,ReactNode>={
    ball:<><circle cx="12" cy="12" r="9"/><path d="m12 7 5 4-2 6H9l-2-6Zm0-4v4m9 1-4 3m1 10-3-4M6 20l3-3M3 9l4 2"/></>,
    cup:<><path d="M7 4h10v6a5 5 0 0 1-10 0Zm0 2H3v3a4 4 0 0 0 5 4m9-7h4v3a4 4 0 0 1-5 4M12 15v5m-5 1h10"/></>,
    play:<path d="m8 5 11 7-11 7Z"/>,
    history:<><path d="M4 7v5h5M4.5 11a8 8 0 1 1 2 7M12 7v5l3 2"/></>,
    check:<path d="m5 12 4 4L19 6"/>,
    sound:<><path d="m11 4-5 4H3v8h3l5 4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
    mute:<><path d="m11 4-5 4H3v8h3l5 4Zm5 5 6 6m0-6-6 6"/></>,
    back:<path d="m14 5-7 7 7 7"/>,
    settings:<><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}
