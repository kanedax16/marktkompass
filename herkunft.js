// Herkunft je Artikel: Pixelbild der Pflanze oder des Tiers, das gegessene Teil rot umrandet, dazu ein Satz zum Lernen.
// Pflanzen und Tiere werden aus einfachen Formen gezeichnet. Das Rind kommt aus COW in app.js.
(function(){
const W=64,H=46;
const K={ink:"#1b221d",leaf:"#5d9a3c",leafD:"#3f7228",leafL:"#86bf55",cit:"#2f6b2a",citD:"#1f4e1d",olive:"#8aa37a",oliveD:"#6b8560",
  bark:"#7a5232",barkD:"#5a3a20",soil:"#8a6a48",soilD:"#6d5236",soilL:"#a3825d",grass:"#7bb046",grassD:"#5f9236",hi:"#e0473a",hiD:"#a8291f",
  water:"#9cc9e3",waterD:"#7fb3d3",seam:"#cdbfa8",post:"#9b7a55",wire:"#b8b0a2",white:"#f6f1e6"};
const hash=(x,y,s=0)=>{let h=(x*374761393+y*668265263+s*1442695041)|0;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)%100};
const tex=(a,b,c,p1=25,p2=15)=>(x,y)=>{const r=hash(x,y);return r<p1?b:r<p1+p2?c:a};
const leafy=tex(K.leaf,K.leafD,K.leafL),citrus=tex(K.cit,K.citD,K.leaf),olivy=tex(K.olive,K.oliveD,K.leafL),soily=tex(K.soil,K.soilD,K.soilL,18,8);
function Grid(){this.c=new Array(W*H).fill(null);this.e=new Uint8Array(W*H);this.r=new Array(W*H).fill("")}
Grid.prototype.set=function(x,y,c,e,r){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=W||y>=H||c==null)return;const i=y*W+x;this.c[i]=typeof c==="function"?c(x,y):c;this.e[i]=e?1:0;this.r[i]=r||""};
Grid.prototype.ell=function(cx,cy,rx,ry,c,e,r){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)this.set(x,y,c,e,r)};
Grid.prototype.rect=function(x0,y0,w,h,c,e,r){for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)this.set(x,y,c,e,r)};
Grid.prototype.line=function(x0,y0,x1,y1,c,e,t,r){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;if(!t||t<=1)this.set(x,y,c,e,r);else this.ell(x,y,t/2,t/2,c,e,r)}};
Grid.prototype.poly=function(P,c,e,r){const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);
  for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++)for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++){
    let ins=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>y+.5)!==(yj>y+.5)&&x+.5<(xj-xi)*(y+.5-yi)/(yj-yi)+xi)ins=!ins}
    if(ins)this.set(x,y,c,e,r)}};
