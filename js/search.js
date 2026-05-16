// ────────────────────────────────────────
// SEARCH
// ────────────────────────────────────────
function doSearch(q){
  q=q.trim().toLowerCase();
  const el=document.getElementById('srch-res');
  if(!q){el.innerHTML='';return}
  let h='';
  const cats=st.cats.filter(c=>c.name.toLowerCase().includes(q));
  if(cats.length){
    h+=`<div class="srch-sec">Categories</div>`;
    h+=cats.map(c=>`<div class="search-result-item srch-item" onclick="showScr('edit')">
      <div class="srch-main">${esc(c.name)}</div>
      <div class="srch-sub">${c.items.length} items</div>
    </div>`).join('');
  }
  const mitems=[];
  st.cats.forEach(cat=>cat.items.forEach(item=>{if(item.name.toLowerCase().includes(q))mitems.push({item,cat})}));
  if(mitems.length){
    h+=`<div class="srch-sec">Items</div>`;
    h+=mitems.map(({item,cat})=>`<div class="srch-item" style="display:flex;align-items:center;gap:8px">
      <div style="flex:1">
        <div class="srch-main">${esc(item.name)}</div>
        <div class="srch-sub">${esc(cat.name)}</div>
      </div>
      <button class="item-plus" style="flex-shrink:0" title="Add to order" onclick="searchAdd('${item.id}','${ea(item.name)}','${ea(cat.name)}');event.stopPropagation()">
        <span class="icon sm">add</span>
      </button>
    </div>`).join('');
  }
  const mords=st.orders.filter(o=>
    (o.label&&o.label.toLowerCase().includes(q))||
    (o.note&&o.note.toLowerCase().includes(q))||
    o.date.includes(q)||
    o.items.some(i=>i.iname.toLowerCase().includes(q)||i.cname.toLowerCase().includes(q))
  );
  if(mords.length){
    h+=`<div class="srch-sec">Orders</div>`;
    h+=mords.map(o=>{
      const d=new Date(o.date+'T00:00:00');
      const ds=`${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      return`<div class="srch-item" onclick="showScr('log')">
        <div class="srch-main">${o.label?esc(o.label):ds}</div>
        <div class="srch-sub">${o.label?ds+' · ':''} ${o.items.length} items</div>
      </div>`;
    }).join('');
  }
  if(!h)h=`<div class="srch-none">No results for "${esc(q)}"</div>`;
  el.innerHTML=h;
}
function searchAdd(itemId,iname,cname){
  if(!document.getElementById('sh-ord').classList.contains('on')){
    openOrder(null);
  }
  setTimeout(()=>openQty(itemId,iname,cname),60);
}
