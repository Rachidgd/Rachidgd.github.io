# Pages « création de site » par ville — ligne éditoriale

Ces pages visent **création de site internet à [ville]**, pas le
référencement. C'est la règle « une page, un mot-clé » : elles ne doivent
jamais reprendre l'angle des pages de `content/villes/`, qui vendent le SEO
dans les mêmes villes. Deux pages sur la même ville, deux requêtes
distinctes, aucun recouvrement rédactionnel.

La cible reste **la PME et l'entreprise en général**. On vend la
prestation — ce qu'elle contient, comment elle se déroule, ce qu'elle coûte.

## Un angle par ville

Six pages qui décrivent la même prestation finissent par se ressembler,
même avec des mots différents. Chacune est donc construite sur une
préoccupation d'acheteur distincte, et son champ sémantique suit :

| Ville | Angle | Champ travaillé |
|---|---|---|
| Lyon | Le devis et son périmètre | cadrage, chiffrage, livrables, propriété |
| Marseille | La refonte d'un site vieillissant | refonte, migration, redirections, reprise |
| Lille | Le délai de dix jours | planning, étapes, mise en ligne, prise en main |
| Nice | Le mobile et la vitesse | affichage, chargement, réservation, tactile |
| Nantes | La propriété et l'autonomie | accès, domaine, interface, sans engagement |
| Strasbourg | Le site qui déclenche des demandes | clarté, preuve, formulaire, mesure |

C'est ce qui donne le maillage sémantique large demandé, sans répéter
« création de site internet » à chaque paragraphe.

## Tarifs affichés

900 € pour un site vitrine, 1 500 € pour une boutique en ligne. Les deux
montants apparaissent en FAQ, formulés différemment sur chaque page. Toute
modification tarifaire se répercute ici **et** dans `content/services/`.

## Délai de livraison

**Une dizaine de jours**, site vitrine comme boutique en ligne. C'est un
argument fort et il est écrit à trois endroits : la page de Lille, qui est
bâtie dessus, et la FAQ des deux pages prestation. Toute révision de ce
délai doit passer par les trois, sans quoi le site se contredit lui-même.

Le chiffre est annoncé comme un rythme courant, jamais comme une garantie
contractuelle : la page dit explicitement qu'il suppose un client
disponible pour valider. C'est ce qui le rend tenable.

## Contrôles

    node tools/build-pages.mjs ville-site
    node tools/check-duplicates.mjs

Le second refuse toute phrase de plus de quarante caractères partagée avec
une autre page du thème, pages SEO comprises.
