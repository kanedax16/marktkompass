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
 ["Rosenkohl",/rosenkohl/],["Rotkohl",/rotkohl/],["Weißkohl",/weißkohl|spitzkohl/],["Wirsing",/wirsing/],["Grünkohl",/grünkohl/],["Cherrytomaten",/cherry|cocktailtomate|snacktomate|kirschtomate|datteltomate|mini ?roma|minirispen/],["Tomaten",/tomate/],["Gurken",/gurke/],
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
const ART_FILES=new Set(["geramont-mit-joghurt.png","stangenbrokkoli.png","kidneybohnen.png","sardinen-in-oel.png","fruchtgummi.png","mehrkornbrot.png","pita-brot.png","tempeh.png","babyspinat.png","nashi-birnen.png","apfelschorle.png","aceto-balsamico.png", "aepfel.png", "allzweckreiniger.png", "ananas.png", "apfelessig.png", "apfelringe.png", "apfelsaft-naturtrueb.png", "appenzeller.png", "aprikosen.png", "auberginen.png", "austernpilze.png", "avocado.png", "baerlauch.png", "bananen.png", "basilikum.png", "batavia-und-blattsalate.png", "beeren-tiefgekuehlt.png", "belugalinsen.png", "bergkaese.png", "berglinsen-und-tellerlinsen.png", "birnen.png", "birnensaft.png", "blumenkohl.png", "blutorangen.png", "bohnen-im-glas.png", "bohnen-tiefgekuehlt.png", "brie.png", "brokkoli-tiefgekuehlt.png", "brokkoli.png", "brombeeren.png", "buchweizen.png", "bueffelmozzarella.png", "bulgur.png", "burrata.png", "buttermilch.png", "butternut-kuerbis.png", "camembert.png", "cantaloupe-und-charentais.png", "cashews.png", "champignons.png", "cheddar.png", "cherrytomaten.png", "chiasamen.png", "chicoree.png", "chili-frisch.png", "chinakohl.png", "clementinen-und-mandarinen.png", "couscous.png", "cranberries-getrocknet.png", "datteln.png", "dill.png", "dinkelflocken.png", "dinkelmehl.png", "dorade.png", "edamame-tiefgekuehlt.png", "eier-bio.png", "eier-freiland.png", "eisbergsalat.png", "endiviensalat.png", "ente.png", "entenbrust.png", "erbsen-getrocknet.png", "erbsen-tiefgekuehlt.png", "erdbeeren-tiefgekuehlt.png", "erdbeeren.png", "erdnuesse.png", "erdnussmus.png", "fassbutter-glaeserne-molkerei.png", "feigen.png", "feldsalat.png", "fenchel.png", "feta.png", "feuchtes-toilettenpapier.png", "forelle.png", "galiamelone.png", "gans.png", "garnelen.png", "getrocknete-aprikosen.png", "getrocknete-feigen.png", "getrocknete-mango.png", "getrocknete-pflaumen.png", "getrocknete-tomaten.png", "gojibeeren.png", "grana-padano.png", "granatapfel.png", "granatapfelkerne.png", "grapefruit.png", "grapefruitsaft.png", "griechischer-joghurt.png", "gruene-bohnen.png", "gruenkohl-tiefgekuehlt.png", "gruenkohl.png", "gruyere-und-comte.png", "gurken.png", "hackfleisch-lamm-und-rind.png", "haehnchen-ganz.png", "haehnchenbrustfilet.png", "haehnchenfluegel.png", "haehnchenschenkel.png", "haferflocken.png", "halloumi.png", "hanfsamen.png", "haselnuesse.png", "heidelbeeren-tiefgekuehlt.png", "heidelbeeren.png", "himbeeren-tiefgekuehlt.png", "himbeeren.png", "hirse.png", "hokkaido-kuerbis.png", "honigmelone.png", "ingwer-shot.png", "ingwer.png", "johannisbeeren.png", "kabeljau.png", "kaki.png", "kalbfleisch.png", "kaninchen.png", "kapern.png", "karottensaft.png", "kartoffeln.png", "kefir.png", "kichererbsen-getrocknet.png", "kichererbsen-im-glas.png", "kidneybohnen-getrocknet.png", "kirschen-tiefgekuehlt.png", "kirschen.png", "kiwi-gold.png", "kiwi.png", "knoblauch.png", "knollensellerie.png", "koerniger-frischkaese.png", "kohlrabi.png", "kokosnuss.png", "kokosoel.png", "kokosraspeln.png", "kombucha-voelkel.png", "kopfsalat.png", "koriander.png", "kraeuter-tiefgekuehlt.png", "kraeuterseitlinge.png", "kresse.png", "kuechenrolle.png", "kuerbiskerne.png", "kurkuma-frisch.png", "lachsfilet.png", "lachsforelle.png", "laktosefreie-milch.png", "lammfleisch.png", "lammkoteletts-und-lammsteaks.png", "lauch.png", "lauchzwiebeln.png", "leber.png", "leinsamen.png", "limetten.png", "litschi.png", "macadamia.png", "makrele-frisch.png", "makrelenfilets.png", "manchego.png", "mandelmus.png", "mandeln.png", "mango-tiefgekuehlt.png", "mango.png", "mangold.png", "maronen.png", "meeresfruechte-mischung.png", "minze.png", "mirabellen.png", "moehren.png", "muellbeutel.png", "mungbohnen.png", "muscheln.png", "naturjoghurt.png", "nektarinen.png", "netzmelone.png", "nordseekrabben.png", "nudeln-hartweizen.png", "nudeln-vollkorn.png", "nussmischung.png", "oliven.png", "olivenoel-nativ-extra.png", "orangen.png", "pak-choi.png", "palmkohl.png", "pangasius.png", "papaya.png", "paprika.png", "paranuesse.png", "parmigiano-reggiano.png", "passionsfrucht.png", "pastinaken.png", "pecorino.png", "pekannuesse.png", "petersilie.png", "pfifferlinge.png", "pfirsiche.png", "pflaumen-und-zwetschgen.png", "physalis.png", "piel-de-sapo.png", "pinienkerne.png", "pistazien.png", "polenta.png", "pomelo.png", "putenbrust.png", "putengulasch-und-putenkeule.png", "quinoa.png", "quitten.png", "radicchio.png", "radieschen.png", "raw-kefir-voelkel.png", "reis-basmati.png", "reis-vollkorn.png", "rettich.png", "rhabarber.png", "rinderbeinscheibe-und-suppenfleisch.png", "rinderbraten.png", "rinderfilet.png", "rindergulasch.png", "rinderhackfleisch.png", "rindersteak.png", "risottoreis.png", "roastbeef.png", "rohschinken.png", "romanasalat.png", "rosenkohl-tiefgekuehlt.png", "rosenkohl.png", "rosinen-und-sultaninen.png", "rosmarin-und-thymian.png", "rotbarsch.png", "rote-bete.png", "rote-linsen.png", "rote-zwiebeln.png", "rotkohl.png", "rucola.png", "saibling.png", "salsiccia.png", "sardinen.png", "sauerkraut.png", "schalotten.png", "schnittlauch.png", "scholle.png", "schwarze-bohnen.png", "schwarzwurzeln.png", "seehecht.png", "seelachsfilet.png", "sesam.png", "shiitake.png", "skyr.png", "sonnenblumenkerne.png", "spargel-gruen.png", "spargel-weiss.png", "spinat-tiefgekuehlt.png", "spinat.png", "spitzkohl.png", "spitzpaprika.png", "sprossen.png", "spuelmaschinentabs.png", "spuelmittel.png", "stachelbeeren.png", "staudensellerie.png", "suesskartoffeln.png", "suppengruen.png", "tahin.png", "taschentuecher.png", "thunfisch-im-glas.png", "thunfischsteak.png", "tintenfisch.png", "toilettenpapier.png", "tomaten.png", "topinambur.png", "walnuesse.png", "waschmittel.png", "wassermelone.png", "weichspueler.png", "weintrauben-dunkel.png", "weintrauben-hell.png", "weisse-bohnen-getrocknet.png", "weisskohl.png", "weizenmehl.png", "wild.png", "wildlachs.png", "wirsing.png", "wolfsbarsch.png", "wurzelpetersilie.png", "zander.png", "ziegenkaese.png", "ziegenmilch.png", "zitronen.png", "zitronengras.png", "zucchini.png", "zuckermais.png", "zuckerschoten.png", "zwiebeln.png"]);
const slugOf=n=>String(n||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")+".png";
const ICON_ALIAS={"Laktosefreier Joghurt":"Naturjoghurt","Géramont mit Joghurt":"Brie"};
function icon(art,grp){if(ICON_ALIAS[art])art=ICON_ALIAS[art];{const f=slugOf(art);if(ART_FILES.has(f))return "img/a/"+f}if(IMG[art])return IMG[art];for(const [re,n] of ALIAS)if(re.test(art||""))return IMG[n];
  let a=null;try{a=artFor(art||"")}catch(e){}if(a&&IMG[a])return IMG[a];
  return (grp&&IMG[GIMG[grp]])||IMG["Sonstiges"]}
const KNOWN=new Set(ARTICLES.map(a=>a[0]));

const st={q:"",grp:"Alle",app:true,soon:true,dauer:true,bio:false,stl:true,mine:false,off:new Set()};
try{const s=JSON.parse(localStorage.getItem("bpf2")||"{}");if(s.off)st.off=new Set(s.off);for(const k of["app","soon","dauer","bio","stl","mine"])if(typeof s[k]==="boolean")st[k]=s[k]}catch(e){}
// Bio-Läden: dort nur ausgewählte Lieblingsprodukte zeigen (im Menü änderbar, je Person gespeichert)
// Angebote und Prospekte in einem Reiter (Besitzer): Ansicht nach Artikel oder nach Laden, Laden wählen = "Ich bin im Laden"
st.amode=lsGetSafe("bpf_amode","artikel");st.laden=lsGetSafe("bpf_laden","");
function lsGetSafe(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}}
const merged=()=>typeof vorrat!=="undefined"&&vorrat&&vorrat.on;
const isProsp=()=>st.view==="prosp"||(merged()&&st.view==="deals"&&st.amode==="laden");
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
// Suche auch nach Artikelnummer: "23" oder "#23" findet den Artikel mit dieser Nummer
const nrArt=n=>{const m=window.ARTNR||{};for(const k in m)if(m[k]===n)return k;return ""};
const artNr=a=>(window.ARTNR||{})[a];
qEl.addEventListener("input",()=>{const v=qEl.value.trim();const mm=v.match(/^#?(\d{1,4})$/);const a=mm?nrArt(+mm[1]):"";st.q=(a||v).toLowerCase();render();scheduleCount()});

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
  if(t&&t<now)return"exp";
  // Nur, was in den nächsten 7 Tagen gilt: Angebote, die erst später starten, werden ausgeblendet
  if(f){const lim=new Date(now);lim.setHours(23,59,59,999);lim.setDate(lim.getDate()+7);if(f>lim)return"exp"}
  if(f&&f>now)return"soon";
  if(t&&t-now<36e5*24&&t.getDate()===now.getDate())return"last"; return"now";
}
const isBio=r=>/\bbio\b|bio-|dmbio|naturland|bioland|demeter|nur nur natur|rewe bio|k-bio|biobio/i.test(r.product+" "+r.brand+" "+r.description)||/denn|alnatura/i.test(r.retailer);

function render(){
  const now=new Date();
  grpsEl.querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===st.grp));
  quickEl.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b.dataset.w===st.q));
  const nOff=rows.length?allStores().filter(k=>st.off.has(k)).length+(st.bio?1:0)+(st.app?0:1)+(st.soon?0:1)+(st.dauer?0:1)+(st.mine?1:0):0;
  const bd=document.getElementById("mbadge");bd.hidden=!nOff;bd.textContent=nOff;
  applyView();
  if(st.view==="shop"){renderShop();return}
  if(st.view==="saison"){renderSaison();return}
  drawAmode();
  if(isProsp()){renderProsp(now);return}
  if(st.view==="pruef"){renderPruef();return}
  if(st.view==="essen"){renderEssen();return}
  if(st.view==="vorrat"){renderVorrat();return}
  if(st.view==="spar"){if(window.renderSpar)renderSpar();return}
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
        ${pxw(`<img class="px aopen" src="${icon(cat,g)}" alt="" data-art="${esc(cat)}">`,best||{})}
        <div class="itxt"><div class="iname"><span class="aopen" data-art="${esc(cat)}">${esc(cat)}</span>${nOffers?`<span class="obadge" title="${nOffers} ${nOffers===1?"Angebot":"Angebote"} gerade">% ${nOffers}</span>`:""}</div></div>
        <button type="button" class="addb" data-art="${esc(cat)}" data-u="${esc(unit)}" aria-label="${esc(cat)} auf die Einkaufsliste" title="Auf die Einkaufsliste">+</button>
        <div class="tag${units.length>1?" multi":""}"><div class="u">ab</div>${units.slice(0,2).map(u=>`<div class="p">${eur(bestOf(u).refPrice).replace(" €","")}</div><div class="u">${esc(uTxt(u))}</div>`).join("")}</div>
      </summary>
      <div class="tablewrap"><table class="offers"><thead><tr><th>Laden</th><th>Produkt</th><th style="text-align:right">Preis</th><th style="text-align:right">Grundpreis</th><th>Gültig</th></tr></thead><tbody>
      ${arr.map((o,i)=>`<tr class="${o===best?"best":""}${oneDay(o)?" oneday":""}">
        <td><span class="st">${logo(o.retailer)}${esc(sname(o.retailer))}</span>${shopHtml(o)}${o.kind==="angebot"?`<button type="button" class="gone" data-gone="${o.offerId}" title="Im Laden nicht gefunden: ausblenden, bis das Angebot abläuft">nicht gefunden</button>`:""}</td>
        <td class="pname"><strong>${esc(pn(o))}</strong>${o.brand?` <span class="meta">${esc(o.brand)}</span>`:""}${pills(o)}<div class="meta">${esc(o.description)}</div><div class="bar"><i style="width:${Math.max(6,Math.round(o.refPrice/(maxU[o.unit]||1)*100))}%"></i></div></td>
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
// Günstigster Preis, den es gerade woanders für denselben Artikel gibt (Angebote und Dauerpreise, nur eingeschaltete Läden)
let elseCache=null;
function elseMin(r){const now=new Date();
  if(!elseCache||elseCache.n!==rows.length||elseCache.t!==Math.floor(now/6e4)){const m={};
    for(const o of rows){if(!o.art||!(o.refPrice>0))continue;const s=status(o,now);if(s==="exp"||s==="soon"||!baseOk(o,now))continue;
      const k=o.art+"|"+o.unit;(m[k]=m[k]||[]).push(o)}elseCache={n:rows.length,t:Math.floor(now/6e4),m}}
  let best=null;for(const o of elseCache.m[r.art+"|"+r.unit]||[])if(o.offerId!==r.offerId&&(!best||o.refPrice<best.refPrice))best=o;return best}
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
    // Kein Steal, wenn es denselben Artikel woanders gerade günstiger gibt
    const oth=r.art&&elseMin(r);if(oth&&oth.refPrice<r.refPrice*0.995)continue;
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
  const card=(x,i)=>`<div class="scard${oneDay(x.r)?" oneday":""}" role="button" tabindex="0" data-i="${i}" title="Details zu ${esc(pn(x.r))}"><div class="rank">${pxw(`<img class="px" src="${icon(x.r.art,x.r.grp)}" alt="">`,x.r)}<b>${i+1}</b></div>
      <div class="nm">${favStar(x.r.art)}${esc(pn(x.r))}${pills(x.r,1)}</div><div class="pct">−${Math.round(x.d*100)} %</div>
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
// Anzeigename für Obst und Gemüse: Artikel (Einzahl) und Sorte in Klammern statt Werbetext, z. B. "Äpfel Gala Unsere Heimat" → "Apfel (Gala)"
const SING={"Äpfel":"Apfel","Birnen":"Birne","Bananen":"Banane","Zitronen":"Zitrone","Limetten":"Limette","Orangen":"Orange","Kiwi":"Kiwi","Kaki":"Kaki","Hokkaido Kürbis":"Kürbis","Gurken":"Gurke","Tomaten":"Tomate","Möhren":"Möhre","Zwiebeln":"Zwiebel","Rote Zwiebeln":"Rote Zwiebel","Kartoffeln":"Kartoffel","Süßkartoffeln":"Süßkartoffel","Auberginen":"Aubergine","Avocado":"Avocado","Feigen":"Feige","Grapefruit":"Grapefruit","Clementinen und Mandarinen":"Clementine"};
const SORTEN=[["Kürbis",/\b(hokkaido|butternut|muskat|spaghetti|bischofsmütze|patisson)\b/i],["Apfel",/\b(gala|elstar|braeburn|jonagold|jonagored|pink lady|ambrosia|boskoop|granny smith|fuji|golden delicious|topaz|cox orange|kanzi|jazz|red delicious|evelina|santana|wellant|honeycrunch|envy|rubens|idared|red prince|cripps pink)\b/i],["Birne",/\b(williams|abate|conference|alexander lucas|xenia|forelle|santa maria|nashi)\b/i],["Kartoffel",/\b(festkochend|mehligkochend|vorwiegend festkochend|drillinge)\b/i],["Tomate",/\b(cherry|rispen|roma|ochsenherz|datteltomate|cocktail)\b/i]];
const cap=w=>w.replace(/(^|\s)\S/g,c=>c.toUpperCase());
// Werbewörter und doppelte Namen weglassen ("Zarte Kalbsschnitzel" → "Kalbsschnitzel", "Wolfsbarsch Loup de Mer" → "Wolfsbarsch"); der Prospekttext steht weiter auf der Produktseite
const WERBUNG=/\b(zarte?[snr]?|frische?[snr]?|saftige?[snr]?|feine?[snr]?|knackige?[snr]?|aromatische?[snr]?|leckere?[snr]?|köstliche?[snr]?|ausgesuchte?[snr]?|beste?[snr]?|premium|delikatess|extra zarte?[snr]?|herzhafte?[snr]?|unsere heimat|gutes aus der region|meine metzgerei|metzgerfrisch|vom feinsten)\b/gi;
const SYNONYM=[[/\s*loup de mer\b/i,""],[/\s*dorade royale?\b/i," Dorade"],[/\bbranzino\b/i,"Wolfsbarsch"]];
// Bio steht nicht im Namen, sondern als grünes Bio-Siegel daneben
const BIOWORT=/(\b(rewe|edeka|k|gut|aldi|lidl|dm)[- ]?bio\b|\bbio\b-?|\böko\b-?)/gi;
// "vegan" nur behalten, wo es einen Unterschied macht (Ersatzprodukte); bei Nüssen, Obst usw. ist es überflüssig
const VEGAN_OK=/wurst|käse|kaese|schnitzel|burger|aufschnitt|hack|joghurt|milch|drink|frikadelle|nugget|filet|salami|schinken|butter|sahne|quark|bratling|gyros|döner|eis\b|mayo|aufstrich|pudding/i;
function cleanName(t){let x=String(t||"");for(const [re,b] of SYNONYM)x=x.replace(re,b);x=x.replace(BIOWORT," ").replace(/\b(tiefgek(ü|ue)hlt|tiefk(ü|ue)hl(ware)?|tk)\b/gi," ");x=x.replace(/\bxxl\b/gi," ");x=x.replace(/\b(laktose|lactose)frei(e[snr]?|e)?\b|\bohne laktose\b/gi," ");if(!VEGAN_OK.test(x))x=x.replace(/\bvegane?[snr]?\b/gi," ");x=x.replace(WERBUNG," ").replace(/\s{2,}/g," ").replace(/^[\s,\-–]+|[\s,\-–]+$/g,"").trim();return x?x.charAt(0).toUpperCase()+x.slice(1):String(t||"")}
function dispName(r){if(!r.art||!/^(Obst|Gemüse)$/.test(r.grp||""))return cleanName(r.product);
  if(/hokkaido/i.test(r.art)&&!SORTEN[0][1].test(r.product))return "Kürbis (Hokkaido)";
  const base=SING[r.art]||r.art,sv=SORTEN.find(([b])=>b===base);const m=sv&&String(r.product).match(sv[1]);
  return m?`${base} (${cap(m[1].toLowerCase())})`:base}
const pn=r=>r.disp||r.product;
// Tiefgekühlt erkennen; Bio und Tiefkühl erscheinen als kleine Zeichen direkt auf dem Bild
const isTK=r=>/tiefk(ü|ue)hl|tiefgek(ü|ue)hlt|\btk\b|❄|gefroren|frost/i.test(`${r.product||""} ${r.category||""} ${r.art||""}`);
const isLF=r=>/laktosefrei|lactosefrei|ohne laktose/i.test(`${r.product||""} ${r.brand||""} ${r.description||""} ${r.art||""}`);
// Bio, Tiefkühl und Laktosefrei gelten überall gleich: auf dem Bild als Zeichen, ohne Bild als kleine Schilder
const marksPill=r=>(isBio(r)?` <span class="pill bio">Bio</span>`:"")+(isTK(r)?` <span class="pill tk">❄ TK</span>`:"")+(isLF(r)?` <span class="pill lf">L laktosefrei</span>`:"");
const marks=r=>(isBio(r)?`<span class="ov ob" title="Bio">BIO</span>`:"")+(isTK(r)?`<span class="ov ot" title="Tiefgekühlt">❄</span>`:"")+(isLF(r)?`<span class="ov ol" title="Laktosefrei">L</span>`:"");
const pxw=(img,r)=>{const o=marks(r);return o?`<span class="pxw">${img}${o}</span>`:img};
// Favoriten (Stern) je Artikel, gemeinsam gespeichert in den Einstellungen
const isFav=a=>!!a&&Array.isArray(pick.fav)&&pick.fav.includes(a);
const favStar=a=>isFav(a)?`<span class="fstar" title="Favorit">★</span> `:"";
function pills(o,img){let h="";if(!img&&isBio(o))h+=`<span class="pill bio">Bio</span>`;if(!img&&isTK(o))h+=`<span class="pill tk">❄ TK</span>`;if(!img&&isLF(o))h+=`<span class="pill lf">L laktosefrei</span>`;if(o.kind==="dauerpreis")h+=`<span class="pill reg">Dauerpreis</span>`;if(o.kind==="normalpreis")h+=`<span class="pill reg">Normalpreis</span>`;if(o.kind==="beworben")h+=`<span class="pill reg">im Prospekt, ohne Rabatt</span>`;if(o.kind==="bonpreis")h+=`<span class="pill bon">Euer Bonpreis</span>`;if(o.loyalty)h+=`<span class="pill app">App-Preis</span>`;if(o.st==="soon"){const f=new Date(o.validFrom),t=o.validTo?new Date(o.validTo):null;h+=`<span class="pill soon">${t&&t-f<36e5*24?"nur":"ab"} ${dfmt(f)}</span>`}return h}

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
  if(st.view==="vorrat"&&!(typeof vorrat!=="undefined"&&vorrat&&vorrat.on))st.view="deals";
  if(st.view==="spar"&&!(typeof vorrat!=="undefined"&&vorrat&&vorrat.on))st.view="deals";
  if(merged()&&st.view==="prosp"){st.view="deals";st.amode="laden"}
  const spa=st.view==="spar";const pb=document.querySelector('.views [data-v="prosp"]');if(pb)pb.hidden=merged();
  const shop=st.view==="shop",sai=st.view==="saison",pro=isProsp(),pru=st.view==="pruef",ess=st.view==="essen",vor=st.view==="vorrat",deals=!shop&&!sai&&!pro&&!pru&&!ess&&!vor&&!spa&&st.view==="deals";
  views.forEach(b=>b.setAttribute("aria-selected",b.dataset.v===st.view));
  document.querySelector(".panel").hidden=!(deals||pro);document.getElementById("list").hidden=!deals;document.getElementById("prosp").hidden=!pro;document.getElementById("shop").hidden=!shop;document.getElementById("saison").hidden=!sai;document.getElementById("pruef").hidden=!pru;document.getElementById("essen").hidden=!ess;document.getElementById("vorratv").hidden=!vor;document.getElementById("sparv").hidden=!spa;
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
      <input type="checkbox" ${e.done?"checked":""}>${pxw(`<img class="px aopen" src="${icon(e.art||e.name,e.art?grpOf(e.art):null)}" alt="" data-art="${esc(e.art||e.name)}">`,o||{product:e.name,art:e.art})}
      <span class="lt"><span class="ln"><b>${qtyTxt(e.fam,e.base,e.unit)}</b> <span class="aopen" data-art="${esc(e.art||e.name)}">${esc(e.name)}</span></span>
      <span class="lo">${o?`${esc(pn(o))} · ${eur(o.price)} (${eur(o.refPrice)}/${esc(o.unit)})${e.best.n>1?` · ${e.best.n} Preise`:""}${pills(o,1)}`:"kein Preis gefunden"}${e.src.size?` · für ${esc([...e.src].join(", "))}`:""}${homeNote(e.art||e.name)}</span></span>
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
function listHere(L){try{const l=buildList().filter(e=>!e.done);if(!l.length)return "";
  const here=l.filter(e=>rows.some(r=>r.retailer===L&&r.art&&r.art===e.n));
  return here.length?`<p class="hl">Von eurer Einkaufsliste gibt es hier: ${here.map(e=>esc(e.n)).join(", ")}</p>`:""}catch(e){return ""}}
function drawAmode(){const el=document.getElementById("amode");if(!el)return;
  const on=merged()&&(st.view==="deals"||st.view==="prosp");el.hidden=!on;if(!on)return;
  const now=new Date();const cnt={};rows.forEach(r=>{if(r.kind==="angebot"&&status(r,now)!=="exp"&&!st.off.has(r.retailer))cnt[r.retailer]=(cnt[r.retailer]||0)+1});
  const near=k=>{const f=fils.find(x=>x.retailer===k&&x.km!=null);return f?f.km:99};
  const ls=Object.keys(cnt).sort((a,b)=>near(a)-near(b));
  el.innerHTML=`<div class="aseg" role="group" aria-label="Ansicht"><button type="button" data-am="artikel" aria-pressed="${st.amode!=="laden"}">Bester Preis je Artikel</button><button type="button" data-am="laden" aria-pressed="${st.amode==="laden"}">Nach Laden</button></div>
    ${st.amode==="laden"&&ls.length?`<div class="alad"><span class="lbl">Ich bin bei</span><button type="button" class="alg${!st.laden?" on":""}" data-ld="">Alle</button>${ls.map(k=>`<button type="button" class="alg${st.laden===k?" on":""}" data-ld="${esc(k)}" title="${esc(sname(k))}">${LOGOS[k]?`<img src="${LOGOS[k]}" alt="${esc(sname(k))}">`:esc(sname(k))}</button>`).join("")}</div>`:""}`}
document.addEventListener("click",e=>{const a=e.target.closest("#amode [data-am],#amode [data-ld]");if(!a)return;
  if(a.dataset.am){st.amode=a.dataset.am;try{localStorage.setItem("bpf_amode",JSON.stringify(st.amode))}catch(x){}}
  else{st.laden=a.dataset.ld;try{localStorage.setItem("bpf_laden",JSON.stringify(st.laden))}catch(x){}}
  render();window.scrollTo(0,0)});
// Läden im Prospekt-Reiter sind zugeklappt; aufgeklappte bleiben beim Neuzeichnen offen
const OPEN_ST=new Set();
document.addEventListener("toggle",e=>{const d=e.target;if(!d.classList||!d.classList.contains("pstore"))return;d.open?OPEN_ST.add(d.dataset.st):OPEN_ST.delete(d.dataset.st)},true);
function renderProsp(now){
  const el=document.getElementById("prosp");
  if(!rows.length){el.innerHTML="";return}
  const offers=rows.map(r=>({...r,st:status(r,now)})).filter(r=>{
    if(r.kind!=="angebot"||!baseOk(r,now))return false;if(st.grp!=="Alle"&&r.grp!==st.grp)return false;
    if(st.q){const h=clean(r.product+" "+r.brand+" "+r.description+" "+r.category+" "+r.art).toLowerCase();if(!h.includes(st.q)&&!(SYN[st.q]&&h.includes(SYN[st.q])))return false}
    return true});
  const L=merged()?st.laden:"";
  if(L&&offers.some(r=>r.retailer===L)){const mine=offers.filter(r=>r.retailer===L);offers.length=0;offers.push(...mine)}
  // Gleiches Produkt im selben Laden (z. B. diese und nächste Woche) nur einmal zeigen, das spätere Angebot als Hinweis
  {const g=new Map();for(const r of offers){const k=[r.retailer,cleanName(r.product).toLowerCase(),String(r.brand).toLowerCase(),amt(r)].join("|");if(!g.has(k))g.set(k,[]);g.get(k).push(r)}
    offers.length=0;for(const l of g.values()){l.sort((a,b)=>(a.st==="soon")-(b.st==="soon")||String(a.validFrom).localeCompare(String(b.validFrom)));const h={...l[0]};h.later=h.st==="soon"?[]:l.slice(1).filter(x=>x.st==="soon"&&x.price!==h.price);offers.push(h)}}
  if(!offers.length){el.innerHTML=`<div class="empty">Gerade keine Angebote${st.q?` zu „${esc(st.q)}“`:""}. Neue Prospekte kommen jede Nacht um 3:07 Uhr.</div>`;return}
  const by={};offers.forEach(r=>(by[r.retailer]=by[r.retailer]||[]).push(r));
  const near=k=>{const f=fils.find(x=>x.retailer===k&&x.km!=null);return f?f.km:null};
  const stores=Object.keys(by).sort((a,b)=>((near(a)??99)-(near(b)??99))||by[b].length-by[a].length);
  const until=arr=>{const t=arr.map(r=>r.validTo).filter(Boolean).sort();return t.length?dfmt(new Date(t[t.length-1])):""};
  let hier="";if(L&&stores.length===1){let t=[];try{t=steals(offers)}catch(e){}
    hier=`<div class="hier"><div class="hh">${logo(L)}<span>Du bist bei <b>${esc(sname(L))}</b>. Das lohnt sich hier am meisten:</span></div>${t.length?`<ol>${t.slice(0,6).map(x=>`<li><span class="aopen" data-art="${esc(x.r.art||x.r.product)}">${esc(pn(x.r))}</span> <b>${eur(x.r.price)}</b> <span class="hpct">−${Math.round(x.d*100)} %</span> <small>${esc(x.why)}</small></li>`).join("")}</ol>`:`<p class="hint">Hier gerade kein besonders starkes Angebot, unten alles im Prospekt.</p>`}${listHere(L)}</div>`}
  el.innerHTML=hier+`<p class="phead">${offers.length} Angebote in ${stores.length} ${stores.length===1?"Laden":"Läden"}${st.grp!=="Alle"?" · "+esc(st.grp):""}, sortiert nach Entfernung ab Lokhalle</p>`+stores.map(k=>{
    const arr=by[k],km=near(k);
    const grps=GROUPS.filter(g=>arr.some(r=>r.grp===g));
    return`<details class="pstore" data-st="${esc(k)}"${stores.length===1||OPEN_ST.has(k)?" open":""}><summary>${logo(k)}<span class="psn">${esc(sname(k))}</span><span class="psm">${arr.length} ${arr.length===1?"Angebot":"Angebote"}${km!=null?" · "+kmTxt(km):""}${until(arr)?" · bis "+until(arr):""}</span><span class="pchev" aria-hidden="true">▾</span></summary>
      ${grps.map(g=>`<h4>${esc(g)}</h4>`+arr.filter(r=>r.grp===g).map(r=>({r,s:offerSave(r)})).sort((a,b)=>b.s-a.s||a.r.refPrice-b.r.refPrice).map(({r,s})=>`
        <div class="prow${oneDay(r)?" oneday":""}">${pxw(`<img class="px aopen" src="${icon(r.art,r.grp)}" alt="" data-art="${esc(r.art||r.product)}">`,r)}
          <div class="pinfo"><div class="pn"><span class="aopen" data-art="${esc(r.art||r.product)}">${favStar(r.art)}${esc(pn(r))}</span>${r.brand?` <span class="meta">${esc(r.brand)}</span>`:""}${pills(r,1)}</div>
            <div class="meta">${amt(r)?"für "+amt(r)+" · ":""}${eur(r.refPrice)} je ${esc(UNIT[r.unit]||r.unit)}${r.oldPrice?` · statt ${eur(r.oldPrice)}`:""}${(r.later||[]).map(x=>` · <b class="later">ab ${esc(dfmt(new Date(x.validFrom)))}: ${eur(x.price)}</b>`).join("")}${(()=>{const o=r.art&&elseMin(r);return o&&o.refPrice<r.refPrice*0.995?` · <span class="wg">${o.retailer===r.retailer?(o.kind==="angebot"?`hier günstiger: ${esc(o.brand||pn(o))} ${eur(o.refPrice)}`:`hier ohne Angebot günstiger: ${eur(o.refPrice)}`):`woanders günstiger: ${esc(sname(o.retailer))} ${eur(o.refPrice)}`}</span>`:""})()}</div></div>
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
    <div class="phead"><div class="pimg">${photo?`<img class="photo" src="${photo}" alt="Prospektbild ${esc(pn(r))}">`:pxw(`<img class="px" src="${icon(r.art,r.grp)}" alt="">`,r)}</div>
      <div><div class="pst">${logo(r.retailer)}${esc(sname(r.retailer))}</div><h3 id="ptitle">${esc(pn(r))}</h3>${r.disp?`<div class="meta">Im Prospekt: ${esc(r.product)}</div>`:""}${r.brand?`<div class="meta">${esc(r.brand)}</div>`:""}<div>${pills(r,!photo)}</div></div></div>
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
    ${same.length?`<h4>Gleiches Produkt (EAN ${esc(r.ean)})</h4><div class="tablewrap"><table class="offers"><tbody>${same.map(o=>`<tr><td><span class="st">${logo(o.retailer)}${esc(sname(o.retailer))}</span></td><td class="pname">${esc(pn(o))}</td><td class="num">${eur(o.price)}</td></tr>`).join("")}</tbody></table></div>`:""}
    ${shopHtml(r)}
    ${others.length?`<h4>Andere Preise für ${esc(r.art)}</h4><div class="tablewrap"><table class="offers"><tbody>${others.map(o=>`<tr><td><span class="st">${logo(o.retailer)}${esc(sname(o.retailer))}</span></td><td class="pname">${esc(pn(o))}${pills(o)}</td><td class="num">${eur(o.refPrice)}<div class="meta">je ${esc(UNIT[o.unit]||o.unit)}</div></td></tr>`).join("")}</tbody></table></div>`:""}
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
  if(owner&&window.MK_FB){webFeedbackOwner(btn,ovl,badge,list,info,txt);return}
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
// Feedback im Besitzer-Link: selbst schreiben, abhaken, KI-Stand sehen, auf Rückfragen der KI antworten
function webFeedbackOwner(btn,ovl,badge,list,info,txt){
  const F=window.MK_FB;let items=[];
  document.getElementById("fbtitle").textContent="Feedback und Wünsche";
  document.querySelector("#fbwrite .hint").textContent="Was fehlt, was stört? Die KI schaut zweimal am Tag drauf, setzt es um oder fragt nach. Umgesetztes hakst du ab.";
  txt.placeholder="z. B. Spinat in der Artikelliste ergänzen";txt.rows=3;list.hidden=false;
  const ST={offen:"Neu, die KI kümmert sich",arbeitet:"KI arbeitet daran",umgesetzt:"Umgesetzt, bitte prüfen",rueckfrage:"Rückfrage der KI",erledigt:"Erledigt"};
  const dt=a=>{try{return new Date(a).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}catch(e){return ""}};
  const card=x=>{const s=x.done?"erledigt":(ST[x.status]?x.status:"offen");
    return `<div class="fbi st-${s}${x.done?" done":""}" data-id="${esc(x.id)}"><label class="fbchk" title="${x.done?"Wieder öffnen":"Abhaken"}"><input type="checkbox" ${x.done?"checked":""} aria-label="Erledigt"></label>
      <div class="fbc"><div class="fbm">${esc(dt(x.at))} · ${x.rolle==="owner"?"von dir":"aus dem Haushalt"} · <span class="fbs">${ST[s]}</span></div><div class="fbt">${esc(x.text)}</div>
      ${x.antwort?`<div class="fba"><strong>KI:</strong> ${esc(x.antwort)}</div>`:""}
      ${s==="rueckfrage"?`<div class="fbr"><input placeholder="Deine Antwort an die KI" aria-label="Antwort an die KI"><button type="button" class="fbrs">Antworten</button></div>`:""}</div></div>`};
  const draw=()=>{const open=items.filter(x=>!x.done),done=items.filter(x=>x.done);
    const need=open.filter(x=>x.status==="umgesetzt"||x.status==="rueckfrage").length;
    badge.hidden=!open.length;badge.textContent=need||open.length;
    list.innerHTML=(open.length?open.map(card).join(""):`<p class="hint">Nichts offen.</p>`)+(done.length?`<details class="fbdone"><summary>Erledigt (${done.length})</summary>${done.map(card).join("")}</details>`:"")};
  const load=async force=>{try{const l=await F.get(force);if(l){items=l;draw()}}catch(e){}};
  btn.hidden=false;
  btn.onclick=()=>{ovl.hidden=false;info.textContent="";load(true)};
  document.getElementById("fbclose").onclick=()=>{ovl.hidden=true};
  ovl.addEventListener("click",e=>{if(e.target===ovl)ovl.hidden=true});
  const upd=async(x,o,el)=>{el&&(el.disabled=true);const ok=await F.upd({id:x.id,...o}).catch(()=>false);
    if(ok){Object.assign(x,o);if(o.text){x.status="offen";x.done=false}if(typeof o.done==="boolean")x.status=o.done?"erledigt":"offen";draw()}else{el&&(el.disabled=false);info.textContent="Speichern hat nicht geklappt."}};
  list.addEventListener("change",e=>{const c=e.target.closest(".fbchk input");if(!c)return;const x=items.find(y=>String(y.id)===c.closest(".fbi").dataset.id);if(x)upd(x,{done:c.checked},c)});
  const reply=b=>{const box=b.closest(".fbr"),inp=box.querySelector("input"),v=inp.value.trim();if(!v)return;const x=items.find(y=>String(y.id)===b.closest(".fbi").dataset.id);
    if(x)upd(x,{text:x.text+"\n\nAntwort: "+v},b)};
  list.addEventListener("click",e=>{const b=e.target.closest(".fbrs");if(b)reply(b)});
  list.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.closest(".fbr")){e.preventDefault();reply(e.target.closest(".fbr").querySelector(".fbrs"))}});
  document.getElementById("fbdlg").onsubmit=async e=>{e.preventDefault();const t=txt.value.trim();if(!t)return;
    const sb=document.getElementById("fbsend");sb.disabled=true;info.textContent="wird gesendet";
    const ok=await F.add(t.slice(0,2000)).catch(()=>false);
    if(ok){txt.value="";info.textContent="Angekommen, die KI kümmert sich.";await load(true)}else info.textContent="Senden hat nicht geklappt.";
    sb.disabled=false};
  load(false);
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
    else{const st=String((e&&e.stack)||"").split("\n").slice(0,2).join(" | ").slice(0,220);
      showMsg(`<strong>Laden fehlgeschlagen.</strong> ${esc(c||"")} <small class="errdetail">${esc(String((e&&e.message)||e||""))}${st?" · "+esc(st):""}</small>`,true,{label:"Erneut laden",onClick:()=>load(true)})}
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
    // Nur beworben, ohne Rabatt (kein Streichpreis, nicht günstiger als sonst): kein Angebot, zählt wie ein Normalpreis
    // Marke vor dem Namen (kaufland.de: "K-PURLAND|Hähnchen-Minutenschnitzel") abtrennen
    rows.forEach(r=>{if(/[|\u2028]/.test(r.product||"")){const p=String(r.product).split(/[|\u2028]/);if(!r.brand)r.brand=p[0].trim();r.product=p.slice(1).join(" ").trim()||p[0].trim()}});
    rows.forEach(r=>{if(r.kind==="angebot"&&offerSave(r)<0.03)r.kind="beworben"});
    rows.forEach(r=>{const d=dispName(r);if(d&&d!==r.product)r.disp=d;if(/\bxxl\b/i.test(r.product)&&!/\bxxl\b/i.test(r.brand))r.brand=(r.brand?r.brand+" ":"")+"XXL"});
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
// Bewertung je Person: wer hat gegessen, Sterne 0,5 bis 5 (gleichen Stern nochmal tippen = halber Stern weniger)
const WER={beide:"Beide",p1:"Person 1",p2:"Person 2"};
const stTxt=v=>String(v).replace(".",",")+" ★";
function starEd(r){const eps=r.wer==="p1"?["p1"]:r.wer==="p2"?["p2"]:["p1","p2"];
  return `<div class="erow"><span class="lbl">Gegessen von</span>${Object.keys(WER).map(k=>`<button type="button" class="chip" data-rw="${k}" aria-pressed="${r.wer===k}">${WER[k]}</button>`).join("")}</div>
    ${eps.map(p=>`<div class="erow"><span class="lbl">${WER[p]}</span><span class="stars"><button type="button" class="sb0${r.s[p]===0?" on":""}" data-sp="${p}" data-sn="0" aria-label="0 Sterne">0</button>${[1,2,3,4,5].map(n=>{const v=r.s[p]||0;return `<button type="button" class="sb${v>=n?" on":v>=n-.5?" half":""}" data-sp="${p}" data-sn="${n}" aria-label="${n} Sterne">★</button>`}).join("")}</span><small>${r.s[p]!=null?stTxt(r.s[p]):""}</small></div>`).join("")}`}
function starClick(r,e){let b;
  if(b=e.target.closest("[data-rw]")){r.wer=b.dataset.rw;return true}
  if(b=e.target.closest("[data-sp]")){const p=b.dataset.sp,n=+b.dataset.sn;if(n===0)r.s[p]=r.s[p]===0?undefined:0;else r.s[p]=r.s[p]===n?n-.5:n;if(r.s[p]==null)delete r.s[p];return true}
  return false}
const starsOf=r=>{const ps=r.wer==="p1"?["p1"]:r.wer==="p2"?["p2"]:["p1","p2"];const s={};for(const p of ps)if(r.s[p]!=null)s[p]=r.s[p];return s};
// Wie gut kam eine Mahlzeit an: Schnitt der Sterne, sonst das alte Urteil
const URT_ST={gern:4.5,okay:3,nein:1};
function mealScore(m){const v=Object.values(m.sterne||{}).filter(x=>typeof x==="number");if(v.length)return v.reduce((a,b)=>a+b,0)/v.length;return URT_ST[m.urteil]??null}
const noRepeat=m=>/nicht wiederholen/i.test(m.tags||"");
const urtFromStars=s=>{const v=Object.values(s);if(!v.length)return "";const a=v.reduce((x,y)=>x+y,0)/v.length;return a>=3.5?"gern":a>=2?"okay":"nein"};
function rateHtml(m){const s=m.sterne||{},wer=m.wer||"";const ps=wer==="p1"?["p1"]:wer==="p2"?["p2"]:["p1","p2"];
  const sum=ps.filter(p=>s[p]!=null).map(p=>`${WER[p]}: ${stTxt(s[p])}`).join(" · ");
  const ed=essen.rate&&essen.rate.id===m.id;
  if(!ed)return `<div class="erate">${wer&&wer!=="beide"?`<span class="ewer">nur ${WER[wer]}</span>`:""}${sum?`<span class="est">${esc(sum)}</span>`:""}<button type="button" class="erb" data-id="${esc(m.id)}">${sum||wer?"ändern":"Bewerten"}</button></div>`;
  return `<div class="ered">${starEd(essen.rate)}
    <div class="erow"><button type="button" class="sbtn" data-rsave="1">Speichern</button><button type="button" class="sbtn ghost" data-rx="1">Abbrechen</button><small class="ermsg"></small></div></div>`}
function renderEssen(){
  const el=document.getElementById("essen");const ms=essen.meals;
  // Was ihr mögt: oft und gern gegessen, und was nicht ankommt
  // Was ihr mögt: Schnitt der Sterne je Gericht (ohne Sterne zählt das alte Urteil)
  const by=new Map();for(const m of ms){if(/getränk/i.test(m.art||""))continue;const o=by.get(m.name)||{n:0,sum:0,k:0,no:false};o.n++;const v=mealScore(m);if(v!=null){o.sum+=v;o.k++}if(noRepeat(m))o.no=true;by.set(m.name,o)}
  for(const o of by.values())o.avg=o.k?o.sum/o.k:null;
  const fav=[...by.entries()].filter(([,o])=>!o.no&&o.avg!=null&&o.avg>=3.5).sort((a,b)=>b[1].avg-a[1].avg||b[1].n-a[1].n).slice(0,10);
  const nope=[...by.entries()].filter(([,o])=>o.no||(o.avg!=null&&o.avg<2)).slice(0,8);
  const days=[];for(const m of ms){let d=days.find(x=>x.d===m.datum);if(!d){d={d:m.datum,l:[]};days.push(d)}d.l.push(m)}
  const who=m=>m.rolle===essen.role?"du":"Mitbewohner:in";
  el.innerHTML=`<div class="ehead"><div><h2>Essen</h2><p class="hint">Tragt ein, was ihr gegessen habt. Daraus lernt die App, was euch schmeckt, und plant später die Woche danach.</p></div><button type="button" class="ebig" id="enew">+ Was gab's?</button></div>
  ${fav.length||nope.length?`<section class="elike">${fav.length?`<div><h3>Gern gegessen</h3><div class="echips">${fav.map(([n,o])=>`<button type="button" class="chip" data-quick="${esc(n)}">${esc(n)} <small>${esc(stTxt(Math.round(o.avg*2)/2))}${o.n>1?` · ${o.n}×`:""}</small></button>`).join("")}</div></div>`:""}${nope.length?`<div><h3>Kommt nicht so an</h3><div class="echips">${nope.map(([n])=>`<span class="chip off">${esc(n)}</span>`).join("")}</div></div>`:""}</section>`:""}
  <section><h3>Gegessen</h3>${days.length?days.map(d=>`<div class="eday"><div class="edl">${esc(dayLabel(d.d))}</div>${d.l.map(m=>`<div class="emeal"><div class="emain"><div class="ename">${esc(m.name)}</div><div class="ezut">${esc([m.mahlzeit,m.wer?"":who(m),m.zutaten].filter(Boolean).join(" · "))}</div>${rateHtml(m)}${m.rezept||m.warum?`<details class="erez"><summary>Rezept und warum es schmeckt</summary>${m.rezept?`<div class="ert">${esc(m.rezept)}</div>`:""}${m.warum?`<div class="ewh"><strong>Warum lecker:</strong> ${esc(m.warum)}</div>`:""}</details>`:""}</div>${m.urteil&&!Object.keys(m.sterne||{}).length?`<span class="eu u-${esc(m.urteil)}">${esc(URTEIL[m.urteil]||"")}</span>`:""}<button type="button" class="edel" data-id="${esc(m.id)}" aria-label="Eintrag löschen" title="Löschen">×</button></div>`).join("")}</div>`).join(""):`<p class="hint">Noch nichts eingetragen. Tippe auf „Was gab's?“. Nach ein paar Wochen weiß die App, was ihr gern esst.</p>`}</section>`;
}
function openEssen(pre){
  essen.sel={dish:pre||"",urteil:"",mahlzeit:mzNow(),tag:0,foto:"",r:{wer:"beide",s:{}}};
  const o=document.getElementById("eovl");o.hidden=false;document.getElementById("etext").value="";document.getElementById("einfo").textContent="";
  document.getElementById("eprev").hidden=true;document.getElementById("efile").value="";drawEssenDlg();
}
function drawEssenDlg(){
  const s=essen.sel;
  document.getElementById("emz").innerHTML=MZ.map(m=>`<button type="button" class="chip" data-mz="${m}" aria-pressed="${s.mahlzeit===m}">${m}</button>`).join("");
  document.getElementById("etag").innerHTML=["Heute","Gestern","Vorgestern"].map((t,i)=>`<button type="button" class="chip" data-tag="${i}" aria-pressed="${s.tag===i}">${t}</button>`).join("");
  const kd=knownDishes().slice(0,14);
  document.getElementById("edish").innerHTML=kd.length?kd.map(n=>`<button type="button" class="chip" data-dish="${esc(n)}" aria-pressed="${s.dish===n}">${esc(n)}</button>`).join(""):`<span class="hint">Eure Gerichte erscheinen hier, sobald ihr welche eintragt.</span>`;
  document.getElementById("eurt").innerHTML=starEd(s.r);
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
    const rb=e.target.closest(".erb");if(rb){const m=essen.meals.find(x=>String(x.id)===rb.dataset.id);if(!m)return;
      essen.rate={id:m.id,wer:m.wer||"beide",s:{...(m.sterne||{})}};renderEssen();return}
    if(essen.rate&&e.target.closest(".ered")){const r=essen.rate;let b;
      if(starClick(r,e)){renderEssen();return}
      if(e.target.closest("[data-rx]")){essen.rate=null;renderEssen();return}
      if(b=e.target.closest("[data-rsave]")){b.disabled=true;const s=starsOf(r);
        const ok=await window.MK_ESSEN.upd({id:r.id,wer:r.wer,sterne:s}).catch(()=>false);
        if(ok){const m=essen.meals.find(x=>x.id===r.id);if(m){m.wer=r.wer;m.sterne=s}essen.rate=null;renderEssen()}
        else{b.disabled=false;const msg=el.querySelector(".ermsg");if(msg)msg.textContent="Speichern hat nicht geklappt."}}
      return}
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
    else if(starClick(s.r,e)){}
    else if(e.target.closest("#efoto")){document.getElementById("efile").click();return}
    else if(e.target.closest("#erm")){s.foto="";document.getElementById("eprev").hidden=true;document.getElementById("efile").value="";return}
    else return;drawEssenDlg()});
  document.getElementById("efile").onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;
    try{essen.sel.foto=await shrinkPhoto(f);const p=document.getElementById("eprev");p.hidden=false;p.querySelector("img").src=essen.sel.foto}catch(err){document.getElementById("einfo").textContent="Das Foto ließ sich nicht lesen."}};
  dlg.onsubmit=async e=>{e.preventDefault();if(essen.busy)return;const s=essen.sel,text=document.getElementById("etext").value.trim(),info=document.getElementById("einfo");
    if(!s.dish&&!text&&!s.foto){info.textContent="Tippe ein Gericht an, schreib kurz, was es gab, oder mach ein Foto.";return}
    const d=dishes.find(x=>x.name===s.dish);
    essen.busy=true;const sb=document.getElementById("esave");sb.disabled=true;info.textContent=s.foto||text?"Gericht wird erkannt …":"wird gespeichert …";
    const st=starsOf(s.r);
    try{const meal=await window.MK_ESSEN.add({dish:s.dish,text,foto:s.foto,urteil:urtFromStars(st),mahlzeit:s.mahlzeit,datum:isoDay(s.tag),bekannt:knownDishes().slice(0,80),zutaten:d?d.items.map(i=>i.n):[]});
      if(!meal)throw 0;
      // Wer gegessen hat und Sterne gleich mitspeichern
      if(meal.id&&(Object.keys(st).length||s.r.wer!=="beide")){const ok=await window.MK_ESSEN.upd({id:meal.id,wer:s.r.wer,sterne:st}).catch(()=>false);if(ok){meal.wer=s.r.wer;meal.sterne=st}}
      essen.meals.unshift({...meal,id:meal.id});essen.meals.sort((a,b)=>String(b.datum+b.at).localeCompare(String(a.datum+a.at)));close();renderEssen();try{if(typeof askVorrat==="function")askVorrat(meal)}catch(e2){}}
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
    <table class="bz"><tbody>${b.zeilen.map(z=>`<tr class="${z.typ!=="ware"?"bx":""}"><td><div${z.artikel?` class="aopen" data-art="${esc(z.artikel)}"`:""}>${esc(z.typ==="ware"?cleanName(z.name||z.text):(z.name||z.text))}${z.typ==="ware"?marksPill({product:(z.name||"")+" "+(z.text||""),art:z.artikel}):""}</div>${z.typ==="ware"&&z.id?(z.artikel?`<button type="button" class="part bset" data-b="${esc(b.id)}" data-z="${esc(z.id)}" title="Artikel ändern">${esc(z.artikel)}</button>`:`<button type="button" class="bset bnone" data-b="${esc(b.id)}" data-z="${esc(z.id)}">+ Artikel zuordnen</button>`):(z.artikel?`<span class="part">${esc(z.artikel)}</span>`:"")}${artinfo.on&&z.typ==="ware"?artBadges(z.artikel,z.verarbeitung):""}${z.rabatt?` <small class="brab">−${eur(z.rabatt)} Rabatt</small>`:""}</td><td class="bm">${esc(fmtMenge(z.menge,z.einheit))}</td><td class="bp">${eur(z.preis)}${z.einheit!=="Stk"&&z.grundpreis?`<small>${eur(z.grundpreis)}/${z.einheit}</small>`:""}</td></tr>`).join("")}</tbody></table>
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

// Vorrat (Web-Version): füllt sich aus den Kassenbons, Gerichte aus dem Tagebuch ziehen ab, "leer" tippen korrigiert.
// Haltbarkeit ist eine Schätzung je Artikel. Geteilter Zustand (leer markiert, von Hand ergänzt) liegt im Haushalt.
var vorrat={on:false,st:{gone:{},extra:[]},saving:false,kat:""};
const SHELF=[[/reste|karkasse/i,2],[/zuckermais|maiskolben|\bmais\b|zuckerschote/i,5],[/salat|rucola|spinat|kresse|sprossen|kräuter|basilikum|petersilie|schnittlauch|koriander|minze/i,4],[/beere|himbeer|erdbeer|heidelbeer|brombeer|kirsch/i,3],
 [/pilz|champignon|seitling/i,4],[/hack/i,1],[/lachs|fisch|forelle|garnele|dorade|kabeljau|seelachs|muschel|tintenfisch/i,2],[/tiefgek|tk\b|tiefgefr/i,180],
 [/hähnchen|pute|ente|gans|rind|kalb|lamm|steak|fleisch/i,3],[/milch|joghurt|kefir|skyr|quark|sahne|buttermilch/i,10],[/eier/i,21],[/butter/i,30],
 [/käse|parmesan|parmigiano|bergkäse|gouda|feta|mozzarella|burrata|brie/i,14],[/kartoffel|zwiebel|knoblauch|schalotte|kürbis|kohl\b|weißkohl|rotkohl/i,30],
 [/äpfel|apfel|birne|zitrone|orange|clementine|mandarine|grapefruit/i,21],[/banane|avocado|mango|kiwi|tomate|gurke|paprika|zucchini|aubergine|brokkoli|blumenkohl/i,6],
 [/möhre|karotte|sellerie|lauch|rote bete|fenchel|kohlrabi|rettich|radieschen/i,10],[/brot|brötchen/i,4],
 [/nuss|nüsse|mandel|cashew|linsen|kichererbsen|bohnen getr|reis|nudel|hafer|mehl|öl\b|olivenöl|essig|\bzucker\b|\bsalz\b|kidney|pistazie|fruchtgummi|gummibär|schokolade|konserve|im glas|dose|schorle|saft/i,180]];
const GRP_SHELF={"Obst":7,"Gemüse":7,"Fleisch":3,"Fisch":2,"Milch & Eier":10,"Käse":14,"Feinkost":10,"Nüsse & Hülsenfrüchte":180,"Getreide & Flocken":180,"Saaten & Öle":180,"Vorrat":180,"Getränke":60,"Haushalt":365};
function shelfDays(art,name){const t=(art||"")+" "+(name||"");for(const [rx,d] of SHELF)if(rx.test(t))return d;const g=art&&typeof grpOf==="function"?grpOf(art):null;return GRP_SHELF[g]||14}
const addDays=(iso,n)=>{const [Y,M,D]=String(iso).split("-").map(Number);const d=new Date(Y,M-1,D+n);return isoDay(Math.round((new Date().setHours(0,0,0,0)-d)/864e5))};
const dShort=iso=>{const [Y,M,D]=String(iso).split("-");return D+"."+M+"."};
const normW=s=>String(s||"").toLowerCase().replace(/[^a-zäöüß]+/g," ").trim();
function stockItems(){
  const today=isoDay(0),out=[];
  for(const b of (typeof bons!=="undefined"&&bons.list)||[])b.zeilen.forEach((z,i)=>{if(z.typ!=="ware")return;
    const key=b.id+"|"+i,n=z.einheit==="Stk"&&+z.menge>1?Math.round(+z.menge):1;out.push({key,art:z.artikel||"",name:z.artikel||z.name,detail:z.name,menge:z.menge,einheit:z.einheit,datum:b.datum,laden:b.laden,bis:addDays(b.datum,shelfDays(z.artikel,z.name)),ver:z.verarbeitung||"",n,amt:z.einheit==="kg"&&z.menge>0?(z.menge<1?Math.round(z.menge*1000)+" g":String(z.menge).replace(".",",")+" kg"):z.einheit==="l"&&z.menge>0?(z.menge<1?Math.round(z.menge*1000)+" ml":String(z.menge).replace(".",",")+" l"):""})});
  for(const x of vorrat.st.extra||[])out.push({key:"x|"+x.id,art:x.art||"",name:x.name,detail:"",datum:x.datum,laden:"",bis:addDays(x.datum,x.tk?90:shelfDays(x.art,x.name)),manual:true,tk:!!x.tk,ort0:x.ort||"",n:x.n||1,xid:x.id});
  {const MM=vorrat.st.minus||{};for(const x of out)if(MM[x.key])x.n=(x.n||1)-MM[x.key];for(const x of out)if(x.n<=0)vorrat.st.gone[x.key]=vorrat.st.gone[x.key]||isoDay(0)}
  const OV=vorrat.st.ort||{};
  for(const x of out)x.ort=x.tk?"tk":OV[x.key]||x.ort0||(shelfDays(x.art,x.name)>=60?"kammer":"kueche");
  // Gegessenes zieht ab: je Mahlzeit und Zutat das älteste passende Stück
  const used=new Set();
  const meals=((typeof essen!=="undefined"&&essen.meals)||[]).slice().sort((a,b)=>String(a.datum).localeCompare(String(b.datum)));
  // Mahlzeiten, die über das Abfrage-Fenster schon bestätigt wurden, ziehen hier nichts mehr ab
  const DONE=vorrat.st.done||{};
  for(const m of meals){if(m.id&&DONE[m.id])continue;const zs=String(m.zutaten||"").split(",").map(normW).filter(Boolean);
    for(const z of zs){const it=out.filter(x=>!used.has(x.key)&&x.datum<=m.datum&&(x.art||x.name)&&!x.tk&&!(vorrat.st.tk||{})[x.key]&&!(x.einheit==="kg"&&x.menge>=0.5)&&!(x.einheit==="l"&&x.menge>=1)&&true).sort((a,b)=>String(a.datum).localeCompare(String(b.datum)))
      .find(x=>{const a=normW(x.art||x.name);return a&&(a.includes(z)||z.includes(a.replace(/n$|en$|e$/,"")))});if(it){it.n=(it.n||1)-1;if(it.n<=0)used.add(it.key)}}}
  return out.filter(x=>!used.has(x.key)&&!vorrat.st.gone[x.key]&&!(vorrat.st.tk||{})[x.key]&&(x.tk||addDays(x.bis,7)>=today))
    .map(x=>({...x,state:x.bis<today?"alt":x.bis<=addDays(today,2)?"bald":"ok"}))
    .sort((a,b)=>String(a.bis).localeCompare(String(b.bis)));
}
function homeNote(n){if(typeof vorrat==="undefined"||!vorrat||!vorrat.on)return "";const a=normW(n);if(!a)return "";
  const it=stockItems().find(x=>normW(x.art||x.name)===a);return it?` · <span class="home">zu Hause seit ${esc(dShort(it.datum))}</span>`:""}
async function initVorrat(){const V=window.MK_VORRAT;if(!V)return;try{const v=await V.get();vorrat.on=true;if(v&&typeof v==="object")vorrat.st={gone:v.gone||{},extra:v.extra||[],tk:v.tk||{},ort:v.ort||{},minus:v.minus||{},done:v.done||{}};
  document.getElementById("vorratbtn").hidden=false;document.getElementById("sparbtn").hidden=false;const lv=lsGet("bpf_view","");if(lv==="vorrat"||lv==="spar")st.view=lv;render()}catch(e){}}
async function saveVorrat(){if(!window.MK_VORRAT)return;
  // Alte Markierungen aufräumen, damit der Zustand klein bleibt
  const lim=isoDay(90);for(const [k,d] of Object.entries(vorrat.st.gone))if(d<lim)delete vorrat.st.gone[k];
  vorrat.st.extra=(vorrat.st.extra||[]).filter(x=>x.tk?!vorrat.st.gone["x|"+x.id]||vorrat.st.gone["x|"+x.id]>=lim:x.datum>=lim);
  const lim2=isoDay(120);for(const [k,d] of Object.entries(vorrat.st.tk||{}))if(d<lim2)delete vorrat.st.tk[k];
  for(const [k,d] of Object.entries(vorrat.st.done||{}))if(d<lim2)delete vorrat.st.done[k];
  const keys=new Set(stockItems().map(x=>x.key));for(const k of Object.keys(vorrat.st.ort||{}))if(!keys.has(k))delete vorrat.st.ort[k];
  try{await window.MK_VORRAT.set(vorrat.st)}catch(e){}}
// Ideen: eure gern gegessenen Gerichte, die das verbrauchen, was bald weg muss
function ideas(bald){
  const fav=new Map();for(const m of (essen.meals||[])){const v=mealScore(m);if(noRepeat(m)||(v!=null&&v<2))continue;const o=fav.get(m.name)||{z:normW(m.zutaten),g:0};if(v!=null&&v>=3.5)o.g++;fav.set(m.name,o)}
  for(const d of dishes)if(!fav.has(d.name))fav.set(d.name,{z:normW(d.items.map(i=>i.n).join(" ")),g:0,reste:d.reste?normW(d.reste):""});
  const out=[];for(const [n,o] of fav){const hit=bald.filter(x=>{const nm=normW(x.name);if(o.reste&&/reste|karkasse/.test(nm))return nm.includes(o.reste);const a=normW(x.art||x.name).replace(/n$|en$|e$/,"");return a.length>2&&o.z.includes(a)}).map(x=>x.name);
    if(hit.length)out.push({n,hit,score:hit.length*10+o.g})}
  out.sort((a,b)=>b.score-a.score);
  return out.length?`<div class="videa">Idee: ${out.slice(0,3).map(x=>`<button type="button" class="chip" data-quick="${esc(x.n)}">${esc(x.n)}</button> <small>mit ${esc(x.hit.join(", "))}</small>`).join(" ")}</div>`:"";
}
// Leer markiert: letzte 14 Tage, mit "doch noch da" zum Zurückholen
function goneHtml(){const lim=isoDay(14),out=[];
  for(const [k,d] of Object.entries(vorrat.st.gone||{})){if(d<lim)continue;let name="";
    if(k.startsWith("x|")){const x=(vorrat.st.extra||[]).find(e=>"x|"+e.id===k);name=x?x.name:""}
    else{const [bid,i]=k.split("|");const b=(bons.list||[]).find(b=>String(b.id)===bid);const z=b&&b.zeilen[+i];name=z?(z.artikel||z.name):""}
    if(name)out.push({k,name,d})}
  if(!out.length)return "";out.sort((a,b)=>String(b.d).localeCompare(String(a.d)));
  return `<details class="vbox"${vorrat.openGone?" open":""} id="vgone"><summary class="vh">Leer markiert <small>${out.length}</small></summary>${out.map(x=>`<div class="vi"><div class="vt"><div class="vn">${esc(x.name)}</div><div class="vd">leer seit ${esc(dShort(x.d))}</div></div><button type="button" class="vback" data-k="${esc(x.k)}">doch noch da</button></div>`).join("")}</details>`}
function renderVorrat(){
  if(!vorrat.on)return;const el=document.getElementById("vorratv");if(!el)return;
  const all=stockItems();
  const present=artinfo.on?[...new Set(all.flatMap(x=>katsOf(x.art)))].sort((a,b)=>a.localeCompare(b,"de")):[];
  if(!present.includes(vorrat.kat))vorrat.kat="";
  const sel=vorrat.kat?all.filter(x=>katsOf(x.art).includes(vorrat.kat)):all,tks=sel.filter(x=>x.ort==="tk"),kam=sel.filter(x=>x.ort==="kammer"),its=sel.filter(x=>x.ort==="kueche"),bald=its.filter(x=>x.state!=="ok"),rest=its.filter(x=>x.state==="ok");
  const row=x=>{const pr={product:x.detail||x.name,brand:"",description:"",retailer:x.laden||"",art:x.art,category:""};return `<div class="vi ${x.state}">${pxw(`<img class="px aopen" src="${icon(x.art||x.name,x.art?grpOf(x.art):null)}" alt="" data-art="${esc(x.art||x.name)}">`,pr)}<div class="vt"><div class="vn"><span class="aopen" data-art="${esc(x.art||x.name)}">${esc(x.name)}</span>${artinfo.on?artBadges(x.art,x.ver):""}</div><div class="vd">${esc([x.tk?"":x.detail&&cleanName(x.detail)!==x.name?cleanName(x.detail):"",x.laden?sname(x.laden):"",x.n>1?`noch ${x.n} Stück`:x.amt&&!/\d\s?(g|kg|ml|l)\b/i.test(x.detail||"")?x.amt:"",x.tk?`eingefroren am ${dShort(x.datum)}`:`seit ${dShort(x.datum)}`,x.tk?(x.state==="alt"?"lieber bald essen":`gut bis ca. ${dShort(x.bis)}`):x.state==="alt"?"wahrscheinlich drüber":`bis ca. ${dShort(x.bis)}`].filter(Boolean).join(" · "))}</div></div>${x.tk?"":`<button type="button" class="vmv" data-k="${esc(x.key)}" data-o="${x.ort==="kammer"?"kueche":"kammer"}" title="${x.ort==="kammer"?"In Kühlschrank oder Küche":"In die Abstellkammer"}">${x.ort==="kammer"?"→ Küche":"→ Kammer"}</button><button type="button" class="vtk" data-k="${esc(x.key)}" data-n="${esc(x.name)}" data-a="${esc(x.art||"")}" aria-label="${esc(x.name)} einfrieren" title="Einfrieren">❄</button>`}<button type="button" class="vleer" data-k="${esc(x.key)}"${x.n>1?(x.xid?` data-x="${esc(x.xid)}"`:` data-m="1"`):""}>${x.tk?(x.n>1?"1 gegessen":"gegessen"):x.n>1?"1 weg":"leer"}</button></div>`};
  el.innerHTML=`<div class="ehead"><div><h2>Vorrat</h2><p class="hint">Was zu Hause ist und bald weg muss. Füllt sich aus euren Kassenbons, was ihr im Tagebuch esst, zieht die App ab.</p></div></div>
  <h3>Zu Hause <small>${sel.length?sel.length+" Sachen":""}</small></h3>
  ${present.length>1?`<div class="vkat">${["",...present].map(k=>`<button type="button" class="chip${vorrat.kat===k?" on":""}" data-kat="${esc(k)}">${esc(k||"Alle")}</button>`).join("")}</div>`:""}
  ${!sel.length?`<p class="hint">${(bons.list||[]).length?"Alles verbraucht, oder noch nichts eingetragen.":"Fotografiert eure Kassenbons im Reiter Einkaufen, dann füllt sich der Vorrat von selbst."} Was ihr esst, zieht die App ab.</p>`:""}
  ${bald.length?`<div class="vbox bald"><div class="vh">Bald verbrauchen</div>${bald.map(row).join("")}${ideas(bald)}</div>`:""}
  ${rest.length?`<details class="vbox"><summary class="vh">Kühlschrank und Küche <small>${rest.length}</small></summary>${rest.map(row).join("")}</details>`:""}
  ${kam.length?`<details class="vbox kam"><summary class="vh">Abstellkammer <small>${kam.length}</small></summary>${kam.map(row).join("")}</details>`:""}
  ${tks.length?`<div class="vbox tk"><div class="vh">Tiefkühler <small>${tks.length}</small></div>${tks.map(row).join("")}</div>`:""}
  ${goneHtml()}
  <form class="vadd" id="vadd"><input id="vnew" list="artlist" placeholder="Etwas ohne Bon ergänzen, z. B. Eier" aria-label="Vorrat ergänzen" autocomplete="off"><select id="vort" aria-label="Wo"><option value="">Küche</option><option value="kammer">Kammer</option><option value="tk">Tiefkühler</option></select><button type="submit" aria-label="Hinzufügen">+</button></form>`;
}
// Einfrieren: ein Stück oder aufgeteilt in Portionen, z. B. Ente in Keulen und Brust
const tkLine=(v="")=>`<div class="tkr"><input class="tkn" value="${esc(v)}" placeholder="weitere Portion"><input class="tkc" type="number" min="1" max="20" value="1" aria-label="Anzahl"><span>Stück</span></div>`;
function tkForm(btn){const vi=btn.closest(".vi");if(vi.nextElementSibling&&vi.nextElementSibling.classList.contains("tkf"))return;
  vi.insertAdjacentHTML("afterend",`<div class="tkf" data-k="${esc(btn.dataset.k)}" data-a="${esc(btn.dataset.a)}"><div class="lbl">Einfrieren als</div><div class="tkl">${tkLine(btn.dataset.n)}</div>${/ente|gans|huhn|hähnchen|pute|poularde/i.test(btn.dataset.a||btn.dataset.n)?`<label class="tkrest"><input type="checkbox" class="tkre" checked> Reste (Karkasse) kommen in den Kühlschrank und werden bald verwertet</label>`:""}
    <div class="tkb"><button type="button" class="tkadd">+ Portion</button><button type="button" class="tkx">Abbrechen</button><button type="button" class="tkgo">Einfrieren</button></div></div>`)}
(function wireVorrat(){
  const host=document.getElementById("vorratv");if(!host)return;
  host.addEventListener("click",e=>{const q=e.target.closest("[data-quick]");if(q){openEssen(q.dataset.quick);return}
    const kb=e.target.closest("[data-kat]");if(kb){vorrat.kat=kb.dataset.kat;renderVorrat();return}
    const bk=e.target.closest(".vback");if(bk){delete vorrat.st.gone[bk.dataset.k];vorrat.openGone=true;renderVorrat();saveVorrat();return}
    const t=e.target.closest(".vtk");if(t){tkForm(t);return}
    const mv=e.target.closest(".vmv");if(mv){vorrat.st.ort=vorrat.st.ort||{};vorrat.st.ort[mv.dataset.k]=mv.dataset.o;renderVorrat();saveVorrat();return}
    const ta=e.target.closest(".tkadd");if(ta){const l=ta.closest(".tkf").querySelector(".tkl");l.insertAdjacentHTML("beforeend",tkLine());l.lastElementChild.querySelector(".tkn").focus();return}
    const tx=e.target.closest(".tkx");if(tx){tx.closest(".tkf").remove();return}
    const ts=e.target.closest(".tkgo");if(ts){const f=ts.closest(".tkf");const names=[...f.querySelectorAll(".tkr")].map(r=>({n:r.querySelector(".tkn").value.trim(),c:Math.max(1,Math.min(20,parseInt(r.querySelector(".tkc").value)||1))})).filter(x=>x.n);if(!names.length)return;
      vorrat.st.tk=vorrat.st.tk||{};vorrat.st.tk[f.dataset.k]=isoDay(0);
      names.forEach((x,j)=>vorrat.st.extra.push({id:Date.now().toString(36)+j,name:x.n,art:f.dataset.a||"",datum:isoDay(0),tk:true,...(x.c>1?{n:x.c}:{})}));
      const re=f.querySelector(".tkre");if(re&&re.checked){const a=f.dataset.a||"Geflügel";vorrat.st.extra.push({id:Date.now().toString(36)+"r",name:(/^ente/i.test(a)?"Enten":/hähnchen|huhn/i.test(a)?"Hähnchen":a)+"reste (Karkasse)",art:a,datum:isoDay(0)})}renderVorrat();saveVorrat();return}
    const b=e.target.closest(".vleer");if(!b)return;
    if(b.dataset.m){const mm=vorrat.st.minus||(vorrat.st.minus={});mm[b.dataset.k]=(mm[b.dataset.k]||0)+1;renderVorrat();saveVorrat();return}
    if(b.dataset.x){const x=vorrat.st.extra.find(y=>y.id===b.dataset.x);if(x&&(x.n||1)>1){x.n--;renderVorrat();saveVorrat();return}}vorrat.st.gone[b.dataset.k]=isoDay(0);vorrat.openGone=true;renderVorrat();saveVorrat()});
  host.addEventListener("submit",e=>{if(e.target.id!=="vadd")return;e.preventDefault();const v=document.getElementById("vnew").value.trim();if(!v)return;
    const art=typeof artFor==="function"?artFor(v):"";const o=(document.getElementById("vort")||{}).value||"";vorrat.st.extra.push({id:Date.now().toString(36),name:art||v,art:art||"",datum:isoDay(0),...(o==="tk"?{tk:true}:o?{ort:o}:{})});renderVorrat();saveVorrat()});
})();
initVorrat();

// Nach dem Eintragen einer Mahlzeit: fragen, was aus dem Vorrat weg ist.
// Zutaten, die nicht im Vorrat stehen (z. B. frisch gekauft ohne Bon), werden einfach übersprungen.
var vzug={meal:null,items:[]};
function mealTakeQty(meal,x){
  // Menge aus dem gespeicherten Gericht, wenn es eins ist (z. B. 6 Eier beim Rührei)
  const d=dishes.find(y=>y.name===meal.name);const a=normW(x.art||x.name).replace(/n$|en$|e$/,"");
  const it=d&&(d.items||[]).find(i=>{const n=normW(i.n);return n&&(n.includes(a)||a.includes(n.replace(/n$|en$|e$/,"")))});
  if(it&&it.u==="Stk"&&+it.q>0)return Math.round(+it.q);return 1}
function askVorrat(meal){
  if(!vorrat.on||!meal||!meal.id)return;
  vorrat.st.done=vorrat.st.done||{};vorrat.st.done[meal.id]=isoDay(0);
  const zs=String(meal.zutaten||"").split(",").map(normW).filter(Boolean);
  const stock=stockItems(),used=new Set(),out=[];
  for(const z of zs){const x=stock.filter(x=>!used.has(x.key)&&(x.art||x.name)).sort((a,b)=>(a.tk?1:0)-(b.tk?1:0)||String(a.datum).localeCompare(String(b.datum)))
      .find(x=>{const a=normW(x.art||x.name);return a&&(a.includes(z)||z.includes(a.replace(/n$|en$|e$/,"")))});
    if(!x)continue;used.add(x.key);
    const big=(x.einheit==="kg"&&x.menge>=0.5)||(x.einheit==="l"&&x.menge>=1);
    out.push({x,cnt:(x.n||1)>1,q:Math.min(x.n||1,mealTakeQty(meal,x)),on:!big})}
  if(!out.length){saveVorrat();return}
  vzug={meal,items:out};
  document.getElementById("vzhint").textContent=`Für „${meal.name}“. Haken weg, wenn etwas noch da ist.`;
  document.getElementById("vzlist").innerHTML=out.map((o,i)=>{const x=o.x;
    return `<label class="vzr"><input type="checkbox" class="vzc" data-i="${i}"${o.on?" checked":""}><span class="vzn">${esc(x.name)}${x.tk?" <small>(Tiefkühler)</small>":""}</span>${o.cnt?`<span class="vzq"><input type="number" class="vzm" data-i="${i}" min="1" max="${x.n}" value="${o.q}" aria-label="Anzahl"> von ${x.n}</span>`:`<span class="vzq">${(x.einheit==="kg"&&x.menge>=0.5)||(x.einheit==="l"&&x.menge>=1)?"ganz leer?":"leer"}</span>`}</label>`}).join("");
  document.getElementById("vzovl").hidden=false}
(function wireVorratZug(){
  const ovl=document.getElementById("vzovl"),dlg=document.getElementById("vzdlg");if(!ovl)return;
  const close=()=>{ovl.hidden=true;saveVorrat();if(st.view==="vorrat")renderVorrat()};
  document.getElementById("vzno").onclick=close;
  dlg.onsubmit=e=>{e.preventDefault();const today=isoDay(0);
    vzug.items.forEach((o,i)=>{const c=dlg.querySelector(`.vzc[data-i="${i}"]`);if(!c||!c.checked)return;const x=o.x;
      if(o.cnt){const m=dlg.querySelector(`.vzm[data-i="${i}"]`);const q=Math.max(1,Math.min(x.n,parseInt(m&&m.value)||1));
        if(q>=x.n){vorrat.st.gone[x.key]=today;return}
        if(x.xid){const y=vorrat.st.extra.find(e=>e.id===x.xid);if(y){y.n=(y.n||1)-q;return}}
        const mm=vorrat.st.minus||(vorrat.st.minus={});mm[x.key]=(mm[x.key]||0)+q}
      else vorrat.st.gone[x.key]=today});
    close()};
})();

// Artikel-Infos (nur Besitzer): mehrere Kategorien je Artikel, für wen, übliche Verarbeitung
var artinfo={on:false,map:{}};
const KATS=["pflanzliches Protein","tierisches Protein","Gemüse","Obst","Kohlenhydrate","Milchprodukte","Fette & Öle","Snacks & Süßes","Getränke","Vorrat","Tiefkühl","Frühstück"];
const VER={un:"unverarbeitet",leicht:"leicht verarbeitet",stark:"stark verarbeitet"};
const FUER={beide:"Beide",p1:"Person 1",p2:"Person 2"};
const katsOf=art=>art&&artinfo.map[art]?artinfo.map[art].kat:[];
function artBadges(art,ver){const i=art&&artinfo.map[art];const v=ver||(i&&i.ver)||"";let h="";
  if(v)h+=` <span class="vb v-${v}" title="${VER[v]}">${v==="un"?"unverarbeitet":v}</span>`;
  if(i&&i.fuer&&i.fuer!=="beide")h+=` <span class="vb fu">${FUER[i.fuer]}</span>`;return h}
// Vorschlag, solange für einen Artikel noch nichts festgelegt ist
function katGuess(art,name){const t=((art||"")+" "+(name||"")).toLowerCase();const s=new Set();
  const g=art&&knownArts().has(art)&&typeof grpOf==="function"?grpOf(art):"";
  const G={"Fleisch":["tierisches Protein"],"Fisch":["tierisches Protein"],"Milch & Eier":["Milchprodukte"],"Käse":["Milchprodukte"],"Nüsse & Hülsenfrüchte":["pflanzliches Protein"],
    "Obst":["Obst"],"Gemüse":["Gemüse"],"Getreide & Flocken":["Kohlenhydrate"],"Saaten & Öle":["Fette & Öle"],"Getränke":["Getränke"],"Vorrat":["Vorrat"]};
  for(const k of G[g]||[])s.add(k);
  if(/\beier\b|^eier/.test(t)){s.delete("Milchprodukte");s.add("tierisches Protein")}
  if(/salsiccia|wurst|schinken|salami|speck|hack|hähnchen|huhn|pute|rind|schwein|lamm|steak|lachs|fisch|thunfisch|garnele|forelle/.test(t))s.add("tierisches Protein");
  if(/joghurt|quark|skyr|kefir|käse|mozzarella|feta|milch|sahne|butter/.test(t))s.add("Milchprodukte");
  if(/tofu|tempeh|seitan|linsen|kichererbs|bohne|erbsen|edamame|lupine|soja/.test(t))s.add("pflanzliches Protein");
  if(/nudel|pasta|reis|kartoffel|brot|brötchen|couscous|bulgur|quinoa|gnocchi/.test(t))s.add("Kohlenhydrate");
  if(/tiefgek|\btk\b|tiefgefr/.test(t))s.add("Tiefkühl");
  if(/schokolade|keks|chips|gummi|riegel|kuchen|eis\b/.test(t))s.add("Snacks & Süßes");
  if(/hafer|müsli|flocken|marmelade|granola/.test(t))s.add("Frühstück");
  return [...s]}
async function initArtinfo(){const A=window.MK_ART;if(!A)return;
  try{const l=await A.get();if(!l)return;artinfo.on=true;document.body.classList.add("artok");
    for(const a of l)artinfo.map[a.artikel]={kat:String(a.kategorien||"").split(",").map(x=>x.trim()).filter(Boolean),fuer:a.fuer||"beide",ver:a.verarbeitung||"",pfad:String(a.pfad||"").split(">").map(x=>x.trim()).filter(Boolean)};
    if(bons.on)drawBons();if(vorrat.on&&st.view==="vorrat")renderVorrat()}catch(e){}}
initArtinfo();

// Bonzeilen zuordnen: vorhandenen Artikel wählen oder (nur Besitzer) neuen Artikel anlegen, dazu Kategorien, für wen, Verarbeitung
function knownArts(){return new Set([...document.querySelectorAll("#artlist option")].map(o=>o.value))}
function assignForm(btn){
  const b=bons.list.find(x=>String(x.id)===btn.dataset.b);const z=b&&b.zeilen.find(x=>String(x.id)===btn.dataset.z);if(!z)return;
  const td=btn.closest("td");if(td.querySelector(".bform"))return;
  const owner=(typeof essen!=="undefined"&&essen.role==="owner")||!!window.MK_PRUEF&&typeof pruef!=="undefined"&&pruef.on;
  const ext=owner&&artinfo.on;
  const f=document.createElement("form");f.className="bform";
  f.innerHTML=`<input class="bart" list="artlist" placeholder="Artikel wählen${owner?" oder neu eingeben":""}" value="${esc(z.artikel||"")}" aria-label="Artikel">
    <button type="submit">OK</button><button type="button" class="bx">×</button><small class="bmsg"></small>
    ${ext?`<div class="bext">
      <div class="brow"><span class="lbl">Verarbeitung</span><span class="seg" data-f="ver">${Object.keys(VER).map(v=>`<button type="button" class="chip" data-v="${v}">${v==="un"?"unverarbeitet":v}</button>`).join("")}</span></div>
      <div class="brow"><span class="lbl">Für</span><span class="seg" data-f="fuer">${Object.keys(FUER).map(v=>`<button type="button" class="chip" data-v="${v}">${FUER[v]}</button>`).join("")}</span></div>
      <div class="brow"><span class="lbl">Einordnung</span><span class="pf"></span></div>
      <div class="brow"><span class="lbl">Kategorien</span><span class="kc"></span></div>
      <div class="brow"><input class="knew" placeholder="Eigene Kategorie, z. B. Grillen" aria-label="Eigene Kategorie" autocomplete="off"><button type="button" class="kadd">+</button></div>
    </div>`:""}`;
  td.appendChild(f);const inp=f.querySelector(".bart"),msg=f.querySelector(".bmsg");inp.focus();inp.select();
  // Werte: Verarbeitung gilt für diesen Einkauf (die KI schlägt sie je Produkt vor), Kategorien und für wen für den Artikel
  let ver="",fuer="beide",kats=new Set(),forArt=null,pfad=[],pfTouched=false;
  const load=a=>{const i=artinfo.map[a];forArt=a;fuer=i?i.fuer:"beide";kats=new Set(i&&i.kat.length?i.kat:katGuess(a,z.name||z.text));ver=z.verarbeitung||(i&&i.ver)||"";
    pfad=i&&i.pfad&&i.pfad.length?i.pfad.slice():pathGuess(a,z.name||z.text);pfTouched=false};
  const paint=()=>{if(!ext)return;
    f.querySelectorAll('[data-f="ver"] .chip').forEach(c=>c.setAttribute("aria-pressed",c.dataset.v===ver));
    f.querySelectorAll('[data-f="fuer"] .chip').forEach(c=>c.setAttribute("aria-pressed",c.dataset.v===fuer));
    const own=new Set(Object.values(artinfo.map).flatMap(i=>i.kat));
    const list=[...new Set([...KATS,...own,...kats])];
    f.querySelector(".pf").innerHTML=pfadEditor(pfad);
    f.querySelector(".kc").innerHTML=list.map(k=>`<button type="button" class="chip kchip${kats.has(k)?" on":""}" data-k="${esc(k)}">${esc(k)}</button>`).join("")};
  load(inp.value.trim());
  const upd=()=>{const v=inp.value.trim();const neu=v&&!knownArts().has(v);msg.textContent=neu?(owner?"Neuer Artikel, wird in deiner Artikelliste angelegt":"Bitte einen Artikel aus der Liste wählen"):"";
    if(ext&&v!==forArt&&(!neu||!v)){load(v);paint()}
    else if(ext&&neu&&!pfTouched){pfad=pathGuess(v,z.name||z.text);paint()}};
  inp.oninput=upd;upd();paint();
  if(ext){
    f.addEventListener("click",e=>{const c=e.target.closest(".chip");if(!c)return;
      const seg=c.closest(".seg");if(seg){if(seg.dataset.f==="ver")ver=ver===c.dataset.v?"":c.dataset.v;else fuer=c.dataset.v;paint();return}
      if(c.dataset.k!=null){const k=c.dataset.k;kats.has(k)?kats.delete(k):kats.add(k);paint();return}
      if(c.dataset.pf!=null){pfTouched=true;if(c.dataset.pf==="-")pfad.pop();else if(pfad.length<6)pfad.push(c.dataset.pf);paint()}});
    f.addEventListener("keydown",e=>{const pi=e.target.closest(".pfin");if(!pi||e.key!=="Enter")return;e.preventDefault();const v=pi.value.trim().replace(/>/g,"").slice(0,30);
      if(v&&pfad.length<6){pfad.push(v);pfTouched=true;paint();const n=f.querySelector(".pfin");if(n)n.focus()}});
    const kn=f.querySelector(".knew");const addK=()=>{const k=kn.value.trim().slice(0,30);if(!k)return;if(kats.size<8)kats.add(k);kn.value="";paint()};
    f.querySelector(".kadd").onclick=addK;kn.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addK()}});
  }
  f.querySelector(".bx").onclick=()=>f.remove();
  f.onsubmit=async e=>{e.preventDefault();const v=inp.value.trim();if(!v)return;const neu=!knownArts().has(v);if(neu&&!owner){upd();return}
    f.querySelectorAll("button,input").forEach(x=>x.disabled=true);msg.textContent="wird gespeichert …";
    const ok=await window.MK_BON.assign({id:z.id,artikel:v,neu,text:z.text,laden:b.laden,einheit:z.einheit,verarbeitung:ext?ver:(z.verarbeitung||""),beispiel:`${z.name||z.text} (${sname(b.laden)}) ${eur(z.preis)}`}).catch(()=>false);
    let ok2=true;
    if(ok&&ext){const old=artinfo.map[v]||{};const info={kat:[...kats].slice(0,8),fuer,ver:old.ver||ver,pfad:pfad.slice(0,6)};
      if(JSON.stringify(info)!==JSON.stringify({kat:old.kat,fuer:old.fuer,ver:old.ver,pfad:old.pfad})){
        ok2=await window.MK_ART.set({artikel:v,kategorien:info.kat,fuer:info.fuer,verarbeitung:info.ver,pfad:info.pfad}).catch(()=>false);if(ok2)artinfo.map[v]=info}}
    if(ok){z.artikel=v;if(ext)z.verarbeitung=ver;drawBons();const d=[...document.querySelectorAll("details.bon")].find(x=>x.querySelector(`[data-b="${b.id}"]`));if(d)d.open=true;
      if(neu){const o=document.createElement("option");o.value=v;document.getElementById("artlist").appendChild(o)}
      if(!ok2){const i=document.getElementById("binfo");if(i)i.textContent="Artikel zugeordnet, aber Kategorien konnten nicht gespeichert werden. Bitte nochmal öffnen."}}
    else{f.querySelectorAll("button,input").forEach(x=>x.disabled=false);msg.textContent="Speichern hat nicht geklappt."}};
}
document.getElementById("bons")&&document.getElementById("bons").addEventListener("click",e=>{const b=e.target.closest(".bset");if(b){e.preventDefault();assignForm(b)}});

