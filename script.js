const cv = document.getElementById('mapa'); // Lienzo del mapa
const cx = cv.getContext('2d'); // Contexto de dibujo 2D
const $ = i => document.getElementById(i); // Atajo para buscar elementos por id
// País: [código, nombre, bandera iso2, capital(es), color bandera, hecho histórico, ¿verdadero?, presidente]
const P = [ // Lista de países jugables
['BOL','Bolivia','bo','Sucre/La Paz','#d52b1e','Bolivia declaró su independencia en 1825.',true,'Rodrigo Paz'], // Bolivia
['BRA','Brasil','br','Brasilia','#009c3b','Brasil fue colonia de Portugal.',true,'Lula da Silva'], // Brasil
['ARG','Argentina','ar','Buenos Aires','#74acdf','Argentina fue colonia de Francia.',false,'Javier Milei'], // Argentina
['MEX','México','mx','Ciudad de México','#006847','Los aztecas fundaron Tenochtitlan.',true,'Claudia Sheinbaum'], // México
['USA','Estados Unidos','us','Washington/Washington D.C.','#3c3b6e','EE.UU. declaró su independencia en 1776.',true,'Donald Trump'], // EE.UU.
['FRA','Francia','fr','París/Paris','#0055a4','La Revolución Francesa comenzó en 1789.',true,'Emmanuel Macron'], // Francia
['CHN','China','cn','Pekín/Beijing','#de2910','La Gran Muralla china se construyó en un solo año.',false,'Xi Jinping'], // China
['RUS','Rusia','ru','Moscú/Moscu','#1c3578','Rusia vendió Alaska a Estados Unidos.',true,'Vladimir Putin'], // Rusia
['EGY','Egipto','eg','El Cairo/Cairo','#ce1126','Las pirámides de Giza se construyeron en la Edad Media.',false,'Abdel Fattah al-Sisi'], // Egipto
['CHL','Chile','cl','Santiago','#d52b1e','Chile declaró su independencia de España en 1818.',true,'José Antonio Kast'], // Chile
['PRY','Paraguay','py','Asunción/Asuncion','#0038a8','Paraguay declaró su independencia en 1811.',true,'Santiago Peña'], // Paraguay
['URY','Uruguay','uy','Montevideo','#0038a8','Uruguay fue colonia de Alemania.',false,'Yamandú Orsi'], // Uruguay
['ESP','España','es','Madrid','#aa151b','Colón zarpó con apoyo de los Reyes Católicos en 1492.',true,'Pedro Sánchez'] // España
];
const sv = x => '<svg viewBox="0 0 32 32">' + x + '</svg>'; // Envuelve un dibujo en un SVG de 32x32
const ic = (s, z = 24) => `<span class="ic" style="width:${z}px;height:${z}px">${s}</span>`; // Pone un logo con el tamaño pedido
const mm = (k, n) => `+${n} ${ic(IC[k], 22)} `; // Texto de recompensa con su logo
const cesta = (f, x) => sv(`<path d="M5 14H27L24 27H8Z" fill="${f}" stroke="#5d3a12" stroke-width="2"/><path d="M11 14C11 4 21 4 21 14" fill="none" stroke="#5d3a12" stroke-width="2.5"/><path d="M9 19H23M10 23H22" stroke="#5d3a12" stroke-width="1.5"/>${x}`); // Canasta con frutas
const mano = '<path d="M4 28L11 21" stroke="#5d4037" stroke-width="5" stroke-linecap="round"/>'; // Mango de madera
const IC = { // Logos vectoriales de monedas y mejoras
 oro: sv('<circle cx="16" cy="16" r="14" fill="#f5c518" stroke="#a86f00" stroke-width="2"/><circle cx="16" cy="16" r="10" fill="#ffdf5e" stroke="#c99200" stroke-width="1.5"/><path d="M16 9l2 5 5 .5-4 3.5 1.300 5L16 20l-4.300 3 1.300-5-4-3.500 5-.5z" fill="#c99200"/><path d="M7 11A10 10 0 0 1 14 6" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>'), // Moneda de oro con estrella
 leg: sv('<path d="M5 22C3 12 12 4 26 5C27 18 18 28 5 22Z" fill="#6aa84f" stroke="#38761d" stroke-width="2"/><circle cx="12" cy="16" r="2.800" fill="#c9e7b8"/><circle cx="17" cy="12" r="2.800" fill="#c9e7b8"/><circle cx="21.500" cy="8.500" r="2" fill="#c9e7b8"/><path d="M5 22L2 27" stroke="#38761d" stroke-width="2" stroke-linecap="round"/>'), // Vaina de legumbre
 coca: sv('<circle cx="16" cy="16" r="15" fill="none" stroke="gold" stroke-width="1.500" opacity=".7"/><path d="M16 3C26 9 27 21 16 29C5 21 6 9 16 3Z" fill="#2e9e4f" stroke="#146c2e" stroke-width="2"/><path d="M16 6V28M16 13L21 10M16 18L22 15M16 13L11 10M16 18L10 15" stroke="#b9f6c6" stroke-width="1.500" fill="none"/>'), // Hoja de coca dorada
 arma: [ // Logos de armamento
  sv('<path d="M5 27L24 8" stroke="#8b5a2b" stroke-width="3.500" stroke-linecap="round"/><path d="M22 10L30 2L29 11Z" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.500" stroke-linejoin="round"/>'), // Lanza de madera
  sv('<path d="M27 4C15 6 9 12 9 17L15 23C20 23 27 17 27 4Z" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.500"/>' + mano), // Cuchillo
  sv('<path d="M28 3C28 15 20 23 12 22L10 20C10 12 18 4 28 3Z" fill="#b0bec5" stroke="#455a64" stroke-width="1.500"/>' + mano), // Machete
  sv('<path d="M28 3L30 5L14 21L11 18Z" fill="#e6ecef" stroke="#455a64" stroke-width="1.500"/><path d="M8 16L16 24" stroke="#d4af37" stroke-width="3.500" stroke-linecap="round"/><path d="M4 28L12 20" stroke="#6d4c41" stroke-width="3.500" stroke-linecap="round"/>'), // Espada
  sv('<path d="M2 13L9 12V17L4 19Z" fill="#8b5a2b"/><rect x="9" y="12" width="21" height="4" rx="1" fill="#37474f"/><rect x="19" y="10" width="9" height="2" fill="#8b5a2b"/><path d="M15 16H19L21 26L17 27Z" fill="#6d4c41"/><path d="M10 16H13L12 23H9Z" fill="#8b5a2b"/>') // AK-47
 ],
 comida: [ // Logos de canastas
  cesta('#c68642', '<circle cx="16" cy="11" r="3.500" fill="#e53935"/>'), // Canasta básica
  cesta('#d9a05b', '<circle cx="16" cy="11" r="3.500" fill="#e53935"/><circle cx="10.500" cy="12" r="3" fill="#fdd835"/><circle cx="21.500" cy="12" r="3" fill="#7cb342"/>'), // Canasta clase media
  cesta('#d4af37', '<circle cx="16" cy="11" r="3.500" fill="#e53935"/><circle cx="10.500" cy="12" r="3" fill="#fdd835"/><circle cx="21.500" cy="12" r="3" fill="#7cb342"/><circle cx="16" cy="22" r="2.500" fill="#fff6c0"/>') // Canasta clase alta
 ],
 botiq: [ // Logos de botiquines
  sv('<rect x="3" y="8" width="26" height="19" rx="4" fill="#fff" stroke="#c62828" stroke-width="2"/><path d="M12 8V5H20V8" stroke="#c62828" stroke-width="2" fill="none"/><path d="M16 12V23M10.500 17.500H21.500" stroke="#e53935" stroke-width="4"/>'), // Botiquín de hospital
  sv('<circle cx="16" cy="16" r="14.500" fill="#4a148c" stroke="gold" stroke-width="2"/><path d="M13 6H19V10H23V13H26V19H23V22H19V26H13V22H9V19H6V13H9V10H13Z" fill="gold"/><circle cx="16" cy="16" r="3" fill="#4a148c"/>') // Amarre del Yatiri (chakana)
 ]
};
const RG = { 'Africa': 'África', 'North America': 'Norteamérica', 'South America': 'Sudamérica', 'Asia': 'Asia', 'Europe': 'Europa', 'Oceania': 'Oceanía', 'Central America': 'Centroamérica' }; // Continentes en español
const CAP = Object.fromEntries('AFG:Kabul|ALB:Tirana|DZA:Argel|AND:Andorra la Vieja|AGO:Luanda|ATG:Saint John’s|ARM:Ereván|AUS:Canberra|AUT:Viena|AZE:Bakú|BHS:Nasáu|BHR:Manama|BGD:Daca|BRB:Bridgetown|BLR:Minsk|BEL:Bruselas|BLZ:Belmopán|BEN:Porto Novo|BTN:Timbu|BIH:Sarajevo|BWA:Gaborone|BRN:Bandar Seri Begawan|BGR:Sofía|BFA:Uagadugú|BDI:Gitega|KHM:Nom Pen|CMR:Yaundé|CAN:Ottawa|CPV:Praia|CAF:Bangui|TCD:Yamena|COL:Bogotá|COM:Moroni|COD:Kinsasa|COG:Brazzaville|CRI:San José|CIV:Yamusukro|HRV:Zagreb|CUB:La Habana|CYP:Nicosia|CZE:Praga|DNK:Copenhague|DJI:Yibuti|DMA:Roseau|DOM:Santo Domingo|ECU:Quito|SLV:San Salvador|GNQ:Malabo|ERI:Asmara|EST:Tallin|SWZ:Mbabane|ETH:Adís Abeba|FJI:Suva|FIN:Helsinki|GAB:Libreville|GMB:Banjul|GEO:Tiflis|DEU:Berlín|GHA:Acra|GRC:Atenas|GRD:Saint George’s|GTM:Ciudad de Guatemala|GIN:Conakri|GNB:Bisáu|GUY:Georgetown|HTI:Puerto Príncipe|HND:Tegucigalpa|HUN:Budapest|ISL:Reikiavik|IND:Nueva Delhi|IDN:Yakarta|IRN:Teherán|IRQ:Bagdad|IRL:Dublín|ISR:Jerusalén|ITA:Roma|JAM:Kingston|JPN:Tokio|JOR:Amán|KAZ:Astaná|KEN:Nairobi|KIR:Tarawa|PRK:Pionyang|KOR:Seúl|KWT:Kuwait|KGZ:Biskek|LAO:Vientián|LVA:Riga|LBN:Beirut|LSO:Maseru|LBR:Monrovia|LBY:Trípoli|LIE:Vaduz|LTU:Vilna|LUX:Luxemburgo|MDG:Antananarivo|MWI:Lilongüe|MYS:Kuala Lumpur|MDV:Malé|MLI:Bamako|MLT:La Valeta|MHL:Majuro|MRT:Nuakchot|MUS:Port Louis|FSM:Palikir|MDA:Chisinau|MCO:Mónaco|MNG:Ulán Bator|MNE:Podgorica|MAR:Rabat|MOZ:Maputo|MMR:Naipyidó|NAM:Windhoek|NRU:Yaren|NPL:Katmandú|NLD:Ámsterdam|NZL:Wellington|NIC:Managua|NER:Niamey|NGA:Abuya|MKD:Skopie|NOR:Oslo|OMN:Mascate|PAK:Islamabad|PLW:Ngerulmud|PAN:Panamá|PNG:Port Moresby|PER:Lima|PHL:Manila|POL:Varsovia|PRT:Lisboa|QAT:Doha|ROU:Bucarest|RWA:Kigali|KNA:Basseterre|LCA:Castries|VCT:Kingstown|WSM:Apia|SMR:San Marino|STP:Santo Tomé|SAU:Riad|SEN:Dakar|SRB:Belgrado|SYC:Victoria|SLE:Freetown|SGP:Singapur|SVK:Bratislava|SVN:Liubliana|SLB:Honiara|SOM:Mogadiscio|ZAF:Pretoria|SSD:Yuba|LKA:Sri Jayawardenapura Kotte|SDN:Jartum|SUR:Paramaribo|SWE:Estocolmo|CHE:Berna|SYR:Damasco|TWN:Taipéi|TJK:Dusambé|TZA:Dodoma|THA:Bangkok|TLS:Dili|TGO:Lomé|TON:Nukualofa|TTO:Puerto España|TUN:Túnez|TUR:Ankara|TKM:Asjabad|TUV:Funafuti|UGA:Kampala|UKR:Kiev/Kyiv|ARE:Abu Dabi|GBR:Londres|UZB:Taskent|VUT:Port Vila|VAT:Ciudad del Vaticano|VEN:Caracas|VNM:Hanoi|YEM:Saná|ZMB:Lusaka|ZWE:Harare|GRL:Nuuk|PSX:Ramala|GUF:Cayena|PRI:San Juan|FLK:Stanley|NCL:Numea|PYF:Papeete|KOS:Pristina|SAH:El Aaiún'.split('|').map(s => s.split(':'))); // Capital de cada país por código
const imgPJ = new Image(); imgPJ.onload = () => pintar(); // Imagen del personaje para el mapa
const UP = { // Mejoras: nombres y precios (g=oro, l=legumbres, c=coca)
 arma: { n: ['Lanza de madera','Cuchillo','Machete','Espada','AK-47'], c: [{g:40,l:200},{g:90,l:450},{g:180,l:900},{g:350,l:1750},{c:10}] }, // Armamento
 comida: { n: ['Canasta básica','Canasta clase media','Canasta clase alta'], c: [{g:25,l:125},{g:75,l:375},{c:2,g:200,l:1000}] }, // Comida
 botiq: { n: ['Botiquín de hospital','Amarre del Yatiri'], c: [{g:300,l:1500},{c:4,g:1500,l:7500}] } // Botiquines
};
Object.keys(UP).forEach(k => UP[k].c.forEach((c, i) => { if (k == 'arma' && i == 4) return; ['g', 'l'].forEach(m => { if (c[m]) c[m] = Math.round(c[m] * 1.5); }); if (c.c) c.c = Math.ceil(c.c * 1.5); })); // Precios +50% (el AK-47 queda en 10 hojas)
const H = [[],[0],[],[1,2],[2,3,4],[]]; // Preguntas con pista según nivel de arma
const SK = [0,0,1,1,2,5]; // Preguntas que se saltan según nivel de arma
const MON = { g: 'oro', l: 'leg', c: 'coca' }; // Traduce moneda a campo guardado
let vz = 1, vu = .5, vv = .5, finAnim = false, S = null, geo = [], jugando = false, Q = null, V = {}; // Estado, países del mapa, si juega, pregunta actual
// ---------- MAPA ----------
const px = (lo, la) => [((lo + 180) / 360 - vu) * vz * cv.width + cv.width / 2, ((83 - la) / 141 - vv) * vz * cv.height + cv.height / 2]; // Coordenadas geográficas a píxeles
const inv = (x, y) => [((x - cv.width / 2) / (vz * cv.width) + vu) * 360 - 180, 83 - ((y - cv.height / 2) / (vz * cv.height) + vv) * 141]; // Píxeles a coordenadas geográficas
fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson') // Descarga el mapamundi real
 .then(r => r.json()) // Convierte a objeto
 .then(j => { // Cuando llega
  geo = j.features.map(f => ({ id: f.properties.ADM0_A3, nom: f.properties.NAME_ES, iso: f.properties.ISO_A2_EH, cont: f.properties.CONTINENT, polys: f.geometry.type == 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates })); // Guarda polígonos
  const fr = geo.find(g => g.id == 'FRA'); // Francia
  if (fr) { const gu = fr.polys.filter(po => po[0][0][0] < -45 && po[0][0][1] > 0 && po[0][0][1] < 10); if (gu.length) { fr.polys = fr.polys.filter(po => !gu.includes(po)); geo.push({ id: 'GUF', nom: 'Guayana Francesa', iso: 'GF', cont: 'South America', polys: gu }); } } // La Guayana Francesa pasa a ser un país aparte
  return Promise.resolve().then(() => { // Crea los países jugables desde el propio mapa
   geo.forEach(g => { const cap = CAP[g.id]; if (!cap || !g.iso || g.iso == '-99' || P.some(p => p[0] == g.id)) return; P.push([g.id, g.nom, g.iso.toLowerCase(), cap, 'hsl(' + (g.id.charCodeAt(0) * 37 + g.id.charCodeAt(2) * 11) % 360 + ',60%,50%)', null, null, null, g.cont]); }); // Agrega cada país del mundo
   P.forEach(p => { const g = geo.find(x => x.id == p[0]); if (g && !p[8]) p[8] = g.cont; }); const CA = 'BLZ GTM HND SLV NIC CRI PAN CUB HTI DOM JAM BHS BRB TTO ATG DMA GRD KNA LCA VCT PRI'.split(' '); P.forEach(p => { if (CA.includes(p[0])) p[8] = 'Central America'; }); // Centroamérica y el Caribe cuentan como un continente // Los países con datos propios también reciben su continente
  const celdas = {}; // Puntos de las fronteras agrupados por posición
  geo.forEach(g => g.polys.forEach(po => po.forEach(r => r.forEach(c => { const k = Math.round(c[0] * 10) + ',' + Math.round(c[1] * 10); (celdas[k] = celdas[k] || new Set()).add(g.id); })))); // Registra qué países tocan cada punto
  Object.values(celdas).forEach(s => s.forEach(a => s.forEach(b => { if (a != b) (V[a] = V[a] || new Set()).add(b); }))); // Dos países en el mismo punto son vecinos
  $('carga').classList.add('oculto'); pintar(); }); // Oculta "cargando" y dibuja
 })
 .catch(() => $('carga').textContent = '⚠️ No se pudo cargar el mapa (revisa tu internet)'); // Error de red
