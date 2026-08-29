# PROJECT_STATE.md — état vivant du code

> Réécrit **intégralement à chaque session**. Décrit l'état RÉEL du code de
> `tvanhoye/keystone` (app HTML mono-fichier sur GitHub Pages). Pour la carte
> des coordonnées (repo, branche, domaine), voir `CLAUDE_SYNC.md`. Pour les
> demandes entrantes de Claude, voir `CLAUDE_NOTES.md`.

*Dernière réécriture : 2026-08-29.*

## VERSION ACTUELLE EN PROD
- **Footer : `Keystone v2.30`** (prod GitHub Pages, branche `main`)
- **Branche de travail : `cursor/annonces-location-e846` → v2.31** (annonces de location)
- **SHA déployé : `d6e661e`** (branche `main`, servie par GitHub Pages)
- **Date du commit déployé : 2026-06-21**
- URL : https://tvanhoye.github.io/keystone/

## DERNIER TRAVAIL POUSSÉ
- **v2.31** — Nouvel onglet **Annonces** (barre latérale) : création d'une
  annonce de location à partir d'une fiche logement (photos compressées, lien
  vidéo, sphère 360° / visite virtuelle). Partage d'un lien public (WhatsApp,
  e-mail, SMS, copie, fichier HTML autonome). La page publique affiche photos,
  vidéo, visite 360°, descriptif repris de la fiche, et un bandeau pour
  l'espace locataire Keystone (`keystone.batiq.eu`). Persistance `ig3_an`,
  incluse dans export JSON et sync Drive.

Chantier « bâtiment » (regroupement des logements par immeuble) :
- **v2.29** — Phase 2 (UI) : **sélecteur global « Vue par bâtiment »**.
- v2.28 — Phase 2 : fiche bâtiment en **lecture seule**.
- v2.27 — Phase 1 : schéma — `batId` optionnel sur les entretiens (hook prepare).

## CHANTIER EN COURS
- **Annonces de location (v2.31)** : feature livrée sur la branche de travail.
  Le lien public encode l'annonce (photos compressées) dans le hash ; un lien
  très chargé en photos peut être trop long pour WhatsApp → alternatives e-mail
  / fichier HTML.
- **Chantier « bâtiment »** : Phases 1 et 2 livrées (jusqu'à v2.29). **La/les
  phase(s) suivante(s) ne sont pas documentées dans le repo** → à confirmer avec
  Thomas avant de reprendre.

## BACKLOG ACTIF (par priorité)
1. **(Stratégique) Migration HTML → monorepo `foundation/apps/keystone`** : un port
   de cette app est en cours dans `tvanhoye/foundation` (Next.js + Supabase, déployé
   sur Vercel à `keystone.batiq.eu`). **Ce HTML reste la source de vérité en prod**
   tant que la migration fonctionnelle n'est pas validée. Tant que c'est le cas, ce
   repo reçoit la **maintenance corrective** ; les nouvelles features lourdes vont
   plutôt côté foundation.
2. **Suite éventuelle du chantier « bâtiment »** (phases au-delà de la Phase 2) — à
   cadrer.
3. **Backlog détaillé à alimenter** : ce repo n'avait pas de backlog écrit jusqu'ici.
   Les prochaines tâches arriveront via Thomas et via `CLAUDE_NOTES.md` (canal Claude).

## MARQUEURS DE TEST EN PLACE (données-sondes en prod)
- **Aucun marqueur de test connu** laissé en prod pour ce repo. L'app stocke les
  données dans le **localStorage du navigateur** + **synchronisation Google Drive du
  compte utilisateur** ; il n'y a pas de base de données partagée où des sondes
  persisteraient. Mode Démo : une annonce « Studio A — à louer » est injectée en
  mémoire seulement (session isolée).

## POINTS DE VIGILANCE (bugs connus / dette chaude)
- **Assistant IA** : dépend d'un **proxy Cloudflare Worker** (`ai-proxy-worker.js`)
  qui détient la **clé API Anthropic côté serveur**. Si le Worker n'est pas déployé
  ou est indisponible, l'Assistant ne fonctionne pas. Déploiement : `DEPLOY-AI-PROXY.md`.
  La clé ne doit JAMAIS être mise dans `index.html` (côté navigateur).
- **Architecture mono-fichier** : tout tient dans `index.html` (~580 Ko), sans build.
  Toute modification édite ce fichier unique → diffs volumineux, vigilance sur les
  régressions transverses.
- **Annonces / lien public** : les photos voyagent dans le hash (gzip + base64url).
  Quota localStorage à surveiller si beaucoup de photos haute définition.
- **Synchronisation Drive + localStorage** : zone historiquement sensible (plusieurs
  correctifs récents : arbitrage de sync au boot, notification de `ks_cardprefs`).
  Tester la sync après toute modif touchant au stockage.
- **Pas de domaine custom** : si un CNAME est ajouté un jour, mettre à jour
  `CLAUDE_SYNC.md`.

## ÉTAT MÉMOIRE À CORRIGER CÔTÉ CLAUDE (faits devenus faux)
- ❌ « Prod en **v2.28** » → ✅ **v2.30** en prod (`d6e661e`) ; **v2.31** = branche
  de travail Annonces, pas encore fusionnée dans `main`.
- ❌ « Domaine **keystone.briq.eu** » → ✅ **n'existe pas** ; la prod de CE repo est
  sur **`tvanhoye.github.io/keystone/`** (aucun domaine custom). `keystone.batiq.eu`
  est l'app **foundation** (repo séparé `tvanhoye/foundation`, sur Vercel), **pas ce repo**.
- ⚠️ « Repo `tvanhoye/keystone` » et « URL `tvanhoye.github.io/keystone` » → **corrects**.
- ℹ️ Relation à retenir : **deux** apps « keystone » coexistent — ce **HTML standalone**
  (source de vérité prod, en migration) et l'**app foundation** (`keystone.batiq.eu`,
  Vercel, en validation). Ne pas les confondre.
