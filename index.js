// Traversée : Un poussin traverse routes et rivières, aussi loin que possible. Attention aux voitures, et ne tombe pas à l'eau !
// Jeu NeoDex : police, cadres et boutons propres au jeu. Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Traversée</span><span class="hint">Flèches ou ZQSD : sauter · clic : sauter vers ce côté</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="208" height="240"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="sysCard"><b>PERSONNAGE</b><canvas id="tvPick" width="128" height="64" aria-label="Choix du personnage"></canvas><div class="hint" id="tvPickInfo" data-pxskip></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="tvFs">PLEIN ÉCRAN</button></div>
      
      <div class="hint">Sur la rivière, saute de tronc en tronc : ils t'emportent avec eux.</div><div class="hint">L'écran avance tout seul : celui qui traîne se fait rattraper.</div><div class="hint">Plus loin : des trains (le feu rouge clignote avant leur passage), de la glace qui fait glisser, et de la lave où l'on saute de pierre en pierre.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 480px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 208 / 240));max-width:none}
.gameBox canvas{image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
#tvPick{width:100%;max-width:384px;aspect-ratio:128/64;image-rendering:pixelated;cursor:pointer;margin-top:6px}
.gameBox canvas{width:min(100%,max(280px,calc((100vh - 170px) * 208 / 240)));height:auto;aspect-ratio:208/240}`;
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
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"], [/^PLEIN/, "full"]] });
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
const tvCar = ([m, l, d]) => cnv(32, 16, b => {  // une voiture vue de dessus
  px(b, '#05010b', 1, 2, 30, 12); px(b, '#05010b', 2, 1, 28, 14); px(b, m, 2, 2, 28, 12); px(b, l, 3, 3, 26, 1); px(b, d, 2, 12, 28, 2);
  px(b, '#2a3a5a', 9, 4, 5, 8); px(b, '#2a3a5a', 20, 4, 4, 8); px(b, '#8ab0e0', 10, 5, 1, 3); px(b, '#8ab0e0', 21, 5, 1, 3); px(b, '#fff4a0', 29, 3, 2, 2); px(b, '#fff4a0', 29, 11, 2, 2);
  px(b, '#05010b', 5, 0, 5, 2); px(b, '#05010b', 22, 0, 5, 2); px(b, '#05010b', 5, 14, 5, 2); px(b, '#05010b', 22, 14, 5, 2);
});
const TV_CARS = [['#ff4a5a', '#ffb0b8', '#a02030'], ['#3f8aff', '#b0d0ff', '#1a4aa0'], ['#5fdf6a', '#c8ffc8', '#2a8a3a'], ['#b07aff', '#e4d0ff', '#6a3ab0']].map(tvCar);
// le saut : le même dessin, pattes repliées
const tvHopRows = rows => [...rows.slice(0, 10), '..kkkkkkkk..', '............'];
// les personnages : deux images chacun (posé, en saut), débloqués par ton record
const TV_CHARS = [
  {name: 'Poussin', need: 0, img: TV_CHICK},
  {name: 'Canard', need: 25, img: [
    ['.....kkkk...', '....kGGGGk..', '....kGGkGk..', '....kGGGGkkk', '....kGGGGook', '.....kwwwkk.', 'k...kbbbbk..', 'kbkkbbbbbbk.', 'kbbbbbWWWbk.', '.kbbbbbbbbk.', '...kkokkok..', '...kok.kok..'],
    ['.....kkkk...', '....kGGGGk..', '....kGGkGk..', '....kGGGGkkk', '....kGGGGook', 'k....kwwwkk.', 'kbk.kbbbbk..', 'kbbkbbbbbbk.', 'kbbbbbWWWbk.', '.kbbbbbbbbk.', '..kkkkkkkk..', '............']].map(r => spr(r, {k: '#05010b', G: '#2a9a5a', w: '#ffffff', b: '#c8a882', W: '#f0e8dc', o: '#ff9a3d'}))},
  {name: 'Lapin', need: 50, img: [
    ['......kk.kk.', '.....kwkkwk.', '.....kwkkwk.', '.....kwwwwk.', '....kwwwkwwk', '....kwwwwwpk', '.kk.kwwwwwk.', 'kwwkwwwwwk..', 'kwwwwwwwwwk.', '.kwwwwwwwwk.', '..kkwkkkwk..', '...kk...kk..'],
    ['......kk.kk.', '.....kwkkwk.', '.....kwkkwk.', '.....kwwwwk.', '....kwwwkwwk', '.kk.kwwwwwpk', 'kwwkkwwwwwk.', 'kwwwwwwwwk..', '.kwwwwwwwwk.', '..kwwwwwwwk.', '...kkkkkkk..', '............']].map(r => spr(r, {k: '#05010b', w: '#e8e4f0', p: '#ff8aa0'}))},
  {name: 'Robot', need: 100, world: 'ville', img: [
    ['......k.....', '.....krk....', '..kkkkkkkk..', '..kmmmmmmk..', '..kmmbmbmk..', '..kmmmmmmk..', '...kkkkkk...', '..kMMMMMMk..', '.kkMyMMyMkk.', '..kMMMMMMk..', '...kMk.kMk..', '...kkk.kkk..'],
    ['......k.....', '.....krk....', '..kkkkkkkk..', '..kmmmmmmk..', '..kmmbmbmk..', '..kmmmmmmk..', '...kkkkkk...', '.kkMMMMMMkk.', '..kMyMMyMk..', '..kMMMMMMk..', '...kkkkkk...', '............']].map(r => spr(r, {k: '#05010b', r: '#ff4a5a', m: '#b8c0d8', b: '#5ae0ff', M: '#8a92aa', y: '#ffd84a'}))},
  // chacun des suivants emmène dans son monde
  ...[['Pingouin', 150, 'banquise', ['....kkkk....', '...kKKKKk...', '..kKKKKKKk..', '..kKKKwkKk..', '..kKKKKKKkk.', '..kKKwwwwook', '.kKKwwwwwkk.', 'kKKwwwwwwk..', 'kKKwwwwwwk..', '.kKwwwwwk...', '..kkokkok...', '...kok.ok...'], {k: '#05010b', K: '#2a3448', w: '#f4f8ff', o: '#ffa030'}],
    ['Fantôme', 200, 'nuit', ['....kkkk....', '...kwwwwk...', '..kwwwwwwk..', '..kwwwwkwk..', '..kwwwwkwk..', '..kwwwwwwwk.', '.kWwwwwwwwk.', 'kWwwwwwwwwk.', 'kWWwwwwwwwk.', 'kWWwwwwwwwk.', 'kwkwwkwwkwk.', '.k.kk.kk.k..'], {k: '#05010b', w: '#ece8ff', W: '#b8b0e0'}],
    ['Dino', 250, 'jungle', ['......kkkk..', '.....kggggk.', '.....kgkgggk', '.....kgggggk', '.k...kgggkk.', 'kgk.kggggk..', 'kggkggGGgk..', '.kgggggGGk..', '..kgdgggGk..', '...kgggdgk..', '...kgk.kgk..', '...kkk.kkk..'], {k: '#05010b', g: '#5fc86a', G: '#d8f0a0', d: '#2a8a3a'}],
    ['Alien', 400, 'planete', ['..k......k..', '...k....k...', '...kkkkkk...', '..kaaaaaak..', '.kaaawwwaak.', '.kaaawbwaak.', '.kaaawwwaak.', '..kaaaaaak..', '...kkkkkk...', '..kAAAAAAk..', '...kAk.kAk..', '...kkk.kkk..'], {k: '#05010b', a: '#8af05a', A: '#b07aff', w: '#ffffff', b: '#05010b'}]]
    .map(([name, need, world, rows, pal]) => ({name, need, world, img: [rows, tvHopRows(rows)].map(r => spr(r, pal))})),
];
const tvChar = () => TV_CHARS[tvs.char] && (games.best.traversee || 0) >= TV_CHARS[tvs.char].need ? TV_CHARS[tvs.char] : TV_CHARS[0];
// le train : une locomotive et deux wagons (128 px), une pierre sur la lave
const TV_TRAIN = cnv(128, 16, b => {
  for (let w = 0; w < 2; w++) { const x = w * 42; px(b, '#05010b', x + 1, 1, 40, 14); px(b, '#3a6ac0', x + 2, 2, 38, 12); px(b, '#6a9ae0', x + 2, 2, 38, 1); px(b, '#1a3a7a', x + 2, 12, 38, 2); for (let k = 0; k < 4; k++) px(b, '#c8e0ff', x + 5 + k * 9, 5, 6, 5); }
  px(b, '#05010b', 85, 1, 42, 14); px(b, '#d83a3a', 86, 2, 40, 12); px(b, '#ff7a6a', 86, 2, 40, 1); px(b, '#8a1a1a', 86, 12, 40, 2); px(b, '#2a2a3a', 88, 4, 12, 8); px(b, '#c8e0ff', 89, 5, 10, 5);
  px(b, '#ffd84a', 104, 6, 14, 4); px(b, '#fff4a0', 124, 3, 2, 3); px(b, '#fff4a0', 124, 10, 2, 3);
});
const tvStone = n => cnv(n * 16, 16, b => { const w = n * 16; px(b, '#05010b', 1, 2, w - 2, 12); px(b, '#05010b', 2, 1, w - 4, 14); px(b, '#5a5060', 2, 2, w - 4, 12); px(b, '#7a7080', 3, 3, w - 6, 3); px(b, '#3a3242', 2, 11, w - 4, 3); for (let x = 5; x < w - 4; x += 6) px(b, '#4a4250', x, 7 + (x % 4 ? 1 : 0), 2, 2); });
const TV_STONES = [null, tvStone(1), tvStone(2)];
const TV_TRUCK = cnv(48, 16, b => { px(b, '#05010b', 1, 1, 46, 14); px(b, '#e8e0d0', 2, 2, 32, 12); px(b, '#c8c0b0', 2, 12, 32, 2); for (let x = 6; x < 34; x += 6) px(b, '#b0a898', x, 3, 1, 9); px(b, '#ffa030', 36, 2, 10, 12); px(b, '#c06a10', 36, 12, 10, 2); px(b, '#2a3a5a', 39, 4, 4, 8); px(b, '#fff4a0', 45, 3, 2, 2); px(b, '#fff4a0', 45, 11, 2, 2); });
const tvLog = (n, [ba, li, da, gr, kn, cu] = ['#8a5a2a', '#a8743a', '#5a3a1a', '#6a4420', '#c89a5a', '#d8b070']) => cnv(n * 16, 16, b => {  // un tronc : écorce, nœuds, bouts coupés avec leurs cernes
  const w = n * 16; px(b, '#05010b', 0, 2, w, 12); px(b, ba, 1, 3, w - 2, 10); px(b, li, 1, 4, w - 2, 2); px(b, da, 1, 11, w - 2, 2);
  for (let x = 6; x < w - 6; x += 7) px(b, gr, x, 7 + (x % 3), 4, 1); for (let x = 12; x < w - 8; x += 19) { px(b, da, x, 5, 3, 3); px(b, kn, x + 1, 6, 1, 1); }
  px(b, cu, 1, 4, 3, 8); px(b, li, 2, 6, 1, 4); px(b, cu, w - 4, 4, 3, 8); px(b, li, w - 3, 6, 1, 4);
});
const TV_LOGS = [null, null, tvLog(2), tvLog(3), tvLog(4)];
const TV_TREE = spr(['.....kkkk.......', '...kkNNNNkk.....', '..kNNnnNNNNk....', '.kNnnNNNNnNNk...', '.kNnNNNnNNNNk...', 'kNNNNNNNNnNNNk..', 'kNnNNNNNNNNNNk..', 'kNNNNnNNNNnNNk..', '.kNNNNNNNNNNk...', '.kkNNNNNNNNkk...', '...kkkddkkk.....', '.....kddk.......', '....kkddkk......', '................', '................', '................'], {k: '#05010b', N: '#2a7a3a', n: '#4aa84a', d: '#6a4420'});
// les mondes : herbe (deux tons, deux taches, joint des dalles), arbre, route, rivière, troncs, voitures, et ce qui tombe du ciel
const tvLogs = P => [null, null, tvLog(2, P), tvLog(3, P), tvLog(4, P)];
const TV_WORLDS = {
  ferme: {name: 'Campagne', grass: ['#3a9a44', '#40a24a', '#6ad06a', '#ffd84a'], tree: TV_TREE, road: ['#3a3848', '#4a4858', '#c8c0a0', '#2a2838'], river: ['#2a5ac0', '#5a9aff', '#1a3a7a'], logs: TV_LOGS},
  ville: {name: 'Ville du futur', grass: ['#2a3448', '#2e384c', '#5ae0ff', '#ff4fd8', '#1e2638'], road: ['#14101e', '#2a2040', '#ff4fd8', '#0a0814'], river: ['#3a1a7a', '#b07aff', '#1a0a40'],
    tree: cnv(16, 16, b => { px(b, '#05010b', 6, 1, 5, 15); px(b, '#5a6280', 7, 4, 3, 11); px(b, '#05010b', 3, 0, 11, 5); px(b, '#5ae0ff', 4, 1, 9, 3); px(b, '#c8f8ff', 5, 1, 4, 1); px(b, '#05010b', 4, 12, 9, 4); px(b, '#3a4260', 5, 13, 7, 2); }),
    logs: tvLogs(['#3a3a5a', '#5ae0ff', '#1a1a30', '#2a2a48', '#ff4fd8', '#8a8ab0']), cars: [['#ff4fd8', '#ffb0f0', '#a02090'], ['#3ae0ff', '#c0f8ff', '#1a7a9a'], ['#ffd84a', '#fff4b0', '#a08a10'], ['#ffffff', '#ffffff', '#8a92aa']].map(tvCar)},
  banquise: {name: 'Banquise', grass: ['#e8f0f8', '#dce8f4', '#ffffff', '#a8c8e8'], road: ['#5a6878', '#6a7888', '#ffffff', '#4a5868'], river: ['#1a4a7a', '#8ac8ff', '#0a2a4a'], fx: ['#ffffff', 40, 1],
    tree: spr(['.......kk.......', '......kwwk......', '.....kwNNwk.....', '.....kNNNNk.....', '....kwwNNwwk....', '....kNNNNNNk....', '...kwwNNNNwwk...', '...kNNNNNNNNk...', '..kwwwNNNNwwwk..', '..kNNNNNNNNNNk..', '..kkkkkddkkkkk..', '......kddk......', '......kddk......', '................', '................', '................'], {k: '#05010b', w: '#ffffff', N: '#2a6a5a', d: '#6a4420'}),
    logs: tvLogs(['#d8ecfa', '#ffffff', '#98bcd8', '#c0dcf0', '#ffffff', '#eef8ff'])},
  nuit: {name: 'Cimetière la nuit', grass: ['#1e3230', '#223634', '#3a5a4a', '#5a4a6a'], road: ['#24202e', '#302a3c', '#8a7aa0', '#18141e'], river: ['#1a3a1a', '#4a8a3a', '#0a200a'], fx: ['#d8ff7a', 14, 0], dark: .3,
    tree: cnv(16, 16, b => { px(b, '#05010b', 3, 3, 10, 12); px(b, '#05010b', 4, 2, 8, 1); px(b, '#8a8aa0', 4, 3, 8, 11); px(b, '#a8a8c0', 5, 3, 6, 1); px(b, '#5a5a70', 5, 6, 6, 1); px(b, '#5a5a70', 7, 5, 2, 4); px(b, '#3a2a4a', 2, 14, 12, 2); }),
    logs: tvLogs(['#4a3a2a', '#6a5038', '#2a2018', '#3a2c20', '#8a7058', '#9a8060'])},
  jungle: {name: 'Jungle des dinos', grass: ['#2a6a2a', '#2e7430', '#8ad04a', '#ff6a8a'], road: ['#7a5a3a', '#8a6a48', '#a88a60', '#5a3e24'], river: ['#3a7a6a', '#7ac8b0', '#1a4a3a'], logs: TV_LOGS, fx: ['#8ad04a', 8, 1],
    tree: spr(['....kk...kk.....', '..kkNNk.kNNkk...', '.kNNnnNkNnnNNk..', 'kNnn.kNNNk.nnNk.', 'kn...kNNNk...nk.', '.....kNddk......', '.......dd.......', '......kddk......', '......kddk......', '......kddk......', '.....kkddkk.....', '................', '................', '................', '................', '................'], {k: '#05010b', N: '#1a7a2a', n: '#4ac04a', d: '#8a5a2a'})},
  planete: {name: 'Planète lointaine', grass: ['#5a2a5a', '#622e62', '#ff9ae0', '#5ae0ff'], road: ['#2a1a3a', '#3a2a4a', '#5ae0ff', '#1a0a2a'], river: ['#1a8a6a', '#6affc8', '#0a4a3a'], fx: ['#ff9ae0', 12, -1],
    tree: cnv(16, 16, b => { px(b, '#05010b', 5, 2, 6, 12); px(b, '#05010b', 2, 7, 4, 7); px(b, '#05010b', 10, 5, 4, 9); px(b, '#5ae0ff', 6, 3, 4, 10); px(b, '#c8f8ff', 6, 3, 1, 8); px(b, '#3ab0d8', 3, 8, 2, 5); px(b, '#3ab0d8', 11, 6, 2, 7); px(b, '#3a1a4a', 2, 13, 12, 2); }),
    logs: tvLogs(['#6a4a8a', '#8a6aaa', '#3a2a5a', '#5a3a7a', '#ff9ae0', '#a88ac8'])}};
const tvWorld = () => TV_WORLDS[tvChar().world || 'ferme'];
const tvs = gstore('traversee', {games: 0}); tvs.char ??= 0;
let tv = null;
function tvRow(i) {  // chaque rangée se décide à sa première vue, à partir d'un dé seedé par la partie
  if (tv.rows[i]) return tv.rows[i];
  const r = seeded(tv.seed + i * 7919), lvl = Math.min(1, i / 160), prev = tv.rows[i - 1]?.type;
  let type = i < 3 ? 'grass' : r() < .32 ? 'grass' : r() < .55 ? 'road' : 'river'; if (i >= 3 && prev === 'grass' && type === 'grass' && r() < .6) type = 'road';
  // plus loin, de nouveaux terrains : la voie ferrée dès la rangée 15, la glace dès 30, la lave dès 50
  const r2 = seeded(tv.seed + i * 104729);
  if (i >= 15 && type === 'road' && r2() < .3) type = 'rail';
  if (i >= 30 && type === 'grass' && prev !== 'ice' && r2() < .4) type = 'ice';
  if (i >= 50 && type === 'river' && r2() < .45) type = 'lava';
  const row = {type, dir: r() < .5 ? -1 : 1, items: []};
  if (type === 'grass') { row.trees = new Set(); if (i > 2) for (let c = 0; c < TV.COLS; c++) if (r() < .18 + lvl * .1 && c !== 6) row.trees.add(c); }
  if (type === 'road') { row.speed = (.5 + r() * .7 + lvl * 1.1) * row.dir; const n = 1 + Math.floor(r() * (2 + lvl * 2)), span = TV.COLS * 16 + 64; for (let k = 0; k < n; k++) { const truck = r() < .25; row.items.push({x: k * span / n + r() * 20, len: truck ? 3 : 2, img: truck ? TV_TRUCK : TV_CARS[Math.floor(r() * 4)]}); } }
  if (type === 'rail') { row.speed = 7 * row.dir; row.span = W + 128 + 900 + Math.floor(r() * 400); row.off = 128; row.items.push({x: r() * row.span - 128, len: 8, img: TV_TRAIN}); }
  if (type === 'ice') row.speed = (.3 + r() * .3 + lvl * .3) * row.dir;  // la glace fait glisser, comme un tronc sans fin
  if (type === 'lava') { row.speed = (.25 + r() * .35 + lvl * .3) * row.dir; const n = 4, span = TV.COLS * 16 + 64; for (let k = 0; k < n; k++) row.items.push({x: k * span / n + r() * 8, len: 1 + (r() < .5 - lvl * .3 ? 1 : 0)}); }
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
  tv.from = [tv.x, tv.row]; tv.row = nr; tv.x = /river|ice|lava/.test(R.type) ? nx : col * 16; tv.hopAt = tv.tick; tv.face = dc;
  if (tv.row > tv.maxRow) { tv.maxRow = tv.row; for (let i = tv.row; i < tv.row + 16; i++) tvRow(i);
    const ch = TV_CHARS.find(c => c.need && c.need === tv.maxRow && (games.best.traversee || 0) < c.need); if (ch) { tv.unlock = {name: ch.name, t: 150}; beep(880, .3, 'square', 1760, .06); } }
  beep(620 + dr * 80, .03, 'square', 900, .04);
}
function tvDie(why) { tv.mode = 'over'; tv.why = why; tv.deadAt = tv.tick; tvs.games++; best('traversee', tv.maxRow); saveGames(); tvInfo(); tvPick(); beep(why === 'Plouf !' || why === 'Brûlé !' ? 180 : 120, .4, why === 'Plouf !' ? 'sine' : 'sawtooth', 60, .1); }
function tvUpdate() {
  const span = TV.COLS * 16 + 64;
  for (let i = Math.floor(tv.cam) - 2; i < tv.cam + 18; i++) { const R = tv.rows[i]; if (!R || R.type === 'grass') continue; const sp = R.span || span, off = R.off || 32; for (const it of R.items) { it.x += R.speed; it.x = ((it.x + off) % sp + sp) % sp - off; } }
  tv.cam += (Math.max(tv.cam + .004 + Math.min(.012, tv.maxRow / 20000), tv.row - 4) - tv.cam) * .05 + .003;  // la caméra avance d'elle-même : pas question de traîner
  const R = tvRow(tv.row), landed = tv.tick - tv.hopAt >= TV.HOP, cx = tv.x + 8;
  if (R.type === 'road' || R.type === 'rail') for (const it of R.items) if (cx + 4 > it.x && cx - 4 < it.x + it.len * 16) return tvDie(R.type === 'rail' ? 'Le train !' : 'Écrasé !');
  if (R.type === 'ice' && landed) { tv.x += R.speed; if (tv.x < -6 || tv.x > (TV.COLS - 1) * 16 + 6) return tvDie('Glissade !'); }
  if (R.type === 'lava' && landed) {
    const st = R.items.find(it => cx > it.x + 1 && cx < it.x + it.len * 16 - 1); if (!st) return tvDie('Brûlé !');
    tv.x += R.speed; if (tv.x < -6 || tv.x > (TV.COLS - 1) * 16 + 6) return tvDie('Brûlé !');
  }
  if (R.type === 'river' && landed) {
    const log = R.items.find(it => cx > it.x + 2 && cx < it.x + it.len * 16 - 2); if (!log) return tvDie('Plouf !');
    tv.x += R.speed; if (tv.x < -6 || tv.x > (TV.COLS - 1) * 16 + 6) return tvDie('Emporté !');
  }
  if (tvY(tv.row) > H + 2) return tvDie('Trop lent !');
}
function tvDraw() {
  const gone = tv.rows[Math.floor(tv.cam) - 6]; if (gone) gone.img = null;  // l'herbe gardée des rangées passées est libérée
  const WD = tvWorld(), G = WD.grass;
  for (let i = Math.floor(tv.cam) - 1; i < tv.cam + 17; i++) {
    const R = tvRow(i), y = Math.round(tvY(i)); if (y > H || y < TV.TOP - 16) continue;
    if (R.type === 'grass') { if (R.imgW !== WD) { R.img = null; R.imgW = WD; }
      g.drawImage(R.img ??= cnv(W, 16, b => { for (let x = 0; x < W; x++) for (let k = 0; k < 16; k++) { const h = (Math.imul(x * 13 + (i * 16 + k) * 7, 2654435761) >>> 0) / 4294967296; px(b, G[4] && (x % 16 === 0 || k === 0) ? G[4] : h < .05 ? G[2] : h < .07 ? G[3] : i % 2 ? G[0] : G[1], x, k); } }), 0, y); }
    if (R.type === 'road') { const D = WD.road; px(g, D[0], 0, y, W, 16); px(g, D[1], 0, y, W, 1); if (tvRow(i + 1).type === 'road') for (let x = 4; x < W; x += 16) px(g, D[2], x, y, 8, 1); px(g, D[3], 0, y + 15, W, 1); }
    if (R.type === 'rail') { px(g, '#4a4040', 0, y, W, 16); for (let x = 0; x < W; x += 2) px(g, (x * 7 + i) % 5 ? '#5a5050' : '#3a3232', x, y + (x * 3) % 16, 1, 1);
      for (let x = 2; x < W; x += 8) px(g, '#6a4420', x, y + 2, 4, 12); px(g, '#c8c8d8', 0, y + 4, W, 1); px(g, '#8a8a9a', 0, y + 5, W, 1); px(g, '#c8c8d8', 0, y + 10, W, 1); px(g, '#8a8a9a', 0, y + 11, W, 1);
      const it = R.items[0], near = R.dir > 0 ? it.x + 128 > -300 && it.x < W : it.x < W + 300 && it.x + 128 > 0, on = near && tv.tick % 20 < 10;  // le feu : il clignote quand le train arrive
      px(g, '#05010b', 1, y + 1, 5, 7); px(g, on ? '#ff3a3a' : '#5a1a1a', 2, y + 2, 3, 3); if (on) px(g, '#ffb0a0', 2, y + 2, 1, 1); px(g, '#8a8a9a', 3, y + 8, 1, 7); }
    if (R.type === 'ice') { px(g, '#a8d8f0', 0, y, W, 16); for (let x = 0; x < W; x++) { const h = (Math.imul(x * 31 + i * 977, 2654435761) >>> 0) / 4294967296; if (h < .06) px(g, '#e8f8ff', x, y + 2 + Math.floor(h * 180) % 12, 3, 1); else if (h < .08) px(g, '#78b0d0', x, y + 3 + Math.floor(h * 300) % 10, 2, 1); }
      for (let x = (Math.floor(tv.tick / 3) * R.dir % 32 + 32) % 32; x < W; x += 32) { px(g, '#c8ecff', x, y + 7, 4, 1); px(g, '#c8ecff', x + (R.dir > 0 ? 3 : 0), y + 6, 1, 3); }
      px(g, '#78b0d0', 0, y + 15, W, 1); }
    if (R.type === 'lava') { px(g, '#c83a10', 0, y, W, 16); for (let x = 0; x < W; x++) if ((x * 5 + i * 13 + Math.floor(tv.tick / 6) * R.dir * 2) % 19 === 0) px(g, '#ff8a2a', x, y + 3 + (x % 4) * 3, 3, 1);
      for (let k = 0; k < 3; k++) { const bx = (i * 53 + k * 71) % W, t = (tv.tick + k * 23 + i * 7) % 60; if (t < 12) px(g, t < 6 ? '#ffd84a' : '#ff6a1a', bx, y + 6, 2 + (t >> 2), 2); }
      if (tvRow(i + 1).type !== 'lava') px(g, '#7a1a08', 0, y, W, 2); }
    if (R.type === 'river') { px(g, WD.river[0], 0, y, W, 16); for (let x = 0; x < W; x += 1) if ((x * 7 + i * 11 + Math.floor(tv.tick / 8) * R.dir * 3) % 23 === 0) px(g, WD.river[1], x, y + 4 + (x % 3) * 3, 3, 1); if (tvRow(i + 1).type !== 'river') px(g, WD.river[2], 0, y, W, 2); }
  }
  for (let i = Math.floor(tv.cam) + 17; i >= Math.floor(tv.cam) - 1; i--) {  // de haut en bas : ce qui est plus bas passe devant
    const R = tvRow(i), y = Math.round(tvY(i)); if (y > H || y < TV.TOP - 32) continue;
    if (R.type === 'grass') for (const c of R.trees) g.drawImage(WD.tree, c * 16, y - 4);
    if (R.type === 'river') for (const it of R.items) g.drawImage(WD.logs[it.len], Math.round(it.x), y);
    if (R.type === 'lava') for (const it of R.items) g.drawImage(TV_STONES[it.len], Math.round(it.x), y);
    if (R.type === 'road' || R.type === 'rail') for (const it of R.items) { const im = WD.cars?.[TV_CARS.indexOf(it.img)] || it.img; g.save(); if (R.dir < 0) { g.translate(Math.round(it.x) + it.len * 16, y); g.scale(-1, 1); g.drawImage(im, 0, 0); } else g.drawImage(im, Math.round(it.x), y); g.restore(); }
    if (i === tv.row) {
      const k = Math.min(1, (tv.tick - tv.hopAt) / TV.HOP), hopY = k < 1 ? Math.sin(k * Math.PI) * 5 : 0, fy = tvY(tv.from[1]) + (tvY(tv.row) - tvY(tv.from[1])) * k, fx = tv.from[0] + (tv.x - tv.from[0]) * k;
      if (tv.mode === 'over' && tv.why === 'Écrasé !') { px(g, '#ffd84a', Math.round(tv.x) + 1, y + 6, 14, 5); px(g, '#05010b', Math.round(tv.x) + 1, y + 11, 14, 1); px(g, '#ff9a3d', Math.round(tv.x) + 12, y + 7, 3, 2); }
      else if (tv.mode === 'over' && (tv.why === 'Plouf !' || tv.why === 'Brûlé !')) { const t = Math.min(8, tv.tick - tv.deadAt); for (let a = 0; a < 6; a++) px(g, tv.why === 'Plouf !' ? '#c8e0ff' : '#8a8090', Math.round(tv.x) + 8 + Math.cos(a) * t, y + 8 + Math.sin(a) * t * .5, 2, 2); }
      else { g.save(); if (tv.face < 0) { g.translate(Math.round(fx) + 14, 0); g.scale(-1, 1); g.drawImage(tvChar().img[k < 1 ? 1 : 0], 0, Math.round(fy - hopY) + 2); } else g.drawImage(tvChar().img[k < 1 ? 1 : 0], Math.round(fx) + 2, Math.round(fy - hopY) + 2); g.restore(); }
    }
  }
  if (WD.dark) { g.fillStyle = `rgba(10,0,30,${WD.dark})`; g.fillRect(0, TV.TOP, W, H); }
  if (WD.fx) { const [c, n, v] = WD.fx; for (let k = 0; k < n; k++) {  // neige qui tombe, lucioles qui clignotent, feuilles, spores qui montent
    const sx = (k * 97 + Math.sin((tv.tick + k * 40) / 50) * 8 + W) % W, sy = ((k * 61 + tv.tick * (.3 + k % 4 * .12) * v) % H + H) % H;
    if (v || (tv.tick + k * 37) % 90 < 55) px(g, c, Math.round(sx), Math.round(sy), k % 5 ? 1 : 2, k % 5 ? 1 : 2); } }
  px(g, '#05010b', 0, 0, W, TV.TOP); pxFont(g, String(tv.maxRow), 6, 10, '#ffffff', 8); pxFont(g, 'record ' + (games.best.traversee || 0), W - 6, 10, '#a8b8a0', 6, 'right');
  if (tv.unlock && tv.mode === 'play') { if (--tv.unlock.t <= 0) tv.unlock = null; else gameText(g, W, [['NOUVEAU PERSONNAGE', '#ffd84a', 8], [tv.unlock.name + ' débloqué !', '#ffffff']], 40); }
  if (tv.mode === 'ready') gameText(g, W, [['TRAVERSÉE', '#ffd84a', 14], ['Flèches ou clic pour sauter', '#ffffff'], ['Ne traîne pas !', '#a8d8a0'], [tvChar().name + ' · ' + tvWorld().name, '#b0d0ff']], 90);
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
function tvInfo() { showStats([['Record', (games.best.traversee || 0) + ' rangées'], ['Parties', tvs.games], ['Personnages', TV_CHARS.filter(c => (games.best.traversee || 0) >= c.need).length + ' / ' + TV_CHARS.length]]); }
// le choix du personnage : un dessin par case, en ombre avec le record à atteindre tant qu'il n'est pas débloqué
const pk = $('tvPick'), pg = pk.getContext('2d'); pg.imageSmoothingEnabled = false;
const tvShadow = img => cnv(img.width, img.height, b => { b.drawImage(img, 0, 0); b.globalCompositeOperation = 'source-in'; px(b, '#3a5a3e', 0, 0, img.width, img.height); });
function tvPick() {
  const rec = games.best.traversee || 0; pg.clearRect(0, 0, 128, 64);
  TV_CHARS.forEach((c, i) => { const x = i % 4 * 32, y = Math.floor(i / 4) * 32, open = rec >= c.need, on = tvChar() === c;
    px(pg, on ? '#ffd84a' : '#24482a', x + 1, y + 1, 30, 30); px(pg, '#0c1a0e', x + 2, y + 2, 28, 28);
    if (open) pg.drawImage(c.img[0], x + 4, y + 4, 24, 24);
    else { pg.drawImage(c.shadow ??= tvShadow(c.img[0]), x + 4, y + 4, 24, 24); pxFont(pg, String(c.need), x + 16, y + 22, '#ffd84a', 6, 'center'); } });
  const c = tvChar(), next = TV_CHARS.find(q => q.need > rec);
  $('tvPickInfo').textContent = c.name + ' (' + tvWorld().name + ')' + (next ? ' · ' + next.name + ' à ' + next.need + ' rangées' : ' · tous débloqués !');
}
pk.onclick = e => { const r = pk.getBoundingClientRect(), i = Math.floor((e.clientX - r.left) / r.width * 4) + 4 * Math.floor((e.clientY - r.top) / r.height * 2), c = TV_CHARS[i];
  if (!c) return; if ((games.best.traversee || 0) < c.need) { toast(c.name + ' : atteins ' + c.need + ' rangées pour le débloquer'); return; }
  tvs.char = i; saveGames(); tvPick(); beep(700, .05); };
$('gNew').onclick = () => { tvNew(); $('gNew').blur(); };
{  // vérification : chaque rivière a des troncs, chaque route a des voitures, et la colonne du milieu reste libre au départ
    const keep = tv; tv = null; tvNew(); let ok = true; const seen = new Set();
    for (let i = 0; i < 300; i++) { const R = tvRow(i); seen.add(R.type); ok &&= R.type === 'grass' ? !R.trees.has(6) || i > 2 : R.type === 'ice' || R.items.length > 0; if (i < 15) ok &&= !/rail|ice|lava/.test(R.type); }
    console.assert(ok && tvRow(0).type === 'grass' && ['rail', 'ice', 'lava'].every(t => seen.has(t)), 'traversee', [...seen]);
    const kc = tvs.char, kb = games.best.traversee; games.best.traversee = 1e6;
    for (let i = 0; i < TV_CHARS.length; i++) { tvs.char = i; const w = tvWorld(); if (!w || !w.tree || w.logs.length !== 5 || w.grass.length < 4 || w.road.length !== 4 || w.river.length !== 3 || !TV_CHARS[i].img[1]) throw new Error('traversee : monde de ' + TV_CHARS[i].name); tvDraw(); }
    tvs.char = kc; if (kb === undefined) delete games.best.traversee; else games.best.traversee = kb; tv = keep;
}
$('tvFs').onclick = () => { $('tvFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
cv.__tv = {st: () => tv, row: i => tvRow(i), chars: TV_CHARS, char: () => tvChar().name, best: v => { const o = games.best.traversee; games.best.traversee = v; tvPick(); tvInfo(); return o; }};  // pour le test « local »
ctx.onOpen(() => { tvPick(); if (!tv) tvNew(); gameLoop(tv, 'traversee', tvUpdate, tvDraw); tvInfo(); });

}
