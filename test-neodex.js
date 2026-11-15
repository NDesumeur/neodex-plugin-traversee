// lancé par le test « local » de NeoDex : une nouvelle partie, le plein écran et la place prise par le jeu (avec NEO_SHOTS : garde une image du jeu)
module.exports = async ({ pj, sleep }) => {
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'traversee-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await pj(`document.getElementById('gNew').click(), 0`); await sleep(1500);
  for (const k of ['ArrowUp', 'ArrowDown']) { await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`); await sleep(300); await pj(`document.dispatchEvent(new KeyboardEvent('keyup', {key: '${k}', bubbles: true})), 0`); }
  await shot('1-partie');
  await pj(`document.getElementById('tvFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await shot('2-plein-ecran');
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  // les nouveaux terrains arrivent plus loin, et un personnage se débloque avec le record
  const T = js => pj(`(() => { const T = document.getElementById('gc').__tv; ${js} })()`);
  const kinds = await T(`const s = new Set(); for (let i = 0; i < 400; i++) s.add(T.row(i).type); return [...s].sort().join(',');`);
  if (!/ice/.test(kinds) || !/lava/.test(kinds) || !/rail/.test(kinds)) throw new Error('terrains : ' + kinds);
  await T(`const t = T.st(); let i = 50; while (!(T.row(i).type === 'lava' && T.row(i + 2).type !== 'grass')) i++; t.cam = i - 6; t.row = i - 5; t.mode = 'pause'; return 0;`); await sleep(400); await shot('3-terrains');
  const old = await T(`return T.best(60);`);
  const r = await pj(`(() => { const c = document.getElementById('tvPick'), b = c.getBoundingClientRect(); c.dispatchEvent(new MouseEvent('click', {clientX: b.left + b.width * .6, clientY: b.top + 10, bubbles: true}));
    const a = document.getElementById('gc').__tv.char(); c.dispatchEvent(new MouseEvent('click', {clientX: b.left + b.width * .9, clientY: b.top + 10, bubbles: true})); return a + ',' + document.getElementById('gc').__tv.char(); })()`);
  if (r !== 'Lapin,Lapin') throw new Error('personnages (record 60 : lapin oui, robot non) : ' + r);
  await sleep(300); await shot('4-perso');
  if (process.env.NEO_SHOTS) { const d = await pj(`document.getElementById('tvPick').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'traversee-choix.png'), Buffer.from(d.split(',')[1], 'base64')); }
  await T(`T.best(${old ?? 0}); return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'terrains ' + kinds + ' · lapin débloqué à 60 · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