Grid.prototype.dot=function(x,y,c){this.set(x,y,c,this.e[Math.round(y)*W+Math.round(x)],this.r[Math.round(y)*W+Math.round(x)])};
// Boden und Himmel
const ground=g=>{g.rect(0,42,W,4,(x,y)=>y===42?(hash(x,y)<30?K.grassD:K.grass):soily(x,y))};
const soilBand=(g,top)=>{g.rect(0,top,W,H-top,(x,y)=>y===top?(hash(x,y)<30?K.grassD:K.grass):soily(x,y))};
// Bild als SVG; Kanten dunkel, gegessene Teile rot umrandet, Schnittlinien bei Tieren
function svg(g,label){const at=(x,y)=>x<0||x>=W||y>=H?"#":y<0?null:g.c[y*W+x];let o="";
  const nb=[[1,0],[-1,0],[0,1],[0,-1]],E=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g.e[y*W+x];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,c=g.c[i];
    // Pflanzen: rote Umrandung außen um das, was man isst, damit die Farbe der Frucht bleibt
    if(!g.fill){if(!g.e[i]&&nb.some(([a,b])=>E(x+a,y+b))){o+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${K.hi}"/>`;continue}
      if(!c)continue;let col=c;if(!g.e[i]&&nb.some(([a,b])=>!at(x+a,y+b)))col=K.ink;else if(g.e[i]&&nb.some(([a,b])=>!at(x+a,y+b)&&!E(x+a,y+b)))col=c;
      o+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${col}"/>`;continue}
    if(!c)continue;let col=c;
    if(g.e[i]&&nb.some(([a,b])=>{const xx=x+a,yy=y+b;return xx>=0&&yy>=0&&xx<W&&yy<H&&!g.e[yy*W+xx]}))col=K.hi;
    else if(nb.some(([a,b])=>!at(x+a,y+b)))col=K.ink;
    else if(g.r[i]&&nb.slice(0,3).some(([a,b])=>{const xx=x+a,yy=y+b;return xx<W&&yy<H&&g.c[yy*W+xx]&&g.r[yy*W+xx]&&g.r[yy*W+xx]!==g.r[i]}))col=g.e[i]?K.hiD:K.seam;
    o+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${col}"/>`}
  return `<svg class="cow" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" role="img" aria-label="${label||""}">${o}</svg>`}

// ===== Pflanzen =====
const FR={round:(g,x,y,c,r)=>{g.ell(x,y,r,r,c,1);g.dot(x-r/2,y-r/2,"#ffffff99")},
  pear:(g,x,y,c,r)=>{g.ell(x,y+1,r+.3,r,c,1);g.ell(x,y-1,r*.6,r*.7,c,1)},
  long:(g,x,y,c,r)=>{g.ell(x,y,r*.8,r*1.4,c,1)},
  cherry:(g,x,y,c)=>{g.line(x,y-2,x-1,y,K.leafD);g.line(x,y-2,x+2,y,K.leafD);g.ell(x-1,y+1,1,1,c,1);g.ell(x+2,y+1,1,1,c,1)}};
function tree(o){const g=new Grid();ground(g);
  g.rect(29,25,6,17,(x,y)=>x>=33?K.barkD:K.bark);g.line(31,28,22,19,K.bark,0,2.2);g.line(33,27,42,19,K.bark,0,2.2);
  const lf=o.leaf==="citrus"?citrus:o.leaf==="olive"?olivy:leafy;
  g.ell(32,15,18,11,lf);g.ell(19,19,9,7,lf);g.ell(45,19,9,7,lf);g.ell(32,8,10,6,lf);
  const P=[[24,13],[31,9],[39,12],[45,18],[19,19],[33,18],[26,21],[40,22],[36,5],[14,17],[50,16],[29,15]];
  P.slice(0,o.n||9).forEach(([x,y])=>(FR[o.shape||"round"])(g,x,y,o.fruit,o.r||1.6));return g}
function bush(o){const g=new Grid();ground(g);g.line(30,42,26,34,K.bark);g.line(33,42,37,33,K.bark);
  g.ell(32,31,19,10,leafy);g.ell(20,35,9,6,leafy);g.ell(44,35,9,6,leafy);g.ell(32,24,10,5,leafy);
  const P=[[22,28],[30,25],[40,27],[46,33],[18,35],[27,33],[36,31],[33,37],[42,37],[24,38]];
  P.slice(0,o.n||9).forEach(([x,y])=>{if(o.husk){g.ell(x,y,1.8,1.8,K.leafL,1);g.ell(x,y+.8,1.2,1.2,o.fruit,1)}else{g.set(x,y,o.fruit,1);g.set(x+1,y,o.fruit,1);g.set(x,y+1,o.fruit,1);g.set(x+1,y+1,o.fruit,1);g.set(x+1,y+2,o.fruit,1);g.set(x,y,"#ffffff88",1)}});return g}
function stake(o){const g=new Grid();ground(g);g.rect(31,4,2,38,K.post);
  for(let y=40;y>8;y--)g.set(32+Math.round(Math.sin(y/3)*1.5),y,K.leafD);
  [[24,10],[40,14],[23,20],[41,24],[24,30],[40,34],[30,6]].forEach(([x,y],i)=>g.ell(x,y,6,3,leafy));
  const F=o.fruits||[[26,15],[37,19],[27,25],[38,29],[28,35]];
  F.forEach(([x,y])=>{if(o.shape==="block"){g.ell(x,y,2.5,3,o.fruit,1);g.set(x,y-3,K.leafD)}else if(o.shape==="long"){g.ell(x,y+1,1.8,4,o.fruit,1);g.rect(x-1,y-3,3,1,K.leafD)}
    else if(o.shape==="small"){[[0,0],[3,1],[-3,1],[1,3],[-2,4],[2,5]].forEach(([dx,dy])=>{g.ell(x+dx,y+dy,1.3,1.3,o.fruit,1)});g.line(x-3,y-1,x+3,y-1,K.leafD)}
    else if(o.shape==="chili"){g.line(x,y-2,x+1,y+4,o.fruit,1,1.6)}else{g.ell(x,y,2.4,2.2,o.fruit,1);g.set(x,y-2,K.leafD)}});return g}
function climb(o){const g=new Grid();ground(g);g.rect(12,4,2,38,K.post);g.rect(50,4,2,38,K.post);[8,18,28].forEach(y=>g.line(13,y,51,y,K.wire));
  for(let x=16;x<50;x+=6){const y=[8,18,28][(x/6|0)%3];g.line(x,42,x+2,y,K.leaf,0,1.6)}
  [[18,8],[26,7],[34,9],[44,8],[16,18],[30,17],[40,19],[22,28],[36,27],[46,28],[24,13],[42,14]].forEach(([x,y])=>{g.ell(x,y,3.4,2.6,leafy);g.set(x,y,K.leafD)});
  const F=[[21,11],[33,12],[45,12],[25,21],[38,22],[29,31],[43,31],[17,31]];
  F.slice(0,o.n||7).forEach(([x,y])=>{if(o.shape==="cuke"){g.ell(x,y+3,1.6,4.5,o.fruit,1);g.dot(x,y+2,K.leafL);g.dot(x,y+5,K.leafL)}
    else if(o.shape==="pod"){g.line(x,y,x+1,y+6,o.fruit,1,1.5)}
    else if(o.shape==="grape"){[[0,0],[2,0],[-2,0],[1,2],[-1,2],[0,4],[2,2],[-2,2]].forEach(([a,b])=>g.ell(x+a,y+1+b,1,1,o.fruit,1))}
    else{g.ell(x,y+2,2,2.6,o.fruit,1)}});return g}
function sprawl(o){const g=new Grid();ground(g);
  [[14,34],[24,30],[40,30],[50,34],[30,36],[8,38],[56,38]].forEach(([x,y])=>{g.ell(x,y,6,4,leafy);g.set(x,y,K.leafD)});g.line(4,40,60,39,K.leafD);
  if(o.shape==="zucchini"){g.ell(24,38,6,2,o.fruit,1);g.ell(40,39,5,1.8,o.fruit,1)}
  else{const rx=o.r||8;g.ell(32,40-rx*.75,rx,rx*.75,o.fruit,1);if(o.rib)for(let k=-2;k<=2;k++)g.line(32+k*rx/3,40-rx*1.4,32+k*rx/2.6,40,o.rib,1);
    if(o.stripe)for(let k=-3;k<=3;k++)g.line(32+k*rx/4,40-rx*1.4,32+k*rx/3.5,40,o.stripe,1);g.rect(31,40-rx*1.5,2,2,K.leafD)}
  return g}
function strawberry(){const g=new Grid();ground(g);
  [[20,32],[28,28],[36,28],[44,32],[32,34],[24,36],[40,36]].forEach(([x,y])=>{g.ell(x,y,4,3,leafy);g.set(x,y,K.leafD)});
  [[16,39],[47,39],[28,40],[38,40]].forEach(([x,y])=>{g.line(x,y-6,x,y-2,K.leafD);g.ell(x,y,2.2,2.5,"#d7263d",1);g.dot(x-1,y,"#ffd84a");g.dot(x+1,y+1,"#ffd84a");g.dot(x,y-2,K.leafD)});
  g.ell(32,23,1.5,1.5,K.white);g.dot(32,23,"#ffd84a");return g}
function head(o){const g=new Grid();ground(g);
  if(o.type==="sprout"){g.rect(31,8,3,34,K.leafL);for(let y=12;y<40;y+=4){g.ell(28,y,1.8,1.8,K.leaf,1);g.ell(36,y+2,1.8,1.8,K.leaf,1)}g.ell(32,6,7,4,leafy);return g}
  if(o.type==="kale"){for(let k=0;k<7;k++){const x=20+k*4;g.line(32,42,x,14+Math.abs(k-3)*3,K.leafD,1);g.ell(x,16+Math.abs(k-3)*3,4,6,tex(o.col,"#3d5f33",K.leafL,30,20),1)}return g}
  if(o.type==="flower"){[[18,34],[46,34],[22,26],[42,26]].forEach(([x,y])=>g.ell(x,y,8,5,leafy));g.rect(30,30,4,12,K.leafL,1);
    g.ell(32,28,11,7,o.col,1);for(let k=0;k<14;k++)g.ell(24+hash(k,1)%17,23+hash(k,2)%9,1.8,1.8,o.col2||K.leafD,1);return g}
  if(o.type==="rosette"){for(let k=0;k<11;k++){const a=-Math.PI*(k/10);g.ell(32+Math.cos(a)*10,40+Math.sin(a)*7,o.small?3:4,o.small?2:3,tex(o.col,K.leafD,K.leafL),1)}g.ell(32,38,6,4,tex(o.col,K.leafD,K.leafL),1);return g}
  [[16,36],[48,36],[20,30],[44,30]].forEach(([x,y])=>g.ell(x,y,8,5,leafy));
  g.ell(32,32,12,10,(x,y)=>{const r=hash(x,y);return r<20?o.colD||K.leafD:(Math.abs(x-32)%5===0?o.colD||K.leafD:o.col)},1);g.line(32,24,32,40,o.colD||K.leafD,1);return g}
function root(o){const g=new Grid();const top=o.top||24;soilBand(g,top);
  const t=o.type;
  if(t==="carrot"){for(let k=-3;k<=3;k++){g.line(32,top,32+k*3,top-14+Math.abs(k)*2,K.leaf,0,1.6);g.ell(32+k*3,top-14+Math.abs(k)*2,2.4,2,leafy)}g.poly([[28,top],[36,top],[33,top+18],[31,top+18]],o.col,1);for(let y=top+3;y<top+16;y+=4)g.dot(30,y,"#c56a1a");return g}
  if(t==="beet"||t==="radish"){[[-6,-10],[0,-14],[6,-10]].forEach(([a,b])=>{g.line(32,top,32+a,top+b,o.vein||K.leafD);g.ell(32+a,top+b,3.5,4,leafy)});
    const r=t==="beet"?6:3.5;g.ell(32,top+r*.6,r,r,o.col,1);g.line(32,top+r*1.6,32,top+r*1.6+5,o.tip||o.col,1);return g}
  if(t==="long"){[[-5,-10],[0,-13],[5,-10]].forEach(([a,b])=>{g.line(32,top,32+a,top+b,K.leafD);g.ell(32+a,top+b,3.5,4,leafy)});g.ell(32,top+8,3,10,o.col,1);return g}
  if(t==="tuber"){g.ell(32,top-8,14,7,leafy);g.ell(22,top-12,6,4,leafy);g.ell(42,top-12,6,4,leafy);[[26,top-16],[36,top-15]].forEach(([x,y])=>{g.ell(x,y,1.2,1.2,K.white);g.dot(x,y,"#ffd84a")});
    g.line(32,top,32,top+4,K.soilD);[[22,top+7],[32,top+11],[42,top+8],[27,top+16],[39,top+16]].forEach(([x,y])=>{g.line(32,top+3,x,y,K.soilD);g.ell(x,y,o.long?2.2:3,o.long?4:2.4,o.col,1)});return g}
  if(t==="bulb"){for(let k=-2;k<=2;k++)g.line(32+k,top,32+k*4,top-18+Math.abs(k)*3,K.leaf,0,2.6);g.ell(32,top+3,6,5.5,o.col,1);g.line(29,top+3,29,top+7,o.colD||"#c9a46a",1);g.line(35,top+3,35,top+7,o.colD||"#c9a46a",1);g.line(32,top+8,32,top+12,K.soilD);return g}
  if(t==="rhizome"){for(let k=0;k<4;k++)g.line(24+k*5,top,22+k*6,top-18,K.leaf,0,2.6);g.ell(24,top+6,5,3,o.col,1);g.ell(32,top+7,5,3,o.col,1);g.ell(40,top+6,4,3,o.col,1);g.ell(29,top+10,3,2,o.col,1);return g}
  if(t==="celery"){for(let k=-3;k<=3;k++){g.line(32,top-3,32+k*3,top-16,K.leafL,0,1.3);g.ell(32+k*3,top-17,2.5,2,leafy)}g.ell(32,top+1,8,6,o.col,1);return g}
  if(t==="kohlrabi"){for(let k=-2;k<=2;k++){g.line(32+k*2,top-6,32+k*6,top-18,K.leafD);g.ell(32+k*6,top-19,3,3,leafy)}g.ell(32,top-4,8,7,o.col,1);g.line(32,top+3,32,top+8,K.soilD);return g}
  if(t==="fennel"){for(let k=-2;k<=2;k++){g.line(32+k,top-6,32+k*5,top-20,K.leafL,0,2.2);g.ell(32+k*5,top-21,2.5,2,leafy)}g.ell(32,top-3,7,6,K.white,1);return g}
  if(t==="leek"){g.rect(30,top-12,5,top-10>0?12:12,K.white,1);g.rect(30,top,5,10,K.white,1);for(let k=-2;k<=2;k++)g.line(32,top-12,32+k*5,top-24,"#3f7a4a",1,1.6);return g}
  if(t==="asparagus"){[[22,9],[30,14],[38,11],[45,7]].forEach(([x,h])=>{g.rect(x,top-h,2,h+6,o.col,1);g.set(x,top-h-1,"#7a8f3a",1)});return g}
  if(t==="mushroom"){[[24,6,6],[38,8,8],[48,4,4]].forEach(([x,h,r])=>{g.rect(x-1,top-h,3,h,"#efe6d2",1);g.ell(x,top-h,r,r*.55,o.col,1);g.line(x-r+1,top-h+1,x+r-1,top-h+1,"#b08a68",1)});return g}
  return g}
function banana(){const g=new Grid();ground(g);g.rect(29,14,6,28,(x,y)=>hash(x,y)<30?"#6f7d3a":"#8a9a4a");
  [[-1,0],[1,0],[-.7,-.8],[.7,-.8]].forEach(([a,b])=>{for(let i=2;i<22;i++)g.ell(32+a*i,13+b*i*.7+Math.abs(a)*i*i*.03,2.6-i*.06,1.8,leafy)});
  g.line(31,16,27,20,"#6f7d3a",0,1.4);for(let k=0;k<4;k++)for(let j=0;j<3;j++)g.ell(23+j*2.6+k%2,19+k*3,1.2,2.4,"#f2cf3a",1);g.ell(27,33,1.8,2.6,"#7a2a4a");return g}
function pineapple(){const g=new Grid();ground(g);for(let k=-6;k<=6;k++)g.line(32,40,32+k*4,40-Math.max(4,14-Math.abs(k)*1.5),k%2?K.leafD:"#6e9a5a",0,1.4);
  g.ell(32,26,5,7,(x,y)=>(x+y)%3?"#d4a63a":"#9a7a28",1);for(let k=-2;k<=2;k++)g.line(32,19,32+k*2,13,"#4f7a3a",0,1.2);return g}
function grain(o){const g=new Grid();if(o.water){g.rect(0,38,W,8,(x,y)=>y===38?K.waterD:K.water)}else ground(g);
  for(let k=0;k<7;k++){const x=12+k*7,h=o.water?28:30;g.line(x,42,x+1,42-h,K.stem||"#a8a04a");
    if(o.oat){for(let j=0;j<5;j++){g.line(x+1,42-h+2+j*3,x+3,42-h+4+j*3,"#c9b26a");g.ell(x+3,42-h+5+j*3,1,1.4,o.col,1)}}
    else{for(let j=0;j<6;j++){g.set(x,42-h+j*1.3,o.col,1);g.set(x+2,42-h+j*1.3,o.col,1);g.set(x+1,42-h+j*1.3,o.col,1)}if(o.awn)g.line(x+1,42-h,x+1,42-h-4,o.col)}}return g}
function legume(o){const g=new Grid();ground(g);g.line(32,42,32,12,K.leafD);
  [[24,14],[40,16],[22,24],[42,26],[26,33],[38,34],[32,10]].forEach(([x,y])=>{g.ell(x,y,4,2.6,leafy);g.set(x,y,K.leafD)});
  [[27,19],[36,21],[28,28],[37,29]].forEach(([x,y])=>{if(o.round){g.ell(x,y+2,2,2.6,o.col,1)}else g.line(x,y,x+1,y+6,o.col,1,1.8)});return g}
function sunflower(){const g=new Grid();ground(g);g.line(32,42,32,14,K.leafD,0,2);[[25,30],[39,24],[26,20]].forEach(([x,y])=>g.ell(x,y,4,2.5,leafy));
  for(let k=0;k<16;k++){const a=k/16*Math.PI*2;g.ell(32+Math.cos(a)*7,10+Math.sin(a)*7,2,2,"#f2c230")}g.ell(32,10,5,5,(x,y)=>(x+y)%2?"#5a3d22":"#3d2a18",1);return g}
function raps(){const g=new Grid();ground(g);for(let k=0;k<9;k++){const x=8+k*6;g.line(x,42,x,16+hash(k,3)%8,K.leafD);g.ell(x,15+hash(k,3)%8,3,2.4,"#f4d33a");g.ell(x+1,24+hash(k,4)%6,.8,2.5,K.leaf,1)}return g}
function cacao(){const g=new Grid();ground(g);g.rect(28,8,7,34,(x,y)=>x>=32?K.barkD:K.bark);g.ell(32,6,22,7,leafy);
  [[25,18],[38,22],[26,30],[38,34]].forEach(([x,y])=>g.ell(x,y,2.4,4,"#c9792e",1));return g}
function cashew(){const g=tree({fruit:"#e8572f",n:0});[[24,14],[39,13],[33,19],[44,20],[20,20]].forEach(([x,y])=>{g.ell(x,y,1.8,2.2,"#f0a03a");g.ell(x,y+3,1.4,1.2,"#9a8a62",1)});return g}
function herb(){const g=new Grid();ground(g);g.rect(22,32,20,10,"#b86b45");g.rect(21,31,22,2,"#a35a38");
  for(let k=0;k<12;k++){const x=24+hash(k,7)%16,y=14+hash(k,8)%16;g.line(32,32,x,y,K.leafD);g.ell(x,y,2.4,1.8,tex(K.leaf,K.leafD,K.leafL),1)}return g}

// ===== Tiere (Seitenansicht, Kopf rechts) =====
function animalBody(g,o){g.fill=true;const tag=(x,y)=>o.zone(x,y);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(g.c[i]&&g.r[i]==="m"){const z=tag(x,y);g.r[i]=z;g.e[i]=o.hi.includes(z)?1:0;if(g.e[i])g.c[i]=o.hiCol||"#e0473a"}}}
function pig(hi){const g=new Grid();ground(g);const P="#f2b8b0",PD="#e39a92";
  [[16,30],[22,30],[38,30],[44,30]].forEach(([x,y])=>{g.rect(x,y,3,11,P,0,"m");g.rect(x,40,3,2,"#5a3a2a")});
  g.ell(30,24,18,10,P,0,"m");g.ell(48,22,8,7,P,0,"m");g.rect(54,20,4,5,PD);g.dot(56,21,"#7a4a4a");g.dot(56,23,"#7a4a4a");g.poly([[44,15],[48,10],[49,16]],PD);g.dot(50,19,K.ink);
  g.line(12,20,10,18,PD);g.line(10,18,11,16,PD);
  animalBody(g,{hi,zone:(x,y)=>y>=31?"haxe":x>=44?"kopf":x>=40&&y<22?"nacken":x>=36?"schulter":y<20?"ruecken":y>=27?"bauch":x<22?"schinken":"ruecken"});
  return g}
function bird(hi,o){const g=new Grid();ground(g);const B=o.body,Wg=o.wing;
  g.line(26,32,25,41,"#e0a93a",0,1.2);g.line(31,32,32,41,"#e0a93a",0,1.2);g.line(23,41,27,41,"#e0a93a");g.line(30,41,34,41,"#e0a93a");
  g.poly([[8,10],[18,20],[14,26]],o.tail||B);g.ell(26,25,14,10,B,0,"m");g.ell(39,17,5,6,B,0,"m");g.ell(42,11,5,5,o.head||B);
  g.poly([[47,11],[51,12],[47,13]],o.beak||"#e8a83a");g.dot(43,10,K.ink);if(o.comb){g.ell(41,6,3,1.5,"#d7263d");g.ell(46,15,1,2,"#d7263d")}
  if(o.wattle){g.ell(46,16,1.5,3,"#c8263d")}
  animalBody(g,{hi,zone:(x,y)=>{if(((x-22)/8)**2+((y-23)/5)**2<=1)return "fluegel";if(x>=31&&y>=20)return "brust";if(x<=26&&y>=28)return "keule";if(x>=35&&y<20)return "hals";return "ruecken"}});
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(g.r[i]==="fluegel"&&!g.e[i])g.c[i]=Wg}
  if(o.egg){g.ell(53,38,3,3.8,"#f3e7d3",1)}
  return g}
