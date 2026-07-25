# AUDIT_PARCOURS_BAIL.md — le chemin « du bien au bail »

> **À qui s'adresse ce document.** À l'agent (ou à l'humain) qui travaillera sur
> l'app réellement utilisée, **`keystone.batiq.eu` (Next.js, dépôt `foundation`)**.
>
> **D'où il vient.** Audit mené le 2026-07-25 sur l'app HTML de CE dépôt
> (`tvanhoye/keystone`, v2.30), avant qu'il apparaisse que ce n'est plus l'app
> du quotidien. Les mesures citées ont donc été faites **sur le HTML**. Sur
> l'app Next.js, elles sont des **points à vérifier**, pas des bugs confirmés :
> plusieurs sont peut-être déjà réglés.
>
> Ce dépôt est public : ce fichier est lisible en anonyme via
> `raw.githubusercontent.com/tvanhoye/keystone/main/AUDIT_PARCOURS_BAIL.md` et
> peut être passé tel quel dans le prompt d'un agent.

## 1. Le besoin, dans les mots de Thomas

- « Actuellement on est totalement perdu. Le fil conducteur est presque manquant. »
- Bâtiments et logements se paramètrent **au calme**, à la création du compte,
  sur grand écran. Ce n'est pas là qu'est le problème.
- Le reste doit se faire **au téléphone, très facilement** : « sur un écran, je
  dois comprendre directement où cliquer pour faire ce que je veux faire :
  créer locataire, créer documents, etc. »

## 2. Le parcours cible

```
bailleur (une seule fois)
   → bâtiment → logement            [paramétrage, desktop, au calme]
      → locataire                   [quotidien, mobile]
         → bail
            → état des lieux d'entrée
               → quittances / loyers
                  → (fin) préavis, état des lieux de sortie, dépôt restitué
```

Deux exigences transversales : chaque étape **annonce la suivante**, et chaque
étape est **atteignable sans savoir dans quel module elle se cache**.

## 3. Checklist de vérification

Pour chaque point : ce qui a été constaté sur le HTML, puis la question à se
poser sur l'app en production.

### a. L'aboutissement est-il découvrable ?
*HTML* — « générer un bail » est une icône 📄 de **19 × 18 px**, sans libellé,
dans une ligne de tableau qui déborde sur mobile (**589 px de contenu pour
364 px visibles**) : le bouton est littéralement hors de l'écran. Le mot
« bail » n'apparaît nulle part dans la navigation.
*À vérifier* — depuis l'accueil sur téléphone, combien de gestes pour sortir un
bail ? Le mot est-il lisible sans scroller ni ouvrir un menu ?

### b. L'accueil dit-il quoi faire ?
*HTML* — cinq indicateurs puis trois cadres vides (« Aucune alerte », « Aucun
paiement », « Aucun rappel »). Rien d'actionnable.
*Piste validée en maquette* — un bloc « À faire » **calculé** (coordonnées
bailleur manquantes, loyers en retard, logement vacant, bail à générer, fin de
bail à moins de 90 jours) suivi de tuiles d'action **libellées en toutes
lettres**. Deux garde-fous appris à l'usage : plafonner à 4 items, et ne jamais
réclamer un bail pour un locataire historique — filtrer sur les emménagements
de moins de 60 jours ou à venir, sinon la liste devient un reproche permanent
sur un parc déjà loué.

### c. Les données constantes sont-elles redemandées ?
*HTML* — les cinq champs du bailleur (nom, naissance/n° BCE, adresse, IBAN,
BIC) sont saisis **dans l'écran de génération** et ne sont jamais réécrits dans
les réglages : ils sont à retaper à chaque bail. Le réglage existe pourtant,
mais enterré dans une modale « Gestion des données », entre « Exporter » et
« Effacer toutes les données ».
*À vérifier* — l'identité du bailleur est-elle demandée **une fois**, dans les
Réglages, et pré-remplie partout ensuite ?

### d. Les attributs du bien sont-ils saisis au bon endroit ?
*HTML* — sur **30 variables** de l'écran de génération, **20 sont vides** à
l'ouverture. Or le PEB (classe, référence, date) est un attribut du bien,
valable dix ans, absent du modèle logement ; le lieu de signature ne change
jamais ; la description du logement et la liste des clés existent sur le
logement, mais rien n'indique à la saisie qu'elles serviront au bail.
*À vérifier* — combien de champs restent à taper au moment de générer ? Ceux
qui appartiennent au bien sont-ils demandés une fois, à la création du bien ?

### e. Les données saisies sont-elles réellement utilisées ?
*HTML* — la garantie locative du bail est recalculée à **2 × loyer** et
**ignore** le champ « Dépôt garantie » saisi sur le logement. Une donnée
capturée en amont est jetée en aval.
*À vérifier* — la garantie du bail vient-elle du dépôt saisi sur le bien ?

### f. Le processus garde-t-il la mémoire de lui-même ?
*HTML* — le document produit n'est enregistré nulle part : il faut le ré-encoder
à la main pour qu'il figure au dossier du locataire. Aucun marqueur « bail
fait », aucun rappel de fin de bail créé automatiquement.
*À vérifier* — **semble déjà traité côté Next.js** (stockage réel, quota,
partage). Reste à confirmer : le document généré est-il attaché au locataire et
au bail ? Un rappel de fin de bail est-il posé à la signature ?

### g. Chaque étape annonce-t-elle la suivante ?
*HTML* — après l'enregistrement d'un locataire, rien. Après le téléchargement
d'un bail, rien.
*Piste validée en maquette* — proposer explicitement l'étape suivante au moment
où l'on vient d'en finir une : locataire enregistré → « Générer le bail » ;
bail téléchargé → « Générer l'état des lieux d'entrée ». C'est le fil
conducteur dans sa forme la plus littérale, et c'est peu coûteux.

### h. Les dépendances sont-elles expliquées, ou seulement bloquantes ?
*HTML* — « Logement » est obligatoire dans le formulaire locataire : si l'on
commence par le locataire, il faut sortir, créer le logement, revenir. La
génération refuse par un simple message si le locataire n'a pas de logement.
L'app connaît l'ordre des choses, elle ne le dit jamais — elle refuse.
*À vérifier* — peut-on créer le bien à la volée depuis le formulaire locataire ?

### i. L'ergonomie mobile de base
*HTML* — champs de saisie à 11 px (Safari iOS zoome à chaque focus et ne
dézoome pas), cibles tactiles de 19 à 24 px, listes en tableaux à scroll
horizontal, écran de génération long de **3,5 hauteurs d'écran**.
*À vérifier* — 16 px minimum sur les champs de saisie, 44 px sur les cibles,
listes en cartes plutôt qu'en tableaux, et formulaire de génération découpé en
étapes plutôt qu'en une page à dérouler.

### j. La mise en route mène-t-elle jusqu'au premier bail ?
*HTML* — un assistant guidé existe, mais il est **inatteignable** (il ne s'ouvre
que si aucun logement n'existe, or le code réinjecte le portefeuille à chaque
démarrage) et il ne mène pas au bail : logement → locataire → compteurs → fin.
*À vérifier* — y a-t-il un parcours de mise en route, et va-t-il jusqu'au
premier document ?

## 4. Quatre architectures possibles (aucune tranchée)

| Option | Principe | Ampleur | Limite |
|---|---|---|---|
| A — checklist | Rendre visible l'ordre qui existe déjà | Faible | Guide sans accompagner |
| B — assistant « nouveau bail » | Un parcours unique de bout en bout | Moyenne | Double les chemins de saisie |
| C — fiche logement pivot | Naviguer par objet plutôt que par module | Élevée | Touche beaucoup d'écrans |
| D — entité `baux` | Le bail devient un objet de plein droit | Élevée + migration | Le modèle juste, à trancher ici |

**D** mérite un mot : dans le HTML, le bail n'existe pas — c'est un locataire
qui porte une date d'entrée et une date de fin. Une entité `baux` (bien,
locataire, dates, loyer, charges, dépôt, PEB, statut brouillon/actif/terminé,
date de génération) rend le tunnel mesurable et donne un point d'accroche
naturel aux quittances et aux états des lieux. Si ce modèle doit être tranché
quelque part, c'est côté Next.js.

## 5. Maquette fonctionnelle disponible

Deux branches de ce dépôt prototypent les pistes A, B (partiel) et g, sur le
HTML : `cursor/mobile-ux-quick-wins-9845` et `cursor/parcours-bail-mobile-9845`
(hub d'actions mobile, barre de navigation recentrée sur les locataires, bouton
d'ajout libellé, locataires en cartes, enchaînement locataire → bail → état des
lieux, référencement du document généré).

À lire comme une **maquette cliquable et testée**, pas comme du code
réutilisable : c'est du HTML mono-fichier avec du JavaScript en ligne, sans
rapport avec une base React.
