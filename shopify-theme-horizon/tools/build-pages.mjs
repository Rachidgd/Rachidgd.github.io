/* Fabrique de templates de page.
   -------------------------------------------------------------------------
   Une page ville ne diffère d'une autre que par son texte. Tout le reste —
   ordre des sections, couleurs, tailles, rythmes verticaux — appartient à la
   direction artistique et doit être rigoureusement identique d'une page à
   l'autre. On sépare donc les deux : le contenu vit dans content/, le
   squelette ici. Recopier 400 lignes de réglages à la main pour chaque ville
   garantirait une dérive au bout de trois pages.

   Usage : node tools/build-pages.mjs [famille]
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ---------- Jetons de direction artistique (repris de la home) ---------- */
const DA = {
  ink: '#14120f',
  accent: '#ff4a17',
  accentTitre: '#fa703d',
  muted: '#8a847d',
  fondSombre: '#dedede',
  fondTemoignage: '#d8d8d8',
  avatar: 'shopify://shop_images/cc_avatar_2.webp',
};

/* ---------- Blocs de titre : texte / bulle / retour à la ligne ---------- */
function h1Blocks(segments) {
  const blocks = {};
  const order = [];
  let t = 0, b = 0, br = 0;
  for (const seg of segments) {
    if (seg === '|') {
      const k = `br${++br}`;
      blocks[k] = { type: 'line_break', settings: {} };
      order.push(k);
    } else if (seg === '@') {
      const k = `b${++b}`;
      const variantes = [
        { amplitude: 6, rotate: 24, duration: 7 },
        { amplitude: 5, rotate: -20, duration: 8 },
        { amplitude: 7, rotate: 30, duration: 6 },
      ][(b - 1) % 3];
      blocks[k] = {
        type: 'bubble',
        settings: {
          ...(b === 1 ? { image: DA.avatar } : {}),
          size_mobile: 34, size_desktop: 62,
          ...variantes, decorative: true, image_alt: '',
        },
      };
      order.push(k);
    } else {
      const k = `t${++t}`;
      const [texte, ton] = Array.isArray(seg) ? seg : [seg, 'default'];
      blocks[k] = {
        type: 'text',
        settings: {
          text: texte,
          tone: ton === 'accent' ? 'custom' : ton,
          custom_color: ton === 'accent' ? DA.accentTitre : DA.ink,
        },
      };
      order.push(k);
    }
  }
  return { blocks, block_order: order };
}

/* ---------- Sections ---------- */
const hero = (c) => ({
  type: 'heroseo',
  ...h1Blocks(c.h1),
  settings: {
    proof_text: c.preuve,
    avatar_1: DA.avatar, avatar_2: DA.avatar,
    avatar_size_mobile: 22, avatar_size_desktop: 26, avatar_ring: '#f0eeec',
    proof_fs_mobile: 13, proof_fs_desktop: 15, proof_color: '#3e3a35',
    proof_gap: 10, proof_mb_min: 20, proof_mb_max: 34,
    h1_fs_mobile: 34, h1_fs_desktop: 60, h1_weight: '700', h1_max_width: 30,
    collapse_breaks_mobile: true,
    color_ink: DA.ink, color_accent: DA.accent, color_muted: DA.muted, color_light: '#ffffff',
    enable_float: true, bubble_gap: 3, bubble_shift: 0,
    bubble_ring_width: 0, bubble_ring_color: '#ffffff',
    sub_text: c.sousTitre,
    sub_fs_mobile: 15, sub_fs_desktop: 17, sub_max_width: 64, sub_color: '#6b655e',
    sub_mt_min: 18, sub_mt_max: 26,
    cta_label: c.cta.label, cta_url: c.cta.url,
    cta_show_arrow: true, cta_style: 'solid',
    cta_fs_mobile: 15, cta_fs_desktop: 16, cta_pad_y: 14, cta_pad_x: 30,
    cta_mt_min: 26, cta_mt_max: 38,
    float_hide_mobile: true, float_width_mobile: 140, float_width_desktop: 232,
    float_offset_x: -40, float_offset_y: -56, float_radius: 20, float_rotate: -4,
    align: 'center', bg_color: '',
    pt_mobile: 48, pt_desktop: 96, pb_mobile: 64, pb_desktop: 20,
    schema_service_enable: true,
    schema_service_name: c.schema.nom,
    schema_service_type: c.schema.type,
    schema_service_description: c.schema.description,
    schema_service_audience: c.schema.public,
    schema_service_areas: c.schema.zones.join('\n'),
    schema_service_offers: c.schema.prestations.join('\n'),
  },
});

