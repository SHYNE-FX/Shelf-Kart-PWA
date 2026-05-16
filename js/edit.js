// ────────────────────────────────────────
// EDIT – CATEGORIES
// ────────────────────────────────────────
function switchETab(t){
  const tabs=document.querySelectorAll('.etab');
  const names=['categories','items','qty-list'];
  tabs.forEach((el,i)=>el.classList.toggle('on',names[i]===t));
  document.getElementById('ep-categories').classList.toggle('on',t==='categories');
  document.getElementById('ep-items').classList.toggle('on',t==='items');
  document.getElementById('ep-qty-list').classList.toggle('on',t==='qty-list');
  if(t==='items'){buildECatSel();renderEItems()}
  if(t==='qty-list'){renderEQtys()}
}
function renderECats(){
  const el=document.getElementById('ecats');
  if(!st.cats.length){el.innerHTML='<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:13px">No categories yet</div>';return}
  el.innerHTML=st.cats.map(c=>`
    <div class="erow" id="cr-${c.id}">
      <span class="ename">${esc(c.name)}</span>
      <div class="eacts">
        <button class="eibtn" onclick="renCat('${c.id}')"><span class="icon sm">edit</span></button>
        <button class="eibtn del" onclick="delCat('${c.id}')"><span class="icon sm">delete</span></button>
      </div>
    </div>`).join('');
}
function addCat(){
  const i=document.getElementById('new-cat');const n=i.value.trim();if(!n)return;
  st.cats.push({id:'c-'+Date.now(),name:n,items:[]});save();i.value='';
  renderECats();buildECatSel();
}
function delCat(id){
  if(!confirm('Delete this category and all its items?'))return;
  st.cats=st.cats.filter(c=>c.id!==id);save();renderECats();buildECatSel();
}
function renCat(id){
  const cat=st.cats.find(c=>c.id===id);if(!cat)return;
  const row=document.getElementById('cr-'+id);
  row.innerHTML=`<input class="renin" value="${ea(cat.name)}" id="ri-${id}">
    <div class="eacts">
      <button class="eibtn" onclick="svCat('${id}')"><span class="icon sm">check</span></button>
      <button class="eibtn del" onclick="renderECats()"><span class="icon sm">close</span></button>
    </div>`;
  document.getElementById('ri-'+id).focus();
}
function svCat(id){
  const n=document.getElementById('ri-'+id).value.trim();if(!n)return;
  const cat=st.cats.find(c=>c.id===id);if(cat){cat.name=n;save()}
  renderECats();buildECatSel();
}

