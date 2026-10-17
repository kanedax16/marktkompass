const TABLE={dataTableId:"P9OI4gFLkB44cq6h",projectId:"DjFUyttAvP0kpprh"};
const FIL={dataTableId:"gpHgwxl28FCSe6wP",projectId:"DjFUyttAvP0kpprh"};
const SERVER="n8n", TOOL="get_data_table_rows";
const GROUPS=["Obst","Gemüse","Fleisch","Fisch","Milch & Eier","Käse","Nüsse & Hülsenfrüchte","Feinkost","Getreide & Flocken","Saaten & Öle","Vorrat","Getränke","Haushalt"];
const QUICK=["Suppengrün","Kartoffeln","Äpfel","Bananen","Hähnchen","Hackfleisch","Lachs","Eier","Kefir","Joghurt","Mandeln","Linsen"];
const SHORT={"Netto Marken-Discount":"Netto","Hieber's Frische Center":"Hieber","dm-drogerie markt":"dm"};
const LOGOS={"ALDI SÜD":"img/logo-aldi-sued.png", "Lidl":"img/logo-lidl.png", "REWE":"img/logo-rewe.png", "nahkauf":"img/logo-nahkauf.png", "EDEKA":"img/logo-edeka.png", "PENNY":"img/logo-penny.png", "Netto Marken-Discount":"img/logo-netto-marken-discount.png", "Kaufland":"img/logo-kaufland.png", "Hieber's Frische Center":"img/logo-hieber-s-frische-center.png", "denn's Biomarkt":"img/logo-denn-s-biomarkt.png", "Alnatura":"img/logo-alnatura.png"};
const sname=r=>SHORT[r]||r;
const logo=r=>LOGOS[r]?`<img class="logo" src="${LOGOS[r]}" alt="${esc(sname(r))}" title="${esc(sname(r))}">`:`<strong>${esc(sname(r))}</strong>`;
const eur=n=>n==null?"":n.toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const dfmt=d=>d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});
const UNIT={kg:"kg",l:"Liter",Stk:"Stück"};
// Artikel erkennen, damit nur Gleiches verglichen wird (Reihenfolge zählt)
const ARTICLES=[
 ["Suppengrün",/suppengr|suppengem/],["Süßkartoffeln",/süßkartoffel|suesskartoffel/],["Kartoffeln",/kartoffel/],["Zwiebeln",/zwiebel|schalotte/],["Knoblauch",/knoblauch/],
 ["Möhren",/möhre|karotte/],["Lauch",/lauch|porree/],["Sellerie",/sellerie/],["Kohlrabi",/kohlrabi/],["Brokkoli",/brokkoli|broccoli/],["Blumenkohl",/blumenkohl/],
 ["Rosenkohl",/rosenkohl/],["Rotkohl",/rotkohl/],["Weißkohl",/weißkohl|spitzkohl/],["Wirsing",/wirsing/],["Grünkohl",/grünkohl/],["Tomaten",/tomate/],["Gurken",/gurke/],
 ["Paprika",/paprika/],["Zucchini",/zucchini/],["Auberginen",/aubergine/],["Kürbis",/kürbis/],["Champignons",/champignon/],["Pilze",/pilz|seitling|shi+take/],
 ["Feldsalat",/feldsalat/],["Rucola",/rucola/],["Spinat",/spinat/],["Salat",/salat|romana|eisberg/],["Rote Bete",/rote bete/],["Radieschen",/radieschen/],["Fenchel",/fenchel/],
 ["Ingwer",/ingwer/],["Bohnen",/bohnen/],["Spargel",/spargel/],["Kräuter",/kräuter|petersilie|schnittlauch|basilikum/],
 ["Äpfel",/äpfel|apfel/],["Birnen",/birne/],["Bananen",/banane/],["Zitronen",/zitrone/],["Limetten",/limette/],["Orangen",/orange/],["Clementinen & Mandarinen",/clementine|mandarine|satsuma/],
 ["Grapefruit & Pomelo",/grapefruit|pomelo/],["Weintrauben",/traube/],["Pflaumen & Zwetschgen",/pflaume|zwetschge/],["Kiwi",/kiwi(?!beere)/],["Mango",/\bmango\b/],["Avocado",/avocado/],
 ["Ananas",/ananas/],["Melone",/melone/],["Heidelbeeren",/heidelbeer|blaubeer/],["Himbeeren",/himbeer/],["Erdbeeren",/erdbeer/],["Granatapfel",/granatapfel/],["Feigen",/feige/],["Kaki",/kaki/],
 ["Kalb",/kalb/],["Lamm",/lamm/],["Pute",/pute|truthahn/],["Ente & Gans",/\bente|gans/],["Hähnchen",/hähnchen|huhn|hühn|poularde|chicken|geflügel/],
 ["Rind",/rind|jungbull|beef|tafelspitz|roastbeef|entrecote|rumpsteak|hüftsteak|chuck|t-bone/],["Schwein",/schwein|spanferkel|nacken|kamm|kotelett|bauch|eisbein|schnitzel|spare ?ribs|rippe|lachse|filet|braten/],["Hackfleisch gemischt",/hack/],
 ["Garnelen",/garnele|prawn|shrimp|scampi|gamba/],["Tintenfisch",/tintenfisch|kalmar|calamar|sepia|oktopus|pulpo/],["Muscheln",/muschel/],
 ["Seelachs & Kabeljau",/seelachs|kabeljau|schellfisch|heilbutt|steinbei|seeteufel|scholle|zander|pangasius/],["Lachs",/lachs(?!forelle)/],["Forelle",/forelle|saibling/],
 ["Dorade & Wolfsbarsch",/dorade|wolfsbarsch|loup/],["Sardinen & Makrelen",/sardine|makrele/],["Thunfisch im Glas",/thun/],
 ["Naturjoghurt",/joghurt/],["Skyr",/skyr/],["Kefir",/kefir/],["Eier",/eier/],["Laktosefreie Milch",/milch/],
 ["Mandeln",/mandel/],["Walnüsse",/walnuss|walnüsse/],["Haselnüsse",/haselnuss/],["Cashews",/cashew/],["Maronen",/marone|kastanie/],["Nussmischungen",/nuss|nüsse|studentenfutter|mix/],
 ["Linsen",/linse/],["Kichererbsen",/kichererbse/],["Rohschinken",/schinken|serrano|jam[oó]n|prosciutto|crudo/]
];
const clean=s=>String(s||"").replace(/­/g,"").replace(/^"(.*)"$/,"$1").replace(/""/g,"\"");
const AGRP={"Gemüse":[0,35],"Obst":[35,56],"Fleisch":[56,64],"Fisch":[64,73],"Milch & Eier":[73,78],"Nüsse & Hülsenfrüchte":[78,86],"Feinkost":[86,87]};
function article(r){if(r.grp==="Käse"||r.grp==="Haushalt"||r.grp==="Getränke"||r.grp==="Feinkost"||/Fassbutter/.test(r.category))return r.category;const t=clean(r.product+((r.grp==="Fleisch"||r.grp==="Fisch")?" "+r.category:"")).toLowerCase();const [a,b]=AGRP[r.grp]||[0,ARTICLES.length];for(const [n,re] of ARTICLES.slice(a,b))if(re.test(t))return n;return r.category||r.grp}
const SYN={"suppengrün":"suppengemüse","suppengemüse":"suppengrün","möhren":"karotten","karotten":"möhren","porree":"lauch","lauch":"porree"};

