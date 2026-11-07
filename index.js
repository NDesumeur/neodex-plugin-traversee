// Traversée : Un poussin traverse routes et rivières, aussi loin que possible. Attention aux voitures, et ne tombe pas à l'eau !
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Traversée</span><span class="hint">Flèches ou ZQSD : sauter · clic : sauter vers ce côté</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="208" height="240"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button></div>
      
      <div class="hint">Sur la rivière, saute de tronc en tronc : ils t'emportent avec eux.</div><div class="hint">L'écran avance tout seul : celui qui traîne se fait rattraper.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:480px;aspect-ratio:208/240}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "TRAVERSÉE", T: {"k": "#050c06", "k2": "#0c1a0e", "fill": "#142a18", "fillOn": "#1c3a22", "hl": "#24482a", "line": "#3a6a40", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#24482a", "btnHi": "#5a9a5a", "btnLo": "#0c1a0e", "btnHov": "#2a5430", "btnHovHi": "#7aba7a", "text": "#f0fff0", "muted": "#b0d0a8", "acc2": "#3fa0ff", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#060e08", "bgDot": "#142a18", "bgDot2": "#0c1a0e", "spark": "#3a6a40", "spark2": "#3fa0ff", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkkk....", "...kwwwwk...", "..kwwwwwwk..", "..kwwkwwwk..", "..kwwwwwwkk.", "..kgwwwwwook", ".kggggwwwkk.", "kggggggggk..", "kggggggggk..", ".kggggggk...", "..kkokkok...", "...kok.ok..."],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 208, H = 240, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
/* ---------- Traversée : un poussin traverse routes et rivières, aussi loin que possible. Sans fin. ---------- */
const TV = {T: 16, COLS: 13, TOP: 14, HOP: 7};
const TV_PAL = {k: '#05010b', y: '#ffd84a', Y: '#fff4a0', o: '#ff9a3d', O: '#c06a10', w: '#ffffff', r: '#ff4a5a'};
const TV_CHICK = [spr(['....kkkk....', '...kYYYYk...', '..kYYYYYYk..', '..kYYkYYYk..', '..kYYYYYYkk.', '..kyYYYYYook', '.kyyyyYYYkk.', 'kyyyyyyyyk..', 'kyyyyyyyyk..', '.kyyyyyyk...', '..kkokkok...', '...kok.ok...'], TV_PAL),
  spr(['....kkkk....', '...kYYYYk...', '..kYYYYYYk..', '..kYYkYYYk..', '..kYYYYYYkk.', '.kkyYYYYYook', 'kyykyyYYYkk.', 'kyyyyyyyyk..', '.kyyyyyyyk..', '..kkkkkkk...', '...ko..ok...', '............'], TV_PAL)];
const TV_CARS = [['#ff4a5a', '#ffb0b8', '#a02030'], ['#3f8aff', '#b0d0ff', '#1a4aa0'], ['#5fdf6a', '#c8ffc8', '#2a8a3a'], ['#b07aff', '#e4d0ff', '#6a3ab0']].map(([m, l, d]) => cnv(32, 16, b => {  // une voiture vue de dessus
  px(b, '#05010b', 1, 2, 30, 12); px(b, '#05010b', 2, 1, 28, 14); px(b, m, 2, 2, 28, 12); px(b, l, 3, 3, 26, 1); px(b, d, 2, 12, 28, 2);
  px(b, '#2a3a5a', 9, 4, 5, 8); px(b, '#2a3a5a', 20, 4, 4, 8); px(b, '#8ab0e0', 10, 5, 1, 3); px(b, '#8ab0e0', 21, 5, 1, 3); px(b, '#fff4a0', 29, 3, 2, 2); px(b, '#fff4a0', 29, 11, 2, 2);
  px(b, '#05010b', 5, 0, 5, 2); px(b, '#05010b', 22, 0, 5, 2); px(b, '#05010b', 5, 14, 5, 2); px(b, '#05010b', 22, 14, 5, 2);
}));
const TV_TRUCK = cnv(48, 16, b => { px(b, '#05010b', 1, 1, 46, 14); px(b, '#e8e0d0', 2, 2, 32, 12); px(b, '#c8c0b0', 2, 12, 32, 2); for (let x = 6; x < 34; x += 6) px(b, '#b0a898', x, 3, 1, 9); px(b, '#ffa030', 36, 2, 10, 12); px(b, '#c06a10', 36, 12, 10, 2); px(b, '#2a3a5a', 39, 4, 4, 8); px(b, '#fff4a0', 45, 3, 2, 2); px(b, '#fff4a0', 45, 11, 2, 2); });
const tvLog = n => cnv(n * 16, 16, b => {  // un tronc : écorce, nœuds, bouts coupés avec leurs cernes
  const w = n * 16; px(b, '#05010b', 0, 2, w, 12); px(b, '#8a5a2a', 1, 3, w - 2, 10); px(b, '#a8743a', 1, 4, w - 2, 2); px(b, '#5a3a1a', 1, 11, w - 2, 2);
  for (let x = 6; x < w - 6; x += 7) px(b, '#6a4420', x, 7 + (x % 3), 4, 1); for (let x = 12; x < w - 8; x += 19) { px(b, '#5a3a1a', x, 5, 3, 3); px(b, '#c89a5a', x + 1, 6, 1, 1); }
  px(b, '#d8b070', 1, 4, 3, 8); px(b, '#a8743a', 2, 6, 1, 4); px(b, '#d8b070', w - 4, 4, 3, 8); px(b, '#a8743a', w - 3, 6, 1, 4);
});
const TV_LOGS = [null, null, tvLog(2), tvLog(3), tvLog(4)];
const TV_TREE = spr(['.....kkkk.......', '...kkNNNNkk.....', '..kNNnnNNNNk....', '.kNnnNNNNnNNk...', '.kNnNNNnNNNNk...', 'kNNNNNNNNnNNNk..', 'kNnNNNNNNNNNNk..', 'kNNNNnNNNNnNNk..', '.kNNNNNNNNNNk...', '.kkNNNNNNNNkk...', '...kkkddkkk.....', '.....kddk.......', '....kkddkk......', '................', '................', '................'], {k: '#05010b', N: '#2a7a3a', n: '#4aa84a', d: '#6a4420'});
const tvs = gstore('traversee', {games: 0});
let tv = null;
function tvRow(i) {  // chaque rangée se décide à sa première vue, à partir d'un dé seedé par la partie
  if (tv.rows[i]) return tv.rows[i];
  const r = seeded(tv.seed + i * 7919), lvl = Math.min(1, i / 160), prev = tv.rows[i - 1]?.type;
  let type = i < 3 ? 'grass' : r() < .32 ? 'grass' : r() < .55 ? 'road' : 'river'; if (i >= 3 && prev === 'grass' && type === 'grass' && r() < .6) type = 'road';
  const row = {type, dir: r() < .5 ? -1 : 1, items: []};
  if (type === 'grass') { row.trees = new Set(); if (i > 2) for (let c = 0; c < TV.COLS; c++) if (r() < .18 + lvl * .1 && c !== 6) row.trees.add(c); }
  if (type === 'road') { row.speed = (.5 + r() * .7 + lvl * 1.1) * row.dir; const n = 1 + Math.floor(r() * (2 + lvl * 2)), span = TV.COLS * 16 + 64; for (let k = 0; k < n; k++) { const truck = r() < .25; row.items.push({x: k * span / n + r() * 20, len: truck ? 3 : 2, img: truck ? TV_TRUCK : TV_CARS[Math.floor(r() * 4)]}); } }
  if (type === 'river') { row.speed = (.35 + r() * .5 + lvl * .6) * row.dir; const n = 3 - Math.floor(lvl * 1.4 + r() * .6), span = TV.COLS * 16 + 64; for (let k = 0; k < Math.max(2, n); k++) { const len = 2 + Math.floor(r() * (3 - lvl)); row.items.push({x: k * span / Math.max(2, n) + r() * 10, len}); } }
  return tv.rows[i] = row;
}
function tvNew() {
  tv = Object.assign(tv || {tick: 0, raf: 0}, {mode: 'ready', seed: Math.floor(Math.random() * 1e9), rows: {}, row: 0, col: 6, x: 6 * 16, hopAt: -99, from: [6 * 16, 0], cam: -3, maxRow: 0, deadAt: 0, why: '', face: 0});
  for (let i = -4; i < 20; i++) tvRow(i); tvInfo();
}
const tvY = i => H - TV.T - (i - tv.cam) * TV.T;
function tvHop(dc, dr) {
  if (tv.mode === 'ready') tv.mode = 'play'; if (tv.mode !== 'play' || tv.tick - tv.hopAt < TV.HOP) return;
  const nr = tv.row + dr, nx = tv.x + dc * 16; if (nr < Math.floor(tv.cam) - 1 || nx < 0 || nx > (TV.COLS - 1) * 16) return;
  const R = tvRow(nr), col = Math.round(nx / 16); if (R.type === 'grass' && R.trees.has(col)) return;
  tv.from = [tv.x, tv.row]; tv.row = nr; tv.x = R.type === 'river' ? nx : col * 16; tv.hopAt = tv.tick; tv.face = dc;
  if (tv.row > tv.maxRow) { tv.maxRow = tv.row; for (let i = tv.row; i < tv.row + 16; i++) tvRow(i); }
  beep(620 + dr * 80, .03, 'square', 900, .04);
}
function tvDie(why) { tv.mode = 'over'; tv.why = why; tv.deadAt = tv.tick; tvs.games++; best('traversee', tv.maxRow); saveGames(); tvInfo(); beep(why === 'Plouf !' ? 180 : 120, .4, why === 'Plouf !' ? 'sine' : 'sawtooth', 60, .1); }
function tvUpdate() {
  const span = TV.COLS * 16 + 64;
  for (let i = Math.floor(tv.cam) - 2; i < tv.cam + 18; i++) { const R = tv.rows[i]; if (!R || R.type === 'grass') continue; for (const it of R.items) { it.x += R.speed; it.x = ((it.x + 32) % span + span) % span - 32; } }
  tv.cam += (Math.max(tv.cam + .004 + Math.min(.012, tv.maxRow / 20000), tv.row - 4) - tv.cam) * .05 + .003;  // la caméra avance d'elle-même : pas question de traîner
  const R = tvRow(tv.row), landed = tv.tick - tv.hopAt >= TV.HOP, cx = tv.x + 8;
  if (R.type === 'road') for (const it of R.items) if (cx + 4 > it.x && cx - 4 < it.x + it.len * 16) return tvDie('Écrasé !');
  if (R.type === 'river' && landed) {
    const log = R.items.find(it => cx > it.x + 2 && cx < it.x + it.len * 16 - 2); if (!log) return tvDie('Plouf !');
    tv.x += R.speed; if (tv.x < -6 || tv.x > (TV.COLS - 1) * 16 + 6) return tvDie('Emporté !');
  }
  if (tvY(tv.row) > H + 2) return tvDie('Trop lent !');
}
function tvDraw() {
  for (let i = Math.floor(tv.cam) - 1; i < tv.cam + 17; i++) {
    const R = tvRow(i), y = Math.round(tvY(i)); if (y > H || y < TV.TOP - 16) continue;
    if (R.type === 'grass') { for (let x = 0; x < W; x++) for (let k = 0; k < 16; k++) { const h = (Math.imul(x * 13 + (i * 16 + k) * 7, 2654435761) >>> 0) / 4294967296; px(g, h < .05 ? '#6ad06a' : h < .07 ? '#ffd84a' : i % 2 ? '#3a9a44' : '#40a24a', x, y + k); } }
    if (R.type === 'road') { px(g, '#3a3848', 0, y, W, 16); px(g, '#4a4858', 0, y, W, 1); if (tvRow(i + 1).type === 'road') for (let x = 4; x < W; x += 16) px(g, '#c8c0a0', x, y, 8, 1); px(g, '#2a2838', 0, y + 15, W, 1); }
    if (R.type === 'river') { px(g, '#2a5ac0', 0, y, W, 16); for (let x = 0; x < W; x += 1) if ((x * 7 + i * 11 + Math.floor(tv.tick / 8) * R.dir * 3) % 23 === 0) px(g, '#5a9aff', x, y + 4 + (x % 3) * 3, 3, 1); if (tvRow(i + 1).type !== 'river') px(g, '#1a3a7a', 0, y, W, 2); }
  }
  for (let i = Math.floor(tv.cam) + 17; i >= Math.floor(tv.cam) - 1; i--) {  // de haut en bas : ce qui est plus bas passe devant
    const R = tvRow(i), y = Math.round(tvY(i)); if (y > H || y < TV.TOP - 32) continue;
    if (R.type === 'grass') for (const c of R.trees) g.drawImage(TV_TREE, c * 16, y - 4);
    if (R.type === 'river') for (const it of R.items) g.drawImage(TV_LOGS[it.len], Math.round(it.x), y);
    if (R.type === 'road') for (const it of R.items) { g.save(); if (R.dir < 0) { g.translate(Math.round(it.x) + it.len * 16, y); g.scale(-1, 1); g.drawImage(it.img, 0, 0); } else g.drawImage(it.img, Math.round(it.x), y); g.restore(); }
    if (i === tv.row) {
      const k = Math.min(1, (tv.tick - tv.hopAt) / TV.HOP), hopY = k < 1 ? Math.sin(k * Math.PI) * 5 : 0, fy = tvY(tv.from[1]) + (tvY(tv.row) - tvY(tv.from[1])) * k, fx = tv.from[0] + (tv.x - tv.from[0]) * k;
      if (tv.mode === 'over' && tv.why === 'Écrasé !') { px(g, '#ffd84a', Math.round(tv.x) + 1, y + 6, 14, 5); px(g, '#05010b', Math.round(tv.x) + 1, y + 11, 14, 1); px(g, '#ff9a3d', Math.round(tv.x) + 12, y + 7, 3, 2); }
      else if (tv.mode === 'over' && tv.why === 'Plouf !') { const t = Math.min(8, tv.tick - tv.deadAt); for (let a = 0; a < 6; a++) px(g, '#c8e0ff', Math.round(tv.x) + 8 + Math.cos(a) * t, y + 8 + Math.sin(a) * t * .5, 2, 2); }
      else { g.save(); if (tv.face < 0) { g.translate(Math.round(fx) + 14, 0); g.scale(-1, 1); g.drawImage(TV_CHICK[k < 1 ? 1 : 0], 0, Math.round(fy - hopY) + 2); } else g.drawImage(TV_CHICK[k < 1 ? 1 : 0], Math.round(fx) + 2, Math.round(fy - hopY) + 2); g.restore(); }
    }
  }
  px(g, '#05010b', 0, 0, W, TV.TOP); pxFont(g, String(tv.maxRow), 6, 10, '#ffffff', 8); pxFont(g, 'record ' + (games.best.traversee || 0), W - 6, 10, '#a8b8a0', 6, 'right');
  if (tv.mode === 'ready') gameText(g, W, [['TRAVERSÉE', '#ffd84a', 14], ['Flèches ou clic pour sauter', '#ffffff'], ['Ne traîne pas !', '#a8d8a0']], 90);
  if (tv.mode === 'over' && tv.tick - tv.deadAt > 30) gameText(g, W, [[tv.why.toUpperCase(), '#ff4a5a', 12], [tv.maxRow + ' rangées', '#ffffff'], ['Clic pour rejouer', '#ffd84a']], 90);
}
const TV_DIRS = {ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], z: [0, 1], s: [0, -1], q: [-1, 0], d: [1, 0], w: [0, 1], a: [-1, 0]};
document.addEventListener('keydown', e => {
  if (!keyOk(e) || !tv) return; const d = TV_DIRS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (d) { e.preventDefault(); if (tv.mode === 'over') { if (tv.tick - tv.deadAt > 30) tvNew(); } else tvHop(...d); }
  if (e.key === ' ' && tv.mode === 'over' && tv.tick - tv.deadAt > 30) { e.preventDefault(); tvNew(); }
  if (e.key.toLowerCase() === 'p' && tv.mode === 'play') tv.mode = 'pause'; else if (e.key.toLowerCase() === 'p' && tv.mode === 'pause') tv.mode = 'play';
});
cv.onpointerdown = e => {
  e.preventDefault(); if (!tv) return; if (tv.mode === 'over') { if (tv.tick - tv.deadAt > 30) tvNew(); return; }
  const [x, y] = cpos(e), dx = x - (tv.x + 8), dy = y - (tvY(tv.row) + 8);
  if (Math.abs(dx) > Math.abs(dy) * 1.2) tvHop(Math.sign(dx), 0); else tvHop(0, dy < 0 ? 1 : -1);
};
function tvInfo() { showStats([['Record', (games.best.traversee || 0) + ' rangées'], ['Parties', tvs.games]]); }
$('gNew').onclick = () => { tvNew(); $('gNew').blur(); };
{  // vérification : chaque rivière a des troncs, chaque route a des voitures, et la colonne du milieu reste libre au départ
  const keep = tv; tv = null; tvNew(); let ok = true; for (let i = 0; i < 300; i++) { const R = tvRow(i); ok &&= R.type === 'grass' ? !R.trees.has(6) || i > 2 : R.items.length > 0; }
  console.assert(ok && tvRow(0).type === 'grass', 'traversee'); tv = keep;
}
ctx.onOpen(() => { if (!tv) tvNew(); gameLoop(tv, 'traversee', tvUpdate, tvDraw); tvInfo(); });

}
