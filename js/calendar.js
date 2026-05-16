// ────────────────────────────────────────
// CALENDAR
// ────────────────────────────────────────
function buildCalSelects(){
  const ms=document.getElementById('cal-ms');
  MONTHS.forEach((m,i)=>{const o=document.createElement('option');o.value=i;o.textContent=m;if(i===calV.m)o.selected=true;ms.appendChild(o)});
  const ys=document.getElementById('cal-ys');
  const cy=new Date().getFullYear();
  for(let y=cy-5;y<=cy+10;y++){const o=document.createElement('option');o.value=y;o.textContent=y;if(y===calV.y)o.selected=true;ys.appendChild(o)}
}
function onCalM(){calV.m=parseInt(document.getElementById('cal-ms').value);renderCal()}
function onCalY(){calV.y=parseInt(document.getElementById('cal-ys').value);renderCal()}
function calNav(d){
  calV.m+=d;
  if(calV.m<0){calV.m=11;calV.y--}
  if(calV.m>11){calV.m=0;calV.y++}
  document.getElementById('cal-ms').value=calV.m;
  document.getElementById('cal-ys').value=calV.y;
  renderCal();
}
function goToday(){
  const n=new Date();calV.y=n.getFullYear();calV.m=n.getMonth();
  document.getElementById('cal-ms').value=calV.m;
  document.getElementById('cal-ys').value=calV.y;
  renderCal();
}
function renderCal(){
  const c=document.getElementById('cal-days');
  const today=new Date();
  const {y,m}=calV;
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  const offset=first===0?6:first-1;
  const ordDates=new Set();
  st.orders.forEach(o=>{const d=new Date(o.date+'T00:00:00');if(d.getFullYear()===y&&d.getMonth()===m)ordDates.add(d.getDate())});
  const draftDate=(draft&&draft.date&&Object.keys(draft.items||{}).length>0)?draft.date:null;
  let h='';
  for(let i=0;i<offset;i++)h+='<div class="cal-day empty"></div>';
  for(let d=1;d<=days;d++){
    const dow=new Date(y,m,d).getDay();
    const isSat=dow===6,isSun=dow===0;
    const isToday=d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
    const hasOrd=ordDates.has(d);
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const hasDraft=draftDate===ds;
    const cls=['cal-day',isSat?'sat':'',isSun?'sun':'',isToday?'today':'',hasOrd?'has-ord':'',hasDraft?'has-draft':''].filter(Boolean).join(' ');
    h+=`<div class="${cls}" onclick="openOrder('${ds}')"><div class="cal-dn">${d}</div></div>`;
  }
  c.innerHTML=h;
}