// Artikelbilder: je Artikel ein eigenes 24x24-Pixelbild (PNG)
const IMG={"Äpfel":"img/icon-aepfel.png","Birnen":"img/icon-birnen.png","Bananen":"img/icon-bananen.png","Zitronen":"img/icon-zitronen.png","Limetten":"img/icon-limetten.png","Orangen":"img/icon-orangen.png","Clementinen & Mandarinen":"img/icon-clementinen-mandarinen.png","Grapefruit & Pomelo":"img/icon-grapefruit-pomelo.png","Weintrauben":"img/icon-weintrauben.png","Pflaumen & Zwetschgen":"img/icon-pflaumen-zwetschgen.png","Kiwi":"img/icon-kiwi.png","Mango":"img/icon-mango.png","Avocado":"img/icon-avocado.png","Ananas":"img/icon-ananas.png","Melone":"img/icon-melone.png","Heidelbeeren":"img/icon-heidelbeeren.png","Himbeeren":"img/icon-himbeeren.png","Erdbeeren":"img/icon-erdbeeren.png","Granatapfel":"img/icon-granatapfel.png","Feigen":"img/icon-feigen.png","Kaki":"img/icon-kaki.png","Suppengrün":"img/icon-suppengruen.png","Kartoffeln":"img/icon-kartoffeln.png","Zwiebeln":"img/icon-zwiebeln.png","Knoblauch":"img/icon-knoblauch.png","Möhren":"img/icon-moehren.png","Lauch":"img/icon-lauch.png","Sellerie":"img/icon-sellerie.png","Kohlrabi":"img/icon-kohlrabi.png","Brokkoli":"img/icon-brokkoli.png","Blumenkohl":"img/icon-blumenkohl.png","Rosenkohl":"img/icon-rosenkohl.png","Rotkohl":"img/icon-rotkohl.png","Weißkohl":"img/icon-weisskohl.png","Wirsing":"img/icon-wirsing.png","Grünkohl":"img/icon-gruenkohl.png","Tomaten":"img/icon-tomaten.png","Gurken":"img/icon-gurken.png","Paprika":"img/icon-paprika.png","Zucchini":"img/icon-zucchini.png","Auberginen":"img/icon-auberginen.png","Kürbis":"img/icon-kuerbis.png","Champignons":"img/icon-champignons.png","Pilze":"img/icon-pilze.png","Feldsalat":"img/icon-feldsalat.png","Rucola":"img/icon-rucola.png","Spinat":"img/icon-spinat.png","Salat":"img/icon-salat.png","Rote Bete":"img/icon-rote-bete.png","Radieschen":"img/icon-radieschen.png","Fenchel":"img/icon-fenchel.png","Ingwer":"img/icon-ingwer.png","Bohnen":"img/icon-bohnen.png","Spargel":"img/icon-spargel.png","Kräuter":"img/icon-kraeuter.png","Rind":"img/icon-rind.png","Kalb":"img/icon-kalb.png","Schwein":"img/icon-schwein.png","Lamm":"img/icon-lamm.png","Hähnchen":"img/icon-haehnchen.png","Ente & Gans":"img/icon-ente-gans.png","Hackfleisch gemischt":"img/icon-hackfleisch-gemischt.png","Muscheln":"img/icon-muscheln.png","Seelachs & Kabeljau":"img/icon-seelachs-kabeljau.png","Dorade & Wolfsbarsch":"img/icon-dorade-wolfsbarsch.png","Thunfisch im Glas":"img/icon-thunfisch-im-glas.png","Naturjoghurt":"img/icon-naturjoghurt.png","Skyr":"img/icon-skyr.png","Kefir":"img/icon-kefir.png","Eier":"img/icon-eier.png","Laktosefreie Milch":"img/icon-laktosefreie-milch.png","Butter":"img/icon-butter.png","Büffelmozzarella":"img/icon-bueffelmozzarella.png","Feta (Schaf und Ziege)":"img/icon-feta-schaf-und-ziege.png","Parmigiano Reggiano":"img/icon-parmigiano-reggiano.png","Käse mit geschützter Herkunft":"img/icon-kaese-mit-geschuetzter-herkunft.png","Bio-Käse guter Marken":"img/icon-bio-kaese-guter-marken.png","Mandeln":"img/icon-mandeln.png","Walnüsse":"img/icon-walnuesse.png","Haselnüsse":"img/icon-haselnuesse.png","Cashews":"img/icon-cashews.png","Maronen":"img/icon-maronen.png","Nussmischungen":"img/icon-nussmischungen.png","Linsen":"img/icon-linsen.png","Kichererbsen":"img/icon-kichererbsen.png","Trockenobst":"img/icon-trockenobst.png","Hülsenfrüchte":"img/icon-huelsenfruechte.png","Nüsse & Kerne":"img/icon-nuesse-kerne.png","Rohschinken":"img/icon-rohschinken.png","Wurst und Schinken ohne Zusätze":"img/icon-wurst-und-schinken-ohne-zusaetze.png","Natives Olivenöl extra":"img/icon-natives-olivenoel-extra.png","Olivenöl":"img/icon-olivenoel.png","Haushalt":"img/icon-haushalt.png","Pute":"img/icon-pute.png","Lachs":"img/icon-lachs.png","Forelle":"img/icon-forelle.png","Garnelen":"img/icon-garnelen.png","Tintenfisch":"img/icon-tintenfisch.png","Sardinen & Makrelen":"img/icon-sardinen-makrelen.png","Süßkartoffeln":"img/icon-suesskartoffeln.png"};
const ALIAS=[[/^Naturjoghurt & Skyr$/,"Naturjoghurt"],[/^Bio-Fassbutter/,"Butter"],[/^Meeresfrüchte$/,"Garnelen"],[/^Fisch( frisch| tiefgekühlt)?$/,"Dorade & Wolfsbarsch"],[/^Bio-Kräuter/,"Kräuter"],[/^Tiefkühlgemüse$/,"Bohnen"]];
const GIMG={"Obst":"Äpfel","Gemüse":"Möhren","Fleisch":"Rind","Fisch":"Dorade & Wolfsbarsch","Milch & Eier":"Laktosefreie Milch","Käse":"Bio-Käse guter Marken","Nüsse & Hülsenfrüchte":"Walnüsse","Feinkost":"Olivenöl","Haushalt":"Haushalt"};
IMG["Sonstiges"]="img/icon-sonstiges.png";
ALIAS.push([/hack/i,"Hackfleisch gemischt"],[/mozzarella/i,"Büffelmozzarella"],[/feta|hirtenk|schafsk|ziegenk/i,"Feta (Schaf und Ziege)"],[/parmesan|parmigiano|grana padano|pecorino/i,"Parmigiano Reggiano"],[/k[äa]se|gouda|emmentaler|gruy|comt|appenzell/i,"Bio-Käse guter Marken"],[/joghurt/i,"Naturjoghurt"],[/skyr/i,"Skyr"],[/milch/i,"Laktosefreie Milch"]);
// Bild finden: exakter Name, dann Alias, dann dieselbe Artikelerkennung wie bei den Angeboten, erst danach das Bereichsbild
// Eigene Bilder je Artikel der Artikelliste (Dateiname = Artikelname ohne Umlaute, z. B. "Rote Zwiebeln" -> rote-zwiebeln.png)
const ART_FILES=new Set(["babyspinat.png","nashi-birnen.png","apfelschorle.png","aceto-balsamico.png", "aepfel.png", "allzweckreiniger.png", "ananas.png", "apfelessig.png", "apfelringe.png", "apfelsaft-naturtrueb.png", "appenzeller.png", "aprikosen.png", "auberginen.png", "austernpilze.png", "avocado.png", "baerlauch.png", "bananen.png", "basilikum.png", "batavia-und-blattsalate.png", "beeren-tiefgekuehlt.png", "belugalinsen.png", "bergkaese.png", "berglinsen-und-tellerlinsen.png", "birnen.png", "birnensaft.png", "blumenkohl.png", "blutorangen.png", "bohnen-im-glas.png", "bohnen-tiefgekuehlt.png", "brie.png", "brokkoli-tiefgekuehlt.png", "brokkoli.png", "brombeeren.png", "buchweizen.png", "bueffelmozzarella.png", "bulgur.png", "burrata.png", "buttermilch.png", "butternut-kuerbis.png", "camembert.png", "cantaloupe-und-charentais.png", "cashews.png", "champignons.png", "cheddar.png", "cherrytomaten.png", "chiasamen.png", "chicoree.png", "chili-frisch.png", "chinakohl.png", "clementinen-und-mandarinen.png", "couscous.png", "cranberries-getrocknet.png", "datteln.png", "dill.png", "dinkelflocken.png", "dinkelmehl.png", "dorade.png", "edamame-tiefgekuehlt.png", "eier-bio.png", "eier-freiland.png", "eisbergsalat.png", "endiviensalat.png", "ente.png", "entenbrust.png", "erbsen-getrocknet.png", "erbsen-tiefgekuehlt.png", "erdbeeren-tiefgekuehlt.png", "erdbeeren.png", "erdnuesse.png", "erdnussmus.png", "fassbutter-glaeserne-molkerei.png", "feigen.png", "feldsalat.png", "fenchel.png", "feta.png", "feuchtes-toilettenpapier.png", "forelle.png", "galiamelone.png", "gans.png", "garnelen.png", "getrocknete-aprikosen.png", "getrocknete-feigen.png", "getrocknete-mango.png", "getrocknete-pflaumen.png", "getrocknete-tomaten.png", "gojibeeren.png", "grana-padano.png", "granatapfel.png", "granatapfelkerne.png", "grapefruit.png", "grapefruitsaft.png", "griechischer-joghurt.png", "gruene-bohnen.png", "gruenkohl-tiefgekuehlt.png", "gruenkohl.png", "gruyere-und-comte.png", "gurken.png", "hackfleisch-lamm-und-rind.png", "haehnchen-ganz.png", "haehnchenbrustfilet.png", "haehnchenfluegel.png", "haehnchenschenkel.png", "haferflocken.png", "halloumi.png", "hanfsamen.png", "haselnuesse.png", "heidelbeeren-tiefgekuehlt.png", "heidelbeeren.png", "himbeeren-tiefgekuehlt.png", "himbeeren.png", "hirse.png", "hokkaido-kuerbis.png", "honigmelone.png", "ingwer-shot.png", "ingwer.png", "johannisbeeren.png", "kabeljau.png", "kaki.png", "kalbfleisch.png", "kaninchen.png", "kapern.png", "karottensaft.png", "kartoffeln.png", "kefir.png", "kichererbsen-getrocknet.png", "kichererbsen-im-glas.png", "kidneybohnen-getrocknet.png", "kirschen-tiefgekuehlt.png", "kirschen.png", "kiwi-gold.png", "kiwi.png", "knoblauch.png", "knollensellerie.png", "koerniger-frischkaese.png", "kohlrabi.png", "kokosnuss.png", "kokosoel.png", "kokosraspeln.png", "kombucha-voelkel.png", "kopfsalat.png", "koriander.png", "kraeuter-tiefgekuehlt.png", "kraeuterseitlinge.png", "kresse.png", "kuechenrolle.png", "kuerbiskerne.png", "kurkuma-frisch.png", "lachsfilet.png", "lachsforelle.png", "laktosefreie-milch.png", "lammfleisch.png", "lammkoteletts-und-lammsteaks.png", "lauch.png", "lauchzwiebeln.png", "leber.png", "leinsamen.png", "limetten.png", "litschi.png", "macadamia.png", "makrele-frisch.png", "makrelenfilets.png", "manchego.png", "mandelmus.png", "mandeln.png", "mango-tiefgekuehlt.png", "mango.png", "mangold.png", "maronen.png", "meeresfruechte-mischung.png", "minze.png", "mirabellen.png", "moehren.png", "muellbeutel.png", "mungbohnen.png", "muscheln.png", "naturjoghurt.png", "nektarinen.png", "netzmelone.png", "nordseekrabben.png", "nudeln-hartweizen.png", "nudeln-vollkorn.png", "nussmischung.png", "oliven.png", "olivenoel-nativ-extra.png", "orangen.png", "pak-choi.png", "palmkohl.png", "pangasius.png", "papaya.png", "paprika.png", "paranuesse.png", "parmigiano-reggiano.png", "passionsfrucht.png", "pastinaken.png", "pecorino.png", "pekannuesse.png", "petersilie.png", "pfifferlinge.png", "pfirsiche.png", "pflaumen-und-zwetschgen.png", "physalis.png", "piel-de-sapo.png", "pinienkerne.png", "pistazien.png", "polenta.png", "pomelo.png", "putenbrust.png", "putengulasch-und-putenkeule.png", "quinoa.png", "quitten.png", "radicchio.png", "radieschen.png", "raw-kefir-voelkel.png", "reis-basmati.png", "reis-vollkorn.png", "rettich.png", "rhabarber.png", "rinderbeinscheibe-und-suppenfleisch.png", "rinderbraten.png", "rinderfilet.png", "rindergulasch.png", "rinderhackfleisch.png", "rindersteak.png", "risottoreis.png", "roastbeef.png", "rohschinken.png", "romanasalat.png", "rosenkohl-tiefgekuehlt.png", "rosenkohl.png", "rosinen-und-sultaninen.png", "rosmarin-und-thymian.png", "rotbarsch.png", "rote-bete.png", "rote-linsen.png", "rote-zwiebeln.png", "rotkohl.png", "rucola.png", "saibling.png", "salsiccia.png", "sardinen.png", "sauerkraut.png", "schalotten.png", "schnittlauch.png", "scholle.png", "schwarze-bohnen.png", "schwarzwurzeln.png", "seehecht.png", "seelachsfilet.png", "sesam.png", "shiitake.png", "skyr.png", "sonnenblumenkerne.png", "spargel-gruen.png", "spargel-weiss.png", "spinat-tiefgekuehlt.png", "spinat.png", "spitzkohl.png", "spitzpaprika.png", "sprossen.png", "spuelmaschinentabs.png", "spuelmittel.png", "stachelbeeren.png", "staudensellerie.png", "suesskartoffeln.png", "suppengruen.png", "tahin.png", "taschentuecher.png", "thunfisch-im-glas.png", "thunfischsteak.png", "tintenfisch.png", "toilettenpapier.png", "tomaten.png", "topinambur.png", "walnuesse.png", "waschmittel.png", "wassermelone.png", "weichspueler.png", "weintrauben-dunkel.png", "weintrauben-hell.png", "weisse-bohnen-getrocknet.png", "weisskohl.png", "weizenmehl.png", "wild.png", "wildlachs.png", "wirsing.png", "wolfsbarsch.png", "wurzelpetersilie.png", "zander.png", "ziegenkaese.png", "ziegenmilch.png", "zitronen.png", "zitronengras.png", "zucchini.png", "zuckermais.png", "zuckerschoten.png", "zwiebeln.png"]);
const slugOf=n=>String(n||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")+".png";
function icon(art,grp){{const f=slugOf(art);if(ART_FILES.has(f))return "img/a/"+f}if(IMG[art])return IMG[art];for(const [re,n] of ALIAS)if(re.test(art||""))return IMG[n];
  let a=null;try{a=artFor(art||"")}catch(e){}if(a&&IMG[a])return IMG[a];
  return (grp&&IMG[GIMG[grp]])||IMG["Sonstiges"]}
const KNOWN=new Set(ARTICLES.map(a=>a[0]));

const st={q:"",grp:"Alle",app:true,soon:true,dauer:true,bio:false,stl:true,mine:false,off:new Set()};
try{const s=JSON.parse(localStorage.getItem("bpf2")||"{}");if(s.off)st.off=new Set(s.off);for(const k of["app","soon","dauer","bio","stl","mine"])if(typeof s[k]==="boolean")st[k]=s[k]}catch(e){}
// Bio-Läden: dort nur ausgewählte Lieblingsprodukte zeigen (im Menü änderbar, je Person gespeichert)
const BIO_SHOPS=["Alnatura","denn's Biomarkt"];
let pick={shops:{"Alnatura":true,"denn's Biomarkt":true},terms:["gläserne butter","voelkel kefir","voelkel kombucha"]};
try{const s=JSON.parse(localStorage.getItem("bpf_auswahl")||"null");if(s&&s.shops&&Array.isArray(s.terms))pick=s}catch(e){}
// Im Laden nicht gefundene Angebote: je Person ausgeblendet, bis das Angebot abläuft (offerId -> gültig bis)
let gone={};
try{const s=JSON.parse(localStorage.getItem("bpf_weg")||"null");if(s&&typeof s==="object")gone=s}catch(e){}
const pruneGone=()=>{const now=new Date();for(const k of Object.keys(gone))if(gone[k]&&new Date(gone[k])<now)delete gone[k]};pruneGone();
const fold=s=>String(s||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss");
const pickOk=r=>{if(!pick.shops[r.retailer])return true;const h=fold(r.product+" "+r.brand+" "+r.description+" "+r.category);
  return pick.terms.some(t=>{const w=fold(t).split(/\s+/).filter(Boolean);return w.length&&w.every(x=>h.includes(x))})};
const save=()=>{try{localStorage.setItem("bpf2",JSON.stringify({off:[...st.off],app:st.app,soon:st.soon,dauer:st.dauer,bio:st.bio,stl:st.stl,mine:st.mine}))}catch(e){}};
let rows=[],lastVis=[],fils=[];
// Filialen je Angebot: gleiche Kette und (falls bekannt) in einer PLZ, für die marktguru das Angebot geliefert hat
// Startort fuer Entfernungen: Lokhalle Freiburg, Paul-Ehrlich-Straße 7
const START={name:"Lokhalle",lat:48.0143974,lng:7.8449242};
const kmTo=(lat,lng)=>{if(!(lat&&lng))return null;const R=6371,r=Math.PI/180,dLa=(lat-START.lat)*r,dLo=(lng-START.lng)*r;const a=Math.sin(dLa/2)**2+Math.cos(START.lat*r)*Math.cos(lat*r)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(a))};
const kmTxt=k=>k==null?"":(k<1?Math.round(k*1000/50)*50+" m":k.toFixed(1).replace(".",",")+" km");
const NOFOOD=/möbel|braun|xxxl|ikea|porta|segmüller|höffner|poco|roller|hornbach|bauhaus|\bobi\b|toom|hagebau/i;
const plzOf=f=>(String(f.adresse||"").match(/\b(\d{5})\b/)||[])[1]||"";
function shops(o){
  const fs=fils.filter(f=>f.retailer===o.retailer);
  if(!o.plz)return fs;
  const z=o.plz.split(",");return fs.filter(f=>z.includes(f.plz));
}
const hasChain=r=>fils.some(f=>f.retailer===r);
function shopHtml(o){
  if(!fils.length||!hasChain(o.retailer))return"";
  const fs=shops(o);
  if(!fs.length)return`<div class="shops"><span class="none">in keiner deiner Filialen gemeldet</span></div>`;
  return`<div class="shops">${fs.map(f=>`<span class="${f.km!=null&&f.km<=1.5?"in":""}">${esc(String(f.adresse).replace(/,.*$/,""))}${f.km!=null?" · "+kmTxt(f.km):""}</span>`).join("")}</div>`;
}

// Suche
const qEl=document.getElementById("q");
qEl.addEventListener("input",()=>{st.q=qEl.value.trim().toLowerCase();render();scheduleCount()});

// Schnellsuche: zählt, welche Artikel du wirklich suchst (dauerhaft je Person gespeichert)
const QKEY="bpf_qcount";
let qc={};try{qc=JSON.parse(localStorage.getItem(QKEY)||"{}")||{}}catch(e){qc={}}
let qdoc=null,qSaving=false,qDirty=false,lastCounted="",qTimer=null;
const quickEl=document.getElementById("quick"),qlbl=document.getElementById("qlbl");
function renderQuick(){
  quickEl.querySelectorAll(".chip").forEach(c=>c.remove());
  const learned=Object.entries(qc).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],"de")).slice(0,12);
  const names=learned.map(x=>x[0]);
  for(const w of QUICK){if(names.length>=12)break;if(!names.some(n=>n.toLowerCase()===w.toLowerCase()))names.push(w)}
  qlbl.textContent=learned.length?"Meist gesucht":"Schnell";
  names.forEach(w=>{const n=qc[w]||0;const b=document.createElement("button");b.type="button";b.className="chip";b.dataset.w=w.toLowerCase();
    const g=(rows.find(r=>r.art===w)||{}).grp;
    b.innerHTML=`<img src="${icon(w,g)}" alt="">${esc(w)}${n?`<span class="n">${n}</span>`:""}`;
    b.onclick=()=>{const same=st.q===w.toLowerCase();qEl.value=same?"":w;st.q=same?"":w.toLowerCase();render();if(!same)countTerm(w)};
    quickEl.appendChild(b)});
  document.getElementById("qinfo").textContent=learned.length?`${Object.values(qc).reduce((a,b)=>a+b,0)} Suchen gezählt`:"Schnellsuche lernt aus deinen Suchen";
}
// Suchbegriff auf den Artikel abbilden, den die Treffer am häufigsten zeigen
function termFor(q,vis){
  const ql=q.toLowerCase(),hit=ARTICLES.find(([n])=>n.toLowerCase()===ql||n.toLowerCase().startsWith(ql)&&ql.length>=4);
  if(hit)return hit[0];
  const c={};vis.forEach(r=>c[r.art]=(c[r.art]||0)+1);const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
  return top?top[0]:null;
}
function scheduleCount(){clearTimeout(qTimer);if(st.q.length<3)return;qTimer=setTimeout(()=>{const t=termFor(st.q,lastVis);if(t&&lastVis.length)countTerm(t)},1500)}
function countTerm(t){
  if(t===lastCounted)return;lastCounted=t;
  qc[t]=(qc[t]||0)+1;try{localStorage.setItem(QKEY,JSON.stringify(qc))}catch(e){}
  renderQuick();render();persistQ();
}
async function persistQ(){
  if(!qdoc)return;if(qSaving){qDirty=true;return}
  qSaving=true;try{await qdoc.set({terms:Object.entries(qc).map(([t,n])=>({t,n})),updated:new Date().toISOString()})}catch(e){}
  qSaving=false;if(qDirty){qDirty=false;persistQ()}
}
(async()=>{
  try{
    const [db,u]=await Promise.all([claude.use("db"),claude.use("user")]);if(!db||!u)return;
    const id=await u.id();if(!id)return;
    const owner=await u.isOwner().catch(()=>false);
    if(!owner){const pa=document.getElementById("padd");if(pa)pa.hidden=true;document.body.classList.add("gast")}
    saveDishes.attach(db,id,owner);saveCart.attach(db,id,owner);savePick.attach(db,id,owner);saveGone.attach(db,id,owner);
    initFeedback(db,id,owner);
    qdoc=db.collection("data/users/"+id).doc("suchen");
    const snap=await qdoc.get();const remote=snap.exists?(snap.data().terms||[]):[];
    let changed=false;
    for(const x of remote){const [t,n]=Array.isArray(x)?x:[x&&x.t,x&&x.n];if(typeof t==="string"&&typeof n==="number"&&n>(qc[t]||0)){qc[t]=n;changed=true}}
    const remoteMap=Object.fromEntries(remote.map(x=>Array.isArray(x)?x:[x&&x.t,x&&x.n]));
    const localAhead=Object.entries(qc).some(([t,n])=>n>(remoteMap[t]||0));
    if(changed){try{localStorage.setItem(QKEY,JSON.stringify(qc))}catch(e){}renderQuick();render()}
    if(localAhead)persistQ();
  }catch(e){}
})();
document.getElementById("qreset").onclick=()=>{qc={};lastCounted="";try{localStorage.removeItem(QKEY)}catch(e){}renderQuick();render();persistQ()};