function pintar() { // Dibuja el mapa completo
 const op = S && jugando ? opciones() : []; // Países que se pueden elegir (se resaltan)
 cx.clearRect(0, 0, cv.width, cv.height); // Limpia el lienzo
 geo.forEach(g => { // Recorre cada país
  const p = P.find(x => x[0] == g.id); // Busca si es jugable
  cx.fillStyle = finAnim ? 'hsl(' + ((Date.now() / 15 + g.id.charCodeAt(0) * 13 + g.id.charCodeAt(1) * 7) % 360) + ',75%,55%)' : S && p && S.ok[g.id] ? (typeof S.ok[g.id] == 'string' ? S.ok[g.id] : p[4]) : op.includes(g.id) ? '#d8ff3a' : '#3fae49'; // Bandera si explorado, verde claro si disponible, verde oscuro si no
  cx.beginPath(); // Nuevo trazo
  g.polys.forEach(po => vis(po) && po.forEach(r => r.forEach((c, i) => { const [x, y] = px(c[0], c[1]); i ? cx.lineTo(x, y) : cx.moveTo(x, y); }))); // Traza contornos
  cx.shadowColor = '#0009'; cx.shadowOffsetX = 2; cx.shadowOffsetY = 4; cx.fill('evenodd'); cx.shadowColor = 'transparent'; cx.strokeStyle = '#0d3b1f'; cx.lineWidth = 1.2; cx.lineJoin = 'round'; cx.stroke(); // Rellena y dibuja borde
 });
 if (S && S.pos) { const [x, y] = px(S.pos[0], S.pos[1]); if (imgPJ.naturalWidth) { cx.shadowColor = '#0008'; cx.shadowOffsetY = 4; cx.drawImage(imgPJ, x - 15, y - 42, 30, 42); cx.shadowColor = 'transparent'; } } // Marca al jugador
}
function opciones() { // Países que se pueden explorar ahora
 const libres = P.map(p => p[0]).filter(id => !S.ok[id]); // Los que aún no se exploraron
 if (!S.ult) return libres; // Primer país: cualquiera
 const v = libres.filter(id => V[S.ult] && V[S.ult].has(id)); // Vecinos del último explorado
 return v.length ? v : libres; // Sin vecinos libres, cualquiera (evita quedarse atascado)
}
function resize() { const h = $('hud').offsetHeight ? $('hud').offsetHeight + 10 : 0; cv.style.top = h + 'px'; cv.style.height = (innerHeight - h) + 'px'; cv.width = innerWidth; cv.height = innerHeight - h; pintar(); } // Ajusta el lienzo a la pantalla
addEventListener('resize', resize); resize(); // Reajusta al cambiar tamaño y al iniciar
function dentro(pt, r) { let d = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > pt[1]) != (r[j][1] > pt[1]) && pt[0] < (r[j][0] - r[i][0]) * (pt[1] - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) d = !d; return d; } // ¿Punto dentro del polígono?
function tocar(e) { // Al tocar o hacer clic en el mapa (sin arrastrar)
 if (!jugando || document.querySelector('.modal:not(.oculto)')) return; // Ignora si no juega o hay ventana
 const pt = inv(e.clientX * cv.width / innerWidth, (e.clientY - cv.getBoundingClientRect().top) * cv.height / cv.clientHeight); // Convierte clic a coordenadas
 const g = geo.find(g => g.polys.some(po => dentro(pt, po[0]))); // Busca el país tocado
 if (!g) return; // Si es océano no hace nada
 const p = P.find(x => x[0] == g.id); // Busca datos del país
 if (!p) return aviso('🚧 País aún no disponible'); // País sin preguntas
 if (S.ok[g.id]) return aviso('✅ Ya exploraste ' + p[1]); // Ya explorado
 if (!opciones().includes(g.id)) return aviso('🚫 Debe compartir frontera con ' + P.find(x => x[0] == S.ult)[1]); // Solo países vecinos
 S.pos = pt; pintar(); iniciarPais(p); // Mueve al personaje y empieza el desafío
}
// ---------- INTERFAZ ----------
function aviso(t) { const d = document.createElement('div'); d.className = 'popup'; d.innerHTML = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2500); } // Mensaje animado
function hud() { // Actualiza barras y monedas
 $('bSig').classList.toggle('oculto', !(S.ult && P.some(x => !S.ok[x[0]] && V[S.ult] && V[S.ult].has(x[0])))); // 🧭 Siguiente solo si estás en un país con vecinos libres
 ['sb', 'sc'].forEach(i => $(i).style.display = S.yatiri ? 'none' : ''); ['poncho', 'chulu'].forEach(i => $(i).style.display = S.yatiri ? '' : 'none'); // Con el Yatiri: ch’ulu y poncho en vez del sombrero
 const s2 = $('pj').firstElementChild.cloneNode(true); s2.setAttribute('width', 30); s2.setAttribute('height', 42); // Copia reducida del personaje
 const uri = 'data:image/svg+xml,' + encodeURIComponent(new XMLSerializer().serializeToString(s2)); // La convierte en imagen
 if (imgPJ.dataset.u != uri) { imgPJ.dataset.u = uri; imgPJ.src = uri; cv.style.cursor = `url("${uri}") 15 40, auto`; } // Cursor y marcador = personaje
 $('nombreJ').textContent = S.nombre; // Muestra el nombre
 $('nVida').textContent = Math.max(0, S.vida); $('nCom').textContent = Math.max(0, S.com); // Vida y comida en números
 $('alerta').classList.toggle('oculto', !(S.vida <= 25 || S.com <= 25)); // Muestra la advertencia si hay peligro
 $('alerta').textContent = S.com <= 0 && !S.yatiri ? '⚠️ ¡Sin comida! Tu vida está bajando' : S.vida <= 25 ? '⚠️ ¡Vida baja! Compra un botiquín' : '⚠️ ¡Comida baja! Compra una canasta'; // Texto según el peligro
 $('bVida').style.width = S.vida + '%'; $('bCom').style.width = S.com + '%'; // Ancho de barras
 $('mon').innerHTML = [['oro', 'Oro', S.oro], ['leg', 'Legumbres', S.leg], ['coca', 'Hoja de coca', S.coca]].map(m => `<span class="mn" title="${m[1]}">${ic(IC[m[0]], 22)} ${m[2]}</span>`).join(' '); // Monedas con logo; el nombre sale al pasar el cursor
 $('tun').setAttribute('fill', ['#8b5a2b','#a0522d','#6a1b9a','#d4af37'][S.comida]); // Túnica evoluciona
 $('arma').innerHTML = S.arma ? IC.arma[S.arma - 1] : ''; // El arma comprada aparece en el personaje
 $('pj').classList.toggle('aura', !!S.yatiri); $('mascs').innerHTML = S.pets.map(petSvg).join(''); const hh = $('hud').offsetHeight ? $('hud').offsetHeight + 10 : 0; if (cv.style.top != hh + 'px') resize(); // Brillo del Yatiri
}
function entrar() { ['inicio'].forEach(i => $(i).classList.add('oculto')); ['hud', 'pj', 'zoom'].forEach(i => $(i).classList.remove('oculto')); jugando = true; finAnim = !!S.fin; hud(); resize(); if (!S.ult) aviso('🌍 Elige tu primer país en el mapa'); if (!localStorage.getItem('yatiriAyuda2')) abrir('ayuda'); } // Pasa del inicio al juego
$('bNueva').onclick = () => { // Nueva partida
 const n = $('nom').value.trim(); if (!n) return aviso('✍️ Escribe un nombre'); // Exige nombre
 S = { nombre: n, oro: 0, leg: 0, coca: 0, vida: 100, com: 100, arma: 0, comida: 0, botiq: 0, ok: {}, primeros: 0, yatiri: 0, pos: null, ult: null, cn: [0, 0, 0], bn: 0, cont: {}, pets: [] }; // Estado inicial
 entrar(); // Comienza
};
$('bCont').onclick = () => { const g = localStorage.getItem('yatiri'); if (!g) return aviso('No hay partida guardada'); S = JSON.parse(g); S.cn = S.cn || [0, 0, 0]; S.bn = S.bn || 0; S.cont = S.cont || {}; S.pets = S.pets || []; entrar(); }; // Carga lo guardado
function guardar() { localStorage.setItem('yatiri', JSON.stringify(S)); nota('💾 Guardado'); } // Guarda el progreso
const abrir = i => $(i).classList.remove('oculto'), cerrar = i => $(i).classList.add('oculto'); // Abrir y cerrar ventanas
$('bPausa').onclick = () => abrir('pausa'); $('pCont').onclick = () => cerrar('pausa'); // Pausa y continuar
$('pGuardar').onclick = guardar; // Botón guardar
$('pSalir').onclick = () => { guardar(); cerrar('pausa'); jugando = false; ['hud', 'pj', 'alerta', 'zoom'].forEach(cerrar); abrir('inicio'); finAnim = false; S = null; resize(); }; // Salir al inicio
setInterval(() => { // Cada segundo (también con la pausa o ventanas abiertas)
 if (!jugando || !S) return; // Solo jugando
 if (S.com <= 0 && !S.yatiri) { if (!S.ham) { S.vida = Math.ceil(S.vida / 2); S.ham = 1; } else S.vida -= 1; } else if (S.com > 0) S.ham = 0; // Sin comida: vida a la mitad y luego -1 por segundo
 if (S.vida <= 0) fin(); // Fin del juego
 hud(); // Refresca barras
}, 1000);
// ---------- PREGUNTAS ----------
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); // Quita tildes y mayúsculas
function dibujar(p) { // Dibuja la silueta del país
 const g = geo.find(x => x.id == p[0]), c = $('sil'), k = c.getContext('2d'); // País y lienzo
 c.width = 300; c.height = 170; // Tamaño de la silueta
 let a = [999, 999, -999, -999]; // Caja que contiene al país
 g.polys.forEach(po => po[0].forEach(q => { a = [Math.min(a[0], q[0]), Math.min(a[1], q[1]), Math.max(a[2], q[0]), Math.max(a[3], q[1])]; })); // Calcula caja
 const s = Math.min(280 / (a[2] - a[0]), 150 / (a[3] - a[1])); // Escala para que quepa
 k.fillStyle = '#111'; k.beginPath(); // Color negro de silueta
 g.polys.forEach(po => po[0].forEach((q, i) => { const x = 150 + (q[0] - (a[0] + a[2]) / 2) * s, y = 85 - (q[1] - (a[1] + a[3]) / 2) * s; i ? k.lineTo(x, y) : k.moveTo(x, y); })); // Traza
 k.fill(); // Rellena
}
function ops(items, ok, html) { // Crea botones de opciones
 $('qOps').innerHTML = ''; // Limpia opciones
 items.sort(() => Math.random() - .5).forEach(it => { const b = document.createElement('button'); b.innerHTML = html ? html(it) : it; b.onclick = () => resp(it === ok); $('qOps').appendChild(b); }); // Un botón por opción
}
const rnd = a => a[Math.floor(Math.random() * a.length)]; // Elemento al azar
const mez = a => a.slice().sort(() => Math.random() - .5); // Mezcla una lista
const POOL = [ // Preguntas de historia y ciencias sociales (cada una es un tema distinto)
 ['¿En qué año comenzó la Primera Guerra Mundial?', '1914', '1939', '1905'], // Guerra
 ['¿En qué año terminó la Segunda Guerra Mundial?', '1945', '1918', '1950'], // Guerra
 ['¿Quién lideró la Revolución rusa de 1917?', 'Vladimir Lenin', 'Napoleón Bonaparte', 'Winston Churchill'], // Revolución
 ['¿Qué revolución comenzó en 1789?', 'La Revolución Francesa', 'La Revolución Industrial', 'La Revolución rusa'], // Revolución
 ['¿Qué muro cayó en 1989 simbolizando el fin de la Guerra Fría?', 'El Muro de Berlín', 'La Gran Muralla', 'El Muro de Adriano'], // Guerra Fría
 ['¿Quién llegó a América en 1492?', 'Cristóbal Colón', 'Vasco da Gama', 'Fernando de Magallanes'], // Descubrimiento
 ['¿Qué libertador lideró la independencia de Venezuela, Colombia y Bolivia?', 'Simón Bolívar', 'Napoleón Bonaparte', 'Giuseppe Garibaldi'], // Independencias
 ['¿Qué organización se fundó en 1945 para mantener la paz mundial?', 'La ONU', 'La Liga de las Naciones', 'La Unión Europea'], // Organismos
 ['¿Qué guerra enfrentó al Norte y al Sur de Estados Unidos (1861-1865)?', 'Guerra de Secesión', 'Guerra de los Siete Años', 'Guerra de Vietnam'], // Conflicto
 ['¿Quién fue el primer presidente de Estados Unidos?', 'George Washington', 'Abraham Lincoln', 'Thomas Jefferson'], // Presidentes
 ['¿Qué imperio fue conquistado por Francisco Pizarro?', 'El Imperio inca', 'El Imperio azteca', 'El Imperio maya'], // Conquista
 ['¿Qué pensador ilustrado escribió "El contrato social"?', 'Jean-Jacques Rousseau', 'René Descartes', 'Adam Smith'], // Personajes
 ['vf', 'La Unión Soviética se disolvió en 1991.', true], // Verdadero
 ['vf', 'La Revolución Industrial comenzó en Francia.', false] // Falso (fue en Gran Bretaña)
];
const CQ = { // Preguntas propias de cada país con datos
 BOL: [['¿Qué guerra enfrentó a Bolivia y Paraguay entre 1932 y 1935?', 'Guerra del Chaco', 'Guerra del Pacífico', 'Guerra de las Malvinas'], ['¿Qué libertador dio nombre a Bolivia?', 'Simón Bolívar', 'José de San Martín', 'Hugo Banzer']], // Bolivia
 BRA: [['¿Quién proclamó la independencia de Brasil en 1822?', 'Pedro I', 'Getúlio Vargas', 'Tiradentes'], ['¿En qué año abolió Brasil la esclavitud?', '1888', '1822', '1950']], // Brasil
 ARG: [['¿Qué guerra enfrentó a Argentina y Reino Unido en 1982?', 'Guerra de las Malvinas', 'Guerra del Chaco', 'Guerra del Pacífico'], ['¿Quién lideró el Ejército de los Andes que cruzó la cordillera en 1817?', 'José de San Martín', 'Simón Bolívar', 'Manuel Belgrano']], // Argentina
 MEX: [['¿Quién inició el Grito de Dolores en 1810?', 'Miguel Hidalgo', 'Emiliano Zapata', 'Benito Juárez'], ['¿Qué imperio dominaba el centro de México antes de Hernán Cortés?', 'El Imperio azteca', 'El Imperio inca', 'El Imperio romano']], // México
 USA: [['¿Qué presidente firmó la Proclamación de Emancipación?', 'Abraham Lincoln', 'George Washington', 'Theodore Roosevelt'], ['¿Qué ataque llevó a EE. UU. a entrar en la Segunda Guerra Mundial?', 'Pearl Harbor', 'Dunkerque', 'Normandía']], // EE. UU.
 FRA: [['¿Quién se coronó emperador de Francia en 1804?', 'Napoleón Bonaparte', 'Luis XVI', 'Charles de Gaulle'], ['¿Qué prisión fue tomada el 14 de julio de 1789?', 'La Bastilla', 'El Louvre', 'Alcatraz']], // Francia
 CHN: [['¿Qué líder proclamó la República Popular China en 1949?', 'Mao Zedong', 'Deng Xiaoping', 'Sun Yat-sen'], ['¿Qué dinastía construyó gran parte de la Gran Muralla que se ve hoy?', 'Dinastía Ming', 'Dinastía Han', 'Dinastía Tang']], // China
 RUS: [['¿Qué zar fundó San Petersburgo?', 'Pedro el Grande', 'Iván el Terrible', 'Nicolás II'], ['¿Qué líder soviético gobernó durante la Segunda Guerra Mundial?', 'Iósif Stalin', 'Nikita Jrushchov', 'Mijaíl Gorbachov']], // Rusia
 EGY: [['¿Qué faraón tiene una famosa tumba hallada casi intacta en 1922?', 'Tutankamón', 'Ramsés II', 'Keops'], ['¿Qué canal egipcio une el Mediterráneo con el mar Rojo?', 'Canal de Suez', 'Canal de Panamá', 'Canal de Corinto']], // Egipto
 CHL: [['¿Qué prócer es llamado "Padre de la Patria" de Chile?', 'Bernardo O’Higgins', 'Salvador Allende', 'Augusto Pinochet'], ['¿Qué guerra enfrentó a Chile con Perú y Bolivia (1879-1884)?', 'Guerra del Pacífico', 'Guerra del Chaco', 'Guerra de las Malvinas']], // Chile
 PRY: [['¿Qué guerra devastó Paraguay entre 1864 y 1870?', 'Guerra de la Triple Alianza', 'Guerra del Pacífico', 'Guerra de Secesión'], ['¿Contra qué país ganó Paraguay la Guerra del Chaco?', 'Bolivia', 'Chile', 'Argentina']], // Paraguay
 URY: [['¿Qué prócer es el héroe de la independencia uruguaya?', 'José Gervasio Artigas', 'Simón Bolívar', 'Juan Manuel de Rosas'], ['¿Qué país organizó y ganó el primer Mundial de fútbol en 1930?', 'Uruguay', 'Brasil', 'Italia']], // Uruguay
 ESP: [['¿Qué guerra enfrentó a republicanos y nacionalistas entre 1936 y 1939?', 'Guerra Civil Española', 'Guerra de Sucesión', 'Guerra de los Cien Años'], ['¿Qué reyes apoyaron el viaje de Colón en 1492?', 'Isabel y Fernando', 'Carlos V y Felipe II', 'Alfonso XIII y Victoria Eugenia']] // España
};
const TANDA1 = `GBR|¿Qué reina gobernó el Reino Unido durante 70 años, hasta 2022?|Isabel II|Victoria|Ana
DEU|¿Qué ciudad estuvo dividida por un muro entre 1961 y 1989?|Berlín|Múnich|Fráncfort
ITA|¿Qué imperio antiguo tuvo su capital en Roma?|El Imperio romano|El Imperio otomano|El Imperio bizantino
PRT|¿Qué navegante portugués llegó a la India por mar en 1498?|Vasco da Gama|Fernando de Magallanes|Bartolomeu Dias
GRC|¿Qué ciudad griega es considerada la cuna de la democracia?|Atenas|Esparta|Corinto
TUR|¿Qué ciudad fue la capital del Imperio otomano?|Estambul|Ankara|Esmirna
POL|¿Qué país invadió Alemania en 1939, iniciando la Segunda Guerra Mundial?|Polonia|Francia|Bélgica
UKR|¿En qué año se independizó Ucrania de la Unión Soviética?|1991|1945|2004
NLD|¿Qué compañía holandesa dominó el comercio con Asia en el siglo XVII?|Compañía de las Indias Orientales|Compañía del Mississippi|Compañía del Mar del Sur
AUT|¿Qué dinastía gobernó desde Viena el Imperio austrohúngaro?|Los Habsburgo|Los Romanov|Los Borbones
SRB|¿En qué ciudad fue asesinado el archiduque Francisco Fernando en 1914?|Sarajevo|Belgrado|Viena
IRL|¿De qué país se independizó Irlanda en 1922?|Reino Unido|Francia|España
FIN|¿Qué país atacó a Finlandia en la Guerra de Invierno de 1939?|Unión Soviética|Alemania|Suecia
CHE|¿Qué política mantiene Suiza ante los conflictos internacionales?|Neutralidad|Expansionismo|Imperialismo
IND|¿Quién lideró la independencia de la India con la no violencia?|Mahatma Gandhi|Winston Churchill|Mao Zedong
JPN|¿Qué ciudades japonesas sufrieron bombas atómicas en 1945?|Hiroshima y Nagasaki|Tokio y Osaka|Kioto y Nagoya
KOR|¿Qué guerra dividió la península de Corea entre 1950 y 1953?|Guerra de Corea|Guerra de Vietnam|Guerra del Golfo
VNM|¿Qué guerra enfrentó a Vietnam del Norte contra Vietnam del Sur y EE. UU.?|Guerra de Vietnam|Guerra de Corea|Guerra del Golfo
IRQ|¿Qué líder fue derrocado en Irak tras la invasión de 2003?|Saddam Hussein|Muamar el Gadafi|Hosni Mubarak
ISR|¿En qué año se fundó el Estado de Israel?|1948|1967|1917
IRN|¿Qué antiguo imperio fundó Ciro el Grande y gobernó la actual Irán?|Imperio persa|Imperio otomano|Imperio mongol
SAU|¿Qué ciudad sagrada del islam está en Arabia Saudita?|La Meca|Jerusalén|El Cairo
PAK|¿Qué imperio colonial dominaba Pakistán antes de 1947?|Imperio británico|Imperio francés|Imperio ruso
BGD|¿De qué país se independizó Bangladés en 1971?|Pakistán|India|Birmania
IDN|¿Qué país colonizó Indonesia hasta 1945?|Países Bajos|Portugal|Reino Unido
PHL|¿Qué país colonizó Filipinas durante más de 300 años?|España|Portugal|Países Bajos
THA|¿Cómo se llamaba Tailandia antes de 1939?|Siam|Birmania|Camboya
KHM|¿Qué régimen gobernó Camboya entre 1975 y 1979?|Jemeres Rojos|Viet Cong|Talibanes
AFG|¿Qué grupo gobernó Afganistán en los años 90 y volvió al poder en 2021?|Los talibanes|Los jemeres rojos|Hezbolá
AUS|¿Qué pueblo originario habita Australia desde hace más de 50.000 años?|Los aborígenes|Los maoríes|Los inuit
NZL|¿Qué pueblo originario firmó el Tratado de Waitangi en Nueva Zelanda?|Los maoríes|Los aborígenes|Los inuit
CAN|¿Qué dos idiomas son oficiales en Canadá?|Inglés y francés|Inglés y español|Francés y alemán
ZAF|¿Quién fue el primer presidente de Sudáfrica tras el fin del apartheid?|Nelson Mandela|Desmond Tutu|Jacob Zuma
NGA|¿Qué país colonizó Nigeria hasta 1960?|Reino Unido|Francia|Portugal
KEN|¿Qué movimiento keniano luchó contra el dominio británico en los años 50?|Mau Mau|Apartheid|Boxers
ETH|¿Qué país africano derrotó a Italia en la batalla de Adua en 1896?|Etiopía|Egipto|Sudán
DZA|¿Qué país colonizó Argelia hasta su independencia en 1962?|Francia|España|Italia
MAR|¿Qué dos países ejercieron el protectorado sobre Marruecos hasta 1956?|Francia y España|Reino Unido y Alemania|Italia y Portugal
COD|¿Qué rey belga controló el Congo como propiedad personal?|Leopoldo II|Alberto I|Felipe VI
AGO|¿Qué país colonizó Angola hasta 1975?|Portugal|España|Bélgica
MOZ|¿Qué país colonizó Mozambique hasta 1975?|Portugal|Francia|Reino Unido
COL|¿Qué batalla de 1819 selló la independencia de Colombia?|Batalla de Boyacá|Batalla de Ayacucho|Batalla de Carabobo
VEN|¿Qué batalla de 1821 aseguró la independencia de Venezuela?|Batalla de Carabobo|Batalla de Boyacá|Batalla de Ayacucho
PER|¿Qué batalla de 1824 selló la independencia del Perú?|Batalla de Ayacucho|Batalla de Boyacá|Batalla de Maipú
ECU|¿Qué batalla de 1822 aseguró la independencia de Ecuador?|Batalla de Pichincha|Batalla de Carabobo|Batalla de Ayacucho
CUB|¿Qué líder encabezó la Revolución cubana de 1959?|Fidel Castro|Fulgencio Batista|Simón Bolívar
HTI|¿Qué esclavos se rebelaron y lograron la independencia de Haití en 1804?|Los esclavos africanos liderados por Toussaint Louverture|Los colonos españoles|Los soldados británicos
DOM|¿Qué navegante llegó a La Española en 1492?|Cristóbal Colón|Américo Vespucio|Hernán Cortés
PAN|¿Qué canal une los océanos Atlántico y Pacífico en Panamá?|Canal de Panamá|Canal de Suez|Canal de Kiel
GTM|¿Qué civilización antigua construyó la ciudad de Tikal?|Los mayas|Los incas|Los aztecas
CRI|¿Qué país centroamericano abolió su ejército en 1948?|Costa Rica|Panamá|Honduras
NOR|¿En qué año se independizó Noruega de Suecia?|1905|1814|1945`; // Tanda 1: una pregunta propia para cada uno de estos países
TANDA1.split('\n').forEach(l => { const [id, q, ok, a, b] = l.split('|'); (CQ[id] = CQ[id] || []).push([q, ok, a, b]); }); // Las agrega al banco de cada país
const TANDA2 = `ALB|¿Qué dictador comunista gobernó Albania de 1944 a 1985?|Enver Hoxha|Josip Tito|Nicolae Ceaușescu
AND|¿Quiénes son los dos copríncipes de Andorra?|El presidente de Francia y el obispo de Urgel|El rey de España y el papa|El rey de Francia y el emperador alemán
ARM|¿Qué país fue el primero en adoptar el cristianismo como religión de Estado, en el año 301?|Armenia|Georgia|Egipto
AZE|¿Con qué país disputó Azerbaiyán la región de Nagorno Karabaj?|Armenia|Georgia|Irán
BHS|¿En qué archipiélago desembarcó Colón por primera vez en 1492?|Bahamas|Cuba|Panamá
BLR|¿Qué político gobierna Bielorrusia desde 1994?|Alexander Lukashenko|Vladímir Putin|Viktor Yanukóvich
BEL|¿Qué país neutral fue invadido por Alemania en 1914?|Bélgica|Suiza|Suecia
BLZ|¿Qué civilización antigua construyó ciudades como Caracol en Belice?|Los mayas|Los aztecas|Los incas
BEN|¿Qué reino africano, famoso por sus guerreras amazonas, existió en el actual Benín?|Dahomey|Ashanti|Zulú
BTN|¿Qué religión predomina en Bután?|Budismo|Islam|Hinduismo
BIH|¿Qué guerra devastó Bosnia y Herzegovina entre 1992 y 1995?|Guerra de Bosnia|Guerra de Corea|Guerra del Golfo
BWA|¿Qué país colonial protegió a Botsuana (Bechuanalandia) hasta 1966?|Reino Unido|Francia|Italia
BGR|¿Qué imperio dominó Bulgaria hasta 1878?|Imperio otomano|Imperio ruso|Imperio romano
BFA|¿Qué presidente revolucionario, llamado el “Che africano”, gobernó Burkina Faso en los años 80?|Thomas Sankara|Patrice Lumumba|Kwame Nkrumah
CMR|¿Qué dos potencias se repartieron Camerún tras la Primera Guerra Mundial?|Francia y Reino Unido|España y Portugal|Italia y Bélgica
CPV|¿Qué país colonizó Cabo Verde hasta 1975?|Portugal|España|Francia
CIV|¿Qué país colonizó Costa de Marfil hasta 1960?|Francia|Reino Unido|Portugal
HRV|¿De qué federación se independizó Croacia en 1991?|Yugoslavia|Checoslovaquia|Unión Soviética
CYP|¿Qué dos comunidades se enfrentaron en Chipre en 1974?|Grecochipriotas y turcochipriotas|Serbios y croatas|Armenios y azeríes
CZE|¿Cómo se llamó la revolución pacífica de 1989 en Checoslovaquia?|Revolución de Terciopelo|Revolución de los Claveles|Primavera Árabe
DNK|¿Qué pueblo navegante de Escandinavia atacó Europa entre los siglos VIII y XI?|Los vikingos|Los mongoles|Los hunos
SLV|¿Qué guerra de 1969 enfrentó a El Salvador y Honduras?|Guerra del Fútbol|Guerra del Chaco|Guerra del Pacífico
ERI|¿De qué país se independizó Eritrea en 1993?|Etiopía|Sudán|Yemen
EST|¿Qué potencia anexó Estonia en 1940?|Unión Soviética|Reino Unido|Suecia
GHA|¿Qué país fue el primero del África subsahariana en independizarse del Reino Unido, en 1957?|Ghana|Nigeria|Kenia
GEO|¿Con qué país tuvo Georgia una guerra en 2008?|Rusia|Turquía|Irán
GNB|¿Qué país colonizó Guinea-Bisáu hasta 1974?|Portugal|Francia|Reino Unido
GUY|¿Qué país colonizó Guyana (Guayana Británica) hasta 1966?|Reino Unido|Francia|España
GUF|¿A qué país pertenece políticamente la Guayana Francesa?|Francia|Brasil|Surinam
HND|¿Qué guerra de 1969 enfrentó a Honduras y El Salvador?|Guerra del Fútbol|Guerra del Chaco|Guerra del Pacífico
HUN|¿Qué levantamiento fue aplastado por la URSS en Hungría en 1956?|Revolución húngara|Primavera de Praga|Solidaridad
ISL|¿Cómo se llama el parlamento de Islandia, uno de los más antiguos del mundo?|Althing|Bundestag|Duma
JAM|¿Qué género musical nació en Jamaica y popularizó Bob Marley?|Reggae|Salsa|Samba
JOR|¿Qué dinastía gobierna Jordania?|Los hachemitas|Los saudíes|Los otomanos
KAZ|¿De qué país se independizó Kazajistán en 1991?|Unión Soviética|China|Imperio otomano
PRK|¿Quién fundó Corea del Norte en 1948?|Kim Il-sung|Mao Zedong|Syngman Rhee
KWT|¿Qué país invadió Kuwait en 1990?|Irak|Irán|Arabia Saudita
LAO|¿Qué país colonizó Laos hasta 1953?|Francia|Reino Unido|Japón
LVA|¿Cómo se llama el grupo de países formado por Letonia, Estonia y Lituania?|Países bálticos|Países nórdicos|Balcanes
LBN|¿Qué conflicto asoló el Líbano entre 1975 y 1990?|Guerra civil libanesa|Guerra de Corea|Guerra de Vietnam
LBR|¿Qué país africano fue fundado por esclavos liberados llegados de EE. UU.?|Liberia|Ghana|Nigeria
LBY|¿Qué dictador gobernó Libia entre 1969 y 2011?|Muamar el Gadafi|Saddam Hussein|Hosni Mubarak
LTU|¿Qué país báltico fue el primero en declarar su independencia de la URSS, en 1990?|Lituania|Estonia|Letonia
LUX|¿Qué tratado de 1957 creó la Comunidad Económica Europea con Luxemburgo entre sus miembros?|Tratado de Roma|Tratado de Versalles|Tratado de Tordesillas
MDG|¿Qué país colonizó Madagascar hasta 1960?|Francia|Reino Unido|Portugal
MWI|¿Qué país colonizó Malaui (Nyasalandia) hasta 1964?|Reino Unido|Portugal|Alemania
MYS|¿Qué país colonizó Malasia hasta 1957?|Reino Unido|Países Bajos|Portugal
MLI|¿Qué emperador de Malí hizo una famosa peregrinación a La Meca en 1324?|Mansa Musa|Ramsés II|Gengis Kan
MLT|¿Qué orden de caballeros gobernó Malta desde 1530?|Orden de San Juan|Orden Teutónica|Los Templarios
MDA|¿De qué unión se independizó Moldavia en 1991?|Unión Soviética|Yugoslavia|Checoslovaquia
MCO|¿Qué familia gobierna Mónaco desde 1297?|Los Grimaldi|Los Borbones|Los Médici
MNG|¿Quién fundó el Imperio mongol en 1206?|Gengis Kan|Tamerlán|Atila
MNE|¿De qué unión estatal se separó Montenegro en 2006?|Serbia y Montenegro|Unión Soviética|Checoslovaquia
MMR|¿Qué nombre tenía Myanmar antes de 1989?|Birmania|Siam|Camboya
NAM|¿Qué país colonizó Namibia hasta 1915?|Alemania|Reino Unido|Portugal
NPL|¿Qué montaña, la más alta del mundo, se encuentra entre Nepal y China?|Everest|K2|Kilimanjaro
NIC|¿Qué revolución de 1979 derrocó a Somoza en Nicaragua?|Revolución sandinista|Revolución cubana|Revolución mexicana
MKD|¿De qué país se independizó Macedonia del Norte en 1991?|Yugoslavia|Bulgaria|Grecia
QAT|¿Qué gran evento deportivo albergó Catar en 2022?|Copa del Mundo de fútbol|Juegos Olímpicos|Copa América
ROU|¿Qué dictador comunista fue derrocado en Rumania en 1989?|Nicolae Ceaușescu|Enver Hoxha|Josip Tito
RWA|¿Qué genocidio ocurrió en Ruanda en 1994?|El de los tutsis|El de los armenios|El de los camboyanos
SEN|¿Qué poeta fue el primer presidente de Senegal?|Léopold Senghor|Nelson Mandela|Kwame Nkrumah
SGP|¿Quién es considerado el fundador del Singapur moderno, independiente en 1965?|Lee Kuan Yew|Sukarno|Mahathir Mohamad
SVK|¿Con qué país formó Eslovaquia una federación hasta 1992?|República Checa|Hungría|Polonia
SVN|¿De qué país se independizó Eslovenia en 1991?|Yugoslavia|Austria|Italia
SSD|¿De qué país se independizó Sudán del Sur en 2011?|Sudán|Etiopía|Kenia
LKA|¿Qué país colonizó Sri Lanka (Ceilán) hasta 1948?|Reino Unido|Francia|Portugal
SDN|¿Qué región de Sudán sufrió un conflicto armado desde 2003?|Darfur|Katanga|Biafra
SUR|¿Qué país colonizó Surinam hasta 1975?|Países Bajos|Reino Unido|Francia
SYR|¿Qué familia gobernó Siria de 1971 a 2024?|Los Asad|Los Saud|Los Gadafi
TWN|¿Qué gobierno se refugió en Taiwán en 1949?|La República de China|La República Popular China|El Imperio japonés
TZA|¿Qué dos territorios se unieron en 1964 para formar Tanzania?|Tanganica y Zanzíbar|Kenia y Uganda|Ruanda y Burundi
TLS|¿Qué país ocupó Timor Oriental entre 1975 y 1999?|Indonesia|Australia|Portugal
TGO|¿Qué país europeo colonizó Togo hasta 1914?|Alemania|Italia|España
TUN|¿Qué movimiento de 2010-2011 comenzó en Túnez?|Primavera Árabe|Revolución de los Claveles|Perestroika
UGA|¿Qué dictador gobernó Uganda entre 1971 y 1979?|Idi Amin|Mobutu Sese Seko|Robert Mugabe
ARE|¿Qué ciudad de Emiratos Árabes Unidos es famosa por el Burj Khalifa?|Dubái|Riad|Doha
UZB|¿Qué antigua ruta comercial pasaba por Samarcanda, en Uzbekistán?|Ruta de la Seda|Ruta del Incienso|Camino Real
VAT|¿Quién encabeza la Iglesia católica y vive en el Vaticano?|El papa|El rey|El presidente
ZMB|¿Qué famosas cataratas comparte Zambia con Zimbabue?|Cataratas Victoria|Cataratas del Niágara|Cataratas del Iguazú
ZWE|¿Qué nombre tenía Zimbabue bajo dominio británico?|Rodesia|Biafra|Tanganica
GRL|¿A qué país pertenece Groenlandia?|Dinamarca|Noruega|Canadá
PSX|¿Qué organización representa oficialmente a los palestinos desde 1964?|OLP|OTAN|OPEP
KOS|¿De qué país declaró su independencia Kosovo en 2008?|Serbia|Albania|Macedonia del Norte
SAH|¿Qué país administró el Sáhara Occidental hasta 1975?|España|Francia|Portugal
PRI|¿Con qué país tiene Puerto Rico una asociación política?|Estados Unidos|España|México
FLK|¿Qué guerra de 1982 se libró por las islas Malvinas?|Guerra de las Malvinas|Guerra del Golfo|Guerra del Chaco
NCL|¿Qué país administra Nueva Caledonia?|Francia|Australia|Nueva Zelanda
PYF|¿Qué país administra la Polinesia Francesa?|Francia|Estados Unidos|Chile`; // Tanda 2: una pregunta propia para estos países
TANDA2.split('\n').forEach(l => { const [id, q, ok, a, b] = l.split('|'); (CQ[id] = CQ[id] || []).push([q, ok, a, b]); }); // Las agrega al banco de cada país
const TANDA3 = `ATG|¿Qué país colonizó Antigua y Barbuda hasta 1981?|Reino Unido|Francia|España
BHR|¿Qué familia gobierna Baréin desde el siglo XVIII?|Los Al Jalifa|Los hachemitas|Los Habsburgo
BRB|¿Qué país colonizó Barbados hasta 1966?|Reino Unido|España|Países Bajos
BRN|¿Qué título tiene el gobernante de Brunéi?|Sultán|Emperador|Presidente
BDI|¿Qué país colonizó Burundi tras la Primera Guerra Mundial?|Bélgica|Francia|Italia
CAF|¿Qué país colonizó la República Centroafricana hasta 1960?|Francia|Bélgica|Portugal
TCD|¿Qué país colonizó Chad hasta 1960?|Francia|Reino Unido|Italia
COM|¿Qué país colonizó las Comoras hasta 1975?|Francia|Portugal|Reino Unido
COG|¿Qué país colonizó el Congo (Brazzaville) hasta 1960?|Francia|Bélgica|Portugal
DJI|¿Qué país colonizó Yibuti hasta 1977?|Francia|Italia|Reino Unido
DMA|¿Qué país colonizó Dominica hasta 1978?|Reino Unido|Francia|Portugal
GNQ|¿Qué país colonizó Guinea Ecuatorial hasta 1968?|España|Portugal|Francia
SWZ|¿Qué país protegió a Esuatini (Suazilandia) hasta 1968?|Reino Unido|Portugal|Alemania
FJI|¿Qué país colonizó Fiyi hasta 1970?|Reino Unido|Francia|Países Bajos
GAB|¿Qué país colonizó Gabón hasta 1960?|Francia|Portugal|Bélgica
GMB|¿Qué país colonizó Gambia hasta 1965?|Reino Unido|Francia|Portugal
GRD|¿Qué país invadió Granada en 1983?|Estados Unidos|Cuba|Reino Unido
GIN|¿Qué país colonizó Guinea hasta 1958?|Francia|Portugal|Reino Unido
KIR|¿Qué país colonizó Kiribati hasta 1979?|Reino Unido|Francia|Alemania
KGZ|¿De qué país se independizó Kirguistán en 1991?|Unión Soviética|China|Imperio otomano
LSO|¿Qué país protegió a Lesoto (Basutolandia) hasta 1966?|Reino Unido|Portugal|Alemania
LIE|¿Con qué país mantiene Liechtenstein una unión aduanera y usa su moneda?|Suiza|Alemania|Italia
MDV|¿Qué religión predomina en las Maldivas?|Islam|Budismo|Hinduismo
MHL|¿Qué potencia hizo pruebas nucleares en las islas Marshall tras la Segunda Guerra Mundial?|Estados Unidos|Francia|Unión Soviética
MRT|¿Qué país colonizó Mauritania hasta 1960?|Francia|España|Portugal
MUS|¿Qué país colonizó Mauricio hasta 1968?|Reino Unido|Portugal|España
FSM|¿Qué país administró Micronesia tras la Segunda Guerra Mundial?|Estados Unidos|Japón|Francia
NRU|¿Qué potencia ocupó Nauru durante la Segunda Guerra Mundial?|Japón|Alemania|Italia
NER|¿Qué país colonizó Níger hasta 1960?|Francia|Reino Unido|Portugal
OMN|¿Qué título tiene el gobernante de Omán?|Sultán|Rey|Presidente
PLW|¿Qué país administró Palaos hasta 1994?|Estados Unidos|Japón|Alemania
PNG|¿Qué país administró Papúa Nueva Guinea hasta 1975?|Australia|Reino Unido|Países Bajos
KNA|¿Qué país colonizó San Cristóbal y Nieves hasta 1983?|Reino Unido|Francia|España
LCA|¿Qué dos países se disputaron Santa Lucía durante los siglos XVII y XVIII?|Francia y Reino Unido|España y Portugal|Países Bajos y Alemania
VCT|¿Qué país colonizó San Vicente y las Granadinas hasta 1979?|Reino Unido|Francia|España
WSM|¿Qué país administró Samoa hasta 1962?|Nueva Zelanda|Estados Unidos|Francia
SMR|¿Qué se dice que es San Marino, fundada según la tradición en el año 301?|La república más antigua del mundo|El imperio más antiguo|La monarquía más antigua
STP|¿Qué país colonizó Santo Tomé y Príncipe hasta 1975?|Portugal|España|Francia
SYC|¿Qué país colonizó Seychelles hasta 1976?|Reino Unido|Portugal|España
SLE|¿Qué país colonizó Sierra Leona hasta 1961?|Reino Unido|Francia|Portugal
SLB|¿Qué batalla de la Segunda Guerra Mundial se libró en las islas Salomón?|Guadalcanal|Normandía|Stalingrado
SOM|¿Qué país colonizó el sur de Somalia hasta 1960?|Italia|Francia|Alemania
SWE|¿Qué rey sueco murió en la batalla de Lützen en 1632?|Gustavo II Adolfo|Carlos XII|Olaf I
TJK|¿De qué país se independizó Tayikistán en 1991?|Unión Soviética|China|Irán
TON|¿Qué tipo de gobierno tiene Tonga?|Monarquía|República presidencial|Teocracia
TTO|¿Qué país colonizó Trinidad y Tobago hasta 1962?|Reino Unido|España|Países Bajos
TKM|¿De qué país se independizó Turkmenistán en 1991?|Unión Soviética|China|Irán
TUV|¿Qué país colonizó Tuvalu (islas Ellice) hasta 1978?|Reino Unido|Francia|Alemania
VUT|¿Qué dos países gobernaron juntos Vanuatu hasta 1980?|Reino Unido y Francia|España y Portugal|Países Bajos y Alemania
YEM|¿Qué país colonizó Adén, en el sur de Yemen, hasta 1967?|Reino Unido|Francia|Italia`; // Tanda 3: los 50 países restantes
TANDA3.split('\n').forEach(l => { const [id, q, ok, a, b] = l.split('|'); (CQ[id] = CQ[id] || []).push([q, ok, a, b]); }); // Las agrega al banco de cada país
function banco(p) { // Preguntas posibles de un país (k = tema, para no repetir temas)
 const cap = p[3].split('/')[0], cont = RG[p[8]], cs = Object.values(RG), ot = P.filter(x => x != p), ca = x => x[3].split('/')[0]; // Datos básicos
 const mc = (k, t, ok, fal) => ({ k, t, ok, o: mez([ok, ...mez([...new Set(fal)].filter(x => x != ok)).slice(0, 2)]) }); // Opción múltiple
 const vf = (k, t, v) => ({ k, t: 'Verdadero o falso: ' + t, ok: v ? 'Verdadero' : 'Falso', o: ['Verdadero', 'Falso'] }); // Verdadero/falso
 const B = []; // Lista de preguntas
 B.push(mc('cap', `La capital de ${p[1]} es:`, cap, ot.map(ca))); // Capital (múltiple)
 if (cont) { // Preguntas de continente
  B.push(mc('cont', `¿En qué continente está ${p[1]}?`, cont, cs)); // Continente (múltiple)
  const f2 = Math.random() < .5; B.push(vf('cont', `${p[1]} está en ${f2 ? cont : rnd(cs.filter(c => c != cont))}.`, f2)); // Continente (V/F)
  const mis = ot.filter(x => x[8] == p[8]); if (mis.length) B.push(mc('cont', `¿Cuál de estos países está en el mismo continente que ${p[1]}?`, rnd(mis)[1], ot.filter(x => x[8] != p[8]).map(x => x[1]))); // Mismo continente
 }
 const g = geo.find(x => x.id == p[0]); let a = 99, b = -99; g.polys.forEach(po => po[0].forEach(q => { a = Math.min(a, q[1]); b = Math.max(b, q[1]); })); const lat = (a + b) / 2; // Latitud central
 if (Math.abs(lat) >= 5) { const h = lat > 0 ? 'norte' : 'sur', f3 = Math.random() < .5; B.push(vf('hem', `${p[1]} está en el hemisferio ${f3 ? h : (h == 'norte' ? 'sur' : 'norte')}.`, f3)); } // Hemisferio
 (CQ[p[0]] || []).forEach((x, i) => B.push(mc('c' + i, x[0], x[1], [x[2], x[3]]))); // Preguntas propias del país
 if (p[5]) B.push(vf('his', p[5], p[6])); // Hecho histórico propio
 if (p[7]) B.push(mc('pre', `¿Quién es el presidente de ${p[1]}?`, p[7], ot.filter(x => x[7]).map(x => x[7]))); // Presidente
 return B; // Devuelve el banco
}
function iniciarPais(p, pen) { // Prepara las 5 preguntas del país
 const t = new Set(), qs = [null, null]; // Temas usados y lista (silueta y bandera son fijas)
 for (const b of mez(banco(p))) { if (t.has(b.k)) continue; t.add(b.k); qs.push(b); if (qs.length == 5) break; } // 3 preguntas de temas distintos
 Q = { p, q: SK[S.arma], fallos: pen ? 1 : 0, ac: SK[S.arma], mal: false, qs }; abrir('quiz'); // Estado del país
 if (Q.q > 4) terminar(); else pregunta(); // Con AK-47 se salta todo
}
function pregunta() { // Muestra la pregunta actual
 if (Q.q > 4) return terminar(); // Si ya acabó, termina
 const p = Q.p, i = Q.q, q = Q.qs[i], otros = P.filter(x => x != p); // Datos
 $('qN').textContent = `Pregunta ${i + 1}/5`; $('qMsg').textContent = ''; $('qIn').value = ''; // Textos
 $('sil').classList.toggle('oculto', i != 0); $('qIn').classList.toggle('oculto', i != 0); $('qBtn').classList.toggle('oculto', i != 0); // Solo la 1 es escrita
 $('qOps').innerHTML = ''; // Limpia opciones
 $('qT').textContent = i == 0 ? '¿Qué país es esta silueta?' : i == 1 ? (SK[S.arma] > 0 ? `¿Cuál es la bandera de ${p[1]}?` : '¿Cuál es su bandera?') : q.t; // Enunciado
 $('qHint').textContent = H[S.arma].includes(i) ? i == 1 ? '💡 Pista: se eliminó una bandera' : `💡 Pista: empieza con "${(i < 2 ? p[1] : q.ok)[0]}"` : ''; // Pista
 if (i == 0) dibujar(p); // Silueta
 else if (i == 1) ops([p[2], ...mez(otros).slice(0, H[S.arma].includes(1) ? 1 : 2).map(x => x[2])], p[2], f => `<img src="https://flagcdn.com/w160/${f}.png">`); // Banderas (sin cambios)
 else ops(q.o, q.ok); // Opción múltiple o V/F
}
function resp(ok) { // Evalúa una respuesta
 if (ok) { if (!Q.mal) Q.ac++; Q.mal = false; S.com = Math.max(0, S.com - 3); Q.q++; hud(); pregunta(); } // Acierto: -3 comida y avanza
 else { Q.mal = true; Q.fallos++; S.vida = Math.max(0, S.vida - 3); S.com = Math.max(0, S.com - 5); $('qMsg').textContent = '❌ Incorrecto (-3 vida, -5 comida). ¡Inténtalo otra vez!'; hud(); if (S.vida <= 0) fin(); } // Fallo: -3 vida, -5 comida
}
function fin() { alert('💀 Game over. El juego se reinicia.'); localStorage.removeItem('yatiri'); location.reload(); } // Fin del juego
$('qBtn').onclick = () => { const v = $('qIn').value; resp(Q.q == 0 ? norm(v) == norm(Q.p[1]) : Q.p[3].split('/').some(c => norm(c) == norm(v))); }; // Respuesta escrita
$('qIn').onkeydown = e => { if (e.key == 'Enter') $('qBtn').click(); }; // Enter también responde
$('qCerrar').onclick = () => cerrar('quiz'); // Abandonar país
function terminar() { // País completado
 const p = Q.p, primero = Q.fallos == 0 && S.arma < 5; // ¿Sin ningún fallo?
 S.ok[p[0]] = 1; S.ult = p[0]; if (String(p[4]).startsWith('hsl')) colorBandera(p); // Marca explorado
 let o = Q.ac * 3, l = Q.ac * 15; // 3 oro y 18 legumbres por acierto
 if (Q.fallos == 0) { o += 5; l += 25; } // AK-47 o bonificación por todo correcto
 let t = mm('oro', o) + mm('leg', l); // Texto de recompensa
 if (primero) { S.primeros++; S.racha = (S.racha || 0) + 1; if (S.racha % 10 == 0) { S.coca++; t += mm('coca', 1); } } else S.racha = 0; // Coca cada 10 países perfectos
 S.oro += o; S.leg += l; // Suma las monedas
 cerrar('quiz'); aviso(`🎉 ${p[1]} explorado ${t}`); hud(); pintar(); guardar(); revisarContinente(p); if (!S.fin && P.every(x => S.ok[x[0]])) final(); // Cierra, guarda y revisa el final del juego
}
// ---------- TIENDA ----------
$('bTienda').onclick = () => { tienda(); abrir('tienda'); }; $('tCerrar').onclick = () => cerrar('tienda'); // Abrir y cerrar tienda
const TT = { arma: '⚔️ Mejora de armamento', comida: '🍖 Alimentación', botiq: '❤️ Salud' }; // Subtítulos
const DS = { // Descripciones de cada mejora
 arma: ['Lanza de madera: muestra una pista en la 1ª pregunta.', 'Cuchillo: salta la 1ª pregunta.', 'Machete: salta la 1ª y da pistas en la 2ª y 3ª.', 'Espada: salta las 2 primeras y da pistas en las demás.', 'AK-47: salta todas las preguntas y las cuenta como acertadas.'],
 comida: ['Canasta básica: +50% de comida y +25% de vida.', 'Canasta clase media: +75% de comida y +50% de vida.', 'Canasta clase alta: +100% de comida y +75% de vida.'],
 botiq: ['Botiquín de hospital: lleva vida y comida al 100%. Siempre disponible.', 'Amarre del Yatiri: vida y comida al 100%, no pierdes vida por hambre y recibes ch’ulu y poncho andino.']
};
function bloqueo(k, i) { // Texto de condición ('' si se puede comprar)
 if (k == 'arma') return i < S.arma ? '✅ Comprado' : i > S.arma ? 'Compra primero el nivel anterior' : ''; // Armas en orden
 if (k == 'comida') return i > 0 && S.cn[i - 1] < 5 ? `Compra la canasta anterior ${5 - S.cn[i - 1]} vez/veces más` : ''; // 5 compras de la anterior
 if (i == 1) return S.yatiri ? '✅ Comprado' : S.bn < 5 ? `Compra ${5 - S.bn} botiquín(es) de hospital más` : ''; // Yatiri
 return ''; // Hospital siempre disponible
}
function tienda() { // Dibuja la tienda por secciones
 $('items').innerHTML = ''; // Limpia
 Object.keys(UP).forEach(k => { // Una sección por tipo de mejora
  const h = document.createElement('h3'); h.textContent = TT[k] + ':'; $('items').appendChild(h); // Subtítulo
  const cu = document.createElement('div'); cu.className = 'cuadro'; // Cuadro de opciones
  UP[k].n.forEach((nom, i) => { // Cada opción
   const d = document.createElement('div'), bl = bloqueo(k, i); d.className = 'item'; // Fila
   d.innerHTML = ic(IC[k][i], 36) + `<b>${nom}<small>${DS[k][i]}${bl ? (bl[0] == '✅' ? '<br>' : '<br>🔒 ') + bl : ''}</small></b>`; // Logo, descripción y condición
   if (!bl) Object.keys(UP[k].c[i]).forEach(m => { const b = document.createElement('button'); b.innerHTML = ic(IC[MON[m]], 18) + ' ' + UP[k].c[i][m]; b.title = { g: 'Oro', l: 'Legumbres', c: 'Hoja de coca' }[m]; b.onclick = () => pedir(k, i, m); d.appendChild(b); }); // Botones de precio
   cu.appendChild(d); // Agrega fila
  });
  $('items').appendChild(cu); // Agrega cuadro
 });
}
function pedir(k, i, m) { // Explica la mejora antes de comprar
 $('cTxt').innerHTML = ic(IC[k][i], 48) + `<br><b>${UP[k].n[i]}</b><br>${DS[k][i]}<br>Precio: ${ic(IC[MON[m]], 20)} ${UP[k].c[i][m]}`; // Texto de confirmación
 $('cSi').onclick = () => { cerrar('conf'); comprar(k, i, m); }; // Confirma
 abrir('conf'); // Muestra la ventana
}
function comprar(k, i, m) { // Compra una mejora
 const u = UP[k], precio = u.c[i][m]; // Precio
 if (bloqueo(k, i)) return; // Condición no cumplida
 if (S[MON[m]] < precio) return aviso('❌ No te alcanza'); // Sin fondos
 S[MON[m]] -= precio; // Paga
 if (k == 'arma') S.arma = i + 1; // Sube el arma
 if (k == 'comida') { S.cn[i]++; S.comida = Math.max(S.comida, i + 1); const [c, v] = [[50, 25], [75, 50], [100, 75]][i]; S.com = Math.min(100, S.com + c); S.vida = Math.min(100, S.vida + v); } // Canasta
 if (k == 'botiq') { S.com = 100; S.vida = 100; if (i == 1) S.yatiri = 1; else S.bn++; } // Botiquín
 aviso(ic(IC[k][i], 48) + (i == u.n.length - 1 ? ' +1000 de AURA' : i == 0 ? ' +1000 de Paula' : ' +1000 de Laura')); // Animación
 hud(); tienda(); guardar(); // Evoluciona al personaje
}

