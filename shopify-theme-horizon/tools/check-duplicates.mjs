/* Contrôle de duplication interne.
 *
 * Deux pages qui partagent une phrase entière se cannibalisent : Google en
 * retient une et ignore l'autre, et le travail de rédaction de la seconde est
 * perdu. Ce contrôle refuse toute chaîne rédactionnelle de plus de quarante
 * caractères présente dans deux gabarits différents.
 *
 *   node tools/check-duplicates.mjs [longueur]
 *
 * Il sort en code 1 dès la première collision, pour pouvoir être enchaîné
 * devant un téléversement.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEUIL = Number(process.argv[2]) || 40;

/* Réglages dont la valeur n'est jamais lue par un visiteur : ils sont
   identiques d'une page à l'autre par construction et n'ont donc rien à voir
   avec du contenu dupliqué. */
const CLES_IGNOREES = new Set([
  'empty_state_text',      // texte affiché à l'éditeur quand un bloc est vide
  'section_aria_label',    // libellé d'accessibilité, non indexé
  'accordion_aria_label',
  'image', 'avatar_1', 'avatar_2', // chemins d'assets
  'cta_url', 'button_link', 'url',
]);

/* Une liste d'étiquettes — pastilles, zones, bandeaux — se recoupe
   légitimement d'une ville à l'autre. On ne compare que de la prose. */
const estProse = (v) => typeof v === 'string' && !v.includes('\n') && /\s/.test(v);

function chainesLongues(fichier) {
  const tpl = JSON.parse(fs.readFileSync(fichier, 'utf8'));
  const trouvees = new Map(); // texte -> chemin du réglage
  const visiterReglages = (reglages, chemin) => {
    for (const [k, v] of Object.entries(reglages || {})) {
      if (CLES_IGNOREES.has(k) || !estProse(v) || v.length <= SEUIL) continue;
      trouvees.set(v, `${chemin}.${k}`);
    }
  };
  for (const [nom, sec] of Object.entries(tpl.sections || {})) {
    visiterReglages(sec.settings, nom);
    for (const [id, blk] of Object.entries(sec.blocks || {})) {
      visiterReglages(blk.settings, `${nom}/${id}`);
    }
  }
  return trouvees;
}

const gabarits = fs.readdirSync(path.join(ROOT, 'templates'))
  .filter((f) => f.endsWith('.json'))
  .sort();

const index = new Map(); // texte -> [{page, chemin}]
let total = 0;
for (const g of gabarits) {
  for (const [texte, chemin] of chainesLongues(path.join(ROOT, 'templates', g))) {
    total += 1;
    if (!index.has(texte)) index.set(texte, []);
    index.get(texte).push({ page: g.replace(/^page\.|\.json$/g, ''), chemin });
  }
}

const collisions = [...index].filter(([, o]) => o.length > 1);
for (const [texte, occurrences] of collisions) {
  console.log(`\n✗ « ${texte.slice(0, 90)}${texte.length > 90 ? '…' : ''} »`);
  for (const o of occurrences) console.log(`    ${o.page} → ${o.chemin}`);
}

console.log(
  `\n${collisions.length} chaîne(s) partagée(s) — ${gabarits.length} gabarits, ` +
  `${total} chaînes de plus de ${SEUIL} caractères.`
);
process.exit(collisions.length ? 1 : 0);
