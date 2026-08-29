# PROJECT_STATE.md — état vivant du code

> Réécrit **intégralement à chaque session**. Décrit l'état RÉEL du code de
> `tvanhoye/keystone` (app HTML mono-fichier sur GitHub Pages). Pour la carte
> des coordonnées (repo, branche, domaine), voir `CLAUDE_SYNC.md`. Pour les
> demandes entrantes de Claude, voir `CLAUDE_NOTES.md`.

*Dernière réécriture : 2026-08-29.*

## VERSION ACTUELLE EN PROD
- **Footer : `Keystone v2.30`** (prod GitHub Pages, branche `main`)
- **SHA déployé : `d6e661e`**
- **Date du commit déployé : 2026-06-21**
- URL : https://tvanhoye.github.io/keystone/
- **Branche de travail : `cursor/edl-photos-entree-c646` → v2.31** (EDL photographique)

## DERNIER TRAVAIL POUSSÉ
- **v2.31** (cette branche) — Module **états des lieux photographiques** :
  photos/vidéos pièce par pièce, dossier lié au logement, réutilisation à
  l'entrée d'un locataire, aperçu HTML + Word existant.
- **v2.30** — Maintenance corrective : étude de cas, défaut « charges non
  récupérables » **1400 → 600 €/an**.

Chantier « bâtiment » (regroupement des logements par immeuble) :
- **v2.29** — Phase 2 (UI) : **sélecteur global « Vue par bâtiment »**.
- v2.28 — Phase 2 : fiche bâtiment en **lecture seule**.
- v2.27 — Phase 1 : schéma — `batId` optionnel sur les entretiens (hook prepare).

## CHANTIER EN COURS
- **États des lieux photographiques (v2.31)** : livré sur cette branche.
  L'outil Word (`Template_EDL.docx`, boutons 📋 locataire) était déjà en place
  et reste le document juridique. Le nouveau module ajoute la **preuve visuelle**
  et la **réutilisation** du dossier.
- **Chantier « bâtiment »** : Phases 1 et 2 livrées (jusqu'à v2.29). Phases
  suivantes non documentées.

## BACKLOG ACTIF (par priorité)
1. **(Stratégique) Migration HTML → monorepo `foundation/apps/keystone`** : un port
   de cette app est en cours dans `tvanhoye/foundation` (Next.js + Supabase, déployé
   sur Vercel à `keystone.batiq.eu`). **Ce HTML reste la source de vérité en prod**
   tant que la migration fonctionnelle n'est pas validée.
2. **Sync Drive des originaux photos EDL** : aujourd'hui IndexedDB local +
   miniatures dans le JSON Drive. Un dossier Drive dédié permettrait le multi-appareil.
3. **Suite éventuelle du chantier « bâtiment »** — à cadrer.

## MARQUEURS DE TEST EN PLACE (données-sondes en prod)
- **Aucun marqueur de test connu** laissé en prod pour ce repo. L'app stocke les
  données dans le **localStorage du navigateur** + **synchronisation Google Drive du
  compte utilisateur**. Les originaux photo/vidéo EDL sont dans **IndexedDB**
  (`ks-edl-media`).

## POINTS DE VIGILANCE (bugs connus / dette chaude)
- **Photos EDL** : les fichiers originaux ne sont **pas** dans `keystone-data.json`
  (trop lourds). Un autre appareil verra les miniatures mais pas les originaux
  tant qu'on n'a pas exporté le HTML ou branché un sync média Drive.
- **Assistant IA** : dépend d'un **proxy Cloudflare Worker** (`ai-proxy-worker.js`).
- **Architecture mono-fichier** : tout tient dans `index.html`, sans build.
- **Synchronisation Drive + localStorage** : zone historiquement sensible.
- **Pas de domaine custom** : prod = `tvanhoye.github.io/keystone/`.

## ÉTAT MÉMOIRE À CORRIGER CÔTÉ CLAUDE (faits devenus faux)
- ❌ « Prod en **v2.28** » → ✅ **v2.30** en prod Pages ; **v2.31** sur la branche EDL.
- ℹ️ Relation à retenir : **deux** apps « keystone » coexistent — ce **HTML standalone**
  (source de vérité prod) et l'**app foundation** (`keystone.batiq.eu`, Vercel).
