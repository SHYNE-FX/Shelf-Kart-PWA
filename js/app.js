// ────────────────────────────────────────
// INIT
// ────────────────────────────────────────
function init(){
  load();
  applySettings();
  buildCalSelects();
  renderCal();
  renderLog();
  buildQtyUnit();
  initCtx();
}

// ────────────────────────────────────────
// EVENT LISTENERS (replaces inline handlers)
// ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Calendar
  document.querySelector('.cal-today').addEventListener('click', goToday);
  document.getElementById('cal-ms').addEventListener('change', onCalM);
  document.getElementById('cal-ys').addEventListener('change', onCalY);
  const calNbs = document.querySelectorAll('.cal-nb');
  calNbs[0].addEventListener('click', () => calNav(-1));
  calNbs[1].addEventListener('click', () => calNav(1));

  // Search
  document.getElementById('srch-in').addEventListener('input', function(){ doSearch(this.value) });

  // FAB
  document.getElementById('fab').addEventListener('click', () => openOrder(null));

  // Bottom nav
  document.querySelectorAll('.nbtn').forEach(btn => {
    btn.addEventListener('click', () => showScr(btn.dataset.s));
  });

  // Backdrops
  document.getElementById('bd-cfm').addEventListener('click', closeCfm);
  document.getElementById('bd-qty').addEventListener('click', closeQty);
  document.getElementById('bd-ctx').addEventListener('click', closeCtx);
  document.getElementById('bd-sort').addEventListener('click', closeSort);
  document.getElementById('bd-ord-det').addEventListener('click', closeOrdDetail);

  // Order page
  document.getElementById('ord-back-btn').addEventListener('click', closeOrder);
  document.getElementById('ord-sort-btn').addEventListener('click', openSort);
  document.getElementById('ord-clear-btn').addEventListener('click', clearDraft);
  document.getElementById('ord-srch-in').addEventListener('input', function(){ setOrdSearch(this.value) });
  document.getElementById('ord-srch-clr').addEventListener('click', clearOrdSearch);
  document.getElementById('ord-foot-back').addEventListener('click', closeOrder);
  document.getElementById('ord-foot-cart').addEventListener('click', openCfm);

  // Confirm sheet
  document.getElementById('cfm-cancel-btn').addEventListener('click', closeCfm);
  document.getElementById('cfm-save-btn').addEventListener('click', () => createOrd(false));

  // Qty sheet
  document.getElementById('qty-confirm-btn').addEventListener('click', confirmQty);
  document.getElementById('qty-delete-btn').addEventListener('click', deleteQty);
  document.getElementById('qty-num').addEventListener('input', function(){ syncQtyWidth(this) });

  // Context menu items
  document.querySelectorAll('.ctx-item').forEach(btn => {
    btn.addEventListener('click', () => ctxNav(btn.dataset.nav));
  });

  // Sort sheet close
  document.getElementById('ord-det-close-btn').addEventListener('click', closeOrdDetail);
  document.getElementById('ord-det-edit-btn').addEventListener('click', editFromDetail);

  // Settings – theme
  document.querySelectorAll('.tseg-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.t));
  });

  // Settings – swatches
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => setAccent(sw.dataset.c));
  });

  // Settings – color picker
  document.getElementById('cp').addEventListener('input', function(){ setAccent(this.value) });

  // Settings – font
  document.getElementById('font-sel').addEventListener('change', function(){ setFont(this.value) });

  // Settings – font size
  document.getElementById('fs-sel').addEventListener('change', function(){ setFontSz(this.value) });

  // Settings – download radios
  document.querySelectorAll('.radio-opt').forEach(r => {
    r.addEventListener('click', () => setDLMethod(r.dataset.m));
  });

  // Edit tabs
  document.querySelectorAll('.etab').forEach(tab => {
    tab.addEventListener('click', () => switchETab(tab.dataset.tab));
  });

  // Edit – add category
  document.getElementById('btn-add-cat').addEventListener('click', addCat);
  document.getElementById('new-cat').addEventListener('keydown', e => { if(e.key==='Enter') addCat() });

  // Edit – category select
  document.getElementById('ecat-sel').addEventListener('change', renderEItems);

  // Edit – add item
  document.getElementById('btn-add-item').addEventListener('click', addItem);
  document.getElementById('new-item').addEventListener('keydown', e => { if(e.key==='Enter') addItem() });

  // Edit – add quantity
  document.getElementById('btn-add-qty').addEventListener('click', addQty);
  document.getElementById('new-qty').addEventListener('keydown', e => { if(e.key==='Enter') addQty() });

  // Global Escape key
  document.addEventListener('keydown', e => {
    if(e.key==='Escape'){
      if(document.getElementById('sh-qty').classList.contains('on')) closeQty();
      else if(document.getElementById('sh-cfm').classList.contains('on')) closeCfm();
      else if(document.getElementById('sh-ord').classList.contains('on')) closeOrder();
    }
  });
});

// ────────────────────────────────────────
// SERVICE WORKER
// ────────────────────────────────────────
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ────────────────────────────────────────
// START
// ────────────────────────────────────────
init();
