// Sparhebel (nur Besitzer): alle Hebel an einem Ort, mit echten Zahlen aus Bons, Angeboten und Vorrat
(function(){
const DOC="https://claude.ai/code/artifact/09ff474a-0cd1-449c-8c26-830dc1d3641d";
const PROG={"Lidl":["Lidl Plus","App-Coupons vor dem Einkauf aktivieren"],"Kaufland":["Kaufland Card","Rabatte und Coupons in der App"],"REWE":["REWE Bonus","Bonus-Guthaben für den nächsten Einkauf"],"PENNY":["PENNY App","App-Coupons und App-Preise"],
  "EDEKA":["Payback","Karte scannen, Coupons aktivieren"],"Netto Marken-Discount":["Payback","Karte scannen, Coupons aktivieren"],"dm":["Payback","Karte scannen, Coupons aktivieren"],"ALDI SÜD":["kein Programm","einfach günstig kaufen"]};
const kgOf=r=>r.unit==="kg"&&r.refPrice>0?r.refPrice:null;
function enteNow(){
  const now=new Date(),out={ganz:[],teile:[]};
  for(const r of rows){if(r.kind!=="angebot"||status(r,now)==="exp")continue;
    const t=(r.product+" "+r.description).toLowerCase();if(!/\bente\b|entenbrust|entenkeule|barbarie/.test(t))continue;
    const k=kgOf(r);if(!k)continue;(/brust|keule|schenkel|filet/.test(t)?out.teile:out.ganz).push(r)}
  const s=a=>a.sort((x,y)=>x.refPrice-y.refPrice).slice(0,3);return {ganz:s(out.ganz),teile:s(out.teile)}}
function card(cls,t,sum,body,open){return `<details class="sh ${cls}"${open?" open":""}><summary><span class="sht">${t}</span><span class="shs">${sum}</span></summary><div class="shb">${body}</div></details>`}
window.renderSpar=function(){
  const el=document.getElementById("sparv");if(!el)return;
  const now=new Date(),ym=isoDay(0).slice(0,7);
  // Bons dieses Monats
  const bm=(bons.list||[]).filter(b=>String(b.datum).startsWith(ym));
  const aus=bm.reduce((s,b)=>s+(+b.summe||0),0);
  const rab=bm.reduce((s,b)=>s+b.zeilen.reduce((t,z)=>t+(z.typ==="rabatt"?Math.abs(+z.preis||0):(+z.rabatt||0)),0),0);
  const save=Math.min(15,aus*0.01);
  const proL={};for(const b of bm){proL[b.laden]=(proL[b.laden]||0)+(+b.summe||0)}
  // Angebote, die sich gerade lohnen
  let top=[];try{top=steals(rows.map(r=>({...r,st:status(r,now)})).filter(r=>r.st!=="exp"&&baseOk(r,now)))}catch(e){}
  const tsum=top.slice(0,10).reduce((s,x)=>s+x.save,0);
  // Vorrat
  let si=[];try{si=vorrat.on?stockItems():[]}catch(e){}
  const bald=si.filter(x=>x.ort==="kueche"&&x.state!=="ok"),tk=si.filter(x=>x.ort==="tk");
  const reste=(dishes||[]).filter(d=>d.reste);
  const E=enteNow();
  const eRow=r=>`<li>${logo(r.retailer)} ${esc(r.product)} <b>${eur(r.refPrice)}/kg</b> <small>${eur(r.price)}</small></li>`;
  el.innerHTML=`<div class="ehead"><div><h2>Sparhebel</h2><p class="hint">Alle Wege, beim Einkauf Geld zu sparen, mit euren echten Zahlen. Die großen Hebel stehen oben.</p></div></div>
  <div class="shtop"><div><small>Ausgegeben im ${now.toLocaleDateString("de-DE",{month:"long"})}</small><b>${eur(aus)}</b><small>${bm.length} Bons</small></div>
    <div><small>Rabatte auf Bons</small><b>${eur(rab)}</b></div><div><small>Saveback, 1 %</small><b>${eur(save)}</b><small>höchstens 15 €</small></div></div>
  ${card("big","1. Planen nach Angeboten",top.length?`${top.length} lohnen sich, bis ${eur(tsum)}`:"gerade nichts Besonderes",
    `<p>Lieblingsgerichte dann kochen, wenn die Hauptzutat im Angebot ist. Das bringt grob 10 bis 20 %.</p>
    ${top.length?`<ul class="shl">${top.slice(0,5).map(x=>`<li>${logo(x.r.retailer)} <span class="aopen" data-art="${esc(x.r.art||x.r.product)}">${esc(x.r.product)}</span> <b>−${Math.round(x.d*100)} %</b> <small>spart ${eur(x.save)}</small></li>`).join("")}</ul>`:""}
    <button type="button" class="sbtn" data-go="deals">Alle Angebote</button>`,true)}
  ${card("big","2. Ganzes Tier kaufen und zerlegen","etwa 30 % pro Kilo Fleisch",
    `<p>Eine ganze Ente kostete bei Kaufland 11,53 €, bei etwa 2,2 kg rund 5,20 € pro Kilo. Davon sind etwa 1,2 kg Brust und Keulen.</p>
    <table class="sht2"><tr><td>Zerlegt, pro Kilo Brust und Keule</td><td><b>≈ 9,60 €</b></td></tr><tr><td>Dieselben Teile einzeln</td><td>≈ 13,50 €</td></tr><tr><td>Karkasse und Fett</td><td>gratis</td></tr></table>
    <p>Brust und Keulen portioniert in den Tiefkühler, die Reste werden zu Knuspriger Ente im Pita. Ausnahme: Entenbrust im Angebot um 9,90 € pro Kilo ist so günstig wie zerlegt. Gilt genauso für ganzes Huhn.</p>
    ${E.ganz.length||E.teile.length?`<p class="shsub">Gerade im Angebot</p><ul class="shl">${E.ganz.map(eRow).join("")}${E.teile.map(eRow).join("")}</ul>`:""}`)}
  ${card("big","3. Nichts wegwerfen",vorrat.on?`${bald.length} bald verbrauchen, ${tk.length} im Tiefkühler`:"Vorrat",
    `<p>Was bald weg muss, kommt zuerst auf den Teller. Reste bekommen ein festes Gericht.</p>
    ${bald.length?`<ul class="shl">${bald.slice(0,5).map(x=>`<li><span class="aopen" data-art="${esc(x.art||x.name)}">${esc(x.name)}</span> <small>bis ${esc(dShort(x.bis))}</small></li>`).join("")}</ul>`:""}
    ${reste.length?`<p class="shsub">Reste-Gerichte</p><ul class="shl">${reste.map(d=>`<li>${esc(d.name)} <small>aus ${esc(d.reste)}</small></li>`).join("")}</ul>`:""}
    <button type="button" class="sbtn" data-go="vorrat">Zum Vorrat</button>`)}
  ${card("","4. Vorrat zum Tiefpreis","5 bis 10 %",`<p>Haltbares (Nüsse, Linsen, Haferflocken) und Einfrierbares (Fleisch, Fisch, Brot) kaufen, wenn es unter eurem üblichen Preis liegt. Nur so viel, wie in Kammer und Tiefkühler passt.</p>`)}
  ${card("","5. Richtiger Laden","5 bis 15 %",`<p>Pro Woche ein bis zwei Läden mit dem besten Gesamtpreis für eure Liste, ein Umweg nur, wenn er sich lohnt.</p>
    ${Object.keys(proL).length?`<p class="shsub">Diesen Monat</p><ul class="shl">${Object.entries(proL).sort((a,b)=>b[1]-a[1]).map(([l,s])=>`<li>${logo(l)} <b>${eur(s)}</b></li>`).join("")}</ul>`:""}`)}
  ${card("","6. Kundenkarten und Apps","1 bis 3 %",`<ul class="shl">${Object.entries(PROG).map(([l,[p,h]])=>`<li>${logo(l)} <b>${esc(p)}</b> <small>${esc(h)}</small></li>`).join("")}</ul><p>Erst die Karte scannen, dann mit der Trade Republic Karte zahlen. Beides zählt.</p>`)}
  ${card("","7. Saveback der Trade Republic Karte",`${eur(save)} diesen Monat`,`<p>1 % auf Kartenzahlungen, höchstens 15 € im Monat. Nur mit aktivem Sparplan ab 50 € im Monat, und nur direkt mit der Karte, nicht über PayPal.</p>`)}
  ${card("","8. Cashback nach dem Einkauf","wenige Euro im Monat",`<p>marktguru zahlt für einzelne Produkte 0,50 € bis 1,50 € zurück, wenn ihr den Bon einreicht. Lohnt sich nur für Produkte, die ihr ohnehin kauft.</p>`)}
  <p class="hint"><a href="${DOC}" target="_blank" rel="noopener">Ganzes Sparkonzept mit Quellen</a></p>`;
};
document.addEventListener("click",e=>{const b=e.target.closest("#sparv [data-go]");if(!b)return;
  const t=document.querySelector(`.views [data-v="${b.dataset.go}"]`);if(t)t.click()});
})();
