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
    {id:'sana-ito',name:'Sana Ito',nation:'Japan',pos:'GK',group:'GK',rating:61,pace:43,shot:22,pass:55,def:66,color:'#e5ae87'},
    {id:'felix-ronaldo',name:'Cristiano Ronaldo',nation:'Portugal',pos:'ST',group:'ATT',rating:99,pace:97,shot:99,pass:93,def:45,color:'#c88965'},
    {id:'felix-messi',name:'Lionel Messi',nation:'Argentina',pos:'RW',group:'ATT',rating:98,pace:96,shot:98,pass:99,def:42,color:'#d5a17d'},
    {id:'felix-mbappe',name:'Kylian Mbappe',nation:'France',pos:'LW',group:'ATT',rating:98,pace:99,shot:97,pass:93,def:44,color:'#7b4b34'},
    {id:'felix-debruyne',name:'Kevin De Bruyne',nation:'Belgium',pos:'CM',group:'MID',rating:97,pace:90,shot:95,pass:99,def:80,color:'#dfa887'},
    {id:'felix-rodri',name:'Rodri',nation:'Spain',pos:'CDM',group:'MID',rating:97,pace:84,shot:88,pass:97,def:98,color:'#c78b68'},
    {id:'felix-bellingham',name:'Jude Bellingham',nation:'England',pos:'CAM',group:'MID',rating:97,pace:94,shot:94,pass:96,def:89,color:'#754631'},
    {id:'felix-hernandez',name:'Theo Hernandez',nation:'France',pos:'LB',group:'DEF',rating:96,pace:99,shot:84,pass:92,def:96,color:'#86543d'},
    {id:'felix-vandijk',name:'Virgil van Dijk',nation:'Netherlands',pos:'CB',group:'DEF',rating:97,pace:91,shot:70,pass:91,def:99,color:'#70442f'},
    {id:'felix-dias',name:'Ruben Dias',nation:'Portugal',pos:'CB',group:'DEF',rating:96,pace:87,shot:67,pass:89,def:98,color:'#b87957'},
    {id:'felix-hakimi',name:'Achraf Hakimi',nation:'Morocco',pos:'RB',group:'DEF',rating:96,pace:99,shot:84,pass:94,def:94,color:'#9e674b'},
    {id:'felix-buffon',name:'Gianluigi Buffon',nation:'Italy',pos:'GK',group:'GK',rating:97,pace:72,shot:45,pass:91,def:99,color:'#d29b76'},
    {id:'shop-speedster',name:'Kai Mensah',nation:'Ghana',pos:'RW',group:'ATT',rating:82,pace:96,shot:78,pass:76,def:35,color:'#5e3b2b'},
    {id:'shop-playmaker',name:'Lina Okoye',nation:'Nigeria',pos:'CAM',group:'MID',rating:83,pace:77,shot:75,pass:94,def:48,color:'#7a4a32'}
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
    version:1,coins:4200,energy:12,maxEnergy:15,upgradeTokens:18,tokens:18,xp:540,rankPoints:320,country:'Mali',
    wins:0,draws:0,losses:0,skillBest:0,cupWins:0,cups:0,formation:'4-3-3',squad:{},customFormation:formations['4-3-3'].map(slot=>({...slot})),
    owned:Object.fromEntries(initialIds.map(id => [id,{level:1}])),
    lastDaily:'',lastEnergyAt:Date.now(),sound:true,vibration:true,totalPacks:0,totalGoals:0,redeemedCodes:[]
  };

  let state = loadState();
  state.customFormation=Array.isArray(state.customFormation)&&state.customFormation.length===11?state.customFormation:clone(defaults.customFormation);
  formations.CUSTOM=state.customFormation;
  let selectedSlot = null;
  let customDrag=null,suppressPitchClick=false;
  let selectedMode = 'ranked';
  let collectionFilter = 'ALL';
  let collectionSortAsc = false;
  let upgradePlayerId = null;
  let packQuantity = 1;
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
      loaded.redeemedCodes=Array.isArray(raw.redeemedCodes)?raw.redeemedCodes:[];
      const legacyShards = raw.upgradeTokens == null ? Object.values(loaded.owned).reduce((sum,entry)=>sum + Math.max(0,Math.floor(Number(entry?.shards)||0)),0) : 0;
      loaded.upgradeTokens = Math.max(0,Math.floor(Number(raw.upgradeTokens ?? raw.tokens ?? defaults.upgradeTokens)||0)) + legacyShards;
      loaded.tokens = loaded.upgradeTokens;
      Object.values(loaded.owned).forEach(entry=>{if(entry && 'shards' in entry) delete entry.shards;});
      ['shop-speedster','shop-playmaker'].forEach(id=>{if(localStorage.getItem(`recess-shop-item-${id.replace('shop-','')}`)==='1')loaded.owned[id] ||= {level:1};});
      return loaded;
    }catch(error){ return clone(defaults); }
  }
  function saveState(){
    try{ state.upgradeTokens=Math.max(0,Math.floor(Number(state.upgradeTokens ?? state.tokens)||0));state.tokens=state.upgradeTokens;localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }catch(error){ /* Storage can be unavailable in private mode. */ }
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
    $('#upgrade-tokens-value').textContent=nf.format(state.upgradeTokens);
    $('#coins-value').textContent=nf.format(state.coins);$('#energy-value').textContent='∞';
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
    pitch.classList.toggle('custom-edit',state.formation==='CUSTOM');
    $('#reset-custom').hidden=state.formation!=='CUSTOM';
    $('#squad-hint').textContent=state.formation==='CUSTOM'?'DRAG PLAYERS TO BUILD YOUR FORMATION':selectedSlot?`CHOOSE A PLAYER FOR ${selectedSlot}`:'TAP A POSITION TO EDIT';
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
    return `<button class="fz-player-card ${rarity(player)}" data-player-card="${player.id}"><span class="fz-card-top"><span><b class="fz-card-rating">${ratingOf(player.id)}</b><small class="fz-card-pos">${player.pos}</small></span><small class="fz-card-level">LV ${levelOf(player.id)}</small></span><span class="fz-card-avatar" style="background:${player.color}">${initials(player.name)}</span><h3>${player.name}</h3><p>${player.nation} • SPECIAL TOKEN UPGRADES</p><span class="fz-card-stats"><span><b>${statOf(player.id,'pace')}</b>PAC</span><span><b>${statOf(player.id,'shot')}</b>SHT</span><span><b>${statOf(player.id,'pass')}</b>PAS</span></span></button>`;
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
  function renderAll(){ applyEnergyRegen();ensureSquad();renderWallet();renderHome();renderSquad();renderCollection();renderMode();renderPackBuyControls();saveState(); }

  function redeemCode(){
    const input=$('#redeem-code'),message=$('#redeem-message'),code=input.value.trim().toUpperCase(),megaRewardKey='FELIXDAGOAT_MEGA_V2';
    if(code!=='FELIXDAGOAT'){message.textContent='CODE NOT FOUND';message.style.color='#ff8b9e';tone(150,.1,'square');return;}
    if(state.redeemedCodes.includes(megaRewardKey)){message.textContent='CODE ALREADY REDEEMED';message.style.color='var(--fz-gold)';return;}
    const rewardIds=players.filter(player=>player.id.startsWith('felix-')).map(player=>player.id);
    rewardIds.forEach(id=>{state.owned[id] ||= {level:1};});
    if(!state.redeemedCodes.includes(code))state.redeemedCodes.push(code);
    state.redeemedCodes.push(megaRewardKey);
    state.coins=Number(state.coins||0)+1e37;
    state.upgradeTokens=Number(state.upgradeTokens||0)+1e22;state.tokens=state.upgradeTokens;
    autoBuildSquad();saveState();renderAll();
    input.value='';message.textContent='ELITE XI + 10,000,000,000,000,000,000,000,000,000,000,000,000 COINS + 10,000,000,000,000,000,000,000 ✦';message.style.color='var(--fz-lime)';showToast('FELIXDAGOAT granted the mega club reward!');tone(880,.25,'triangle');vibrate([30,40,70]);
  }

  function setView(name){
    $$('.fz-view').forEach(view=>view.classList.toggle('active',view.id===`view-${name}`));
    $$('.fz-nav-btn').forEach(button=>button.classList.toggle('active',button.dataset.view===name));
    window.scrollTo({top:0,behavior:'smooth'});
    if(name==='club') renderCollection();
    if(name==='squad') renderSquad();
  }

  const countryTeams={
    Mali:{short:'MALI',primary:'#23a36c',accent:'#ffd35b'},Brazil:{short:'BRAZIL',primary:'#f4c542',accent:'#1b9b63'},Japan:{short:'JAPAN',primary:'#f04d5e',accent:'#ffffff'},Mexico:{short:'MEXICO',primary:'#159447',accent:'#f4d35e'},USA:{short:'USA',primary:'#3b82f6',accent:'#ef4444'},Canada:{short:'CANADA',primary:'#ef4444',accent:'#ffffff'},Nigeria:{short:'NIGERIA',primary:'#21a366',accent:'#ffffff'},Senegal:{short:'SENEGAL',primary:'#20a464',accent:'#f7d154'},Italy:{short:'ITALY',primary:'#2c79c7',accent:'#ffffff'},Uruguay:{short:'URUGUAY',primary:'#69c5e8',accent:'#ffffff'},Morocco:{short:'MOROCCO',primary:'#c4313d',accent:'#159447'},Australia:{short:'AUSTRALIA',primary:'#f0c941',accent:'#159447'},Spain:{short:'SPAIN',primary:'#e34c3c',accent:'#f6cc4c'},Ghana:{short:'GHANA',primary:'#f0c941',accent:'#159447'},Korea:{short:'KOREA',primary:'#ffffff',accent:'#e24b5b'},Germany:{short:'GERMANY',primary:'#252525',accent:'#e8c547'},England:{short:'ENGLAND',primary:'#ffffff',accent:'#4f73c9'},Colombia:{short:'COLOMBIA',primary:'#f3c33c',accent:'#2f66b3'}
  };
  const worldCupCountries=['Algeria','Argentina','Australia','Austria','Belgium','Bolivia','Brazil','Canada','Cape Verde','Chile','Colombia','Costa Rica','Croatia','Czechia','Denmark','DR Congo','Ecuador','Egypt','England','France','Germany','Ghana','Haiti','Iran','Iraq','Italy','Japan','Jordan','Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway','Panama','Paraguay','Poland','Portugal','Qatar','Saudi Arabia','Scotland','Senegal','Serbia','South Africa','South Korea','Spain','Switzerland','Tunisia','Türkiye','United States','Uruguay','Uzbekistan'];
  const palette=['#23a36c','#f04d5e','#2c79c7','#f0c941','#159447','#e34c3c','#8b5cf6','#69c5e8'];
  worldCupCountries.forEach((country,index)=>{if(!countryTeams[country])countryTeams[country]={short:country==='United States'?'USA':country.toUpperCase(),primary:palette[index%palette.length],accent:index%2?'#ffffff':'#ffd35b'};});
  const countryOptions=Object.keys(countryTeams);
  function renderCountryOptions(){const select=$('#country-select');if(!select||select.options.length===countryOptions.length)return;select.innerHTML=countryOptions.map(country=>`<option value="${country}">${country}</option>`).join('');}
  const modeDetails={
    ranked:{kicker:'DIVISION FOOTBALL',title:'RANKED<br>ROAD',copy:'Face an adaptive opponent. Wins add rank points; losses cost a few. Your best squad starts automatically.',badges:['FREE ENTRY','+45 RP WIN','90 SECOND MATCH'],energy:0,time:90},
    quick:{kicker:'ARCADE FOOTBALL',title:'QUICK<br>MATCH',copy:'A fast eleven-a-side match with instant coin rewards and no rank pressure. Great for learning the controls.',badges:['FREE ENTRY','COIN REWARDS','75 SECOND MATCH'],energy:0,time:75},
    manager:{kicker:'TOUCHLINE TACTICS',title:'MANAGER<br>MODE',copy:'Watch your selected squad and saved formation play automatically. Press B during the match to make a substitution.',badges:['AUTO PLAY','LIVE SUBSTITUTIONS','90 SECOND MATCH'],energy:0,time:90},
    skill:{kicker:'SOLO TRAINING',title:'TARGET<br>RUSH',copy:'Control one striker, dribble into range, and strike the glowing targets. Chain hits quickly to set a new club record.',badges:['ONE PLAYER','NO OPPONENTS','45 SECOND CHALLENGE'],energy:0,time:45},
    tournament:{kicker:'THREE-MATCH EVENT',title:'ZERO<br>CUP',copy:'Win three matches in a row to lift the Zero Cup. A loss resets the run, so every goal matters.',badges:['FREE ENTRY','3 WINS FOR TROPHY','75 SECOND MATCH'],energy:0,time:75}
  };
  const opponentNames=['Northstar FC','Harbor City','Solar Athletic','Metro Rovers','Atlas Union','Pinecrest XI','Rivergate Club','Orchid Town'];
  let currentOpponent={name:'Northstar FC',ovr:71};
  function pickOpponent(){
    const own=squadStats().ovr;currentOpponent={name:opponentNames[Math.floor(Math.random()*opponentNames.length)],ovr:Math.max(60,own-3+Math.floor(Math.random()*7))};
  }
  function renderMode(){
    const detail=modeDetails[selectedMode];
    renderCountryOptions();
    $$('.fz-mode-btn').forEach(button=>button.classList.toggle('active',button.dataset.mode===selectedMode));
    $('#mode-kicker').textContent=detail.kicker;$('#mode-title').innerHTML=detail.title;$('#mode-copy').textContent=detail.copy;$('#mode-badges').innerHTML=detail.badges.map(badge=>`<span>${badge}</span>`).join('');
    $('#opponent-name').textContent=selectedMode==='skill'?'TRAINING WALL':currentOpponent.name.toUpperCase();$('#opponent-ovr').textContent=selectedMode==='skill'?`BEST ${nf.format(state.skillBest)} PTS`:`OVR ${currentOpponent.ovr}`;
    $('#country-select').value=countryTeams[state.country]?state.country:'Mali';
    const button=$('#start-match');button.textContent='START MATCH →';
  }

  function packQuantityValue(){
    const input=$('#pack-quantity');
    const value=Number(input?.value || packQuantity || 1);
    packQuantity=Math.max(1,Math.min(10,Number.isFinite(value)?Math.floor(value):1));
    if(input) input.value=String(packQuantity);
    return packQuantity;
  }
  function renderPackBuyControls(){
    const quantity=packQuantityValue();
    const total=$('#pack-total-cost');
    if(total) total.textContent=`Each button buys ${quantity} pack${quantity===1?'':'s'} · costs update below`;
    $$('.pack-open').forEach(button=>{
      const pack=packTypes[button.dataset.pack];
      if(!pack)return;
      const cost=pack.cost*quantity;
      button.textContent=`OPEN ${quantity} × ${nf.format(cost)} ${pack.currency?'●':'FREE'}`;
    });
  }

  function openUpgrade(playerId){
    const player=playerMap.get(playerId);if(!player)return;upgradePlayerId=playerId;
    const level=levelOf(playerId),costCoins=250*level,costTokens=3+level*2,can=state.coins>=costCoins&&state.upgradeTokens>=costTokens&&level<10;
    const trainers=getOwnedPlayers().filter(candidate=>candidate.id!==playerId);
    const trainingOptions=trainers.map(candidate=>`<option value="${candidate.id}">${candidate.name} · ${candidate.pos} · ${ratingOf(candidate.id)} OVR · LV ${levelOf(candidate.id)}</option>`).join('');
    const trainingMarkup=trainers.length?`<div class="fz-training-box"><h4>TRAIN WITH ANOTHER PLAYER</h4><p>Consume one player card to give ${player.name} one level. The source player is removed from your collection and any squad slot is rebuilt.</p><div class="fz-training-row"><select id="training-player-select" aria-label="Choose a player to use for training">${trainingOptions}</select><button class="fz-btn blue" id="train-player" type="button" ${level>=10?'disabled':''}>USE TO TRAIN</button></div></div>`:'<div class="fz-training-box"><h4>TRAIN WITH ANOTHER PLAYER</h4><p>You need at least one other player card to train this player.</p></div>';
    $('#upgrade-content').innerHTML=`<div class="fz-upgrade-hero"><div class="fz-upgrade-avatar" style="background:linear-gradient(145deg,${player.color},#142542)">${initials(player.name)}</div><div class="fz-upgrade-name"><h3>${player.name}</h3><p>${player.pos} • ${player.nation} • LEVEL ${level}</p><strong style="font-size:35px">${ratingOf(playerId)} <small style="font-size:10px;color:var(--fz-lime)">OVR</small></strong></div></div><div class="fz-upgrade-stats"><div class="fz-upgrade-stat"><b>${statOf(playerId,'pace')} ${level<10?'→ '+Math.min(99,statOf(playerId,'pace')+1):''}</b>PACE</div><div class="fz-upgrade-stat"><b>${statOf(playerId,'shot')} ${level<10?'→ '+Math.min(99,statOf(playerId,'shot')+1):''}</b>SHOOT</div><div class="fz-upgrade-stat"><b>${statOf(playerId,'pass')} ${level<10?'→ '+Math.min(99,statOf(playerId,'pass')+1):''}</b>PASS</div></div><div class="fz-upgrade-cost"><span>UPGRADE COST<br><small>You have ${state.upgradeTokens} special upgrade tokens</small></span><strong>${nf.format(costCoins)} ● + ${costTokens} ✦</strong></div><button class="fz-btn primary" id="confirm-upgrade" style="width:100%;margin-top:12px" ${can?'':'disabled'}>${level>=10?'MAX LEVEL':can?'UPGRADE TO LEVEL '+(level+1):'MORE RESOURCES NEEDED'}</button>${trainingMarkup}`;
    $('#upgrade-modal').hidden=false;
  }
  function upgradePlayer(){
    const id=upgradePlayerId,level=levelOf(id);if(!id||level>=10)return;
    const coinCost=250*level,tokenCost=3+level*2;
    if(state.coins<coinCost||state.upgradeTokens<tokenCost){showToast('Not enough coins or special upgrade tokens.');return;}
    state.coins-=coinCost;
    state.upgradeTokens-=tokenCost;state.tokens=state.upgradeTokens;state.owned[id].level=level+1;state.xp+=35;
    saveState();renderAll();openUpgrade(id);tone(760,.16,'triangle');vibrate([25,30,25]);showToast(`${playerMap.get(id).name} reached level ${level+1}!`);
  }

  function trainPlayer(){
    const targetId=upgradePlayerId,sourceId=$('#training-player-select')?.value;
    if(!targetId||!sourceId||sourceId===targetId||!state.owned[targetId]||!state.owned[sourceId]){showToast('Choose another player to use as training material.');return;}
    const targetLevel=levelOf(targetId);
    if(targetLevel>=10){showToast('That player is already max level.');return;}
    const source=playerMap.get(sourceId),target=playerMap.get(targetId);
    if(!source||!target)return;
    const sourceRating=ratingOf(sourceId);
    delete state.owned[sourceId];
    Object.keys(state.squad).forEach(slot=>{if(state.squad[slot]===sourceId)delete state.squad[slot];});
    state.owned[targetId].level=targetLevel+1;
    state.xp+=35+Math.max(0,sourceRating-70);
    saveState();renderAll();openUpgrade(targetId);tone(690,.14,'triangle');vibrate([20,30,20]);showToast(`${source.name} trained ${target.name} to level ${targetLevel+1}.`);
  }

  const packTypes={academy:{count:1,min:60,currency:'coins',cost:600,label:'ACADEMY PACK'},scout:{count:2,min:65,currency:'coins',cost:900,label:'SCOUT PACK'},pro:{count:2,min:70,currency:'coins',cost:1400,label:'PRO PACK'},premium:{count:2,min:74,currency:'coins',cost:1800,label:'PREMIUM PACK'},elite:{count:3,min:78,currency:'coins',cost:2400,label:'ELITE PACK'},legend:{count:4,min:84,currency:'coins',cost:4200,label:'LEGEND PACK'},daily:{count:1,min:60,currency:null,cost:0,label:'DAILY CLUB DROP'}};
  function weightedPlayer(minRating,index,pack){
    let pool=players.filter(player=>player.rating>=minRating);
    if(pack==='elite'&&index>0) pool=players.filter(player=>player.rating>=70);
    const weighted=[];
    pool.forEach(player=>{ const weight=Math.max(1,10-Math.floor((player.rating-minRating)/2));for(let i=0;i<weight;i++)weighted.push(player); });
    return weighted[Math.floor(Math.random()*weighted.length)];
  }
  function openPack(type,free=false){
    const pack=packTypes[type];if(!pack)return;
    const quantity=free?1:packQuantityValue(),totalCost=pack.cost*quantity;
    if(!free&&state[pack.currency]<totalCost){showToast(`Not enough ${pack.currency} for ${quantity} pack${quantity===1?'':'s'}.`);tone(150,.1,'square');return;}
    if(!free) state[pack.currency]-=totalCost;
    const results=[];
    for(let packIndex=0;packIndex<quantity;packIndex++){
      for(let i=0;i<pack.count;i++){
        const min=i===0?pack.min:Math.max(60,pack.min-8),player=weightedPlayer(min,i,type),duplicate=Boolean(state.owned[player.id]),tokens=duplicate?(player.rating>=84?8:player.rating>=77?5:3):0;
        if(duplicate) state.upgradeTokens+=tokens; else state.owned[player.id]={level:1};
        state.tokens=state.upgradeTokens;
        results.push({player,duplicate,tokens});
      }
    }
    state.totalPacks+=quantity;state.xp+=pack.count*quantity*15;pendingReveals=results;revealIndex=0;saveState();renderWallet();renderReveal(`${pack.label}${quantity>1?` × ${quantity}`:''}`);$('#pack-modal').hidden=false;tone(260,.12,'sawtooth');
  }
  function renderReveal(label){
    const result=pendingReveals[revealIndex];if(!result){closePackReveal();return;}
    const player=result.player,rare=rarity(player);
    $('#pack-progress').textContent=`${label||'NEW SIGNING'} • ${revealIndex+1} / ${pendingReveals.length}`;
    const wrap=$('#reveal-wrap');wrap.innerHTML=`<div class="fz-reveal-card"><div class="fz-reveal-inner ${rare}"><div class="fz-reveal-rating">${player.rating}</div><div class="fz-reveal-pos">${player.pos}</div><div class="fz-reveal-avatar" style="background:${player.color}">${initials(player.name)}</div><h3>${player.name}</h3><p>${player.nation} • ${rare.toUpperCase()}</p><div class="fz-reveal-stats"><span><b>${player.pace}</b>PAC</span><span><b>${player.shot}</b>SHT</span><span><b>${player.pass}</b>PAS</span></div></div></div>`;
    $('#duplicate-copy').textContent=result.duplicate?`DUPLICATE → +${result.tokens} SPECIAL UPGRADE TOKENS`:'NEW PLAYER ADDED TO YOUR CLUB';
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
  const matchSlots=[
    {key:'GK',role:'GK',shirt:1,x:88,y:270},
    {key:'LB',role:'LB',shirt:3,x:178,y:112},{key:'LCB',role:'CB',shirt:4,x:178,y:218},{key:'RCB',role:'CB',shirt:5,x:178,y:322},{key:'RB',role:'RB',shirt:2,x:178,y:428},
    {key:'LCM',role:'CM',shirt:8,x:360,y:142},{key:'CM',role:'CM',shirt:6,x:360,y:270},{key:'RCM',role:'CM',shirt:10,x:360,y:398},
    {key:'LW',role:'LW',shirt:11,x:610,y:145},{key:'ST',role:'ST',shirt:9,x:700,y:270},{key:'RW',role:'RW',shirt:7,x:610,y:395}
  ];
  function activeMatchSlots(){
    const slots=formations[state.formation]||formations['4-3-3'];
    return slots.map((slot,index)=>({key:slot.key,role:slot.role,shirt:slot.role==='GK'?1:index+2,x:field.left+55+(100-slot.y)/100*(field.right-field.left-110),y:field.top+25+slot.x/100*(field.bottom-field.top-50)}));
  }
  function createPlayer(x,y,team,index,role,shirt){const maxStamina=localStorage.getItem('recess-shop-item-staminaBoost')==='1'?130:100;return{x,y,vx:0,vy:0,r:17,team,index,role,shirt,stamina:maxStamina,maxStamina,cooldown:0,homeX:x,homeY:y};}
  function createMatchTeam(team){
    const palette=countryTeams[state.country]||countryTeams.Mali;
    const countryPool=players.filter(player=>player.nation===state.country);
    return activeMatchSlots().map((slot,index)=>{
      const mirrored=team==='away';
      const x=mirrored?field.left+field.right-slot.x:slot.x;
      const player=createPlayer(x,slot.y,team,index,slot.role,slot.shirt);
      const template=team==='home'?(playerMap.get(state.squad[slot.key])||countryPool[index%Math.max(1,countryPool.length)]||players[index%players.length]):players[index%players.length];
      player.playerId=team==='home'?template.id:'';
      player.rating=team==='home'?ratingOf(template.id):currentOpponent.ovr;
      player.name=team==='home'?template.name:'Rival player';
      player.nation=team==='home'?template.nation:'Rival';
      player.jerseyColor=team==='home'?palette.primary:'#ff5873';player.accentColor=team==='home'?palette.accent:'#ffe2e8';
      return player;
    });
  }
  function createSkillPlayer(){
    const palette=countryTeams[state.country]||countryTeams.Mali;
    const template=players.find(player=>player.nation===state.country&&['ST','RW','LW'].includes(player.pos))||players.find(player=>player.nation===state.country)||players[0];
    const player=createPlayer(175,270,'home',0,'ST',9);
    player.playerId=`country-${state.country}-skill`;player.name=template.name;player.nation=state.country;player.jerseyColor=palette.primary;player.accentColor=palette.accent;
    return player;
  }
  function setupGame(mode){
    const duration=modeDetails[mode].time;
    game={mode,active:false,finished:false,arcadePointsAwarded:false,time:duration,homeScore:0,awayScore:0,skillScore:0,combo:0,controlled:0,messageTime:0,resetTime:0,opponentKick:0,stealCooldown:0,fouls:0,
      home:mode==='skill'?[createSkillPlayer()]:createMatchTeam('home'),
      away:mode==='skill'?[]:createMatchTeam('away'),
      ball:{x:480,y:270,vx:0,vy:0,r:10,owner:null},lastTouch:'home',restartSpot:null,restartTeam:null,restartType:null,pendingRestart:null,target:{x:875,y:150+Math.random()*240,r:29,phase:0},shots:0,passes:0,shotCharge:0,charging:false
    };
    game.spawnPositions={home:game.home.map(player=>({x:player.homeX,y:player.homeY})),away:game.away.map(player=>({x:player.homeX,y:player.homeY}))};
    const reserveRoles=['GK','CB','LB','CM','ST'];
    game.bench=mode==='skill'?[]:reserveRoles.map((role,index)=>({playerId:`country-${state.country}-reserve-${index}`,name:`${(countryTeams[state.country]||countryTeams.Mali).short} RESERVE ${index+1}`,role,shirt:12+index,stamina:100}));
    updateScoreUI();drawGame();
  }
  function updateScoreUI(){
    if(!game)return;$('#score-home').textContent=game.mode==='skill'?nf.format(game.skillScore):game.homeScore;$('#score-away').textContent=game.mode==='skill'?'PTS':game.awayScore;
    const time=Math.max(0,Math.ceil(game.time)),minutes=Math.floor(time/60),seconds=String(time%60).padStart(2,'0');$('#match-clock').textContent=`${String(minutes).padStart(2,'0')}:${seconds}`;
  }
  function launchMatch(mode){
    applyEnergyRegen();const detail=modeDetails[mode];
    saveState();renderWallet();selectedMode=mode;pickOpponent();
    $('#match-screen').hidden=false;document.body.style.overflow='hidden';$('#home-name').textContent=(countryTeams[state.country]||countryTeams.Mali).short;$('#away-name').textContent=mode==='skill'?'TARGETS':currentOpponent.name.split(' ')[0].toUpperCase();
    $('#match-overlay').hidden=false;$('#match-overlay-icon').textContent=mode==='skill'?'🎯':mode==='manager'?'📋':'⚽';$('#match-overlay-title').textContent=mode==='skill'?'TARGET RUSH':mode==='manager'?'MANAGER MODE':'READY?';$('#match-overlay-copy').textContent=mode==='skill'?'One player only. Move into range and shoot at the glowing target. Score quickly to build a combo.':mode==='manager'?'Your chosen starting XI follows your saved formation and plays automatically. Watch from the touchline and press B to substitute the highlighted player.':'Real rules are active: throw-ins, corners, goal kicks, kickoffs, fouls, offside, and own goals. Move with WASD or arrows; Z passes, X shoots, V steals, C switches, and Shift sprints.';$('#result-stats').innerHTML='';$('#match-begin').textContent=mode==='skill'?'START SOLO CHALLENGE':mode==='manager'?'START MANAGING':'KICK OFF';$('#match-begin').dataset.result='';
    setupGame(mode);resizeCanvas();document.documentElement.requestFullscreen?.().catch(()=>{});lastFrame=performance.now();fpsFrames=0;fpsTime=lastFrame;cancelAnimationFrame(rafId);rafId=requestAnimationFrame(gameLoop);
  }
  function beginGame(){
    if(!game)return;
    if(game.finished){ closeMatch();launchMatch(selectedMode);return; }
    $('#match-overlay').hidden=true;game.active=true;lastFrame=performance.now();if(game.mode==='skill'){showMatchMessage('GO!');}else{kickoff();}
  }
  function closeMatch(){
    if(game)game.active=false;cancelAnimationFrame(rafId);rafId=0;$('#match-screen').hidden=true;document.body.style.overflow='';if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});Object.keys(input).forEach(key=>input[key]=false);renderAll();
  }
  function showMatchMessage(text){ const node=$('#match-message');node.textContent='';void node.offsetWidth;node.textContent=text; }
  function nearestPlayer(team,x,y){ let best=null,bestDistance=Infinity;team.forEach(player=>{const distance=(player.x-x)**2+(player.y-y)**2;if(distance<bestDistance){best=player;bestDistance=distance;}});return best; }
  function clampPlayer(player){player.x=Math.max(field.left+player.r,Math.min(field.right-player.r,player.x));player.y=Math.max(field.top+player.r,Math.min(field.bottom-player.r,player.y));}
  function updateControlled(dt){
    const player=game.home[game.controlled];let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0),length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;
    const sprinting=input.sprint&&player.stamina>3;
    const speed=sprinting?245:185,accel=12;player.vx+=(dx*speed-player.vx)*Math.min(1,dt*accel);player.vy+=(dy*speed-player.vy)*Math.min(1,dt*accel);player.x+=player.vx*dt;player.y+=player.vy*dt;clampPlayer(player);player.stamina=Math.max(0,Math.min(player.maxStamina,player.stamina+(sprinting?-30:17)*dt));
    if(!game.ball.owner&&game.stealCooldown<=0&&Math.hypot(player.x-game.ball.x,player.y-game.ball.y)<34&&Math.hypot(game.ball.vx,game.ball.vy)<190){game.ball.owner={team:'home',index:player.index};game.lastTouch='home';}
    game.home.forEach((mate,index)=>{
      if(index===game.controlled)return;
      const closest=nearestPlayer(game.home,game.ball.x,game.ball.y)===mate;
      // One player presses the ball; everyone else holds a role-shaped home
      // zone and only shifts a little toward play so the formation stays legible.
      const attacking=game.ball.owner?.team==='home'||game.lastTouch==='home';
      const shiftX=(game.ball.x-mate.homeX)*.16+(attacking?18:-10);
      const shiftY=(game.ball.y-mate.homeY)*.12;
      const tx=closest?game.ball.x-18:Math.max(field.left+mate.r,Math.min(field.right-mate.r,mate.homeX+shiftX));
      const ty=closest?game.ball.y:Math.max(field.top+mate.r,Math.min(field.bottom-mate.r,mate.homeY+shiftY));
      moveAI(mate,tx,ty,dt,closest?148:132);
    });
  }
  function moveAI(player,tx,ty,dt,speed){
    const dx=tx-player.x,dy=ty-player.y,d=Math.hypot(dx,dy)||1;player.vx+=(dx/d*speed-player.vx)*Math.min(1,dt*6);player.vy+=(dy/d*speed-player.vy)*Math.min(1,dt*6);if(d<12){player.vx*=.7;player.vy*=.7;}player.x+=player.vx*dt;player.y+=player.vy*dt;clampPlayer(player);
    player.stamina=Math.max(0,Math.min(player.maxStamina,player.stamina+(speed>180?-16:10)*dt));
  }
  function updateOpponents(dt){
    game.stealCooldown=Math.max(0,game.stealCooldown-dt);
    const chaser=nearestPlayer(game.away,game.ball.x,game.ball.y);
    game.away.forEach((player,index)=>{
      const tx=player===chaser?game.ball.x:player.homeX+(game.ball.x-player.homeX)*.16,ty=player===chaser?game.ball.y:player.homeY+(game.ball.y-player.homeY)*.12;
      moveAI(player,tx,ty,dt,142+(currentOpponent.ovr-70)*1.5);player.cooldown=Math.max(0,player.cooldown-dt);
      if(player===chaser&&game.ball.owner?.team==='home'&&Math.hypot(player.x-game.ball.x,player.y-game.ball.y)<28&&player.cooldown<=0){
        game.ball.owner=null;game.lastTouch='away';game.stealCooldown=.55;game.ball.vx=-120;game.ball.vy=(Math.random()-.5)*160;player.cooldown=.8;showMatchMessage('TACKLED!');tone(170,.04,'square');
      }else if(player===chaser&&Math.hypot(player.x-game.ball.x,player.y-game.ball.y)<30&&player.cooldown<=0){
        const targetX=field.left+92,targetY=Math.max(field.goalTop+32,Math.min(field.goalBottom-32,270+(Math.random()-.5)*70));
        const angle=Math.atan2(targetY-player.y,targetX-player.x)+(Math.random()-.5)*.12;game.ball.owner=null;game.ball.vx=Math.cos(angle)*390;game.ball.vy=Math.sin(angle)*390;game.lastTouch='away';player.cooldown=.8;game.opponentKick++;tone(170,.04,'square');
      }
    });
  }
  function updateManagerHome(dt){
    game.stealCooldown=Math.max(0,game.stealCooldown-dt);
    const ball=game.ball,owner=ball.owner?.team==='home'?game.home[ball.owner.index]:null,chaser=nearestPlayer(game.home,ball.x,ball.y);
    game.home.forEach(player=>{
      player.cooldown=Math.max(0,player.cooldown-dt);
      if(player===owner){
        const targetY=Math.max(field.goalTop+25,Math.min(field.goalBottom-25,270+(Math.random()-.5)*18));
        moveAI(player,field.right-55,targetY,dt,168+(player.rating-70)*1.15);
        if((player.x>690||player.cooldown<=0)&&Math.hypot(player.x-ball.x,player.y-ball.y)<48){
          const dx=field.right+35-ball.x,dy=targetY-ball.y,d=Math.hypot(dx,dy)||1,power=420+(player.rating-70)*5;
          ball.owner=null;ball.vx=dx/d*power;ball.vy=dy/d*power;game.lastTouch='home';game.shots++;player.cooldown=1.15;showMatchMessage('TACTICAL SHOT');
        }
      }else{
        const closest=player===chaser,attacking=ball.owner?.team==='home'||game.lastTouch==='home',shiftX=(ball.x-player.homeX)*.18+(attacking?25:-8),shiftY=(ball.y-player.homeY)*.13;
        moveAI(player,closest?ball.x:player.homeX+shiftX,closest?ball.y:player.homeY+shiftY,dt,closest?158:138);
        if(closest&&!ball.owner&&Math.hypot(player.x-ball.x,player.y-ball.y)<32&&Math.hypot(ball.vx,ball.vy)<210){ball.owner={team:'home',index:player.index};game.lastTouch='home';player.cooldown=.7;showMatchMessage('POSSESSION');}
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
    game.ball.x=480;game.ball.y=270;game.ball.vx=direction*50;game.ball.vy=0;game.ball.owner=null;game.lastTouch=direction<0?'away':'home';
    game.home.forEach((player,i)=>{const p=game.spawnPositions.home[i];Object.assign(player,{x:p.x,y:p.y,vx:0,vy:0});});
    game.away.forEach((player,i)=>{const p=game.spawnPositions.away[i];Object.assign(player,{x:p.x,y:p.y,vx:0,vy:0});});
    game.resetTime=.7;
  }
  function prepareRestart(type,team,x,y){
    resetPositions(0);
    const ball=game.ball,direction=team==='home'?1:-1;
    ball.x=Math.max(field.left+ball.r,Math.min(field.right-ball.r,x));ball.y=Math.max(field.top+ball.r,Math.min(field.bottom-ball.r,y));ball.vx=0;ball.vy=0;ball.owner=null;
    game.lastTouch=team;game.restartSpot={x:ball.x,y:ball.y};game.restartTeam=team;game.restartType=type;game.pendingRestart={type,team,direction};game.resetTime=1;
    showMatchMessage(type);tone(260,.06,'square');
  }
  function releaseRestart(){
    const restart=game.pendingRestart;if(!restart)return;
    const ball=game.ball,taker=nearestPlayer(game[restart.team],ball.x,ball.y);game.pendingRestart=null;
    if(!taker)return;
    taker.x=Math.max(field.left+22,Math.min(field.right-22,ball.x-restart.direction*28));taker.y=Math.max(field.top+22,Math.min(field.bottom-22,ball.y));
    if(restart.team==='home'){game.controlled=taker.index;ball.owner={team:'home',index:taker.index};ball.vx=ball.vy=0;}else{ball.owner=null;ball.vx=restart.direction*330;ball.vy=(270-ball.y)*.8;}
    game.lastTouch=restart.team;
  }
  function kickoff(label='KICK OFF',team='home'){prepareRestart(label,team,480,270);tone(520,.08,'square');}
  function restartFromOut(x,y){
    const lastTouch=game.lastTouch;
    if(y<field.top||y>field.bottom){prepareRestart('THROW-IN',lastTouch==='home'?'away':'home',x,y<field.top?field.top+12:field.bottom-12);return;}
    if(x>field.right){
      if(lastTouch==='home')prepareRestart('GOAL KICK','away',field.right-85,270);
      else prepareRestart('CORNER KICK','home',field.right-12,y<270?field.top+12:field.bottom-12);
      return;
    }
    if(lastTouch==='away')prepareRestart('GOAL KICK','home',field.left+85,270);
    else prepareRestart('CORNER KICK','away',field.left+12,y<270?field.top+12:field.bottom-12);
  }
  function scoreGoal(team){
    if(team==='home'){game.homeScore++;state.totalGoals++;showMatchMessage('GOAL!');tone(780,.24,'sawtooth');vibrate([30,30,70]);}else{game.awayScore++;showMatchMessage('THEY SCORE');tone(145,.24,'square');}
    updateScoreUI();kickoff('KICK OFF',team==='home'?'away':'home');
  }
  function updateBall(dt){
    const ball=game.ball,owner=ball.owner?game[ball.owner.team]?.[ball.owner.index]:null;
    if(owner){
      const facing=owner.vx>=0?1:-1;
      ball.x=owner.x+facing*(owner.r+7);ball.y=owner.y+owner.vy*.018;ball.vx=owner.vx;ball.vy=owner.vy;
    }else{
      ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;const friction=Math.pow(.42,dt);ball.vx*=friction;ball.vy*=friction;
    }
    if(game.mode==='skill'){
      game.target.phase+=dt*2.5;game.target.y+=Math.sin(game.target.phase)*18*dt;
      if(Math.hypot(ball.x-game.target.x,ball.y-game.target.y)<ball.r+game.target.r){
        game.combo++;const points=150+Math.min(350,game.combo*25);game.skillScore+=points;showMatchMessage(`+${points}`);tone(620+Math.min(250,game.combo*35),.11,'triangle');vibrate(25);game.target.y=100+Math.random()*340;game.target.phase=Math.random()*6;ball.owner=null;ball.x=game.home[game.controlled].x+25;ball.y=game.home[game.controlled].y;ball.vx=ball.vy=0;updateScoreUI();
      }
      if(ball.x>field.right+30||ball.x<field.left-30||ball.y<field.top-30||ball.y>field.bottom+30){game.combo=0;ball.x=game.home[game.controlled].x+25;ball.y=game.home[game.controlled].y;ball.vx=ball.vy=0;}
    }else{
      const inGoal=ball.y>field.goalTop&&ball.y<field.goalBottom;
      if(ball.x>field.right+14&&inGoal){scoreGoal('home');return;}
      if(ball.x<field.left-14&&inGoal){scoreGoal('away');return;}
      if(ball.y<field.top-ball.r||ball.y>field.bottom+ball.r||(!inGoal&&(ball.x<field.left-ball.r||ball.x>field.right+ball.r))){restartFromOut(ball.x,ball.y);return;}
    }
  }
  function updateGame(dt){
    if(!game?.active)return;
    game.time-=dt;if(game.time<=0){game.time=0;updateScoreUI();finishGame();return;}
    if(game.resetTime>0){game.resetTime-=dt;if(game.resetTime<=0)releaseRestart();return;}
    game.restartSpot=null;game.restartTeam=null;game.restartType=null;
    if(game.charging)game.shotCharge=Math.min(1,game.shotCharge+dt*.9);
    if(game.mode==='manager')updateManagerHome(dt);else updateControlled(dt);if(game.mode!=='skill')updateOpponents(dt);collidePlayersWithBall(game.home);collidePlayersWithBall(game.away);updateBall(dt);updateScoreUI();
  }
  function actionShoot(){
    if(!game?.active||game.resetTime>0||game.mode==='manager')return;
    if(!game.charging){game.charging=true;game.shotCharge=0;return;}
    const player=game.home[game.controlled],ball=game.ball;if(Math.hypot(player.x-ball.x,player.y-ball.y)>48){game.charging=false;showMatchMessage('GET CLOSER');return;}
    let targetY=game.mode==='skill'?game.target.y:270+(input.down?85:0)-(input.up?85:0),targetX=field.right+35,dx=targetX-ball.x,dy=targetY-ball.y,d=Math.hypot(dx,dy)||1,power=320+game.shotCharge*520;ball.owner=null;ball.vx=dx/d*power;ball.vy=dy/d*power;game.lastTouch='home';game.shots++;game.charging=false;game.shotCharge=0;showMatchMessage(power>650?'POWER SHOT':'SHOT');tone(280,.07,'square');vibrate(18);
  }
  function actionGoalkeeperKick(){
    if(!game?.active||game.resetTime>0||game.mode==='manager')return;
    const player=game.home[game.controlled],ball=game.ball;
    if(player.role!=='GK'){showMatchMessage('SELECT THE GK');return;}
    if(Math.hypot(player.x-ball.x,player.y-ball.y)>82){showMatchMessage('GK GETS SET');return;}
    ball.owner=null;ball.x=player.x+24;ball.y=player.y;ball.vx=520;ball.vy=(270-ball.y)*1.4;game.lastTouch='home';game.shots++;showMatchMessage('GOALKEEPER KICK');tone(300,.1,'square');vibrate(20);
  }
  function actionPass(){
    if(!game?.active||game.mode==='manager')return;if(game.mode==='skill'){showMatchMessage('SOLO MODE');return;}const player=game.home[game.controlled],ball=game.ball;if(Math.hypot(player.x-ball.x,player.y-ball.y)>50)return;
    let candidates=game.home.filter((_,index)=>index!==game.controlled);candidates.sort((a,b)=>b.x-a.x||Math.abs(a.y-ball.y)-Math.abs(b.y-ball.y));const target=candidates[0];if(!target)return;
    const defenders=game.away.map(defender=>defender.x).sort((a,b)=>b-a),offsideLine=defenders[1]??field.right;
    if(target.x>480&&target.x>ball.x+12&&target.x>offsideLine+4){prepareRestart('OFFSIDE · FREE KICK','away',target.x,target.y);return;}
    const dx=target.x-ball.x,dy=target.y-ball.y,d=Math.hypot(dx,dy)||1;ball.owner=null;ball.vx=dx/d*410;ball.vy=dy/d*410;game.lastTouch='home';game.controlled=target.index;game.passes++;tone(390,.05,'triangle');
  }
  function switchPlayer(){
    if(!game?.active||game.mode==='manager')return;
    const current=game.home[game.controlled];
    const candidates=game.home.filter(player=>player!==current).sort((a,b)=>Math.hypot(a.x-game.ball.x,a.y-game.ball.y)-Math.hypot(b.x-game.ball.x,b.y-game.ball.y));
    if(!candidates.length)return;
    const wasOwner=game.ball.owner?.team==='home'&&game.ball.owner.index===current.index;
    game.controlled=candidates[0].index;
    if(wasOwner)game.ball.owner={team:'home',index:game.controlled};
    showMatchMessage(`PLAYER ${game.controlled+1}`);
    tone(470,.05,'triangle');
  }
  function actionSteal(){
    if(!game?.active||game.stealCooldown>0||game.mode==='manager')return;
    const player=game.home[game.controlled],opponent=nearestPlayer(game.away,game.ball.x,game.ball.y);
    const nearBall=Math.hypot(player.x-game.ball.x,player.y-game.ball.y)<62;
    const nearOpponent=opponent&&Math.hypot(player.x-opponent.x,player.y-opponent.y)<70;
    if(!nearBall&&!nearOpponent){showMatchMessage('GET CLOSER');return;}
    if(nearOpponent&&(!nearBall||Math.random()<.14)){game.fouls++;game.stealCooldown=.8;prepareRestart('FOUL · FREE KICK','away',player.x,player.y);tone(150,.12,'square');return;}
    game.ball.owner={team:'home',index:player.index};game.lastTouch='home';game.stealCooldown=.35;game.ball.vx=player.vx;game.ball.vy=player.vy;showMatchMessage('STEAL!');tone(610,.06,'triangle');vibrate(20);
  }
  function substitutePlayer(){
    if(!game?.active||!game.bench?.length)return;
    const current=game.home[game.controlled],reserve=game.bench.shift();
    game.bench.push({playerId:current.playerId,name:current.name,role:current.role,shirt:current.shirt,stamina:current.stamina});
    const replacement=createPlayer(current.x,current.y,'home',current.index,reserve.role,reserve.shirt);
    replacement.playerId=reserve.playerId;replacement.name=reserve.name;replacement.stamina=reserve.stamina;replacement.homeX=current.homeX;replacement.homeY=current.homeY;
    game.home[current.index]=replacement;
    if(game.ball.owner?.team==='home'&&game.ball.owner.index===current.index)game.ball.owner={team:'home',index:replacement.index};
    showMatchMessage(`${replacement.role} ${replacement.shirt} ON`);tone(520,.08,'triangle');
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
    ctx.save();
    const depth=.86+Math.max(0,Math.min(1,(player.y-field.top)/(field.bottom-field.top)))*.22;
    ctx.translate(player.x,player.y);ctx.scale(depth,depth);
    ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(4,15,21,8,0,0,Math.PI*2);ctx.fill();
    if(controlled){ctx.strokeStyle=varColor('--fz-lime','#b6f13b');ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,26,0,Math.PI*2);ctx.stroke();ctx.fillStyle=varColor('--fz-lime','#b6f13b');ctx.beginPath();ctx.moveTo(-6,-34);ctx.lineTo(6,-34);ctx.lineTo(0,-25);ctx.fill();}
    const color=player.jerseyColor||(player.team==='home'?'#38e1cf':'#ff5873');
    const accent=player.accentColor||(player.team==='home'?'#d8fff9':'#ffe2e8');
    // Legs, boots, arms, and a shaded torso make each marker read as a small
    // 3D character instead of a flat circle.
    ctx.strokeStyle='#071126';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-6,16);ctx.lineTo(-8,27);ctx.moveTo(6,16);ctx.lineTo(8,27);ctx.stroke();
    ctx.strokeStyle=accent;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-12,-1);ctx.lineTo(-20,10);ctx.moveTo(12,-1);ctx.lineTo(20,10);ctx.stroke();
    if(player.role==='GK'){ctx.fillStyle='#f7d35c';ctx.beginPath();ctx.arc(-22,10,6,0,Math.PI*2);ctx.arc(22,10,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff3a3';ctx.lineWidth=2;ctx.stroke();}
    const body=ctx.createLinearGradient(-14,-12,16,18);body.addColorStop(0,'#ffffff');body.addColorStop(.13,accent);body.addColorStop(.22,color);body.addColorStop(.7,color);body.addColorStop(1,'#071126');
    ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(0,4,15,18,0,0,Math.PI*2);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=accent;ctx.stroke();
    const head=ctx.createRadialGradient(-4,-18,1,2,-14,10);head.addColorStop(0,'#ffe0bf');head.addColorStop(.65,'#c98360');head.addColorStop(1,'#4e2d2a');ctx.fillStyle=head;ctx.beginPath();ctx.arc(0,-17,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.ellipse(-4,-20,3,2,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#071126';ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(player.shirt,0,5);ctx.font='bold 8px Arial';ctx.fillStyle='white';ctx.fillText(player.role,0,-32);
    if(controlled||player.stamina<player.maxStamina*.88){ctx.fillStyle='rgba(5,12,26,.72)';ctx.fillRect(-18,24,36,4);ctx.fillStyle=player.stamina<player.maxStamina*.25?'#ff5873':'#b6f13b';ctx.fillRect(-18,24,36*Math.min(1,player.stamina/player.maxStamina),4);}
    ctx.restore();
  }
  function varColor(name,fallback){return getComputedStyle(document.documentElement).getPropertyValue(name).trim()||fallback;}
  function drawBall(){const ball=game.ball;ctx.save();ctx.translate(ball.x,ball.y);ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(3,8,12,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='white';ctx.strokeStyle='#071126';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,ball.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#071126';ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawTarget(){
    const target=game.target,pulse=1+Math.sin(target.phase*3)*.08;ctx.save();ctx.translate(target.x,target.y);ctx.scale(pulse,pulse);ctx.shadowColor='#b6f13b';ctx.shadowBlur=24;ctx.fillStyle='rgba(182,241,59,.19)';ctx.strokeStyle='#b6f13b';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,target.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.font='bold 13px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('+'+(150+Math.min(350,(game.combo+1)*25)),0,0);ctx.restore();
  }
  function drawBench(){
    if(!game.bench?.length)return;
    ctx.fillStyle='rgba(5,12,26,.74)';ctx.fillRect(610,507,335,25);ctx.fillStyle='#b6f13b';ctx.font='bold 8px Arial';ctx.textAlign='left';ctx.fillText('BENCH  '+game.bench.map(player=>`${player.role} #${player.shirt}`).join('  ·  '),620,523);
  }
  function drawGame(){
    if(!game)return;
    const focus=game.home[game.controlled]||game.home[0];
    ctx.save();ctx.translate(W/2-focus.x,H/2-focus.y);
    drawPitch();if(game.mode==='skill')drawTarget();game.home.forEach((player,index)=>drawPlayer(player,index===game.controlled));game.away.forEach(player=>drawPlayer(player));drawBall();
    if(game.restartSpot){ctx.save();ctx.translate(game.restartSpot.x,game.restartSpot.y);ctx.strokeStyle='#ffe15b';ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ffe15b';ctx.font='bold 9px Arial';ctx.textAlign='center';ctx.fillText(`${String(game.restartTeam||'').toUpperCase()} ${game.restartType||'RESTART'}`,0,-27);ctx.restore();}
    ctx.restore();drawBench();
    if(game.mode==='skill'){roundedRect(65,58,170,42,11,'rgba(5,12,26,.72)');ctx.fillStyle='#b6f13b';ctx.font='bold 12px Arial';ctx.textAlign='left';ctx.fillText(`COMBO x${game.combo}`,82,84);}
    if(game.charging){roundedRect(W/2-130,H-45,260,18,8,'rgba(5,12,26,.82)');ctx.fillStyle='#b6f13b';ctx.fillRect(W/2-124,H-39,248*game.shotCharge,6);ctx.fillStyle='white';ctx.font='bold 9px Arial';ctx.textAlign='center';ctx.fillText('HOLD X TO AIM + POWER · RELEASE TO KICK',W/2,H-24);}
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
    $('#country-select').addEventListener('change',event=>{state.country=countryTeams[event.target.value]?event.target.value:'Mali';saveState();renderMode();showToast(`${countryTeams[state.country].short} XI selected.`);});
    $$('[data-close-modal]').forEach(button=>button.addEventListener('click',()=>$('#'+button.dataset.closeModal).hidden=true));
    $$('.fz-modal').forEach(modal=>modal.addEventListener('click',event=>{if(event.target===modal&&modal.id!=='pack-modal')modal.hidden=true;}));
    $('#sound-toggle').addEventListener('click',event=>{state.sound=!state.sound;event.currentTarget.classList.toggle('on',state.sound);saveState();if(state.sound)tone(500);});
    $('#vibration-toggle').addEventListener('click',event=>{state.vibration=!state.vibration;event.currentTarget.classList.toggle('on',state.vibration);saveState();if(state.vibration)vibrate(25);});
    $('#reset-progress').addEventListener('click',()=>{if(!confirm('Reset the entire Kickoff Zero career on this device?'))return;state=clone(defaults);ensureSquad();saveState();$('#settings-modal').hidden=true;renderAll();showToast('Career reset. A fresh squad is ready.');});
    $('#redeem-submit').addEventListener('click',redeemCode);$('#redeem-code').addEventListener('keydown',event=>{if(event.key==='Enter')redeemCode();});
    $('#claim-daily').addEventListener('click',claimDaily);
    $('#formation-select').addEventListener('change',event=>{state.formation=event.target.value;if(state.formation==='CUSTOM')formations.CUSTOM=state.customFormation;autoBuildSquad();selectedSlot=null;saveState();renderAll();showToast(state.formation==='CUSTOM'?'Custom formation ready. Drag players anywhere on the pitch.':`${state.formation} formation selected.`);});
    const squadPitch=$('#squad-pitch');
    squadPitch.addEventListener('pointerdown',event=>{if(state.formation!=='CUSTOM')return;const button=event.target.closest('[data-slot]');if(!button)return;const slot=formations.CUSTOM.find(item=>item.key===button.dataset.slot);if(!slot)return;event.preventDefault();customDrag={pointerId:event.pointerId,button,slot,startX:event.clientX,startY:event.clientY,moved:false};button.classList.add('dragging');squadPitch.setPointerCapture?.(event.pointerId);});
    squadPitch.addEventListener('pointermove',event=>{if(!customDrag||event.pointerId!==customDrag.pointerId)return;const rect=squadPitch.getBoundingClientRect(),x=Math.max(8,Math.min(92,(event.clientX-rect.left)/rect.width*100)),y=Math.max(9,Math.min(92,(event.clientY-rect.top)/rect.height*100));if(Math.hypot(event.clientX-customDrag.startX,event.clientY-customDrag.startY)>5)customDrag.moved=true;customDrag.slot.x=Math.round(x*10)/10;customDrag.slot.y=Math.round(y*10)/10;customDrag.button.style.left=`${customDrag.slot.x}%`;customDrag.button.style.top=`${customDrag.slot.y}%`;});
    const finishCustomDrag=event=>{if(!customDrag||event.pointerId!==customDrag.pointerId)return;customDrag.button.classList.remove('dragging');suppressPitchClick=customDrag.moved;if(customDrag.moved){state.customFormation=formations.CUSTOM.map(slot=>({...slot}));saveState();showToast('Custom formation saved and ready for matches.');}customDrag=null;};
    squadPitch.addEventListener('pointerup',finishCustomDrag);squadPitch.addEventListener('pointercancel',finishCustomDrag);
    squadPitch.addEventListener('click',event=>{if(suppressPitchClick){suppressPitchClick=false;return;}const button=event.target.closest('[data-slot]');if(!button)return;selectedSlot=button.dataset.slot;renderSquad();});
    $('#squad-player-list').addEventListener('click',event=>{const button=event.target.closest('[data-squad-player]');if(button)assignPlayer(button.dataset.squadPlayer);});
    $('#auto-squad').addEventListener('click',()=>{autoBuildSquad();saveState();renderAll();showToast('Squad rebuilt for position fit.');});
    $('#best-squad').addEventListener('click',()=>{autoBuildSquad();saveState();renderAll();showToast('Highest-rated compatible eleven selected.');});
    $('#clear-selection').addEventListener('click',()=>{selectedSlot=null;$('#squad-hint').textContent='TAP A POSITION TO EDIT';renderSquad();});
    $('#reset-custom').addEventListener('click',()=>{state.customFormation=clone(defaults.customFormation);formations.CUSTOM=state.customFormation;autoBuildSquad();selectedSlot=null;saveState();renderAll();showToast('Custom formation reset to a balanced shape.');});
    $('#roster-search').addEventListener('input',renderSquadPlayerList);$('#roster-sort').addEventListener('change',renderSquadPlayerList);
    $$('.pack-open').forEach(button=>button.addEventListener('click',()=>openPack(button.dataset.pack)));
    $('#pack-quantity-minus').addEventListener('click',()=>{packQuantity=Math.max(1,packQuantityValue()-1);renderPackBuyControls();});
    $('#pack-quantity-plus').addEventListener('click',()=>{packQuantity=Math.min(10,packQuantityValue()+1);renderPackBuyControls();});
    $('#pack-quantity').addEventListener('input',()=>{packQuantityValue();renderPackBuyControls();});
    $('#reveal-next').addEventListener('click',nextReveal);$('#reveal-skip').addEventListener('click',closePackReveal);
    $$('.fz-mode-btn').forEach(button=>button.addEventListener('click',()=>{selectedMode=button.dataset.mode;pickOpponent();renderMode();}));
    $('#start-match').addEventListener('click',()=>launchMatch(selectedMode));
    $('#collection-filters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;collectionFilter=button.dataset.filter;renderCollection();});
    $('#collection-sort').addEventListener('click',()=>{collectionSortAsc=!collectionSortAsc;renderCollection();});
    $('#collection-grid').addEventListener('click',event=>{const card=event.target.closest('[data-player-card]');if(card)openUpgrade(card.dataset.playerCard);});
    $('#upgrade-content').addEventListener('click',event=>{if(event.target.closest('#confirm-upgrade'))upgradePlayer();if(event.target.closest('#train-player'))trainPlayer();});
    $('#match-begin').addEventListener('click',beginGame);$('#match-return').addEventListener('click',closeMatch);$('#match-exit').addEventListener('click',closeMatch);

    const keyMap={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ShiftLeft:'sprint',ShiftRight:'sprint'};
    window.addEventListener('keydown',event=>{
      if($('#match-screen').hidden)return;
      if(keyMap[event.code]){input[keyMap[event.code]]=true;event.preventDefault();}
      if(!event.repeat&&['KeyX','KeyK','Space'].includes(event.code)){if(!game?.charging)actionShoot();event.preventDefault();}
      if(!event.repeat&&['KeyZ','KeyJ'].includes(event.code)){actionPass();event.preventDefault();}
      if(!event.repeat&&event.code==='KeyC'){switchPlayer();event.preventDefault();}
      if(!event.repeat&&event.code==='KeyV'){actionSteal();event.preventDefault();}
      if(!event.repeat&&event.code==='KeyB'){substitutePlayer();event.preventDefault();}
    });
    window.addEventListener('keyup',event=>{if(keyMap[event.code]){input[keyMap[event.code]]=false;event.preventDefault();}if(['KeyX','KeyK','Space'].includes(event.code)&&game?.charging){actionShoot();event.preventDefault();}if(event.code==='KeyG')actionGoalkeeperKick();});
    $$('.fz-control,.fz-action').forEach(button=>{
      const control=button.dataset.control;
      button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture?.(event.pointerId);if(['up','down','left','right','sprint'].includes(control))input[control]=true;if(control==='shoot')actionShoot();if(control==='pass')actionPass();if(control==='switch')switchPlayer();if(control==='steal')actionSteal();if(control==='bench')substitutePlayer();});
      const release=()=>{if(['up','down','left','right','sprint'].includes(control))input[control]=false;};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    });
    window.addEventListener('resize',()=>{if(!$('#match-screen').hidden)resizeCanvas();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&game?.active){game.active=false;$('#match-overlay').hidden=false;$('#match-overlay-title').textContent='PAUSED';$('#match-overlay-copy').textContent='The match paused while this tab was hidden.';$('#match-begin').textContent='RESUME';}});
  }

  ensureSquad();
  $('#sound-toggle').classList.toggle('on',state.sound);$('#vibration-toggle').classList.toggle('on',state.vibration);
  bindEvents();pickOpponent();renderAll();resizeCanvas();
})();
