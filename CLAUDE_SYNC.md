# CLAUDE_SYNC.md — carte d'entrée du suivi

> **À lire en premier.** Ce fichier dit à Claude (chat) où se trouve l'état réel
> du projet et comment le lire. Il est conçu pour être lu directement via
> `raw.githubusercontent.com` (repo public). Mis à jour **seulement** si une
> coordonnée structurelle change (repo, branche, domaine, hébergement).

## Coordonnées du dépôt

| Élément | Valeur |
|---|---|
| **Repo (owner/repo)** | `tvanhoye/keystone` |
| **URL GitHub** | https://github.com/tvanhoye/keystone |
| **Visibilité** | **PUBLIC** (lisible en anonyme via raw.githubusercontent.com) |
| **Branche de publication (GitHub Pages)** | `main` |
| **Source Pages** | racine du repo (`/`) |
| **Fichier servi en prod** | `index.html` (à la racine — application mono-fichier) |
| **URL de prod** | **https://tvanhoye.github.io/keystone/** |
| **Domaine custom / CNAME** | **aucun** (pas de fichier `CNAME`, `pages.cname = null`) |

### ⚠️ Ne pas confondre les deux « keystone »
- **Ce repo (`tvanhoye/keystone`)** = l'app **HTML mono-fichier**, servie sur
  GitHub Pages à `tvanhoye.github.io/keystone/`. **Source de vérité en production**
  tant que la migration n'est pas validée.
- **`keystone.batiq.eu`** = une **autre** application (port en cours dans le monorepo
  `tvanhoye/foundation`, déployée sur Vercel). **Ce n'est PAS ce repo.**
- Le domaine « keystone.briq.eu » **n'existe pas** (vraisemblablement une coquille
  pour « batiq.eu », qui de toute façon concerne l'app foundation, pas ce repo).

## Les 4 fichiers de suivi (tous à la racine, Markdown pur)

| Fichier | Rôle | Qui écrit | Rythme |
|---|---|---|---|
| **CLAUDE_SYNC.md** | Cette carte : où tout se trouve | CC | Rare (si coordonnée change) |
| **PROJECT_STATE.md** | État vivant du code (version prod, chantiers, vigilance) | CC | Réécrit à chaque session |
| **CHANGELOG.md** | Historique append-only, une entrée par version | CC | À chaque bump de version |
| **CLAUDE_NOTES.md** | To-do entrantes de Claude (chat) → CC | Claude via le user | Quand Claude a une demande |

### Lecture directe (raw)
- https://raw.githubusercontent.com/tvanhoye/keystone/main/CLAUDE_SYNC.md
- https://raw.githubusercontent.com/tvanhoye/keystone/main/PROJECT_STATE.md
- https://raw.githubusercontent.com/tvanhoye/keystone/main/CHANGELOG.md
- https://raw.githubusercontent.com/tvanhoye/keystone/main/CLAUDE_NOTES.md

## Comment fonctionne le canal à double sens
- CC écrit l'**état réel** du code dans `PROJECT_STATE.md` et `CHANGELOG.md`.
- Claude (chat) lit ces fichiers pour suivre le projet **sans terminal**.
- Claude dépose des to-do dans `CLAUDE_NOTES.md` (rédigées par Claude, relayées
  par le user, intégrées par CC). En début de session, **CC lit `CLAUDE_NOTES.md`
  en premier** et tient compte des entrées `[OUVERT]`.

---
*Dernière mise à jour de ce fichier : 2026-06-20.*
