# Clickscreation — thème Shopify

Refonte du site clickscreation.com. Livraison par lots ; ce dépôt contient le
socle du thème et les sections validées.

---

## Lot 1 — En-tête et hero (livré)

| Fichier | Rôle |
|---|---|
| `sections/announcement-badge.liquid` | Pastille de statut suspendue au bord haut |
| `sections/header.liquid` | Barre de navigation, menu déroulant, panneau mobile, données structurées de site |
| `sections/hero-seo.liquid` | Hero d'accueil : H1 composable, bulles animées, preuve sociale, CTA, balisage Service |
| `sections/header-group.json` | Groupe de sections de l'en-tête |
| `templates/index.json` | Page d'accueil |
| `layout/theme.liquid` | Squelette, tokens de design, chargement des polices |
| `assets/cc-base.css` | Design system : reset, échelle fluide, conteneur, bouton, média rond, accessibilité |
| `assets/cc-header.js` | État collant, panneau mobile accessible, accordéons |
| `snippets/cc-round-image.liquid` | Média circulaire réutilisable (bulles, portraits) |
| `config/settings_schema.json` | Couleurs, typographie, mise en page, animations |

**Trois sections distinctes, jamais fusionnées.** Chacune embarque son CSS scopé
sur son identifiant de section : aucune ne peut casser les autres, et chacune
peut être reprise, dupliquée ou retirée isolément.

---

## Ce qui est pilotable depuis l'éditeur de thème

Aucune chaîne de caractères visible n'est écrite en dur — libellés, textes,
intitulés de boutons, textes alternatifs, nom accessible du menu, lien
d'évitement compris.

Sont également réglables sans toucher au code :

- **toutes les tailles de police**, avec une valeur mobile et une valeur desktop
  distinctes pour chaque élément (logo, liens, bouton, titre, sous-titre,
  pastille, panneau mobile) ;
- le **point de bascule du menu mobile** (767 / 1023 / 1199 px) ;
- le **diamètre des bulles**, leur espacement, leur décalage vertical, leur
  liseré, et pour chacune son amplitude, son inclinaison et sa durée de
  flottement ;
- la composition du H1 : segments de texte, couleurs, bulles et retours à la
  ligne se réorganisent par glisser-déposer ;
- couleurs, graisses, rythme vertical, largeurs maximales, arrondis.

### Le titre H1 est composable

Trois types de blocks se combinent librement dans l'éditeur :

- **Segment de texte** — un mot ou groupe de mots, avec sa couleur (principal,
  secondaire, accent, clair, ou personnalisée) ;
- **Bulle** — une image circulaire insérée dans le fil du titre ;
- **Retour à la ligne** — pour maîtriser la découpe typographique.

### Les bulles

C'est la **bulle qui impose son diamètre, jamais l'image**. Double garantie :
recadrage carré côté CDN Shopify (`crop: 'center'`, ou point focal défini dans
Contenu › Fichiers) puis `object-fit: cover` côté CSS. Vérifié en injectant une
image 600×200 volontairement panoramique : le cercle reste parfait.

L'animation n'agit que sur `transform` — translation et légère inclinaison,
**jamais d'échelle**. Le diamètre ne varie pas d'un pixel et le texte
environnant ne bouge pas : mesuré à 0 px de dérive sur les quatre largeurs
testées. Elle s'arrête pour les visiteurs ayant demandé une réduction des
animations (`prefers-reduced-motion`).

---

## Décisions d'architecture

**La pastille de statut est une section à part.** Un élément `position: sticky`
ne peut pas déborder de son parent. Logée dans la même section que la barre de
navigation, celle-ci se serait décollée du haut de l'écran après ~35 px de
défilement. C'est aussi le découpage canonique Shopify (announcement-bar +
header dans un même *section group*).

**CSS scopé inline plutôt que fichiers d'assets.** L'en-tête et le hero sont
au-dessus de la ligne de flottaison : une feuille externe ajouterait une requête
bloquante avant le premier rendu. Et une media query ne pouvant pas lire une
variable CSS, seul le Liquid permet de rendre le point de bascule réellement
configurable. Le socle partagé (`cc-base.css`) reste, lui, en asset mis en cache.

**Pas de Tailwind.** Le CDN Tailwind est bloquant au rendu et pèse une centaine
de kilo-octets avant toute personnalisation ; la version compilée impose une
chaîne de build qu'un thème Shopify ne peut pas maintenir côté marchand. Le
choix retenu — CSS natif, propriétés personnalisées, `clamp()` fluide — sert
mieux les Core Web Vitals et reste modifiable directement dans l'admin.

**Typographie fluide sans palier.** Chaque taille est interpolée entre une borne
mobile (390 px) et une borne desktop (1440 px), et se fige au-delà. La tablette
est donc juste par construction, sans media query dédiée. Mesuré : le H1 passe
de 34 px à 390 px, à 43,4 px à 768 px, 49,7 px à 1024 px et 60 px à 1440 px.

