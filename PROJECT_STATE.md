# PROJECT_STATE.md — état vivant du code

> Réécrit **intégralement à chaque session**. Décrit l'état RÉEL du code de
> `tvanhoye/keystone` (app HTML mono-fichier sur GitHub Pages). Pour la carte
> des coordonnées (repo, branche, domaine), voir `CLAUDE_SYNC.md`. Pour les
> demandes entrantes de Claude, voir `CLAUDE_NOTES.md`.

*Dernière réécriture : 2026-06-21. Statut de production corrigé le 2026-07-25.*

## ⚠️ QUELLE APP EST RÉELLEMENT UTILISÉE ? (lire en premier)

Deux apps « Keystone » coexistent, et **ce dépôt n'est plus celle du quotidien** :

| | Ce dépôt (`tvanhoye/keystone`) | L'app utilisée (`keystone.batiq.eu`) |
|---|---|---|
| Techno | HTML mono-fichier, sans build | Next.js (portage `foundation`) |
| Stockage | localStorage + Google Drive | compte serveur, quota (5 Go), partage |
| Version | `Keystone v2.30` (footer) | `v0.1.207` |
| Statut | en ligne, mais plus l'outil de travail | **utilisée quotidiennement** |

Constaté le 2026-07-25 : Thomas travaille dans l'app Next.js (session
synchronisée, documents réellement stockés, console d'administration,
parrainage, « Quick scan », menus « Suivi » / « Finances » / « Découverte » —
**aucun de ces libellés n'existe dans `index.html`**). Les versions elles-mêmes
sont incompatibles (`v0.1.207` contre `v2.30`).