const ribbons = (c) => {
  const blocks = {}; const order = [];
  c.pastilles.forEach((label, i) => {
    const k = `c${i + 1}`;
    blocks[k] = { type: 'chip', settings: { label, url: '' } };
    order.push(k);
  });
  return {
    type: 'cc-ribbons', blocks, block_order: order,
    settings: {
      ribbon_a_items: c.bandeauA.join('\n'),
      ribbon_a_bg: DA.accent, ribbon_a_color: '#ffffff', ribbon_a_angle: -7,
      ribbon_a_speed: 40, ribbon_a_direction: 'left',
      ribbon_b_items: c.bandeauB.join('\n'),
      ribbon_b_bg: DA.ink, ribbon_b_color: '#ffffff', ribbon_b_angle: 7,
      ribbon_b_speed: 52, ribbon_b_direction: 'left',
      separator: '✳',
      ribbon_fs_mobile: 15, ribbon_fs_desktop: 24, ribbon_weight: '600',
      ribbon_py_min: 10, ribbon_py_max: 16, ribbon_gap_min: 16, ribbon_gap_max: 28,
      stage_h_min: 200, stage_h_max: 300, stage_mb_min: 40, stage_mb_max: 80,
      eyebrow: c.surtitre, eyebrow_color: DA.accent, eyebrow_font: 'cursive',
      eyebrow_style: 'normal', eyebrow_weight: '600',
      eyebrow_fs_mobile: 22, eyebrow_fs_desktop: 28,
      reveal_text: c.constat,
      reveal_color_off: '#a8a29b', reveal_color_on: DA.ink, reveal_fade: 350,
      reveal_fs_mobile: 24, reveal_fs_desktop: 40, reveal_weight: '700',
      reveal_leading: 124, reveal_max_width: 40,
      body_gap_min: 18, body_gap_max: 28,
      chip_bg: '#3e3a35', chip_bg_hover: DA.ink,
      chip_color: '#ffffff', chip_color_hover: '#ffffff',
      chip_fs_mobile: 13, chip_fs_desktop: 14, chip_pad_y: 10, chip_pad_x: 16,
      chip_gap: 8, chips_max_width: 520,
      bg_color: '', pt_mobile: 40, pt_desktop: 64, pb_mobile: 56, pb_desktop: 96,
    },
  };
};

const accordeon = (c) => {
  const blocks = {}; const order = [];
  c.volets.forEach((v, i) => {
    const k = `s${i + 1}`;
    blocks[k] = {
      type: 'service',
      settings: {
        title: v.titre, marquee_text: v.marquee, image_alt: '',
        description: v.texte, tags: v.tags.join('\n'),
        button_label: '', button_link: '',
      },
    };
    order.push(k);
  });
  return {
    type: 'cc-services-accordeon-defilant', blocks, block_order: order,
    settings: {
      section_aria_label: c.accordeonAria,
      accordion_aria_label: c.accordeonChoix,
      eyebrow: c.accordeonSurtitre, title: c.accordeonTitre,
      marquee_separator: '✣',
      image_placeholder_text: 'Ajoutez une image',
      empty_state_text: "Ajoutez un volet depuis l'éditeur de thème.",
      padding_top_mobile: 72, padding_bottom_mobile: 72,
      padding_top_desktop: 120, padding_bottom_desktop: 120,
      max_width: 1440,
      header_gap_mobile: 18, header_gap_desktop: 22,
      header_bottom_mobile: 48, header_bottom_desktop: 72,
      accordion_bottom_mobile: 54, accordion_bottom_desktop: 80,
      image_width_mobile: 340, image_height_mobile: 240,
      image_width_desktop: 560, image_height_desktop: 340,
      image_radius: 20, image_shadow_opacity: 18,
      body_top_mobile: 26, body_top_desktop: 30,
      body_gap_mobile: 18, body_gap_desktop: 22, description_width: 460,
      marquee_size_mobile: 64, marquee_size_desktop: 150, marquee_duration: 36,
      marquee_top_mobile: 50, marquee_top_desktop: 52,
      marquee_space_mobile: 76, marquee_space_desktop: 96, marquee_faded_opacity: 34,
      eyebrow_size: 14, title_size_mobile: 56, title_size_desktop: 96,
      accordion_size_mobile: 15, accordion_size_desktop: 15,
      description_size_mobile: 15, description_size_desktop: 16,
      tag_size: 12, button_size: 13,
      background_color: DA.fondSombre, text_color: '#111111',
      eyebrow_color: '#6f6f6f', title_color: '#080808',
      inactive_color: '#777777', accent_color: '#ff4b0b',
      divider_color: '#cfcfcf', description_color: '#1a1a1a',
      image_background: '#151515', tag_background: '#666666',
      tag_color: '#ffffff', tag_shadow_opacity: 25,
      button_background: '#111111', button_text_color: '#ffffff',
    },
  };
};