// Einordnung als Pfad, z. B. tierisches Protein > Fleisch > Rind > Suppenfleisch, und beim Rind: woher das Stück kommt
const COW={w:87,h:57,eye:[79,12],nose:[86,20],px:".............................................................................k.....................................................................................kkk....................................................................................kkk................................................................................hh..kkk................................................................................hhhhkkk................................................................................hhhhkkk................................................................................hhhhkkk................................................................................hhhhkk...............................................................................hhhhhhkkk.............eeeeeeeeeuuuuuuuuuuulllllllllllllllll......rrrbbbbbb........bbbhhhhhhhhkkkk..........eeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkk........eeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkk......eeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkk......eeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkk.....eeeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkk....eeeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkk....eeeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkk...eeeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmm..eeeeeeeeeeeeeeuuuuuuuuuuulllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmmm.eeeeeeeeeeeeeeeeeeeeeeeeelllllllllllllllllrrrrrrrrrbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmmmm.eeeeeeeeeeeeeeeeeeeeeeeelllllllllllllllllqqqqqqqqqbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmmmm.eeeeeeeeeeeeeeeeeeeeeeeelllllllllllllllllqqqqqqqqqbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmmmm.eeeeeeeeeeeeeeeeeeeeeeeelllllllllllllllllqqqqqqqqqbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmmmm.eeeeeeeeeeeeeeeeeeeeeeeedddddddddddddddddqqqqqqqqqbbbbbbbbbbbbbbbbbhhhhhhhhkkkkkkkmmmm.eeeeeeeeeeeeeeeeeeeeeeeedddddddddddddddddqqqqqqqqqbbbbbbbbbbbbbbbbbbbbbbbbbkkkkkkkmm....eeeeeeeeeeeeeeeeeeeeeeedddddddddddddddddqqqqqqqqqbbbbbbbbbbbbbbbbbbbbbbbb.......km.....eeeeeeeeeeeeeeeeeeeeeeedddddddddddddddddqqqqqqqqqbbbbbbbbbbbbbbbbbbb...................eeeeeeeeeeeeeeeeeeeeeeedddddddddddddddddqqqqqqqqqbbbbbbbbbbbbbbbbb......................eeeeeeeeeeeeeeeeeeeeeedddddddddddddddddqqqqqqqqqsssssssssssssssss......................eeeeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddssssssssssssssss.......................eeeeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddsssssssssssssss.........................eeeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddssssssssssssss..........................eeeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddssssssssssssss...........................eeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddsssssssssssss............................eeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddssssssssssss.............................eeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddssssssssssss.............................eeeeeeeeeeeeeeeeee..ddddddddddddddddddddddddddssssssssssss.............................eeeeeeeeeeeeeeeeee....ddddddddddddddddddddddddssssssssssss.............................eeeeeeeeeeeeeeeeee.......ddddddddddd.......bbbbbbbbbbbbbbb.............................eeeeeeeeeeeeeeeee...........................bbbbbbbbbbbbbb.............................eeeeeeeeeeeeeeeee..........................bbbbbbb.bbbbbbbb...........................eeeeeeeeeeeeeeeeee..........................bbbbbb...bbbbbbb...........................eeeeeeeeeeeeeeeeeee.........................bbbbbb....bbbbbbb..........................eeeeeeeeeeeeeeeeeee.........................pppppp....ppppppp...........................eeeeeeeeee.eeeeeeee........................ppppp......pppppp...........................eeeeeeeee...eeeeeeee.......................ppppp......pppppp...........................eeeeeeeee.....eeeeeee......................ppppp.......pppppp...........................pppppppp......ppppppp.....................ppppp........ppppp.............................pppppp.......ppppppp...................pppppp........pppppp............................pppppp........ppppppp..................pppppp.........ppppp............................pppppp........ppppppp..................pppppp.........pppppp...........................pppppp.........ppppppp..................pppppp........pppppp..........................ppppppp..........ppppppp.................pppppp.........pppppp..........................ppppppp..........pppppp.................ffffff.........ffffff...........................ffffff..........ffffff.................................fffff...........................ffffff..................................................ff.............................ffffff........................................................................"};
const BEEF={"Suppenfleisch":"sqp","Hackfleisch":"bhe","Gulasch":"bhe","Rouladen":"e","Tafelspitz":"u","Hüftsteak":"u","Rumpsteak":"l","Roastbeef":"l","Filet":"l","Entrecôte":"r","Ribeye":"r",
  "Brust":"s","Querrippe":"q","Short Ribs":"q","Beinscheibe":"p","Ossobuco":"p","Schmorbraten":"b","Schaufelstück":"b","Flank Steak":"d","Bavette":"d","Backe":"k","Zunge":"k","Kamm":"h","Oberschale":"e","Unterschale":"e","Nuss":"e"};
