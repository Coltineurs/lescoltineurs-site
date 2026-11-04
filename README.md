# Site des Coltineurs : lescoltineurs.com (provisoire, en attendant le .fr)

Site statique généré avec [Eleventy](https://www.11ty.dev/) et hébergé sur Netlify.

## Mettre à jour le menu ou la carte des vins

Il n'y a rien à faire dans le code : tout se passe dans le Google Sheet
« Menu Les Coltineurs – Site internet » (onglets **Menu** et **Vins**).

- Une ligne = un plat ou un vin. L'ordre des lignes est l'ordre d'affichage.
- Colonne **Visible** : `oui` pour afficher, n'importe quoi d'autre pour masquer.
- Prix : un nombre (`16,9` → « 16,90 ») ou un texte libre (`12 € / 100 g`).
- Ne pas renommer ni supprimer les colonnes de la première ligne.

Le site relit le Sheet **chaque nuit** (GitHub Action « Reconstruction nocturne »).
Pour publier tout de suite : GitHub → Actions → Reconstruction nocturne → *Run workflow*.

Sécurité : si le Sheet est inaccessible, si une colonne manque ou s'il y a trop peu
de lignes visibles, la construction s'arrête et **l'ancienne version reste en ligne**.

## Modifier les autres informations

Adresse, téléphone, horaires, liens Zenchef, bandeau d'annonce : `src/_data/site.js`.

## Structure

| Dossier / fichier | Rôle |
|---|---|
| `src/*.njk` | Les pages |
| `src/_includes/base.njk` | Gabarit commun (en-tête, pied de page, balises SEO) |
| `src/_data/menu.js`, `vins.js` | Lecture du Google Sheet au build |
| `src/_data/schema.js` | Données structurées « Restaurant » |
| `lib/sheet.js` | Téléchargement et contrôle du CSV |
| `src/static/_redirects` | Redirections des anciennes adresses Squarespace |
| `netlify.toml` | Configuration Netlify |
| `.github/workflows/` | Reconstruction nocturne |
| `recuperation/` | Contenu et images récupérés de l'ancien site (non publiés) |

## En local

```bash
npm install
npx @11ty/eleventy --serve
```
