# Outils de contrôle

## `validate-schemas.mjs`

Valide les blocs `{% schema %}` des sections contre les règles documentées par
Shopify, **avant** de pousser le thème. Ces règles ne sont pas toutes couvertes
par Theme Check, qui laisse par exemple passer un `default` interdit sur un
réglage de type `url` — l'erreur n'apparaît qu'à l'enregistrement du fichier
dans l'éditeur de thème.

```bash
node tools/validate-schemas.mjs shopify-theme
```

Contrôles effectués :

- `default` interdit sur les types qui ne l'acceptent pas (`image_picker`,
  `video`, `blog`, `article`, `page`, `product`, `collection`, listes…) ;
- `default` restreint à une liste fermée : `url` n'accepte que `/collections` et
  `/collections/all`, `link_list` que `main-menu` et `footer` ;
- `range` : attributs obligatoires, maximum 101 crans, `(max - min)` divisible
  par `step`, `default` dans les bornes et aligné sur le pas ;
- `select` : `default` présent parmi les options ;
- `checkbox` : `default` booléen ;
- identifiants de réglage dupliqués ;
- `visible_if` pointant vers un réglage inexistant ;
- presets référençant un block ou un réglage non déclaré ;
- `settings.*` utilisé en Liquid mais absent de `config/settings_schema.json`.

Sortie en échec (code 1) dès la première anomalie détectée.
