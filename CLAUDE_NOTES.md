# CLAUDE_NOTES.md — to-do entrantes de Claude (chat) → CC

> **Canal Claude → CC.** Claude (chat) n'a pas d'accès en écriture au repo : il
> rédige ici ses demandes/notes, le **user les relaie**, et **CC** les intègre puis
> les traite. **CC lit ce fichier EN PREMIER au début de chaque session** et tient
> compte des entrées `[OUVERT]` dans sa planification.
>
> Ce fichier est **séparé** de `PROJECT_STATE.md` : ici = demandes **entrantes** de
> Claude ; là-bas = état **réel** du code (écrit par CC).

## Règles
- **Statuts** : `[OUVERT]` · `[EN COURS]` · `[FAIT]` · `[REJETÉ/CADUC]`.
- On **ne supprime jamais** une entrée : on change son statut (historique conservé,
  comme le CHANGELOG).
- Quand CC traite une entrée → statut `[FAIT]` (ou `[EN COURS]`) + ligne
  `→ traité dans vX.XX / sha`.
- Si une note est **ambiguë** ou en **conflit avec une décision d'archi figée** :
  CC ne l'applique PAS en silence → passe l'entrée en `[EN COURS]` avec une question,
  et **le user arbitre**.
- Format d'une entrée :
  ```
  ## [STATUT] AAAA-MM-JJ — titre court
  - description / contexte de la demande
  - critère de « fait »
  ```

---

## [FAIT] 2026-06-20 — Mise en place du système de doc de suivi (exemple de format)
- **Contexte** : permettre à Claude (chat) de suivre l'état réel du projet en lisant
  directement le dépôt GitHub public, sans terminal côté user et sans deviner les
  coordonnées du repo. Mise en place de 4 fichiers Markdown à la racine
  (`CLAUDE_SYNC.md`, `PROJECT_STATE.md`, `CHANGELOG.md`, `CLAUDE_NOTES.md`).
- **Critère de « fait »** : les 4 fichiers existent à la racine, remplis avec l'état
  réel (repo `tvanhoye/keystone`, public, prod **v2.29** / `e15a28f`, domaine
  `tvanhoye.github.io/keystone`), et lisibles en anonyme via `raw.githubusercontent.com`.
- → traité dans v2.29 (état initial, sans changement de code applicatif) / sha à
  renseigner au commit de mise en place de la doc.

<!--
Modèle pour une vraie entrée de Claude (à dupliquer) :

## [OUVERT] AAAA-MM-JJ — titre court
- description / contexte de la demande de Claude
- critère de « fait »
-->