function nota(t) { const d = document.createElement('div'); d.className = 'nota'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1500); } // Aviso pequeño en la esquina
function hecho(p) { // Afirmación verdadero/falso del país
 if (Q.h) return Q.h; // Si ya se calculó, la reutiliza
 if (p[5]) return Q.h = [p[5], p[6]]; // Hecho histórico propio del país
 const real = p[3].split('/')[0], otra = P[Math.floor(Math.random() * P.length)][3].split('/')[0], v = Math.random() < .5 || otra == real; // Capital real u otra
 return Q.h = [`La capital de ${p[1]} es ${v ? real : otra}.`, v]; // Texto y si es verdadero
}
function colorBandera(p) { // Calcula el color dominante de la bandera
 const im = new Image(); im.crossOrigin = 'anonymous'; // Imagen de la bandera
 im.onload = () => { // Al cargar
  const c = document.createElement('canvas'); c.width = 8; c.height = 5; const k = c.getContext('2d'); k.drawImage(im, 0, 0, 8, 5); // La reduce
  const d = k.getImageData(0, 0, 8, 5).data, n = {}; // Píxeles y conteo
  for (let i = 0; i < d.length; i += 4) { if (d[i] + d[i + 1] + d[i + 2] > 690) continue; const q = [d[i], d[i + 1], d[i + 2]].map(v => Math.round(v / 85) * 85).join(','); n[q] = (n[q] || 0) + 1; } // Cuenta colores (sin blanco)
  const m = Object.keys(n).sort((a, b) => n[b] - n[a])[0]; // Color más común
  if (m) { p[4] = 'rgb(' + m + ')'; S.ok[p[0]] = p[4]; pintar(); guardar(); } // Pinta y guarda
 };
 im.src = 'https://flagcdn.com/w80/' + p[2] + '.png'; // Carga la bandera
}