// Bereiche
const grpsEl=document.getElementById("grps");
["Alle",...GROUPS].forEach(g=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=g;b.dataset.g=g;b.onclick=()=>{st.grp=g;render()};grpsEl.appendChild(b)});

renderQuick();

// Menü oben rechts
const mbtn=document.getElementById("mbtn"),menu=document.getElementById("menu");
const setMenu=o=>{menu.hidden=!o;mbtn.setAttribute("aria-expanded",o)};
mbtn.onclick=e=>{e.stopPropagation();setMenu(menu.hidden)};
document.addEventListener("click",e=>{if(!menu.hidden&&!menu.contains(e.target))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden){setMenu(false);mbtn.focus()}});
for(const k of["app","soon","dauer","bio","stl","mine"]){const el=document.getElementById(k);el.checked=st[k];el.onchange=()=>{st[k]=el.checked;save();render()}}
const storesEl=document.getElementById("stores");
function buildStores(){
  storesEl.innerHTML="";
  const counts={};rows.forEach(r=>counts[r.retailer]=(counts[r.retailer]||0)+1);
  const near=k=>{const f=fils.find(x=>x.retailer===k&&x.km!=null);return f?f.km:null};
  Object.keys(counts).sort((a,b)=>((near(a)??99)-(near(b)??99))||counts[b]-counts[a]).forEach(k=>{
    const l=document.createElement("label");l.className="sopt";
    l.innerHTML=`<input type="checkbox" ${st.off.has(k)?"":"checked"}>${logo(k)}<span>${esc(sname(k))}</span><small>${near(k)!=null?kmTxt(near(k))+" · ":""}${counts[k]}</small>`;
    l.querySelector("input").onchange=e=>{e.target.checked?st.off.delete(k):st.off.add(k);save();render()};
    storesEl.appendChild(l)});
}
const allStores=()=>[...new Set(rows.map(r=>r.retailer))];
document.getElementById("sall").onclick=()=>{st.off.clear();save();buildStores();render()};
document.getElementById("snone").onclick=()=>{allStores().forEach(k=>st.off.add(k));save();buildStores();render()};

// Angebote, die nur noch heute gelten: roter Rahmen statt Etikett
const oneDay=r=>r.kind==="angebot"&&status(r,new Date())==="last";
function status(r,now){
  const f=r.validFrom?new Date(r.validFrom):null, t=r.validTo?new Date(r.validTo):null;
  if(t&&t<now)return"exp"; if(f&&f>now)return"soon";
  if(t&&t-now<36e5*24&&t.getDate()===now.getDate())return"last"; return"now";
}
const isBio=r=>/\bbio\b|bio-|naturland|bioland|demeter|nur nur natur|rewe bio|k-bio|biobio/i.test(r.product+" "+r.brand+" "+r.description)||/denn|alnatura/i.test(r.retailer);

function render(){
  const now=new Date();
  grpsEl.querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===st.grp));
  quickEl.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b.dataset.w===st.q));
  const nOff=rows.length?allStores().filter(k=>st.off.has(k)).length+(st.bio?1:0)+(st.app?0:1)+(st.soon?0:1)+(st.dauer?0:1)+(st.mine?1:0):0;
  const bd=document.getElementById("mbadge");bd.hidden=!nOff;bd.textContent=nOff;
  applyView();
  if(st.view==="shop"){renderShop();return}
  if(st.view==="saison"){renderSaison();return}
  if(st.view==="prosp"){renderProsp(now);return}
  if(st.view==="pruef"){renderPruef();return}
  if(st.view==="essen"){renderEssen();return}
  const list=document.getElementById("list");
  if(!rows.length)return;
  const vis=rows.map(r=>({...r,st:status(r,now)})).filter(r=>{
    if(r.st==="exp")return false; if(r.st==="soon"&&!st.soon)return false;
    if(!st.dauer&&r.kind!=="angebot")return false; if(!st.app&&r.loyalty)return false; if(st.off.has(r.retailer))return false; if(!pickOk(r))return false; if(gone[r.offerId]!==undefined)return false;
    if(st.bio&&!isBio(r))return false; if(st.mine&&fils.length&&!shops(r).length)return false; if(st.grp!=="Alle"&&r.grp!==st.grp)return false;
    if(st.q){const h=clean(r.product+" "+r.brand+" "+r.description+" "+r.category+" "+r.art).toLowerCase();if(!h.includes(st.q)&&!(SYN[st.q]&&h.includes(SYN[st.q])))return false}
    return r.refPrice!=null});
  lastVis=vis;
  list.innerHTML="";
  if(!vis.length){list.innerHTML=`<div class="empty">Kein Preis passt gerade${st.q?` zu „${esc(st.q)}“`:""}. Andere Schreibweise probieren oder im Menü oben rechts mehr Läden einschalten.</div>`;return}
  if(!st.q&&st.stl)renderSteals(vis,list);
  // Gruppieren: Bereich > Kategorie > Einheit
  for(const g of GROUPS){
    const inG=vis.filter(r=>r.grp===g); if(!inG.length)continue;
    const sec=document.createElement("section");sec.className="cat";sec.dataset.g=g;sec.innerHTML=`<h2>${esc(g)}</h2><div class="igrid"></div>`;const grid=sec.lastChild;
    // Jeder Artikel nur einmal je Bereich; verschiedene Einheiten (kg, Stück) stehen im gelben Preisfeld
    const cats={};inG.forEach(r=>{const k=r.art||r.product;(cats[k]=cats[k]||[]).push(r)});
    Object.keys(cats).sort((a,b)=>a.localeCompare(b,"de")).forEach(cat=>{
      const cnt={};cats[cat].forEach(o=>cnt[o.unit]=(cnt[o.unit]||0)+1);
      const units=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]);
      const arr=cats[cat].sort((a,b)=>units.indexOf(a.unit)-units.indexOf(b.unit)||a.refPrice-b.refPrice);
      const bestOf=u=>{const a=arr.filter(o=>o.unit===u);return a.find(o=>o.st!=="soon")||a[0]};
      const best=bestOf(units[0]), unit=units[0];
      const maxU={};arr.forEach(o=>maxU[o.unit]=Math.max(maxU[o.unit]||0,o.refPrice||0));
      const uTxt=u=>"€/"+(u==="Stk"?"Stk":u);
      const nOffers=arr.filter(o=>o.kind==="angebot"&&o.st!=="soon").length;
      const d=document.createElement("details");d.className="item";d.open=!!st.q;
      d.innerHTML=`<summary>
        <img class="px" src="${icon(cat,g)}" alt="">
        <div class="itxt"><div class="iname">${esc(cat)}${nOffers?`<span class="obadge" title="${nOffers} ${nOffers===1?"Angebot":"Angebote"} gerade">% ${nOffers}</span>`:""}</div></div>
        <button type="button" class="addb" data-art="${esc(cat)}" data-u="${esc(unit)}" aria-label="${esc(cat)} auf die Einkaufsliste" title="Auf die Einkaufsliste">+</button>
        <div class="tag${units.length>1?" multi":""}"><div class="u">ab</div>${units.slice(0,2).map(u=>`<div class="p">${eur(bestOf(u).refPrice).replace(" €","")}</div><div class="u">${esc(uTxt(u))}</div>`).join("")}</div>
      </summary>
      <div class="tablewrap"><table class="offers"><thead><tr><th>Laden</th><th>Produkt</th><th style="text-align:right">Preis</th><th style="text-align:right">Grundpreis</th><th>Gültig</th></tr></thead><tbody>
      ${arr.map((o,i)=>`<tr class="${o===best?"best":""}${oneDay(o)?" oneday":""}">
        <td><span class="st">${logo(o.retailer)}${esc(sname(o.retailer))}</span>${shopHtml(o)}${o.kind==="angebot"?`<button type="button" class="gone" data-gone="${o.offerId}" title="Im Laden nicht gefunden: ausblenden, bis das Angebot abläuft">nicht gefunden</button>`:""}</td>
        <td class="pname"><strong>${esc(o.product)}</strong>${o.brand?` <span class="meta">${esc(o.brand)}</span>`:""}${pills(o)}<div class="meta">${esc(o.description)}</div><div class="bar"><i style="width:${Math.max(6,Math.round(o.refPrice/(maxU[o.unit]||1)*100))}%"></i></div></td>
        <td class="num">${eur(o.price)}${o.oldPrice?`<span class="strike">${eur(o.oldPrice)}</span>`:""}${amt(o)?`<div class="meta">für ${amt(o)}</div>`:""}</td>
        <td class="num"><strong>${eur(o.refPrice)}</strong><div class="meta">je ${esc(UNIT[o.unit]||o.unit)}</div></td>
        <td style="white-space:nowrap">${!o.validFrom&&!o.validTo?`<span class="meta">${o.kind==="normalpreis"?"Normalpreis":o.kind==="bonpreis"?"Euer Bonpreis":"Dauerpreis"}</span>`:`${o.validFrom?dfmt(new Date(o.validFrom)):""}<br><span class="meta">bis ${o.validTo?dfmt(new Date(o.validTo)):"?"}</span>`}</td></tr>`).join("")}
      </tbody></table></div>`;
      grid.appendChild(d)});
    list.appendChild(sec);
  }
}

