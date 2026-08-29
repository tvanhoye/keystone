# Brief pour l’agent Foundation — porter les écarts HTML → keystone.batiq.eu

> **À coller tel quel** dans un Cloud Agent ouvert sur le repo **`tvanhoye/foundation`**
> (app `apps/keystone`, prod `https://keystone.batiq.eu`, footer actuel **v2.0.50**).
>
> Ce fichier vit aussi dans le repo public HTML :
> https://raw.githubusercontent.com/tvanhoye/keystone/main/FOUNDATION_PORT_BRIEF.md
> (ou la branche `cursor/foundation-brief-e846` tant que le merge n’est pas fait).

---

## 0. Contexte — ne pas se tromper de repo

Il existe **deux apps Keystone**. Des agents ont déjà implémenté 2–3 fois des features
sur le **mauvais** repo (HTML public). Toi tu travailles sur **foundation**.

| | Proto HTML (déjà fait) | App réelle (toi) |
|---|---|---|
| Repo | `tvanhoye/keystone` **public** | `tvanhoye/foundation` **privé** |
| App | `index.html` mono-fichier | `apps/keystone` Next.js |
| Prod | https://tvanhoye.github.io/keystone/ | https://keystone.batiq.eu |
| Version | footer **v2.32** (SHA `594827f`) | footer **v2.0.50** |
| Données | localStorage + Google Drive | Prisma / auth / multi-tenant |

**Source de spec (lecture seule, pas de clone nécessaire) :**
- App live HTML : https://tvanhoye.github.io/keystone/
- Changelog HTML : https://raw.githubusercontent.com/tvanhoye/keystone/main/CHANGELOG.md
- État : https://raw.githubusercontent.com/tvanhoye/keystone/main/PROJECT_STATE.md
- Code Annonces + EDL : https://github.com/tvanhoye/keystone/blob/main/index.html
  - Annonces : chercher `page-annonces`, `openAnForm`, `anPublicUrl`, `anPublicMarkup`
  - EDL : chercher `ÉTATS DES LIEUX PHOTOGRAPHIQUES`, `edlBlank`, `edlAddPhoto`, `edlGenWord`

**Ne copie pas** l’archi HTML (localStorage `ig3_*`, Drive, hash `#a=`, IndexedDB).
Réimplémente dans les patterns Foundation (Prisma, routes App Router, Blob / storage
existant, RLS / org, sidebar owner, espace locataire déjà en place).

**Bump de version Foundation** (pas 2.32) : incrémente le footer Keystone
`2.0.50` → `2.0.51` (ou `2.1.0` si tu juges le lot majeur). Suit le ritual
`chore(keystone): version …` déjà utilisé.

---

## 1. Méthode obligatoire : check → apply

Pour **chaque** item ci-dessous :

1. Cherche dans `apps/keystone` (routes, sidebar, Prisma, i18n).
2. Si **déjà présent et équivalent** → coche `[skip]` + 1 phrase (où c’est).
3. Si **absent ou incomplet** → implémente, teste, bump version **une seule fois** à la fin.
4. Ne réécris pas un module Foundation qui marche déjà « parce que le HTML le fait autrement ».

Vérifie aussi en prod (connecté) : sidebar owner, fiche logement, documents, étude de cas.

---

## 2. P0 — à porter (confirmé ABSENT de keystone.batiq.eu v2.0.50)

Scan JS prod du 2026-08-29 : **zéro** occurrence de `Annonce`, `annonce`, `EDL`,
`état des lieux`, `Matterport`, `Kuula`. Ces deux modules n’existent pas en ligne.

### P0-A. Annonces de location (HTML v2.32)

**Besoin utilisateur (dictée vocale d’origine) :** onglet sidebar pour créer une
**annonce de location** (photos + une vidéo + « une sphère » = visite 360°),
envoyer le lien à un amateur (WhatsApp, e-mail…), et sur le lien public : toutes
les photos, la vidéo, un descriptif **repris de la fiche logement**, plus un
bandeau qui pousse l’**espace locataire Keystone**.

#### UI owner