$('aOk').onclick = () => { localStorage.setItem('yatiriAyuda2', 1); cerrar('ayuda'); }; // Cierra las instrucciones y no vuelven a salir
$('pConsejos').onclick = () => { cerrar('pausa'); abrir('consejos'); }; // Abre los consejos desde la pausa
$('cOk').onclick = () => { cerrar('consejos'); abrir('pausa'); }; // Vuelve al menú de pausa
$('mon').onclick = e => { const s = e.target.closest('.mn'); if (s) nota(s.title); }; // En móvil, tocar una moneda muestra su nombre

// ---------- EVENTOS SORPRESA ----------
const EV = { 'South America': '🏹 ¡Una tribu hostil te embosca en la selva!', 'Africa': '🪘 ¡Una tribu hostil te rodea en la sabana!', 'Asia': '🗡️ ¡Bandidos asaltan tu caravana!', 'North America': '🤠 ¡Bandoleros te asaltan en el camino!', 'Europe': '⚔️ ¡Saqueadores atacan tu campamento!', 'Central America': '🐍 ¡Una tribu hostil te embosca en la jungla!' }; // Ataque según la región
let evT = 240 + Math.random() * 120; // Segundos hasta el próximo evento
function evento() { // Lanza un ataque sorpresa con una pregunta
 const g = S.pos && geo.find(x => x.polys.some(po => dentro(S.pos, po[0]))), p = g && P.find(x => x[0] == g.id), reg = p && EV[p[8]]; // País y región actuales
 const enQuiz = !$('quiz').classList.contains('oculto'); // ¿Ocurre mientras exploras un país?
 $('eT').textContent = Math.random() < .5 || !reg ? '🏴‍☠️ ¡Piratas invadieron tu barco!' : reg; // Mensaje del ataque
 const x = rnd(POOL), q = x[0] == 'vf' ? { t: 'Verdadero o falso: ' + x[1], ok: x[2] ? 'Verdadero' : 'Falso', o: ['Verdadero', 'Falso'] } : { t: x[0], ok: x[1], o: mez([x[1], x[2], x[3]]) }; // Pregunta general
 $('eQ').textContent = q.t; $('eOps').innerHTML = ''; $('eMsg').textContent = ''; $('eCont').classList.add('oculto'); // Prepara la ventana
 q.o.forEach(o => { const b = document.createElement('button'); b.textContent = o; b.onclick = () => { // Una opción
  const bien = o == q.ok; // ¿Acertó?
  if (!bien) { S.oro = Math.max(0, S.oro - 10); S.leg = Math.max(0, S.leg - 40); } // Castigo: -10 oro y -40 legumbres
  $('eMsg').textContent = bien ? '✅ ¡Repeliste el ataque!' : '❌ Pierdes 10 de oro y 40 legumbres' + (enQuiz ? '. Tu exploración se reinicia y ya no tendrás bonificación.' : '.'); // Resultado
  [...$('eOps').children].forEach(c => c.disabled = true); $('eCont').classList.remove('oculto'); // Bloquea opciones
  $('eCont').onclick = () => { cerrar('evento'); hud(); guardar(); if (!bien && enQuiz) iniciarPais(Q.p, true); }; // Reinicia el país sin bonificación si falló
 }; $('eOps').appendChild(b); }); // Agrega la opción
 abrir('evento'); // Muestra la ventana
}
setInterval(() => { // Cada segundo
 if (!jugando) return; // Solo jugando
 if ([...document.querySelectorAll('.modal:not(.oculto)')].some(m => m.id != 'quiz')) return; // No interrumpe tienda, pausa ni otras ventanas
 if (--evT > 0) return; // Aún no toca
 evT = 240 + Math.random() * 120; evento(); // Programa el siguiente y lanza este
}, 1000);
$('pAyuda').onclick = () => { cerrar('pausa'); abrir('ayuda'); }; // Ver instrucciones desde la pausa

