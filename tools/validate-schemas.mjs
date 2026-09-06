/* Validateur des schémas de section contre les règles documentées par Shopify.
   Objectif : faire échouer ici, pas dans l'éditeur de thème du client. */
import fs from 'node:fs';
import path from 'node:path';

const THEME = process.argv[2];

// Types n'acceptant aucun default, ou seulement une liste fermée de valeurs.
const NO_DEFAULT = ['image_picker', 'video', 'blog', 'article', 'page', 'product',
  'collection', 'collection_list', 'product_list', 'article_list',
  'metaobject', 'metaobject_list', 'font', 'html'];
const ENUM_DEFAULT = {
  url: ['/collections', '/collections/all'],
  link_list: ['main-menu', 'footer']
};
const SIDEBAR = ['header', 'paragraph'];

let errors = 0;
const fail = (f, msg) => { console.log(`  ✗ ${f} — ${msg}`); errors++; };

function checkSettings(file, settings, scope, allIds) {
  for (const s of settings) {
    if (SIDEBAR.includes(s.type)) continue;
    if (!s.id) { fail(file, `${scope} : réglage de type "${s.type}" sans id`); continue; }
    if (allIds.has(s.id)) fail(file, `${scope} : id dupliqué "${s.id}"`);
    allIds.add(s.id);

    if ('default' in s) {
      if (NO_DEFAULT.includes(s.type)) {
        fail(file, `${scope} : "${s.id}" (${s.type}) n'accepte pas d'attribut default`);
      } else if (ENUM_DEFAULT[s.type] && !ENUM_DEFAULT[s.type].includes(s.default)) {
        fail(file, `${scope} : "${s.id}" (${s.type}) default="${s.default}" — valeurs acceptées : ${ENUM_DEFAULT[s.type].join(', ')}`);
      }
    }

    if (s.type === 'range') {
      for (const k of ['min', 'max', 'step', 'default']) {
        if (!(k in s)) fail(file, `${scope} : range "${s.id}" — attribut "${k}" manquant (tous requis)`);
      }
      const steps = (s.max - s.min) / s.step;
      if (steps > 101) fail(file, `${scope} : range "${s.id}" — ${Math.round(steps)} crans, maximum 101`);
      if (!Number.isInteger(steps)) fail(file, `${scope} : range "${s.id}" — (max-min) non divisible par step`);
      if (s.default < s.min || s.default > s.max) fail(file, `${scope} : range "${s.id}" — default hors bornes`);
      if ((s.default - s.min) % s.step !== 0) fail(file, `${scope} : range "${s.id}" — default non aligné sur step`);
    }

    if (s.type === 'select') {
      const vals = (s.options || []).map((o) => o.value);
      if (!vals.length) fail(file, `${scope} : select "${s.id}" sans options`);
      if ('default' in s && !vals.includes(s.default)) {
        fail(file, `${scope} : select "${s.id}" — default="${s.default}" absent des options`);
      }
    }

    if (s.type === 'checkbox' && 'default' in s && typeof s.default !== 'boolean') {
      fail(file, `${scope} : checkbox "${s.id}" — default doit être un booléen`);
    }
  }
}

for (const file of fs.readdirSync(path.join(THEME, 'sections')).filter((f) => f.endsWith('.liquid'))) {
  const src = fs.readFileSync(path.join(THEME, 'sections', file), 'utf8');
  const m = src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!m) { fail(file, 'aucun bloc schema'); continue; }
  let schema;
  try { schema = JSON.parse(m[1]); } catch (e) { fail(file, 'JSON du schema invalide : ' + e.message); continue; }

  const sectionIds = new Set();
  checkSettings(file, schema.settings || [], 'section', sectionIds);

  const blockTypes = new Set();
  for (const b of schema.blocks || []) {
    blockTypes.add(b.type);
    checkSettings(file, b.settings || [], `block "${b.type}"`, new Set());
  }

  // Les visible_if doivent pointer sur un réglage existant.
  const refs = [...src.matchAll(/"visible_if":\s*"\{\{\s*(section|block)\.settings\.([a-z0-9_]+)/g)];
  for (const [, kind, id] of refs) {
    if (kind === 'section' && !sectionIds.has(id)) fail(file, `visible_if référence section.settings.${id}, inexistant`);
  }

  // Les presets ne doivent référencer que des blocks déclarés.
  for (const p of schema.presets || []) {
    for (const b of p.blocks || []) {
      if (!blockTypes.has(b.type)) fail(file, `preset "${p.name}" référence un block "${b.type}" non déclaré`);
      for (const k of Object.keys(b.settings || {})) {
        const def = (schema.blocks.find((x) => x.type === b.type)?.settings || []).find((x) => x.id === k);
        if (!def) fail(file, `preset "${p.name}" — block "${b.type}" définit "${k}", absent du schema`);
      }
    }
    for (const k of Object.keys(p.settings || {})) {
      if (!sectionIds.has(k)) fail(file, `preset "${p.name}" définit "${k}", absent du schema`);
    }
  }
  console.log(`${file} : ${(schema.settings || []).length} réglages, ${(schema.blocks || []).length} blocks`);
}

// settings_schema.json
const ts = JSON.parse(fs.readFileSync(path.join(THEME, 'config/settings_schema.json'), 'utf8'));
const tids = new Set();
for (const group of ts) if (group.settings) checkSettings('settings_schema.json', group.settings, 'thème', tids);

// Les settings.* utilisés dans le Liquid doivent exister dans settings_schema.json
const liquidFiles = ['layout/theme.liquid', 'sections/header.liquid', 'sections/hero-seo.liquid',
  'sections/announcement-badge.liquid', 'snippets/cc-round-image.liquid'];
const used = new Set();
for (const f of liquidFiles) {
  const src = fs.readFileSync(path.join(THEME, f), 'utf8');
  // Lookbehind négatif : ne capter que settings.X global, jamais
  // section.settings.X ni block.settings.X.
  for (const [, id] of src.matchAll(/(?<![.\w])settings\.([a-z0-9_]+)/g)) used.add(id);
}
for (const id of used) {
  if (!tids.has(id)) fail('liquid', `settings.${id} utilisé mais absent de settings_schema.json`);
}

console.log(`\n${errors === 0 ? '✓ Aucune anomalie de schema' : '✗ ' + errors + ' anomalie(s)'}`);
process.exit(errors ? 1 : 0);