function sheep(hi,o){const g=new Grid();ground(g);const F=o.face||"#2a2622",B=o.wool||"#efe8d8";
  [[17,30],[22,30],[38,30],[43,30]].forEach(([x,y])=>{g.rect(x,y,3,11,F)});
  for(let k=0;k<14;k++)g.ell(14+hash(k,9)%32,16+hash(k,10)%14,4,4,B,0,"m");g.ell(30,23,16,9,B,0,"m");
  g.ell(48,19,5,6,F);g.ell(46,13,3,1.5,F);if(o.horns){g.line(46,13,42,8,"#b7a07a",0,1.4);g.line(42,8,40,11,"#b7a07a")}g.dot(49,17,"#f6f1e6");
  if(o.udder)g.ell(25,32,3,2,"#f2b8b0",1,"euter");
  animalBody(g,{hi,zone:(x,y)=>x>=40?"hals":x>=34?"schulter":y<20?"ruecken":y>=27?"brust":x<22?"keule":"ruecken"});return g}
function fish(hi,o){const g=new Grid();g.rect(0,40,W,6,(x,y)=>y===40?K.waterD:K.water);
  const B=o.col||"#b7c2c9";g.poly([[8,14],[16,23],[8,32]],o.fin||"#8b98a0");g.ell(32,23,20,8,B,0,"m");g.poly([[26,15],[32,9],[38,15]],o.fin||"#8b98a0");g.poly([[30,30],[34,35],[37,30]],o.fin||"#8b98a0");
  g.line(46,17,47,29,"#7f8a90");g.dot(49,21,K.ink);if(o.spots)for(let k=0;k<10;k++)g.dot(20+hash(k,11)%24,17+hash(k,12)%8,"#4a4a4a");
  animalBody(g,{hi,hiCol:o.meat||"#f08a6f",zone:(x,y)=>x>=46?"kopf":x<15?"schwanz":"filet"});
  return g}