- Item sidebar **Annonces** sous Gestion, à côté de Logements (icône 📣).
- Page liste : cartes (cover, titre, adresse, loyer CC, chips Vidéo / 360° / Photos).
- Actions : Partager · Aperçu · Éditer · Supprimer.
- Bouton **＋ Nouvelle annonce**. Rôles lecture / `canAdd=false` : pas de création.
- Empty state : « Créez-en une à partir d’une fiche logement… »

#### Formulaire

| Champ | Règle |
|---|---|
| Logement * | Select des logements de l’org. Au changement : auto-titre = `nom` du logement, auto-descriptif = formule ci-dessous **seulement si** le champ est encore vierge / flag autofill. |
| Titre public | Éditable. |
| Descriptif | Prérempli depuis la fiche, éditable. |
| Photos | Max **12**. File picker + drag-and-drop. Compresser JPEG (HTML : max côté 1400 px, q 0.72, plafonner ~900 Ko). |
| Vidéo | URL YouTube / Vimeo / https (mp4/webm) — **pas** d’upload vidéo dans le proto. |
| Sphère 360° | URL embed (Matterport, Kuula, Momento, Google Maps, 3DVista, Panoskin, Roundme) **ou** image panoramique jpg/png/webp. |
| Tél / e-mail | Optionnels, visibles sur la page publique. |

**Formule descriptif auto** (`anDescFromLg`) :

```
{type} · {surf} m²

Loyer {loyer} €/mois hors charges. Charges : {ch} €/mois. Garantie locative : {dep} €.

{contenu}   ← champ « Contenu / description » de la fiche logement
```

Omettre les morceaux vides. Adresse publique = `logement.addr` sinon `bâtiment.addr`.

#### Page publique (sans compte)

- Route propre, ex. `/a/[slug]` ou `/annonce/[id]` — **pas** un hash `#a=` (limite WhatsApp).
- Si beaucoup de photos : **ne pas** tout mettre dans l’URL. Storage (Vercel Blob / S3 déjà utilisé) + snapshot serveur.
- Fallback HTML téléchargeable si le lien devient trop long (le proto le fait).
- Contenu : brand Keystone, titre, adresse (+ nom bâtiment), loyer CC, galerie + lightbox, facts (type, surface, HC, charges, CC, garantie), descriptif, embed vidéo, embed/image 360°, CTA Appeler / Écrire, **bandeau promo espace locataire** → `https://keystone.batiq.eu/` (idéalement `/inscription-locataire` ou la landing locataire déjà existante).
- Embed YouTube via `youtube-nocookie.com`. Iframes `allowfullscreen`.
- Guest : pas de chrome owner (sidebar, login).

#### Partage

Copier le lien · WhatsApp (`wa.me/?text=`) · mailto · SMS · `navigator.share` ·
télécharger un HTML standalone · aperçu interne.

Texte type : `Voici l'annonce de location pour {titre} :\n{url}`

#### Modèle (inspiration, à mapper Prisma)

```
Annonce {
  id, slug, orgId, logementId,
  titre, desc,
  photos[] { id, url, order },
  videoUrl, sphereUrl,
  contactTel, contactEmail,
  createdAt, updatedAt
}
```

Permissions : voir Annonces pour owner/gestionnaire ; locataire **non**.

#### Critères de « fait » P0-A

- [ ] Onglet Annonces visible une fois connecté en owner.
- [ ] Création depuis un logement existant, photos + URL vidéo + URL 360°.
- [ ] Lien public ouvrable **sans login** (y compris téléphone).
- [ ] WhatsApp / e-mail / copie / HTML.
- [ ] Bandeau espace locataire présent.
- [ ] Lecture seule / rôle sans add : pas de « Nouvelle annonce ».

---

### P0-B. États des lieux photographiques (HTML v2.31)

**Besoin :** dossier photos/vidéos **attaché au logement** (créable **avant** d’avoir
un locataire), entrée **et** sortie, pièce par pièce, transfert vers locataire ou
candidat, aperçu HTML/PDF, Word EDL existant prérempli depuis les notes.
L’outil Word historique (📋 génération documents) **reste**.

#### UI

