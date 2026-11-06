import {AI_LEVELS} from '../../../../vendor/websoccer/src/constants.js';
import {createMatch} from '../../../../vendor/websoccer/src/game/state.js';
import {DIVISIONS,KITS,BADGES,createCareer,currentFixture,standings,recordResult,nextSeason,careerDifficulty,clubsFor} from './career.mjs';
import {loadProgress,saveProgress,checkpoint,restoreMatch} from './progress.mjs';
import {DRILLS,createTutorial,arrangeDrill,beforeTutorialStep,afterTutorialStep,tutorialTarget} from './tutorial.mjs';

const $=id=>document.getElementById(id);
const textHTML=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const button=(action,label,extra='')=>`<button type="button" data-action="${action}" ${extra}>${label}</button>`;
const badgeIcon=(index=0)=>`<svg viewBox="0 0 88 100" class="clubBadge" aria-hidden="true"><path fill="${KITS[index].colour}" stroke="#fff8e8" stroke-width="4" d="M6 8Q44 0 82 8V52Q80 78 44 96Q8 78 6 52Z"/><path d="M22 25H66V66H22Z M22 45H66" fill="none" stroke="#fff8e8" stroke-width="2" opacity=".5"/><circle cx="44" cy="45" r="9" fill="none" stroke="#fff8e8" stroke-width="2"/><text x="44" y="77" text-anchor="middle" fill="#fff8e8" font-family="Arial" font-weight="bold" font-size="19">${index===4?'★':index+1}</text></svg>`;
const trophyIcon=()=>'<svg viewBox="0 0 80 84" class="trophyIcon" aria-hidden="true"><path d="M21 9H59V33Q59 50 40 53Q21 50 21 33Z M21 15H8V28Q8 41 26 40 M59 15H72V28Q72 41 54 40 M40 53V68 M22 74H58" fill="#e6b63e" stroke="#a17828" stroke-width="5" stroke-linejoin="round"/><path d="M31 17H38V37" stroke="#fff0bb" stroke-width="4" fill="none"/></svg>';
const kitIcon=kit=>`<svg viewBox="0 0 100 90" class="kitIcon" aria-hidden="true"><path fill="${kit.colour}" stroke="#254a3e" stroke-width="2" d="M30 8L8 22L18 43L30 36V81H70V36L82 43L92 22L70 8L60 14H40Z"/><path d="M40 9Q50 28 60 9 M36 57H64" fill="none" stroke="#fff8e8" stroke-width="5"/></svg>`;

