/** Racer sound: Kenney CC0 recordings (public/games/f1-racing/kenney/audio) shaped with Web Audio.
 * Start-light beeps and kerb rumble are synthesised. Everything is optional: if the browser cannot
 * create a context or decode a clip, the race simply runs silently. */
type Clip='engine'|'skid'|'impact';
export type SoundFrame={running:boolean;rpm:number;throttle:number;boosting:boolean;skid:number;kerb:boolean;offroad:boolean;speed:number;rivalDistance:number;rivalRpm:number;scrape:number};

export class RacerAudio{
 enabled=true;
 private context:AudioContext|null=null;
 private master:GainNode|null=null;
 private buffers=new Map<Clip,AudioBuffer>();
 private loops:{engine?:{source:AudioBufferSourceNode;gain:GainNode;filter:BiquadFilterNode};rival?:{source:AudioBufferSourceNode;gain:GainNode};skid?:{source:AudioBufferSourceNode;gain:GainNode};rumble?:{osc:OscillatorNode;gain:GainNode};scrape?:{source:AudioBufferSourceNode;gain:GainNode;filter:BiquadFilterNode}}={};
 private loading:Promise<void>|null=null;
 constructor(private base:string){}

 /** Call from a user gesture (Quick Race / Resume). Creates the context once and loads the clips. */
 unlock(){
  if(!this.enabled)return;
  try{
   if(!this.context){const Context=window.AudioContext??(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Context)return;this.context=new Context();this.master=this.context.createGain();this.master.gain.value=.8;this.master.connect(this.context.destination);}
   void this.context.resume();
   this.loading??=this.load();
  }catch{this.context=null;}
 }
 private async load(){
  const context=this.context;if(!context)return;
  await Promise.all((['engine','skid','impact'] as Clip[]).map(async clip=>{
   try{const response=await fetch(new URL(`kenney/audio/${clip}.ogg`,this.base).href);if(!response.ok)return;this.buffers.set(clip,await context.decodeAudioData(await response.arrayBuffer()));}catch{/* Unsupported codec or offline: stay silent for this clip. */}
  }));
  this.startLoops();
 }
 private loop(clip:Clip){
  const context=this.context!,buffer=this.buffers.get(clip);if(!buffer||!this.master)return null;
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=0;source.connect(gain);source.start();return{source,gain};
 }
 private startLoops(){
  const context=this.context;if(!context||!this.master||this.loops.engine)return;
  const engine=this.loop('engine');
  if(engine){const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2400;engine.gain.connect(filter);filter.connect(this.master);this.loops.engine={...engine,filter};}
  const rival=this.loop('engine');if(rival){rival.gain.connect(this.master);this.loops.rival=rival;}
  const skid=this.loop('skid');if(skid){skid.gain.connect(this.master);this.loops.skid=skid;}
  // Barrier scrape: band-passed noise, synthesised so it needs no extra file.
  const noise=context.createBuffer(1,context.sampleRate,context.sampleRate),data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  const scrapeSource=context.createBufferSource(),scrapeFilter=context.createBiquadFilter(),scrapeGain=context.createGain();scrapeSource.buffer=noise;scrapeSource.loop=true;scrapeFilter.type='bandpass';scrapeFilter.frequency.value=2200;scrapeFilter.Q.value=1.4;scrapeGain.gain.value=0;scrapeSource.connect(scrapeFilter);scrapeFilter.connect(scrapeGain);scrapeGain.connect(this.master);scrapeSource.start();this.loops.scrape={source:scrapeSource,gain:scrapeGain,filter:scrapeFilter};
  const osc=context.createOscillator(),gain=context.createGain();osc.type='square';osc.frequency.value=34;gain.gain.value=0;osc.connect(gain);gain.connect(this.master);osc.start();this.loops.rumble={osc,gain};
 }
 /** Per-frame mix. Values glide with setTargetAtTime so the engine never clicks. */
 update(frame:SoundFrame){
  const context=this.context;if(!context||context.state!=='running')return;
  const now=context.currentTime,on=this.enabled&&frame.running,glide=(param:AudioParam,value:number,time=.06)=>param.setTargetAtTime(value,now,time);
  const {engine,rival,skid,rumble,scrape}=this.loops;
  if(engine){const rev=Math.max(0,Math.min(1,(frame.rpm-4500)/11500));glide(engine.source.playbackRate,.62+rev*1.25+(frame.boosting?.12:0));glide(engine.gain.gain,on?.1+frame.throttle*.16+(frame.boosting?.06:0):0);glide(engine.filter.frequency,900+frame.throttle*2600);}
  if(rival){const near=Math.max(0,1-frame.rivalDistance/45);glide(rival.source.playbackRate,.58+Math.max(0,Math.min(1,(frame.rivalRpm-4500)/11500))*1.2,.1);glide(rival.gain.gain,on?near*near*.12:0,.12);}
  if(skid){glide(skid.gain.gain,on?Math.min(.32,frame.skid*.3+(frame.offroad&&frame.speed>5?.1:0)):0,.05);glide(skid.source.playbackRate,frame.offroad?.6:1,.1);}
  if(rumble)glide(rumble.gain.gain,on&&frame.kerb?.035:0,.03);
  if(scrape){glide(scrape.gain.gain,on?Math.min(.22,frame.scrape*Math.min(1,frame.speed/25)*.22):0,.03);glide(scrape.filter.frequency,1600+Math.min(2400,frame.speed*60),.05);}
 }
 impact(intensity:number){
  const context=this.context,buffer=this.buffers.get('impact');if(!this.enabled||!context||!buffer||!this.master)return;
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.playbackRate.value=.85+Math.random()*.3;gain.gain.value=.2+intensity*.45;source.connect(gain);gain.connect(this.master);source.start();
 }
 /** Start-light tone: a short low beep per light, a longer high tone for lights out. */
 beep(go:boolean){
  const context=this.context;if(!this.enabled||!context||!this.master)return;
  const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime,length=go?.45:.14;
  osc.type='sine';osc.frequency.value=go?880:440;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.18,now+.01);gain.gain.setTargetAtTime(0,now+length,.04);osc.connect(gain);gain.connect(this.master);osc.start(now);osc.stop(now+length+.3);
 }
 /** Positive cue for perfect launch, overtakes and laps. */
 chime(){
  const context=this.context;if(!this.enabled||!context||!this.master)return;
  const now=context.currentTime;[660,990].forEach((f,i)=>{const osc=context.createOscillator(),gain=context.createGain();osc.type='triangle';osc.frequency.value=f;gain.gain.setValueAtTime(0,now+i*.07);gain.gain.linearRampToValueAtTime(.09,now+i*.07+.01);gain.gain.setTargetAtTime(0,now+i*.07+.08,.05);osc.connect(gain);gain.connect(this.master!);osc.start(now+i*.07);osc.stop(now+i*.07+.4);});
 }
 silence(){this.update({running:false,rpm:4500,throttle:0,boosting:false,skid:0,kerb:false,offroad:false,speed:0,rivalDistance:999,rivalRpm:4500,scrape:0});}
 dispose(){try{void this.context?.close();}catch{}this.context=null;this.loops={};}
}