const med=a=>{const t=[...a].sort((x,y)=>x-y),m=t.length>>1;return t.length%2?t[m]:(t[m-1]+t[m])/2};
let lastTop=[];
// Top 20: nur echte Senkungen gegenüber dem eigenen Normalpreis des Artikels
// (Streichpreis, Dauer- oder Normalpreis im selben Laden, üblicher Angebotspreis).
// Rang nach stärkster Senkung in Prozent oder größter Ersparnis in Euro je Packung.
// Packungsgröße aus Preis und Grundpreis, z. B. 4 kg, 500 g, 6 Stück
function amt(r){
  if(!(r.price>0&&r.refPrice>0))return"";const q=r.price/r.refPrice;
  const n=(v,d)=>(+v.toFixed(d)).toLocaleString("de-DE");
  if(r.unit==="kg")return q<1?(q<.1?Math.round(q*1000/5)*5:Math.round(q*100)*10)+" g":n(q,2)+" kg";
  if(r.unit==="l")return q<1?(q<.1?Math.round(q*1000/5)*5:Math.round(q*100)*10)+" ml":n(q,2)+" l";
  if(r.unit==="Stk"){const k=Math.round(q);return k>=1?k+(k===1?" Stück":" Stück"):""}
  return"";
}
function steals(vis){
  const by={};vis.forEach(r=>{const k=r.art+"|"+r.unit;(by[k]=by[k]||[]).push(r)});
  // Üblicher Marktpreis je Artikel: Median der Dauer- und Normalpreise aus allen Läden (mindestens 3 Werte)
  const mk={};rows.forEach(o=>{if(o.kind!=="angebot"&&o.art&&o.refPrice>0){const k=o.art+"|"+o.unit;(mk[k]=mk[k]||[]).push(o.refPrice)}});
  const market=r=>{const a=r.art&&mk[r.art+"|"+r.unit];return a&&a.length>=3?med(a):null};
  const out=[];
  for(const r of vis){
    if(r.kind!=="angebot"||r.st==="soon"||!(r.price>0)||!(r.refPrice>0))continue;
    const u=UNIT[r.unit]||r.unit,pack=r.price/r.refPrice;
    let ref=null;
    if(r.oldPrice&&r.oldPrice>r.price){
      // Streichpreis nur, wenn er zum üblichen Marktpreis passt; eine aufgeblähte UVP wird durch den Marktpreis ersetzt
      const m=market(r),uvp=r.oldPrice/pack;
      if(m&&uvp>m*1.15){if(m>r.refPrice)ref={pct:1-r.refPrice/m,save:(m-r.refPrice)*pack,why:`statt ${eur(r.oldPrice)}, üblich ${eur(m)} je ${u}`};else continue}
      else ref={pct:1-r.price/r.oldPrice,save:r.oldPrice-r.price,why:`statt ${eur(r.oldPrice)}`}}
    if(!ref){const reg=(by[r.art+"|"+r.unit]||[]).filter(o=>o.kind!=="angebot"&&o.retailer===r.retailer).map(o=>o.refPrice);
      if(reg.length){const m=Math.min(...reg);if(m>r.refPrice)ref={pct:1-r.refPrice/m,save:(m-r.refPrice)*pack,why:`sonst ab ${eur(m)} je ${u} im Laden`}}}
    if(!ref&&r.regRef>r.refPrice)ref={pct:1-r.refPrice/r.regRef,save:(r.regRef-r.refPrice)*pack,why:`sonst ${eur(r.regRef)} je ${u} im Laden`};
    if(!ref&&r.usualRef&&r.usualN>=2&&r.usualRef>r.refPrice)ref={pct:1-r.refPrice/r.usualRef,save:(r.usualRef-r.refPrice)*pack,why:`sonst meist ${eur(r.usualRef)} je ${u}`};
    if(!ref||ref.pct>.75||ref.pct<.05)continue;
    if(ref.pct<.15&&ref.save<1.5)continue;
    out.push({r,d:ref.pct,save:ref.save,why:ref.why,score:Math.max(ref.pct/.5,ref.save/5)});
  }
  // Jeder Artikel nur einmal (z. B. nicht zweimal Karotten): pro Artikel zählt das stärkste Angebot
  const seenArt=new Set(),uniq=[];
  for(const x of out.sort((a,b)=>b.score-a.score)){const k=String(x.r.art||x.r.product).toLowerCase();if(seenArt.has(k))continue;seenArt.add(k);uniq.push(x);if(uniq.length>=20)break}
  return uniq;
}
function renderSteals(vis,list){
  const top=steals(vis);lastTop=top;if(!top.length)return;
  const sec=document.createElement("section");sec.className="steals";
  const card=(x,i)=>`<div class="scard${oneDay(x.r)?" oneday":""}" role="button" tabindex="0" data-i="${i}" title="Details zu ${esc(x.r.product)}"><div class="rank"><img class="px" src="${icon(x.r.art,x.r.grp)}" alt=""><b>${i+1}</b></div>
      <div class="nm">${esc(x.r.product)}${pills(x.r)}</div><div class="pct">−${Math.round(x.d*100)} %</div>
      <div class="pr"><strong>${eur(x.r.price)}</strong>${amt(x.r)?` <b class="amt">für ${amt(x.r)}</b>`:""}<span>spart ${eur(x.save)} · ${esc(x.why)}</span></div></div>`;
  // Spalten je Laden, absteigend nach Summe der Punkte (wo sich der Weg am meisten lohnt); die ersten drei bekommen Gold, Silber, Bronze
  const by={};top.forEach((x,i)=>(by[x.r.retailer]=by[x.r.retailer]||[]).push([x,i]));
  const sum=a=>a.reduce((t,[x])=>t+x.score,0);
  const cols=Object.entries(by).sort((p,q)=>sum(q[1])-sum(p[1])||p[1][0][1]-q[1][0][1]);
  const MED=["gold","silber","bronze"];
  sec.innerHTML=`<h2>Top ${top.length} Steals <small>am stärksten reduziert, in Prozent oder Euro</small></h2><div class="scols">${cols.map(([r,arr],k)=>`
    <div class="scol${k<3?" m-"+MED[k]:""}"><div class="shead">${k<3?`<span class="medal" title="Platz ${k+1}">${k+1}</span>`:""}${logo(r)}<span class="sn">${esc(sname(r))}</span><span class="cnt">${arr.length} ${arr.length===1?"Steal":"Steals"}<br><b class="ssum">spart ${eur(arr.reduce((t,[x])=>t+x.save,0))}</b></span></div>
      ${arr.map(([x,i])=>card(x,i)).join("")}</div>`).join("")}</div>`;
  list.appendChild(sec);
}
function pills(o){let h="";if(o.kind==="dauerpreis")h+=`<span class="pill reg">Dauerpreis</span>`;if(o.kind==="normalpreis")h+=`<span class="pill reg">Normalpreis</span>`;if(o.kind==="bonpreis")h+=`<span class="pill bon">Euer Bonpreis</span>`;if(o.loyalty)h+=`<span class="pill app">App-Preis</span>`;if(o.st==="soon"){const f=new Date(o.validFrom),t=o.validTo?new Date(o.validTo):null;h+=`<span class="pill soon">${t&&t-f<36e5*24?"nur":"ab"} ${dfmt(f)}</span>`}return h}

// ===== Einkaufen: gespeicherte Gerichte und Einkaufsliste =====
const UNITS=["g","kg","Stk","ml","l","Bund","Pck"];
const FAM={g:["m",1],kg:["m",1000],ml:["v",1],l:["v",1000],Stk:["c",1],Bund:["b",1],Pck:["p",1]};
const ARTNAMES=new Set(ARTICLES.map(a=>a[0]));
const uid=()=>Math.random().toString(36).slice(2,10);
const lsGet=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||"null");return v??d}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let dishes=lsGet("bpf_gerichte",[]);
let cart=Object.assign({dishes:[],extra:[],done:[]},lsGet("bpf_einkauf",{}));
// Dauerhaft speichern: privat je Person in der Seiten-Datenbank, im Browser als Zwischenstand
// scope: "user" = nur für dich, "haushalt" = gemeinsam (Einkaufsliste, Gerichte), "einstellungen" = alle lesen, nur du schreibst
function syncedDoc(name,getVal,setVal,scope="user"){
  let ref=null,saving=false,dirty=false,canWrite=true;
  async function save(){lsSet("bpf_"+name,getVal());if(!ref||!canWrite)return;if(saving){dirty=true;return}
    saving=true;try{await ref.set({v:getVal(),updated:new Date().toISOString()})}catch(e){}
    saving=false;if(dirty){dirty=false;save()}}
  save.attach=async(db,id,owner)=>{
    ref=scope==="user"?db.collection("data/users/"+id).doc(name):db.collection(scope).doc(name);
    canWrite=scope!=="einstellungen"||owner;
    try{const s=await ref.get();const d=s.exists?s.data():null;
      if(d&&d.v!=null){setVal(d.v);lsSet("bpf_"+name,getVal());render()}
      else if(owner){
        // Umzug: deine bisherigen eigenen Daten werden einmalig in den gemeinsamen Speicher übernommen
        if(scope!=="user"){try{const o=await db.collection("data/users/"+id).doc(name).get();const od=o.exists?o.data():null;if(od&&od.v!=null){setVal(od.v);render()}}catch(e){}}
        save()}
      if(scope!=="user")ref.onSnapshot(sn=>{if(saving||!sn.exists||sn.metadata.hasPendingWrites)return;const dv=sn.data();
        if(dv&&dv.v!=null&&JSON.stringify(dv.v)!==JSON.stringify(getVal())){setVal(dv.v);lsSet("bpf_"+name,getVal());render()}},()=>{});
    }catch(e){}};
  return save;
}
// Gespeicherte Daten kommen schreibgeschützt aus der Datenbank: als bearbeitbare Kopie übernehmen
const thaw=v=>JSON.parse(JSON.stringify(v));
const saveDishes=syncedDoc("gerichte",()=>dishes,v=>{if(Array.isArray(v))dishes=thaw(v)},"haushalt");
const savePick=syncedDoc("auswahl",()=>pick,v=>{if(v&&v.shops&&Array.isArray(v.terms)){pick=thaw(v);buildPick()}},"einstellungen");
function buildPick(){
  const ps=document.getElementById("pshops");ps.innerHTML="";
  for(const k of BIO_SHOPS){const l=document.createElement("label");l.innerHTML=`<input type="checkbox" ${pick.shops[k]?"checked":""}> ${esc(sname(k))}`;
    l.querySelector("input").onchange=e=>{pick.shops[k]=e.target.checked;savePick();render()};ps.appendChild(l)}
  const pt=document.getElementById("pterms");pt.innerHTML="";
  pick.terms.forEach((t,i)=>{const s=document.createElement("span");s.className="cd";s.innerHTML=`${esc(t)}<button type="button" aria-label="${esc(t)} entfernen">×</button>`;
    s.querySelector("button").onclick=e=>{e.stopPropagation();pick.terms.splice(i,1);savePick();buildPick();render()};pt.appendChild(s)});
}
document.getElementById("padd").onsubmit=e=>{e.preventDefault();const el=document.getElementById("pnew");const v=el.value.trim().toLowerCase();
  if(v&&!pick.terms.includes(v)){pick.terms.push(v);savePick();buildPick();render()}el.value=""};
buildPick();
const saveGone=syncedDoc("weg",()=>gone,v=>{if(v&&typeof v==="object"){gone=thaw(v);pruneGone();goneInfo()}});
function goneInfo(){const n=Object.keys(gone).length;const el=document.getElementById("goneinfo");if(el)el.textContent=n?`${n} Angebot${n===1?"":"e"} als nicht gefunden ausgeblendet`:"Keine Angebote ausgeblendet";const b=document.getElementById("gonereset");if(b)b.hidden=!n}
function hideGone(id){const r=rows.find(o=>String(o.offerId)===String(id));if(!r)return;gone[r.offerId]=r.validTo||"";saveGone();goneInfo();render()}
document.getElementById("list").addEventListener("click",e=>{const b=e.target.closest("[data-gone]");if(!b)return;e.preventDefault();e.stopPropagation();hideGone(b.dataset.gone)});
document.getElementById("gonereset").onclick=e=>{e.stopPropagation();gone={};saveGone();goneInfo();render()};
goneInfo();
const saveCart=syncedDoc("einkauf",()=>cart,v=>{if(v&&typeof v==="object")cart=Object.assign({dishes:[],extra:[],done:[]},thaw(v))},"haushalt");

function artFor(n){
  const t=clean(n).trim();if(ARTNAMES.has(t)||rows.some(r=>r.art===t))return t;
  const l=t.toLowerCase();if(!l)return null;
  const [a,b]=AGRP["Fisch"];for(const [nm,re] of ARTICLES.slice(a,b))if(re.test(l))return nm;
  for(const [nm,re] of ARTICLES)if(re.test(l))return nm;
  return null;
}
const grpOf=art=>{const r=rows.find(x=>x.art===art);if(r)return r.grp;for(const g in AGRP){const [a,b]=AGRP[g];if(ARTICLES.slice(a,b).some(x=>x[0]===art))return g}return "Gemüse"};
function baseOk(r,now){const s=status(r,now);if(s==="exp")return false;if(s==="soon"&&!st.soon)return false;
  if(!st.app&&r.loyalty)return false;if(st.off.has(r.retailer))return false;if(!pickOk(r))return false;if(gone[r.offerId]!==undefined)return false;if(st.bio&&!isBio(r))return false;if(st.mine&&fils.length&&!shops(r).length)return false;return r.refPrice!=null}
let shopRows=[];
function bestFor(art,fam){
  if(!art)return null;const c=shopRows.filter(r=>r.art===art);if(!c.length)return null;
  const want={m:"kg",v:"l",c:"Stk"}[fam];const m=c.filter(r=>r.unit===want);const pool=(m.length?m:c).slice().sort((a,b)=>a.refPrice-b.refPrice);
  return {o:pool[0],n:c.length};
}
function costOf(o,fam,base){if(!o)return null;
  if(fam==="m"&&o.unit==="kg")return base/1000*o.refPrice;if(fam==="v"&&o.unit==="l")return base/1000*o.refPrice;
  if(fam==="c"&&o.unit==="Stk")return base*o.refPrice;return o.price}
const nf=n=>(Math.round(n*100)/100).toLocaleString("de-DE",{maximumFractionDigits:2});
function qtyTxt(fam,base,unit){
  if(fam==="m")return base>=1000?nf(base/1000)+" kg":Math.round(base)+" g";
  if(fam==="v")return base>=1000?nf(base/1000)+" l":Math.round(base)+" ml";
  return nf(base)+" "+(fam==="c"?"Stk":unit);
}
function buildList(){
  const map=new Map();
  const add=(n,q,u,src,extra)=>{const art=artFor(n);const [fam,f]=FAM[u]||["p",1];const key=(art||clean(n).trim().toLowerCase())+"|"+fam;
    let e=map.get(key);if(!e){e={key,name:art||clean(n).trim(),art,fam,base:0,unit:u,src:new Set(),extra:false};map.set(key,e)}
    e.base+=(+q||0)*f;if(src)e.src.add(src);if(extra)e.extra=true};
  cart.dishes.forEach(cd=>{const d=dishes.find(x=>x.id===cd.id);if(!d)return;const k=cd.portions/(d.portions||1);d.items.forEach(i=>add(i.n,(+i.q||0)*k,i.u,d.name,false))});
  cart.extra.forEach(x=>add(x.n,x.q,x.u,null,true));
  const items=[...map.values()];
  items.forEach(e=>{e.best=bestFor(e.art,e.fam);e.cost=e.best?costOf(e.best.o,e.fam,e.base):null;e.done=cart.done.includes(e.key)});
  return items;
}
function dishCost(d,portions){let s=0,miss=0;d.items.forEach(i=>{const art=artFor(i.n);const [fam,f]=FAM[i.u]||["p",1];const b=bestFor(art,fam);
  const c=b?costOf(b.o,fam,(+i.q||0)*f*(portions/(d.portions||1))):null;c==null?miss++:s+=c});return {s,miss}}

// Ansicht wechseln
const views=document.querySelectorAll(".views button");
st.view=lsGet("bpf_view","deals");
views.forEach(b=>b.onclick=()=>{st.view=b.dataset.v;lsSet("bpf_view",st.view);render();window.scrollTo(0,0)});
function applyView(){
  if(st.view==="pruef"&&!(typeof pruef!=="undefined"&&pruef&&pruef.on))st.view="deals";
  if(st.view==="essen"&&!(typeof essen!=="undefined"&&essen&&essen.on))st.view="deals";
  const shop=st.view==="shop",sai=st.view==="saison",pro=st.view==="prosp",pru=st.view==="pruef",ess=st.view==="essen",deals=!shop&&!sai&&!pro&&!pru&&!ess;
  views.forEach(b=>b.setAttribute("aria-selected",b.dataset.v===st.view));
  document.querySelector(".panel").hidden=!(deals||pro);document.getElementById("list").hidden=!deals;document.getElementById("prosp").hidden=!pro;document.getElementById("shop").hidden=!shop;document.getElementById("saison").hidden=!sai;document.getElementById("pruef").hidden=!pru;document.getElementById("essen").hidden=!ess;
  const open=buildList().filter(e=>!e.done).length;const cc=document.getElementById("ccount");cc.textContent=open||"";cc.hidden=!open;
}