export function mountJourney(ctx) {
  const loaded=loadProgress(localStorage);
  let progress=loaded.data,screen='home',session='none',tab='overview',page=0;
  let tutorial=null,pendingLaunch=null,fullTutorial=false,fixtureId=null,lastSaved=0;
  let kitPage=0,badgePage=0,notice=loaded.error||(loaded.recovered?'Recovered your last valid save.':'');
  const root=document.createElement('section');root.id='journey';root.className='overlay';
  root.setAttribute('aria-label','Pitch Rush lobby');root.style.setProperty('--cover',$('menu').style.getPropertyValue('--cover'));
  root.innerHTML='<div class="journeyPanel"><header class="journeyHead"><button id="journeyBack" type="button">‹ Lobby</button><h1>PITCH<span>RUSH</span></h1><span id="journeyLabel">CLUB FOOTBALL</span></header><div id="journeyBody"></div><p id="saveNotice" role="status" hidden></p></div>';
  $('wrap').append(root);
  // Keep persistence errors visible during play as well as in the menus.
  $('wrap').append($('saveNotice'));
  $('saveNotice').addEventListener('click',event=>{if(event.target.closest('[data-action="save"]'))persist();});
  const coach=document.createElement('section');coach.id='coach';coach.className='hidden';coach.setAttribute('aria-label','Training coach');
  coach.innerHTML='<div><span id="coachCount"></span><strong id="coachTitle"></strong><p id="coachText" role="status"></p></div><div class="coachActions"><button id="retryDrill" type="button">Retry</button><button id="skipTraining" type="button">Skip</button><button id="nextDrill" type="button" hidden>Next drill</button></div>';
  $('wrap').append(coach);
  $('menu').classList.add('hidden');
  $('exitGame').textContent='‹ Lobby';$('exitGame').setAttribute('aria-label','Back to lobby');
  $('quit').textContent='Save & lobby';

  function persist(){
    try{saveProgress(localStorage,progress);notice='';}
    catch{notice='Progress could not be saved. Free some browser storage and choose Retry save.';}
    showNotice();
  }
  function showNotice(){
    $('saveNotice').hidden=!notice;
    $('saveNotice').innerHTML=notice?`${notice} ${button('save','Retry save')}`:'';
    document.documentElement.dataset.saveState=notice?'warning':'saved';
  }
  function capture(){
    if(session==='career'&&ctx.game.state&&fixtureId&&ctx.game.state.phase!=='fulltime'){
      progress.activeMatch=checkpoint(ctx.game.state,fixtureId);persist();lastSaved=performance.now();
    }
  }
  function stop(){ctx.stop();$('endActions').classList.add('hidden');coach.classList.add('hidden');clearHighlights();}
  function show(next){
    screen=next;page=0;root.classList.toggle('hidden',next==='match'||next==='tutorial'||next==='setup');
    $('menu').classList.toggle('hidden',next!=='setup');
    if(next!=='tutorial')coach.classList.add('hidden');
    document.documentElement.dataset.pitchScreen=next;
    if(!['match','tutorial','setup'].includes(next))render();
  }
  function home(){capture();stop();session='none';tutorial=null;pendingLaunch=null;show('home');}
  function header(label){$('journeyLabel').textContent=label;$('journeyBack').textContent=screen==='home'?'‹ Games':'‹ Lobby';}
  function render(){
    let html='';const c=progress.career;
    if(screen==='home'){
      header('ELEVEN A SIDE. ONE MORE MATCH.');
      const f=c&&currentFixture(c),next=f?clubsFor(c.season.division)[f.home===0?f.away:f.home].name:null;
      html=`<div class="homeGrid"><div class="homeIntro">${badgeIcon(c?.badge??0)}<h2>One club.<br>Four divisions.</h2><p>Build your story one match at a time.</p></div><div class="homeChoices"><button type="button" data-action="career" class="modeCard careerCard"><strong>${c?'Continue career':'Start career'}</strong><span>${progress.activeMatch?'Saved match ready':next?`Next: ${next}`:c?.season.summary?'Season review ready':'Begin with Rush FC'}</span><b aria-hidden="true">→</b></button><button type="button" data-action="quick" class="modeCard quickCard"><strong>Quick match</strong><span>CPU or local friend</span><b aria-hidden="true">→</b></button><nav class="homeLinks" aria-label="Lobby utilities">${button('training','Training')}${button('settings','Settings')}${button('exit','Exit')}</nav></div></div>`;
    }else if(screen==='career'){
      header(`${DIVISIONS[c.season.division].name.toUpperCase()} · SEASON ${c.season.number}`);
      const seasonView=['standings','fixtures','trophies'].includes(tab);
      html=`<nav class="careerTabs" aria-label="Career views">${[['overview','Next match'],['standings','Season'],['club','Club']].map(([id,label])=>{const active=tab===id||id==='standings'&&seasonView;return button('tab:'+id,label,`aria-pressed="${active}" class="${active?'active':''}"`);}).join('')}${seasonView?`<select data-season-view aria-label="Season view">${[['standings','Standings'],['fixtures','Fixtures'],['trophies','Trophies']].map(([id,label])=>`<option value="${id}" ${tab===id?'selected':''}>${label}</option>`).join('')}</select>`:''}</nav><div class="careerContent">${careerContent(c)}</div>`;
    }else if(screen==='training'){
      header('TRAINING GROUND');
      html=`<div class="trainingIntro"><h2>Learn the beautiful game.</h2><p>Three quick drills. Real controls. Try as often as you like.</p></div><div class="trainingCards">${DRILLS.map((d,i)=>`<button type="button" data-action="drill:${i}"><span class="drillNumber">0${i+1}</span><strong>${d.name}</strong><span>${d.description}</span><small>${progress.tutorial.completed.includes(i)?'Completed ✓':'Practice drill'}</small></button>`).join('')}</div><footer class="journeyFoot">${button('all-drills','Play all three drills','class="primary"')}<span>Practice never changes your career record.</span></footer>`;
    }else if(screen==='offer'){
      header('WELCOME TO THE PITCH');
      html=`<div class="offerBody">${badgeIcon(0)}<div><p class="eyebrow">YOUR FIRST KICK-OFF</p><h2>A little practice goes a long way.</h2><p>Learn passing, defending, and scoring in three short, playable drills.</p><div class="offerButtons">${button('begin-tutorial','Start tutorial','class="primary"')}${button('skip-offer','Skip & play')}</div><small>You can replay every drill from Training.</small></div></div>`;
    }else if(screen==='resume'){
      header('SAVED MATCH');const s=progress.activeMatch.state;
      html=`<div class="offerBody">${badgeIcon(c.badge)}<div><p class="eyebrow">${DIVISIONS[c.season.division].name} · Season ${c.season.number}</p><h2>Your match is waiting.</h2><p>${textHTML(s.teams[0].name)} <strong>${s.score.join(' – ')}</strong> ${textHTML(s.teams[1].name)}</p><p>Half ${s.half} · ${Math.floor(s.halfTick/60)} seconds played this half</p>${button('resume-match','Resume match','class="primary"')}<small>Saved score, clock, and match state will resume.</small></div></div>`;
    }else if(screen==='results'){
      header('FULL TIME');const season=c.season,summary=season.summary,round=season.rounds[season.round-1],f=round.find(f=>f.id===fixtureId)||round.find(f=>f.home===0||f.away===0);
      const score=f.home===0?f.score:[f.score[1],f.score[0]],opponent=clubsFor(season.division)[f.home===0?f.away:f.home].name;
      html=`<div class="offerBody">${summary?.rank===1?trophyIcon():badgeIcon(c.badge)}<div><p class="eyebrow">${DIVISIONS[season.division].name} · Match ${season.round}/5</p><h2 class="resultScore">${score.join(' – ')}</h2><p>Rush FC vs ${opponent}</p><p class="resultHeadline">${summary?seasonHeadline(c):score[0]>score[1]?'Three points in the bag.':score[0]===score[1]?'A point earned.':'Another match to build on.'}</p><div class="offerButtons">${button('career',summary?'Season review':'Continue career','class="primary"')}${button('home','Lobby')}</div></div></div>`;
    }else if(screen==='settings'){
      header('SETTINGS');
      html=`<div class="settingsGrid">${[['music','Sound'],['commentary','Commentary']].map(([key,label])=>`<section><h2>${label}</h2><div class="btns">${['on','off'].map(value=>button(`setting:${key}:${value}`,value==='on'?'On':'Off',`class="${document.querySelector(`[data-${key}="${value}"]`).classList.contains('active')?'active':''}"`)).join('')}</div></section>`).join('')}<section><h2>Make it yours</h2><p>Keyboard bindings, formations, and Quick Match rules.</p>${button('tactics','Controls & tactics')}</section></div>`;
    }
    $('journeyBody').innerHTML=html;showNotice();
    // Each screen has a predictable keyboard starting point.
    requestAnimationFrame(()=>{if(!root.classList.contains('hidden')&&!root.contains(document.activeElement))root.querySelector('#journeyBody button:not(:disabled)')?.focus({preventScroll:true});});
  }
  function seasonHeadline(c){
    const s=c.season.summary;
    if(s.champion)return 'Premier champions! The climb is complete.';
    if(s.promoted)return `Promoted to ${DIVISIONS[c.season.division+1].name}! New kit and badge unlocked.`;
    return `Finished ${s.rank} of 6. A fresh season awaits.`;
  }
  function careerContent(c){
    const s=c.season,fixture=currentFixture(c),rows=standings(s),rank=rows.findIndex(r=>r.id===0)+1;
    if(tab==='overview')return `<div class="careerOverview"><div class="clubIdentity">${badgeIcon(c.badge)}<h2>Rush FC</h2><span>${BADGES[c.badge]} badge</span></div><div class="nextFixture"><p class="eyebrow">${s.summary?'SEASON COMPLETE':`MATCH ${s.round+1} OF 5`}</p><h2>${s.summary?seasonHeadline(c):`vs ${clubsFor(s.division)[fixture.home===0?fixture.away:fixture.home].name}`}</h2><p>${s.summary?`Final position: ${rank} of 6 · ${rows.find(r=>r.id===0).points} points`:'Top two go up. Every result counts.'}</p><div class="seasonDots" aria-label="Season progress">${s.rounds.map((r,i)=>`<span class="${i<s.round?'done':''}">${i+1}</span>`).join('')}</div>${button(s.summary?'next-season':'play-career',s.summary?(s.summary.promoted?'Enter next division':'Start next season'):progress.activeMatch?'Continue saved match':'Play next match','class="primary"')}<small>${s.summary?'Your trophies and unlocks stay with you.':'2 × 45 sec · Division difficulty · Offside on'}</small></div></div>`;
    if(tab==='standings')return `<table class="leagueTable"><caption>${DIVISIONS[s.division].name} standings</caption><thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${r.id===0?'playerClub':''}"><td>${i+1}</td><th scope="row">${r.name}</th><td>${r.played}</td><td>${r.won}</td><td>${r.drawn}</td><td>${r.lost}</td><td>${r.gf-r.ga}</td><td><b>${r.points}</b></td></tr>`).join('')}</tbody></table>`;
    if(tab==='fixtures')return `<h2 class="viewTitle">Your season</h2><div class="fixtureList">${s.rounds.map((round,i)=>{const f=round.find(f=>f.home===0||f.away===0),op=clubsFor(s.division)[f.home===0?f.away:f.home],score=f.score&&(f.home===0?f.score:[f.score[1],f.score[0]]);return `<div class="fixtureRow ${i===s.round?'next':''}"><span>Match ${i+1}</span><strong>vs ${op.name}</strong><b>${score?score.join(' – '):i===s.round?'NEXT':'—'}</b></div>`;}).join('')}</div>`;
    if(tab==='club'){
      const kit=KITS[kitPage],unlocked=kitPage<=c.unlocked;
      return `<div class="cosmeticGrid"><section>${kitIcon(kit)}<h2>${kit.name}</h2><p>${unlocked?'Unlocked':kitPage===4?'Win Premier to unlock':`Reach ${BADGES[kitPage]} to unlock`}</p><div class="cosmeticControls">${button('kit-prev','‹','aria-label="Previous kit"')}${button('equip-kit',c.kit===kit.id?'Equipped':'Equip',`data-kit="${kit.id}" ${!unlocked||c.kit===kit.id?'disabled':''}`)}${button('kit-next','›','aria-label="Next kit"')}</div></section><section>${badgeIcon(badgePage)}<h2>${BADGES[badgePage]} badge</h2><p>${badgePage<=c.unlocked?'Unlocked':badgePage===4?'Win Premier to unlock':`Reach ${BADGES[badgePage]} to unlock`}</p><div class="cosmeticControls">${button('badge-prev','‹','aria-label="Previous badge"')}${button('equip-badge',c.badge===badgePage?'Equipped':'Equip',`${badgePage>c.unlocked||c.badge===badgePage?'disabled':''}`)}${button('badge-next','›','aria-label="Next badge"')}</div></section></div>`;
    }
    if(page===0)return `<div class="trophyGrid">${DIVISIONS.map((d,i)=>`<section class="${c.trophies[i]?'earned':'locked'}">${trophyIcon()}<div><strong>${d.name}</strong><span>${c.trophies[i]?`${c.trophies[i]} title${c.trophies[i]>1?'s':''}`:'Finish first to earn'}</span></div></section>`).join('')}</div><footer class="journeyFoot">${button('history-next','Season history →')}</footer>`;
    const history=[...c.history].reverse(),start=(page-1)*2;
    return `<h2 class="viewTitle">Season history</h2><div class="historyList">${history.slice(start,start+2).map(h=>`<article><strong>Season ${h.number} · ${DIVISIONS[h.division].name}</strong><p>Position ${h.rank}${h.champion?' · Champions':h.promoted?' · Promoted':''}</p></article>`).join('')||'<p>Your first season is still being written.</p>'}</div><footer class="journeyFoot">${button('history-prev','← Back')}${button('history-next','Next →',`${start+2>=history.length?'disabled':''}`)}</footer>`;
  }
  function gate(launch){
    pendingLaunch=launch;
    if(progress.tutorial.status==='new')show('offer');else continueLaunch();
  }
  function continueLaunch(){const launch=pendingLaunch;pendingLaunch=null;tutorial=null;coach.classList.add('hidden');clearHighlights();launch?.();}
  function launchCareer(){
    if(progress.activeMatch){show('resume');return;}
    const c=progress.career,f=currentFixture(c);if(!f)return;
    fixtureId=f.id;session='career';
    const s=createMatch({seed:(c.season.seed^((c.season.round+1)*104729))||1,halfSeconds:45,humans:[true,false],difficulty:careerDifficulty(DIVISIONS[c.season.division].difficulty,AI_LEVELS),offside:true,formations:ctx.formations()});
    s.teams[0].name='RUSH FC';s.teams[1].name=clubsFor(c.season.division)[f.home===0?f.away:f.home].name.toUpperCase();
    ctx.begin(s);show('match');capture();
  }
  function beginDrill(index,all){
    fullTutorial=all;session='tutorial';tutorial=createTutorial(index);ctx.begin(arrangeDrill(tutorial));show('tutorial');coach.classList.remove('hidden');updateCoach();
  }
  function clearHighlights(){for(const id of ['stick','btnKick','btnDefend'])$(id).classList.remove('trainingHighlight');}
  function updateCoach(message){
    if(!tutorial)return;const t=tutorial;
    $('coachCount').textContent=`${t.drill+1} / 3`;$('coachTitle').textContent=DRILLS[t.drill].name;
    const binding=ctx.bindings()[0],fire=ctx.keyLabel(binding.fire),move=ctx.keyLabel(binding.up);
    const attack=ctx.coarse()?'Attack':`${fire} / gamepad A`,direction=ctx.coarse()?'stick':`movement keys (${move}…) / left stick`;
    $('coachText').textContent=message||(t.success?'Well played!':t.drill===0?(!t.moved?`Move a few steps with the ${direction}.`:`Aim at the marked teammate. Tap ${attack}. ${t.passes}/2 passes.`):t.drill===1?`Move close. ${ctx.coarse()?'Tap Defence':`Press ${fire} / gamepad A`} to slide, then collect the ball.`:`Hold ${attack}, aim at goal with the ${direction}, then release. Try a corner!`);
    $('nextDrill').hidden=!t.success;$('nextDrill').textContent=fullTutorial&&t.drill<2?'Next drill':pendingLaunch?'Kick off':'Finish';
    $('retryDrill').hidden=t.success;$('skipTraining').textContent=pendingLaunch?'Skip & play':'Back';
    clearHighlights();if(!t.success)$(t.drill===0&&!t.moved?'stick':t.drill===1?'btnDefend':'btnKick').classList.add('trainingHighlight');
  }
  root.addEventListener('change',event=>{
    if(!event.target.matches('[data-season-view]'))return;
    tab=event.target.value;page=0;render();
  });
  root.addEventListener('click',event=>{
    const el=event.target.closest('[data-action]');if(!el||el.disabled)return;
    const action=el.dataset.action,c=progress.career;
    if(action==='home')home();
    else if(action==='exit'){capture();ctx.exit();}
    else if(action==='career'){stop();session='none';if(!c){progress.career=createCareer((Date.now()&0x7fffffff)||1);persist();}tab='overview';show('career');}
    else if(action==='quick'){session='quick';show('setup');}
    else if(action==='training'){session='none';show('training');}
    else if(action==='settings')show('settings');
    else if(action==='save'){persist();}
    else if(action.startsWith('tab:')){tab=action.split(':')[1];page=0;render();}
    else if(action==='play-career')gate(launchCareer);
    else if(action==='next-season'){progress.career=nextSeason(c);persist();render();}
    else if(action==='resume-match'){
      session='career';fixtureId=progress.activeMatch.fixtureId;ctx.begin(restoreMatch(progress.activeMatch));show('match');
    }
    else if(action==='begin-tutorial'||action==='all-drills')beginDrill(0,true);
    else if(action==='skip-offer'){progress.tutorial.status='skipped';persist();continueLaunch();}
    else if(action.startsWith('drill:')){pendingLaunch=null;beginDrill(Number(action.split(':')[1]),false);}
    else if(action.startsWith('setting:')){const [,key,value]=action.split(':');document.querySelector(`[data-${key}="${value}"]`).click();render();}
    else if(action==='tactics'){session='quick';show('setup');$('matchOptions').open=true;$('controlsBox').open=true;}
    else if(action==='kit-prev'||action==='kit-next'){kitPage=(kitPage+(action==='kit-next'?1:4))%5;render();}
    else if(action==='badge-prev'||action==='badge-next'){badgePage=(badgePage+(action==='badge-next'?1:4))%5;render();}
    else if(action==='equip-kit'&&kitPage<=c.unlocked){c.kit=KITS[kitPage].id;persist();render();}
    else if(action==='equip-badge'&&badgePage<=c.unlocked){c.badge=badgePage;persist();render();}
    else if(action==='history-next'){page++;render();}
    else if(action==='history-prev'){page=Math.max(0,page-1);render();}
  });
  $('journeyBack').addEventListener('click',()=>{if(screen==='home')ctx.exit();else home();});
  $('start').addEventListener('click',event=>{
    if(!ctx.canQuickStart())return;
    if(progress.tutorial.status==='new'){
      event.preventDefault();event.stopImmediatePropagation();
      gate(()=>{session='quick';$('start').click();});
    }else session='quick';
  },true);
  $('retryDrill').addEventListener('click',()=>{ctx.begin(arrangeDrill(tutorial));updateCoach('Try again. Take your time.');});
  $('skipTraining').addEventListener('click',()=>{
    if(pendingLaunch){progress.tutorial.status='skipped';persist();continueLaunch();}
    else{stop();session='none';tutorial=null;show('training');}
  });
  $('nextDrill').addEventListener('click',()=>{
    const next=tutorial.drill+1;
    if(fullTutorial&&next<3){beginDrill(next,true);return;}
    if(progress.tutorial.completed.length===3)progress.tutorial.status='completed';persist();
    if(pendingLaunch)continueLaunch();else{stop();session='none';tutorial=null;show('training');}
  });
  // A modal menu owns focus/input; gamepad A activates the focused control.
  const menuKeys=event=>{
    if(screen==='tutorial'&&tutorial?.success&&$('pause').classList.contains('hidden')&&['Enter','Space'].includes(event.code)){
      event.preventDefault();event.stopImmediatePropagation();$('nextDrill').click();return;
    }
    const modal=!$('pause').classList.contains('hidden')?$('pause'):screen==='setup'?$('menu'):!root.classList.contains('hidden')?root:null;
    if(!modal||event.target?.closest?.('#keysBody,.preset')||!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Enter','Space','Escape'].includes(event.code))return;
    if(event.target?.tagName==='SELECT'&&!['Enter','Space','Escape'].includes(event.code))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(event.code==='Escape'){if(modal===$('pause'))$('resume').click();else if(screen!=='home')home();return;}
    const controls=[...modal.querySelectorAll('button:not(:disabled),select,summary')].filter(el=>el.getClientRects().length);
    let at=controls.indexOf(document.activeElement);
    if(event.code==='Enter'||event.code==='Space'){document.activeElement?.click();return;}
    at=(at+(event.code==='ArrowDown'||event.code==='ArrowRight'?1:controls.length-1)+controls.length)%controls.length;
    controls[at]?.focus();
  };
  window.addEventListener('keydown',menuKeys,true);
  let padMask=0,padAt=0;
  function menuPad(now){
    if(ctx.disposed())return;
    const pad=navigator.getGamepads?.()[0];
    const mask=pad?((pad.buttons[0]?.pressed?1:0)|(pad.buttons[1]?.pressed?2:0)|((pad.axes[1]>.55||pad.axes[0]>.55||pad.buttons[13]?.pressed||pad.buttons[15]?.pressed)?4:0)|((pad.axes[1]<-.55||pad.axes[0]<-.55||pad.buttons[12]?.pressed||pad.buttons[14]?.pressed)?8:0)):0;
    if((!root.classList.contains('hidden')||screen==='setup'||!$('pause').classList.contains('hidden'))&&mask&&(!padMask||(mask&12)&&now-padAt>350)){
      const code=mask&1?'Enter':mask&2?'Escape':mask&4?'ArrowDown':'ArrowUp';
      menuKeys({code,preventDefault(){},stopImmediatePropagation(){}});padAt=now;
    }else if(screen==='tutorial'&&tutorial?.success&&(mask&1)&&!(padMask&1))$('nextDrill').click();
    padMask=mask;requestAnimationFrame(menuPad);
  }
  requestAnimationFrame(menuPad);
  window.addEventListener('pagehide',capture);
  const priorDraw=ctx.renderer.draw.bind(ctx.renderer);
  ctx.renderer.draw=(state,...args)=>{
    priorDraw(state,...args);
    const g=ctx.renderer.ctx;
    if(tutorial&&session==='tutorial'){
      const target=tutorialTarget(tutorial,state),p=ctx.renderer.toScreen(target.x,target.y);
      g.save();g.setTransform(1,0,0,1,0,0);g.strokeStyle='#fff0bb';g.lineWidth=3;g.setLineDash([5,4]);g.beginPath();g.arc(p.x,p.y,22,0,Math.PI*2);g.stroke();g.restore();
    }
    if(state.cosmetics?.badge!==undefined){
      g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=KITS[state.cosmetics.badge].colour;
      g.beginPath();g.moveTo(15,12);g.lineTo(35,12);g.lineTo(35,29);g.lineTo(25,37);g.lineTo(15,29);g.closePath();g.fill();
      g.fillStyle='#fff8e8';g.font='bold 12px Arial';g.textAlign='center';g.fillText(state.cosmetics.badge+1,25,27);g.restore();
    }
  };
  render();
  return {
    get screen(){return screen;},get session(){return session;},get tutorial(){return tutorial;},
    get allowArcadeResults(){return session==='quick';},
    home,capture,
    beforeBeginMatch(state){
      if(session!=='tutorial')state.cosmetics={kit:progress.career?.kit??'blue',badge:progress.career?.badge??0};
      $('endActions').classList.add('hidden');ctx.release();
      if(session==='quick')show('match');
    },
    beforeStep(){if(session==='tutorial'&&tutorial)beforeTutorialStep(tutorial,ctx.game.state);},
    afterStep(){
      const state=ctx.game.state;
      if(session==='tutorial'&&tutorial){
        const priorMoved=tutorial.moved,outcome=afterTutorialStep(tutorial,state);
        if(outcome==='complete'){
          if(!progress.tutorial.completed.includes(tutorial.drill)){progress.tutorial.completed.push(tutorial.drill);if(progress.tutorial.completed.length===3)progress.tutorial.status='completed';persist();}
          ctx.freeze();updateCoach();
          $('nextDrill').focus({preventScroll:true});
        }else if(outcome==='pass'||outcome==='retry'){
          ctx.begin(arrangeDrill(tutorial));updateCoach(outcome==='pass'?'Nice pass! Now send it back the other way.':'Have another go. Aim for the marker.');
        }else if(priorMoved!==tutorial.moved)updateCoach();
      }else if(session==='career'){
        if(state.phase==='fulltime'){
          const updated=recordResult(progress.career,fixtureId,state.score);
          if(updated!==progress.career){progress={...progress,career:updated,activeMatch:null};persist();}
          ctx.freeze();ctx.hideTouch();show('results');
        }else if(performance.now()-lastSaved>=5000||state.events.some(e=>e.type==='goal'||e.type==='whistle'&&e.kind==='half'))capture();
      }
    },
    leavingMatch(){capture();},
    returnedToMenu(){home();},
    dispose(){capture();window.removeEventListener('keydown',menuKeys,true);window.removeEventListener('pagehide',capture);},
  };
}