// ---------- CONTINENTES Y MASCOTAS ----------
const PET = { // Una mascota en peligro de extinción por continente
 'South America': { e: '🦅', n: 'Cóndor andino', d: 'Es una de las aves voladoras más grandes del mundo, con hasta 3 metros de envergadura. Vive en los Andes y es símbolo de varios países. Está amenazado por la caza, el veneno y la pérdida de su hábitat.' },
 'North America': { e: '🐺', n: 'Lobo gris mexicano', d: 'Es la subespecie de lobo más pequeña y rara de Norteamérica. Llegó a desaparecer de la naturaleza, pero los programas de cría lo reintrodujeron en México y el suroeste de EE. UU. Sigue en peligro.' },
 'Europe': { e: '🦭', n: 'Foca monje del Mediterráneo', d: 'Es una de las focas más raras del planeta: quedan unos pocos cientos de ejemplares. La pesca, la contaminación y la pérdida de playas tranquilas la ponen en peligro.' },
 'Africa': { e: '🦏', n: 'Rinoceronte negro', d: 'La caza furtiva por su cuerno redujo su población más de un 90% en el siglo XX. Hoy se recupera lentamente gracias a la protección, pero sigue en peligro crítico.' },
 'Asia': { e: '🐅', n: 'Tigre de Bengala', d: 'Es el felino emblemático del sur de Asia, sobre todo de la India. La caza y la destrucción de los bosques lo pusieron en peligro; las reservas protegidas ayudan a recuperarlo.' },
 'Central America': { e: '🐢', n: 'Tortuga carey', d: 'Es una tortuga marina de los arrecifes del Caribe, reconocible por su pico de loro y su caparazón de placas. Fue cazada por su caparazón y pierde sus playas de anidación; está en peligro crítico.' },
 'Oceania': { e: '🐨', n: 'Koala', d: 'Es un marsupial australiano que se alimenta casi solo de hojas de eucalipto. Los incendios, la deforestación y las enfermedades lo amenazan; en varias regiones de Australia está en peligro.' }
};
const PSVG = { // Mascotas dibujadas en 2D (mismo estilo plano que el explorador)
 'South America': `<ellipse cx="30" cy="28" rx="14" ry="12" fill="#222"/><path d="M18 24Q4 30 9 45L25 38Z" fill="#111"/><ellipse cx="42" cy="21" rx="9" ry="4" fill="#fff"/><rect x="40" y="10" width="6" height="12" fill="#b5513c"/><circle cx="44" cy="9" r="5" fill="#c9604a"/><path d="M48 7L57 11L49 13Z" fill="#e8d9a0"/><circle cx="45" cy="8" r="1.200" fill="#000"/><path d="M26 38V47M34 38V47" stroke="#555" stroke-width="3"/>`, // Cóndor andino
 'North America': `<path d="M14 24Q3 24 3 36Q10 31 16 31Z" fill="#8a8f98"/><ellipse cx="30" cy="26" rx="16" ry="9" fill="#8a8f98"/><rect x="17" y="30" width="4" height="15" fill="#6d727b"/><rect x="23" y="30" width="4" height="15" fill="#6d727b"/><rect x="35" y="30" width="4" height="15" fill="#6d727b"/><rect x="41" y="30" width="4" height="15" fill="#6d727b"/><ellipse cx="50" cy="19" rx="8" ry="6" fill="#9aa0a9"/><path d="M55 18L63 23L55 25Z" fill="#6d727b"/><path d="M45 15L47 7L51 13Z" fill="#6d727b"/><circle cx="52" cy="17" r="1.200" fill="#000"/><circle cx="62" cy="23" r="1.200" fill="#000"/>`, // Lobo gris mexicano
 'Europe': `<path d="M8 28L0 21L2 35Z" fill="#574f47"/><ellipse cx="30" cy="30" rx="25" ry="11" fill="#6b6259"/><ellipse cx="32" cy="35" rx="17" ry="5" fill="#d9cdb8"/><circle cx="52" cy="23" r="8" fill="#6b6259"/><ellipse cx="58" cy="26" rx="4" ry="3" fill="#d9cdb8"/><circle cx="60" cy="25" r="1.500" fill="#000"/><circle cx="53" cy="21" r="1.300" fill="#000"/><path d="M40 37L48 46L41 45Z" fill="#574f47"/>`, // Foca monje
 'Africa': `<rect x="10" y="14" width="38" height="20" rx="9" fill="#7a7d84"/><rect x="14" y="32" width="7" height="14" fill="#6a6d74"/><rect x="24" y="32" width="7" height="14" fill="#6a6d74"/><rect x="36" y="32" width="7" height="14" fill="#6a6d74"/><path d="M44 16L60 22L58 35L44 32Z" fill="#8a8d94"/><path d="M56 22L58 10L62 23Z" fill="#e6e0d0"/><path d="M50 18L51 12L55 19Z" fill="#e6e0d0"/><path d="M43 15L45 8L49 15Z" fill="#6a6d74"/><circle cx="52" cy="25" r="1.300" fill="#000"/>`, // Rinoceronte negro
 'Asia': `<path d="M12 24Q0 20 3 9" stroke="#e8872a" stroke-width="4" fill="none"/><ellipse cx="28" cy="26" rx="18" ry="10" fill="#e8872a"/><path d="M18 17L20 27M26 16L27 28M34 16L34 28M41 19L40 29" stroke="#222" stroke-width="2.500"/><rect x="14" y="32" width="5" height="14" fill="#e8872a"/><rect x="22" y="32" width="5" height="14" fill="#e8872a"/><rect x="36" y="32" width="5" height="14" fill="#e8872a"/><rect x="43" y="32" width="5" height="14" fill="#e8872a"/><circle cx="46" cy="13" r="3" fill="#e8872a"/><circle cx="56" cy="13" r="3" fill="#e8872a"/><circle cx="51" cy="20" r="8" fill="#e8872a"/><ellipse cx="53" cy="23" rx="4" ry="3" fill="#fff"/><path d="M47 15L49 18M54 15L52 18" stroke="#222" stroke-width="2"/><circle cx="49" cy="20" r="1.200" fill="#000"/><circle cx="54" cy="21" r="1.500" fill="#222"/>`, // Tigre de Bengala
 'Oceania': `<ellipse cx="32" cy="33" rx="14" ry="13" fill="#9a9aa0"/><ellipse cx="32" cy="36" rx="8" ry="8" fill="#d8d8dc"/><ellipse cx="20" cy="44" rx="5" ry="3" fill="#8a8a90"/><ellipse cx="44" cy="44" rx="5" ry="3" fill="#8a8a90"/><circle cx="21" cy="9" r="6" fill="#9a9aa0"/><circle cx="43" cy="9" r="6" fill="#9a9aa0"/><circle cx="21" cy="9" r="3" fill="#e8c6cf"/><circle cx="43" cy="9" r="3" fill="#e8c6cf"/><circle cx="32" cy="16" r="10" fill="#9a9aa0"/><ellipse cx="32" cy="18" rx="4" ry="5" fill="#222"/><circle cx="26" cy="13" r="1.500" fill="#000"/><circle cx="38" cy="13" r="1.500" fill="#000"/>`, // Koala
 'Central America': `<path d="M10 28L3 30L10 33Z" fill="#6f8f5a"/><path d="M24 36L12 47L29 42Z" fill="#6f8f5a"/><path d="M38 36L50 47L34 42Z" fill="#6f8f5a"/><ellipse cx="30" cy="26" rx="20" ry="13" fill="#b9772e"/><path d="M20 20L30 16L40 20L40 30L30 34L20 30Z" fill="none" stroke="#6b3f12" stroke-width="2"/><path d="M30 16V34M20 25H40" stroke="#6b3f12" stroke-width="1.500"/><path d="M44 28L57 39L45 37Z" fill="#6f8f5a"/><circle cx="54" cy="21" r="6" fill="#6f8f5a"/><path d="M58 21L64 24L58 26Z" fill="#c9a24a"/><circle cx="54" cy="19" r="1.300" fill="#000"/>` // Tortuga carey
};
const petSvg = c => `<svg class="pet" viewBox="0 0 64 48">${PSVG[c]}</svg>`; // Dibujo 2D de la mascota de un continente
let mP = false; // ¿Se abrió el apartado de mascotas desde la pausa?
function revisarContinente(p) { // ¿Se completó todo el continente?
 const c = p[8]; if (!c || !PET[c] || S.cont[c]) return; // Sin continente, sin mascota o ya completado
 if (!P.filter(x => x[8] == c).every(x => S.ok[x[0]])) return; // Faltan países
 S.cont[c] = 1; S.oro += 150; S.leg += 750; S.coca += 2; if (!S.pets.includes(c)) S.pets.push(c); hud(); guardar(); // Recompensa y mascota
 aviso(`🌍 ¡${RG[c]} completado! ${mm('oro', 150)}${mm('leg', 750)}${mm('coca', 2)}`); // Aviso de recompensa
 verMascotas(c); // Muestra la nueva mascota con su descripción
}
function verMascotas(nuevo) { // Muestra las mascotas y sus descripciones
 $('mLista').innerHTML = (nuevo ? `<div class="item"><b>🎉 ¡Nueva mascota: ${PET[nuevo].n}!</b>${petSvg(nuevo)}<b></b></div>` : '') + Object.keys(PET).map(c => S.pets.includes(c) ? `<div class="item">${petSvg(c)}<b>${PET[c].n}<small>${PET[c].d}</small></b></div>` : `<div class="item"><span style="font-size:36px">🔒</span><b>Mascota de ${RG[c]}<small>Explora todos los países del continente para desbloquearla.</small></b></div>`).join(''); // Lista
 abrir('mascotas'); // Abre la ventana
}
$('pMasc').onclick = () => { cerrar('pausa'); mP = true; verMascotas(); }; // Botón de la pausa
$('mCerrar').onclick = () => { cerrar('mascotas'); if (mP) abrir('pausa'); mP = false; }; // Cierra y vuelve a la pausa si venía de ella

