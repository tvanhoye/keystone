# Spec — Génération de documents (bail & état des lieux) — Keystone

## Objectif

Permettre à Keystone de produire automatiquement, pour un locataire donné :
- un **contrat de bail** pré-rempli ;
- un **état des lieux d'entrée** pré-rempli ;
- un **état des lieux de sortie** pré-rempli.

L'Assistant IA doit pouvoir déclencher cette génération. Workflow imposé par
le user : l'agent **présente d'abord les variables** pré-remplies pour
validation, puis génère le document, puis **présente le document finalisé
pour confirmation obligatoire** avant tout envoi. L'agent n'envoie jamais
sans cette double validation humaine.

## Livrables fournis avec cette spec

- `Template_Bail.docx` — modèle de bail à variables `{{...}}`
- `Template_EDL.docx` — modèle d'état des lieux à variables (entrée ET sortie,
  le titre s'adapte via `{{edl.type}}`)

Ces deux fichiers sont des DOCX normaux : il suffit de remplacer les chaînes
`{{variable}}` par les valeurs réelles, partout (corps, en-tête, pied de page).

## 1. Nouveaux champs de données à ajouter

### a) Paramètres bailleur (constantes globales — NOUVEAU)

Créer un petit bloc de paramètres "bailleur" (par ex. une clé localStorage
`ks_bailleur` ou une section dans les réglages). Champs :
- `nom` — ex. "M. VAN HOYE Thomas"
- `adresse` — ex. "4130 Tilff"
- `iban` — ex. "BE71 0637 5650 6469"
- `bic` — ex. "GKCCBEBB"

Ces valeurs ne changent pas d'un locataire à l'autre. Prévoir un écran de
saisie simple (réglages / profil).

### b) Champ logement (ig3_lg — NOUVEAU)

Ajouter au formulaire logement et à l'objet logement un champ :
- `contenu` (texte libre, multi-ligne) — description du logement, ex.
  "2 pièces privatives avec cabine de douche, WC, lavabo, kitchenette,
  deux radiateurs". **C'est le champ explicitement demandé par le user.**

Optionnel mais utile pour l'EDL :
- `cles` (texte libre) — identification des clés/accès remis.

### c) Champ locataire (ig3_lc — à vérifier / compléter)

- `adresse` — adresse (domicile) du locataire. Vérifier qu'elle existe ;
  sinon l'ajouter au formulaire locataire.
- `civilite` — M. / Mme / Mlle. À ajouter si absent (sinon laisser vide).
- contact d'urgence : déjà présent (`locUrg`).

### d) Champs saisis au moment de la génération (pas stockés en base)

- `bail.pebRef` — référence du certificat PEB
- `bail.dateSignature`, `bail.lieuSignature`
- `bail.remarques` — remarques particulières (optionnel)
- `edl.date`, `edl.conclusion`

## 2. Dictionnaire complet des variables

Le moteur de fusion doit remplacer ces clés. Entre parenthèses : la source.

**Bailleur** (constantes `ks_bailleur`)
- `{{bailleur.nom}}` `{{bailleur.adresse}}` `{{bailleur.iban}}` `{{bailleur.bic}}`

**Locataire** (ig3_lc)
- `{{loc.civilite}}` `{{loc.prenom}}` `{{loc.nom}}` `{{loc.adresse}}`
- `{{loc.email}}` `{{loc.tel}}` `{{loc.contactUrgence}}`