**Conséquence pour tout agent ou assistant lisant ce dépôt** : une demande
fonctionnelle de Thomas (« améliorer le parcours », « corriger l'app mobile »…)
concerne par défaut **l'autre dépôt**, pas celui-ci. Demander confirmation
avant d'écrire du code ici. Un audit UX complet, transposable, est disponible
dans `AUDIT_PARCOURS_BAIL.md`.

Le rôle qui reste à ce dépôt (secours, archive, ou maintenance corrective
jusqu'à bascule complète) **est à trancher par Thomas** — il n'est pas
documenté.

## VERSION EN PROD DE CE DÉPÔT
- **Footer : `Keystone v2.30`**
- **SHA déployé : `d6e661e`** (branche `main`, servie par GitHub Pages ; le commit de
  doc qui suit ne modifie pas l'app)
- **Date du commit déployé : 2026-06-21**
- URL : https://tvanhoye.github.io/keystone/
- Vérifié le 2026-07-25 : le fichier servi par GitHub Pages est **identique au
  bit près** (MD5 `3ec0db7a…`) au `index.html` de `main`.

## DERNIER TRAVAIL POUSSÉ
- **v2.30** — Maintenance corrective : étude de cas, défaut « charges non
  récupérables » **1400 → 600 €/an** (aligne le défaut foundation ; calcul inchangé).

Chantier « bâtiment » (regroupement des logements par immeuble) :
- **v2.29** — Phase 2 (UI) : **sélecteur global « Vue par bâtiment »**.
- v2.28 — Phase 2 : fiche bâtiment en **lecture seule**.
- v2.27 — Phase 1 : schéma — `batId` optionnel sur les entretiens (hook prepare).
Avant ce chantier (mi-mai 2026) : compteur de retards sur 3 mois glissants (v2.25),
idempotence des restrictions de rôle + correctifs UI mobile (v2.26), et plusieurs
correctifs de la synchronisation Google Drive au boot (v2.23–v2.24).

## CHANTIER EN COURS
- **Chantier « bâtiment »** : Phases 1 et 2 livrées (jusqu'à v2.29). **La/les
  phase(s) suivante(s) ne sont pas documentées dans le repo** → à confirmer avec
  Thomas avant de reprendre.
- Aucune modification non commitée dans le working tree au 2026-06-20 (propre).

## BACKLOG ACTIF (par priorité)
1. **(Stratégique) Statut de ce dépôt à trancher.** La migration vers
   `foundation` (Next.js, `keystone.batiq.eu`) n'est plus « en cours » : c'est
   **l'app effectivement utilisée** (cf. encadré en tête de fichier). La phrase
   « ce HTML reste la source de vérité en prod », qui figurait ici, était
   périmée et a déjà conduit un agent à développer plusieurs heures dans le
   mauvais dépôt. Reste à décider : ce dépôt est-il archivé, gardé en secours,
   ou maintenu en correctif ? Tant que ce n'est pas tranché, **ne rien
   développer ici sans confirmation explicite de Thomas**.
2. **Suite éventuelle du chantier « bâtiment »** (phases au-delà de la Phase 2) — à
   cadrer.
3. **Backlog détaillé à alimenter** : ce repo n'avait pas de backlog écrit jusqu'ici.
   Les prochaines tâches arriveront via Thomas et via `CLAUDE_NOTES.md` (canal Claude).

## MARQUEURS DE TEST EN PLACE (données-sondes en prod)
- **Aucun marqueur de test connu** laissé en prod pour ce repo. L'app stocke les
  données dans le **localStorage du navigateur** + **synchronisation Google Drive du
  compte utilisateur** ; il n'y a pas de base de données partagée où des sondes
  persisteraient. *(À compléter ici si une donnée-sonde est introduite lors d'un test.)*

## POINTS DE VIGILANCE (bugs connus / dette chaude)
- **Assistant IA** : dépend d'un **proxy Cloudflare Worker** (`ai-proxy-worker.js`)
  qui détient la **clé API Anthropic côté serveur**. Si le Worker n'est pas déployé
  ou est indisponible, l'Assistant ne fonctionne pas. Déploiement : `DEPLOY-AI-PROXY.md`.
  La clé ne doit JAMAIS être mise dans `index.html` (côté navigateur).
- **Architecture mono-fichier** : tout tient dans `index.html` (~548 Ko), sans build.
  Toute modification édite ce fichier unique → diffs volumineux, vigilance sur les
  régressions transverses.
- **Synchronisation Drive + localStorage** : zone historiquement sensible (plusieurs
  correctifs récents : arbitrage de sync au boot, notification de `ks_cardprefs`).
  Tester la sync après toute modif touchant au stockage.
- **Pas de domaine custom** : si un CNAME est ajouté un jour, mettre à jour
  `CLAUDE_SYNC.md`.

## ÉTAT MÉMOIRE À CORRIGER CÔTÉ CLAUDE (faits devenus faux)
- ❌ « Ce HTML est **la source de vérité en prod**, foundation est en
  validation » → ✅ **l'inverse** : l'app utilisée au quotidien est celle de
  `keystone.batiq.eu` (`v0.1.207`). Ce dépôt reste en ligne à son URL mais
  n'est plus l'outil de travail. Cf. l'encadré en tête de fichier.
- ❌ « Prod en **v2.28** » → ✅ **v2.30** (SHA `d6e661e`, 2026-06-21) pour CE dépôt.
- ❌ « Domaine **keystone.briq.eu** » → ✅ **n'existe pas** ; la prod de CE repo est
  sur **`tvanhoye.github.io/keystone/`** (aucun domaine custom). `keystone.batiq.eu`
  est l'app **foundation** (repo séparé `tvanhoye/foundation`, sur Vercel), **pas ce repo**.
- ⚠️ « Repo `tvanhoye/keystone` » et « URL `tvanhoye.github.io/keystone` » → **corrects**
  (ce sont bien les coordonnées réelles ; seule la version et le « nouveau domaine »
  étaient faux dans la mémoire de Claude).
- ℹ️ Relation à retenir : **deux** apps « keystone » coexistent — ce **HTML
  standalone** (`tvanhoye.github.io/keystone`, en ligne mais plus l'outil de
  travail) et l'**app foundation** (`keystone.batiq.eu`, Next.js sur Vercel,
  **celle que Thomas utilise**). Ne pas les confondre : c'est l'erreur la plus
  coûteuse possible sur ce projet, elle a déjà été commise.