// Einkaufsliste und Gerichte zeichnen
const shopEl=document.getElementById("shop");
function renderShop(){
  const now=new Date();shopRows=rows.filter(r=>baseOk(r,now));
  // Gerichte
  const dg=document.getElementById("dgrid");
  if(!dishes.length)dg.innerHTML=`<div class="empty">Noch keine Gerichte gespeichert. Leg mit „Neues Gericht“ dein erstes an.</div>`;
  else dg.innerHTML=dishes.map(d=>{const inC=cart.dishes.find(x=>x.id===d.id);const p=inC?inC.portions:d.portions||2;const c=dishCost(d,p);
    const first=artFor((d.items[0]||{}).n||"");
    return `<div class="dish${inC?" in":""}" data-id="${d.id}">
      <img class="px" src="${icon(first,grpOf(first))}" alt="">
      <div class="dtxt"><div class="dn">${esc(d.name)}</div><div class="dm">${d.items.length} Zutaten · ${p} Port.${rows.length?` · ca. ${eur(c.s)}${c.miss?` + ${c.miss} ohne Preis`:""}`:""}</div></div>
      <button type="button" class="ibtn" data-act="edit" aria-label="${esc(d.name)} bearbeiten" title="Bearbeiten"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button>
      <button type="button" class="abtn" data-act="add">${inC?"✓ auf Liste":"+ Liste"}</button></div>`}).join("");
  // Gerichte auf der Liste
  const ic=document.getElementById("incart");
  ic.innerHTML=cart.dishes.map(cd=>{const d=dishes.find(x=>x.id===cd.id);if(!d)return"";
    return `<span class="cd" data-id="${d.id}">${esc(d.name)}<button type="button" data-act="minus" aria-label="weniger Portionen">−</button><b>${cd.portions}</b><button type="button" data-act="plus" aria-label="mehr Portionen">+</button><button type="button" data-act="rm" aria-label="${esc(d.name)} entfernen">×</button></span>`}).join("");
  // Liste nach Laden
  const items=buildList();const lg=document.getElementById("lgroups");
  if(!items.length){lg.innerHTML=`<div class="empty">Die Liste ist leer. Füge ein Gericht hinzu oder tippe oben einen Artikel ein.</div>`;document.getElementById("ltotal").textContent="";return}
  const groups={};items.forEach(e=>{const k=e.best?e.best.o.retailer:"_";(groups[k]=groups[k]||[]).push(e)});
  const keys=Object.keys(groups).sort((a,b)=>a==="_"?1:b==="_"?-1:groups[b].length-groups[a].length);
  let total=0;
  lg.innerHTML=keys.map(k=>{const arr=groups[k].sort((a,b)=>a.done-b.done||a.name.localeCompare(b.name,"de"));
    const sub=arr.reduce((s,e)=>s+(e.cost||0),0);total+=sub;const open=arr.filter(e=>!e.done).length;
    return `<div class="lg"><div class="lh">${k==="_"?`<strong>Ohne Preis</strong>`:`${logo(k)}<strong>${esc(sname(k))}</strong>`}<span>${open} offen${k!=="_"?` · ca. ${eur(sub)}`:""}</span></div>
    ${arr.map(e=>{const o=e.best&&e.best.o;return `<label class="li${e.done?" done":""}" data-key="${esc(e.key)}">
      <input type="checkbox" ${e.done?"checked":""}><img class="px" src="${icon(e.art||e.name,e.art?grpOf(e.art):null)}" alt="">
      <span class="lt"><span class="ln"><b>${qtyTxt(e.fam,e.base,e.unit)}</b> ${esc(e.name)}</span>
      <span class="lo">${o?`${esc(o.product)} · ${eur(o.price)} (${eur(o.refPrice)}/${esc(o.unit)})${e.best.n>1?` · ${e.best.n} Preise`:""}${pills(o)}`:"kein Preis gefunden"}${e.src.size?` · für ${esc([...e.src].join(", "))}`:""}</span></span>
      ${e.cost!=null?`<span class="lc">${eur(e.cost)}</span>`:""}${e.extra?`<button type="button" class="ibtn" data-act="del" aria-label="${esc(e.name)} entfernen">×</button>`:""}</label>`}).join("")}</div>`}).join("");
  document.getElementById("ltotal").textContent=total?`ca. ${eur(total)} zu den günstigsten Preisen`:"";
}
shopEl.addEventListener("click",e=>{
  const b=e.target.closest("button");
  if(b&&b.closest(".dish")){const id=b.closest(".dish").dataset.id;const d=dishes.find(x=>x.id===id);
    if(b.dataset.act==="edit")openEditor(d);
    if(b.dataset.act==="add"){const c=cart.dishes.find(x=>x.id===id);if(c)c.portions+=d.portions||2;else cart.dishes.push({id,portions:d.portions||2});saveCart();render()}
    return}
  if(b&&b.closest(".cd")){const id=b.closest(".cd").dataset.id;const c=cart.dishes.find(x=>x.id===id);const d=dishes.find(x=>x.id===id)||{};
    if(b.dataset.act==="plus")c.portions++;if(b.dataset.act==="minus")c.portions=Math.max(1,c.portions-1);
    if(b.dataset.act==="rm")cart.dishes=cart.dishes.filter(x=>x.id!==id);saveCart();render();return}
  if(b&&b.dataset.act==="del"){e.preventDefault();const key=b.closest(".li").dataset.key;
    cart.extra=cart.extra.filter(x=>{const art=artFor(x.n);return (art||clean(x.n).trim().toLowerCase())+"|"+(FAM[x.u]||["p"])[0]!==key});saveCart();render()}
});
shopEl.addEventListener("change",e=>{const li=e.target.closest(".li");if(!li)return;const k=li.dataset.key;
  cart.done=e.target.checked?[...new Set([...cart.done,k])]:cart.done.filter(x=>x!==k);saveCart();render()});
const addU=document.getElementById("addu");UNITS.forEach(u=>addU.add(new Option(u,u)));addU.value="Stk";
function fillArtlist(){document.getElementById("artlist").innerHTML=[...new Set([...ARTICLES.map(a=>a[0]),...rows.map(r=>r.art)])].sort((a,b)=>a.localeCompare(b,"de")).map(a=>`<option value="${esc(a)}">`).join("")}
fillArtlist();
document.getElementById("addrow").onsubmit=e=>{e.preventDefault();const n=document.getElementById("addn").value.trim();if(!n)return;
  const q=parseFloat(String(document.getElementById("addq").value).replace(",","."))||1;cart.extra.push({n,q,u:addU.value});
  document.getElementById("addn").value="";document.getElementById("addq").value="";saveCart();render();document.getElementById("addn").focus()};
let clearArm=null;
document.getElementById("lclear").onclick=e=>{const b=e.currentTarget;
  if(!clearArm){b.textContent="Wirklich leeren?";b.classList.add("warn");clearArm=setTimeout(()=>{clearArm=null;b.textContent="Liste leeren";b.classList.remove("warn")},3000);return}
  clearTimeout(clearArm);clearArm=null;b.textContent="Liste leeren";b.classList.remove("warn");cart={dishes:[],extra:[],done:[]};saveCart();render()};
document.getElementById("ldone").onclick=()=>{const items=buildList();const doneKeys=new Set(items.filter(i=>i.done).map(i=>i.key));
  cart.extra=cart.extra.filter(x=>{const art=artFor(x.n);return !doneKeys.has((art||clean(x.n).trim().toLowerCase())+"|"+(FAM[x.u]||["p"])[0])});
  cart.dishes=cart.dishes.filter(cd=>{const d=dishes.find(x=>x.id===cd.id);if(!d)return false;
    return d.items.some(i=>{const art=artFor(i.n);return !doneKeys.has((art||clean(i.n).trim().toLowerCase())+"|"+(FAM[i.u]||["p"])[0])})});
  cart.done=cart.done.filter(k=>buildList().some(i=>i.key===k));saveCart();render()};
document.getElementById("lcopy").onclick=async e=>{const b=e.currentTarget;const items=buildList().filter(i=>!i.done);const g={};
  items.forEach(i=>{const k=i.best?sname(i.best.o.retailer):"Sonstiges";(g[k]=g[k]||[]).push(`- ${qtyTxt(i.fam,i.base,i.unit)} ${i.name}`)});
  const txt=Object.entries(g).map(([k,v])=>k+"\n"+v.join("\n")).join("\n\n");
  let ok=false;try{await navigator.clipboard.writeText(txt);ok=true}catch(err){}
  if(!ok){const t=document.createElement("textarea");t.value=txt;document.body.appendChild(t);t.select();try{ok=document.execCommand("copy")}catch(err){}t.remove()}
  b.textContent=ok?"Kopiert":"Kopieren nicht möglich";setTimeout(()=>b.textContent="Als Text kopieren",1800)};

// Gericht anlegen und bearbeiten
const ovl=document.getElementById("ovl"),dlg=document.getElementById("dlg"),drows=document.getElementById("drows");
let editing=null;
function rowHtml(i){return `<div class="drow"><input class="rn" list="artlist" value="${esc(i.n||"")}" placeholder="Zutat, z. B. Möhren" aria-label="Zutat" required>
  <input class="rq" type="text" inputmode="decimal" value="${i.q!=null?String(i.q).replace(".",","):""}" placeholder="Menge" aria-label="Menge">
  <select class="ru" aria-label="Einheit">${UNITS.map(u=>`<option${u===(i.u||"g")?" selected":""}>${u}</option>`).join("")}</select>
  <button type="button" class="ibtn" data-act="rrm" aria-label="Zutat entfernen">×</button></div>`}
function openEditor(d){
  editing=d||null;document.getElementById("dtitle").textContent=d?"Gericht bearbeiten":"Neues Gericht";
  document.getElementById("dname").value=d?d.name:"";document.getElementById("dport").value=d?d.portions:2;
  drows.innerHTML=(d?d.items:[{},{},{}]).map(rowHtml).join("");document.getElementById("ddel").hidden=!d;
  ovl.hidden=false;document.getElementById("dname").focus();
}
const closeEditor=()=>{ovl.hidden=true;editing=null};
document.getElementById("dnew").onclick=()=>openEditor(null);
document.getElementById("dadd").onclick=()=>{drows.insertAdjacentHTML("beforeend",rowHtml({}));drows.lastElementChild.querySelector(".rn").focus()};
drows.addEventListener("click",e=>{const b=e.target.closest('[data-act="rrm"]');if(b)b.closest(".drow").remove()});
document.getElementById("dcancel").onclick=closeEditor;
ovl.addEventListener("click",e=>{if(e.target===ovl)closeEditor()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!ovl.hidden)closeEditor()});
document.getElementById("ddel").onclick=e=>{const b=e.currentTarget;if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="Wirklich löschen?";setTimeout(()=>{b.dataset.arm="";b.textContent="Löschen"},3000);return}
  dishes=dishes.filter(x=>x!==editing);cart.dishes=cart.dishes.filter(x=>x.id!==editing.id);b.dataset.arm="";b.textContent="Löschen";saveDishes();saveCart();closeEditor();render()};
dlg.onsubmit=e=>{e.preventDefault();
  const items=[...drows.querySelectorAll(".drow")].map(r=>({n:r.querySelector(".rn").value.trim(),q:parseFloat(r.querySelector(".rq").value.replace(",","."))||1,u:r.querySelector(".ru").value})).filter(i=>i.n);
  const name=document.getElementById("dname").value.trim();if(!name||!items.length)return;
  const portions=Math.max(1,parseInt(document.getElementById("dport").value)||2);
  if(editing)Object.assign(editing,{name,portions,items});else dishes.push({id:uid(),name,portions,items});
  saveDishes();closeEditor();render()};

// ===== Prospekte: alle aktuellen Angebote nach Laden =====
// Ersparnis eines Angebots: gegenüber Streichpreis, Normalpreis im Laden oder üblichem Preis
function offerSave(r){
  if(r.oldPrice&&r.oldPrice>r.price)return 1-r.price/r.oldPrice;
  const ref=r.regRef>r.refPrice?r.regRef:(r.usualRef&&r.usualN>=2&&r.usualRef>r.refPrice?r.usualRef:0);
  return ref?1-r.refPrice/ref:0;
}
function renderProsp(now){
  const el=document.getElementById("prosp");
  if(!rows.length){el.innerHTML="";return}
  const offers=rows.map(r=>({...r,st:status(r,now)})).filter(r=>{
    if(r.kind!=="angebot"||!baseOk(r,now))return false;if(st.grp!=="Alle"&&r.grp!==st.grp)return false;
    if(st.q){const h=clean(r.product+" "+r.brand+" "+r.description+" "+r.category+" "+r.art).toLowerCase();if(!h.includes(st.q)&&!(SYN[st.q]&&h.includes(SYN[st.q])))return false}
    return true});
  if(!offers.length){el.innerHTML=`<div class="empty">Gerade keine Angebote${st.q?` zu „${esc(st.q)}“`:""}. Neue Prospekte kommen jede Nacht um 3:07 Uhr.</div>`;return}
  const by={};offers.forEach(r=>(by[r.retailer]=by[r.retailer]||[]).push(r));
  const near=k=>{const f=fils.find(x=>x.retailer===k&&x.km!=null);return f?f.km:null};
  const stores=Object.keys(by).sort((a,b)=>((near(a)??99)-(near(b)??99))||by[b].length-by[a].length);
  const until=arr=>{const t=arr.map(r=>r.validTo).filter(Boolean).sort();return t.length?dfmt(new Date(t[t.length-1])):""};
  el.innerHTML=`<p class="phead">${offers.length} Angebote in ${stores.length} Läden${st.grp!=="Alle"?" · "+esc(st.grp):""}, sortiert nach Entfernung ab Lokhalle</p>`+stores.map(k=>{
    const arr=by[k],km=near(k);
    const grps=GROUPS.filter(g=>arr.some(r=>r.grp===g));
    return`<details class="pstore" open><summary>${logo(k)}<span class="psn">${esc(sname(k))}</span><span class="psm">${arr.length} ${arr.length===1?"Angebot":"Angebote"}${km!=null?" · "+kmTxt(km):""}${until(arr)?" · bis "+until(arr):""}</span></summary>
      ${grps.map(g=>`<h4>${esc(g)}</h4>`+arr.filter(r=>r.grp===g).map(r=>({r,s:offerSave(r)})).sort((a,b)=>b.s-a.s||a.r.refPrice-b.r.refPrice).map(({r,s})=>`
        <div class="prow${oneDay(r)?" oneday":""}"><img class="px" src="${icon(r.art,r.grp)}" alt="">
          <div class="pinfo"><div class="pn">${esc(r.product)}${r.brand?` <span class="meta">${esc(r.brand)}</span>`:""}${pills(r)}</div>
            <div class="meta">${amt(r)?"für "+amt(r)+" · ":""}${eur(r.refPrice)} je ${esc(UNIT[r.unit]||r.unit)}${r.oldPrice?` · statt ${eur(r.oldPrice)}`:""}</div></div>
          ${s>=.05?`<span class="pct">−${Math.round(s*100)} %</span>`:""}
          <strong class="pp">${eur(r.price)}</strong>
          <button type="button" class="addb" data-art="${esc(r.art||r.product)}" data-u="${esc(r.unit)}" aria-label="${esc(r.art||r.product)} auf die Einkaufsliste" title="Auf die Einkaufsliste">+</button></div>`).join("")).join("")}
    </details>`}).join("");
}

