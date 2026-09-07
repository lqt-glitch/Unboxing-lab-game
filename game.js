'use strict';

const components = [
  {id:'motherboard',name:'主機板',en:'Motherboard',hint:'最大塊的電路板，上面有很多插槽。',look:'一大塊電路板，上面有不同大小的插槽。',work:'連接各組件，讓它們互相傳送資料。',image:'assets/motherboard.jpg',alt:'一塊有多個插槽和插座的大型電路板'},
  {id:'cpu',name:'中央處理器（CPU）',en:'Central Processing Unit',hint:'小小的方形晶片，表面是銀色。',look:'小小的方形晶片，中間是銀色金屬面。',work:'執行指令，進行運算及控制電腦運作。',image:'assets/cpu.jpg',alt:'一枚銀色方形處理器晶片'},
  {id:'ram',name:'隨機存取記憶體（RAM）',en:'Random Access Memory',hint:'長條形電路板，邊緣有金色接點。',look:'長條形電路板，排列着小晶片，邊緣有金色接點。',work:'暫存正在使用的資料；關機後資料會消失。',image:'assets/ram.jpg',alt:'一條有黑色晶片和金色接點的長條電路板'},
  {id:'ssd',name:'固態硬碟（SSD）',en:'Solid State Drive',hint:'這一款像扁平的小盒，用來儲存檔案。',look:'扁平的小盒。這是 2.5 吋的款式。',work:'長期儲存檔案；關機後資料仍然保留。',image:'assets/ssd.jpg',alt:'一件扁平長方形的2.5吋儲存裝置'},
  {id:'fan',name:'散熱風扇',en:'Cooling Fan',hint:'有扇葉，轉動時帶走熱空氣。',look:'方形框架裏有可以轉動的扇葉。',work:'推動空氣流動，幫助組件散熱。',image:'assets/fan.jpg',alt:'一把方形框架內有扇葉的電腦風扇'},
  {id:'psu',name:'電源供應器',en:'Power Supply Unit · PSU',hint:'較厚的金屬盒，有電源插口及電線。',look:'較厚的金屬盒，有電源插口及接駁電線。',work:'把市電轉成組件可用的電力。',image:'assets/psu.jpg',alt:'一個有電源插口及電線的金屬電源盒'}
];

const byId = Object.fromEntries(components.map(c=>[c.id,c]));
const state = {matched:new Set(),selected:null,hints:true,order:[],drag:null,over:null,errors:0};
const inventory=document.getElementById('inventory');
const feedback=document.getElementById('feedback');
let wrongTimer, burstTimer,scrollFrame,liveTimer;

