/** Original 112 BPM stadium groove: hand percussion, bass, chords and a brass-like riff.
 * No recordings, downloads, or third-party compositions. All voices feed one music bus.
 */
export class CupMusic {
  private context:AudioContext|null=null;
  private bus:GainNode|null=null;
  private noise:AudioBuffer|null=null;
  private timer:ReturnType<typeof setInterval>|null=null;
  private step=0;
  private next=0;
  private volume=.55;
  private muted=false;
  private match=false;
  private paused=false;
  private disposed=false;
  private voices=new Set<AudioScheduledSourceNode>();

  constructor(private report:(state:'locked'|'playing'|'muted'|'paused')=>void){}

  configure(volume:number,muted:boolean,match:boolean,paused:boolean){
    this.volume=volume;this.muted=muted;this.match=match;this.paused=paused;
    const c=this.context;
    if(!c)return;
    const gain=muted||paused?0:volume*volume*(match?.035:.18);
    this.bus!.gain.setTargetAtTime(gain,c.currentTime,.14);
    if(paused||muted||volume===0){
      this.stopClock();
      void c.suspend().catch(()=>{});
      this.report(paused?'paused':'muted');
    }else if(c.state==='running'){
      this.startClock();this.report('playing');
    }else this.report('locked');
  }

  async unlock(){
    if(this.disposed||this.paused||this.muted||!this.volume)return;
    try{
      if(!this.context){
        const c=new AudioContext();this.context=c;
        this.bus=c.createGain();this.bus.gain.value=0;
        const limiter=c.createDynamicsCompressor();
        limiter.threshold.value=-8;limiter.knee.value=8;limiter.ratio.value=8;
        this.bus.connect(limiter);limiter.connect(c.destination);
        this.noise=c.createBuffer(1,c.sampleRate*.15,c.sampleRate);
        const data=this.noise.getChannelData(0);
        // Deterministic noise keeps the original percussion consistent on every run.
        let seed=2026;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/0xffffffff)*2-1;}
      }
      await this.context.resume();
      if(this.disposed)return;
      this.configure(this.volume,this.muted,this.match,this.paused);
    }catch{this.report('locked');}
  }

  private startClock(){
    if(this.timer)return;
    this.next=this.context!.currentTime+.04;
    this.schedule();this.timer=setInterval(()=>this.schedule(),80);
  }
  private stopClock(){
    if(this.timer){clearInterval(this.timer);this.timer=null;}
    for(const voice of this.voices){try{voice.stop();}catch{}}
    this.voices.clear();
  }
  private track<T extends AudioScheduledSourceNode>(voice:T){
    this.voices.add(voice);voice.onended=()=>{this.voices.delete(voice);voice.disconnect();};return voice;
  }
  private tone(midi:number,time:number,length:number,gain:number,type:OscillatorType='triangle'){
    const c=this.context!,voice=this.track(c.createOscillator()),envelope=c.createGain();
    voice.type=type;voice.frequency.value=440*Math.pow(2,(midi-69)/12);
    envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(gain,time+.015);
    envelope.gain.exponentialRampToValueAtTime(.001,time+length);
    voice.connect(envelope);envelope.connect(this.bus!);voice.start(time);voice.stop(time+length+.02);
    voice.addEventListener('ended',()=>envelope.disconnect(),{once:true});
  }
  private drum(time:number,hat:boolean){
    const c=this.context!,voice=this.track(c.createBufferSource()),filter=c.createBiquadFilter(),envelope=c.createGain();
    voice.buffer=this.noise;filter.type='highpass';filter.frequency.value=hat?6500:1200;
    envelope.gain.setValueAtTime(hat?.12:.3,time);envelope.gain.exponentialRampToValueAtTime(.001,time+(hat?.045:.13));
    voice.connect(filter);filter.connect(envelope);envelope.connect(this.bus!);voice.start(time);voice.stop(time+.15);
    voice.addEventListener('ended',()=>{filter.disconnect();envelope.disconnect();},{once:true});
  }
  private schedule(){
    const c=this.context!;
    if(c.state!=='running')return;
    if(this.next<c.currentTime)this.next=c.currentTime+.02;
    const beat=60/112;
    while(this.next<c.currentTime+.2){
      const s=this.step%128,bar=Math.floor(s/16),tick=s%16,t=this.next;
      const root=[40,40,36,36,43,43,38,38][bar];
      if(tick%4===0){
        const kick=this.track(c.createOscillator()),envelope=c.createGain();
        kick.frequency.setValueAtTime(130,t);kick.frequency.exponentialRampToValueAtTime(45,t+.13);
        envelope.gain.setValueAtTime(.65,t);envelope.gain.exponentialRampToValueAtTime(.001,t+.2);
        kick.connect(envelope);envelope.connect(this.bus!);kick.start(t);kick.stop(t+.21);
        kick.addEventListener('ended',()=>envelope.disconnect(),{once:true});
      }
      if(tick===4||tick===12)this.drum(t,false);
      if(tick%2===0)this.drum(t,true);
      if([0,3,6,8,11,14].includes(tick))this.tone(root,t,beat*.6,.23);
      if(tick===0||tick===10)for(const interval of [12,15,19])this.tone(root+interval,t,beat*1.5,.045,'sine');
      // The four-bar response changes the phrase instead of repeating a single short riff.
      const riff=bar%2?[7,-1,10,-1,7,-1,3,-1]:[12,-1,10,7,-1,7,3,-1];
      if(tick%2===0&&riff[tick/2]>=0)this.tone(root+24+riff[tick/2],t,beat*.3,.055,'triangle');
      this.step++;this.next+=beat/4;
    }
  }
  dispose(){
    this.disposed=true;this.stopClock();this.bus?.disconnect();
    void this.context?.close().catch(()=>{});this.context=null;
  }
}
