// ────────────────────────────────────────
// LOG
// ────────────────────────────────────────
function triggerLogUpload(){document.getElementById('log-upload-input').value='';document.getElementById('log-upload-input').click();}
function handleLogUpload(input){
  const files=[...input.files];if(!files.length)return;
  let imported=0,skipped=0,pending=files.length;
  files.forEach(file=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const result=parseTxtLog(e.target.result,file.name);
      if(result){
        const exists=st.orders.some(o=>o.date===result.date&&o.items.length===result.items.length);
        if(!exists){st.orders.unshift(result);imported++;}
        else skipped++;
      } else skipped++;
      pending--;
      if(pending===0){
        save();renderLog();renderCal();
        let msg=`Imported ${imported} order${imported!==1?'s':''}`;
        if(skipped)msg+=` · ${skipped} skipped`;
        toast(msg);
      }
    };
    reader.onerror=()=>{skipped++;pending--;if(pending===0){save();renderLog();renderCal();toast(`${imported} imported · ${skipped} failed`);}};
    reader.readAsText(file);
  });
}
function parseTxtLog(txt,filename){
  try{
    // Extract date from filename kart-YYYY-MM-DD.txt first
    let date='';
    const fnMatch=filename.match(/(\d{4}-\d{2}-\d{2})/);
    if(fnMatch)date=fnMatch[1];

    const lines=txt.replace(/\uFEFF/g,'').split('\n').map(l=>l.trim());
    if(!lines[0].includes('SHELF KART'))return null;

    let label='',time='',note='';
    const SEP='────────────────────────────';
    let sepCount=0,headerDone=false;
    const items=[];const catMap={};
    let currentCat='';let catIndex=-1;

    for(let i=0;i<lines.length;i++){
      const l=lines[i];
      if(l===SEP){sepCount++;if(sepCount===3)headerDone=true;continue;}
      if(sepCount===1){
        if(l.startsWith('DATE:')){
          if(!date){
            // Parse "JANUARY 5, 2025" → "2025-01-05"
            const m=l.replace('DATE:','').trim().match(/(\w+)\s+(\d+),\s+(\d{4})/);
            if(m){const mi=MONTHS.findIndex(mn=>mn.toUpperCase()===m[1].toUpperCase());if(mi>=0)date=`${m[3]}-${String(mi+1).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;}
          }
        } else if(l.startsWith('TIME:')){time=l.replace('TIME:','').trim();}
        else if(l&&!label&&!l.match(/^\d+\s+(Category|Categories|Item|Items)/)){
          // Could be label or note — first non-date non-time non-sep line after sep1 = label
          if(!label)label=l;
          else note+=(note?' ':'')+l;
        }
        continue;
      }
      if(sepCount===2&&!headerDone)continue;
      if(headerDone){
        // Category line: "A. Category Name"
        const catMatch=l.match(/^[A-Z\d]+\.\s+(.+)$/);
        if(catMatch){currentCat=catMatch[1];catIndex++;continue;}
        // Item line: "1. Item Name — qty unit"
        const itemMatch=l.match(/^(\d+)\.\s+(.+?)(?:\s+[—–-]\s+(.+))?$/);
        if(itemMatch&&currentCat){
          const iname=itemMatch[2].trim();
          let qty='',unit='';
          if(itemMatch[3]){const parts=itemMatch[3].trim().split(/\s+/);qty=parts[0]||'';unit=parts.slice(1).join(' ')||'';}
          const itemId='imp-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
          items.push({itemId,iname,cname:currentCat,qty,unit});
        }
      }
    }
    if(!date||!items.length)return null;
    return{id:'imp-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),date,label,time,note,items};
  }catch(err){return null;}
}
function renderLog(){
  const el=document.getElementById('log-list');
  if(!st.orders.length){
    el.innerHTML=`<div class="log-empty"><span class="icon xl" style="color:var(--border)">book_4</span><br>No orders yet.<br><span style="font-size:12px">Tap the calendar or + to create one.</span></div>`;
    return;
  }
  el.innerHTML=st.orders.map(o=>{
    const d=new Date(o.date+'T00:00:00');
    const ds=`${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const ts=o.time?` · ${o.time}`:'';
    const cats=[...new Set(o.items.map(i=>i.cname))].length;
    const itms=o.items.length;
    const lbl=o.label
      ?`<div class="log-lbl">${esc(o.label)}</div><div class="log-dtrow">${ds}${ts}</div>`
      :`<div class="log-lbl">${ds}${ts}</div>`;
    return`<div class="log-card" data-oid="${o.id}" onclick="tapLog(event,'${o.id}')">
      <div class="log-info">
        ${lbl}
        <div class="log-cat-ct">${cats===1?'Category':'Categories'} ${cats} · Items ${itms}</div>
      </div>
      <div class="log-btns">
        <button class="log-act-edit" onclick="editOrd('${o.id}');event.stopPropagation()"><span class="icon sm">edit</span></button>
        <button class="log-act-del" onclick="delOrd('${o.id}');event.stopPropagation()"><span class="icon sm">delete</span></button>
        <button class="log-dl" onclick="dlById('${o.id}');event.stopPropagation()"><span class="icon sm">download</span></button>
      </div>
    </div>`;
  }).join('');
}
function tapLog(e,ordId){
  if(e.target.closest('button'))return;
  openOrdDetail(ordId);
}
function openOrdDetail(ordId){
  const ord=st.orders.find(o=>o.id===ordId);if(!ord)return;
  const d=new Date(ord.date+'T00:00:00');
  const ds=`${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  document.getElementById('ord-det-title').textContent=ord.label||ds;
  document.getElementById('det-ord-id').value=ordId;
  let h='';
  if(ord.label)h+=`<div style="font-size:12px;color:var(--text-sub);margin-bottom:10px">${ds}</div>`;
  if(ord.note)h+=`<div style="font-size:13px;color:var(--text-sub);margin-bottom:12px;padding:8px 12px;background:var(--bg);border-radius:var(--rs)">${esc(ord.note)}</div>`;
  const byC={};
  ord.items.forEach(i=>{if(!byC[i.cname])byC[i.cname]=[];byC[i.cname].push(i)});
  Object.entries(byC).forEach(([cname,items])=>{
    h+=`<div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.8px;margin:12px 0 5px">${esc(cname)}</div>`;
    h+=items.map(i=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:14px">
      <span>${esc(i.iname)}</span>
      <span style="color:var(--accent);font-weight:700">${i.qty} ${esc(i.unit)}</span>
    </div>`).join('');
  });
  document.getElementById('ord-det-body').innerHTML=h;
  bd('bd-ord-det',true);sh('sh-ord-det',true);
}
function closeOrdDetail(){bd('bd-ord-det',false);sh('sh-ord-det',false);}
function editFromDetail(){const id=document.getElementById('det-ord-id').value;closeOrdDetail();editOrd(id);}
function editOrd(ordId){
  logActiveCard=null;
  const ord=st.orders.find(o=>o.id===ordId);if(!ord)return;
  editingOrdId=ordId;
  draft={date:ord.date,items:{}};
  ord.items.forEach(i=>{draft.items[i.itemId]={qty:i.qty,unit:i.unit,iname:i.iname,cname:i.cname};});
  accOpen.clear();ordSearch='';
  const d=new Date(ord.date+'T00:00:00');
  document.getElementById('sh-ord-ttl').textContent=`Edit — ${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  resetOrdSearchUI();
  renderAccordion();
  sh('sh-ord',true);
}
function delOrd(ordId){
  st.orders=st.orders.filter(o=>o.id!==ordId);save();
  logActiveCard=null;renderLog();renderCal();toast('Order deleted');
}