function shrimp(){const g=new Grid();g.fill=true;g.rect(0,40,W,6,(x,y)=>y===40?K.waterD:K.water);
  for(let k=0;k<7;k++){const a=Math.PI*(.15+k*.12);g.ell(32+Math.cos(a)*12,18+Math.sin(a)*12,3.2,3.2,k%2?"#f2936f":"#f4a585",1)}
  g.poly([[19,26],[13,22],[14,31]],"#e07a58");g.ell(44,16,4,3,"#e8805e");g.line(47,14,60,6,"#c96a4a");g.line(47,15,61,12,"#c96a4a");g.dot(45,14,K.ink);
  for(let k=0;k<5;k++)g.line(30+k*3,28,29+k*3,33,"#d77a5a");return g}
function cowArt(hi,o){if(typeof COW==="undefined")return null;const g=new Grid();const {w,h,px}=COW;
  const sc=w/(W-4),top=42-Math.round(h/sc);
  for(let y=0;y<42;y++)for(let x=2;x<W-2;x++){const sx=Math.floor((x-2)*sc),sy=Math.floor((y-top)*sc);if(sx<0||sy<0||sx>=w||sy>=h)continue;const r=px[sy*w+sx];if(r===".")continue;
    g.set(x,y,r==="f"?"#2a2622":r==="m"?"#e8b4a6":o.fill||"#f4efe6")}
  ground(g);
  g.fill=true;if(o.udder){const ux=Math.round(W*.42);let uy=0;for(let y=0;y<40;y++)if(g.c[y*W+ux])uy=y;g.ell(ux,uy+1.5,2.6,2,"#f2b8b0",1);g.set(ux-1,uy+3.5,"#e39a92",1);g.set(ux+1,uy+3.5,"#e39a92",1)}
  return g}

