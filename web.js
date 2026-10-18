// Marktkompass fürs Handy: ersetzt die claude.ai Schnittstellen durch dein n8n.
// Angebote, Filialen und die gemeinsame Einkaufsliste kommen aus n8n, nur mit dem Schlüssel im Link.
(function(){
  const API="https://kaneda16.app.n8n.cloud/webhook/";
  const qs=new URLSearchParams(location.search);
  let K=qs.get("k")||"";
  try{if(K)localStorage.setItem("mk_k",K);else K=localStorage.getItem("mk_k")||""}catch(e){}
  window.MK_WEB=true;
  document.documentElement.classList.add("mkweb");

  let DATA=null,loading=null,lastFetch=0;
  function fetchData(force){
    if(force)loading=null;
    if(!loading){
      if(!K)return Promise.reject({code:"kein_schluessel"});
      loading=fetch(API+"marktkompass-daten?k="+encodeURIComponent(K),{cache:"no-store"})
        .then(r=>{if(!r.ok)throw{code:"http_"+r.status};return r.text()})
        .then(t=>{if(!t)throw{code:"kein_zugriff"};const d=JSON.parse(t);DATA=d;lastFetch=Date.now();return d})
        .catch(e=>{loading=null;throw e});
    }
    return loading;
  }

  // Gemeinsame Daten: haushalt/einkauf, haushalt/gerichte, einstellungen/auswahl
  const shared=p=>{const a=p.split("/");return a.length===2&&(a[0]==="haushalt"||a[0]==="einstellungen")?a[1]:null};
  const local=p=>{try{return JSON.parse(localStorage.getItem("mkdb:"+p)||"null")}catch(e){return null}};
  const snapOf=(p,d)=>({id:p.split("/").pop(),exists:d!=null,data:()=>d==null?undefined:d,metadata:{fromCache:false,hasPendingWrites:false}});
  function read(p){
    const n=shared(p);
    if(n){const s=DATA&&DATA.state&&DATA.state[n];return s?{v:s.v,updated:s.updated}:null}
    if(p.indexOf("snap/")===0||p.indexOf("feedback")===0)return null;
    return local(p);
  }
  const subs={},pending={};
  const fire=p=>(subs[p]||[]).forEach(f=>{try{f()}catch(e){}});
  function post(obj){
    return fetch(API+"marktkompass-speichern?k="+encodeURIComponent(K),{method:"POST",body:new URLSearchParams({d:JSON.stringify(obj)})})
      .then(r=>r.json()).catch(()=>({ok:false}));
  }
  async function write(p,data){
    const n=shared(p);
    if(n){
      DATA=DATA||{state:{}};DATA.state=DATA.state||{};DATA.state[n]={v:data.v,updated:data.updated};
      // schnelle Änderungen hintereinander werden zu einer Speicherung zusammengefasst
      clearTimeout(pending[n]);
      pending[n]=setTimeout(()=>{delete pending[n];post({t:"set",name:n,value:data.v})},1500);
      return;
    }
    if(p.indexOf("snap/")===0||p.indexOf("feedback")===0)return;
    try{localStorage.setItem("mkdb:"+p,JSON.stringify(data))}catch(e){}
  }
  function docRef(p){
    return{id:p.split("/").pop(),path:p,
      get:async()=>{if(shared(p))await fetchData().catch(()=>{});return snapOf(p,read(p))},
      set:d=>write(p,JSON.parse(JSON.stringify(d))),
      update:d=>write(p,Object.assign({},read(p)||{},JSON.parse(JSON.stringify(d)))),
      delete:async()=>{try{localStorage.removeItem("mkdb:"+p)}catch(e){}},
      onSnapshot:next=>{(subs[p]=subs[p]||[]).push(()=>next(snapOf(p,read(p))));return()=>{}},
      collection:c=>colRef(p+"/"+c)};
  }
  function fbSnap(){
    const list=(DATA&&DATA.feedback)||[];
    const docs=list.map(f=>({id:String(f.id),exists:true,data:()=>({text:f.text,at:f.at,done:!!f.done}),metadata:{fromCache:false,hasPendingWrites:false}}));
    return{docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{fromCache:false,hasPendingWrites:false}};
  }
  function colRef(c){
    const q={path:c,
      doc:id=>docRef(c+"/"+(id||Math.random().toString(36).slice(2))),
      add:async d=>{
        if(c==="feedback"){const r=await post({t:"feedback",text:String(d.text||"")});if(!r||!r.ok)throw{code:"unavailable"}}
        return docRef(c+"/neu");
      },
      where:()=>q,orderBy:()=>q,limit:()=>q,
      get:async()=>c==="feedback"?fbSnap():{docs:[],size:0,empty:true,docChanges:()=>[]},
      onSnapshot:next=>{if(c==="feedback"){const f=()=>next(fbSnap());(subs["feedback"]=subs["feedback"]||[]).push(f);fetchData().then(f,()=>{})}return()=>{}}};
    return q;
  }
  const db={doc:docRef,collection:c=>colRef(c)};

  const user={
    id:async()=>{const d=await fetchData().catch(()=>null);return d?"web-"+d.role:null},
    isOwner:async()=>{const d=await fetchData().catch(()=>null);return !!(d&&d.role==="owner")},
    canEdit:async()=>false,can:async()=>null,me:async()=>({id:null,name:""})
  };

  // Angebote wie aus der n8n-Tabelle, aber aus der einen Antwort beim Öffnen
  const mcp={callTool:async(server,tool,args)=>{
    const d=await fetchData();
    if(args&&args.dataTableId==="gpHgwxl28FCSe6wP")return{payload:{rows:d.fils||[],count:(d.fils||[]).length}};
    const all=d.rows||[],skip=args.skip||0,lim=args.limit||100;
    return{payload:{rows:all.slice(skip,skip+lim),count:all.length}};
  }};

  // Reiter Prüfen: nur mit dem Besitzer-Link
  window.MK_PRUEF={
    get:async()=>{const d=await fetchData();return d&&d.role==="owner"?(d.pruefen||{items:[],at:""}):null},
    decide:async(x,e)=>{const r=await post({t:"pruefen",pkey:x.k,entscheid:e,product:x.p,art:x.a});return !!(r&&r.ok)}
  };

  // Neue Bausteine (Essen, Kassenbons, Vorrat) vorerst nur im Besitzer-Link
  window.MK_ESSEN={
    get:async()=>{const d=await fetchData();return d&&d.role==="owner"?{meals:d.meals||[],role:d.role}:null},
    add:async o=>{const r=await post({t:"essen",...o});return r&&r.ok?r.meal:null},
    del:async id=>{const r=await post({t:"essen_del",id});return !!(r&&r.ok)}
  };

  // Kassenbons: beide Links dürfen fotografieren
  window.MK_BON={
    get:async()=>{const d=await fetchData();return d&&d.role==="owner"?(d.bons||[]):null},
    add:async foto=>post({t:"bon",foto}),
    del:async id=>{const r=await post({t:"bon_del",id});return !!(r&&r.ok)},
    assign:async o=>{const r=await post({t:"bonzeile",...o});return !!(r&&r.ok)}
  };

  // Artikel-Infos: Kategorien, für wen, Verarbeitung (nur Besitzer)
  window.MK_ART={
    get:async()=>{const d=await fetchData();return d&&d.role==="owner"?(d.artikelinfo||[]):null},
    set:async o=>{const r=await post({t:"artikelinfo",...o});return !!(r&&r.ok)}
  };

  // Vorrat: gemeinsamer Zustand (leer markiert, von Hand ergänzt)
  window.MK_VORRAT={
    get:async()=>{const d=await fetchData();if(!d||d.role!=="owner")throw 0;return d.state&&d.state.vorrat?d.state.vorrat.v:null},
    set:async v=>post({t:"set",name:"vorrat",value:v})
  };

  window.claude={use:async k=>k==="db"?db:k==="user"?user:k==="mcp"?mcp:null};

  // Beim Zurückkehren in die App die Liste des anderen nachladen (höchstens alle 30 Sekunden)
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState!=="visible"||!K||Date.now()-lastFetch<30000||Object.keys(pending).length)return;
    fetchData(true).then(()=>{Object.keys(subs).forEach(fire)},()=>{});
  });
  // Ungespeichertes beim Schließen noch losschicken
  window.addEventListener("pagehide",()=>{
    for(const n of Object.keys(pending)){clearTimeout(pending[n]);const s=DATA&&DATA.state&&DATA.state[n];
      if(s)try{navigator.sendBeacon(API+"marktkompass-speichern?k="+encodeURIComponent(K),new URLSearchParams({d:JSON.stringify({t:"set",name:n,value:s.v})}))}catch(e){}}
  });

  if(!K)document.addEventListener("DOMContentLoaded",()=>{const m=document.getElementById("msg");if(m){m.hidden=false;m.className="notice err";m.innerHTML="<strong>Dieser Link ist unvollständig.</strong> Öffne die App über den Link mit Schlüssel, den du bekommen hast."}});
})();