// Aus der Angebotsliste direkt auf die Einkaufsliste
document.getElementById("prosp").addEventListener("click",e=>{const b=e.target.closest(".addb");if(!b)return;e.preventDefault();e.stopPropagation();
  const u=b.dataset.u;cart.extra.push(u==="kg"?{n:b.dataset.art,q:500,u:"g"}:u==="l"?{n:b.dataset.art,q:1,u:"l"}:{n:b.dataset.art,q:1,u:"Stk"});
  saveCart();b.textContent="✓";b.classList.add("ok");setTimeout(()=>{b.textContent="+";b.classList.remove("ok")},1200);applyView()});
document.getElementById("list").addEventListener("click",e=>{const b=e.target.closest(".addb");if(!b)return;e.preventDefault();e.stopPropagation();
  const u=b.dataset.u;cart.extra.push(u==="kg"?{n:b.dataset.art,q:500,u:"g"}:u==="l"?{n:b.dataset.art,q:1,u:"l"}:{n:b.dataset.art,q:1,u:"Stk"});
  saveCart();b.textContent="✓";b.classList.add("ok");setTimeout(()=>{b.textContent="+";b.classList.remove("ok")},1200);applyView()});
render();

// ===== Produktseite zu den Top 20 =====
const pov=document.createElement("div");pov.className="ovl";pov.hidden=true;document.body.appendChild(pov);
function openProduct(x){
  const r=x.r,unitTxt=UNIT[r.unit]||r.unit;
  const photo=r.offerId>0?`https://mg2de.b-cdn.net/api/v1/offers/${r.offerId}/images/default/0/medium.webp`:(r.img||"");
  const same=r.ean?rows.filter(o=>o.ean===r.ean&&o.retailer!==r.retailer):[];
  const valid=r.validFrom||r.validTo?`${r.validFrom?dfmt(new Date(r.validFrom)):""} bis ${r.validTo?dfmt(new Date(r.validTo)):"?"}`:"ohne Enddatum";
  const others=lastVis.filter(o=>o.art===r.art&&o.unit===r.unit&&o.offerId!==r.offerId).sort((a,b)=>a.refPrice-b.refPrice).slice(0,6);
  pov.innerHTML=`<div class="dlg pdlg" role="dialog" aria-modal="true" aria-labelledby="ptitle">
    <button type="button" class="pclose" data-act="pclose" aria-label="Schließen">×</button>
    <div class="phead"><div class="pimg">${photo?`<img class="photo" src="${photo}" alt="Prospektbild ${esc(r.product)}">`:`<img class="px" src="${icon(r.art,r.grp)}" alt="">`}</div>
      <div><div class="pst">${logo(r.retailer)}${esc(sname(r.retailer))}</div><h3 id="ptitle">${esc(r.product)}</h3>${r.brand?`<div class="meta">${esc(r.brand)}</div>`:""}<div>${pills(r)}</div></div></div>
    <div class="pprice"><span class="pnow">${eur(r.price)}</span>${r.oldPrice?`<span class="strike">${eur(r.oldPrice)}</span>`:""}<span class="pbadge">−${Math.round(x.d*100)} % · spart ${eur(x.save)}</span></div>
    <div class="pgrid">
      <div><span>Grundpreis</span><b>${eur(r.refPrice)} je ${esc(unitTxt)}</b></div>
      <div><span>Vergleich</span><b>${esc(x.why)}</b></div>
      <div><span>Gültig</span><b>${esc(valid)}</b></div>
      ${r.usualRef&&r.usualN?`<div><span>Sonst im Angebot</span><b>meist ${eur(r.usualRef)} je ${esc(unitTxt)} (${r.usualN}×)</b></div>`:""}
      ${r.loyalty?`<div><span>Hinweis</span><b>nur mit App oder Kundenkarte</b></div>`:""}
    </div>
    ${r.description?`<p class="pdesc">${esc(r.description)}</p>`:""}
    ${spark(r,unitTxt)}
    ${same.length?`<h4>Gleiches Produkt (EAN ${esc(r.ean)})</h4><div class="tablewrap"><table class="offers"><tbody>${same.map(o=>`<tr><td><span class="st">${logo(o.retailer)}${esc(sname(o.retailer))}</span></td><td class="pname">${esc(o.product)}</td><td class="num">${eur(o.price)}</td></tr>`).join("")}</tbody></table></div>`:""}
    ${shopHtml(r)}
    ${others.length?`<h4>Andere Preise für ${esc(r.art)}</h4><div class="tablewrap"><table class="offers"><tbody>${others.map(o=>`<tr><td><span class="st">${logo(o.retailer)}${esc(sname(o.retailer))}</span></td><td class="pname">${esc(o.product)}${pills(o)}</td><td class="num">${eur(o.refPrice)}<div class="meta">je ${esc(UNIT[o.unit]||o.unit)}</div></td></tr>`).join("")}</tbody></table></div>`:""}
    <div class="dbtns">${r.offerId>0?`<a class="plink" href="https://www.marktguru.de/offers/${r.offerId}" target="_blank" rel="noopener">Bei marktguru ansehen</a>`:""}${r.kind==="angebot"?`<button type="button" data-gone="${r.offerId}">Nicht gefunden</button>`:""}<button type="button" class="pri" data-act="padd">Auf die Einkaufsliste</button></div>
  </div>`;
  const im=pov.querySelector("img.photo");if(im)im.onerror=()=>{im.className="px";im.src=icon(r.art,r.grp)};
  pov.querySelector('[data-act="padd"]').onclick=e=>{const b=e.currentTarget;
    cart.extra.push(r.unit==="kg"?{n:r.art,q:500,u:"g"}:r.unit==="l"?{n:r.art,q:1,u:"l"}:{n:r.art,q:1,u:"Stk"});
    saveCart();applyView();b.textContent="✓ Auf der Liste";b.disabled=true};
  pov.hidden=false;pov.querySelector(".pclose").focus();
}
// Preisgeschichte als kleine Kurve: Punkte aus dem Normalpreisverlauf (grau) und frueheren Angeboten (gruen)
function spark(r,u){
  const pts=String(r.hist||"").split(";").map(t=>{const m=t.match(/^(\d{6}):([\d.]+)(a?)$/);return m?{d:new Date(2000+ +m[1].slice(0,2),+m[1].slice(2,4)-1,+m[1].slice(4,6)),p:+m[2],a:!!m[3]}:null}).filter(Boolean);
  pts.push({d:new Date(),p:r.refPrice,a:r.kind==="angebot",now:1});
  if(pts.length<2)return`<p class="hint">Preisgeschichte: noch keine früheren Preise gespeichert. Ab jetzt wird jede Nacht mitgeschrieben.</p>`;
  const W=300,H=70,P=6,t0=Math.min(...pts.map(x=>+x.d)),t1=Math.max(...pts.map(x=>+x.d)),p0=Math.min(...pts.map(x=>x.p)),p1=Math.max(...pts.map(x=>x.p));
  const X=d=>P+(t1>t0?(+d-t0)/(t1-t0):.5)*(W-2*P),Y=p=>H-P-(p1>p0?(p-p0)/(p1-p0):.5)*(H-2*P);
  const reg=pts.filter(x=>!x.a);
  const line=reg.length>1?`<polyline points="${reg.map(x=>X(x.d).toFixed(1)+","+Y(x.p).toFixed(1)).join(" ")}" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`:"";
  const dots=pts.map(x=>`<circle cx="${X(x.d).toFixed(1)}" cy="${Y(x.p).toFixed(1)}" r="${x.now?4:3}" fill="${x.a?"var(--best)":"var(--muted)"}" stroke="var(--ink)" stroke-width="${x.now?1.5:0}"><title>${dfmt(x.d)}: ${eur(x.p)} je ${u}${x.a?" (Angebot)":""}</title></circle>`).join("");
  return`<h4>Preisgeschichte je ${esc(u)}</h4><div class="spark"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Preisgeschichte">${line}${dots}</svg><div class="meta">tief ${eur(p0)} · hoch ${eur(p1)} · grün = Angebot, grau = Normalpreis, groß = heute</div></div>`;
}
const closeProduct=()=>{pov.hidden=true;pov.innerHTML=""};
pov.addEventListener("click",e=>{const g=e.target.closest("[data-gone]");if(g){hideGone(g.dataset.gone);closeProduct();return}});
pov.addEventListener("click",e=>{if(e.target===pov||e.target.closest('[data-act="pclose"]'))closeProduct()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!pov.hidden)closeProduct()});
document.getElementById("list").addEventListener("click",e=>{const c=e.target.closest(".scard");if(c&&lastTop[+c.dataset.i])openProduct(lastTop[+c.dataset.i])});
document.getElementById("list").addEventListener("keydown",e=>{const c=e.target.closest(".scard");if(c&&(e.key==="Enter"||e.key===" ")){e.preventDefault();if(lastTop[+c.dataset.i])openProduct(lastTop[+c.dataset.i])}});

// Laden über den n8n-Connector
function showMsg(html,err,btn){const m=document.getElementById("msg");m.hidden=false;m.className="notice"+(err?" err":"");m.innerHTML=html+(btn?`<button type="button" id="msgbtn">${btn.label}</button>`:"");if(btn)document.getElementById("msgbtn").onclick=btn.onClick}
function hideMsg(){document.getElementById("msg").hidden=true}
async function fetchAll(mcp,opts,table=TABLE){
  const out=[];let skip=0,count=Infinity;
  while(skip<count&&skip<3000){
    const res=await mcp.callTool(SERVER,TOOL,{...table,limit:100,skip},opts);
    const p=res.payload||{};const page=p.rows||[];count=typeof p.count==="number"?p.count:out.length+page.length;
    out.push(...page);if(page.length<100)break;skip+=100;
  }
  return out;
}