const faq = (c) => {
  const blocks = {}; const order = [];
  c.faq.forEach((q, i) => {
    const k = `q${i + 1}`;
    blocks[k] = {
      type: 'question',
      settings: {
        column: i < Math.ceil(c.faq.length / 2) ? 'left' : 'right',
        question: q.q, answer: q.r, open_by_default: i === 0,
      },
    };
    order.push(k);
  });
  return {
    type: 'cc-faq-accordeon-animee', blocks, block_order: order,
    settings: {
      section_aria_label: c.faqAria, eyebrow: '(FAQ)', title: c.faqTitre,
      subtitle: c.faqSousTitre, close_others: false,
      schema_faq_enable: true,
      padding_top_mobile: 72, padding_bottom_mobile: 72,
      padding_top_desktop: 112, padding_bottom_desktop: 128,
      max_width: 1320, faq_width: 1080, title_width: 900, subtitle_width: 620,
      header_gap_mobile: 14, header_gap_desktop: 18,
      header_bottom_mobile: 46, header_bottom_desktop: 82,
      column_gap_mobile: 14, column_gap_desktop: 28,
      item_gap_mobile: 14, item_gap_desktop: 18,
      item_min_height_mobile: 78, item_min_height_desktop: 88,
      item_padding_x_mobile: 24, item_padding_y_mobile: 22,
      item_padding_x_desktop: 30, item_padding_y_desktop: 26,
      answer_padding_bottom_mobile: 28, answer_padding_bottom_desktop: 34,
      card_radius_mobile: 22, card_radius_desktop: 24, card_border_width: 0,
      shadow_y: 0, shadow_blur: 0, shadow_opacity: 0,
      eyebrow_size_mobile: 13, eyebrow_size_desktop: 14,
      title_size_mobile: 46, title_size_desktop: 84,
      subtitle_size_mobile: 16, subtitle_size_desktop: 18,
      question_size_mobile: 20, question_size_desktop: 24,
      answer_size_mobile: 16, answer_size_desktop: 18, icon_size: 18,
      section_fade_duration: 820, item_duration: 760, stagger_delay: 80,
      slide_distance_mobile: 28, slide_distance_desktop: 70,
      header_offset: 28, fade_blur: 6,
      background_color: DA.fondSombre, text_color: '#111111',
      eyebrow_color: '#6b6b6b', title_color: '#0f0f0f', subtitle_color: '#666666',
      card_background: '#f2f2f2', card_border_color: '#f2f2f2',
      question_color: '#1d1d1d', answer_color: '#6a6a6a',
      icon_background: '#111111', icon_color: '#ffffff',
      icon_open_background: '#111111', icon_open_color: '#ffffff',
    },
  };
};