// ────────────────────────────────────────
// EDIT – ITEMS
// ────────────────────────────────────────
function buildECatSel(){
  const sel=document.getElementById('ecat-sel');
  const prev=sel.value;
  sel.innerHTML=st.cats.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  if(prev&&st.cats.find(c=>c.id===prev))sel.value=prev;
  renderEItems();
}
function renderEItems(){
  const catId=document.getElementById('ecat-sel').value;
  const el=document.getElementById('eitems');
  const cat=st.cats.find(c=>c.id===catId);
  if(!cat){el.innerHTML='';return}
  if(!cat.items.length){el.innerHTML='<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:13px">No items yet</div>';return}
  el.innerHTML=cat.items.map(item=>`
    <div class="erow" id="ir-${item.id}">
      <span class="ename">${esc(item.name)}</span>
      <div class="eacts">
        <button class="eibtn" title="Move to category" onclick="moveItem('${catId}','${item.id}')"><span class="icon sm">drive_file_move</span></button>
        <button class="eibtn" onclick="renItem('${catId}','${item.id}')"><span class="icon sm">edit</span></button>
        <button class="eibtn del" onclick="delItem('${catId}','${item.id}')"><span class="icon sm">delete</span></button>
      </div>
    </div>`).join('');
}
function addItem(){
  const catId=document.getElementById('ecat-sel').value;
  const i=document.getElementById('new-item');const n=i.value.trim();
  if(!n||!catId)return;
  const cat=st.cats.find(c=>c.id===catId);if(!cat)return;
  cat.items.push({id:'i-'+Date.now(),name:n});save();i.value='';renderEItems();
}
function delItem(catId,itemId){
  const cat=st.cats.find(c=>c.id===catId);if(!cat)return;
  cat.items=cat.items.filter(i=>i.id!==itemId);save();renderEItems();
}
function renItem(catId,itemId){
  const cat=st.cats.find(c=>c.id===catId);
  const item=cat&&cat.items.find(i=>i.id===itemId);if(!item)return;
  const row=document.getElementById('ir-'+itemId);
  row.innerHTML=`<input class="renin" value="${ea(item.name)}" id="rii-${itemId}">
    <div class="eacts">
      <button class="eibtn" onclick="svItem('${catId}','${itemId}')"><span class="icon sm">check</span></button>
      <button class="eibtn del" onclick="renderEItems()"><span class="icon sm">close</span></button>
    </div>`;
  document.getElementById('rii-'+itemId).focus();
}
function svItem(catId,itemId){
  const n=document.getElementById('rii-'+itemId).value.trim();if(!n)return;
  const cat=st.cats.find(c=>c.id===catId);
  const item=cat&&cat.items.find(i=>i.id===itemId);
  if(item){item.name=n;save()}
  renderEItems();
}
function moveItem(fromCatId,itemId){
  const row=document.getElementById('ir-'+itemId);
  const cat=st.cats.find(c=>c.id===fromCatId);
  const item=cat&&cat.items.find(i=>i.id===itemId);
  if(!item)return;
  const opts=st.cats.filter(c=>c.id!==fromCatId).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  if(!opts){toast('No other categories');return;}
  row.innerHTML=`<span class="ename" style="font-size:12px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(item.name)}</span>
    <select class="renin" id="mv-sel-${itemId}" style="flex:1;max-width:130px;font-size:12px">${opts}</select>
    <div class="eacts">
      <button class="eibtn" onclick="svMove('${fromCatId}','${itemId}')"><span class="icon sm">check</span></button>
      <button class="eibtn del" onclick="renderEItems()"><span class="icon sm">close</span></button>
    </div>`;
}
function svMove(fromCatId,itemId){
  const toCatId=document.getElementById('mv-sel-'+itemId).value;
  const fromCat=st.cats.find(c=>c.id===fromCatId);
  const toCat=st.cats.find(c=>c.id===toCatId);
  if(!fromCat||!toCat)return;
  const idx=fromCat.items.findIndex(i=>i.id===itemId);
  if(idx===-1)return;
  const [item]=fromCat.items.splice(idx,1);
  toCat.items.push(item);
  save();renderEItems();toast(`Moved to ${toCat.name}`);
}

// ────────────────────────────────────────
// EDIT – QUANTITIES
// ────────────────────────────────────────
function ensureDefaultQty(){
  if(!st.quantities.length||st.quantities[0].name!=='Units'){
    const hasUnits=st.quantities.findIndex(q=>q.name==='Units');
    if(hasUnits>0)st.quantities.splice(hasUnits,1);
    st.quantities.unshift({id:'dq0',name:'Units'});
    save();
  }
}
function renderEQtys(){
  ensureDefaultQty();
  const el=document.getElementById('eqtys');
  if(!st.quantities.length){el.innerHTML='<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:13px">No quantities</div>';return}
  el.innerHTML=st.quantities.map((q,i)=>`
    <div class="erow" id="qr-${q.id}">
      <span class="ename">${esc(q.name)}</span>
      ${i===0
        ?'<span style="font-size:11px;color:var(--accent);font-weight:700;padding:3px 10px;background:rgba(66,133,244,.12);border-radius:20px">default</span>'
        :`<div class="eacts"><button class="eibtn del" onclick="delQty('${q.id}')"><span class="icon sm">delete</span></button></div>`
      }
    </div>`).join('');
}
function addQty(){
  const i=document.getElementById('new-qty');const n=i.value.trim();if(!n)return;
  if(n.toLowerCase()==='units'){toast('Units quantity already exists');i.value='';return}
  if(st.quantities.find(q=>q.name.toLowerCase()===n.toLowerCase())){toast('Quantity already exists');return}
  st.quantities.push({id:'q-'+Date.now(),name:n});save();i.value='';
  renderEQtys();buildQtyUnit();
}
function delQty(id){
  const q=st.quantities.find(q=>q.id===id);
  if(!q||q.name==='Units'){toast('Cannot delete Units');return}
  st.quantities=st.quantities.filter(q=>q.id!==id);save();
  renderEQtys();buildQtyUnit();
}
function buildQtyUnit(selectedVal){
  const sel=document.getElementById('qty-unit');
  const cur=selectedVal||sel.value;
  sel.innerHTML=st.quantities.map(q=>`<option value="${esc(q.name)}">${esc(q.name)}</option>`).join('');
  if(cur&&sel.querySelector(`option[value="${CSS.escape(cur)}"]`))sel.value=cur;
  else sel.value=st.quantities[0]?.name||'Units';
}
