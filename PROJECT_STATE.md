# PROJECT_STATE.md — état vivant du code

> Réécrit **intégralement à chaque session**. Décrit l'état RÉEL du code de
> `tvanhoye/keystone` (app HTML mono-fichier sur GitHub Pages). Pour la carte
> des coordonnées (repo, branche, domaine), voir `CLAUDE_SYNC.md`. Pour les
> demandes entrantes de Claude, voir `CLAUDE_NOTES.md`.

*Dernière réécriture : 2026-07-25.*

## VERSION ACTUELLE EN PROD
- **Footer : `Keystone v2.30`**
- **SHA déployé : `d6e661e`** (branche `main`, servie par GitHub Pages)
- **Date du commit déployé : 2026-06-21**
- URL : https://tvanhoye.github.io/keystone/

## DERNIER TRAVAIL POUSSÉ
- **v2.31 — PAS ENCORE EN PROD** : proposée sur la branche
  `cursor/mobile-ux-quick-wins-9845` (PR ouverte, non fusionnée). Lot de
  correctifs mobiles : champs de saisie à 16px (zoom iOS), FAB masqué sur les
  pages sans action d'ajout et pour les rôles sans `canAdd`, FAB repassé sous
  les modales/tiroir (z-index 120), nav basse filtrée par les permissions,
  retrait du CDN `html-to-image` inutilisé. Détail : `CHANGELOG.md`.
- **v2.30** — dernière version réellement déployée : étude de cas, défaut
  « charges non récupérables » **1400 → 600 €/an**.

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
- **Mobile** : lot de correctifs v2.31 en attente de revue (voir ci-dessus).
  Les pistes plus lourdes restent à arbitrer (voir backlog).

## BACKLOG ACTIF (par priorité)
1. **(Stratégique) Migration HTML → monorepo `foundation/apps/keystone`** : un port
   de cette app est en cours dans `tvanhoye/foundation` (Next.js + Supabase, déployé
   sur Vercel à `keystone.batiq.eu`). **Ce HTML reste la source de vérité en prod**
   tant que la migration fonctionnelle n'est pas validée. Tant que c'est le cas, ce
   repo reçoit la **maintenance corrective** ; les nouvelles features lourdes vont
   plutôt côté foundation.
2. **Permissions — deux trous identifiés le 2026-07-25, non corrigés** :
   - `applyRoleRestrictions()` masque des **nœuds DOM existants** ; toute page
     re-rendue après le login (`rP()` → `rLgs()`, `rEnts()`…) recrée les boutons
     ✏/🗑/＋ Ajouter, qui redeviennent visibles pour un rôle restreint. Piste :
     rappeler `applyRoleRestrictions()` en fin de `nav()`.
   - `pagePerms` mappe `tableau:'seeTableauAnnuel'` alors que l'entrée de menu
     porte `data-p="annuel"` → la permission « Tableau annuel » n'a jamais d'effet.
3. **Mobile — pistes non tranchées** (à arbitrer avec Thomas) :
   - **PWA installable + hors-ligne** (`manifest.webmanifest` + service worker).
     Les données vivent déjà en localStorage : l'app pourrait servir sans réseau
     (relevés de compteurs en cave/sous-sol). Attention à la stratégie de cache —
     un service worker mal réglé sert une version périmée après un déploiement.
   - **Cibles tactiles** : `.btn-xs` (~20px de haut) et boutons de la grille de
     paiements (30×24) sous les 44px recommandés.
   - **Tableaux** : scroll horizontal partout sur mobile ; une vue « cartes »
     par ligne serait plus lisible sur les pages Locataires/Entretien/Documents.
   - **Clavier virtuel** : les bottom-sheets (`max-height:92dvh`) ne se
     redimensionnent pas à l'ouverture du clavier iOS (piste : `visualViewport`).
4. **Suite éventuelle du chantier « bâtiment »** (phases au-delà de la Phase 2) — à
   cadrer.

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
- **Restrictions de rôle appliquées au DOM** : cf. backlog #2 — tout code qui
  re-rend une page annule le masquage posé au login.
- **Empilement mobile** : `#mob-nav`, `#mob-fab`, `#syncBar`, `#sb`, `.overlay` sont
  tous en `position:fixed` avec des z-index proches (100 → 200). Toute nouvelle
  couche flottante doit être replacée dans cette échelle.
- **Synchronisation Drive + localStorage** : zone historiquement sensible (plusieurs
  correctifs récents : arbitrage de sync au boot, notification de `ks_cardprefs`).
  Tester la sync après toute modif touchant au stockage.
- **Pas de domaine custom** : si un CNAME est ajouté un jour, mettre à jour
  `CLAUDE_SYNC.md`.

## ÉTAT MÉMOIRE À CORRIGER CÔTÉ CLAUDE (faits devenus faux)
- ❌ « Prod en **v2.28** » → ✅ **v2.30** en prod (SHA `d6e661e`, 2026-06-21) ;
  **v2.31** existe mais n'est qu'une PR non fusionnée.
- ❌ « Domaine **keystone.briq.eu** » → ✅ **n'existe pas** ; la prod de CE repo est
  sur **`tvanhoye.github.io/keystone/`** (aucun domaine custom). `keystone.batiq.eu`
  est l'app **foundation** (repo séparé `tvanhoye/foundation`, sur Vercel), **pas ce repo**.
- ⚠️ « Repo `tvanhoye/keystone` » et « URL `tvanhoye.github.io/keystone` » → **corrects**
  (ce sont bien les coordonnées réelles ; seule la version et le « nouveau domaine »
  étaient faux dans la mémoire de Claude).
- ℹ️ Relation à retenir : **deux** apps « keystone » coexistent — ce **HTML standalone**
  (source de vérité prod, en migration) et l'**app foundation** (`keystone.batiq.eu`,
  Vercel, en validation). Ne pas les confondre.