const contact = (c) => ({
  type: 'cc-contact-natif-shopify',
  settings: {
    section_aria_label: 'Contact',
    back_title: c.contactFond, title: c.contactTitre, subtitle: c.contactTexte,
    email_subject: c.contactObjet,
    name_label: 'Votre nom', name_placeholder: 'Entrez votre nom',
    email_label: 'Votre email', email_placeholder: 'Entrez votre email',
    message_label: 'Votre projet', message_placeholder: c.contactPlaceholder,
    button_label: 'Envoyer', success_message: 'Merci, votre message a bien été envoyé.',
    marquee_text: 'contact@clickscreation.com', marquee_separator: '✦',
    image_opacity: 72, image_blur: 6, image_saturation: 90, image_scale: 104,
    image_bleed: 16, overlay_opacity: 54, side_shadow_opacity: 74, grain_opacity: 18,
    padding_top_mobile: 72, padding_bottom_mobile: 72,
    padding_top_desktop: 88, padding_bottom_desktop: 88,
    max_width: 1620, content_width: 1080, copy_width: 430, form_width: 440,
    panel_min_height_mobile: 680, panel_min_height_desktop: 650,
    panel_padding_x_mobile: 26, panel_padding_y_mobile: 52,
    panel_padding_x_desktop: 96, panel_padding_y_desktop: 92,
    panel_radius_mobile: 24, panel_radius_desktop: 34, panel_border_width: 0,
    panel_shadow_y: 0, panel_shadow_blur: 0, panel_shadow_opacity: 0,
    content_gap_mobile: 38, content_gap_desktop: 110,
    back_title_size_mobile: 78, back_title_size_desktop: 176,
    back_title_top_mobile: 0, back_title_top_desktop: 0, back_title_opacity: 30,
    title_size_mobile: 44, title_size_desktop: 64,
    subtitle_size_mobile: 15, subtitle_size_desktop: 16, subtitle_top: 24,
    label_size_mobile: 15, label_size_desktop: 16,
    input_size_mobile: 14, input_size_desktop: 15,
    button_size_mobile: 14, button_size_desktop: 15, feedback_size: 14,
    field_gap_mobile: 26, field_gap_desktop: 30, label_gap: 14,
    input_height: 40, input_padding_bottom: 10, input_border_width: 1,
    textarea_height_mobile: 110, textarea_height_desktop: 112,
    button_height: 48, button_top: 8,
    marquee_space_mobile: 74, marquee_space_desktop: 82,
    marquee_bottom_mobile: 34, marquee_bottom_desktop: 54,
    marquee_size_mobile: 26, marquee_size_desktop: 36,
    marquee_gap_mobile: 28, marquee_gap_desktop: 40, marquee_duration: 34,
    reveal_duration: 820, reveal_blur: 6,
    panel_reveal_offset: 26, back_title_reveal_offset: 18,
    background_color: DA.fondSombre, text_color: '#ffffff',
    back_title_color: '#bdbdbd', panel_fallback_color: '#0b0b0b',
    panel_border_color: '#161616', panel_text_color: '#ffffff',
    panel_title_color: '#ffffff', panel_muted_color: '#c8c8c8',
    label_color: '#ffffff', input_text_color: '#ffffff',
    placeholder_color: '#bdbdbd', input_border_color: '#ffffff',
    input_focus_color: '#ffffff', button_background: '#eeeeee',
    button_text_color: '#242424', focus_ring_color: '#ffffff',
    success_background: '#e9f8ef', success_color: '#135f32',
    error_background: '#ffecec', error_color: '#8a1f1f',
    marquee_color: '#ffffff', marquee_separator_color: '#ffffff',
  },
});

const showcase = (c) => {
  const blocks = {}; const order = [];
  (c.logos || []).forEach((l, i) => {
    const k = `l${i + 1}`;
    blocks[k] = { type: 'logo', settings: { ...(l.image ? { image: l.image } : {}), alt: l.alt || '', url: '' } };
    order.push(k);
  });
  return {
    type: 'cc-showcase', blocks, block_order: order,
    settings: {
      eyebrow: c.vitrineSurtitre, eyebrow_color: DA.accent,
      title: c.vitrineTitre, title_color: DA.ink,
      image_alt: c.vitrineAlt, placeholder_label: c.vitrinePlaceholder,
      frame_bg: DA.ink, card_bg: '#ffffff', strip_bg: '#ffffff',
      strip_full_width: true, logo_h_max: 63,
      bg_color: '', pt_mobile: 8, pt_desktop: 16, pb_mobile: 24, pb_desktop: 40,
    },
  };
};

