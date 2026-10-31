import type { ReactNode } from 'react';

/** Original small-format vector flag drawings. Coats of arms are simplified for this display size. */
export function Flag({id}:{id:string}){
 const rect=(fill:string,x=0,y=0,w=60,h=40)=><rect fill={fill} x={x} y={y} width={w} height={h}/>;
 const h=(colors:string[])=>colors.map((c,i)=><rect key={i} fill={c} y={40*i/colors.length} width="60" height={40/colors.length}/>);
 const v=(colors:string[])=>colors.map((c,i)=><rect key={i} fill={c} x={60*i/colors.length} width={60/colors.length} height="40"/>);
 const star=(x:number,y:number,r:number,fill:string,points=5)=><polygon fill={fill} points={Array.from({length:points*2},(_,i)=>{const a=-Math.PI/2+i*Math.PI/points,d=i%2?r*.4:r;return `${x+Math.cos(a)*d},${y+Math.sin(a)*d}`;}).join(' ')}/>;
 const crescent=(background:string,x=27,y=20,color='#fff')=><>{<circle cx={x} cy={y} r="10" fill={color}/>}<circle cx={x+4} cy={y-2} r="8.5" fill={background}/></>;
 const union=<>{rect('#17336c')}<path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="9"/><path d="M0 0 60 40M60 0 0 40" stroke="#c62f42" strokeWidth="3"/><path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13"/><path d="M30 0V40M0 20H60" stroke="#c62f42" strokeWidth="7"/></>;
 const sun=(x:number,y:number)=><>{star(x,y,7,'#e4b830',12)}<circle cx={x} cy={y} r="3" fill="#edc34b"/></>;
 const crest=(fill='#d1ae34')=><path fill={fill} d="M26 14 30 17 34 14 33 23 30 27 27 23 24 20 29 21Z"/>;
 let artwork:ReactNode;
 switch(id){
  case 'MEX':artwork=<>{v(['#006847','#fff','#ce263a'])}{crest('#755735')}</>;break;
  case 'RSA':artwork=<>{h(['#d52e37','#274d98'])}<path d="M0 0 28 20 0 40" fill="#fff"/><path d="M0 3 25 20 0 37" fill="#e9c638"/><path d="M0 8 18 20 0 32" fill="#191c22"/><path d="M0 0 28 20H60M0 40 28 20" stroke="#fff" strokeWidth="12" fill="none"/><path d="M0 0 28 20H60M0 40 28 20" stroke="#16814c" strokeWidth="8" fill="none"/></>;break;
  case 'KOR':artwork=<>{rect('#fff')}<circle cx="30" cy="20" r="9" fill="#ce3348"/><path d="M21 20a9 9 0 0 0 18 0c0-6-9-6-9 0s-9 6-9 0" fill="#285395"/>{[[-1,-1],[1,-1],[-1,1],[1,1]].map(([x,y],i)=><g key={i} transform={`translate(${30+x*18} ${20+y*12}) rotate(${x*y*-35})`} stroke="#222" strokeWidth="2">{[-3,0,3].map(j=><path key={j} d={`M-4 ${j}h8`}/>)}</g>)}</>;break;
  case 'CZE':artwork=<>{h(['#fff','#d22d40'])}<path d="M0 0 30 20 0 40" fill="#224d86"/></>;break;
  case 'CAN':artwork=<>{v(['#d52c3d','#fff','#d52c3d'])}<path fill="#d52c3d" d="m30 8 3 7 4-2-1 7 5-1-4 8h-6v6h-2v-6h-6l-4-8 5 1-1-7 4 2Z"/></>;break;
  case 'BIH':artwork=<>{rect('#1749a3')}<path d="M16 0H47V36Z" fill="#eccb3b"/>{Array.from({length:8},(_,i)=>star(12+i*4,2+i*5,2.3,'white')).map((s,i)=><g key={i}>{s}</g>)}</>;break;
  case 'QAT':artwork=<>{rect('#7b2039')}{rect('#fff',0,0,14)}<path d="M14 0 21 2.2 14 4.4 21 6.6 14 8.8 21 11 14 13.2 21 15.4 14 17.6 21 19.8 14 22 21 24.2 14 26.4 21 28.6 14 30.8 21 33 14 35.2 21 37.4 14 40Z" fill="#fff"/></>;break;
  case 'SUI':artwork=<>{rect('#d92f3f')}{rect('#fff',25,8,10,24)}{rect('#fff',18,15,24,10)}</>;break;
  case 'BRA':artwork=<>{rect('#18844b')}<path d="M30 4 55 20 30 36 5 20Z" fill="#efd044"/><circle cx="30" cy="20" r="10" fill="#224a90"/><path d="M21 16q10-1 18 8" fill="none" stroke="#fff" strokeWidth="2"/>{star(31,24,1.5,'white')}</>;break;
  case 'MAR':artwork=<>{rect('#c72c3c')}<path d="m30 10 6 18-16-11h20L24 28Z" fill="none" stroke="#197a4a" strokeWidth="1.8"/></>;break;
  case 'HAI':artwork=<>{h(['#23488d','#c93447'])}{rect('#fff',22,15,16,10)}{crest('#277e46')}</>;break;
  case 'SCO':artwork=<>{rect('#2563a9')}<path d="m0 0 60 40M0 40 60 0" stroke="#fff" strokeWidth="7"/></>;break;
  case 'USA':artwork=<>{h(Array.from({length:13},(_,i)=>i%2?'#fff':'#c63246'))}{rect('#25396a',0,0,26,22)}{Array.from({length:20},(_,i)=>star(3+i%5*5,3+Math.floor(i/5)*5,1.2,'#fff')).map((s,i)=><g key={i}>{s}</g>)}</>;break;
  case 'PAR':artwork=<>{h(['#d02e42','#fff','#264988'])}<circle cx="30" cy="20" r="4" fill="none" stroke="#18814e" strokeWidth="1.3"/>{star(30,20,2,'#e3c147')}</>;break;
  case 'AUS':case 'NZL':artwork=<>{rect('#183f7a')}<g transform="scale(.48)">{union}</g>{[[43,10],[38,21],[51,22],[45,32]].map(([x,y],i)=><g key={i}>{star(x,y,id==='AUS'?3:3.4,'#fff')}{id==='NZL'&&star(x,y,2.4,'#d12b45')}</g>)}{id==='AUS'&&star(14,29,4,'white',7)}</>;break;
  case 'TUR':artwork=<>{rect('#d02d3f')}{crescent('#d02d3f',24)}{star(37,18,5,'#fff')}</>;break;
  case 'GER':artwork=h(['#202426','#d02c38','#e7bf36']);break;
  case 'CUW':artwork=<>{rect('#1e4c9a')}{rect('#e9ce3e',0,27,60,5)}{star(11,10,4,'white')}{star(19,17,3,'white')}</>;break;
  case 'CIV':artwork=v(['#e98536','#fff','#19814d']);break;
  case 'ECU':artwork=<>{rect('#e6c83e')}{rect('#244992',0,20,60,10)}{rect('#c72d3e',0,30,60,10)}{crest('#795c27')}</>;break;
  case 'NED':artwork=h(['#b92f42','#fff','#284e8d']);break;
  case 'JPN':artwork=<>{rect('#fff')}<circle cx="30" cy="20" r="10" fill="#bd2d48"/></>;break;
  case 'SWE':artwork=<>{rect('#28609b')}{rect('#e8c63b',18,0,7,40)}{rect('#e8c63b',0,17,60,7)}</>;break;
  case 'TUN':artwork=<>{rect('#d02d40')}<circle cx="30" cy="20" r="12" fill="#fff"/>{crescent('#fff',29,20,'#d02d40')}{star(34,20,5,'#d02d40')}</>;break;
  case 'BEL':artwork=v(['#202426','#e9c53a','#cb2c40']);break;
  case 'EGY':artwork=<>{h(['#ce3041','#fff','#22272a'])}{crest()}</>;break;
  case 'IRN':artwork=<>{h(['#23915a','#fff','#cb2f40'])}<path d="M25 17q-3 9 5 9t5-9M30 16v11m-4-12 4 3 4-3" fill="none" stroke="#cb2f40" strokeWidth="1.7"/></>;break;
  case 'ESP':artwork=<>{rect('#bf293c')}{rect('#e8c13b',0,10,60,20)}<g transform="translate(-12 0)">{crest('#b7313f')}</g></>;break;
  case 'CPV':artwork=<>{rect('#2453a0')}{rect('#fff',0,23,60,8)}{rect('#d22e42',0,26,60,3)}{Array.from({length:10},(_,i)=>star(22+Math.cos(i*Math.PI/5)*10,23+Math.sin(i*Math.PI/5)*10,2,'#e6c43d')).map((s,i)=><g key={i}>{s}</g>)}</>;break;
  case 'KSA':artwork=<>{rect('#18784d')}<text x="30" y="19" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="serif">لا إله إلا الله محمد رسول الله</text><path d="M15 26H45q0 3-4 3M43 25v4" stroke="#fff" strokeWidth="1.5" fill="none"/></>;break;
  case 'URU':artwork=<>{h(Array.from({length:9},(_,i)=>i%2?'#377db2':'#fff'))}{rect('#fff',0,0,22,22)}{sun(11,11)}</>;break;
  case 'FRA':artwork=v(['#234788','#fff','#d23445']);break;
  case 'SEN':artwork=<>{v(['#24844d','#e4c33b','#cd3040'])}{star(30,20,6,'#24844d')}</>;break;
  case 'IRQ':artwork=<>{h(['#d02f41','#fff','#22282b'])}<text x="30" y="24" textAnchor="middle" fill="#26864d" fontSize="9" fontFamily="serif">الله أكبر</text></>;break;
  case 'NOR':artwork=<>{rect('#c43043')}{rect('#fff',16,0,10,40)}{rect('#fff',0,15,60,10)}{rect('#233d6a',19,0,4,40)}{rect('#233d6a',0,18,60,4)}</>;break;
  case 'ARG':artwork=<>{h(['#8ab9d7','#fff','#8ab9d7'])}{sun(30,20)}</>;break;
  case 'ALG':artwork=<>{v(['#21804e','#fff'])}<path d="M35 10a11 11 0 1 0 0 20a10 10 0 0 1 0-20Z" fill="#cf3145"/>{star(35,20,4.5,'#cf3145')}</>;break;
  case 'AUT':artwork=h(['#cc3041','#fff','#cc3041']);break;
  case 'JOR':artwork=<>{h(['#202628','#fff','#27834c'])}<path d="M0 0 30 20 0 40" fill="#c83244"/>{star(12,20,4,'#fff',7)}</>;break;
  case 'POR':artwork=<>{rect('#c32f40')}{rect('#197548',0,0,24,40)}<circle cx="24" cy="20" r="8" fill="none" stroke="#e3c33c" strokeWidth="2"/><path d="M20 15h8v9l-4 3-4-3Z" fill="#fff" stroke="#bd2b3e" strokeWidth="2"/></>;break;
  case 'COD':artwork=<>{rect('#3f9bd5')}<path d="m-8 40 68-40" stroke="#e6c73a" strokeWidth="14"/><path d="m-8 40 68-40" stroke="#d13143" strokeWidth="9"/>{star(12,10,6,'#e6c73a')}</>;break;
  case 'UZB':artwork=<>{h(['#45a7cc','#fff','#38a653'])}{rect('#cc354a',0,12,60,2)}{rect('#cc354a',0,26,60,2)}<g transform="translate(0 -13) scale(.5)">{crescent('#45a7cc',17,40)}</g>{Array.from({length:9},(_,i)=>star(18+i%3*5,3+Math.floor(i/3)*4,1.2,'#fff')).map((s,i)=><g key={i}>{s}</g>)}</>;break;
  case 'COL':artwork=<>{rect('#e8cd3c')}{rect('#284d96',0,20,60,10)}{rect('#cb2f40',0,30,60,10)}</>;break;
  case 'ENG':artwork=<>{rect('#fff')}{rect('#c83346',26,0,8,40)}{rect('#c83346',0,16,60,8)}</>;break;
  case 'CRO':artwork=<>{h(['#cd3346','#fff','#2c4b93'])}<g transform="translate(24 13)">{Array.from({length:15},(_,i)=><rect key={i} x={i%5*2.4} y={Math.floor(i/5)*3.5} width="2.4" height="3.5" fill={i%2?'#fff':'#c32d43'}/>)}</g></>;break;
  case 'GHA':artwork=<>{h(['#cd3244','#e6c73c','#28824d'])}{star(30,20,6,'#22282a')}</>;break;
  case 'PAN':artwork=<>{rect('#fff')}{rect('#d13345',30,0,30,20)}{rect('#244f9b',0,20,30,20)}{star(15,10,5,'#244f9b')}{star(45,30,5,'#d13345')}</>;break;
  default:artwork=rect('#ddd');
 }
 return <svg viewBox="0 0 60 40" width="36" height="24" aria-hidden="true" focusable="false" style={{display:'inline-block',flexShrink:0,verticalAlign:'middle',borderRadius:1,boxShadow:'0 0 0 1px #ffffff24'}}>{artwork}</svg>;
}
