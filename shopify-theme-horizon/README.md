# Variante Horizon

Ces fichiers sont la version des sections Clickscreation **intégrée au thème
Horizon** de la boutique. Ils diffèrent de `shopify-theme/` sur quatre points,
tous imposés par la cohabitation avec un thème hôte :

1. **`assets/cc-base.css` — reset confiné.** La version autonome pose un reset
   sur `body`, `a`, `button`, `ul` et `img`. Déposée dans Horizon, elle
   repeignait tout le site : liens sans soulignement, boutons sans bordure,
   listes sans puces, sur les fiches produit, les collections et le panier.
   Le reset est désormais enfermé dans les trois racines de section, et le
   fichier porte les jetons de design que le layout d'Horizon ne fournit pas.

2. **`sections/header-clicks.liquid` — `#header-group { display: contents }`.**
   Horizon enveloppe le groupe d'en-tête dans un div haut d'environ 80 px. Un
   élément `position: sticky` ne pouvant pas déborder de son parent, l'en-tête
   se décollait dès le début du défilement.

3. **`sections/header-clicks.liquid` — lien d'évitement optionnel.** Horizon en
   pose déjà un dans son layout ; deux liens consécutifs gênent la navigation
   clavier. Nouveau réglage `show_skip_link`, à décocher dans ce thème.

4. **`sections/heroseo.liquid` et `announcementbadge.liquid` — garde-fou
   d'animation.** Le réglage global `settings.cc_motion` n'existe pas dans
   Horizon : sa valeur était donc nulle, donc fausse, et toutes les animations
   disparaissaient. La condition est inversée — seule une désactivation
   explicite compte.

Les noms de fichiers suivent ceux du thème (`header-clicks`, `heroseo`,
`announcementbadge`), car ce sont eux qui servent de types de section dans
`sections/header-group.json` et `templates/index.json`.