const BEEFTIP={"Suppenfleisch":"Viel Bindegewebe und Knochen, wird beim langen Köcheln zart. Gut für Brühe, Suppe, Eintopf.","Hackfleisch":"Meist aus Schulter, Hals und Keule gemischt.",
  "Gulasch":"Kräftig durchwachsen, braucht 1,5 bis 2 Stunden Schmoren.","Rouladen":"Aus der mageren Keule, meist aus der Oberschale.","Tafelspitz":"Aus der Hüfte, klassisch in Brühe gezogen.",
  "Hüftsteak":"Aus der Hüfte, mager und kräftig, kurz braten.","Rumpsteak":"Aus dem Roastbeef, zart, kurz braten.","Roastbeef":"Kaum beanspruchter Rückenmuskel, rosa garen.",
  "Filet":"Liegt innen unter der Lende und wird kaum bewegt, das zarteste Stück.","Entrecôte":"Aus der Hochrippe, mit Fettauge, kurz braten oder grillen.","Ribeye":"Aus der Hochrippe, mit Fettauge, kurz braten oder grillen.",
  "Brust":"Viel Bindegewebe, lange kochen oder schmoren.","Querrippe":"Rippenfleisch mit Knochen, ideal für Brühe und zum Schmoren.","Short Ribs":"Rippenfleisch mit Knochen, lange schmoren.",
  "Beinscheibe":"Mit Markknochen und Sehnen, für Brühe und Ossobuco.","Ossobuco":"Beinscheibe mit Markknochen, lange schmoren.","Schmorbraten":"Aus der Schulter, lange schmoren.",
  "Schaufelstück":"Aus der Schulter, schmoren oder ohne Sehne als Flat Iron kurz braten.","Flank Steak":"Aus dem Bauchlappen, kurz braten und quer zur Faser schneiden.","Bavette":"Aus dem Bauchlappen, kurz braten und quer zur Faser schneiden.",
  "Backe":"Kaumuskel mit viel Kollagen, 3 bis 4 Stunden schmoren.","Zunge":"Lange kochen, dann häuten.","Kamm":"Aus dem Hals, für Gulasch und Schmorbraten.",
  "Oberschale":"Mager, für Rouladen und Braten.","Unterschale":"Mager, für Braten und Schmoren.","Nuss":"Mager, für Braten, Steaks und Fondue."};
