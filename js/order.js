// ────────────────────────────────────────
// CREATE ORDER
// ────────────────────────────────────────
function openOrder(dateStr){
  const targetDate=dateStr||todayStr();
  if(draft.date!==targetDate){
    draft={date:targetDate,items:{}};
  }
  accOpen.clear();ordSearch='';
  const d=new Date(targetDate+'T00:00:00');
  document.getElementById('sh-ord-ttl').textContent=dateStr
    ?`Order — ${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    :'New Order';
  resetOrdSearchUI();
  renderAccordion();
  sh('sh-ord',true);
}
function closeOrder(){draft={date:todayStr(),items:{}};sh('sh-ord',false);editingOrdId=null;ordSearch='';resetOrdSearchUI();}
function todayStr(){const t=new Date();return`${t.getFullYear()}-${p2(t.getMonth()+1)}-${p2(t.getDate())}`}
function p2(n){return String(n).padStart(2,'0')}
function setOrdSearch(val){
  ordSearch=val.trim().toLowerCase();
  document.getElementById('ord-srch-clr').classList.toggle('vis',ordSearch.length>0);
  renderAccordion();
}
function clearOrdSearch(){
  ordSearch='';
  const inp=document.getElementById('ord-srch-in');
  if(inp){inp.value='';inp.focus();}
  document.getElementById('ord-srch-clr').classList.remove('vis');
  renderAccordion();
}
function resetOrdSearchUI(){
  const inp=document.getElementById('ord-srch-in');
  if(inp)inp.value='';
  const clr=document.getElementById('ord-srch-clr');
  if(clr)clr.classList.remove('vis');
}

// ────────────────────────────────────────
// ACCORDION
// ────────────────────────────────────────
function renderAccordion(){
  const el=document.getElementById('ord-items');
  if(!st.cats.length){el.innerHTML='<div style="padding:32px;text-align:center;color:var(--text-muted);font-size:13px">No categories. Add some in Edit.</div>';return}
  const q=ordSearch;
  if(q){
    let matches=[];
    st.cats.forEach(cat=>{
      const catMatch=cat.name.toLowerCase().includes(q);
      cat.items.forEach(item=>{
        if(catMatch||item.name.toLowerCase().includes(q)){
          matches.push({cat,item});
        }
      });
    });
    if(!matches.length){
      el.innerHTML=`<div class="ord-srch-none"><span class="icon lg" style="color:var(--border)">search_off</span><br>No items match "<strong>${esc(q)}</strong>"</div>`;
      return;
    }
    const grouped=new Map();
    matches.forEach(({cat,item})=>{
      if(!grouped.has(cat.id))grouped.set(cat.id,{cat,items:[]});
      grouped.get(cat.id).items.push(item);
    });
    el.innerHTML=[...grouped.values()].map(({cat,items})=>{
      const selCount=items.filter(i=>draft.items[i.id]&&draft.items[i.id].qty>0).length;
      const bodyHtml=items.map(item=>{
        const s=draft.items[item.id];const hq=s&&s.qty>0;
        const qbadge=hq?`<span class="item-qty-badge">${s.qty} ${esc(s.unit)}</span>`:'';
        return`<div class="item-row">
          <span class="item-name">${esc(item.name)}</span>
          ${qbadge}
          <button class="item-plus" onclick="openQty('${item.id}','${ea(item.name)}','${ea(cat.name)}')">
            <span class="icon sm">add</span>
          </button>
          <button class="item-cross${hq?' on':''}" onclick="rmItemSearch('${item.id}','${cat.id}')" ${!hq?'disabled':''}>
            <span class="icon sm">close</span>
          </button>
        </div>`;
      }).join('');
      return`<div class="acc-cat">
        <div class="acc-cat-hdr open">
          <span class="acc-cat-name">${esc(cat.name)}</span>
          ${selCount?`<span class="acc-cat-badge">${selCount} selected</span>`:''}
        </div>
        <div class="acc-cat-body open" style="padding:0 14px 4px">${bodyHtml}</div>
      </div>`;
    }).join('');
    return;
  }
  const cats=getSortedCats();
  el.innerHTML=cats.map((cat,idx)=>{
    const num=String(idx+1).padStart(2,'0')+'.';
    const isOpen=accOpen.has(cat.id);
    const selCount=cat.items.filter(i=>draft.items[i.id]&&draft.items[i.id].qty>0).length;
    return`<div class="acc-cat">
      <div class="acc-cat-hdr${isOpen?' open':''}" onclick="toggleAcc('${cat.id}')">
        <span class="acc-cat-name"><span style="color:var(--text-muted);font-weight:600;margin-right:5px;font-size:0.75rem">${num}</span>${esc(cat.name)}</span>
        ${selCount?`<span class="acc-cat-badge">${selCount} selected</span>`:''}
        <span class="icon sm acc-cat-arrow${isOpen?' open':''}" id="acc-arr-${cat.id}">expand_more</span>
      </div>
      <div class="acc-cat-body${isOpen?' open':''}" id="acc-body-${cat.id}">
        ${renderCatItems(cat)}
      </div>
    </div>`;
  }).join('');
}
function toggleAcc(catId){
  const wasOpen=accOpen.has(catId);
  accOpen.forEach(openId=>{
    if(openId===catId)return;
    const ob=document.getElementById('acc-body-'+openId);
    const oh=ob?ob.previousElementSibling:null;
    const oa=document.getElementById('acc-arr-'+openId);
    if(ob)ob.classList.remove('open');
    if(oh)oh.classList.remove('open');
    if(oa)oa.classList.remove('open');
  });
  accOpen.clear();
  if(!wasOpen){accOpen.add(catId);}
  const body=document.getElementById('acc-body-'+catId);
  const hdr=body?body.previousElementSibling:null;
  const arr=document.getElementById('acc-arr-'+catId);
  if(body)body.classList.toggle('open',!wasOpen);
  if(hdr)hdr.classList.toggle('open',!wasOpen);
  if(arr)arr.classList.toggle('open',!wasOpen);
}
function renderCatItems(cat){
  if(!cat.items.length)return'<div style="padding:8px 0 10px;color:var(--text-muted);font-size:13px">No items in this category</div>';
  return cat.items.map(item=>{
    const s=draft.items[item.id];const hq=s&&s.qty>0;
    const qbadge=hq?`<span class="item-qty-badge">${s.qty} ${esc(s.unit)}</span>`:'';
    return`<div class="item-row">
      <span class="item-name">${esc(item.name)}</span>
      ${qbadge}
      <button class="item-plus" onclick="openQty('${item.id}','${ea(item.name)}','${ea(cat.name)}')">
        <span class="icon sm">add</span>
      </button>
      <button class="item-cross${hq?' on':''}" onclick="rmItem('${item.id}','${cat.id}')" ${!hq?'disabled':''}>
        <span class="icon sm">close</span>
      </button>
    </div>`;
  }).join('');
}
function refreshCatBody(catId){
  const cat=st.cats.find(c=>c.id===catId);if(!cat)return;
  const body=document.getElementById('acc-body-'+catId);
  if(body)body.innerHTML=renderCatItems(cat);
  const hdr=body?body.previousElementSibling:null;
  if(hdr){
    const selCount=cat.items.filter(i=>draft.items[i.id]&&draft.items[i.id].qty>0).length;
    let badge=hdr.querySelector('.acc-cat-badge');
    if(selCount){
      if(!badge){badge=document.createElement('span');badge.className='acc-cat-badge';hdr.querySelector('.acc-cat-arrow').before(badge)}
      badge.textContent=selCount+' selected';
    }else{if(badge)badge.remove()}
  }
}
function rmItem(itemId,catId){delete draft.items[itemId];refreshCatBody(catId)}
function rmItemSearch(itemId,catId){delete draft.items[itemId];renderAccordion()}
function clearDraft(){draft.items={};renderAccordion()}
