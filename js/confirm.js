// ────────────────────────────────────────
// CONFIRM ORDER
// ────────────────────────────────────────
function openCfm(){
  const has=Object.keys(draft.items).length>0;
  if(!has){toast('Add at least one item first');return}
  const d=new Date((draft.date||todayStr())+'T00:00:00');
  buildDateSels(d);
  if(editingOrdId){
    const existingOrd=st.orders.find(o=>o.id===editingOrdId);
    document.getElementById('o-label').value=existingOrd&&existingOrd.label?existingOrd.label:'';
    document.getElementById('o-note').value=existingOrd&&existingOrd.note?existingOrd.note:'';
    if(existingOrd&&existingOrd.time){
      const tp=existingOrd.time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if(tp)buildTimeSels(parseInt(tp[1]),parseInt(tp[2]),tp[3].toUpperCase());
      else buildTimeSels();
    }else{buildTimeSels();}
  }else{
    document.getElementById('o-label').value='';
    document.getElementById('o-note').value='';
    buildTimeSels();
  }
  renderSummary();
  bd('bd-cfm',true);sh('sh-cfm',true);
}
function closeCfm(){bd('bd-cfm',false);sh('sh-cfm',false)}
function buildDateSels(d){
  const day=document.getElementById('o-day');day.innerHTML='';
  for(let i=1;i<=31;i++){const o=document.createElement('option');o.value=i;o.textContent=i;if(i===d.getDate())o.selected=true;day.appendChild(o)}
  const mon=document.getElementById('o-month');mon.innerHTML='';
  MONTHS.forEach((m,i)=>{const o=document.createElement('option');o.value=i;o.textContent=m;if(i===d.getMonth())o.selected=true;mon.appendChild(o)});
  const yr=document.getElementById('o-year');yr.innerHTML='';
  const cy=new Date().getFullYear();
  for(let y=cy-3;y<=cy+5;y++){const o=document.createElement('option');o.value=y;o.textContent=y;if(y===d.getFullYear())o.selected=true;yr.appendChild(o)}
}
function buildTimeSels(h,m,ampm){
  const now=new Date();
  let hr=h!==undefined?h:now.getHours()%12||12;
  let mn=m!==undefined?m:now.getMinutes();
  let ap=ampm||(now.getHours()<12?'AM':'PM');
  const hourEl=document.getElementById('o-hour');hourEl.innerHTML='';
  for(let i=1;i<=12;i++){const o=document.createElement('option');o.value=i;o.textContent=i;if(i===hr)o.selected=true;hourEl.appendChild(o)}
  const minEl=document.getElementById('o-min');minEl.innerHTML='';
  for(let i=0;i<60;i++){const o=document.createElement('option');o.value=i;o.textContent=String(i).padStart(2,'0');if(i===mn)o.selected=true;minEl.appendChild(o)}
  const apEl=document.getElementById('o-ampm');apEl.innerHTML='';
  ['AM','PM'].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;if(v===ap)o.selected=true;apEl.appendChild(o)});
}
function renderSummary(){
  const items=Object.values(draft.items);
  if(!items.length){document.getElementById('ord-summary').innerHTML='';return}
  const cats=[...new Set(items.map(i=>i.cname))];
  document.getElementById('ord-summary').innerHTML=
    `<strong>${cats.length} ${cats.length===1?'category':'categories'}</strong> &nbsp;·&nbsp; <strong>${items.length} ${items.length===1?'item':'items'}</strong><br><br>`+
    items.map(i=>`• ${esc(i.iname)}: ${i.qty} ${esc(i.unit)}`).join('<br>');
}
function createOrd(dl){
  const label=document.getElementById('o-label').value.trim();
  const note=document.getElementById('o-note').value.trim();
  const day=parseInt(document.getElementById('o-day').value);
  const mon=parseInt(document.getElementById('o-month').value);
  const yr=parseInt(document.getElementById('o-year').value);
  const dateStr=`${yr}-${p2(mon+1)}-${p2(day)}`;
  const hr=parseInt(document.getElementById('o-hour').value);
  const mn=parseInt(document.getElementById('o-min').value);
  const ap=document.getElementById('o-ampm').value;
  const timeStr=`${hr}:${String(mn).padStart(2,'0')} ${ap}`;
  const items=Object.entries(draft.items).map(([id,d])=>({itemId:id,...d}));
  if(editingOrdId){
    const idx=st.orders.findIndex(o=>o.id===editingOrdId);
    if(idx!==-1){
      const updated={...st.orders[idx],label:label||null,date:dateStr,time:timeStr,note:note||null,items};
      st.orders[idx]=updated;
      save();if(dl)dlOrder(updated);
    }
    editingOrdId=null;
    closeCfm();closeOrder();
    renderCal();renderLog();
    toast('Order updated!');
    return;
  }
  const order={id:'ord-'+Date.now(),label:label||null,date:dateStr,time:timeStr,note:note||null,items};
  st.orders.unshift(order);save();
  if(dl)dlOrder(order);
  closeCfm();closeOrder();
  renderCal();showScr('log');
  toast('Order created!');
}
