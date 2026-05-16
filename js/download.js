// ────────────────────────────────────────
// DOWNLOAD
// ────────────────────────────────────────
function dlById(id){const o=st.orders.find(x=>x.id===id);if(o)dlOrder(o)}
function dlOrder(o){const m=st.settings.dl;if(m==='text')dlText(o);else if(m==='pdf')dlPDF(o);else dlImg(o)}
function fmtOrder(o){
  const d=new Date(o.date+'T00:00:00');
  const ds=`${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}, ${d.getFullYear()}`;
  const sep='────────────────────────────';
  const byC={};
  o.items.forEach(i=>{if(!byC[i.cname])byC[i.cname]=[];byC[i.cname].push(i)});
  const catKeys=Object.keys(byC);
  const totalItems=o.items.length;
  let t='SHELF KART ORDER\n'+sep+'\n';
  if(o.label)t+=`${o.label}\n`;
  t+=`DATE: ${ds}\n`;
  if(o.time)t+=`TIME: ${o.time}\n`;
  if(o.note)t+=`${o.note}\n`;
  t+=sep+'\n';
  t+=`${catKeys.length} ${catKeys.length===1?'Category':'Categories'} · ${totalItems} ${totalItems===1?'Item':'Items'}\n`;
  t+=sep+'\n';
  const ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  catKeys.forEach((cname,ci)=>{
    t+=`${ALPHA[ci]||String(ci+1)}. ${cname}\n`;
    byC[cname].forEach((item,ii)=>{
      t+=`${ii+1}. ${item.iname}`;
      if(item.qty&&item.unit)t+=` — ${item.qty} ${item.unit}`;
      t+='\n';
    });
    t+=sep+'\n';
  });
  return t;
}
function dlText(o){
  const txt=fmtOrder(o);
  const blob=new Blob(['\uFEFF'+txt],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=`kart-${o.date}.txt`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function dlPDF(o){
  const txt=fmtOrder(o);
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Kart Order</title>`+
    `<style>body{font-family:monospace;padding:32px;font-size:13px;line-height:1.7;color:#1a1a1a}`+
    `pre{white-space:pre-wrap;word-break:break-word}`+
    `@media print{body{padding:16px}}</style></head>`+
    `<body><pre>${esc(txt)}</pre><script>window.onload=function(){window.print()}<\/script></body></html>`;
  const blob=new Blob([html],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const win=window.open(url,'_blank');
  if(win){
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }else{
    URL.revokeObjectURL(url);
    const fb=new Blob([html],{type:'text/html;charset=utf-8'});
    const fu=URL.createObjectURL(fb);
    const a=document.createElement('a');a.href=fu;a.download=`kart-${o.date}.html`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(fu);
    toast('Saved as HTML — open & print from browser');
  }
}
function dlImg(o){
  const d=new Date(o.date+'T00:00:00');
  const ds=`${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const byC={};
  o.items.forEach(i=>{if(!byC[i.cname])byC[i.cname]=[];byC[i.cname].push(i)});

  const W=640,pad=36,colRight=W-pad;
  const SZ_TITLE=28,SZ_DATE=14,SZ_NOTE=13,SZ_CAT=11,SZ_ITEM=14;
  const LH_TITLE=38,LH_DATE=22,LH_NOTE=20,LH_CAT=26,LH_ITEM=28;
  const accent=st.settings.accent||'#4285F4';
  const imgFont=st.settings.font||"'Helvetica Neue',Arial,sans-serif";

  let ht=pad+LH_TITLE+8+LH_DATE;
  if(o.note)ht+=12+LH_NOTE*(Math.ceil(o.note.length/56))+16;
  ht+=20;
  Object.entries(byC).forEach(([cname,items])=>{
    ht+=LH_CAT+4;
    items.forEach(()=>ht+=LH_ITEM);
    ht+=12;
  });
  ht+=pad+16;

  const canvas=document.createElement('canvas');
  const scale=2;
  canvas.width=W*scale;canvas.height=ht*scale;
  const ctx=canvas.getContext('2d');
  ctx.scale(scale,scale);

  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,ht);
  ctx.fillStyle=accent;ctx.fillRect(0,0,W,4);

  let y=pad+8;

  ctx.font=`700 ${SZ_TITLE}px ${imgFont}`;
  ctx.fillStyle='#111111';
  ctx.textBaseline='top';
  ctx.fillText(o.label||ds,pad,y);
  y+=LH_TITLE;

  ctx.font=`400 ${SZ_DATE}px ${imgFont}`;
  ctx.fillStyle='#888888';
  if(o.label)ctx.fillText(ds+(o.time?'  ·  '+o.time:''),pad,y);
  else if(o.time)ctx.fillText(o.time,pad,y);
  y+=LH_DATE;

  if(o.note){
    y+=10;
    const noteLines=[];const words=o.note.split(' ');let line='';
    words.forEach(w=>{const test=line?line+' '+w:w;
      ctx.font=`400 ${SZ_NOTE}px ${imgFont}`;
      if(ctx.measureText(test).width>W-pad*2-24){noteLines.push(line);line=w;}else line=test;
    });
    if(line)noteLines.push(line);
    const boxH=noteLines.length*LH_NOTE+16;
    ctx.fillStyle='#F5F5F5';roundRect(ctx,pad,y,W-pad*2,boxH,6);ctx.fill();
    ctx.fillStyle='#555555';ctx.font=`400 ${SZ_NOTE}px ${imgFont}`;
    noteLines.forEach((l,i)=>ctx.fillText(l,pad+12,y+8+i*LH_NOTE));
    y+=boxH+12;
  }

  y+=14;

  Object.entries(byC).forEach(([cname,items])=>{
    ctx.font=`700 ${SZ_CAT}px ${imgFont}`;
    ctx.fillStyle='#AAAAAA';
    ctx.fillText(cname.toUpperCase(),pad,y);
    y+=LH_CAT;

    ctx.strokeStyle='#EEEEEE';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(pad,y-8);ctx.lineTo(W-pad,y-8);ctx.stroke();

    items.forEach(item=>{
      ctx.font=`400 ${SZ_ITEM}px ${imgFont}`;
      ctx.fillStyle='#111111';
      ctx.fillText(item.iname,pad,y);
      const qstr=`${item.qty} ${item.unit}`;
      ctx.font=`700 ${SZ_ITEM}px ${imgFont}`;
      ctx.fillStyle=accent;
      const qw=ctx.measureText(qstr).width;
      ctx.fillText(qstr,colRight-qw,y);
      y+=LH_ITEM;
    });
    y+=12;
  });

  ctx.fillStyle=accent;ctx.fillRect(0,ht-3,W,3);

  const url=canvas.toDataURL('image/png');
  const a=document.createElement('a');a.href=url;a.download=`kart-${o.date}.png`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}