// ---------- SIGUIENTE PAÍS ----------
function centro(g) { let m = g.polys[0]; g.polys.forEach(po => { if (po[0].length > m[0].length) m = po; }); let a = [999, 999, -999, -999]; m[0].forEach(q => { a = [Math.min(a[0], q[0]), Math.min(a[1], q[1]), Math.max(a[2], q[0]), Math.max(a[3], q[1])]; }); return [(a[0] + a[2]) / 2, (a[1] + a[3]) / 2]; } // Centro del polígono más grande del país
$('bSig').onclick = () => { // Viaja directo al siguiente país disponible
 if (!jugando || document.querySelector('.modal:not(.oculto)')) return; // No con ventanas abiertas
 const ids = opciones(); if (!ids.length) return aviso('🌍 ¡Ya exploraste todo el mundo!'); // Países permitidos ahora
 const id = rnd(ids), g = geo.find(x => x.id == id), p = P.find(x => x[0] == id); // Elige uno
 S.pos = centro(g); if (vz > 1) enfocar(S.pos); pintar(); iniciarPais(p); // Viaja y empieza el desafío
};
// ---------- FINAL DEL JUEGO: EL AURA DEL MUNDO ----------
function final() { // Se exploraron todos los países
 S.fin = 1; finAnim = true; guardar(); // El mapa empieza a brillar con colores AURA
 $('fTxt').innerHTML = `Recorriste los ${P.length} países del mundo.<br>🪙 ${S.oro} · 🫘 ${S.leg} · 🌿 ${S.coca}<br>⭐ Países perfectos: ${S.primeros} · 🐾 Mascotas: ${S.pets.length}/7<br><br>Las hojas de coca te coronan y el mapa entero brilla con el AURA. Ya no eres un explorador: eres el <b>Yatiri del Mundo</b>.`; // Resumen y mensaje final
 abrir('final'); // Muestra la pantalla final
}
$('fSeguir').onclick = () => cerrar('final'); // Seguir contemplando el mapa brillante
$('fNueva').onclick = () => { localStorage.removeItem('yatiri'); location.reload(); }; // Empezar una aventura nueva
setInterval(() => { if (finAnim && jugando) pintar(); }, 150); // Anima los colores del mapa final