- Item sidebar **États des lieux** (📷), à côté de Logements / Annonces.
- Filtres : Tous · Entrée · Sortie · Brouillons.
- Liste : logement, badge entrée/sortie, brouillon/prêt, date, locataire ou
  « modèle du logement », nb de visuels, 4 miniatures, dupliquer, supprimer.
- Depuis fiche **logement** : bouton « Ouvrir / créer l’EDL photographique ».
- Depuis fiche **locataire** : ouvrir l’EDL rattaché, sinon le modèle du logement,
  sinon en créer un (entrée si bail actif, sinon sortie).

#### Éditeur

Métadonnées : logement *, type entrée/sortie, date, locataire optionnel,
clés/accès (prérempli depuis `logement.cles` si vide), détecteurs de fumée,
docs d’entretien, compteurs (élec HP/HC, gaz, eau, mazout %), conclusion.

**Pièces par défaut :**

```
Entrée / Hall
Séjour – Salle à manger
Cuisine
Chambre 1
Chambre 2
Salle de bain
WC
Autres pièces (couloirs, cave, grenier, garage)
Extérieurs (terrasse, jardin, façade)
```

Par pièce : nom éditable, notes (sols, murs, équipements, dégâts, propreté),
médias + légende, boutons **Photo (caméra)** / **Galerie** / **Vidéo (caméra)** /
**Fichier vidéo**. Ajouter / supprimer une pièce.

Statut : `brouillon` si 0 média, sinon `prêt`. Autosave.

#### Médias (adapter au storage Foundation)

- Photos : compresser (HTML : full 1600 px q 0.72, thumb 280 px q 0.55).
- Vidéos : max ~40 Mo ; stocker le fichier + miniature (frame ~0.3 s).
- **Originaux hors JSON** : Blob / object storage. Les thumbs peuvent rester
  en base pour la liste. Ne pas pousser les originaux dans un export JSON.
- Lightbox : original si présent, sinon thumb + message « original absent ».

#### Actions

1. **Aperçu photos** — HTML imprimable (2 colonnes, mention décret RW 15/03/2018 art. 27) : bien, bailleur, preneur, date, clés, détecteurs, docs, compteurs, pièces + photos/vidéos, conclusion. Télécharger HTML ; l’user imprime en PDF.
2. **Document Word** — réutiliser le générateur EDL Foundation s’il existe. Préremplir `edl.conclusion` avec conclusion + résumé pièces (`Pièce : notes (N visuels)` + ligne compteurs). Si pas de locataire : Word quand même, preneur à compléter, e-mail désactivé.
3. **Transférer** — rattacher un locataire du même logement **ou** e-mail libre (candidat). Crée un document type « état » lié. Télécharge le HTML photos + ouvre Gmail / mailto pour joindre le fichier.
4. **Dupliquer** — copie pour le prochain locataire (nouveau id, `lcId` vide, type entrée, médias recopiés côté storage).

#### Modèle (inspiration)

```
Edl {
  id, orgId, logementId, locataireId?,
  type: 'entree'|'sortie', date, status: 'brouillon'|'pret',
  cles, detecteurs, docsEntretien, conclusion,
  meters: { elecHP, elecHC, gaz, eau, mazout },
  rooms: [{ id, name, notes, media: [{ id, kind, url, thumbUrl, caption, mime, w, h, bytes }] }],
  createdAt, updatedAt
}
```

Cascade : supprimer un logement → supprimer ses EDL + blobs.

#### Critères de « fait » P0-B

- [ ] Créer un EDL **sans** locataire, photos pièce par pièce (caméra + galerie).
- [ ] Entrée et sortie.
- [ ] Dupliquer / rattacher un locataire plus tard.
- [ ] Aperçu HTML avec photos + Word prérempli.
- [ ] Transfert e-mail (locataire ou candidat).
- [ ] Le générateur Word EDL historique n’est pas cassé.

---

## 3. P1 — audit (HTML v2.22–v2.30). N’appliquer QUE si manquant

Ces items sont dans le proto HTML. Foundation v2.0.50 en a probablement déjà
plusieurs (port initial). **Vérifie**, n’implémente pas à l’aveugle.

