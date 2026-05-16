// ────────────────────────────────────────
// UTILS
// ────────────────────────────────────────
function esc(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function ea(s){if(!s)return'';return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}

function bd(id,on){document.getElementById(id).classList.toggle('on',on)}
function sh(id,on){document.getElementById(id).classList.toggle('on',on)}

// ────────────────────────────────────────
// TOAST
// ────────────────────────────────────────
let toastT;
function toast(msg){
  let t=document.getElementById('toast');
  if(!t){
    t=document.createElement('div');t.id='toast';
    t.style.cssText='position:fixed;bottom:calc(var(--nh)+14px);left:50%;transform:translateX(-50%) translateY(0);background:var(--text);color:var(--surface);padding:9px 18px;border-radius:20px;font-size:13px;font-weight:600;z-index:400;transition:opacity .3s,transform .3s;pointer-events:none;white-space:nowrap;font-family:var(--font)';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.style.opacity='0';t.style.transform='translateX(-50%) translateY(14px)';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
  }));
  clearTimeout(toastT);
  toastT=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)'},2200);
}

// ────────────────────────────────────────
// NAVIGATION
// ────────────────────────────────────────
function showScr(name){
  document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.nbtn').forEach(b=>b.classList.remove('on'));
  document.getElementById('scr-'+name).classList.add('on');
  const nb=document.querySelector(`.nbtn[data-s="${name}"]`);
  if(nb)nb.classList.add('on');
  document.getElementById('fab').classList.toggle('hide',name!=='home');
  document.getElementById('log-upload-bar').classList.toggle('visible',name==='log');
  sh('sh-ord',false);
  if(name==='log')renderLog();
  if(name==='search'){
    document.getElementById('srch-in').value='';
    document.getElementById('srch-res').innerHTML='';
    setTimeout(()=>{const si=document.getElementById('srch-in');si.focus();},120);
  }
  if(name==='edit'){renderECats();buildECatSel();renderEItems();renderEQtys();}
}

// ────────────────────────────────────────
// CONTEXT MENU
// ────────────────────────────────────────
let ctxTimer=null;
function initCtx(){
  const targets=[document.getElementById('main'),document.getElementById('sh-ord')];
  targets.forEach(el=>{
    el.addEventListener('touchstart',e=>{
      if(e.touches.length>1)return;
      const t=e.touches[0];
      ctxTimer=setTimeout(()=>{
        openCtx(t.clientX,t.clientY);
        navigator.vibrate&&navigator.vibrate(32);
      },520);
    },{passive:true});
    el.addEventListener('touchend',()=>clearTimeout(ctxTimer),{passive:true});
    el.addEventListener('touchmove',()=>clearTimeout(ctxTimer),{passive:true});
    el.addEventListener('contextmenu',e=>{e.preventDefault();openCtx(e.clientX,e.clientY)});
  });
}
function openCtx(x,y){
  const m=document.getElementById('ctx-menu');
  const vw=window.innerWidth,vh=window.innerHeight;
  const mw=172,mh=240;
  let left=Math.min(x-10,vw-mw-12);
  let top=Math.min(y-10,vh-mh-12);
  left=Math.max(12,left);top=Math.max(12,top);
  const ox=Math.round((x-left)/mw*100)+'%';
  const oy=Math.round((y-top)/mh*100)+'%';
  m.style.left=left+'px';m.style.top=top+'px';
  m.style.setProperty('--ctx-ox',ox);m.style.setProperty('--ctx-oy',oy);
  bd('bd-ctx',true);m.classList.add('on');
}
function closeCtx(){
  bd('bd-ctx',false);document.getElementById('ctx-menu').classList.remove('on');
}
function ctxNav(name){
  closeCtx();
  if(document.getElementById('sh-qty').classList.contains('on'))closeQty();
  if(document.getElementById('sh-cfm').classList.contains('on'))closeCfm();
  if(document.getElementById('sh-ord').classList.contains('on'))closeOrder();
  showScr(name);
}

// ────────────────────────────────────────
// SORT
// ────────────────────────────────────────
const SORT_MODES=[
  {id:'az',        label:'A → Z',              icon:'sort_by_alpha', sub:'By category name'},
  {id:'za',        label:'Z → A',              icon:'sort_by_alpha', sub:'By category name'},
  {id:'cat-large', label:'Largest → Smallest', icon:'expand_less',   sub:'By category size'},
  {id:'cat-small', label:'Smallest → Largest', icon:'expand_more',   sub:'By category size'},
  {id:'name-long', label:'Longest → Shortest', icon:'text_fields',   sub:'By name length'},
  {id:'name-short',label:'Shortest → Longest', icon:'text_fields',   sub:'By name length'},
];
let sortMode='az';

function getSortedCats(){
  const cats=[...st.cats];
  switch(sortMode){
    case 'az':          return cats.sort((a,b)=>a.name.localeCompare(b.name));
    case 'za':          return cats.sort((a,b)=>b.name.localeCompare(a.name));
    case 'cat-large':   return cats.sort((a,b)=>b.items.length-a.items.length);
    case 'cat-small':   return cats.sort((a,b)=>a.items.length-b.items.length);
    case 'name-long':   return cats.sort((a,b)=>b.name.length-a.name.length);
    case 'name-short':  return cats.sort((a,b)=>a.name.length-b.name.length);
    default:            return cats;
  }
}
function openSort(){
  const wrap=document.getElementById('sort-opts-wrap');
  wrap.innerHTML=SORT_MODES.map(m=>`
    <div class="sort-opt${sortMode===m.id?' on':''}" onclick="setSort('${m.id}')">
      <span class="icon sm" style="color:var(--accent);flex-shrink:0">${m.icon}</span>
      <div style="flex:1">
        <div class="sort-opt-label">${m.label}${sortMode===m.id?'<span class="sort-badge">active</span>':''}</div>
        ${m.sub?`<div class="sort-opt-sub">${m.sub}</div>`:''}
      </div>
      <span class="icon sm sort-opt-check">check_circle</span>
    </div>`).join('');
  bd('bd-sort',true);sh('sh-sort',true);
}
function closeSort(){bd('bd-sort',false);sh('sh-sort',false)}
function setSort(mode){
  sortMode=mode;
  closeSort();
  renderAccordion();
  const sortBtn=document.querySelector('#sh-ord .btn[data-action="open-sort"]');
  if(sortBtn)sortBtn.classList.toggle('btn-sort-active',mode!=='az');
}