const realisations = (c) => {
  const blocks = {}; const order = [];
  c.projets.forEach((p, i) => {
    const k = `p${i + 1}`;
    blocks[k] = {
      type: 'projet',
      settings: {
        title: p.titre, description: p.texte, image_alt: '',
        year: p.annee, role: p.role, services: p.services.join('\n'),
        project_url: '', card_color: ['#111111', '#3a1510', '#181f24'][i % 3],
      },
    };
    order.push(k);
  });
  return {
    type: 'cc-realisations-scroll', blocks, block_order: order,
    settings: {
      section_aria_label: c.projetsAria, eyebrow: c.projetsSurtitre, title: c.projetsTitre,
      background_color: DA.fondSombre,
    },
  };
};

const temoignages = (c) => {
  const blocks = {}; const order = [];
  c.temoignages.forEach((t, i) => {
    const k = `tm${i + 1}`;
    blocks[k] = { type: 'temoignage', settings: { image_alt: '', quote: t.quote, author: t.auteur, role: t.role } };
    order.push(k);
  });
  return {
    type: 'cc-temoignage', blocks, block_order: order,
    settings: {
      eyebrow: c.temoignagesSurtitre, title: c.temoignagesTitre,
      stats_aria_label: c.statsAria, carousel_aria_label: c.temoignagesAria,
      stat_1_value: '26+', stat_1_label: 'Projets finalisés',
      stat_2_value: '98%', stat_2_label: 'Taux de satisfaction client',
      stat_3_value: '10M', stat_3_label: "Chiffre d'affaires généré",
      background_color: DA.fondTemoignage,
    },
  };
};

/* Le tarif suit ce que réclament les acheteurs sur ce marché : un prix
   d'entrée annoncé, un périmètre écrit poste par poste, et un délai de
   réponse. Pas de « sur devis » sans autre indication. */
const tarifs = (c) => ({
  type: 'cc-plans-tarifaires',
  blocks: {
    offre: {
      type: 'plan',
      settings: {
        title: c.tarifTitre,
        description: c.tarifTexte,
        price_prefix: 'À partir de',
        price: c.tarifPrix,
        period: '',
        features: c.tarifLivrables.join('\n'),
        delivery_label: c.tarifDelaiLabel,
        delivery_value: c.tarifDelaiValeur,
        button_label: c.tarifBouton,
        button_link: c.tarifLien,
        icon_text: '✦',
        card_background: '#120602', card_text_color: '#ffffff',
        muted_text_color: '#bba9a0', muted_strong_color: '#e0d1c8',
        delivery_text_color: '#ffffff', delivery_value_color: '#ffffff',
        feature_text_color: '#ffffff', price_color: '#ff5a1f',
        divider_color: '#4d2c20', border_color: '#2a1008',
        icon_background: '#171717', icon_border_color: '#343434',
        check_background: '#624234', check_color: '#ffffff',
        button_background: '#5f514c',
        glow_opacity: 92, texture_opacity: 18, overlay_opacity: 30,
      },
    },
  },
  block_order: ['offre'],
  settings: {
    section_aria_label: c.tarifAria, eyebrow: c.tarifSurtitre, title: c.tarifSectionTitre,
    cards_width: 620, background_color: DA.fondSombre,
  },
});

/* ---------- Assemblage ---------- */
/* Une page ville reste volontairement plus courte qu'une page service :
   cinq sections, pas six. Une landing locale se lit debout, sur un quai. */
function pageVille(c) {
  return {
    sections: { hero: hero(c), bandes: ribbons(c), marche: accordeon(c), faq: faq(c), contact: contact(c) },
    order: ['hero', 'bandes', 'marche', 'faq', 'contact'],
  };
}

/* Une page prestation compose son propre enchaînement : deux pages qui
   partagent la même suite de sections finissent par se ressembler, même avec
   des textes différents. */
const CONSTRUCTEURS = {
  hero, bandes: ribbons, vitrine: showcase, methode: accordeon, perimetre: accordeon,
  realisations, temoignages, tarifs, faq, contact,
};

