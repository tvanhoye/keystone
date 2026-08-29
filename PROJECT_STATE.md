# PROJECT_STATE.md — état vivant du code

> Réécrit **intégralement à chaque session**. Décrit l'état RÉEL du code de
> `tvanhoye/keystone` (app HTML mono-fichier sur GitHub Pages). Pour la carte
> des coordonnées (repo, branche, domaine), voir `CLAUDE_SYNC.md`. Pour les
> demandes entrantes de Claude, voir `CLAUDE_NOTES.md`.

*Dernière réécriture : 2026-08-29.*

## VERSION ACTUELLE EN PROD
- **Footer : `Keystone v2.31`** (prod GitHub Pages, branche `main` — EDL photographique)
- **Branche de travail : `cursor/annonces-location-e846` → v2.32** (annonces de location, merge avec EDL)
- **SHA déployé : `6118750`** (merge `#5` EDL sur `main`)
- **Date du commit déployé : 2026-08-29**
- URL : https://tvanhoye.github.io/keystone/

## DERNIER TRAVAIL POUSSÉ
- **v2.32** (cette branche) — Nouvel onglet **Annonces** : création d'une
  annonce de location à partir d'une fiche logement (photos, vidéo, sphère
  360°). Lien public (WhatsApp, e-mail, SMS, fichier HTML). Bandeau espace
  locataire Keystone. Fusionné avec le module EDL v2.31 déjà sur `main`.
- **v2.31** — Module **états des lieux photographiques** (déjà sur `main`).
- **v2.30** — Étude de cas, défaut charges non récupérables 1400 → 600 €/an.

## CHANTIER EN COURS
- **Annonces de location (v2.32)** : en cours de merge vers `main`.
- **Chantier « bâtiment »** : Phases 1 et 2 livrées (jusqu'à v2.29).

## BACKLOG ACTIF (par priorité)
1. **(Stratégique) Migration HTML → monorepo `foundation/apps/keystone`**.
2. **Sync Drive des originaux photos EDL** : IndexedDB local + miniatures JSON.
3. **Suite éventuelle du chantier « bâtiment »**.

## MARQUEURS DE TEST EN PLACE (données-sondes en prod)
- Aucun marqueur de test en prod. Mode Démo : annonce « Studio A — à louer »
  injectée en mémoire (session isolée). Originaux photo/vidéo EDL dans
  IndexedDB (`ks-edl-media`).

## POINTS DE VIGILANCE
- **Annonces / lien public** : photos dans le hash (gzip + base64url). WhatsApp
  peut tronquer un lien trop long → e-mail / fichier HTML.
- **Photos EDL** : originaux pas dans `keystone-data.json`.
- **Assistant IA** : proxy Cloudflare Worker (`ai-proxy-worker.js`).
- **Architecture mono-fichier** + sync Drive / localStorage.
- Prod = `tvanhoye.github.io/keystone/` (pas de domaine custom).

## ÉTAT MÉMOIRE À CORRIGER CÔTÉ CLAUDE
- ❌ « Prod en v2.28 » → ✅ **v2.31** en prod Pages (EDL) ; **v2.32** = Annonces.
- ℹ️ Deux apps keystone : ce HTML Pages, et `keystone.batiq.eu` (foundation).
