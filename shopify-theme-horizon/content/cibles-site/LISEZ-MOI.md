# Pages « site vitrine » par cible — ligne éditoriale

Quatre déclinaisons de la prestation « Création de site vitrine », qui est
au menu principal. Elles ne s'adressent pas à une ville mais à un **type de
client**, et visent les requêtes correspondantes : *site vitrine PME*,
*site internet freelance*, *création site restaurant*, *site internet
artisan*.

## Pourquoi elles existent

Les quatre pages étaient **publiées et vides** : leur suffixe de gabarit
— `site-vitrine-pme-tpe`, `-freelance`, `-restaurant`, `-artisan` — ne
correspondait à aucun fichier du thème. Elles retombaient sur le rendu
générique et n'affichaient rien.

## Un angle par cible

| Cible | Ce qui décide l'achat | Champ travaillé |
|---|---|---|
| PME et TPE | Personne n'a le temps en interne | charge de travail, crédibilité B2B, autonomie |
| Indépendant | Être choisi plutôt que comparé | positionnement, preuve, filtrage des demandes |
| Restaurant | Carte, table, fiche Google | carte à jour, réservation directe, commissions |
| Artisan | La confiance avant le devis | chantiers montrés, zone d'intervention, photos |

Aucune ne recoupe les pages ville de `content/villes-site/` : celles-là
visent une commune, celles-ci une profession. Le contrôle de duplication
couvre les deux familles ensemble.

## Ce qui n'est pas dit ici

Le tarif est rappelé en FAQ sur chacune, formulé selon la cible — un
artisan compare à un chantier, un indépendant à ses abonnements de
plateforme. Le délai de dix jours n'est **pas** repris ici : il est porté
par la page de Lille et par les deux pages prestation, et l'ajouter sur
quatre pages de plus le rendrait impossible à réviser sans oubli.

## Contrôles

    node tools/build-pages.mjs cible-site
    node tools/check-duplicates.mjs
