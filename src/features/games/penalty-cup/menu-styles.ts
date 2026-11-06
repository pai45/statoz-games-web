import base from './screen.module.css';
import menu from './menu.module.css';

/** Retain shared match geometry while giving the menus their own presentation. */
export const menuStyles:Record<string,string>=Object.fromEntries(
  [...new Set([...Object.keys(base),...Object.keys(menu)])].map(key=>[key,[base[key],menu[key]].filter(Boolean).join(' ')]),
);
