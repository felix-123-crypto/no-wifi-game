const checks=[...document.querySelectorAll('.filters input')];
const cards=[...document.querySelectorAll('.game-card')];
const count=document.querySelector('#result-count');
const empty=document.querySelector('.empty');
function filterGames(){
  const types=checks.filter(x=>x.name==='type'&&x.checked).map(x=>x.value);
  const ages=checks.filter(x=>x.name==='age'&&x.checked).map(x=>x.value);
  const rating=Number(checks.find(x=>x.name==='rating'&&x.checked)?.value||0);
  let shown=0;
  cards.forEach(card=>{const ok=(!types.length||types.includes(card.dataset.type))&&(!ages.length||ages.some(a=>card.dataset.age.includes(a)))&&Number(card.dataset.rating)>=rating;card.hidden=!ok;if(ok)shown++});
  count.textContent=`${shown} game${shown===1?'':'s'} ready`;empty.hidden=shown!==0;
}
checks.forEach(x=>x.addEventListener('change',filterGames));
document.querySelector('#clear-filters').addEventListener('click',()=>{checks.forEach(x=>{x.checked=x.name==='rating'&&x.value==='0'});filterGames()});
const status=document.querySelector('#network-status');
function showNetwork(){status.innerHTML=`<i></i> ${navigator.onLine?'ONLINE · OFFLINE READY':'OFFLINE · READY TO PLAY'}`;status.classList.toggle('is-offline',!navigator.onLine)}
addEventListener('online',showNetwork);addEventListener('offline',showNetwork);showNetwork();