// Feedback: Mitbewohner schreiben, du liest es hier (und Claude kann es im Chat für dich lesen)
function initFeedback(db,id,owner){
  const btn=document.getElementById("fbbtn"),ovl=document.getElementById("fbovl"),badge=document.getElementById("fbbadge");
  const list=document.getElementById("fblist"),info=document.getElementById("fbinfo"),txt=document.getElementById("fbtext");
  const col=db.collection("feedback");let items=[];
  btn.hidden=false;
  const open=()=>{ovl.hidden=false;info.textContent="";if(!owner)txt.focus()};
  btn.onclick=open;document.getElementById("fbclose").onclick=()=>{ovl.hidden=true};
  ovl.addEventListener("click",e=>{if(e.target===ovl)ovl.hidden=true});
  if(owner){
    document.getElementById("fbtitle").textContent="Feedback aus dem Haushalt";
    document.getElementById("fbwrite").hidden=true;document.getElementById("fbsend").hidden=true;list.hidden=false;
    const draw=()=>{const open_=items.filter(x=>!x.done);badge.hidden=!open_.length;badge.textContent=open_.length;
      list.innerHTML=items.length?items.map(x=>`<div class="fbi${x.done?" done":""}"><div class="fbm">${new Date(x.at).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div><div class="fbt"></div><button type="button" data-id="${esc(x.id)}">${x.done?"löschen":"erledigt"}</button></div>`).join(""):`<p class="hint">Noch kein Feedback.</p>`;
      list.querySelectorAll(".fbt").forEach((el,i)=>{el.textContent=items[i].text});
      list.querySelectorAll("button[data-id]").forEach(b=>b.onclick=async()=>{const x=items.find(y=>y.id===b.dataset.id);if(!x)return;b.disabled=true;
        try{if(x.done)await col.doc(x.id).delete();else await col.doc(x.id).update({done:true})}catch(e){b.disabled=false}})};
    col.orderBy("at","desc").limit(100).onSnapshot(sn=>{items=sn.docs.map(d=>({id:d.id,...d.data()}));draw()},()=>{});
  }else{
    document.getElementById("fbdlg").onsubmit=async e=>{e.preventDefault();const t=txt.value.trim();if(!t)return;
      const sb=document.getElementById("fbsend");sb.disabled=true;info.textContent="wird gesendet";
      try{await col.add({text:t.slice(0,2000),at:new Date().toISOString(),by:id,done:false});txt.value="";info.textContent="Danke, ist angekommen."}
      catch(err){info.textContent="Senden hat nicht geklappt."}
      sb.disabled=false};
  }
}
// Schnappschuss der Angebote im gemeinsamen Speicher: du (mit n8n) legst ihn ab, der Haushalt liest ihn
const SNAP_F=["offerId","grp","category","product","brand","retailer","description","price","oldPrice","refPrice","unit","loyalty","validFrom","validTo","loadedAt","usualRef","usualN","plz","kind","art","hist","regRef","ean","img"];
async function publishSnap(data,fdata){
  if(window.MK_WEB)return;
  try{const db=await claude.use("db");if(!db||!data.length)return;
    const la=data.reduce((m,r)=>r.loadedAt&&r.loadedAt>m?r.loadedAt:m,"");
    const meta=db.collection("snap").doc("meta");const m=await meta.get();const md=m.exists?m.data():null;
    if(md&&md.loadedAt===la&&md.n===data.length)return;
    const arr=data.map(r=>SNAP_F.map(f=>r[f]===undefined?null:r[f])),N=200,parts=Math.ceil(arr.length/N);
    for(let i=0;i<parts;i++)await db.collection("snap").doc("p"+i).set({rows:arr.slice(i*N,i*N+N)});
    await meta.set({loadedAt:la,n:data.length,parts,fields:SNAP_F,fils:fdata.map(f=>({retailer:f.retailer||"",adresse:f.adresse||"",imGebiet:!!f.imGebiet,lat:f.lat||null,lng:f.lng||null})),savedAt:new Date().toISOString()});
  }catch(e){}
}
async function readSnap(){
  const db=await claude.use("db");if(!db)return null;
  const m=await db.collection("snap").doc("meta").get();if(!m.exists)return null;const md=m.data();
  const out=[];for(let i=0;i<md.parts;i++){const p=await db.collection("snap").doc("p"+i).get();if(p.exists)for(const a of p.data().rows)out.push(Object.fromEntries(md.fields.map((f,j)=>[f,a[j]])))}
  return {data:out,fdata:md.fils||[]};
}
let retried=false;
async function load(fresh){
  const u0=await claude.use("user");const isOwner=u0?await u0.isOwner().catch(()=>false):false;
  if(!isOwner&&!window.MK_WEB){
    try{const sn=await readSnap();
      if(!sn||!sn.data.length){showMsg("<strong>Noch keine Angebote freigegeben.</strong> Sobald die App einmal beim Besitzer geöffnet wurde, erscheinen sie hier.",false);document.getElementById("list").innerHTML="";document.getElementById("stamp").textContent="Noch keine Daten";return}
      return applyData(sn.data,sn.fdata);
    }catch(e){showMsg("<strong>Laden fehlgeschlagen.</strong>",true,{label:"Erneut laden",onClick:()=>load(true)});return}
  }
  const mcp=await claude.use("mcp");
  if(!mcp){showMsg("<strong>Live-Daten nicht verfügbar.</strong> Diese Seite liest die Angebote über deinen n8n-Connector. Öffne sie direkt in claude.ai, angemeldet mit deinem Konto.",true);document.getElementById("list").innerHTML="";document.getElementById("stamp").textContent="Keine Verbindung";return}
  try{
    const opts={cache:fresh?{refresh:true,staleTime:300000}:{staleTime:300000}};
    const [data,fdata]=await Promise.all([fetchAll(mcp,opts),fetchAll(mcp,opts,FIL).catch(()=>[])]);
    publishSnap(data,fdata);
    applyData(data,fdata);
  }catch(e){
    const c=e&&e.code;
    if(c==="server_not_connected"||c==="selection_required")showMsg("<strong>n8n ist nicht verbunden.</strong> Füge den n8n-Connector unter claude.ai Einstellungen, Connectors hinzu und lade die Seite neu.",true);
    else if(c==="needs_reauth")showMsg("<strong>Die n8n-Verbindung ist abgelaufen.</strong> Verbinde n8n unter claude.ai Einstellungen, Connectors neu.",true);
    else if(c==="not_in_manifest"||c==="approval_required"||c==="consent_required")showMsg("<strong>Die Seite braucht deine Freigabe für n8n.</strong> Sie liest nur die Tabellen „Frischeangebote 79106“ und „Filialen 79106“.",false,{label:"Zugriff erlauben und laden",onClick:()=>load(true)});
    else if(e&&e.retryable&&!retried){retried=true;showMsg("n8n antwortet gerade nicht, neuer Versuch läuft.",false);setTimeout(()=>load(false),(e.retryAfterMs||1500)+Math.random()*1000)}
    else if(c==="tool_error")showMsg(`<strong>n8n hat einen Fehler gemeldet.</strong> ${esc(e.message||"")}`,true,{label:"Erneut laden",onClick:()=>load(true)});
    else showMsg(`<strong>Laden fehlgeschlagen.</strong> ${esc(c||"")}`,true,{label:"Erneut laden",onClick:()=>load(true)});
    document.getElementById("stamp").textContent="Nicht geladen";
  }
}
function applyData(data,fdata){
    fils=fdata.map(f=>({retailer:f.retailer||"",adresse:f.adresse||"",imGebiet:!!f.imGebiet,plz:plzOf(f),km:kmTo(+f.lat,+f.lng)})).sort((a,b)=>(a.km??99)-(b.km??99));
    const zs=[...new Set(fils.map(f=>f.plz).filter(Boolean))].sort();
    if(zs.length){const kw=document.getElementById("kw");kw.textContent=zs.length>2?`${zs[0]} bis ${zs[zs.length-1]}`:zs.join(" · ");kw.title="Filial-PLZ: "+zs.join(", ")}
    rows=data.map(r=>({offerId:r.offerId,grp:r.grp,category:r.category||r.grp,product:clean(r.product),brand:r.brand||"",retailer:r.retailer||"",description:r.description||"",price:r.price,oldPrice:r.oldPrice,refPrice:r.refPrice,unit:r.unit||"Stk",loyalty:!!r.loyalty,validFrom:r.validFrom,validTo:r.validTo,loadedAt:r.loadedAt,usualRef:r.usualRef,usualN:r.usualN||0,plz:r.plz||"",kind:r.kind||"angebot",artKI:r.art||"",hist:r.hist||"",regRef:r.regRef,ean:r.ean||"",img:r.img||""}));
    rows=rows.filter(r=>!NOFOOD.test(r.retailer));
    // Obst und Gemüse nur als ganze Frucht: nichts in Litern, nichts Geschnittenes oder Verzehrfertiges
    rows=rows.filter(r=>!(/^(Obst|Gemüse)$/.test(r.grp)&&(r.unit==="l"||/verzehrfertig|geschnitten|gewürfelt|stücke\b|stückchen|fruchtsalat|snack|becher|\bcup\b|saladinettes/i.test(r.product+" "+r.description))));
    rows.forEach(r=>{if(r.grp==="Obst"&&/nashi/i.test(r.product))r.art="Nashi-Birnen"});
    // Gleiche Regeln wie im Workflow (gelten dort ab dem nächsten Lauf): keine Nicht-Lebensmittel wie WC-Ente oder Enteiserspray,
    // nichts Verarbeitetes bei Obst, Gemüse, Fleisch, Fisch, Milch und Eiern
    const NONFOOD_RX=/\bwc\b|reiniger|spray|lichtschlauch|\bled\b|lampe|\bwein\b|rosewein|weißwein|rotwein|chiaretto|\bsekt\b|likör|\bcola\b|limonade|stollen|röllchen|torte|kuchen|keks|gebäck|leberkäs|leberwurst|holz|figur|bettwäsche|deko\b|kerze/i;
    const PROC_RX=/in stücken|stückig|passiert|passata|schwedenhappen|southern|fried|crispy|nugget|streifen|happen\b|rahm-|\brahm\b|karottensalat|möhrensalat|krautsalat|gurkensalat|rohkostsalat|einzelpreis|gewürzgurke|brät\b|cordon|kibbeling|knusper|mit sauce|in sauce|paniert|gegart|gebraten|mariniert|aufschnitt|genuss\b|versch\.? sorten|fertiggericht/i;
    rows=rows.filter(r=>{if(r.grp==="Haushalt")return true;const t=r.product+" "+r.brand+" "+r.description;if(NONFOOD_RX.test(t))return false;return !(/^(Obst|Gemüse|Fleisch|Fisch|Milch & Eier)$/.test(r.grp)&&PROC_RX.test(t))});
    // Bier und Biermix (z. B. Grapefruit Weizen-Mix) sind kein Obst und enthalten Zucker: raus
    rows=rows.filter(r=>!/\bbier\b|bier-|biermix|weizen-mix|radler/i.test(r.product+" "+r.description));
    // Doppelte Angebote zusammenfassen (z. B. dasselbe Produkt in zwei Prospekten eines Ladens): das am längsten gültige bleibt
    {const best=new Map();for(const r of rows){const k=[r.retailer,String(r.product).toLowerCase().trim(),String(r.brand).toLowerCase().trim(),r.price,r.unit,r.kind,r.loyalty].join("|");const o=best.get(k);
      const nowIso=new Date().toISOString(),act=x=>!x.validFrom||String(x.validFrom)<=nowIso;
      if(!o||(act(r)&&!act(o))||(act(r)===act(o)&&String(r.validTo||"9")>String(o.validTo||"9")))best.set(k,r)}
     rows=[...best.values()]}
    {const seen=new Map(),out=[];for(const r of rows){const a=r.artKI||"";if(!a||r.kind!=="angebot"){out.push(r);continue}
      const k=[r.retailer,a,String(r.brand).toLowerCase().trim(),r.price,r.refPrice,r.unit,r.loyalty].join("|");const o=seen.get(k);
      if(!o){seen.set(k,r);out.push(r)}else if(String(r.validTo||"")>String(o.validTo||"")){out[out.indexOf(o)]=r;seen.set(k,r)}}
     rows=out}
    // Artikelname aus deiner Artikelliste (vom n8n-Workflow gesetzt), sonst die eigene Erkennung
    rows.forEach(r=>r.art=r.artKI||article(r));
    // Apfelschorle ist ein eigener Artikel (bis zum nächsten Lauf noch unter Äpfel einsortiert)
    rows.forEach(r=>{if(/apfel(saft)?-?schorle/i.test(r.product)){r.art="Apfelschorle";r.grp="Getränke"}});
    // Feste Markenwahl je Artikel: nur diese Produkte erscheinen
    const ONLY={"Kefir":/quarki/i};
    rows=rows.filter(r=>!ONLY[r.art]||ONLY[r.art].test(r.product+" "+r.brand+" "+r.description));
    hideMsg();
    const la=rows.reduce((m,r)=>r.loadedAt&&r.loadedAt>m?r.loadedAt:m,"");
    document.getElementById("stamp").innerHTML=`<strong>Stand ${la?new Date(la).toLocaleString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"unbekannt"}</strong><br>${rows.filter(r=>r.kind==="angebot").length} Angebote, ${rows.filter(r=>r.kind!=="angebot").length} Dauerpreise, ${new Set(rows.map(r=>r.retailer)).size} Läden`;
    if(!rows.length){document.getElementById("list").innerHTML=`<div class="empty">Die Tabelle ist gerade leer. Der nächste Lauf ist heute Nacht um 3:07 Uhr; du kannst ihn in n8n auch manuell starten.</div>`;return}
    buildStores();renderQuick();fillArtlist();render();
}

// Reiter Prüfen (nur Besitzer, nur in der Web-Version): wo die KI unsicher war oder aussortiert hat, entscheidest du einmal, das gilt dauerhaft
var pruef={on:false,items:[],at:"",busy:new Set()};
function pruefCount(){const n=pruef.items.filter(x=>x.s<70).length;const c=document.getElementById("pcount");if(c){c.textContent=n||"";c.hidden=!n}}
async function initPruef(){
  const P=window.MK_PRUEF;if(!P)return;
  try{const d=await P.get();if(!d)return;pruef.on=true;pruef.items=d.items||[];pruef.at=d.at||"";
    document.getElementById("pruefbtn").hidden=false;pruefCount();if(st.view==="pruef"||lsGet("bpf_view","")==="pruef"){st.view="pruef"}render();
  }catch(e){}
}
function pruefCard(x,ausg){
  const pr=x.pr!=null?eur(x.pr)+(x.u?" / "+(x.u==="Stk"?"Stück":x.u):""):"";
  const hint=ausg?`KI sortiert aus (${x.s} %)`:`KI ${x.ki==="ja"?"eher ja":"eher nein"} (${x.s} %)`;
  return `<div class="pcard" data-k="${esc(x.k)}">
    <div class="pmain"><div class="pname">${esc(x.p)}${x.b?` <small>${esc(x.b)}</small>`:""}</div>
    <div class="pmeta">${logo(x.r)} <span class="part">als ${esc(x.a)}</span> ${pr?`<span>${esc(pr)}</span>`:""}</div>
    <div class="pki">${esc(hint)}${x.gr?": "+esc(x.gr):""}</div></div>
    <div class="pbtns"><button type="button" class="pok" data-e="ja" aria-label="Passt, behalten">${ausg?"Doch behalten":"Passt"}</button><button type="button" class="pno" data-e="nein" aria-label="Passt nicht, aussortieren">${ausg?"Raus":"Raus"}</button></div></div>`;
}
function renderPruef(){
  const el=document.getElementById("pruef");
  const un=pruef.items.filter(x=>x.s<70),au=pruef.items.filter(x=>x.s>=70);
  const st_=pruef.at?new Date(pruef.at).toLocaleString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
  el.innerHTML=`<div class="phead"><h2>Prüfen</h2><p class="hint">Nur für dich sichtbar. Hier landet, wo die KI unsicher war. <strong>Passt</strong> heißt, das Produkt gehört zu diesem Artikel; <strong>Raus</strong> heißt, es fliegt dauerhaft raus. Deine Entscheidung gilt ab dem nächsten nächtlichen Lauf und hilft der KI.${st_?` Stand ${esc(st_)}.`:""}</p></div>
  <section><h3>Unsicher <small>${un.length}</small></h3>${un.length?`<div class="plist">${un.map(x=>pruefCard(x,false)).join("")}</div>`:`<p class="hint">Nichts offen. Gut so.</p>`}</section>
  ${au.length?`<details class="paus"><summary>Von der KI aussortiert <small>${au.length}</small></summary><p class="hint">Diese Produkte zeigt die App schon nicht mehr an. Wenn eins zu Unrecht fehlt, hol es mit „Doch behalten“ zurück.</p><div class="plist">${au.map(x=>pruefCard(x,true)).join("")}</div></details>`:""}`;
}
document.getElementById("pruef").addEventListener("click",async e=>{
  const b=e.target.closest(".pbtns button");if(!b)return;const card=b.closest(".pcard");const k=card&&card.dataset.k;
  const x=pruef.items.find(y=>y.k===k);if(!x||pruef.busy.has(k))return;pruef.busy.add(k);
  card.classList.add("busy");card.querySelectorAll("button").forEach(z=>z.disabled=true);
  const ok=await window.MK_PRUEF.decide(x,b.dataset.e).catch(()=>false);pruef.busy.delete(k);
  if(ok){pruef.items=pruef.items.filter(y=>y.k!==k);card.classList.add("gone");setTimeout(()=>{renderPruef();pruefCount()},180)}
  else{card.classList.remove("busy");card.querySelectorAll("button").forEach(z=>z.disabled=false);card.querySelector(".pki").textContent="Speichern hat nicht geklappt, bitte nochmal."}
});
initPruef();