// ---------- ZOOM, PAÍSES EXPLORADOS Y PANTALLA COMPLETA ----------
function vis(po) { // ¿El polígono está dentro de la vista? (acelera el zoom)
 if (!po.b) { let a = [999, 999, -999, -999]; po[0].forEach(q => { a = [Math.min(a[0], q[0]), Math.min(a[1], q[1]), Math.max(a[2], q[0]), Math.max(a[3], q[1])]; }); po.b = a; } // Caja del polígono (una sola vez)
 const [x1, y1] = px(po.b[0], po.b[3]), [x2, y2] = px(po.b[2], po.b[1]); return x2 > -10 && x1 < cv.width + 10 && y2 > -10 && y1 < cv.height + 10; // Cruza la pantalla
}
const lim = () => { vz = Math.min(60, Math.max(1, vz)); vu = Math.min(1 - .5 / vz, Math.max(.5 / vz, vu)); vv = Math.min(1 - .5 / vz, Math.max(.5 / vz, vv)); }; // Mantiene el mapa dentro de la pantalla
const cxy = e => [e.clientX * cv.width / innerWidth, (e.clientY - cv.getBoundingClientRect().top) * cv.height / cv.clientHeight]; // Pantalla a lienzo
function zoomEn(f, x, y) { const a = inv(x, y); vz *= f; lim(); const b = inv(x, y); vu += (a[0] - b[0]) / 360; vv += (b[1] - a[1]) / 141; lim(); pintar(); } // Zoom hacia un punto (el mapa se redibuja en vectores: no pierde calidad)
function enfocar(pos) { vu = (pos[0] + 180) / 360; vv = (83 - pos[1]) / 141; lim(); } // Centra la vista en un punto
const ptrs = new Map(); let d0 = 0, z0 = 1; // Dedos o cursor activos
cv.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY }); cv.setPointerCapture(e.pointerId); if (ptrs.size == 2) { const [a, b] = [...ptrs.values()]; d0 = Math.hypot(a.x - b.x, a.y - b.y); z0 = vz; } }); // Empieza a tocar
cv.addEventListener('pointermove', e => { // Arrastrar o pellizcar
 const p = ptrs.get(e.pointerId); if (!p) return; // Ignora si no hay toque
 if (ptrs.size == 2) { p.x = e.clientX; p.y = e.clientY; const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y); ptrs.forEach(q => q.moved = 1); if (d0) { const r = cxy({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }); zoomEn(Math.min(60, Math.max(1, z0 * d / d0)) / vz, r[0], r[1]); } return; } // Pellizco = zoom
 if (Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > 8) p.moved = 1; // Pasó de toque a arrastre
 if (p.moved) { vu -= (e.clientX - p.x) / (innerWidth * vz); vv -= (e.clientY - p.y) / (cv.clientHeight * vz); lim(); pintar(); } // Mueve el mapa
 p.x = e.clientX; p.y = e.clientY; // Recuerda la posición
});
cv.addEventListener('pointerup', e => { const p = ptrs.get(e.pointerId); ptrs.delete(e.pointerId); if (ptrs.size < 2) d0 = 0; if (p && !p.moved && ptrs.size == 0) tocar(e); }); // Un toque sin arrastrar elige el país
cv.addEventListener('pointercancel', e => ptrs.delete(e.pointerId)); // Cancela el toque
cv.addEventListener('wheel', e => { e.preventDefault(); const r = cxy(e); zoomEn(e.deltaY < 0 ? 1.25 : .8, r[0], r[1]); }, { passive: false }); // Rueda del ratón
$('zMas').onclick = () => zoomEn(1.5, cv.width / 2, cv.height / 2); $('zMenos').onclick = () => zoomEn(1 / 1.5, cv.width / 2, cv.height / 2); // Botones + y -
$('zRes').onclick = () => { vz = 1; vu = .5; vv = .5; pintar(); }; // Vista completa
let pP = false; // ¿Se abrió "Países explorados" desde la pausa?
function verPaises() { // Muestra por continente los países explorados y los que faltan
 $('pLista').innerHTML = Object.keys(RG).map(c => { const l = P.filter(x => x[8] == c), ok = l.filter(x => S.ok[x[0]]).map(x => x[1]), no = l.filter(x => !S.ok[x[0]]).map(x => x[1]); return `<h3>${RG[c]} (${ok.length}/${l.length})</h3><p>✅ ${ok.join(', ') || '—'}</p><p>⬜ ${no.join(', ') || '¡Completo!'}</p>`; }).join(''); // Lista por continente
 abrir('paises'); // Abre la ventana
}
$('bPaises').onclick = () => { if (document.querySelector('.modal:not(.oculto)')) return; pP = false; verPaises(); }; // Desde el menú superior
$('pPaises').onclick = () => { cerrar('pausa'); pP = true; verPaises(); }; // Desde la pausa
$('pCerr').onclick = () => { cerrar('paises'); if (pP) abrir('pausa'); pP = false; }; // Cierra y vuelve a la pausa si venía de ella
const esFull = () => document.fullscreenElement || document.webkitFullscreenElement; // ¿Pantalla completa?
function pantalla() { // Entra en pantalla completa y bloquea en horizontal
 const d = document.documentElement, f = d.requestFullscreen || d.webkitRequestFullscreen; if (!f || esFull()) return; // Sin soporte o ya está
 const r = f.call(d); if (r && r.then) r.then(() => { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); }).catch(() => {}); // Bloquea horizontal
}
['bNueva', 'bCont'].forEach(i => $(i).addEventListener('click', pantalla)); // Al empezar, pantalla completa
$('bFull').onclick = () => { if (esFull()) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else pantalla(); }; // Botón ⛶
setInterval(() => { if (!jugando || !S || $('evento').classList.contains('oculto') || !$('eCont').classList.contains('oculto')) return; S.vida = Math.max(0, S.vida - 3); S.com = Math.max(0, S.com - 3); hud(); if (S.vida <= 0) fin(); }, 1000); // Mientras respondes un ataque: -3 vida y -3 comida por segundo
