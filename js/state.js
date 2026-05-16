// ────────────────────────────────────────
// STATE
// ────────────────────────────────────────
let st = {cats:[],orders:[],quantities:[],settings:{...DEF_SETTINGS}};
let calV = {y:new Date().getFullYear(),m:new Date().getMonth()};
let draft = {date:null,items:{}}; // items: id->{qty,unit,iname,cname}
let editIid = null;       // item being edited in qty sheet
let editingOrdId = null;  // order being edited
let ordSearch = '';       // search query within sh-ord
let logActiveCard = null; // log card in long-press action mode
let lpTimer = null;
const accOpen = new Set(); // tracks which category accordions are expanded

function save(){localStorage.setItem(SK,JSON.stringify(st))}
function load(){
  try{
    const d=localStorage.getItem(SK);
    if(d){
      const p=JSON.parse(d);
      st.cats=p.cats&&p.cats.length?p.cats:JSON.parse(JSON.stringify(DEF_CATS));
      st.orders=p.orders||[];
      st.quantities=p.quantities&&p.quantities.length?p.quantities:JSON.parse(JSON.stringify(DEF_QUANTITIES));
      st.settings={...DEF_SETTINGS,...(p.settings||{})};
    }else{
      st.cats=JSON.parse(JSON.stringify(DEF_CATS));
      st.quantities=JSON.parse(JSON.stringify(DEF_QUANTITIES));
    }
  }catch(e){
    st.cats=JSON.parse(JSON.stringify(DEF_CATS));
    st.quantities=JSON.parse(JSON.stringify(DEF_QUANTITIES));
  }
}