// ===== Zuordnung: Artikelname oder Einordnung -> Bild =====
const P=(re,make,iss,fakt)=>({re,make,iss,fakt});
const L=[
 P(/granatapfel/,()=>tree({fruit:"#c0263a",n:7,r:2}),"die Kerne","Gegessen werden die saftigen Samenmäntel, die jeden Kern umhüllen."),
 P(/cherry|cocktailtomate|snacktomate|kirschtomate|datteltomate|mini ?roma|minirispen/,()=>stake({fruit:"#e03a2a",shape:"small"}),"die Früchte","Kleine Tomaten wie Cherry- oder Cocktailtomaten wachsen in langen Rispen und sind meist süßer als große Sorten."),
 P(/tomate/,()=>stake({fruit:"#e03a2a"}),"die Früchte","Tomaten sind botanisch Beeren und gehören zu den Nachtschattengewächsen wie Kartoffeln."),
 P(/apfel|äpfel/,()=>tree({fruit:"#d9412b"}),"die Frucht","Ein Apfelbaum trägt erst nach einigen Jahren. Fast alle Sorten werden veredelt, weil Apfelkerne keine sortenechten Bäume ergeben."),
 P(/birne/,()=>tree({fruit:"#c9c23a",shape:"pear"}),"die Frucht","Birnen reifen nach der Ernte nach und werden deshalb oft noch hart gepflückt."),
 P(/kirsche/,()=>tree({fruit:"#b3122e",shape:"cherry",n:10}),"die Frucht","Kirschen reifen nicht nach, sie werden reif gepflückt."),
 P(/pflaume|zwetsch/,()=>tree({fruit:"#4b2f6e",shape:"pear",r:1.4}),"die Frucht","Zwetschgen sind eine Unterart der Pflaume, länglicher und mit festerem Fleisch."),
 P(/pfirsich|nektarine|aprikose/,()=>tree({fruit:"#f09a3a"}),"die Frucht","Aprikosen, Pfirsiche und Nektarinen sind Steinobst wie Kirschen und Pflaumen."),
 P(/zitrone/,()=>tree({fruit:"#f2d63a",leaf:"citrus",shape:"pear",r:1.4}),"die Frucht","Zitronenbäume blühen und tragen gleichzeitig, oft hängen Blüten und reife Früchte am selben Ast."),
 P(/limette/,()=>tree({fruit:"#7cc242",leaf:"citrus",r:1.3}),"die Frucht","Limetten werden meist grün und unreif geerntet, reif wären sie gelblich."),
 P(/orange|clementine|mandarine/,()=>tree({fruit:"#f08a24",leaf:"citrus"}),"die Frucht","Zitrusfrüchte sind botanisch Beeren mit ledriger Schale."),
 P(/grapefruit|pomelo/,()=>tree({fruit:"#f4b860",leaf:"citrus",r:2.2,n:7}),"die Frucht","Die Grapefruit ist vermutlich eine Kreuzung aus Pomelo und Orange."),
 P(/weintraube|traube/,()=>climb({fruit:"#6b3f8a",shape:"grape",n:6}),"die Beeren","Weinreben klettern mit Ranken. Trauben sind botanisch Beeren."),
 P(/kiwi/,()=>climb({fruit:"#8a6a3a",shape:"oval",n:7}),"die Frucht","Kiwis wachsen an einer Kletterpflanze, die an Gerüsten gezogen wird."),
 P(/mango/,()=>tree({fruit:"#f0a03a",shape:"long",r:1.6,n:7}),"die Frucht","Mangobäume können über 30 Meter hoch und über 100 Jahre alt werden."),
 P(/avocado/,()=>tree({fruit:"#3f5a28",shape:"pear",r:1.5,n:8}),"die Frucht","Avocados reifen erst nach der Ernte, am Baum bleiben sie hart."),
 P(/ananas/,pineapple,"die Frucht","Jede Ananaspflanze bildet nur eine Frucht, sie wächst aus der Mitte der Blattrosette."),
 P(/banane/,banana,"die Früchte","Die Bananenpflanze ist kein Baum, sondern eine Staude. Der Stamm besteht aus eingerollten Blättern."),
 P(/melone/,()=>sprawl({fruit:"#6fa84a",stripe:"#3f7a2a",r:8}),"die Frucht","Melonen sind Kürbisgewächse und wachsen am Boden kriechend."),
 P(/heidelbeere|blaubeere/,()=>bush({fruit:"#3b4f9c"}),"die Beeren","Heidelbeeren wachsen an niedrigen Sträuchern und mögen sauren Boden."),
 P(/himbeere/,()=>bush({fruit:"#d23a5a"}),"die Früchte","Eine Himbeere ist eine Sammelsteinfrucht aus vielen kleinen Steinfrüchtchen."),
 P(/brombeere/,()=>bush({fruit:"#3a1f3a"}),"die Früchte","Brombeeren sind wie Himbeeren Sammelsteinfrüchte und wachsen an stacheligen Ranken."),
 P(/johannisbeere/,()=>bush({fruit:"#c8102e"}),"die Beeren","Johannisbeeren reifen um den Johannistag am 24. Juni, daher der Name."),
 P(/erdbeere/,strawberry,"die Frucht","Die kleinen gelben Punkte außen sind die eigentlichen Früchte, sogenannte Nüsschen. Das rote Fruchtfleisch ist der Blütenboden."),
 P(/feige/,()=>tree({fruit:"#6e3d5a",shape:"pear",r:1.5,n:8}),"die Frucht","Die Feige ist ein Blütenstand, die Blüten sitzen innen in der Frucht."),
 P(/kaki/,()=>tree({fruit:"#f07a1a",n:9}),"die Frucht","Kakis hängen oft noch am Baum, wenn alle Blätter schon gefallen sind."),
 P(/paprika/,()=>stake({fruit:"#e8402a",shape:"block",fruits:[[26,16],[38,22],[27,30]]}),"die Früchte","Grüne Paprika ist unreif. Rote Paprika ist dieselbe Frucht, nur ausgereift und süßer."),
 P(/chili|peperoni/,()=>stake({fruit:"#d7262d",shape:"chili"}),"die Früchte","Die Schärfe sitzt vor allem in den Scheidewänden innen, nicht in den Kernen selbst."),
 P(/aubergine/,()=>stake({fruit:"#4b2a5e",shape:"long",fruits:[[26,16],[38,22],[27,30]]}),"die Früchte","Auberginen sind wie Tomaten Nachtschattengewächse."),
 P(/gurke/,()=>climb({fruit:"#4f8a32",shape:"cuke"}),"die Früchte","Gurken klettern mit Ranken und sind botanisch Beeren, wie Kürbisse."),
 P(/zucchini/,()=>sprawl({fruit:"#3f7a2a",shape:"zucchini"}),"die Früchte","Zucchini sind Kürbisse, die jung geerntet werden. Auch die Blüten sind essbar."),
 P(/kürbis|hokkaido|butternut/,()=>sprawl({fruit:"#e8792a",rib:"#c95f1a",r:9}),"die Frucht","Ein Kürbis ist eine Panzerbeere und eine der größten Beeren überhaupt."),
 P(/kidney|schwarze bohne|weiße bohne|borlotti/,()=>legume({col:"#8a2a2a",round:true}),"die Samen","Kidneybohnen sind reife, getrocknete Bohnensamen. Getrocknet müssen sie eingeweicht und gut durchgekocht werden."),
 P(/pistazie/,()=>tree({fruit:"#c9a0a0",n:12,r:1.1}),"der Kern","Pistazien wachsen in Trauben am Baum. Reif platzt die harte Schale von selbst einen Spalt weit auf."),
 P(/bohne(?!n ?(im|aus))|fisole|stangenbohne|buschbohne/,()=>climb({fruit:"#5a9a3a",shape:"pod",n:8}),"die Hülsen","Grüne Bohnen sind unreife Hülsen. Roh sind sie giftig, erst Kochen macht sie bekömmlich."),
 P(/kichererbse/,()=>legume({col:"#c9b27a",round:true}),"die Samen","In jeder Hülse stecken meist nur ein bis zwei Kichererbsen."),
 P(/erbse/,()=>climb({fruit:"#6fb04a",shape:"pod",n:8}),"die Samen","Erbsen sind die Samen in der Hülse. Zuckerschoten isst man samt Hülse."),
 P(/linse/,()=>legume({col:"#b5823a",round:true}),"die Samen","Linsen sind die Samen einer kleinen Hülsenfrucht und zählen zu den ältesten Kulturpflanzen."),
 P(/bohnen|kidney|soja|tofu|tempeh|edamame/,()=>legume({col:"#6a8a3a"}),"die Samen","Tofu und Tempeh werden aus Sojabohnen gemacht, den Samen einer Hülsenfrucht."),
 P(/kartoffel/,()=>root({type:"tuber",col:"#d8b36a"}),"die Knollen","Kartoffeln sind keine Wurzeln, sondern verdickte Sprosse unter der Erde. Die grünen Beeren der Pflanze sind giftig."),
 P(/süßkartoffel/,()=>root({type:"tuber",col:"#c8603a",long:true}),"die Knollen","Süßkartoffeln sind Speicherwurzeln und nicht mit der Kartoffel verwandt."),
 P(/möhre|karotte|suppengrün/,()=>root({type:"carrot",col:"#f08a24"}),"die Wurzel","Die Möhre ist die verdickte Pfahlwurzel. Im ersten Jahr speichert sie Zucker, im zweiten würde sie blühen."),
 P(/pastinake/,()=>root({type:"carrot",col:"#efe2b8"}),"die Wurzel","Die Pastinake ist mit der Möhre verwandt und schmeckt nach Frost süßer."),
 P(/rote bete|randen/,()=>root({type:"beet",col:"#8a1f3a",vein:"#a8264a"}),"die Knolle","Rote Bete ist eine verdickte Rübe. Der Farbstoff Betanin färbt auch Hände und Brettchen."),
 P(/radieschen/,()=>root({type:"radish",col:"#d7264a",tip:K.white}),"die Knolle","Radieschen brauchen nur etwa vier Wochen von der Saat bis zur Ernte."),
 P(/rettich/,()=>root({type:"long",col:K.white}),"die Wurzel","Rettich ist mit dem Radieschen verwandt, die Schärfe kommt von Senfölen."),
 P(/zwiebel|schalotte/,()=>root({type:"bulb",col:"#c98a3a"}),"die Zwiebel","Die Zwiebel besteht aus verdickten Blattscheiden, deshalb lässt sie sich in Schichten zerlegen."),
 P(/knoblauch/,()=>root({type:"bulb",col:"#f1ead8",colD:"#d8ccb0"}),"die Zehen","Jede Zehe ist eine Brutzwiebel. Steckt man sie in die Erde, wächst eine neue Pflanze."),
 P(/ingwer|kurkuma/,()=>root({type:"rhizome",col:"#d9b26a"}),"der Wurzelstock","Ingwer ist ein Rhizom, ein unterirdischer Spross, keine Wurzel."),
 P(/sellerie/,()=>root({type:"celery",col:"#e7e0c4"}),"die Knolle","Knollensellerie und Staudensellerie sind dieselbe Art, nur auf Knolle oder Stiele gezüchtet."),
 P(/kohlrabi/,()=>root({type:"kohlrabi",col:"#b8d88a",top:34}),"die Knolle","Kohlrabi wächst über der Erde. Die Knolle ist ein verdickter Stängel, keine Wurzel."),
 P(/fenchel/,()=>root({type:"fennel",top:34}),"die Knolle","Die Fenchelknolle besteht aus verdickten Blattscheiden. Das Grün schmeckt wie Dill."),
 P(/lauch|porree/,()=>root({type:"leek",top:30}),"der Schaft","Lauch wird angehäufelt, damit der Schaft unter der Erde weiß bleibt."),
 P(/spargel/,()=>root({type:"asparagus",col:"#e9e3c8",top:30}),"die Sprossen","Weißer Spargel wächst unter Erdwällen und bleibt ohne Licht weiß. Grüner Spargel wächst darüber."),
 P(/champignon|pilz|seitling|shiitake/,()=>root({type:"mushroom",col:"#efe6d2",top:34}),"der Fruchtkörper","Pilze sind weder Pflanze noch Tier. Was wir essen, ist nur der Fruchtkörper, das Geflecht lebt im Boden."),
 P(/brokkoli/,()=>head({type:"flower",col:"#3f7a3a",col2:"#2f5f2a"}),"die Blütenknospen","Brokkoli sind geschlossene Blütenknospen. Lässt man ihn stehen, blüht er gelb."),
 P(/blumenkohl/,()=>head({type:"flower",col:"#f3ead2",col2:"#e3d8b8"}),"die Blütenanlagen","Der Kopf ist ein Blütenstand, der unter den Blättern vor Licht geschützt weiß bleibt."),
 P(/rosenkohl/,()=>head({type:"sprout"}),"die Röschen","Rosenkohl wächst als kleine Knospen am Stängel und schmeckt nach dem ersten Frost milder."),
 P(/grünkohl/,()=>head({type:"kale",col:"#3f6f3a"}),"die Blätter","Grünkohl bildet keinen Kopf. Geerntet werden die krausen Blätter von unten nach oben."),
 P(/rotkohl|blaukraut/,()=>head({col:"#6a2f6e",colD:"#4a1f4e"}),"der Kopf","Rotkohl färbt sich mit Essig rot und mit Natron blau, der Farbstoff ist ein Indikator."),
 P(/wirsing/,()=>head({col:"#8ab86a",colD:"#5f8a45"}),"der Kopf","Wirsing hat gekrauste Blätter und ist zarter als Weißkohl."),
 P(/weißkohl|spitzkohl|sauerkraut|kohl/,()=>head({col:"#c8dc9a",colD:"#9ab86a"}),"der Kopf","Ein Kohlkopf ist eine riesige Knospe aus eng übereinanderliegenden Blättern."),
 P(/salat|eisberg|romana|lollo/,()=>head({type:"rosette",col:"#86bf55"}),"die Blätter","Kopfsalat wird geerntet, bevor er schießt, also in die Höhe wächst und bitter wird."),
 P(/spinat|mangold|feldsalat|rucola|rauke/,()=>head({type:"rosette",col:"#4f8a3a",small:true}),"die Blätter","Blattgemüse wird jung geerntet, solange die Blätter zart sind."),
 P(/kräuter|basilikum|petersilie|schnittlauch|koriander|minze|dill/,herb,"die Blätter","Viele Küchenkräuter wachsen nach, wenn man nur die Spitzen abschneidet."),
 P(/walnuss|walnüsse/,()=>tree({fruit:"#6f9a3a",n:9,r:1.7}),"der Kern","Die Walnuss steckt in einer grünen Fruchthülle, die im Herbst aufplatzt."),
 P(/haselnuss|haselnüsse/,()=>bush({fruit:"#9a6a3a",husk:true}),"der Kern","Haselnüsse wachsen an Sträuchern, jede Nuss sitzt in einem grünen Hüllblatt."),
 P(/mandel/,()=>tree({fruit:"#9ab86a",shape:"pear",r:1.4}),"der Kern","Die Mandel ist der Samen einer Steinfrucht, verwandt mit Pfirsich und Aprikose."),
 P(/cashew/,cashew,"der Kern","Jede Cashewnuss hängt einzeln unter einem birnenförmigen Cashewapfel."),
 P(/marone|esskastanie/,()=>tree({fruit:"#8a9a3a",n:9,r:1.8}),"die Samen","Maronen stecken zu zweit oder dritt in einer stacheligen Fruchthülle."),
 P(/hafer|müsli|porridge/,()=>grain({col:"#d8c27a",oat:true}),"die Körner","Haferflocken sind gedämpfte und gewalzte Haferkörner."),
 P(/reis/,()=>grain({col:"#e8d89a",water:true}),"die Körner","Reis wächst oft in gefluteten Feldern, das Wasser hält Unkraut fern."),
 P(/weizen|mehl|nudel|pasta|spaghetti|brot|brötchen|couscous|bulgur|grieß/,()=>grain({col:"#e0b85a",awn:true}),"die Körner","Mehl, Nudeln und Brot entstehen aus gemahlenen Weizenkörnern."),
 P(/roggen|dinkel|gerste/,()=>grain({col:"#d0a85a",awn:true}),"die Körner","Dinkel ist eine alte Weizenart mit fest umhüllten Körnern."),
 P(/mais|polenta|popcorn/,()=>grain({col:"#f2c84a"}),"die Körner","Ein Maiskolben ist der weibliche Blütenstand der Pflanze."),
 P(/olivenöl|olive/,()=>tree({fruit:"#3a3a2a",leaf:"olive",n:12,r:1}),"die Früchte","Oliven sind Steinfrüchte. Grüne sind unreif, schwarze reif."),
 P(/rapsöl|raps/,raps,"die Samen","Rapsöl wird aus den kleinen schwarzen Samen gepresst, die nach der gelben Blüte reifen."),
 P(/sonnenblume/,sunflower,"die Kerne","Eine Sonnenblume trägt bis zu 2.000 Kerne in ihrem Blütenkorb."),
 P(/kakao|schokolade/,cacao,"die Bohnen","Kakaofrüchte wachsen direkt am Stamm. Innen liegen die Bohnen im weißen Fruchtfleisch."),
 P(/kaffee/,()=>bush({fruit:"#c0263a"}),"die Samen","Kaffeebohnen sind die Samen roter Kaffeekirschen, die erst durch Rösten braun werden."),
];
const A={
 schwein:{make:hi=>pig(hi),name:"Schwein",cuts:[[/kotelett|lachs|rücken|filet|lende/,["ruecken"],"Rücken"],[/schnitzel|schinken|keule|nuss|oberschale/,["schinken"],"Schinken"],[/nacken|kamm/,["nacken"],"Nacken"],
   [/bauch|speck|pancetta|bacon/,["bauch"],"Bauch"],[/haxe|eisbein|schweinsfuß/,["haxe"],"Haxe"],[/gulasch|schulter|braten/,["schulter"],"Schulter"],[/hack|salami|wurst|bratwurst|salsiccia|chorizo/,["schulter","bauch"],"Schulter und Bauch"]],
   fakt:"Beim Schwein ist der Rücken mager und zart, Bauch und Nacken sind durchwachsen und bleiben beim Braten saftig."},
 huhn:{make:hi=>bird(hi,{body:"#f3ece0",wing:"#e2d5bf",comb:1,tail:"#e2d5bf"}),name:"Huhn",cuts:[[/brust|filet|geschnetzelt|nugget/,["brust"],"Brust"],[/schenkel|keule|drumstick|unterschenkel/,["keule"],"Keule"],[/flügel|wings/,["fluegel"],"Flügel"]],
   fakt:"Die Hühnerbrust ist hell und mager, weil Hühner kaum fliegen. Die Keulen arbeiten beim Laufen und sind deshalb dunkler und saftiger."},
 pute:{make:hi=>bird(hi,{body:"#5a4a3a",wing:"#7a6450",head:"#c9a0a0",wattle:1,tail:"#3e3228",beak:"#c9b48a"}),name:"Pute",cuts:[[/brust|schnitzel|filet|geschnetzelt|aufschnitt/,["brust"],"Brust"],[/keule|schenkel|oberkeule/,["keule"],"Keule"],[/flügel/,["fluegel"],"Flügel"]],
   fakt:"Putenbrust ist besonders mager. Die roten Hautlappen am Hals heißen Kehllappen."},
 ente:{make:hi=>bird(hi,{body:"#c9b9a0",wing:"#8a7a62",head:"#2f6b4a",tail:"#6a5a45",beak:"#e8b83a"}),name:"Ente",cuts:[[/brust/,["brust"],"Brust"],[/keule|schenkel/,["keule"],"Keule"]],
   fakt:"Entenbrust hat eine dicke Fettschicht, die beim Braten auf der Hautseite knusprig wird."},
 lamm:{make:hi=>sheep(hi,{}),name:"Lamm",cuts:[[/keule/,["keule"],"Keule"],[/karree|kotelett|rücken|lachs/,["ruecken"],"Rücken"],[/schulter/,["schulter"],"Schulter"],[/hals/,["hals"],"Hals"],[/brust/,["brust"],"Brust"]],
   fakt:"Lammfleisch stammt von Schafen unter einem Jahr und ist zarter und milder als Hammelfleisch."},
 fisch:{make:(hi,o)=>fish(hi,o||{}),name:"Fisch",cuts:[[/filet|loin|rücken/,["filet"],"Filet"]],fakt:"Fischmuskeln sind in Schichten angeordnet, deshalb zerfällt gegartes Fischfilet in Lamellen."},
};
const FISH={lachs:{col:"#b7c2c9",meat:"#f2876a",spots:1,fakt:"Lachs ist rosa, weil er über die Nahrung Krebstiere mit dem Farbstoff Astaxanthin frisst."},
  forelle:{col:"#a9b88a",spots:1,meat:"#f2a07a",fakt:"Forellen leben in kühlen, sauerstoffreichen Bächen und Teichen."},
  kabeljau:{col:"#b9ae8a",fin:"#9a8f6a",meat:"#f6efe2",fakt:"Kabeljau heißt in der Ostsee und als junger Fisch Dorsch."},
  seelachs:{col:"#7a8a90",meat:"#f2ece2",fakt:"Seelachs ist kein Lachs, sondern ein Dorschfisch. Der Name kommt von der Farbe gefärbter Filets."},
  thunfisch:{col:"#3f5a7a",meat:"#c9364a",fakt:"Thunfisch hat dunkelrotes Fleisch, weil seine Muskeln viel Myoglobin für Dauerschwimmen haben."},
  dorade:{col:"#c9c9b8",meat:"#f6efe2",fakt:"Doraden heißen auch Goldbrassen, nach dem goldenen Streifen zwischen den Augen."},
  fisch:{col:"#b7c2c9",meat:"#f6efe2"}};