const CUTN={k:"Kopf und Backe",h:"Hals",b:"Schulter",r:"Hochrippe",l:"Roastbeef und Filet",u:"Hüfte",e:"Keule",s:"Brust",q:"Querrippe",d:"Bauchlappen",p:"Beinscheibe"};
const TREE={"tierisches Protein":{"Fleisch":{"Rind":Object.fromEntries(Object.keys(BEEF).map(k=>[k,{}])),"Schwein":{},"Geflügel":{"Hähnchen":{},"Pute":{},"Ente":{}},"Lamm":{},"Wild":{}},
    "Fisch & Meeresfrüchte":{"Lachs":{},"Weißfisch":{},"Garnelen":{}},"Eier":{},"Milchprodukte":{"Käse":{},"Joghurt":{},"Quark":{},"Milch":{}}},
  "pflanzliches Protein":{"Hülsenfrüchte":{"Linsen":{},"Kichererbsen":{},"Bohnen":{}},"Tofu & Tempeh":{"Tofu":{},"Tempeh":{}},"Nüsse & Samen":{}},
  "Gemüse":{"Blattgemüse":{},"Kohl":{},"Wurzelgemüse":{},"Fruchtgemüse":{},"Pilze":{},"Kräuter":{}},"Obst":{"Beeren":{},"Kernobst":{},"Steinobst":{},"Zitrusfrüchte":{},"Exoten":{}},
  "Kohlenhydrate":{"Getreide":{},"Nudeln":{},"Reis":{},"Brot":{},"Kartoffeln":{}},"Fette & Öle":{},"Snacks & Süßes":{},"Getränke":{}};