| HTML | Quoi vérifier dans Foundation | Si déjà là |
|---|---|---|
| v2.30 | Étude de cas : défaut **charges annuelles non récupérables = 600 €/an** (plus 1400). Calcul inchangé. | `[skip]` — le HTML s’est aligné sur Foundation |
| v2.29 | Sélecteur global **« Vue par bâtiment »** qui filtre Logements, Locataires, Loyers, Charges, Entretien, EDL, Documents | apply si absent |
| v2.28 | Fiche bâtiment **lecture seule** (pas seulement la liste) | apply si absent |
| v2.27 | `batId` optionnel sur les **entretiens** (lien bâtiment **ou** logement) | apply si schéma trop pauvre |
| v2.26 | Permissions **idempotentes** : boutons « + Ajouter » ne restent pas cachés après une session lecture. Nav mobile non recouverte. | apply si bug reproduit |
| v2.25 | Badge retards loyers = **3 mois glissants** (mois courant + 2 précédents), pas seulement le mois en cours | apply si le compteur est trop étroit |
| v2.22 | **Affichage des cartes** dashboard : toggles show/hide des blocs | apply si absent |
| v2.18+ | Étude de cas, génération documents (baux RP/CD/étudiant + EDL Word), champs personnalisés bâtiment/logement/locataire | très probablement déjà là — skip si oui |
| Travaux logement | Périodes de travaux + icône 🚧 dans la grille Loyers | apply si absent |
| Indexation | Historique loyer sur la fiche logement | apply si absent |
| Photo compteur + IA | Relevé : photo caméra/galerie + lecture d’index | apply seulement si le module Charges Foundation n’a pas d’équivalent |
| To-do / Assistant IA / Drive | To-do : porter si useful. Assistant : seulement si Foundation a déjà un proxy. **Drive : ne pas porter.** | |

---

## 4. P2 — ne pas porter (spécifique HTML)

- Google Drive sync, `ks_cardprefs` → `sv()`, arbitrage boot Drive.
- Profils PIN locaux, isolation démo `sessionStorage`.
- Cloudflare Worker `ai-proxy-worker.js` (sauf si Foundation a déjà un assistant).
- Versioning footer 2.31 / 2.32, fichiers `CLAUDE_*.md`.
- Hash gzip+base64url `#a=` comme **mécanisme principal** (trop fragile pour WhatsApp). OK comme fallback, pas comme design.

---

## 5. Ordre d’implémentation suggéré

1. Audit P1 (30 min de grep) → liste `[skip]` / `[todo]` dans le PR.
2. **P0-A Annonces** (demande la plus récente, visible tout de suite).
3. **P0-B EDL photos** (plus gros : storage + Word + transfert).
4. Seulement ensuite les `[todo]` P1.
5. Un bump de version Keystone + changelog Foundation.

---

## 6. Recette manuelle minimale

**Annonces**
1. Owner → Annonces → Nouvelle → choisir un logement avec type/surface/loyer/contenu.
2. Vérifier titre + descriptif auto.
3. 2 photos, URL YouTube, URL Kuula/Matterport (ou jpg 360°).
4. Partager → ouvrir le lien en navigation privée.
5. WhatsApp (ou aperçu du texte) : lien cliquable, page complète, bandeau locataire.

**EDL**
1. Logement vide de locataire → Nouvel EDL entrée → 2 pièces, 1 photo caméra + 1 galerie.
2. Aperçu HTML : photos visibles.
3. Word : notes injectées.
4. Transférer vers un locataire (ou e-mail candidat).
5. Dupliquer → nouveau dossier, ancien intact.

---

## 7. Message court (si tu n’as que ce paragraphe)

Tu es sur `tvanhoye/foundation` / `apps/keystone` (prod v2.0.50). Le proto HTML
`tvanhoye/keystone` v2.32 a **Annonces de location** et **EDL photographiques**
que keystone.batiq.eu n’a pas. Spec complète :
https://raw.githubusercontent.com/tvanhoye/keystone/main/FOUNDATION_PORT_BRIEF.md
(et `index.html` du même repo). Check d’abord le reste (vue bâtiment, retards
3 mois, cartes dashboard, fiche bâtiment) ; n’applique que le manquant. N’importe
pas Drive/localStorage. Bump `2.0.50` → `2.0.51` (ou `2.1.0`).
