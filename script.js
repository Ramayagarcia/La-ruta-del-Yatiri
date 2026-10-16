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
const RG = { 'Africa': 'África', 'North America': 'Norteamérica', 'South America': 'Sudamérica', 'Asia': 'Asia', 'Europe': 'Europa', 'Oceania': 'Oceanía' }; // Continentes en español
const CAP = Object.fromEntries('AFG:Kabul|ALB:Tirana|DZA:Argel|AND:Andorra la Vieja|AGO:Luanda|ATG:Saint John’s|ARM:Ereván|AUS:Canberra|AUT:Viena|AZE:Bakú|BHS:Nasáu|BHR:Manama|BGD:Daca|BRB:Bridgetown|BLR:Minsk|BEL:Bruselas|BLZ:Belmopán|BEN:Porto Novo|BTN:Timbu|BIH:Sarajevo|BWA:Gaborone|BRN:Bandar Seri Begawan|BGR:Sofía|BFA:Uagadugú|BDI:Gitega|KHM:Nom Pen|CMR:Yaundé|CAN:Ottawa|CPV:Praia|CAF:Bangui|TCD:Yamena|COL:Bogotá|COM:Moroni|COD:Kinsasa|COG:Brazzaville|CRI:San José|CIV:Yamusukro|HRV:Zagreb|CUB:La Habana|CYP:Nicosia|CZE:Praga|DNK:Copenhague|DJI:Yibuti|DMA:Roseau|DOM:Santo Domingo|ECU:Quito|SLV:San Salvador|GNQ:Malabo|ERI:Asmara|EST:Tallin|SWZ:Mbabane|ETH:Adís Abeba|FJI:Suva|FIN:Helsinki|GAB:Libreville|GMB:Banjul|GEO:Tiflis|DEU:Berlín|GHA:Acra|GRC:Atenas|GRD:Saint George’s|GTM:Ciudad de Guatemala|GIN:Conakri|GNB:Bisáu|GUY:Georgetown|HTI:Puerto Príncipe|HND:Tegucigalpa|HUN:Budapest|ISL:Reikiavik|IND:Nueva Delhi|IDN:Yakarta|IRN:Teherán|IRQ:Bagdad|IRL:Dublín|ISR:Jerusalén|ITA:Roma|JAM:Kingston|JPN:Tokio|JOR:Amán|KAZ:Astaná|KEN:Nairobi|KIR:Tarawa|PRK:Pionyang|KOR:Seúl|KWT:Kuwait|KGZ:Biskek|LAO:Vientián|LVA:Riga|LBN:Beirut|LSO:Maseru|LBR:Monrovia|LBY:Trípoli|LIE:Vaduz|LTU:Vilna|LUX:Luxemburgo|MDG:Antananarivo|MWI:Lilongüe|MYS:Kuala Lumpur|MDV:Malé|MLI:Bamako|MLT:La Valeta|MHL:Majuro|MRT:Nuakchot|MUS:Port Louis|FSM:Palikir|MDA:Chisinau|MCO:Mónaco|MNG:Ulán Bator|MNE:Podgorica|MAR:Rabat|MOZ:Maputo|MMR:Naipyidó|NAM:Windhoek|NRU:Yaren|NPL:Katmandú|NLD:Ámsterdam|NZL:Wellington|NIC:Managua|NER:Niamey|NGA:Abuya|MKD:Skopie|NOR:Oslo|OMN:Mascate|PAK:Islamabad|PLW:Ngerulmud|PAN:Panamá|PNG:Port Moresby|PER:Lima|PHL:Manila|POL:Varsovia|PRT:Lisboa|QAT:Doha|ROU:Bucarest|RWA:Kigali|KNA:Basseterre|LCA:Castries|VCT:Kingstown|WSM:Apia|SMR:San Marino|STP:Santo Tomé|SAU:Riad|SEN:Dakar|SRB:Belgrado|SYC:Victoria|SLE:Freetown|SGP:Singapur|SVK:Bratislava|SVN:Liubliana|SLB:Honiara|SOM:Mogadiscio|ZAF:Pretoria|SSD:Yuba|LKA:Sri Jayawardenapura Kotte|SDN:Jartum|SUR:Paramaribo|SWE:Estocolmo|CHE:Berna|SYR:Damasco|TWN:Taipéi|TJK:Dusambé|TZA:Dodoma|THA:Bangkok|TLS:Dili|TGO:Lomé|TON:Nukualofa|TTO:Puerto España|TUN:Túnez|TUR:Ankara|TKM:Asjabad|TUV:Funafuti|UGA:Kampala|UKR:Kiev/Kyiv|ARE:Abu Dabi|GBR:Londres|UZB:Taskent|VUT:Port Vila|VAT:Ciudad del Vaticano|VEN:Caracas|VNM:Hanoi|YEM:Saná|ZMB:Lusaka|ZWE:Harare|GRL:Nuuk|PSX:Ramala|KOS:Pristina|SAH:El Aaiún'.split('|').map(s => s.split(':'))); // Capital de cada país por código
const imgPJ = new Image(); imgPJ.onload = () => pintar(); // Imagen del personaje para el mapa
const UP = { // Mejoras: nombres y precios (g=oro, l=legumbres, c=coca)
 arma: { n: ['Lanza de madera','Cuchillo','Machete','Espada','AK-47'], c: [{g:50,l:500},{g:100,l:1000},{g:200,l:2000},{g:280,l:3500},{c:5}] }, // Armamento
 comida: { n: ['Canasta básica','Canasta clase media','Canasta clase alta'], c: [{g:50,l:500},{g:150,l:2000},{c:4}] }, // Comida
 botiq: { n: ['Botiquín de hospital','Amarre del Yatiri'], c: [{c:2,g:1000,l:2500},{c:10,g:5000,l:1000000}] } // Botiquines
};
const H = [[],[0],[],[1,2],[2,3,4],[]]; // Preguntas con pista según nivel de arma
const SK = [0,0,1,1,2,5]; // Preguntas que se saltan según nivel de arma
const MON = { g: 'oro', l: 'leg', c: 'coca' }; // Traduce moneda a campo guardado
let S = null, geo = [], jugando = false, Q = null, V = {}; // Estado, países del mapa, si juega, pregunta actual
// ---------- MAPA ----------
const px = (lo, la) => [(lo + 180) / 360 * cv.width, (83 - la) / 141 * cv.height]; // Coordenadas geográficas a píxeles
const inv = (x, y) => [x / cv.width * 360 - 180, 83 - y / cv.height * 141]; // Píxeles a coordenadas geográficas
fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson') // Descarga el mapamundi real
 .then(r => r.json()) // Convierte a objeto
 .then(j => { // Cuando llega
  geo = j.features.map(f => ({ id: f.properties.ADM0_A3, nom: f.properties.NAME_ES, iso: f.properties.ISO_A2_EH, cont: f.properties.CONTINENT, polys: f.geometry.type == 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates })); // Guarda polígonos
  return Promise.resolve().then(() => { // Crea los países jugables desde el propio mapa
   geo.forEach(g => { const cap = CAP[g.id]; if (!cap || !g.iso || g.iso == '-99' || P.some(p => p[0] == g.id)) return; P.push([g.id, g.nom, g.iso.toLowerCase(), cap, 'hsl(' + (g.id.charCodeAt(0) * 37 + g.id.charCodeAt(2) * 11) % 360 + ',60%,50%)', null, null, null, g.cont]); }); // Agrega cada país del mundo
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
  cx.fillStyle = S && p && S.ok[g.id] ? (typeof S.ok[g.id] == 'string' ? S.ok[g.id] : p[4]) : op.includes(g.id) ? '#d8ff3a' : '#3fae49'; // Bandera si explorado, verde claro si disponible, verde oscuro si no
  cx.beginPath(); // Nuevo trazo
  g.polys.forEach(po => po.forEach(r => r.forEach((c, i) => { const [x, y] = px(c[0], c[1]); i ? cx.lineTo(x, y) : cx.moveTo(x, y); }))); // Traza contornos
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
function resize() { cv.width = innerWidth; cv.height = innerHeight; pintar(); } // Ajusta el lienzo a la pantalla
addEventListener('resize', resize); resize(); // Reajusta al cambiar tamaño y al iniciar
function dentro(pt, r) { let d = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > pt[1]) != (r[j][1] > pt[1]) && pt[0] < (r[j][0] - r[i][0]) * (pt[1] - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) d = !d; return d; } // ¿Punto dentro del polígono?
cv.addEventListener('pointerdown', e => { // Al tocar o hacer clic en el mapa
 if (!jugando || document.querySelector('.modal:not(.oculto)')) return; // Ignora si no juega o hay ventana
 const pt = inv(e.clientX * cv.width / innerWidth, e.clientY * cv.height / innerHeight); // Convierte clic a coordenadas
 const g = geo.find(g => g.polys.some(po => dentro(pt, po[0]))); // Busca el país tocado
 if (!g) return; // Si es océano no hace nada
 const p = P.find(x => x[0] == g.id); // Busca datos del país
 if (!p) return aviso('🚧 País aún no disponible'); // País sin preguntas
 if (S.ok[g.id]) return aviso('✅ Ya exploraste ' + p[1]); // Ya explorado
 if (!opciones().includes(g.id)) return aviso('🚫 Debe compartir frontera con ' + P.find(x => x[0] == S.ult)[1]); // Solo países vecinos
 S.pos = pt; pintar(); iniciarPais(p); // Mueve al personaje y empieza el desafío
});
// ---------- INTERFAZ ----------
function aviso(t) { const d = document.createElement('div'); d.className = 'popup'; d.innerHTML = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2500); } // Mensaje animado
function hud() { // Actualiza barras y monedas
 const s2 = $('pj').firstElementChild.cloneNode(true); s2.setAttribute('width', 30); s2.setAttribute('height', 42); // Copia reducida del personaje
 const uri = 'data:image/svg+xml,' + encodeURIComponent(new XMLSerializer().serializeToString(s2)); // La convierte en imagen
 if (imgPJ.dataset.u != uri) { imgPJ.dataset.u = uri; imgPJ.src = uri; cv.style.cursor = `url("${uri}") 15 40, auto`; } // Cursor y marcador = personaje
 $('nombreJ').textContent = S.nombre; // Muestra el nombre
 $('bVida').style.width = S.vida + '%'; $('bCom').style.width = S.com + '%'; // Ancho de barras
 $('mon').innerHTML = ic(IC.oro, 22) + S.oro + ' ' + ic(IC.leg, 22) + S.leg + ' ' + ic(IC.coca, 22) + S.coca; // Monedas con logo
 $('tun').setAttribute('fill', ['#8b5a2b','#a0522d','#6a1b9a','#d4af37'][S.comida]); // Túnica evoluciona
 $('arma').innerHTML = S.arma ? IC.arma[S.arma - 1] : ''; // El arma comprada aparece en el personaje
 $('pj').classList.toggle('aura', !!S.yatiri); // Brillo del Yatiri
}
function entrar() { ['inicio'].forEach(i => $(i).classList.add('oculto')); ['hud', 'pj'].forEach(i => $(i).classList.remove('oculto')); jugando = true; hud(); pintar(); if (!S.ult) aviso('🌍 Elige tu primer país en el mapa'); } // Pasa del inicio al juego
$('bNueva').onclick = () => { // Nueva partida
 const n = $('nom').value.trim(); if (!n) return aviso('✍️ Escribe un nombre'); // Exige nombre
 S = { nombre: n, oro: 0, leg: 0, coca: 0, vida: 100, com: 100, arma: 0, comida: 0, botiq: 0, ok: {}, primeros: 0, yatiri: 0, pos: null, ult: null }; // Estado inicial
 entrar(); // Comienza
};
$('bCont').onclick = () => { const g = localStorage.getItem('yatiri'); if (!g) return aviso('No hay partida guardada'); S = JSON.parse(g); entrar(); }; // Carga lo guardado
function guardar() { localStorage.setItem('yatiri', JSON.stringify(S)); nota('💾 Guardado'); } // Guarda el progreso
const abrir = i => $(i).classList.remove('oculto'), cerrar = i => $(i).classList.add('oculto'); // Abrir y cerrar ventanas
$('bPausa').onclick = () => abrir('pausa'); $('pCont').onclick = () => cerrar('pausa'); // Pausa y continuar
$('pGuardar').onclick = guardar; // Botón guardar
$('pSalir').onclick = () => { guardar(); cerrar('pausa'); jugando = false; ['hud', 'pj'].forEach(cerrar); abrir('inicio'); S = null; pintar(); }; // Salir al inicio
setInterval(() => { // Cada segundo
 if (!jugando || document.querySelector('.modal:not(.oculto)')) return; // No corre en pausa ni ventanas
 if (S.com <= 0 && !S.yatiri) S.vida -= 2; // Sin comida baja la vida de 2 en 2
 if (S.vida <= 0) { alert('💀 Game over. El juego se reinicia.'); localStorage.removeItem('yatiri'); location.reload(); } // Fin del juego
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
function iniciarPais(p) { Q = { p, q: SK[S.arma], fallo: false }; abrir('quiz'); if (Q.q > 4) terminar(); else pregunta(); } // Empieza las 5 preguntas
function pregunta() { // Muestra la pregunta actual
 if (Q.q > 4) return terminar(); // Si ya acabó, termina
 const p = Q.p, i = Q.q, otros = P.filter(x => x != p); // País y los demás
 $('qN').textContent = `Pregunta ${i + 1}/5 — ${p[0] == 'x' ? '' : 'País misterioso'}`; // Numeración
 $('qMsg').textContent = ''; $('qIn').value = ''; // Limpia mensajes
 $('sil').classList.toggle('oculto', i != 0); // Silueta solo en la 1
 $('qIn').classList.toggle('oculto', !(i == 0 || i == 2)); $('qBtn').classList.toggle('oculto', !(i == 0 || i == 2)); // Entrada solo en 1 y 3
 $('qOps').innerHTML = ''; // Limpia opciones
 $('qT').textContent = ['¿Qué país es esta silueta?', '¿Cuál es su bandera?', '¿Cuál es su capital?', 'Verdadero o falso: ' + hecho(p)[0], p[7] ? '¿Quién es su presidente?' : '¿En qué parte del mundo está?'][i]; // Enunciado
 const resp0 = [p[1], p[1], p[3].split('/')[0], hecho(p)[1] ? 'Verdadero' : 'Falso', p[7] || RG[p[8]]][i]; // Respuesta para la pista
 $('qHint').textContent = H[S.arma].includes(i) ? `💡 Pista: empieza con "${resp0[0]}"` : ''; // Pista si el arma lo permite
 if (i == 0) dibujar(p); // Dibuja silueta
 if (i == 1) ops([p[2], ...otros.sort(() => Math.random() - .5).slice(0, 2).map(x => x[2])], p[2], f => `<img src="https://flagcdn.com/w160/${f}.png">`); // 3 banderas
 if (i == 3) ops(['Verdadero', 'Falso'], resp0); // Verdadero o falso
 if (i == 4) p[7] ? ops([p[7], ...otros.filter(x => x[7]).sort(() => Math.random() - .5).slice(0, 2).map(x => x[7])], p[7]) : ops([RG[p[8]], ...Object.values(RG).filter(r => r != RG[p[8]]).sort(() => Math.random() - .5).slice(0, 2)], RG[p[8]]); // Presidentes o continentes
}
function resp(ok) { // Evalúa una respuesta
 if (ok) { Q.q++; pregunta(); } // Correcta: avanza
 else { Q.fallo = true; $('qMsg').textContent = '❌ Incorrecto, inténtalo otra vez'; } // Incorrecta: no avanza
}
$('qBtn').onclick = () => { const v = $('qIn').value; resp(Q.q == 0 ? norm(v) == norm(Q.p[1]) : Q.p[3].split('/').some(c => norm(c) == norm(v))); }; // Respuesta escrita
$('qIn').onkeydown = e => { if (e.key == 'Enter') $('qBtn').click(); }; // Enter también responde
$('qCerrar').onclick = () => cerrar('quiz'); // Abandonar país
function terminar() { // País completado
 const p = Q.p, primero = !Q.fallo; // Datos y si fue al primer intento
 S.ok[p[0]] = 1; S.ult = p[0]; if (String(p[4]).startsWith('hsl')) colorBandera(p); // Marca como explorado y recuerda el último
 let t = ''; // Texto de recompensa
 if (S.arma == 5) { S.leg += 80; S.oro += 2; t = mm('leg', 80) + mm('oro', 2); } // Recompensa del AK-47
 else if (primero) { S.oro += 10; S.primeros++; t = mm('oro', 10); if (S.primeros % 5 == 0) { S.coca++; t += mm('coca', 1); } } // Primer intento
 else { S.leg += 30; t = mm('leg', 30); } // Otro intento
 const d = primero ? 5 : 10; S.vida = Math.max(0, S.vida - d); S.com = Math.max(0, S.com - d); // Desgaste
 cerrar('quiz'); aviso(`🎉 ${p[1]} explorado ${t}`); hud(); pintar(); guardar(); // Cierra, avisa y guarda
}
// ---------- TIENDA ----------
$('bTienda').onclick = () => { tienda(); abrir('tienda'); }; $('tCerrar').onclick = () => cerrar('tienda'); // Abrir y cerrar tienda
function tienda() { // Dibuja las mejoras disponibles
 $('items').innerHTML = ''; // Limpia lista
 Object.keys(UP).forEach(k => { // Para cada categoría
  const l = S[k], u = UP[k]; // Nivel actual y datos
  const d = document.createElement('div'); d.className = 'item'; // Fila
  d.innerHTML = ic(IC[k][Math.min(l, u.n.length - 1)], 36) + (l >= u.n.length ? `<b>${u.n[l - 1]} ✅ MÁXIMO</b>` : `<b>${u.n[l]}</b>`); // Logo y nombre
  if (l < u.n.length) Object.keys(u.c[l]).forEach(m => { const b = document.createElement('button'); b.innerHTML = ic(IC[MON[m]], 18) + ' ' + u.c[l][m]; b.onclick = () => comprar(k, m); d.appendChild(b); }); // Botón por moneda
  $('items').appendChild(d); // Agrega fila
 });
}
function comprar(k, m) { // Compra una mejora
 const u = UP[k], l = S[k], precio = u.c[l][m]; // Datos y precio
 if (S[MON[m]] < precio) return aviso('❌ No te alcanza'); // Sin fondos
 S[MON[m]] -= precio; S[k]++; // Paga y sube de nivel
 if (k == 'comida') { const [c, v] = [[30, 20], [50, 50], [100, 100]][l]; S.com = Math.min(100, S.com + c); S.vida = Math.min(100, S.vida + v); } // Efecto comida
 if (k == 'botiq') { S.com = 100; S.vida = 100; if (l == 1) S.yatiri = 1; } // Efecto botiquín
 const ult = l == u.n.length - 1; // ¿Es el nivel máximo?
 aviso(ic(IC[k][l], 48) + (ult ? ' +1000 de AURA' : l == 0 ? ' +1000 de Paula' : ' +1000 de Laura')); // Animación con el logo
 hud(); tienda(); guardar(); // Evoluciona al personaje y refresca
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