function animalFor(t,p){const has=w=>p.includes(w)||new RegExp(w.toLowerCase()).test(t);
  if(/garnele|shrimp|scampi|krabbe/.test(t))return {svg:svg(shrimp(),"Garnele"),title:"Garnele",iss:"der Schwanz",fakt:"Garnelen sind Krebstiere. Gegessen wird der muskulöse Hinterleib, oft Schwanz genannt.",cut:null};
  let key=null;if(/rind|ochse|beef|kalb|tafelspitz|roastbeef|entrec/.test(t)||p.includes("Rind"))return null;
  if(/schwein|speck|schinken|salami|salsiccia|pancetta|bacon|chorizo|kotelett|eisbein|leberkäs|mett|bratwurst/.test(t)||p.includes("Schwein"))key="schwein";
  else if(/pute|truthahn/.test(t)||p.includes("Pute"))key="pute";else if(/\bente\b|enten/.test(t)||p.includes("Ente"))key="ente";
  else if(/hähnchen|huhn|hühner|chicken|poularde|geflügel/.test(t)||p.includes("Hähnchen")||p.includes("Geflügel"))key="huhn";
  else if(/lamm|schaf(?!s?käse)|hammel/.test(t)||p.includes("Lamm"))key="lamm";
  if(key){const a=A[key];const c=a.cuts.find(([re])=>re.test(t));const hi=c?c[1]:[];
    return {svg:svg(a.make(hi),a.name),title:a.name,iss:c?c[2]:"",fakt:a.fakt,cut:c,needCut:!c}}
  const fk=Object.keys(FISH).find(k=>k!=="fisch"&&t.includes(k));
  if(fk||/fisch|forelle|dorsch|zander|hering|makrele|sardine/.test(t)||p.includes("Fisch & Meeresfrüchte")){const f=FISH[fk||"fisch"];
    return {svg:svg(fish(["filet"],f),"Fisch"),title:fk?fk[0].toUpperCase()+fk.slice(1):"Fisch",iss:"das Filet",fakt:f.fakt||A.fisch.fakt}}
  if(/\beier\b|^eier|^ei\b|freiland|eier /.test(t)||p.includes("Eier"))return {svg:svg(bird([],{body:"#c98a4a",wing:"#a8682f",comb:1,tail:"#7a4a22",egg:1}),"Huhn mit Ei"),title:"Huhn",iss:"das Ei",fakt:"Ein Huhn legt etwa alle 25 Stunden ein Ei. Die Schalenfarbe hängt von der Rasse ab, nicht vom Futter."};
  if(/ziege/.test(t))return {svg:svg(sheep(["euter"],{wool:"#e9e2d4",face:"#e9e2d4",horns:1,udder:1}),"Ziege"),title:"Ziege",iss:"die Milch",fakt:"Ziegenmilch hat kleinere Fettkügelchen als Kuhmilch und schmeckt kräftiger."};
  if(/schaf|feta|pecorino|manchego|halloumi|roquefort/.test(t))return {svg:svg(sheep(["euter"],{udder:1}),"Schaf"),title:"Schaf",iss:"die Milch",fakt:"Echter Feta wird aus Schafsmilch gemacht, oft mit etwas Ziegenmilch."};
  if(/büffel|bufala/.test(t)){const g=cowArt([],{fill:"#5a5650",udder:1});if(g)return {svg:svg(g,"Wasserbüffel"),title:"Wasserbüffel",iss:"die Milch",fakt:"Mozzarella di Bufala wird aus der Milch von Wasserbüffeln gemacht, sie ist fetter als Kuhmilch."}}
  if(!/hafer|soja|mandel|kokos|reis|cashew|erbsen|drink|butternut|erdnuss/.test(t)&&/milch|joghurt|quark|skyr|kefir|sahne|\bbutter\b|käse|mozzarella|burrata|parmesan|parmigiano|gouda|emmentaler|bergkäse|brie|camembert|geramont|frischkäse|ricotta|mascarpone|schmand|creme fraiche|crème/.test(t)||p.includes("Milchprodukte")){
    const g=cowArt([],{udder:1});if(g)return {svg:svg(g,"Kuh"),title:"Kuh",iss:"die Milch",fakt:/käse|parmesan|gouda|bergkäse|emmentaler/.test(t)?"Für ein Kilo Hartkäse braucht man etwa zehn bis zwölf Liter Milch.":"Eine Milchkuh gibt nur Milch, nachdem sie ein Kalb geboren hat."}}
  return null}
