"use client";
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
export default function RetiredFinalOver(){
 const router=useRouter();useEffect(()=>{router.replace('/play/stadium-cricket');},[router]);
 return <main className="grid min-h-dvh place-content-center gap-4 p-6 text-center"><h1>Final Over has retired</h1><p>Your Final Over history is preserved.</p><Link href="/play/stadium-cricket">Play Stadium Cricket →</Link></main>;
}
