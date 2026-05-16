// ────────────────────────────────────────
// QTY SHEET
// ────────────────────────────────────────
function syncQtyWidth(el){
  const len=Math.max(1,(el.value||el.placeholder||'0').length);
  const size=len<=4?22:len===5?18:len===6?15:13;
  el.style.fontSize=size+'px';
}
function openQty(itemId,iname,cname){
  editIid=itemId;
  buildQtyUnit();
  const el=document.getElementById('qty-iname');
  el.innerHTML=esc(iname);el.dataset.iname=iname;el.dataset.cname=cname;
  const cat=st.cats.find(c=>c.name===cname);
  el.dataset.catId=cat?cat.id:'';
  const ex=draft.items[itemId];
  const numEl=document.getElementById('qty-num');
  numEl.value=ex?ex.qty:1;
  syncQtyWidth(numEl);
  const defUnit=st.quantities[0]?.name||'Units';
  const unitEl=document.getElementById('qty-unit');
  unitEl.value=ex?ex.unit:defUnit;
  if(!unitEl.value)unitEl.value=defUnit;
  bd('bd-qty',true);sh('sh-qty',true);
  setTimeout(()=>{numEl.focus();numEl.select();},80);
}
function closeQty(){bd('bd-qty',false);sh('sh-qty',false);editIid=null}
function confirmQty(){
  const qty=parseFloat(document.getElementById('qty-num').value);
  const unit=document.getElementById('qty-unit').value;
  if(!editIid||isNaN(qty)||qty<=0){closeQty();return}
  const el=document.getElementById('qty-iname');
  draft.items[editIid]={qty,unit,iname:el.dataset.iname,cname:el.dataset.cname};
  const catId=el.dataset.catId;
  closeQty();
  if(ordSearch)renderAccordion();
  else if(catId)refreshCatBody(catId);else renderAccordion();
  renderCal();
}
function deleteQty(){
  const el=document.getElementById('qty-iname');
  const catId=el?el.dataset.catId:null;
  if(editIid)delete draft.items[editIid];
  closeQty();
  if(ordSearch)renderAccordion();
  else if(catId)refreshCatBody(catId);else renderAccordion();
  renderCal();
}
