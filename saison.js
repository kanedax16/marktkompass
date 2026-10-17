// Saisonkalender: was wächst gerade in Deutschland (Südbaden), was kommt aus dem Lager, was hat Importsaison
// Je Artikel 12 Zeichen für Januar bis Dezember:
// H = Saison aus der Region (Freiland)   T = Saisonbeginn/-ende oder unter Folie/Glas
// L = Lagerware aus Deutschland          I = Saison im europäischen Herkunftsland (Import)   - = keine Saison
const SAISON = {
  "Gemüse": [
    ["Suppengrün", "LLLLLHHHHHHL"], ["Kartoffeln", "LLLLLHHHHHLL"], ["Süßkartoffeln", "--------HHL-"],
    ["Zwiebeln", "LLLLLTHHHLLL"], ["Knoblauch", "LLLL--HHLLLL"], ["Möhren", "LLLLLHHHHHHL"],
    ["Lauch", "HHHT-HHHHHHH"], ["Sellerie", "LLLL-THHHHHL"], ["Kohlrabi", "---TTHHHHH--"],
    ["Brokkoli", "-----HHHHHT-"], ["Blumenkohl", "----THHHHHT-"], ["Rosenkohl", "HH------THHH"],
    ["Rotkohl", "LLLLL-HHHHHL"], ["Weißkohl", "LLLLLHHHHHHL"], ["Wirsing", "HHT--HHHHHHH"],
    ["Grünkohl", "HHT------THH"], ["Tomaten", "---TTTHHHT--"], ["Gurken", "---TTHHHHT--"],
    ["Paprika", "----TTHHHT--"], ["Zucchini", "-----HHHHT--"], ["Auberginen", "-----THHHT--"],
    ["Kürbis", "L------THHLL"], ["Champignons", "HHHHHHHHHHHH"], ["Pilze", "TTTTTTTHHHTT"],
    ["Feldsalat", "HHHT----THHH"], ["Rucola", "---THHHHHHT-"], ["Spinat", "TTHHHT--HHHT"],
    ["Salat", "---THHHHHHT-"], ["Rote Bete", "LLLL-THHHHHL"], ["Radieschen", "--THHHHHHHT-"],
    ["Fenchel", "-----HHHHHT-"], ["Ingwer", "--------TT--"], ["Bohnen", "-----THHHT--"],
    ["Spargel", "---THH------"], ["Kräuter", "TTTTHHHHHTTT"]
  ],
  "Obst": [
    ["Äpfel", "LLLLLLTHHHLL"], ["Birnen", "LLL----HHHLL"], ["Weintrauben", "-------THH--"],
    ["Pflaumen & Zwetschgen", "------HHHT--"], ["Erdbeeren", "---THHHT----"], ["Himbeeren", "-----HHHT---"],
    ["Heidelbeeren", "-----THHT---"], ["Melone", "-----IIII---"], ["Feigen", "-------III--"],
    ["Kiwi", "IIII-----III"], ["Orangen", "IIIII-----II"], ["Clementinen & Mandarinen", "II-------III"],
    ["Zitronen", "IIIII----III"], ["Grapefruit & Pomelo", "IIII------II"], ["Granatapfel", "I-------IIII"],
    ["Kaki", "---------III"], ["Avocado", "IIII------II"], ["Bananen", "------------"],
    ["Ananas", "------------"], ["Mango", "------------"], ["Limetten", "------------"]
  ]
};
const MON = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Poster wie ein Wandkalender: zwölf Monate, je Monat alles Obst und Gemüse, das es gerade gibt
function renderSaison() {
  const el = document.getElementById("saison");
  const cur = new Date().getMonth();
  const all = ["Gemüse", "Obst"].flatMap(g => SAISON[g].map(([n, s]) => ({ n, s, g })));
  const tile = (a, k) => `<div class="stile${k === "I" ? " sun" : ""}" title="${esc(a.n)}${k === "I" ? ": Saison im Süden" : ""}"><span>${esc(a.n.replace(/ & .*/, ""))}</span></div>`;
  // Ab dem aktuellen Monat, damit oben steht, was es jetzt gibt
  const months = MON.map((_, i) => (cur + i) % 12).map(m => { const name = MON[m];
    const items = all.filter(a => a.s[m] !== "-");
    const reg = items.filter(a => a.s[m] !== "I"), sued = items.filter(a => a.s[m] === "I");
    return `<section class="smonth${m === cur ? " now" : ""}" id="m${m}"><h3>${name}</h3><div class="stiles">${reg.map(a => tile(a, a.s[m])).join("")}${sued.map(a => tile(a, "I")).join("")}</div></section>`;
  }).join("");
  el.innerHTML = `<div class="sposter"><h2>Saisonkalender</h2><p class="slegend"><span class="sun"></span>Saison im Süden, zum Beispiel Spanien oder Italien. Alles andere wächst in Deutschland oder kommt aus deutschem Lager.</p><div class="smonths">${months}</div></div>`;
}
if (st.view === "saison") { try { applyView(); renderSaison() } catch (e) {} }
