// ────────────────────────────────────────
// THEME
// ────────────────────────────────────────
const sysDark=()=>window.matchMedia('(prefers-color-scheme: dark)').matches;
let _mql=null;
function resolveTheme(theme){
  if(theme==='system')return sysDark()?'dark':'light';
  return theme;
}
function applyTheme(theme){
  const dark=resolveTheme(theme)==='dark';
  document.body.classList.toggle('dark',dark);
  document.querySelectorAll('.tseg-btn').forEach(b=>b.classList.toggle('on',b.dataset.t===theme));
  if(_mql)_mql.removeEventListener('change',_mqlCb);
  if(theme==='system'){
    _mql=window.matchMedia('(prefers-color-scheme: dark)');
    _mql.addEventListener('change',_mqlCb);
  }
}
function _mqlCb(){applyTheme('system')}
function setTheme(t){
  st.settings.theme=t;
  delete st.settings.dark;
  applyTheme(t);
  save();
}

// ────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────
function applySettings(){
  const s=st.settings;
  if(s.dark!==undefined&&s.theme===undefined){s.theme=s.dark?'dark':'light';delete s.dark;}
  if(!s.theme)s.theme='system';
  applyTheme(s.theme);
  applyAccentCSS(s.accent);
  document.getElementById('cp').value=s.accent;
  document.querySelectorAll('.swatch').forEach(sw=>sw.classList.toggle('on',sw.dataset.c===s.accent));
  document.documentElement.style.setProperty('--font',s.font);
  const fs=document.getElementById('font-sel');
  for(let i=0;i<fs.options.length;i++){if(fs.options[i].value===s.font){fs.selectedIndex=i;break;}}
  document.documentElement.style.setProperty('--fs',s.fontSize+'px');
  document.documentElement.style.fontSize=s.fontSize+'px';
  const fsSel=document.getElementById('fs-sel');
  if(fsSel){let best=0,bd2=Infinity;for(let i=0;i<fsSel.options.length;i++){const d=Math.abs(parseInt(fsSel.options[i].value)-s.fontSize);if(d<bd2){bd2=d;best=i;}}fsSel.selectedIndex=best;}
  document.querySelectorAll('.radio-opt').forEach(r=>r.classList.toggle('on',r.dataset.m===s.dl));
}
function applyAccentCSS(c){
  const mt=document.getElementById('meta-theme-color');if(mt)mt.setAttribute('content',c);
  document.documentElement.style.setProperty('--accent',c);
  document.documentElement.style.setProperty('--accent-dk',shade(c,-22));
}
function shade(hex,pct){
  const n=parseInt(hex.slice(1),16),a=Math.round(2.55*pct);
  const R=clamp((n>>16)+a),G=clamp(((n>>8)&0xFF)+a),B=clamp((n&0xFF)+a);
  return '#'+(0x1000000+(R<<16)+(G<<8)+B).toString(16).slice(1);
}
function clamp(v){return Math.min(255,Math.max(0,v))}

function setAccent(c){
  st.settings.accent=c;applyAccentCSS(c);
  document.getElementById('cp').value=c;
  document.querySelectorAll('.swatch').forEach(sw=>sw.classList.toggle('on',sw.dataset.c===c));
  const mt=document.getElementById('meta-theme-color');if(mt)mt.setAttribute('content',c);
  save();
}
function setFont(v){st.settings.font=v;document.documentElement.style.setProperty('--font',v);save()}
function setFontSz(v){
  v=parseInt(v);st.settings.fontSize=v;
  document.documentElement.style.fontSize=v+'px';
  document.documentElement.style.setProperty('--fs',v+'px');
  const sel=document.getElementById('fs-sel');
  if(sel){let best=0,bd2=Infinity;for(let i=0;i<sel.options.length;i++){const d=Math.abs(parseInt(sel.options[i].value)-v);if(d<bd2){bd2=d;best=i;}}sel.selectedIndex=best;}
  save();
}
function setDLMethod(m){
  st.settings.dl=m;
  document.querySelectorAll('.radio-opt').forEach(r=>r.classList.toggle('on',r.dataset.m===m));
  save();
}
