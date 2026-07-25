# CHANGELOG — keystone (HTML mono-fichier)

> Historique **append-only**, une entrée par version (numéro du footer). La version
> la plus récente est **en haut**. SHA = commit qui a posé le bump du footer.
> Dates au format AAAA-MM-JJ. Pour l'état courant, voir `PROJECT_STATE.md`.

## v2.31 — 2026-07-25 — `e3eb6da`
- **Mobile — saisie** : tous les champs texte passent à **16px** sous 700px.
  En dessous de 16px, iOS Safari zoome le viewport à chaque focus et ne
  dézoome pas à la fermeture du clavier (la page restait décalée).
- **Mobile — bouton flottant (FAB)** : masqué sur les pages sans action
  d'ajout (Assistant, Tableau annuel, Étude de cas, Banque, To-do…) où il
  restait affiché sans effet ; masqué pour les rôles sans permission
  `canAdd` (il ouvrait les modales d'ajout que `applyRoleRestrictions()`
  masque partout ailleurs) ; passé en **z-index 120** — à 250 il flottait
  par-dessus les formulaires ouverts et le tiroir de navigation.
- **Mobile — nav basse** : filtrée par les permissions de page, comme le
  menu latéral (une page interdite restait accessible d'un tap).
- **Perf** : retrait du script CDN `html-to-image`, chargé de façon
  bloquante dans le `<head>` alors qu'aucune fonction ne l'utilise.

## v2.30 — 2026-06-21 — `d6e661e`
- **Étude de cas** : défaut « charges annuelles non récupérables » abaissé
  **1400 → 600 €/an** (1400 supposait copropriété + agence, ~14 % du loyer ;
  600 € est réaliste pour un bien auto-géré). Aligne le défaut retenu côté
  **foundation** (`keystone.batiq.eu`). Calcul inchangé, simple ajustement de valeur.

## v2.29 — 2026-06-18 — `e15a28f`
- Chantier « bâtiment » Phase 2 (UI) : **sélecteur global « Vue par bâtiment »**.

## v2.28 — 2026-05-20 — `79744b2`
- Chantier « bâtiment » Phase 2 : **fiche bâtiment en lecture seule**.

## v2.27 — 2026-05-20 — `44a14c7`
- Chantier « bâtiment » Phase 1 : schéma — `batId` optionnel sur les entretiens (hook prepare).

## v2.26 — 2026-05-20 — `76598b8`
- `applyRoleRestrictions` rendu **idempotent** (les boutons « + Ajouter » ne restent
  plus cachés après une session non-admin) + `syncBar` mobile ne recouvre plus la nav basse.

## v2.25 — 2026-05-20 — `b6e0843`
- **Compteur de retards sur 3 mois glissants** (mois courant + 2 précédents).

## v2.24 — 2026-05-19 — `2facd37`
- Synchronisation Drive — Partie B : **arbitrage de sync au boot** (+ correctif relecture :
  flag `_ksLoadingDrive` remis à `false` dans un `finally`).

## v2.23 — 2026-05-19 — `df130ef`
- Synchronisation Drive — Partie A : correctif `ks_cardprefs` notifie la couche de sync (`sv()`).

## v2.22 — 2026-05-19 — `0eae7a9`
- Module **« Affichage des cartes »**.

---
*Historique antérieur à v2.22 : disponible dans `git log` du repo. Ce CHANGELOG a été
initialisé le 2026-06-20 à partir de l'historique git, à partir de la v2.22.*