const BEEFKEY=[["suppenfleisch","Suppenfleisch"],["hack","Hackfleisch"],["gulasch","Gulasch"],["roulade","Rouladen"],["tafelspitz","Tafelspitz"],["hüftsteak","Hüftsteak"],["rumpsteak","Rumpsteak"],["roastbeef","Roastbeef"],
  ["filet","Filet"],["entrec","Entrecôte"],["ribeye","Ribeye"],["rib eye","Ribeye"],["short rib","Short Ribs"],["querrippe","Querrippe"],["brust","Brust"],["beinscheibe","Beinscheibe"],["ossobuco","Ossobuco"],
  ["schmorbraten","Schmorbraten"],["schaufel","Schaufelstück"],["flank","Flank Steak"],["bavette","Bavette"],["backe","Backe"],["zunge","Zunge"],["oberschale","Oberschale"],["unterschale","Unterschale"]];
function pathGuess(art,name){const t=((art||"")+" "+(name||"")).toLowerCase();const P=["tierisches Protein"],F=[...P,"Fleisch"];
  if(/rind|beef|ochse|kalb/.test(t)){const k=BEEFKEY.find(([w])=>t.includes(w));return k?[...F,"Rind",k[1]]:[...F,"Rind"]}
  if(/schwein|speck|schinken|salami|salsiccia/.test(t))return [...F,"Schwein"];
  if(/hähnchen|huhn|hühn|chicken/.test(t))return [...F,"Geflügel","Hähnchen"];if(/pute|truthahn/.test(t))return [...F,"Geflügel","Pute"];if(/\bente\b|entenbrust/.test(t))return [...F,"Geflügel","Ente"];
  if(/lamm/.test(t))return [...F,"Lamm"];if(/hirsch|reh|wildschwein/.test(t))return [...F,"Wild"];
  if(/lachs/.test(t))return [...P,"Fisch & Meeresfrüchte","Lachs"];if(/garnele|shrimp/.test(t))return [...P,"Fisch & Meeresfrüchte","Garnelen"];if(/fisch|kabeljau|seelachs|dorade|forelle/.test(t))return [...P,"Fisch & Meeresfrüchte"];
  if(/\beier\b|^eier/.test(t))return [...P,"Eier"];
  if(/käse|mozzarella|feta|parmesan|parmigiano|gouda|brie|geramont/.test(t))return [...P,"Milchprodukte","Käse"];if(/joghurt|skyr/.test(t))return [...P,"Milchprodukte","Joghurt"];if(/quark/.test(t))return [...P,"Milchprodukte","Quark"];
  if(/tofu/.test(t))return ["pflanzliches Protein","Tofu & Tempeh","Tofu"];if(/tempeh/.test(t))return ["pflanzliches Protein","Tofu & Tempeh","Tempeh"];
  if(/linsen/.test(t))return ["pflanzliches Protein","Hülsenfrüchte","Linsen"];if(/kichererbs/.test(t))return ["pflanzliches Protein","Hülsenfrüchte","Kichererbsen"];if(/bohne/.test(t))return ["pflanzliches Protein","Hülsenfrüchte","Bohnen"];
  const k=katGuess(art,name).find(x=>TREE[x]);return k?[k]:[]}