function pageService(c) {
  const sections = {};
  for (const cle of c.ordre) {
    const f = CONSTRUCTEURS[cle];
    if (!f) throw new Error(`Section inconnue dans l'ordre : ${cle}`);
    sections[cle] = f(c);
  }
  return { sections, order: [...c.ordre] };
}

/* Une famille associe un constructeur au dossier de contenus qui l'alimente.
   « ville-seo » et « ville-site » partagent le même enchaînement de sections
   mais visent deux requêtes distinctes — référencement d'un côté, création de
   site de l'autre. Les contenus restent séparés pour que les deux lignes
   éditoriales ne se contaminent pas. */
const FAMILLES = {
  'ville-seo': { build: pageVille, dossier: 'villes' },
  'ville-site': { build: pageVille, dossier: 'villes-site' },
  'cible-site': { build: pageVille, dossier: 'cibles-site' },
  service: { build: pageService, dossier: 'services' },
};

const famille = process.argv[2] || 'ville-seo';
if (!FAMILLES[famille]) {
  console.error(`Famille inconnue : ${famille} (attendu : ${Object.keys(FAMILLES).join(', ')})`);
  process.exit(1);
}
const { build, dossier: nomDossier } = FAMILLES[famille];

const dossier = path.join(ROOT, 'content', nomDossier);
const fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith('.json'));
if (!fichiers.length) { console.error(`Aucun contenu dans ${dossier}`); process.exit(1); }

/* ---------- Élagage sur les défauts du schema ----------
   Shopify résout section.settings.x sur le défaut déclaré dans le schema
   quand le template ne porte pas la clé. Écrire quatre cents réglages
   identiques dans quarante-cinq fichiers n'apporte donc rien, et fige la
   direction artistique page par page : une retouche devrait alors être
   répercutée quarante-cinq fois. On ne garde que ce qui s'écarte du défaut.
   Le rendu est strictement le même — c'est vérifié en comparant le HTML
   produit avant et après élagage. */
function schemaDefauts(type) {
  const src = fs.readFileSync(path.join(ROOT, 'sections', `${type}.liquid`), 'utf8');
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  const sch = JSON.parse(m[1]);
  const sec = {};
  for (const s of sch.settings || []) if (s.id && 'default' in s) sec[s.id] = s.default;
  const blocs = {};
  for (const b of sch.blocks || []) {
    blocs[b.type] = {};
    for (const s of b.settings || []) if (s.id && 'default' in s) blocs[b.type][s.id] = s.default;
  }
  return { sec, blocs };
}

function elaguer(tpl) {
  for (const sec of Object.values(tpl.sections)) {
    let d;
    try { d = schemaDefauts(sec.type); } catch { continue; }
    for (const [k, v] of Object.entries(sec.settings || {})) {
      if (k in d.sec && JSON.stringify(d.sec[k]) === JSON.stringify(v)) delete sec.settings[k];
    }
    for (const blk of Object.values(sec.blocks || {})) {
      const bd = d.blocs[blk.type] || {};
      for (const [k, v] of Object.entries(blk.settings || {})) {
        if (k in bd && JSON.stringify(bd[k]) === JSON.stringify(v)) delete blk.settings[k];
      }
    }
  }
  return tpl;
}

const lean = !process.argv.includes('--complet');

for (const f of fichiers) {
  const c = JSON.parse(fs.readFileSync(path.join(dossier, f), 'utf8'));
  const sortie = path.join(ROOT, 'templates', `page.${c.suffix}.json`);
  const tpl = build(c);
  /* Écriture compacte et sans saut de ligne final : c'est exactement la forme
     sous laquelle Shopify stocke un gabarit JSON. Le fichier du dépôt et le
     fichier du thème ont ainsi la même empreinte md5, et `git status` suffit
     à savoir si le thème est à jour. Une sortie indentée obligerait à
     recompacter à la main avant chaque téléversement, et la moindre
     reconstruction ferait diverger les deux côtés. */
  fs.writeFileSync(sortie, JSON.stringify(lean ? elaguer(tpl) : tpl));
  console.log(`${path.basename(sortie).padEnd(42)} ${fs.statSync(sortie).size} octets`);
}
