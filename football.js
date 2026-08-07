(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = 'recess-football-career-v1';
  const nf = new Intl.NumberFormat('en-US');

  const players = [
    {id:'amina-kone',name:'Amina Kone',nation:'Mali',pos:'ST',group:'ATT',rating:82,pace:86,shot:84,pass:72,def:34,color:'#c87952'},
    {id:'mateo-silva',name:'Mateo Silva',nation:'Uruguay',pos:'RW',group:'ATT',rating:79,pace:88,shot:76,pass:80,def:38,color:'#c98d68'},
    {id:'jae-park',name:'Jae Park',nation:'Korea',pos:'CM',group:'MID',rating:78,pace:74,shot:70,pass:85,def:67,color:'#e0ab86'},
    {id:'zara-okafor',name:'Zara Okafor',nation:'Nigeria',pos:'CB',group:'DEF',rating:78,pace:71,shot:39,pass:68,def:85,color:'#76472f'},
    {id:'lucia-romano',name:'Lucia Romano',nation:'Italy',pos:'CM',group:'MID',rating:75,pace:70,shot:73,pass:81,def:61,color:'#dca47b'},
    {id:'theo-martin',name:'Theo Martin',nation:'Canada',pos:'GK',group:'GK',rating:76,pace:51,shot:30,pass:66,def:81,color:'#b97a5a'},
    {id:'noor-haddad',name:'Noor Haddad',nation:'Jordan',pos:'LB',group:'DEF',rating:74,pace:83,shot:51,pass:70,def:75,color:'#b77d5c'},
    {id:'kenji-sato',name:'Kenji Sato',nation:'Japan',pos:'RB',group:'DEF',rating:72,pace:81,shot:47,pass:68,def:72,color:'#e2ad86'},
    {id:'mila-kovac',name:'Mila Kovac',nation:'Croatia',pos:'LW',group:'ATT',rating:74,pace:85,shot:71,pass:74,def:40,color:'#e0a584'},
    {id:'elias-mensah',name:'Elias Mensah',nation:'Ghana',pos:'CB',group:'DEF',rating:73,pace:69,shot:42,pass:64,def:79,color:'#68402c'},
    {id:'freja-lind',name:'Freja Lind',nation:'Denmark',pos:'CDM',group:'MID',rating:72,pace:67,shot:58,pass:73,def:77,color:'#e8b894'},
    {id:'ines-costa',name:'Ines Costa',nation:'Portugal',pos:'ST',group:'ATT',rating:71,pace:78,shot:76,pass:63,def:32,color:'#c98765'},
    {id:'samir-bensaid',name:'Samir Bensaid',nation:'Algeria',pos:'CAM',group:'MID',rating:70,pace:73,shot:68,pass:77,def:46,color:'#a96f50'},
    {id:'maya-brooks',name:'Maya Brooks',nation:'USA',pos:'CB',group:'DEF',rating:69,pace:65,shot:38,pass:62,def:75,color:'#8b5c43'},
    {id:'luka-petrov',name:'Luka Petrov',nation:'Serbia',pos:'GK',group:'GK',rating:67,pace:45,shot:25,pass:59,def:72,color:'#d7a27f'},
    {id:'sofia-alvarez',name:'Sofia Alvarez',nation:'Mexico',pos:'CAM',group:'MID',rating:84,pace:79,shot:82,pass:89,def:48,color:'#bd7d5a'},
    {id:'dante-reed',name:'Dante Reed',nation:'Jamaica',pos:'LW',group:'ATT',rating:83,pace:91,shot:79,pass:78,def:35,color:'#583826'},
    {id:'mei-tan',name:'Mei Tan',nation:'Singapore',pos:'RB',group:'DEF',rating:81,pace:87,shot:54,pass:78,def:82,color:'#d9a17d'},
    {id:'ana-baptista',name:'Ana Baptista',nation:'Brazil',pos:'ST',group:'ATT',rating:87,pace:89,shot:90,pass:78,def:37,color:'#a76847'},
    {id:'omar-diallo',name:'Omar Diallo',nation:'Senegal',pos:'CDM',group:'MID',rating:85,pace:76,shot:69,pass:83,def:88,color:'#64402d'},
    {id:'riku-mori',name:'Riku Mori',nation:'Japan',pos:'CAM',group:'MID',rating:80,pace:81,shot:77,pass:85,def:45,color:'#e5b08a'},
    {id:'leila-azizi',name:'Leila Azizi',nation:'Morocco',pos:'GK',group:'GK',rating:80,pace:55,shot:32,pass:72,def:86,color:'#ae7354'},
    {id:'nico-hartmann',name:'Nico Hartmann',nation:'Germany',pos:'CB',group:'DEF',rating:86,pace:77,shot:48,pass:76,def:91,color:'#e1ae8d'},
    {id:'talia-mokoena',name:'Talia Mokoena',nation:'South Africa',pos:'RW',group:'ATT',rating:81,pace:90,shot:78,pass:77,def:39,color:'#68402d'},
    {id:'marco-velas',name:'Marco Velas',nation:'Chile',pos:'LB',group:'DEF',rating:77,pace:84,shot:56,pass:73,def:79,color:'#c78b68'},
    {id:'naya-patel',name:'Naya Patel',nation:'India',pos:'CM',group:'MID',rating:76,pace:72,shot:69,pass:82,def:64,color:'#a86f4f'},
    {id:'jonas-ek',name:'Jonas Ek',nation:'Sweden',pos:'CB',group:'DEF',rating:75,pace:66,shot:43,pass:70,def:82,color:'#e3b291'},
    {id:'camila-rojas',name:'Camila Rojas',nation:'Colombia',pos:'LW',group:'ATT',rating:77,pace:86,shot:74,pass:76,def:37,color:'#bd7958'},
    {id:'ibrahim-nouri',name:'Ibrahim Nouri',nation:'Egypt',pos:'ST',group:'ATT',rating:76,pace:77,shot:80,pass:66,def:31,color:'#a86e4e'},
    {id:'eva-novak',name:'Eva Novak',nation:'Czechia',pos:'CDM',group:'MID',rating:74,pace:68,shot:60,pass:74,def:79,color:'#dfab88'},
    {id:'avery-chen',name:'Avery Chen',nation:'Australia',pos:'RB',group:'DEF',rating:68,pace:75,shot:44,pass:64,def:71,color:'#d4a17c'},
    {id:'fatou-sy',name:'Fatou Sy',nation:'Senegal',pos:'CM',group:'MID',rating:68,pace:70,shot:64,pass:74,def:59,color:'#5c3927'},
    {id:'emil-yilmaz',name:'Emil Yilmaz',nation:'Turkiye',pos:'RW',group:'ATT',rating:66,pace:78,shot:65,pass:67,def:33,color:'#be805d'},
    {id:'layla-jones',name:'Layla Jones',nation:'England',pos:'LB',group:'DEF',rating:65,pace:72,shot:43,pass:61,def:68,color:'#845840'},
    {id:'pablo-mendez',name:'Pablo Mendez',nation:'Spain',pos:'CAM',group:'MID',rating:63,pace:66,shot:62,pass:70,def:39,color:'#cb8c68'},
    {id:'sana-ito',name:'Sana Ito',nation:'Japan',pos:'GK',group:'GK',rating:61,pace:43,shot:22,pass:55,def:66,color:'#e5ae87'}
  ];
  const playerMap = new Map(players.map(player => [player.id, player]));
  const initialIds = players.slice(0, 15).map(player => player.id);

  const formations = {
    '4-3-3':[
      {key:'GK',role:'GK',x:50,y:91},{key:'LB',role:'LB',x:16,y:75},{key:'LCB',role:'CB',x:39,y:79},{key:'RCB',role:'CB',x:61,y:79},{key:'RB',role:'RB',x:84,y:75},
      {key:'LCM',role:'CM',x:26,y:52},{key:'CM',role:'CM',x:50,y:58},{key:'RCM',role:'CM',x:74,y:52},{key:'LW',role:'LW',x:18,y:25},{key:'ST',role:'ST',x:50,y:16},{key:'RW',role:'RW',x:82,y:25}
    ],
    '4-4-2':[
      {key:'GK',role:'GK',x:50,y:91},{key:'LB',role:'LB',x:16,y:75},{key:'LCB',role:'CB',x:39,y:79},{key:'RCB',role:'CB',x:61,y:79},{key:'RB',role:'RB',x:84,y:75},
      {key:'LM',role:'LW',x:15,y:51},{key:'LCM',role:'CM',x:39,y:58},{key:'RCM',role:'CM',x:61,y:58},{key:'RM',role:'RW',x:85,y:51},{key:'LST',role:'ST',x:37,y:20},{key:'RST',role:'ST',x:63,y:20}
    ],
    '3-5-2':[
      {key:'GK',role:'GK',x:50,y:91},{key:'LCB',role:'CB',x:25,y:77},{key:'CB',role:'CB',x:50,y:81},{key:'RCB',role:'CB',x:75,y:77},
      {key:'LM',role:'LB',x:13,y:51},{key:'LCM',role:'CM',x:34,y:58},{key:'CAM',role:'CAM',x:50,y:44},{key:'RCM',role:'CM',x:66,y:58},{key:'RM',role:'RB',x:87,y:51},{key:'LST',role:'ST',x:37,y:19},{key:'RST',role:'ST',x:63,y:19}
    ]
  };

  const defaults = {
    version:1,coins:4200,energy:12,maxEnergy:15,tokens:18,xp:540,rankPoints:320,
    wins:0,draws:0,losses:0,skillBest:0,cupWins:0,cups:0,formation:'4-3-3',squad:{},
    owned:Object.fromEntries(initialIds.map(id => [id,{level:1,shards:0}])),
    lastDaily:'',lastEnergyAt:Date.now(),sound:true,vibration:true,totalPacks:0,totalGoals:0
  };

  let state = loadState();
  let selectedSlot = null;
  let selectedMode = 'ranked';
  let collectionFilter = 'ALL';
  let collectionSortAsc = false;
  let upgradePlayerId = null;
  let pendingReveals = [];
  let revealIndex = 0;
  let toastTimer = 0;
  let audioContext = null;

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function loadState(){
    try{
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(!raw || raw.version !== 1) return clone(defaults);
      const loaded = {...clone(defaults),...raw};
      loaded.owned = {...clone(defaults.owned),...(raw.owned || {})};
      loaded.squad = raw.squad || {};
      return loaded;
    }catch(error){ return clone(defaults); }
  }
  function saveState(){
    try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }catch(error){ /* Storage can be unavailable in private mode. */ }
  }
  function applyEnergyRegen(){
    const now = Date.now();
    const elapsed = Math.floor((now - Number(state.lastEnergyAt || now)) / 900000);
    if(elapsed > 0){
      state.energy = Math.min(state.maxEnergy,state.energy + elapsed);
      state.lastEnergyAt += elapsed * 900000;
      saveState();
    }
  }
  function todayKey(){ return new Date().toISOString().slice(0,10); }
  function getOwnedPlayers(){ return Object.keys(state.owned).map(id => playerMap.get(id)).filter(Boolean); }
  function levelOf(id){ return Math.max(1,Number(state.owned[id]?.level || 1)); }
  function ratingOf(id){ const player=playerMap.get(id); return player ? Math.min(99,player.rating + levelOf(id)-1) : 0; }
  function statOf(id,key){ const player=playerMap.get(id); return player ? Math.min(99,player[key] + levelOf(id)-1) : 0; }
  function initials(name){ return name.split(' ').map(part=>part[0]).join('').slice(0,2).toUpperCase(); }
  function rarity(player){ const rating=ratingOf(player.id); return rating>=84?'elite':rating>=77?'rare':'common'; }
  function roleGroup(role){ if(role==='GK') return 'GK'; if(['LB','RB','CB'].includes(role)) return 'DEF'; if(['CM','CDM','CAM'].includes(role)) return 'MID'; return 'ATT'; }
  function compatibility(player,role){
    if(player.pos===role) return 24;
    if(player.group===roleGroup(role)) return 10;
    if((role==='LB'||role==='RB')&&player.pos==='CB') return 5;
    if((role==='LW'||role==='RW')&&player.pos==='ST') return 5;
    return -12;
  }
  function autoBuildSquad(){
    const remaining = getOwnedPlayers().slice();
    const result = {};
    formations[state.formation].forEach(slot => {
      remaining.sort((a,b)=>(ratingOf(b.id)+compatibility(b,slot.role))-(ratingOf(a.id)+compatibility(a,slot.role)));
      const pick=remaining.shift();
      if(pick) result[slot.key]=pick.id;
    });
    state.squad=result;
  }
  function ensureSquad(){
    const slots=formations[state.formation];
    const values=Object.values(state.squad).filter(id=>state.owned[id]);
    if(slots.some(slot=>!state.squad[slot.key]) || new Set(values).size!==values.length || Object.keys(state.squad).some(key=>!slots.find(slot=>slot.key===key))) autoBuildSquad();
  }

  function squadStats(){
    const ids=Object.values(state.squad).filter(id=>state.owned[id]);
    if(!ids.length) return {ovr:0,chem:0,att:0,def:0};
    const ovr=Math.round(ids.reduce((sum,id)=>sum+ratingOf(id),0)/ids.length);
    const attack=ids.map(id=>playerMap.get(id)).filter(p=>p?.group==='ATT');
    const defense=ids.map(id=>playerMap.get(id)).filter(p=>p?.group==='DEF'||p?.group==='GK');
    const att=attack.length?Math.round(attack.reduce((sum,p)=>sum+statOf(p.id,'shot'),0)/attack.length):ovr;
    const def=defense.length?Math.round(defense.reduce((sum,p)=>sum+statOf(p.id,'def'),0)/defense.length):ovr;
    let correct=0;
    formations[state.formation].forEach(slot=>{ const p=playerMap.get(state.squad[slot.key]); if(p) correct+=p.pos===slot.role?8:p.group===roleGroup(slot.role)?5:2; });
    const nationVariety=new Set(ids.map(id=>playerMap.get(id)?.nation)).size;
    const chem=Math.min(100,Math.round(36+correct*.64+nationVariety*1.7));
    return {ovr,chem,att,def};
  }
  function rankInfo(points=state.rankPoints){
    const ranks=[['BRONZE III',0],['BRONZE II',200],['BRONZE I',400],['SILVER III',600],['SILVER II',850],['SILVER I',1100],['GOLD III',1400],['GOLD II',1750],['GOLD I',2150],['ELITE',2600]];
    let index=0;
    ranks.forEach((rank,i)=>{ if(points>=rank[1]) index=i; });
    const current=ranks[index],next=ranks[Math.min(index+1,ranks.length-1)];
    const span=Math.max(1,next[1]-current[1]);
    const progress=index===ranks.length-1?100:Math.round((points-current[1])/span*100);
    return {name:current[0],progress,next:next[1]};
  }
  function clubLevel(){ return Math.max(1,Math.floor(state.xp/250)+1); }

  function showToast(message){
    const toast=$('#toast');
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),2300);
  }
  function tone(frequency=440,duration=.08,type='sine'){
    if(!state.sound) return;
    try{
      audioContext ||= new (window.AudioContext||window.webkitAudioContext)();
      const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
      oscillator.type=type;oscillator.frequency.value=frequency;gain.gain.value=.045;
      gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
      oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration);
    }catch(error){ /* Audio is optional. */ }
  }
  function vibrate(pattern=20){ if(state.vibration && navigator.vibrate) navigator.vibrate(pattern); }

  function renderWallet(){
    $('#coins-value').textContent=nf.format(state.coins);$('#energy-value').textContent=state.energy;
    $('#club-level').textContent=clubLevel();
  }
  function renderHome(){
    const stats=squadStats(),rank=rankInfo();
    $('#hero-rank').textContent=rank.name;$('#hero-rp').textContent=`${nf.format(state.rankPoints)} RP`;$('#hero-rank-progress').style.width=`${rank.progress}%`;
    $('#home-ovr').innerHTML=`${stats.ovr} <span>+${Math.max(1,Math.floor(stats.chem/35))} FORM</span>`;
    $('#home-chem').innerHTML=`${stats.chem} <span>/ 100</span>`;$('#home-record').textContent=`${state.wins}-${state.draws}-${state.losses}`;$('#home-owned').textContent=getOwnedPlayers().length;
    const claimed=state.lastDaily===todayKey(),button=$('#claim-daily');button.disabled=claimed;button.textContent=claimed?'COME BACK TOMORROW':'CLAIM REWARD';
  }
  function renderSquad(){
    const stats=squadStats();
    $('#squad-ovr').textContent=stats.ovr;$('#squad-chem').textContent=stats.chem;$('#squad-att').textContent=stats.att;$('#squad-def').textContent=stats.def;
    $('#formation-select').value=state.formation;
    const pitch=$('#squad-pitch');
    $$('.fz-slot',pitch).forEach(node=>node.remove());
    formations[state.formation].forEach(slot=>{
      const id=state.squad[slot.key],player=playerMap.get(id),button=document.createElement('button');
      button.className=`fz-slot${selectedSlot===slot.key?' selected':''}${player?'':' empty'}`;button.style.left=`${slot.x}%`;button.style.top=`${slot.y}%`;button.dataset.slot=slot.key;button.setAttribute('aria-label',player?`${slot.role}: ${player.name}`:`Empty ${slot.role}`);
      button.innerHTML=player?`<div class="fz-slot-card"><b class="fz-slot-rating">${ratingOf(id)}</b><span class="fz-slot-pos">${slot.role}</span><div class="fz-slot-avatar" style="background:${player.color}">${initials(player.name)}</div><span class="fz-slot-name">${player.name}</span></div><small>${slot.key}</small>`:`<div class="fz-slot-card">+</div><small>${slot.key}</small>`;
      pitch.append(button);
    });
    renderSquadPlayerList();
  }
  function renderSquadPlayerList(){
    const query=$('#roster-search').value.trim().toLowerCase(),sort=$('#roster-sort').value;
    const assigned=new Set(Object.values(state.squad));
    let roster=getOwnedPlayers().filter(p=>!query||p.name.toLowerCase().includes(query)||p.pos.toLowerCase().includes(query));
    roster.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='position'?a.pos.localeCompare(b.pos)||ratingOf(b.id)-ratingOf(a.id):ratingOf(b.id)-ratingOf(a.id));
    $('#roster-count').textContent=`${getOwnedPlayers().length} OWNED`;
    $('#squad-player-list').innerHTML=roster.map(player=>`<button class="fz-player-row${assigned.has(player.id)?' selected':''}" data-squad-player="${player.id}"><span class="fz-row-avatar" style="background:${player.color}">${initials(player.name)}</span><span><h4>${player.name}</h4><p>${player.pos} • ${player.nation} • LV ${levelOf(player.id)}</p></span><span class="fz-row-rating">${ratingOf(player.id)}<small>${assigned.has(player.id)?'STARTING':'RESERVE'}</small></span></button>`).join('') || '<p style="padding:20px;color:var(--fz-muted);font-size:10px">No players match that search.</p>';
  }
  function assignPlayer(playerId){
    if(!selectedSlot){ showToast('Select a position on the pitch first.');return; }
    const oldId=state.squad[selectedSlot];
    const currentKey=Object.keys(state.squad).find(key=>state.squad[key]===playerId);
    if(currentKey && currentKey!==selectedSlot) state.squad[currentKey]=oldId;
    state.squad[selectedSlot]=playerId;
    const player=playerMap.get(playerId),slot=formations[state.formation].find(item=>item.key===selectedSlot);
    if(player && slot && player.group!==roleGroup(slot.role)) showToast(`${player.name} is out of position, reducing chemistry.`); else showToast(`${player?.name || 'Player'} added to ${selectedSlot}.`);
    selectedSlot=null;saveState();renderAll();tone(560,.07,'triangle');
  }
  function playerCardHTML(player){
    return `<button class="fz-player-card ${rarity(player)}" data-player-card="${player.id}"><span class="fz-card-top"><span><b class="fz-card-rating">${ratingOf(player.id)}</b><small class="fz-card-pos">${player.pos}</small></span><small class="fz-card-level">LV ${levelOf(player.id)}</small></span><span class="fz-card-avatar" style="background:${player.color}">${initials(player.name)}</span><h3>${player.name}</h3><p>${player.nation} • ${state.owned[player.id].shards||0} TOKENS</p><span class="fz-card-stats"><span><b>${statOf(player.id,'pace')}</b>PAC</span><span><b>${statOf(player.id,'shot')}</b>SHT</span><span><b>${statOf(player.id,'pass')}</b>PAS</span></span></button>`;
  }
  function renderCollection(){
    let list=getOwnedPlayers().filter(player=>collectionFilter==='ALL'||player.group===collectionFilter);
    list.sort((a,b)=>collectionSortAsc?ratingOf(a.id)-ratingOf(b.id):ratingOf(b.id)-ratingOf(a.id));
    $('#collection-grid').innerHTML=list.map(playerCardHTML).join('');
    $$('.fz-filter-btn').forEach(button=>button.classList.toggle('active',button.dataset.filter===collectionFilter));
    $('#collection-sort').textContent=`SORT: OVR ${collectionSortAsc?'↑':'↓'}`;
    const rank=rankInfo();$('#club-rank').textContent=rank.name;$('#club-rp').textContent=nf.format(state.rankPoints);$('#club-rank-progress').style.width=`${rank.progress}%`;
    renderAchievements();
  }
  function achievementData(){
    return [
      {icon:'⚽',name:'FIRST WHISTLE',copy:'Complete a match',done:state.wins+state.draws+state.losses>0},
      {icon:'▣',name:'SCOUT NETWORK',copy:'Open 5 player packs',done:state.totalPacks>=5},
      {icon:'★',name:'RISING XI',copy:'Reach 78 squad OVR',done:squadStats().ovr>=78},
      {icon:'🏆',name:'CUP WINNER',copy:'Win a three-match cup',done:state.cups>=1}
    ];
  }
  function renderAchievements(){
    const items=achievementData();$('#achievement-count').textContent=`${items.filter(item=>item.done).length} / ${items.length}`;
    $('#achievement-list').innerHTML=items.map(item=>`<div class="fz-achievement" style="opacity:${item.done?1:.48}"><span>${item.icon}</span><div><h4>${item.name}${item.done?' ✓':''}</h4><p>${item.copy}</p></div></div>`).join('');
  }
  function renderAll(){ applyEnergyRegen();ensureSquad();renderWallet();renderHome();renderSquad();renderCollection();renderMode();saveState(); }

  function setView(name){
    $$('.fz-view').forEach(view=>view.classList.toggle('active',view.id===`view-${name}`));
    $$('.fz-nav-btn').forEach(button=>button.classList.toggle('active',button.dataset.view===name));
    window.scrollTo({top:0,behavior:'smooth'});
    if(name==='club') renderCollection();
    if(name==='squad') renderSquad();
  }

  const modeDetails={
    ranked:{kicker:'DIVISION FOOTBALL',title:'RANKED<br>ROAD',copy:'Face an adaptive opponent. Wins add rank points; losses cost a few. Your best squad starts automatically.',badges:['2 ⚡ ENTRY','+45 RP WIN','90 SECOND MATCH'],energy:2,time:90},
    quick:{kicker:'ARCADE FOOTBALL',title:'QUICK<br>MATCH',copy:'A fast three-a-side match with instant coin rewards and no rank pressure. Great for learning the controls.',badges:['1 ⚡ ENTRY','COIN REWARDS','75 SECOND MATCH'],energy:1,time:75},
    skill:{kicker:'TRAINING GROUND',title:'TARGET<br>RUSH',copy:'Dribble into range and strike the glowing targets. Chain hits quickly to set a new club record.',badges:['1 ⚡ ENTRY','NO OPPONENTS','45 SECOND CHALLENGE'],energy:1,time:45},
    tournament:{kicker:'THREE-MATCH EVENT',title:'ZERO<br>CUP',copy:'Win three matches in a row to lift the Zero Cup. A loss resets the run, so every goal matters.',badges:['2 ⚡ ENTRY','3 WINS FOR TROPHY','75 SECOND MATCH'],energy:2,time:75}
  };
  const opponentNames=['Northstar FC','Harbor City','Solar Athletic','Metro Rovers','Atlas Union','Pinecrest XI','Rivergate Club','Orchid Town'];
  let currentOpponent={name:'Northstar FC',ovr:71};
  function pickOpponent(){
    const own=squadStats().ovr;currentOpponent={name:opponentNames[Math.floor(Math.random()*opponentNames.length)],ovr:Math.max(60,own-3+Math.floor(Math.random()*7))};
  }
  function renderMode(){
    const detail=modeDetails[selectedMode];
    $$('.fz-mode-btn').forEach(button=>button.classList.toggle('active',button.dataset.mode===selectedMode));
    $('#mode-kicker').textContent=detail.kicker;$('#mode-title').innerHTML=detail.title;$('#mode-copy').textContent=detail.copy;$('#mode-badges').innerHTML=detail.badges.map(badge=>`<span>${badge}</span>`).join('');
    $('#opponent-name').textContent=selectedMode==='skill'?'TRAINING WALL':currentOpponent.name.toUpperCase();$('#opponent-ovr').textContent=selectedMode==='skill'?`BEST ${nf.format(state.skillBest)} PTS`:`OVR ${currentOpponent.ovr}`;
    const button=$('#start-match');button.textContent=state.energy>=detail.energy?'START MATCH →':`NEED ${detail.energy} ENERGY`;
  }

  function openUpgrade(playerId){
    const player=playerMap.get(playerId);if(!player)return;upgradePlayerId=playerId;
    const level=levelOf(playerId),costCoins=250*level,costTokens=3+level*2,can=state.coins>=costCoins&&(state.tokens+(state.owned[playerId].shards||0))>=costTokens&&level<10;
    $('#upgrade-content').innerHTML=`<div class="fz-upgrade-hero"><div class="fz-upgrade-avatar" style="background:linear-gradient(145deg,${player.color},#142542)">${initials(player.name)}</div><div class="fz-upgrade-name"><h3>${player.name}</h3><p>${player.pos} • ${player.nation} • LEVEL ${level}</p><strong style="font-size:35px">${ratingOf(playerId)} <small style="font-size:10px;color:var(--fz-lime)">OVR</small></strong></div></div><div class="fz-upgrade-stats"><div class="fz-upgrade-stat"><b>${statOf(playerId,'pace')} ${level<10?'→ '+Math.min(99,statOf(playerId,'pace')+1):''}</b>PACE</div><div class="fz-upgrade-stat"><b>${statOf(playerId,'shot')} ${level<10?'→ '+Math.min(99,statOf(playerId,'shot')+1):''}</b>SHOOT</div><div class="fz-upgrade-stat"><b>${statOf(playerId,'pass')} ${level<10?'→ '+Math.min(99,statOf(playerId,'pass')+1):''}</b>PASS</div></div><div class="fz-upgrade-cost"><span>UPGRADE COST<br><small>You have ${state.tokens+(state.owned[playerId].shards||0)} tokens</small></span><strong>${nf.format(costCoins)} ● + ${costTokens} TOKENS</strong></div><button class="fz-btn primary" id="confirm-upgrade" style="width:100%;margin-top:12px" ${can?'':'disabled'}>${level>=10?'MAX LEVEL':can?'UPGRADE TO LEVEL '+(level+1):'MORE RESOURCES NEEDED'}</button>`;
    $('#upgrade-modal').hidden=false;
  }
  function upgradePlayer(){
    const id=upgradePlayerId,level=levelOf(id);if(!id||level>=10)return;
    const coinCost=250*level,tokenCost=3+level*2,personal=state.owned[id].shards||0,total=personal+state.tokens;
    if(state.coins<coinCost||total<tokenCost){showToast('Not enough coins or upgrade tokens.');return;}
    state.coins-=coinCost;
    const usedPersonal=Math.min(personal,tokenCost);state.owned[id].shards=personal-usedPersonal;state.tokens-=tokenCost-usedPersonal;state.owned[id].level=level+1;state.xp+=35;
    saveState();renderAll();openUpgrade(id);tone(760,.16,'triangle');vibrate([25,30,25]);showToast(`${playerMap.get(id).name} reached level ${level+1}!`);
  }

  const packTypes={academy:{count:1,min:60,currency:'coins',cost:600,label:'ACADEMY PACK'},pro:{count:2,min:70,currency:'coins',cost:1400,label:'PRO PACK'},elite:{count:3,min:78,currency:'coins',cost:2400,label:'ELITE PACK'},daily:{count:1,min:60,currency:null,cost:0,label:'DAILY CLUB DROP'}};
  function weightedPlayer(minRating,index,pack){
    let pool=players.filter(player=>player.rating>=minRating);
    if(pack==='elite'&&index>0) pool=players.filter(player=>player.rating>=70);
    const weighted=[];
    pool.forEach(player=>{ const weight=Math.max(1,10-Math.floor((player.rating-minRating)/2));for(let i=0;i<weight;i++)weighted.push(player); });
    return weighted[Math.floor(Math.random()*weighted.length)];
  }
  function openPack(type,free=false){
    const pack=packTypes[type];if(!pack)return;
    if(!free&&state[pack.currency]<pack.cost){showToast(`Not enough ${pack.currency}.`);tone(150,.1,'square');return;}
    if(!free) state[pack.currency]-=pack.cost;
    const results=[];
    for(let i=0;i<pack.count;i++){
      const min=i===0?pack.min:Math.max(60,pack.min-8),player=weightedPlayer(min,i,type),duplicate=Boolean(state.owned[player.id]),tokens=duplicate?(player.rating>=84?8:player.rating>=77?5:3):0;
      if(duplicate) state.owned[player.id].shards=(state.owned[player.id].shards||0)+tokens; else state.owned[player.id]={level:1,shards:0};
      results.push({player,duplicate,tokens});
    }
    state.totalPacks++;state.xp+=pack.count*15;pendingReveals=results;revealIndex=0;saveState();renderWallet();renderReveal(pack.label);$('#pack-modal').hidden=false;tone(260,.12,'sawtooth');
  }
  function renderReveal(label){
    const result=pendingReveals[revealIndex];if(!result){closePackReveal();return;}
    const player=result.player,rare=rarity(player);
    $('#pack-progress').textContent=`${label||'NEW SIGNING'} • ${revealIndex+1} / ${pendingReveals.length}`;
    const wrap=$('#reveal-wrap');wrap.innerHTML=`<div class="fz-reveal-card"><div class="fz-reveal-inner ${rare}"><div class="fz-reveal-rating">${player.rating}</div><div class="fz-reveal-pos">${player.pos}</div><div class="fz-reveal-avatar" style="background:${player.color}">${initials(player.name)}</div><h3>${player.name}</h3><p>${player.nation} • ${rare.toUpperCase()}</p><div class="fz-reveal-stats"><span><b>${player.pace}</b>PAC</span><span><b>${player.shot}</b>SHT</span><span><b>${player.pass}</b>PAS</span></div></div></div>`;
    $('#duplicate-copy').textContent=result.duplicate?`DUPLICATE CONVERTED TO ${result.tokens} ${player.name.toUpperCase()} TOKENS`:'NEW PLAYER ADDED TO YOUR CLUB';
    $('#reveal-next').textContent=revealIndex===pendingReveals.length-1?'COLLECT ALL':'NEXT PLAYER';
    setTimeout(()=>{tone(rare==='elite'?880:rare==='rare'?680:520,.18,'triangle');vibrate(rare==='elite'?[30,40,50]:25);},450);
  }
  function nextReveal(){ revealIndex++;if(revealIndex>=pendingReveals.length)closePackReveal();else renderReveal(); }
  function closePackReveal(){ $('#pack-modal').hidden=true;pendingReveals=[];renderAll();showToast('Pack rewards added to your club.'); }

  // Real-time match engine. Physics use elapsed time and rendering runs on native requestAnimationFrame.
  const canvas=$('#football-canvas'),ctx=canvas.getContext('2d');
  const W=960,H=540,field={left:45,right:915,top:42,bottom:498,goalTop:205,goalBottom:335};
  const input={up:false,down:false,left:false,right:false,sprint:false};
  let dpr=1,rafId=0,lastFrame=0,fpsFrames=0,fpsTime=0;
  let game=null;
  function resizeCanvas(){ dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0); }
  function createPlayer(x,y,team,index){return{x,y,vx:0,vy:0,r:17,team,index,cooldown:0,homeX:x,homeY:y};}
  function setupGame(mode){
    const duration=modeDetails[mode].time;
    game={mode,active:false,finished:false,arcadePointsAwarded:false,time:duration,homeScore:0,awayScore:0,skillScore:0,combo:0,controlled:0,messageTime:0,resetTime:0,opponentKick:0,
      home:[createPlayer(300,270,'home',0),createPlayer(180,155,'home',1),createPlayer(180,385,'home',2)],
      away:mode==='skill'?[]:[createPlayer(650,270,'away',0),createPlayer(780,155,'away',1),createPlayer(780,385,'away',2)],
      ball:{x:480,y:270,vx:0,vy:0,r:10},lastTouch:'home',target:{x:875,y:150+Math.random()*240,r:29,phase:0},shots:0,passes:0
    };
    updateScoreUI();drawGame();
  }
  function updateScoreUI(){
    if(!game)return;$('#score-home').textContent=game.mode==='skill'?nf.format(game.skillScore):game.homeScore;$('#score-away').textContent=game.mode==='skill'?'PTS':game.awayScore;
    const time=Math.max(0,Math.ceil(game.time)),minutes=Math.floor(time/60),seconds=String(time%60).padStart(2,'0');$('#match-clock').textContent=`${String(minutes).padStart(2,'0')}:${seconds}`;
  }
  function launchMatch(mode){
    applyEnergyRegen();const detail=modeDetails[mode];
    if(state.energy<detail.energy){showToast(`You need ${detail.energy} energy. One energy returns every 15 minutes.`);renderAll();return;}
    state.energy-=detail.energy;state.lastEnergyAt=Date.now();saveState();renderWallet();selectedMode=mode;pickOpponent();
    $('#match-screen').hidden=false;document.body.style.overflow='hidden';$('#away-name').textContent=mode==='skill'?'TARGETS':currentOpponent.name.split(' ')[0].toUpperCase();
    $('#match-overlay').hidden=false;$('#match-overlay-icon').textContent=mode==='skill'?'🎯':'⚽';$('#match-overlay-title').textContent=mode==='skill'?'TARGET RUSH':'READY?';$('#match-overlay-copy').textContent=mode==='skill'?'Move into range and shoot at the glowing target. Score quickly to build a combo.':'Move with WASD or arrows. Pass with Z, shoot with X, and hold Shift to sprint.';$('#result-stats').innerHTML='';$('#match-begin').textContent=mode==='skill'?'START CHALLENGE':'KICK OFF';$('#match-begin').dataset.result='';
    setupGame(mode);resizeCanvas();lastFrame=performance.now();fpsFrames=0;fpsTime=lastFrame;cancelAnimationFrame(rafId);rafId=requestAnimationFrame(gameLoop);
  }
  function beginGame(){
    if(!game)return;
    if(game.finished){ closeMatch();launchMatch(selectedMode);return; }
    $('#match-overlay').hidden=true;game.active=true;lastFrame=performance.now();showMatchMessage(game.mode==='skill'?'GO!':'KICK OFF!');tone(520,.1,'square');
  }
  function closeMatch(){
    if(game)game.active=false;cancelAnimationFrame(rafId);rafId=0;$('#match-screen').hidden=true;document.body.style.overflow='';Object.keys(input).forEach(key=>input[key]=false);renderAll();
  }
  function showMatchMessage(text){ const node=$('#match-message');node.textContent='';void node.offsetWidth;node.textContent=text; }
  function nearestPlayer(team,x,y){ let best=null,bestDistance=Infinity;team.forEach(player=>{const distance=(player.x-x)**2+(player.y-y)**2;if(distance<bestDistance){best=player;bestDistance=distance;}});return best; }
  function clampPlayer(player){player.x=Math.max(field.left+player.r,Math.min(field.right-player.r,player.x));player.y=Math.max(field.top+player.r,Math.min(field.bottom-player.r,player.y));}
  function updateControlled(dt){
    const player=game.home[game.controlled];let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0),length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;
    const speed=input.sprint?245:185,accel=12;player.vx+=(dx*speed-player.vx)*Math.min(1,dt*accel);player.vy+=(dy*speed-player.vy)*Math.min(1,dt*accel);player.x+=player.vx*dt;player.y+=player.vy*dt;clampPlayer(player);
    game.home.forEach((mate,index)=>{
      if(index===game.controlled)return;
      const closest=nearestPlayer(game.home,game.ball.x,game.ball.y)===mate;
      // Every teammate keeps moving: the closest player presses the ball while
      // the others run into passing lanes instead of freezing at home positions.
      const laneX=index===1?-76:-42,laneY=index===1?-72:72;
      const tx=closest?game.ball.x-18:Math.max(field.left+mate.r,Math.min(field.right-mate.r,game.ball.x+laneX));
      const ty=closest?game.ball.y:Math.max(field.top+mate.r,Math.min(field.bottom-mate.r,game.ball.y+laneY));
      moveAI(mate,tx,ty,dt,closest?148:132);
    });
  }
  function moveAI(player,tx,ty,dt,speed){
    const dx=tx-player.x,dy=ty-player.y,d=Math.hypot(dx,dy)||1;player.vx+=(dx/d*speed-player.vx)*Math.min(1,dt*6);player.vy+=(dy/d*speed-player.vy)*Math.min(1,dt*6);if(d<12){player.vx*=.7;player.vy*=.7;}player.x+=player.vx*dt;player.y+=player.vy*dt;clampPlayer(player);
  }
  function updateOpponents(dt){
    const chaser=nearestPlayer(game.away,game.ball.x,game.ball.y);
    game.away.forEach((player,index)=>{
      const tx=player===chaser?game.ball.x:player.homeX+(game.ball.x-480)*.18,ty=player===chaser?game.ball.y:player.homeY+(game.ball.y-270)*.15;
      moveAI(player,tx,ty,dt,142+(currentOpponent.ovr-70)*1.5);player.cooldown=Math.max(0,player.cooldown-dt);
      if(player===chaser&&Math.hypot(player.x-game.ball.x,player.y-game.ball.y)<30&&player.cooldown<=0){
        const targetX=field.left+92,targetY=Math.max(field.goalTop+32,Math.min(field.goalBottom-32,270+(Math.random()-.5)*70));
        const angle=Math.atan2(targetY-player.y,targetX-player.x)+(Math.random()-.5)*.12;game.ball.vx=Math.cos(angle)*390;game.ball.vy=Math.sin(angle)*390;game.lastTouch='away';player.cooldown=.8;game.opponentKick++;tone(170,.04,'square');
      }
    });
  }
  function collidePlayersWithBall(players){
    players.forEach(player=>{
      const dx=game.ball.x-player.x,dy=game.ball.y-player.y,d=Math.hypot(dx,dy)||1,min=player.r+game.ball.r;
      if(d<min){const overlap=min-d;game.ball.x+=dx/d*overlap;game.ball.y+=dy/d*overlap;game.ball.vx+=player.vx*.28+dx/d*35;game.ball.vy+=player.vy*.28+dy/d*35;game.lastTouch=player.team;}
    });
  }
  function resetPositions(direction=0){
    game.ball.x=480;game.ball.y=270;game.ball.vx=direction*50;game.ball.vy=0;game.lastTouch=direction<0?'away':'home';
    [[300,270],[180,155],[180,385]].forEach((p,i)=>Object.assign(game.home[i],{x:p[0],y:p[1],vx:0,vy:0}));
    game.away.forEach((player,i)=>{const p=[[650,270],[780,155],[780,385]][i];Object.assign(player,{x:p[0],y:p[1],vx:0,vy:0});});
    game.resetTime=.7;
  }
  function scoreGoal(team){
    if(team==='home'){game.homeScore++;state.totalGoals++;showMatchMessage('GOAL!');tone(780,.24,'sawtooth');vibrate([30,30,70]);}else{game.awayScore++;showMatchMessage('THEY SCORE');tone(145,.24,'square');}
    updateScoreUI();resetPositions(team==='home'?-1:1);
  }
  function updateBall(dt){
    const ball=game.ball;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;const friction=Math.pow(.42,dt);ball.vx*=friction;ball.vy*=friction;
    if(game.mode==='skill'){
      game.target.phase+=dt*2.5;game.target.y+=Math.sin(game.target.phase)*18*dt;
      if(Math.hypot(ball.x-game.target.x,ball.y-game.target.y)<ball.r+game.target.r){
        game.combo++;const points=150+Math.min(350,game.combo*25);game.skillScore+=points;showMatchMessage(`+${points}`);tone(620+Math.min(250,game.combo*35),.11,'triangle');vibrate(25);game.target.y=100+Math.random()*340;game.target.phase=Math.random()*6;ball.x=game.home[game.controlled].x+25;ball.y=game.home[game.controlled].y;ball.vx=ball.vy=0;updateScoreUI();
      }
      if(ball.x>field.right+30||ball.x<field.left-30||ball.y<field.top-30||ball.y>field.bottom+30){game.combo=0;ball.x=game.home[game.controlled].x+25;ball.y=game.home[game.controlled].y;ball.vx=ball.vy=0;}
    }else{
      const inGoal=ball.y>field.goalTop&&ball.y<field.goalBottom;
      if(ball.x>field.right+14&&inGoal){scoreGoal('home');return;}
      if(ball.x<field.left-14&&inGoal){
        if(game.lastTouch==='home'){
          showMatchMessage('CLEAR!');
          tone(360,.08,'triangle');
          resetPositions(1);
          return;
        }
        scoreGoal('away');return;
      }
      // Always give a wall bounce a small impulse. Without this floor, a ball
      // that has slowed to zero in a corner reflects with `-Math.abs(0)` and
      // remains pinned there forever.
      const bounceSpeed=value=>Math.max(55,Math.abs(value)*.72);
      if(ball.x>field.right-ball.r&&!inGoal){ball.x=field.right-ball.r;ball.vx=-bounceSpeed(ball.vx);}if(ball.x<field.left+ball.r&&!inGoal){ball.x=field.left+ball.r;ball.vx=bounceSpeed(ball.vx);}
      if(ball.y<field.top+ball.r){ball.y=field.top+ball.r;ball.vy=bounceSpeed(ball.vy);}if(ball.y>field.bottom-ball.r){ball.y=field.bottom-ball.r;ball.vy=-bounceSpeed(ball.vy);}
      const nearLeft=ball.x<=field.left+ball.r+2,nearRight=ball.x>=field.right-ball.r-2,nearTop=ball.y<=field.top+ball.r+2,nearBottom=ball.y>=field.bottom-ball.r-2;
      if(!inGoal&&(nearLeft||nearRight)&&(nearTop||nearBottom)&&(Math.hypot(ball.vx,ball.vy)<125)){
        ball.vx=(nearLeft?1:-1)*165;ball.vy=(nearTop?1:-1)*135;
      }
    }
  }
  function updateGame(dt){
    if(!game?.active)return;
    game.time-=dt;if(game.time<=0){game.time=0;updateScoreUI();finishGame();return;}
    if(game.resetTime>0){game.resetTime-=dt;return;}
    updateControlled(dt);if(game.mode!=='skill')updateOpponents(dt);collidePlayersWithBall(game.home);collidePlayersWithBall(game.away);updateBall(dt);updateScoreUI();
  }
  function actionShoot(){
    if(!game?.active||game.resetTime>0)return;const player=game.home[game.controlled],ball=game.ball;if(Math.hypot(player.x-ball.x,player.y-ball.y)>48){showMatchMessage('GET CLOSER');return;}
    let targetY=game.mode==='skill'?game.target.y:270+(input.down?85:0)-(input.up?85:0),targetX=field.right+35,dx=targetX-ball.x,dy=targetY-ball.y,d=Math.hypot(dx,dy)||1;ball.vx=dx/d*590;ball.vy=dy/d*590;game.lastTouch='home';game.shots++;tone(280,.07,'square');vibrate(18);
  }
  function actionPass(){
    if(!game?.active)return;const player=game.home[game.controlled],ball=game.ball;if(Math.hypot(player.x-ball.x,player.y-ball.y)>50)return;
    let candidates=game.home.filter((_,index)=>index!==game.controlled);candidates.sort((a,b)=>b.x-a.x||Math.abs(a.y-ball.y)-Math.abs(b.y-ball.y));const target=candidates[0];if(!target)return;
    const dx=target.x-ball.x,dy=target.y-ball.y,d=Math.hypot(dx,dy)||1;ball.vx=dx/d*410;ball.vy=dy/d*410;game.lastTouch='home';game.controlled=target.index;game.passes++;tone(390,.05,'triangle');
  }
  function switchPlayer(){
    if(!game?.active)return;
    const current=game.home[game.controlled];
    const candidates=game.home.filter(player=>player!==current).sort((a,b)=>Math.hypot(a.x-game.ball.x,a.y-game.ball.y)-Math.hypot(b.x-game.ball.x,b.y-game.ball.y));
    if(!candidates.length)return;
    game.controlled=candidates[0].index;
    showMatchMessage(`PLAYER ${game.controlled+1}`);
    tone(470,.05,'triangle');
  }
  function awardArcadePoints(amount,reason){
    if(!game||game.arcadePointsAwarded||!Number.isFinite(amount)||amount<=0)return;
    game.arcadePointsAwarded=true;
    try{
      if(typeof window.RecessPoints?.award==='function')window.RecessPoints.award(Math.round(amount),reason);
    }catch(error){ /* The host points display is optional and must never interrupt a match result. */ }
  }
  function finishGame(){
    if(!game||game.finished)return;game.active=false;game.finished=true;
    let title,copy,icon='🏁',coinReward=0,rpChange=0,arcadePoints=0,arcadeReason='';
    if(game.mode==='skill'){
      const isBest=game.skillScore>state.skillBest;state.skillBest=Math.max(state.skillBest,game.skillScore);coinReward=120+Math.floor(game.skillScore/20);state.coins+=coinReward;state.xp+=25;title=isBest?'NEW RECORD!':'SESSION COMPLETE';copy=`You scored ${nf.format(game.skillScore)} points and earned ${nf.format(coinReward)} coins.`;icon='🎯';
      arcadePoints=10+Math.min(70,Math.floor(game.skillScore/100));arcadeReason=`Kickoff Zero skill performance: ${game.skillScore} points`;
    }else{
      const result=game.homeScore>game.awayScore?'win':game.homeScore<game.awayScore?'loss':'draw';
      if(result==='win'){state.wins++;coinReward=game.mode==='tournament'?500:320;rpChange=game.mode==='ranked'?45:0;title='VICTORY!';icon='🏆';}
      else if(result==='loss'){state.losses++;coinReward=90;rpChange=game.mode==='ranked'?-18:0;title='FULL TIME';icon='◆';}
      else{state.draws++;coinReward=160;rpChange=game.mode==='ranked'?8:0;title='DRAW';icon='⚖';}
      arcadePoints=result==='win'?40:result==='draw'?25:15;arcadeReason=`Kickoff Zero ${game.mode} match ${result}`;
      state.coins+=coinReward;state.rankPoints=Math.max(0,state.rankPoints+rpChange);state.xp+=result==='win'?60:30;
      if(game.mode==='tournament'){
        if(result==='win'){state.cupWins++;if(state.cupWins>=3){state.cups++;state.cupWins=0;coinReward+=900;state.coins+=900;title='ZERO CUP WON!';copy='Three wins complete! Trophy secured, plus 900 bonus coins.';icon='♛';arcadePoints+=100;arcadeReason='Kickoff Zero tournament championship';}}
        else state.cupWins=0;
      }
      copy ||= `${game.homeScore}–${game.awayScore}. You earned ${nf.format(coinReward)} coins${rpChange?` and ${rpChange>0?'+':''}${rpChange} RP`:''}.`;
    }
    awardArcadePoints(arcadePoints,arcadeReason);
    saveState();renderWallet();$('#match-overlay-icon').textContent=icon;$('#match-overlay-title').textContent=title;$('#match-overlay-copy').textContent=copy;$('#result-stats').innerHTML=`<span>${game.mode==='skill'?nf.format(game.skillScore)+' PTS':game.homeScore+' - '+game.awayScore}</span><span>+${nf.format(coinReward)} ●</span>${rpChange?`<span>${rpChange>0?'+':''}${rpChange} RP</span>`:''}`;$('#match-begin').textContent='PLAY AGAIN';$('#match-begin').dataset.result='true';$('#match-overlay').hidden=false;tone(title.includes('VICTORY')||title.includes('WON')?760:260,.25,'triangle');
  }
  function gameLoop(timestamp){
    if($('#match-screen').hidden)return;
    const dt=Math.min(.033,Math.max(0,(timestamp-lastFrame)/1000));lastFrame=timestamp;fpsFrames++;
    if(timestamp-fpsTime>=500){const fps=Math.round(fpsFrames*1000/(timestamp-fpsTime));$('#fps-value').textContent=fps;fpsFrames=0;fpsTime=timestamp;}
    updateGame(dt);drawGame();rafId=requestAnimationFrame(gameLoop);
  }
  function roundedRect(x,y,w,h,r,fill){
    const radius=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+radius,y);ctx.lineTo(x+w-radius,y);ctx.quadraticCurveTo(x+w,y,x+w,y+radius);ctx.lineTo(x+w,y+h-radius);ctx.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);ctx.lineTo(x+radius,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-radius);ctx.lineTo(x,y+radius);ctx.quadraticCurveTo(x,y,x+radius,y);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
  }
  function drawPitch(){
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0e7847';ctx.fillRect(0,0,W,H);
    for(let i=0;i<10;i++){ctx.fillStyle=i%2?'rgba(255,255,255,.025)':'rgba(0,0,0,.035)';ctx.fillRect(i*W/10,0,W/10,H);}
    ctx.strokeStyle='rgba(255,255,255,.76)';ctx.lineWidth=3;ctx.strokeRect(field.left,field.top,field.right-field.left,field.bottom-field.top);ctx.beginPath();ctx.moveTo(W/2,field.top);ctx.lineTo(W/2,field.bottom);ctx.stroke();ctx.beginPath();ctx.arc(W/2,H/2,72,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(W/2,H/2,4,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
    ctx.strokeRect(field.left,150,130,240);ctx.strokeRect(field.right-130,150,130,240);ctx.strokeRect(field.left-24,field.goalTop,24,field.goalBottom-field.goalTop);ctx.strokeRect(field.right,field.goalTop,24,field.goalBottom-field.goalTop);
  }
  function drawPlayer(player,controlled=false){
    ctx.save();ctx.translate(player.x,player.y);ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(3,12,20,9,0,0,Math.PI*2);ctx.fill();
    if(controlled){ctx.strokeStyle=varColor('--fz-lime','#b6f13b');ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,24,0,Math.PI*2);ctx.stroke();ctx.fillStyle=varColor('--fz-lime','#b6f13b');ctx.beginPath();ctx.moveTo(-6,-30);ctx.lineTo(6,-30);ctx.lineTo(0,-22);ctx.fill();}
    const color=player.team==='home'?'#38e1cf':'#ff5873';ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,player.r,0,Math.PI*2);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=player.team==='home'?'#d8fff9':'#ffe2e8';ctx.stroke();ctx.fillStyle='#071126';ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(player.index+7,0,1);ctx.restore();
  }
  function varColor(name,fallback){return getComputedStyle(document.documentElement).getPropertyValue(name).trim()||fallback;}
  function drawBall(){const ball=game.ball;ctx.save();ctx.translate(ball.x,ball.y);ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(3,8,12,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='white';ctx.strokeStyle='#071126';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,ball.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#071126';ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawTarget(){
    const target=game.target,pulse=1+Math.sin(target.phase*3)*.08;ctx.save();ctx.translate(target.x,target.y);ctx.scale(pulse,pulse);ctx.shadowColor='#b6f13b';ctx.shadowBlur=24;ctx.fillStyle='rgba(182,241,59,.19)';ctx.strokeStyle='#b6f13b';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,target.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.font='bold 13px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('+'+(150+Math.min(350,(game.combo+1)*25)),0,0);ctx.restore();
  }
  function drawGame(){
    if(!game)return;drawPitch();if(game.mode==='skill')drawTarget();game.home.forEach((player,index)=>drawPlayer(player,index===game.controlled));game.away.forEach(player=>drawPlayer(player));drawBall();
    if(game.mode==='skill'){roundedRect(65,58,170,42,11,'rgba(5,12,26,.72)');ctx.fillStyle='#b6f13b';ctx.font='bold 12px Arial';ctx.textAlign='left';ctx.fillText(`COMBO x${game.combo}`,82,84);}
  }

  function claimDaily(){
    if(state.lastDaily===todayKey()){showToast('Daily reward already claimed.');return;}
    state.lastDaily=todayKey();saveState();openPack('daily',true);
  }
  function openModal(id){$(id).hidden=false;}

  function bindEvents(){
    $$('.fz-nav-btn').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
    $$('[data-view-jump]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.viewJump)));
    $$('[data-go-mode]').forEach(button=>button.addEventListener('click',()=>{selectedMode=button.dataset.goMode;pickOpponent();setView('play');renderMode();}));
    $('#settings-open').addEventListener('click',()=>openModal('#settings-modal'));$('#controls-help').addEventListener('click',()=>openModal('#controls-modal'));
    $$('[data-close-modal]').forEach(button=>button.addEventListener('click',()=>$('#'+button.dataset.closeModal).hidden=true));
    $$('.fz-modal').forEach(modal=>modal.addEventListener('click',event=>{if(event.target===modal&&modal.id!=='pack-modal')modal.hidden=true;}));
    $('#sound-toggle').addEventListener('click',event=>{state.sound=!state.sound;event.currentTarget.classList.toggle('on',state.sound);saveState();if(state.sound)tone(500);});
    $('#vibration-toggle').addEventListener('click',event=>{state.vibration=!state.vibration;event.currentTarget.classList.toggle('on',state.vibration);saveState();if(state.vibration)vibrate(25);});
    $('#reset-progress').addEventListener('click',()=>{if(!confirm('Reset the entire Kickoff Zero career on this device?'))return;state=clone(defaults);ensureSquad();saveState();$('#settings-modal').hidden=true;renderAll();showToast('Career reset. A fresh squad is ready.');});
    $('#claim-daily').addEventListener('click',claimDaily);
    $('#formation-select').addEventListener('change',event=>{state.formation=event.target.value;autoBuildSquad();selectedSlot=null;saveState();renderAll();showToast(`${state.formation} formation selected.`);});
    $('#squad-pitch').addEventListener('click',event=>{const button=event.target.closest('[data-slot]');if(!button)return;selectedSlot=button.dataset.slot;$('#squad-hint').textContent=`CHOOSE A PLAYER FOR ${selectedSlot}`;renderSquad();});
    $('#squad-player-list').addEventListener('click',event=>{const button=event.target.closest('[data-squad-player]');if(button)assignPlayer(button.dataset.squadPlayer);});
    $('#auto-squad').addEventListener('click',()=>{autoBuildSquad();saveState();renderAll();showToast('Squad rebuilt for position fit.');});
    $('#best-squad').addEventListener('click',()=>{autoBuildSquad();saveState();renderAll();showToast('Highest-rated compatible eleven selected.');});
    $('#clear-selection').addEventListener('click',()=>{selectedSlot=null;$('#squad-hint').textContent='TAP A POSITION TO EDIT';renderSquad();});
    $('#roster-search').addEventListener('input',renderSquadPlayerList);$('#roster-sort').addEventListener('change',renderSquadPlayerList);
    $$('.pack-open').forEach(button=>button.addEventListener('click',()=>openPack(button.dataset.pack)));
    $('#reveal-next').addEventListener('click',nextReveal);$('#reveal-skip').addEventListener('click',closePackReveal);
    $$('.fz-mode-btn').forEach(button=>button.addEventListener('click',()=>{selectedMode=button.dataset.mode;pickOpponent();renderMode();}));
    $('#start-match').addEventListener('click',()=>launchMatch(selectedMode));
    $('#collection-filters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;collectionFilter=button.dataset.filter;renderCollection();});
    $('#collection-sort').addEventListener('click',()=>{collectionSortAsc=!collectionSortAsc;renderCollection();});
    $('#collection-grid').addEventListener('click',event=>{const card=event.target.closest('[data-player-card]');if(card)openUpgrade(card.dataset.playerCard);});
    $('#upgrade-content').addEventListener('click',event=>{if(event.target.closest('#confirm-upgrade'))upgradePlayer();});
    $('#match-begin').addEventListener('click',beginGame);$('#match-return').addEventListener('click',closeMatch);$('#match-exit').addEventListener('click',closeMatch);

    const keyMap={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ShiftLeft:'sprint',ShiftRight:'sprint'};
    window.addEventListener('keydown',event=>{
      if($('#match-screen').hidden)return;
      if(keyMap[event.code]){input[keyMap[event.code]]=true;event.preventDefault();}
      if(!event.repeat&&['KeyX','KeyK','Space'].includes(event.code)){actionShoot();event.preventDefault();}
      if(!event.repeat&&['KeyZ','KeyJ'].includes(event.code)){actionPass();event.preventDefault();}
      if(!event.repeat&&event.code==='KeyC'){switchPlayer();event.preventDefault();}
    });
    window.addEventListener('keyup',event=>{if(keyMap[event.code]){input[keyMap[event.code]]=false;event.preventDefault();}});
    $$('.fz-control,.fz-action').forEach(button=>{
      const control=button.dataset.control;
      button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture?.(event.pointerId);if(['up','down','left','right','sprint'].includes(control))input[control]=true;if(control==='shoot')actionShoot();if(control==='pass')actionPass();if(control==='switch')switchPlayer();});
      const release=()=>{if(['up','down','left','right','sprint'].includes(control))input[control]=false;};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    });
    window.addEventListener('resize',()=>{if(!$('#match-screen').hidden)resizeCanvas();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&game?.active){game.active=false;$('#match-overlay').hidden=false;$('#match-overlay-title').textContent='PAUSED';$('#match-overlay-copy').textContent='The match paused while this tab was hidden.';$('#match-begin').textContent='RESUME';}});
  }

  ensureSquad();
  $('#sound-toggle').classList.toggle('on',state.sound);$('#vibration-toggle').classList.toggle('on',state.vibration);
  bindEvents();pickOpponent();renderAll();resizeCanvas();
})();