function saisonFor(name){if(typeof SAISON==="undefined")return null;const n=String(name).toLowerCase();
  for(const g of Object.keys(SAISON))for(const [a,s] of SAISON[g]){const b=a.toLowerCase();if(n===b||n.includes(b.replace(/n$|e$/,""))||b.includes(n))return s}return null}
function saisonHtml(s){if(!s)return "";const M="JFMAMJJASOND",now=new Date().getMonth();const T={H:"Freiland",T:"Folie oder Übergang",L:"Lager",I:"Import"};
  return `<div class="ssn"><div class="lbl">Saison</div><div class="ssr">${[...s].map((c,i)=>`<span class="s-${c==="-"?"x":c}${i===now?" now":""}" title="${T[c]||"keine Saison"}">${M[i]}</span>`).join("")}</div>
    <div class="ssl"><span class="s-H">Freiland</span><span class="s-T">Folie</span><span class="s-L">Lager</span><span class="s-I">Import</span></div></div>`}
window.HERKUNFT=function(art,pfad){const t=String(art||"").toLowerCase(),p=pfad||[];
  const an=animalFor(t,p);if(an)return an;
  const hit=L.find(x=>x.re.test(t))||(p.length?L.find(x=>x.re.test(p.slice(1).join(" ").toLowerCase())):null);
  if(!hit)return null;return {svg:svg(hit.make(),art),iss:hit.iss,fakt:hit.fakt,saison:saisonHtml(saisonFor(art)),plant:true}};
window.HERKUNFT_GALLERY=function(names){return names.map(n=>{const h=window.HERKUNFT(n,[]);return `<figure><figcaption>${n}</figcaption>${h?h.svg:"(kein Bild)"}</figure>`}).join("")};
})();