function treeAt(p){let n=TREE;for(const x of p){if(!n||!n[x])return {};n=n[x]}return n||{}}
function pfadEditor(p){const kids=Object.keys(treeAt(p));
  return `${p.map((x,i)=>`<span class="chip pfc${i===p.length-1?" last":""}">${esc(x)}${i===p.length-1?`<button type="button" class="chip pfx" data-pf="-" aria-label="Letzte Stufe entfernen">×</button>`:""}</span>${i<p.length-1?'<span class="pfs">›</span>':""}`).join("")}
    ${p.length?'<span class="pfs">›</span>':""}${kids.map(k=>`<button type="button" class="chip pfk" data-pf="${esc(k)}">${esc(k)}</button>`).join("")}
    ${p.length<6?`<input class="pfin" placeholder="${p.length?"weitere Stufe":"Oberkategorie"}" aria-label="Stufe ergänzen" autocomplete="off">`:""}`}
function cowSvg(hi){const {w,h,px}=COW;const at=(x,y)=>x<0||y<0||x>=w||y>=h?".":px[y*w+x];let o="";
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const r=at(x,y);if(r===".")continue;
    const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>at(x+a,y+b)===".");
    const seam=!edge&&r!=="m"&&r!=="k"&&[[1,0],[0,1]].some(([a,b])=>{const n=at(x+a,y+b);return n!=="."&&n!==r&&n!=="m"});
    const c=edge||r==="f"?"#1b221d":r==="m"?"#e8b4a6":hi.includes(r)?(seam?"#a8291f":"#e0473a"):seam?"#cdbfa8":"#f4efe6";
    o+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${c}"/>`}
  o+=`<rect x="${COW.eye[0]}" y="${COW.eye[1]}" width="1" height="1" fill="#1b221d"/><rect x="${COW.nose[0]}" y="${COW.nose[1]}" width="1" height="1" fill="#1b221d"/>`;
  return `<svg class="cow" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" role="img" aria-label="Rind, markiert: ${hi.split("").map(c=>CUTN[c]).join(", ")}">${o}</svg>`}
