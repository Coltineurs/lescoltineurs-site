# Proposition de structure : nouveau site lescoltineurs.fr

Domaine principal : `https://lescoltineurs.fr`, sans « www ». Le « www » redirige en 301 vers lui. Ce choix est à confirmer : on peut garder « www » si vous préférez, il suffit de s'y tenir partout.

## Pages

| URL | Page | Contenu | Rôle pour le référencement |
|---|---|---|---|
| `/` | Accueil | Accroche « Une cuisine de bistrot français », bouton Réserver (Zenchef), texte de présentation, 3–4 photos, horaires, adresse avec plan, téléphone, lien Instagram | Restaurant (JSON-LD complet), page principale |
| `/menu/` | Menu | Généré depuis le Google Sheet : Catégorie → Sous-catégorie → Plat, Détail, Prix ; uniquement les lignes Visible = oui ; date de mise à jour | `Menu` / `MenuSection` / `MenuItem` reliés au Restaurant (`hasMenu`) |
| `/carte-des-vins/` | Carte des vins | Texte sur les petits vignerons, puis la carte en vrai texte générée depuis l'onglet « Vins » du Sheet : Catégorie → Région → Secteur → vin, avec un sommaire cliquable (Bulles, Macérations, Rosés, Blancs, Rouges, Magnums) | Page indexable, `Menu` JSON-LD dédié |
| `/privatisation/` | Privatisation & groupes | Privatisation les dimanches et lundis, à partir de 1 500 €, capacité, photos de la salle, bouton Zenchef « privatisation », contact nicolas@ | Cible les recherches « privatiser restaurant Paris 16 » |
| `/rejoindre-l-equipe/` | Recrutement | Texte actuel et formulaire (nom, email, message, CV), avec Netlify Forms et pièce jointe | |
| `/mentions-legales/` | Mentions légales | Éditeur, hébergeur (Netlify), contact. Obligatoire en France, absent aujourd'hui | `noindex` |
| `/404.html` | Page introuvable | Liens vers l'accueil, le menu, la réservation | |

**Sur toutes les pages** : une en-tête avec logo, navigation et bouton « Réserver » toujours visible. Le pied de page reprend l'adresse, les horaires, le téléphone, Instagram et les mentions légales. Un bandeau d'annonce facultatif sert aux ouvertures exceptionnelles, comme la fête des mères. Il est modifiable sans toucher au code, voir question 3.

## Redirections 301 (`_redirects` Netlify)

```
https://www.lescoltineurs.fr/*   https://lescoltineurs.fr/:splat   301!
https://lescoltineurs.com/*      https://lescoltineurs.fr/:splat   301!   # seulement si le .com pointe un jour vers Netlify
/home        /                      301
/team-4      /rejoindre-l-equipe/   301
/cart        /                      301
```
Après la bascule, vérifier dans Google Search Console les autres URL indexées (`?format=…`, `/s/…`) et les ajouter si besoin.

## Fonctionnement technique

- **Générateur** : Eleventy (11ty). Les pages sont du HTML simple et le menu est récupéré du Sheet au moment du build.
- **Sheet → site** : le Sheet est publié en CSV (lecture seule). Au build, on télécharge le CSV, on filtre `Visible`, on regroupe par catégories et on écrit le HTML et le JSON-LD. Si le CSV est indisponible ou vide, le build échoue et l'ancienne version reste en ligne, donc jamais de menu vide.
- **Rebuild chaque nuit** : une GitHub Action planifiée (par exemple 4h, heure de Paris) appelle un « build hook » Netlify. Un bouton « Mettre à jour maintenant » (lien vers le hook) est aussi possible pour l'équipe.
- **Zenchef** : simple lien vers `bookings.zenchef.com/results?rid=358317`, ou le widget officiel en surcouche, à choisir.
- **Images** : converties en WebP/AVIF en plusieurs tailles, avec `alt` descriptifs.
- **DNS** : chez Online/Scaleway, on modifie seulement les enregistrements A/ALIAS et CNAME du `.fr` vers Netlify. Le `.com` (IONOS, mails) n'est pas touché, ses MX non plus.

## Questions à trancher

1. ~~Carte des vins~~ : décidé, elle passe par le Sheet (voir ci-dessous).
2. **Version anglaise** : utile pour le XVIe et les touristes ? (`/en/`, à faire plus tard si oui)
3. **Bandeau d'annonce** : faut-il le piloter depuis une ligne du Google Sheet ?
4. **Privatisation** : quelle capacité (assis / debout) et quelles formules à afficher ?
5. **Photos** : il n'y en a que 4 utilisables, dont 2 en 1080 px. Avez-vous d'autres photos en haute définition (plats, salle, équipe, façade) ? Il faudrait aussi le logo en vectoriel (SVG/PDF).

## Google Sheet : deux onglets

**Onglet « Menu »** (renommé depuis « Untitled » le 4 novembre 2026) : Catégorie, Sous-catégorie, Plat, Détail, Prix, Visible.
- Le prix est un nombre (`9`, `16,9`) affiché « 16,90 € », ou un texte libre recopié tel quel (`12 € / 100 g`).
- Seules les lignes où Visible = « oui » sont publiées. L'ordre des lignes dans le Sheet est l'ordre d'affichage.

**Onglet « Vins »** (nouveau), pré-rempli depuis la carte Slides actuelle avec 119 vins (`recuperation/vins.csv`) :

| Colonne | Exemple | Remarque |
|---|---|---|
| Catégorie | Blancs | Bulles, Macérations, Rosés, Blancs, Rouges, Magnums |
| Région | Loire | Pour les magnums : Rosé / Blanc / Rouge |
| Secteur | Anjou-Saumur | Facultatif |
| Domaine | Arnaud Lambert | |
| Cuvée | Saumur “Brézé Midi” | |
| Appellation | AOC Saumur | |
| Cépages | 100% Chenin | |
| Millésime | 2024 | Facultatif |
| Détail | 4 jours de macération | Facultatif |
| Contenance | 150 cl | Vide = 75 cl |
| Prix | 45 | Prix de la bouteille |
| Visible | oui | |

Une colonne « Prix verre » pourra être ajoutée si des vins sont servis au verre.
Mention en bas de page : « Prix nets en euros, service compris, bouteilles de 75 cl sauf mention. Liste des allergènes disponible sur demande. »

Les deux onglets sont publiés en CSV (Fichier → Partager → Publier sur le web) et lus au build de chaque nuit.