**Logement** (ig3_lg + ig3_bt pour l'adresse complète)
- `{{lgt.adresse}}` — adresse complète du logement
- `{{lgt.contenu}}` — NOUVEAU champ description
- `{{lgt.cles}}` — clés remises (EDL)

**Bail**
- `{{bail.dureeMois}}` — durée en mois (calculée depuis dateDebut/dateFin
  ou saisie)
- `{{bail.dateDebut}}` `{{bail.dateFin}}` — format JJ/MM/AAAA
- `{{bail.loyer}}` — montant numérique (loyer hors charges)
- `{{bail.loyerLettres}}` — loyer en toutes lettres (optionnel ; si non
  géré, mettre une chaîne vide et retirer la parenthèse, ou laisser l'agent
  IA le générer)
- `{{bail.jourPaiement}}` — jour de paiement (ig3_lc, `locJour`)
- `{{bail.garantie}}` — **calcul automatique = 2 × loyer**
- `{{bail.dateSignature}}` `{{bail.lieuSignature}}`
- `{{bail.pebRef}}` — référence PEB (saisie)
- `{{bail.remarques}}` — texte libre

**État des lieux**
- `{{edl.type}}` — "ENTRÉE" ou "SORTIE" (en majuscules ; le template écrit
  "ÉTAT DES LIEUX D'{{edl.type}}")
- `{{edl.date}}` — date de l'état des lieux
- `{{edl.conclusion}}` — texte libre de conclusion

## 3. Moteur de fusion (remplacement des variables)

Un DOCX est un ZIP de fichiers XML. La fusion = dézipper, remplacer les
`{{...}}` dans les XML texte, rezipper.

Fichiers XML à traiter : `word/document.xml` ET tous les
`word/header*.xml` / `word/footer*.xml` (les variables `{{lgt.adresse}}`,
`{{loc.prenom}}` etc. apparaissent aussi dans l'en-tête/pied de page).

**Côté navigateur** (Keystone est une app client), utiliser une lib ZIP type
JSZip déjà chargeable, ou docxtemplater (qui gère nativement les `{{...}}`).
Recommandation : **docxtemplater + pizzip** — c'est exactement son cas
d'usage, ça gère le découpage des runs XML (problème classique : Word peut
couper `{{loc.nom}}` en plusieurs `<w:r>`, un simple search/replace échoue ;
docxtemplater résout ça). Si vous préférez sans dépendance, prévoir un
pré-traitement qui fusionne les runs avant remplacement.

**Échappement** : toute valeur insérée doit être échappée XML
(`&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`). Lié au point sécurité : ne
jamais injecter de texte utilisateur brut. (cf. bug XSS to-do list signalé
par l'auditeur — même vigilance ici.)

**Variables manquantes** : si une donnée est absente, insérer une chaîne
vide ou un marqueur visible "À COMPLÉTER" plutôt que de laisser `{{x}}`
apparaître dans le document final.

## 4. Workflow utilisateur (imposé par le user)

```
1. Déclenchement
   - soit bouton dans la fiche locataire ("Générer le bail",
     "Générer l'EDL d'entrée", "Générer l'EDL de sortie")
   - soit demande à l'Assistant IA

2. Pré-remplissage
   - Keystone collecte les variables depuis ig3_lc / ig3_lg / ig3_bt /
     ks_bailleur + calcule garantie = 2× loyer + durée

3. ÉCRAN DE VALIDATION DES VARIABLES  (obligatoire)
   - afficher toutes les variables pré-remplies, éditables
   - le user complète les champs non stockés (PEB, dates de
     signature, conclusion EDL, remarques) et corrige si besoin
   - le user valide

4. Génération du document
   - fusion template + variables -> DOCX rempli

5. ÉCRAN DE CONFIRMATION DU DOCUMENT  (obligatoire)
   - présenter le document finalisé (aperçu ou téléchargement)
   - le user confirme explicitement

6. Envoi
   - seulement après confirmation
   - voir section 5
```

## 5. Envoi par e-mail

Keystone est statique (GitHub Pages) → pas d'envoi mail côté client.
L'envoi doit passer par le **Cloudflare Worker proxy** (le même que celui
prévu pour l'Assistant IA). Ajouter au Worker un endpoint d'envoi qui
relaie vers un service mail (Resend / SendGrid / Mailgun).

Le Worker reçoit : destinataire (email du locataire, `{{loc.email}}`),
objet, corps, et le DOCX en pièce jointe (base64). Il envoie.

Tant que le Worker n'a pas cet endpoint, fallback acceptable : Keystone
génère le DOCX et le propose en téléchargement, le user l'envoie
lui-même. Mais l'objectif final = envoi via le Worker, après l'étape de
confirmation obligatoire.

## 6. Tool Assistant IA

Exposer à l'agent un tool, par ex. :

```
genererDocument(type, locataireId)
  type ∈ { "bail", "edl_entree", "edl_sortie" }
```

Comportement : l'agent NE génère PAS le document directement. Il :
1. appelle la collecte des variables ;
2. présente les variables au user pour validation (étape 3) ;
3. après validation, déclenche la génération ;
4. présente le document pour confirmation (étape 5) ;
5. après confirmation, déclenche l'envoi.

Cas d'usage cible :
- nouveau locataire → l'agent propose de générer bail + EDL d'entrée ;
- départ d'un locataire → l'agent propose de générer l'EDL de sortie.

L'agent doit gérer les ambiguïtés (locataire homonyme, logement non
rattaché) en demandant, pas en devinant.

## 7. Note sur les mentions légales (à faire valider)

Les templates reprennent fidèlement le contenu des modèles fournis par le
user. Quelques mentions ont été AJOUTÉES car le décret wallon relatif au
bail d'habitation les rend en pratique nécessaires :
- **Article 4 — Indexation du loyer** (l'indexation doit être prévue au
  bail pour pouvoir s'appliquer)
- **Article 14 — Performance énergétique (PEB)** (le bail doit faire
  référence au certificat PEB)
- mention que l'**EDL est annexé au bail et en fait partie intégrante**
  (Article 9)

Ces ajouts sont signalés ici pour transparence. Ni l'auteur de la spec ni
CC ne sont juristes : le user doit faire valider le modèle final par un
professionnel avant usage réel. Ne pas retirer ces mentions sans avis
juridique.

## 8. Récap des tâches CC

1. Ajouter le bloc "paramètres bailleur" (nom/adresse/iban/bic) + écran de
   saisie.
2. Ajouter le champ `contenu` (description) au formulaire et à l'objet
   logement (ig3_lg). Optionnel : `cles`.
3. Vérifier/ajouter `adresse` et `civilite` sur le locataire (ig3_lc).
4. Intégrer les 2 templates DOCX (les embarquer dans l'app, base64 ou
   fichiers, selon l'archi single-file).
5. Implémenter le moteur de fusion (docxtemplater recommandé) avec
   échappement XML.
6. Implémenter le workflow à double validation (écran variables + écran
   confirmation document).
7. Boutons de génération dans la fiche locataire.
8. Tool `genererDocument` pour l'Assistant IA.
9. Endpoint d'envoi mail sur le Cloudflare Worker (peut venir dans un
   second temps ; fallback téléchargement en attendant).
10. Respecter l'isolation : en mode Démo / App vide, la génération doit
    utiliser les données du contexte isolé, jamais les vraies ig3_*.