// Artikelansicht: Einordnung, Herkunft am Tier, Preisverlauf aus euren Bons
function openArt(art,editing){
  const i=artinfo.map[art]||{};const p=i.pfad&&i.pfad.length?i.pfad:pathGuess(art,"");
  const now=new Date();const offs0=(typeof rows!=="undefined"?rows:[]).filter(r=>r.art===art&&r.refPrice!=null&&status(r,now)!=="exp"&&baseOk(r,now)).sort((a,b)=>a.refPrice-b.refPrice);
  // Eine Zeile je Laden: Angebot mit dem normalen Preis als Streichpreis, sonst der normale Preis
  const per={};for(const r of offs0){const k=r.retailer;const o=per[k]=per[k]||{retailer:k,unit:r.unit};
    if(r.kind==="angebot"){if(!o.off||r.refPrice<o.off.refPrice)o.off=r}else if(!o.reg||r.refPrice<o.reg.refPrice)o.reg=r}
  const offs=Object.values(per).map(o=>{const off=o.off,reg=o.reg;
    if(off&&(!reg||off.refPrice<reg.refPrice)){const st0=reg?reg.refPrice:off.oldPrice&&off.price>0?off.oldPrice*off.refPrice/off.price:null;return {retailer:o.retailer,unit:off.unit,p:off.refPrice,strike:st0&&st0>off.refPrice?st0:null,r:off}}
    return {retailer:o.retailer,unit:reg.unit,p:reg.refPrice,strike:null,r:reg}}).sort((a,b)=>a.p-b.p).slice(0,8);
  const buys=[];for(const b of bons.list||[])for(const z of b.zeilen)if(z.artikel===art&&z.typ==="ware")buys.push({...z,laden:b.laden,datum:b.datum});
  buys.sort((a,b)=>String(b.datum).localeCompare(String(a.datum)));
  const last=buys[0],v=(last&&last.verarbeitung)||i.ver||"";
  const dd=iso=>{const [Y,M,D]=String(iso).split("-");return D+"."+M+"."+Y};
  // Herkunft am Tier ausgeblendet: Fokus auf Funktion
  let cowCard="";
  if(false&&p.includes("Rind")){const cut=p[p.length-1],hi=BEEF[cut]||"";
    cowCard=`<div class="acard"><div class="lbl">Woher das Stück kommt</div>${cowSvg(hi)}
      ${hi?`<div class="aleg">${hi.split("").map(c=>`<span><i></i>${CUTN[c]}</span>`).join("")}</div><div class="atip">${esc(BEEFTIP[cut]||"")}</div>`
        :`<div class="atip">Welches Teilstück? Ergänze in der Einordnung nach "Rind" z. B. Suppenfleisch oder Gulasch, dann zeigt die App, wo es am Tier sitzt.</div>`}</div>`}
    else if(false&&window.HERKUNFT){const h=HERKUNFT(art,p);
    if(h&&!h.plant)cowCard=`<div class="acard"><div class="lbl">${h.plant?"So wächst es":"Woher es kommt"}</div>${h.svg}
      ${h.iss?`<div class="aleg"><span><i class="${h.plant?"ring":""}"></i>Das isst du: ${esc(h.iss)}</span></div>`:h.needCut?`<div class="atip">Welches Stück? Ergänze in der Einordnung z. B. Brust, Keule oder Bauch, dann zeigt die App, wo es sitzt.</div>`:""}
      ${h.fakt?`<div class="atip">${esc(h.fakt)}</div>`:""}</div>`}
const el=document.getElementById("adlg");
  el.innerHTML=`<div class="ahead"><img class="px" src="${icon(art,knownArts().has(art)?grpOf(art):null)}" alt=""><h3>${artNr(art)?`<span class="anr">Nr. ${artNr(art)}</span> `:""}${esc(art)} <button type="button" class="afav${isFav(art)?" on":""}" aria-pressed="${isFav(art)}" title="${isFav(art)?"Favorit entfernen":"Als Favorit markieren"}">${isFav(art)?"★":"☆"}</button>${v?` <span class="vb v-${v}">${v==="un"?"unverarbeitet":v}</span>`:""}${i.fuer&&i.fuer!=="beide"?` <span class="vb fu">${FUER[i.fuer]}</span>`:""}</h3>
      <button type="button" class="aclose" aria-label="Schließen">×</button></div>
    ${last?`<div class="meta">${esc([sname(last.laden),dd(last.datum),fmtMenge(last.menge,last.einheit),eur(last.preis)].filter(Boolean).join(" · "))}</div>`:""}
    ${p.length?`<div class="crumbs">${p.map((x,j)=>`<span class="chip${j===p.length-1?" last":""}">${esc(x)}</span>`).join('<span class="pfs">›</span>')}<button type="button" class="aedit">ändern</button></div>`:`<p class="hint">Noch keine Einordnung. <button type="button" class="aedit">Jetzt festlegen</button></p>`}
    <div class="aed" hidden></div>
    ${offs.length?`<div class="lbl">Aktuell günstigste Preise</div><table class="ahist apr"><tbody>${offs.map((o,j)=>`<tr${j===0?' class="best"':""}><td>${LOGOS[o.retailer]?`<img class="logo" src="${LOGOS[o.retailer]}" alt="${esc(sname(o.retailer))}" title="${esc(sname(o.retailer))}">`:esc(sname(o.retailer))}</td><td class="bp">${o.strike?`<s>${eur(o.strike)}</s> `:""}<b${o.strike?' class="ang"':""}>${eur(o.p)}</b>${o.unit!=="Stk"?`<small>je ${esc(UNIT[o.unit]||o.unit)}</small>`:""}${o.r?marksPill(o.r):""}</td></tr>`).join("")}</tbody></table>`:`<p class="hint">Gerade kein Preis in euren Läden.</p>`}
    ${/entenbrust|entenkeule/i.test(art)?`<p class="atip">Spartipp: Eine ganze Ente ist etwa 30 % günstiger pro Kilo Fleisch als Brust oder Keulen einzeln, Karkasse und Fett gibt es gratis. Zerlegen, Teile einfrieren, aus den Resten Knusprige Ente im Pita machen. Mehr im Reiter Sparen.</p>`:""}
    ${i.kat&&i.kat.length?`<div class="akat">${i.kat.map(k=>`<span class="chip">${esc(k)}</span>`).join("")}</div>`:""}
`;
  const ov=document.getElementById("aovl");ov.hidden=false;el.querySelector(".aclose").onclick=()=>{ov.hidden=true};
  el.querySelector(".afav").onclick=()=>{pick.fav=Array.isArray(pick.fav)?pick.fav:[];const i=pick.fav.indexOf(art);if(i>=0)pick.fav.splice(i,1);else pick.fav.push(art);savePick();openArt(art);render()};
  // Einordnung, Kategorien und für wen direkt hier ändern
  const box=el.querySelector(".aed");let pf=p.slice(),kats=new Set(i.kat&&i.kat.length?i.kat:katGuess(art,"")),fuer=i.fuer||"beide";
  const paint=()=>{const own=new Set(Object.values(artinfo.map).flatMap(x=>x.kat||[]));
    box.innerHTML=`<div class="bform bed"><div class="bext">
      <div class="brow"><span class="lbl">Einordnung</span><span class="pf">${pfadEditor(pf)}</span></div>
      <div class="brow"><span class="lbl">Für</span><span class="seg">${Object.keys(FUER).map(v=>`<button type="button" class="chip" data-fu="${v}" aria-pressed="${v===fuer}">${FUER[v]}</button>`).join("")}</span></div>
      <div class="brow"><span class="lbl">Kategorien</span><span class="kc">${[...new Set([...KATS,...own,...kats])].map(k=>`<button type="button" class="chip${kats.has(k)?" on":""}" data-k="${esc(k)}">${esc(k)}</button>`).join("")}</span></div>
      <div class="brow"><button type="button" class="asave">Speichern</button><small class="amsg"></small></div></div></div>`};
  const openEd=()=>{box.hidden=false;paint();el.querySelectorAll(".aedit").forEach(b=>b.hidden=true)};
  el.querySelectorAll(".aedit").forEach(b=>b.onclick=openEd);if(editing)openEd();
  box.addEventListener("click",async e=>{const c=e.target.closest("button");if(!c)return;
    if(c.dataset.pf!=null){if(c.dataset.pf==="-")pf.pop();else if(pf.length<6)pf.push(c.dataset.pf);paint();return}
    if(c.dataset.fu){fuer=c.dataset.fu;paint();return}
    if(c.dataset.k!=null){kats.has(c.dataset.k)?kats.delete(c.dataset.k):kats.add(c.dataset.k);paint();return}
    if(c.classList.contains("asave")){c.disabled=true;box.querySelector(".amsg").textContent="wird gespeichert …";
      const info={kat:[...kats].slice(0,8),fuer,ver:i.ver||"",pfad:pf.slice(0,6)};
      const ok=await window.MK_ART.set({artikel:art,kategorien:info.kat,fuer:info.fuer,verarbeitung:info.ver,pfad:info.pfad}).catch(()=>false);
      if(ok){artinfo.map[art]=info;openArt(art);if(typeof render==="function")render()}else{c.disabled=false;box.querySelector(".amsg").textContent="Speichern hat nicht geklappt."}}});
  box.addEventListener("keydown",e=>{const pi=e.target.closest(".pfin");if(!pi||e.key!=="Enter")return;e.preventDefault();const v=pi.value.trim().replace(/>/g,"").slice(0,30);
    if(v&&pf.length<6){pf.push(v);paint();const n=box.querySelector(".pfin");if(n)n.focus()}});
}
(function wireArt(){const ov=document.getElementById("aovl");if(!ov)return;ov.addEventListener("click",e=>{if(e.target===ov)ov.hidden=true});
  const go=e=>{if(!artinfo.on)return;const a=e.target.closest(".aopen");if(!a||!a.dataset.art||e.target.closest(".bset,.vleer,.addb"))return;e.preventDefault();e.stopPropagation();openArt(a.dataset.art)};
  document.addEventListener("click",go,true)})();