function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function announce(message,kind='neutral'){
  clearTimeout(liveTimer);
  feedback.className='feedback '+kind;
  feedback.querySelector('.feedback-icon').textContent=kind==='success'?'✓':kind==='retry'?'↻':'↗';
  const p=feedback.querySelector('p');
  if(p.textContent===message){p.textContent='';liveTimer=setTimeout(()=>{p.textContent=message;},30);}else p.textContent=message;
}
function renderTargets(){
  const left=document.getElementById('left-targets'),right=document.getElementById('right-targets');
  left.replaceChildren();right.replaceChildren();
  components.forEach((c,i)=>{
    const button=document.createElement('button');button.type='button';button.className='target hinted';button.dataset.target=c.id;
    button.setAttribute('aria-label',`配對到${c.name}`);
    button.innerHTML=`<span class="target-heading"><span class="target-number">${i+1}</span><span><span class="target-name">${c.name}</span><span class="target-en" lang="en">${c.en}</span></span></span><span class="target-body"><span class="target-placeholder">把組件放在這裏</span><span class="target-hint">${c.hint}</span></span>`;
    button.addEventListener('click',()=>{if(state.selected)attemptMatch(state.selected,c.id);else announce('先點一下機箱內的組件，再點它的名稱框。');});
    (i<3?left:right).appendChild(button);
  });
}
function renderInventory(){
  inventory.replaceChildren();
  state.order.forEach((id,i)=>{
    const c=byId[id];
    if(state.matched.has(id)){
      const empty=document.createElement('span');empty.className='empty-slot';empty.textContent='✓';empty.setAttribute('aria-hidden','true');inventory.appendChild(empty);return;
    }
    const button=document.createElement('button');button.type='button';button.className='part';button.dataset.part=id;
    button.setAttribute('aria-label',`選取組件 ${String.fromCharCode(65+i)}：${c.alt}`);button.setAttribute('aria-pressed',String(state.selected===id));
    button.innerHTML=`<img class="${c.id==='ram'?'ram-photo':''}" src="${c.image}" alt="${c.alt}" draggable="false"><span class="part-label" aria-hidden="true">${String.fromCharCode(65+i)}</span>`;
    button.addEventListener('pointerdown',onPointerDown);
    button.addEventListener('click',(event)=>{if(event.detail===0)selectPart(id,true);});
    inventory.appendChild(button);
  });
  updateSelection();
}
function updateSelection(){
  document.querySelectorAll('[data-part]').forEach(el=>{el.classList.toggle('selected',el.dataset.part===state.selected);el.setAttribute('aria-pressed',String(el.dataset.part===state.selected));});
  document.querySelectorAll('[data-target]').forEach(el=>el.classList.toggle('is-available',!!state.selected&&!state.matched.has(el.dataset.target)));
}
function selectPart(id,read=true){
  if(state.matched.has(id))return;
  state.selected=id;updateSelection();
  if(read){const c=byId[id];announce(state.hints?`看看外形：${c.look} 選一個名稱框吧。`:'已選好組件。把它拖到名稱框，或點一下名稱框。');}
}
function updateProgress(){
  const n=state.matched.size;
  document.getElementById('progress-fill').style.width=`${n/6*100}%`;
  document.getElementById('progress-text').innerHTML=`<strong>${n}</strong> / 6`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(n));
  document.getElementById('success-screen').hidden=n!==6;
  document.getElementById('case-note').hidden=n===6;
}
function attemptMatch(partId,targetId){
  if(!byId[partId]||!byId[targetId]||state.matched.has(partId))return;
  if(state.matched.has(targetId)){announce('這個框已經配對好了。試試另一個名稱框。','retry');return;}
  clearTimeout(wrongTimer);document.querySelectorAll('.is-wrong').forEach(el=>el.classList.remove('is-wrong'));
  const target=document.querySelector(`[data-target="${targetId}"]`);
  if(partId!==targetId){
    state.errors++;target.classList.add('is-wrong');wrongTimer=setTimeout(()=>target.classList.remove('is-wrong'),550);
    announce(state.hints?`再試一次！這個框要找的是${byId[targetId].name}。提示：${byId[targetId].hint}`:'還未配對成功，組件已留在機箱。再試另一個框，或打開提示看看。','retry');return;
  }
  const c=byId[partId];state.matched.add(partId);state.selected=null;
  target.className='target is-matched burst';target.disabled=true;
  target.querySelector('.target-number').textContent='✓';
  target.querySelector('.target-body').innerHTML=`<img class="answer-photo ${c.id==='ram'?'ram-photo':''}" src="${c.image}" alt="${c.name}"><span class="answer-info"><strong>配對成功</strong>${c.work}</span>`;
  target.setAttribute('aria-label',`${c.name}，配對成功。${c.work}`);
  clearTimeout(burstTimer);burstTimer=setTimeout(()=>document.querySelectorAll('.burst').forEach(el=>el.classList.remove('burst')),400);
  renderInventory();updateProgress();
  if(state.matched.size===6){announce('開箱成功！你已認出全部 6 件組件。記住：RAM 暫存正在使用的資料；SSD 長期儲存檔案。','success');document.getElementById('play-again').focus({preventScroll:true});}
  else {announce(`配對正確！${c.name}：${c.work}`,'success');inventory.querySelector('button')?.focus({preventScroll:true});}
}
function onPointerDown(event){
  if(event.button!==0||event.isPrimary===false||state.drag)return;
  const source=event.currentTarget;
  state.drag={id:source.dataset.part,source,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,active:false,ghost:null};
  source.setPointerCapture?.(event.pointerId);
  source.addEventListener('lostpointercapture',onLostCapture,{once:true});
  selectPart(source.dataset.part,false);
}
function onPointerMove(event){
  const d=state.drag;if(!d||event.pointerId!==d.pointerId)return;
  d.x=event.clientX;d.y=event.clientY;
  if(!d.active&&Math.hypot(d.x-d.startX,d.y-d.startY)>6){
    d.active=true;d.ghost=d.source.cloneNode(true);d.ghost.removeAttribute('data-part');d.ghost.removeAttribute('aria-pressed');d.ghost.setAttribute('aria-hidden','true');d.ghost.tabIndex=-1;d.ghost.className='part drag-ghost';
    document.body.appendChild(d.ghost);d.source.classList.add('in-flight');document.body.classList.add('dragging');scrollFrame=requestAnimationFrame(autoScroll);
  }
  if(d.active){event.preventDefault();d.ghost.style.left=(d.x-62)+'px';d.ghost.style.top=(d.y-53)+'px';updateHover();}
}
function updateHover(){
  const d=state.drag;if(!d)return;
  const target=document.elementFromPoint(d.x,d.y)?.closest('[data-target]');
  const id=target&&!state.matched.has(target.dataset.target)?target.dataset.target:null;
  if(state.over!==id){document.querySelectorAll('.is-over').forEach(el=>el.classList.remove('is-over'));state.over=id;if(id)target.classList.add('is-over');}
}
function autoScroll(){
  const d=state.drag;if(!d?.active)return;
  const edge=80;
  let speed=0;if(d.y<edge)speed=-Math.ceil((edge-d.y)/8);else if(d.y>innerHeight-edge)speed=Math.ceil((d.y-innerHeight+edge)/8);
  if(speed){window.scrollBy(0,speed);updateHover();}
  scrollFrame=requestAnimationFrame(autoScroll);
}
function cleanupDrag(){
  const d=state.drag;if(!d)return;
  state.drag=null;cancelAnimationFrame(scrollFrame);d.ghost?.remove();d.source.classList.remove('in-flight');document.body.classList.remove('dragging');
  document.querySelectorAll('.is-over').forEach(el=>el.classList.remove('is-over'));state.over=null;
  if(d.source.hasPointerCapture?.(d.pointerId))d.source.releasePointerCapture(d.pointerId);
}
function onPointerUp(event){
  const d=state.drag;if(!d||event.pointerId!==d.pointerId)return;
  const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-target]');
  const wasDrag=d.active,id=d.id;cleanupDrag();
  if(wasDrag&&target)attemptMatch(id,target.dataset.target);
  else if(wasDrag)announce('組件已回到機箱。拖到名稱框，或直接點一下名稱框。');
  else selectPart(id,true);
}
function onLostCapture(event){if(state.drag&&event.pointerId===state.drag.pointerId)cleanupDrag();}
document.addEventListener('pointermove',onPointerMove,{passive:false});
document.addEventListener('pointerup',onPointerUp);
document.addEventListener('pointercancel',cleanupDrag);
window.addEventListener('blur',cleanupDrag);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){cleanupDrag();state.selected=null;updateSelection();announce('已取消選取。你可以選另一件組件。');}});
document.getElementById('hint-toggle').addEventListener('click',()=>{
  state.hints=!state.hints;document.body.classList.toggle('hints-off',!state.hints);
  document.getElementById('hint-toggle').setAttribute('aria-pressed',String(state.hints));document.getElementById('hint-label').textContent=state.hints?'提示已開':'提示已關';
  announce(state.hints?'外形提示已打開。看看每個框內的提示，再找一找。':'提示已收起。試試自己認出各件組件吧！');
});
function resetGame(){
  cleanupDrag();clearTimeout(wrongTimer);clearTimeout(burstTimer);state.matched.clear();state.selected=null;state.errors=0;state.order=shuffle(components.map(c=>c.id));renderTargets();renderInventory();updateProgress();
  announce('先選一件你認得的組件。慢慢來，放錯也可以再試。');
}
document.getElementById('reset').addEventListener('click',resetGame);
document.getElementById('play-again').addEventListener('click',()=>{resetGame();inventory.querySelector('button')?.focus({preventScroll:true});});
resetGame();
