# Mise en ligne — ce qui reste à faire

Ce document recense ce qui ne peut pas être fait depuis le dépôt : décisions
commerciales, contenus réels à fournir, et actions dans l'admin Shopify.
Le thème de travail est **Horizon** (`202936058186`), non publié.

## 1. Redirections à créer

Cinq pages publiées font doublon avec une page qui les remplace. Elles
diluent le mot-clé sans rien apporter.

| Page à retirer | Vers | Pourquoi |
|---|---|---|
| `/pages/agence-seo` | `/` | Le menu pointe déjà « Agence SEO » sur l'accueil, qui traite ce mot-clé. |
| `/pages/seo` | `/` | Même requête que l'accueil. Corps d'une seule phrase. |
| `/pages/creation-de-site` | `/pages/creation-site-vitrine` | Même requête. Corps d'une seule phrase. |
| `/pages/shopify` | `/pages/agence-shopify` | Même requête. Corps d'une seule phrase. |
| `/pages/ressources` | `/blogs/ressources` | Double le blog, qui est au menu. |

**Ces cinq pages n'ont aucun mot-clé positionné** (relevé Semrush, base FR).
Les retirer ne coûte donc aucune visibilité acquise.

Marche à suivre pour chacune : dépublier la page, puis créer la redirection
301 dans *Boutique en ligne → Navigation → Redirections d'URL*. Une
redirection créée avant la dépublication reste inerte : la page existante
l'emporte.

### Ce que ces cinq pages cassent aujourd'hui

Quatre d'entre elles — `seo`, `creation-de-site`, `shopify`, `ressources` —
n'ont **ni `title_tag` ni `description_tag`**. Le thème applique alors son
repli (`snippets/meta-tags.liquid`) :

```liquid
assign og_description = page_description | default: shop.description | default: shop.name
```

Résultat : ces quatre pages **n'émettent aucune meta description**, et leur
`og:description` est celle de la boutique — strictement la même que celle de
l'accueil. **Cinq URL publiées partagent donc une `og:description`
identique.** La redirection règle le problème à la racine ; leur ajouter des
métadonnées reviendrait à soigner des pages destinées à disparaître.

## 2. Balises title à retoucher

Trois paires de pages publiées visent la même requête par leur `title_tag`.
Aucune de ces pages n'a de mot-clé positionné (relevé Semrush), la retouche
est donc sans risque.

| Page | Title actuel | Problème |
|---|---|---|
| `site-vitrine-pme-tpe` | `Création de site vitrine PME & TPE \| Clickscreation` | Ouvre sur « Création de site vitrine », comme sa page mère `creation-site-vitrine`. Le H1 les distingue déjà : c'est le title qui empiète. |
| `seo-par-ville` | `SEO par ville \| Le référencement local, ville par ville` | Vise « référencement local » comme la page prestation `seo-local`. Cette page est un index, son title devrait le dire. |
| `reserver` | `Réserver mon audit SEO offert \| Clickscreation` | Vise « audit SEO » comme `audit-seo`. C'est une page de conversion en bout de tunnel, elle n'a pas à cibler une requête. |

## 3. Description de la boutique

`shop.description` commence par « Clickscreation, agence acquisition **à
Paris** ». Elle alimente l'`og:description` de toutes les pages sans
métadonnées propres. Comme le H1 de l'accueil ne vise plus la requête
parisienne — elle appartient à `/pages/consultant-seo-paris` — cette mention
mérite d'être revue en même temps.

## 4. Contenus réels à fournir

- **Témoignages.** Six témoignages sont des placeholders : Julien Marchand,
  Sarah Nguyen et Thomas Rivière sur la page Boutique Shopify ; Ethan Moore,
  Camille Laurent et Nadia Benali sur l'accueil. **À remplacer avant
  publication** — un témoignage inventé est un risque juridique autant qu'un
  risque de réputation.
- **Page « Résultats »** (`/pages/resultats`). Publiée, vide, et sans
  gabarit. Elle demande des chiffres clients réels : rien n'a été écrit
  plutôt que d'inventer des performances. Trois options : fournir les
  chiffres, dépublier la page, ou la rediriger vers l'accueil.

## 5. Réglages à changer dans l'éditeur de thème

Trois valeurs figées à l'insertion des sections, sur la page d'accueil :

| Section | Réglage | Actuel | À mettre |
|---|---|---|---|
| Vitrine | `strip_bg` | `#f0eeec` | `#ffffff` |
| Vitrine | `pt_desktop` | `80` | `16` |
| Hero | `pb_desktop` | `120` | `48` |

## 6. Actions dans l'éditeur de code

- **Supprimer `snippets/cc-probe.liquid`** (64 octets). C'est une sonde de
  diagnostic laissée pendant la mise au point. L'API interdit la suppression
  de fichiers de thème : elle doit se faire à la main dans l'éditeur de code.

## 7. Pages à publier

- **`/pages/agence-seo-bruxelles`** a été créée non publiée, volontairement.
  À publier au moment de la mise en ligne.

## 8. Ne pas toucher

- **`/pages/agence-seo-luxembourg`** : la page se positionne, son texte
  reste tel quel et son gabarit pointe volontairement sur le rendu générique.

## 9. Point de vigilance repéré

Les cibles tactiles du formulaire de contact mesurent 40 px de haut, et le
lien « Nous contacter » de l'en-tête 39 px. C'est conforme au WCAG 2.2 AA
(minimum 24 px) mais en dessous du repère de 44 px recommandé sur mobile.
C'est **identique sur toutes les pages du site**, y compris celles livrées
avant cette refonte : c'est un choix de maquette, pas un défaut introduit
ici. Un `min-height: 44px` sur les champs le corrigerait, au prix d'un écart
avec les maquettes validées.