**Performance.** Aucune dépendance externe. Un seul fichier JS de 5 ko en
`defer`, qui ne pilote que l'état collant, le panneau mobile et les accordéons —
le menu déroulant desktop fonctionne en CSS pur et reste utilisable si le script
échoue. Police des titres préchargée (`preload` + `font-display: swap`).
Dimensions d'images explicites partout : zéro décalage de mise en page.

---

## Données structurées

| Section | Entité | Portée |
|---|---|---|
| En-tête | `Organization` / `ProfessionalService` / `LocalBusiness` (au choix) | Site entier, `@id` stable |
| En-tête | `WebSite` + `SearchAction` optionnelle | Site entier |
| Hero | `Service` + `OfferCatalog`, rattaché au `@id` de l'entreprise | Page d'accueil |

Les entités se répondent par leur `@id` au lieu de se dupliquer. Chaque
propriété n'est émise que si elle est renseignée : rien n'est inventé, rien
n'est émis à vide. Validé : les trois blocs JSON-LD se parsent sur les quatre
largeurs testées.

---

## À faire dans l'admin Shopify

1. **Vérifier le menu** `main-menu` (Boutique en ligne › Navigation). L'en-tête
   consomme le menu réel du site : les intitulés et URL s'y modifient, et un
   niveau de sous-menu est pris en charge.
2. **Vérifier la destination des boutons.** Deux CTA pointent par défaut vers
   `/pages/contact` : confirmer que la page existe avant mise en ligne.
3. **Charger le logo** (SVG ou PNG transparent). À défaut, le logo texte
   « Clickscreation. » s'affiche.
4. **Remplacer les portraits de la preuve sociale** par de vraies photos de
   clients, avec leur accord. Tant qu'il n'y en a pas, mieux vaut vider le champ
   que d'y mettre de la banque d'images.
5. **Charger les trois images de bulles** et le visuel flottant. Définir leur
   point focal dans Contenu › Fichiers si le sujet n'est pas centré.
6. **Compléter les données structurées** de l'en-tête : raison sociale, adresse,
   téléphone, e-mail, profils sociaux.
7. **Choisir la police.** Poppins est le réglage par défaut, le plus proche de
   la maquette dans la bibliothèque Shopify. Si la marque possède une licence
   pour la fonte exacte de la maquette, elle se substitue dans Typographie.

---

## Points signalés

- **La longueur du H1 diffère de la maquette.** La maquette porte une accroche
  anglaise courte ; la version française est plus longue, donc les lignes sont
  plus larges. La structure est identique — trois lignes, une bulle par ligne,
  composition centrée, mêmes rôles de couleur. Pour resserrer : `Taille du titre
  — desktop` et `Largeur maximale du titre`.
- **Le bouton d'en-tête mesure 39 px de haut en desktop**, comme sur la maquette.
  Conforme au critère WCAG 2.5.8 (24 px minimum) ; il passe à 44 px sous le point
  de bascule, où l'entrée est tactile.
- **Theme Check remonte deux avertissements `ExcessiveSettingsCount`.** C'est la
  conséquence directe de l'exigence « tout modifiable, tailles de police
  comprises ». La règle vise les soumissions au Theme Store, pas un thème sur
  mesure. Les réglages sont regroupés par intertitres dans l'éditeur.
- **Le thème n'est pas encore importable seul** : les templates obligatoires
  (produit, collection, page, blog, panier, 404…) arrivent avec les lots
  suivants. Les trois sections sont en revanche utilisables immédiatement dans
  le thème en production.

---

## Contrôles passés

Theme Check : **0 erreur**. Rendu réel des fichiers Liquid via un moteur Liquid,
puis audit automatisé sous Chromium à 390 / 768 / 1024 / 1440 px :

- débordement horizontal : 0 px partout ;
- un seul H1, texte correctement espacé y compris quand les retours à la ligne
  sont neutralisés sur mobile ;
- bulles parfaitement circulaires depuis une source 600×200 ;
- diamètre des bulles et position du texte : 0 px de variation pendant
  l'animation, aucune propriété `scale` dans les keyframes ;
- aucun chevauchement entre logo, actions, titre, sous-titre et bouton ;
- cibles tactiles conformes ;
- navigation clavier : lien d'évitement révélé au premier Tab, focus déplacé
  dans le panneau à l'ouverture, focus piégé, Échap referme et rend le focus au
  bouton d'origine ;
- trois blocs JSON-LD valides.

---

## Lots suivants

Sections de la page d'accueil (problème/solution, services, méthode, preuves,
FAQ balisée, CTA final), pied de page, pages de silo SEO, pages locales
(Paris, Nice, Luxembourg), blog, pages légales, templates e-commerce.