// Essens-Tagebuch (Web-Version): was gab's, wie war's. Daraus lernt der spätere Wochenplan.
var essen={on:false,meals:[],role:"",sel:{dish:"",urteil:"",mahlzeit:"",tag:0,foto:""},busy:false};
const URTEIL={gern:"Gern wieder",okay:"Okay",nein:"Lieber nicht"};
const MZ=["Frühstück","Mittag","Abend","Snack"];
const isoDay=off=>{const d=new Date();d.setDate(d.getDate()-off);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const mzNow=()=>{const h=new Date().getHours();return h<11?"Frühstück":h<15?"Mittag":h<17?"Snack":"Abend"};
async function initEssen(){
  const E=window.MK_ESSEN;if(!E)return;
  try{const d=await E.get();if(!d)return;essen.on=true;essen.meals=d.meals||[];essen.role=d.role||"";
    document.getElementById("essenbtn").hidden=false;if(lsGet("bpf_view","")==="essen")st.view="essen";render()}catch(e){}
}
function knownDishes(){
  const cnt=new Map();
  for(const m of essen.meals){if(m.urteil==="nein")continue;cnt.set(m.name,(cnt.get(m.name)||0)+(m.urteil==="gern"?2:1))}
  for(const d of dishes)if(d.name&&!cnt.has(d.name))cnt.set(d.name,0.5);
  return [...cnt.entries()].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
}
function dayLabel(iso){const t=isoDay(0),y=isoDay(1);if(iso===t)return "Heute";if(iso===y)return "Gestern";
  const [Y,M,D]=String(iso).split("-").map(Number);return new Date(Y,M-1,D).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})}
function renderEssen(){
  const el=document.getElementById("essen");const ms=essen.meals;
  // Was ihr mögt: oft und gern gegessen, und was nicht ankommt
  const by=new Map();for(const m of ms){const o=by.get(m.name)||{n:0,g:0,x:0};o.n++;if(m.urteil==="gern")o.g++;if(m.urteil==="nein")o.x++;by.set(m.name,o)}
  const fav=[...by.entries()].filter(([,o])=>o.g>0&&o.g>=o.x).sort((a,b)=>b[1].g-a[1].g||b[1].n-a[1].n).slice(0,10);
  const nope=[...by.entries()].filter(([,o])=>o.x>o.g).slice(0,8);
  const days=[];for(const m of ms){let d=days.find(x=>x.d===m.datum);if(!d){d={d:m.datum,l:[]};days.push(d)}d.l.push(m)}
  const who=m=>m.rolle===essen.role?"du":"Mitbewohner:in";
  el.innerHTML=`<div class="ehead"><div><h2>Essen</h2><p class="hint">Tragt ein, was ihr gegessen habt. Daraus lernt die App, was euch schmeckt, und plant später die Woche danach.</p></div><button type="button" class="ebig" id="enew">+ Was gab's?</button></div>
  ${fav.length||nope.length?`<section class="elike">${fav.length?`<div><h3>Gern gegessen</h3><div class="echips">${fav.map(([n,o])=>`<button type="button" class="chip" data-quick="${esc(n)}">${esc(n)}${o.g>1?` <small>${o.g}×</small>`:""}</button>`).join("")}</div></div>`:""}${nope.length?`<div><h3>Kommt nicht so an</h3><div class="echips">${nope.map(([n])=>`<span class="chip off">${esc(n)}</span>`).join("")}</div></div>`:""}</section>`:""}
  <section><h3>Gegessen</h3>${days.length?days.map(d=>`<div class="eday"><div class="edl">${esc(dayLabel(d.d))}</div>${d.l.map(m=>`<div class="emeal"><div class="emain"><div class="ename">${esc(m.name)}</div><div class="ezut">${esc([m.mahlzeit,who(m),m.zutaten].filter(Boolean).join(" · "))}</div></div>${m.urteil?`<span class="eu u-${esc(m.urteil)}">${esc(URTEIL[m.urteil]||"")}</span>`:""}<button type="button" class="edel" data-id="${esc(m.id)}" aria-label="Eintrag löschen" title="Löschen">×</button></div>`).join("")}</div>`).join(""):`<p class="hint">Noch nichts eingetragen. Tippe auf „Was gab's?“. Nach ein paar Wochen weiß die App, was ihr gern esst.</p>`}</section>`;
}
function openEssen(pre){
  essen.sel={dish:pre||"",urteil:"",mahlzeit:mzNow(),tag:0,foto:""};
  const o=document.getElementById("eovl");o.hidden=false;document.getElementById("etext").value="";document.getElementById("einfo").textContent="";
  document.getElementById("eprev").hidden=true;document.getElementById("efile").value="";drawEssenDlg();
}
function drawEssenDlg(){
  const s=essen.sel;
  document.getElementById("emz").innerHTML=MZ.map(m=>`<button type="button" class="chip" data-mz="${m}" aria-pressed="${s.mahlzeit===m}">${m}</button>`).join("");
  document.getElementById("etag").innerHTML=["Heute","Gestern","Vorgestern"].map((t,i)=>`<button type="button" class="chip" data-tag="${i}" aria-pressed="${s.tag===i}">${t}</button>`).join("");
  const kd=knownDishes().slice(0,14);
  document.getElementById("edish").innerHTML=kd.length?kd.map(n=>`<button type="button" class="chip" data-dish="${esc(n)}" aria-pressed="${s.dish===n}">${esc(n)}</button>`).join(""):`<span class="hint">Eure Gerichte erscheinen hier, sobald ihr welche eintragt.</span>`;
  document.getElementById("eurt").innerHTML=Object.entries(URTEIL).map(([k,v])=>`<button type="button" class="eub u-${k}" data-u="${k}" aria-pressed="${s.urteil===k}">${v}</button>`).join("");
}
function shrinkPhoto(file){return new Promise((res,rej)=>{const img=new Image();const url=URL.createObjectURL(file);
  img.onload=()=>{const m=1024,sc=Math.min(1,m/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL("image/jpeg",0.75))};
  img.onerror=()=>{URL.revokeObjectURL(url);rej()};img.src=url})}
(function wireEssen(){
  const el=document.getElementById("essen");if(!el)return;
  el.addEventListener("click",async e=>{
    if(e.target.closest("#enew")){openEssen("");return}
    const q=e.target.closest("[data-quick]");if(q){openEssen(q.dataset.quick);return}
    const d=e.target.closest(".edel");if(d){
      if(d.dataset.arm!=="1"){d.dataset.arm="1";d.textContent="löschen?";setTimeout(()=>{d.dataset.arm="";d.textContent="×"},3000);return}
      const id=+d.dataset.id;d.disabled=true;const ok=await window.MK_ESSEN.del(id).catch(()=>false);
      if(ok){essen.meals=essen.meals.filter(m=>m.id!==id);renderEssen()}else{d.disabled=false;d.textContent="×"}}
  });
  const dlg=document.getElementById("edlg"),ovl=document.getElementById("eovl");
  const close=()=>{ovl.hidden=true};
  document.getElementById("ecancel").onclick=close;ovl.addEventListener("click",e=>{if(e.target===ovl)close()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!ovl.hidden)close()});
  dlg.addEventListener("click",e=>{const s=essen.sel;let b;
    if(b=e.target.closest("[data-mz]"))s.mahlzeit=b.dataset.mz;
    else if(b=e.target.closest("[data-tag]"))s.tag=+b.dataset.tag;
    else if(b=e.target.closest("[data-dish]"))s.dish=s.dish===b.dataset.dish?"":b.dataset.dish;
    else if(b=e.target.closest("[data-u]"))s.urteil=s.urteil===b.dataset.u?"":b.dataset.u;
    else if(e.target.closest("#efoto")){document.getElementById("efile").click();return}
    else if(e.target.closest("#erm")){s.foto="";document.getElementById("eprev").hidden=true;document.getElementById("efile").value="";return}
    else return;drawEssenDlg()});
  document.getElementById("efile").onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;
    try{essen.sel.foto=await shrinkPhoto(f);const p=document.getElementById("eprev");p.hidden=false;p.querySelector("img").src=essen.sel.foto}catch(err){document.getElementById("einfo").textContent="Das Foto ließ sich nicht lesen."}};
  dlg.onsubmit=async e=>{e.preventDefault();if(essen.busy)return;const s=essen.sel,text=document.getElementById("etext").value.trim(),info=document.getElementById("einfo");
    if(!s.dish&&!text&&!s.foto){info.textContent="Tippe ein Gericht an, schreib kurz, was es gab, oder mach ein Foto.";return}
    const d=dishes.find(x=>x.name===s.dish);
    essen.busy=true;const sb=document.getElementById("esave");sb.disabled=true;info.textContent=s.foto||text?"Gericht wird erkannt …":"wird gespeichert …";
    try{const meal=await window.MK_ESSEN.add({dish:s.dish,text,foto:s.foto,urteil:s.urteil,mahlzeit:s.mahlzeit,datum:isoDay(s.tag),bekannt:knownDishes().slice(0,80),zutaten:d?d.items.map(i=>i.n):[]});
      if(!meal)throw 0;essen.meals.unshift({...meal,id:meal.id});essen.meals.sort((a,b)=>String(b.datum+b.at).localeCompare(String(a.datum+a.at)));close();renderEssen()}
    catch(err){info.textContent="Speichern hat nicht geklappt, bitte nochmal."}
    essen.busy=false;sb.disabled=false};
})();
initEssen();

// Kassenbons (Web-Version): Foto rein, Zeilen mit Preisen raus
var bons={on:false,list:[],busy:false};
async function initBons(){
  const B=window.MK_BON;if(!B)return;
  try{const l=await B.get();if(!l)return;bons.on=true;bons.list=l;document.getElementById("bons").hidden=false;drawBons()}catch(e){}
}
const fmtMenge=(m,u)=>u==="Stk"?(m===1?"":m+" Stk"):(u==="kg"&&m<1?Math.round(m*1000)+" g":u==="l"&&m<1?Math.round(m*1000)+" ml":String(m).replace(".",",")+" "+u);
function drawBons(){
  const el=document.getElementById("blist");
  if(!bons.list.length){el.innerHTML=`<p class="hint">Noch keine Bons.</p>`;return}
  el.innerHTML=bons.list.map(b=>{const ware=b.zeilen.filter(z=>z.typ==="ware");const zu=ware.filter(z=>z.artikel).length;
    const [Y,M,D]=String(b.datum).split("-");
    return `<details class="bon"><summary>${logo(b.laden)}<span class="bmeta"><strong>${esc(sname(b.laden))}</strong> ${esc(D+"."+M+"."+Y)}${b.filiale?` <small>${esc(b.filiale)}</small>`:""}</span><span class="bsum">${eur(b.summe)}</span><small class="bcnt">${ware.length} Artikel, ${zu} zugeordnet</small></summary>
    <table class="bz"><tbody>${b.zeilen.map(z=>`<tr class="${z.typ!=="ware"?"bx":""}"><td><div>${esc(z.name||z.text)}</div>${z.artikel?`<span class="part">${esc(z.artikel)}</span>`:""}${z.rabatt?` <small class="brab">−${eur(z.rabatt)} Rabatt</small>`:""}</td><td class="bm">${esc(fmtMenge(z.menge,z.einheit))}</td><td class="bp">${eur(z.preis)}${z.einheit!=="Stk"&&z.grundpreis?`<small>${eur(z.grundpreis)}/${z.einheit}</small>`:""}</td></tr>`).join("")}</tbody></table>
    <div class="bfoot"><button type="button" class="bdel" data-id="${esc(b.id)}">Bon löschen</button></div></details>`}).join("");
}
function shrinkBon(file){return new Promise((res,rej)=>{const img=new Image();const url=URL.createObjectURL(file);
  img.onload=()=>{const m=1800,sc=Math.min(1,m/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL("image/jpeg",0.82))};
  img.onerror=()=>{URL.revokeObjectURL(url);rej()};img.src=url})}
(function wireBons(){
  const sec=document.getElementById("bons");if(!sec)return;
  const info=document.getElementById("binfo"),def=info.textContent;
  document.getElementById("bnew").onclick=()=>{if(!bons.busy)document.getElementById("bfile").click()};
  document.getElementById("bfile").onchange=async e=>{const f=e.target.files&&e.target.files[0];e.target.value="";if(!f||bons.busy)return;
    bons.busy=true;const btn=document.getElementById("bnew");btn.disabled=true;info.textContent="Bon wird gelesen, das dauert bis zu einer halben Minute …";
    try{const foto=await shrinkBon(f);const r=await window.MK_BON.add(foto);
      if(r&&r.bon){bons.list.unshift(r.bon);drawBons();const d=sec.querySelector("details.bon");if(d)d.open=true;info.textContent=`Gelesen: ${r.bon.zeilen.length} Zeilen bei ${sname(r.bon.laden)}. Prüf kurz, ob alles stimmt.`}
      else info.textContent=r&&r.msg==="nicht lesbar"?"Der Bon war nicht lesbar. Versuch ein schärferes Foto, gerade von oben und mit gutem Licht.":"Das hat nicht geklappt, bitte nochmal."}
    catch(err){info.textContent="Das hat nicht geklappt, bitte nochmal."}
    bons.busy=false;btn.disabled=false};
  sec.addEventListener("click",async e=>{const b=e.target.closest(".bdel");if(!b)return;
    if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="Wirklich löschen?";setTimeout(()=>{b.dataset.arm="";b.textContent="Bon löschen"},3000);return}
    const id=+b.dataset.id;b.disabled=true;const ok=await window.MK_BON.del(id).catch(()=>false);
    if(ok){bons.list=bons.list.filter(x=>x.id!==id);drawBons();info.textContent=def}else{b.disabled=false}});
})();
initBons();
