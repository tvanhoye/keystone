# Déploiement du proxy IA — Assistant Keystone

L'Assistant IA de Keystone appelle l'API Anthropic (Claude). La clé API ne doit
**jamais** se trouver dans le navigateur : elle est détenue par un petit
**Cloudflare Worker** qui sert de proxy. Ce document explique comment le déployer.

Le code du Worker est dans **`ai-proxy-worker.js`** (à la racine du dépôt).

---

## Prérequis

1. Un **compte Cloudflare** (gratuit) — https://dash.cloudflare.com/sign-up
2. Une **clé API Anthropic** — https://console.anthropic.com/ → *API Keys*
   (format `sk-ant-...`). Elle est facturée à l'usage.

---

## Option A — Déploiement via le dashboard Cloudflare (le plus simple)

1. Dans le dashboard Cloudflare, aller dans **Workers & Pages** → **Create** →
   **Create Worker**.
2. Donner un nom (ex. `keystone-ai-proxy`) → **Deploy** (un Worker « hello world »
   est créé).
3. Cliquer **Edit code**, **tout effacer**, et coller le contenu intégral de
   `ai-proxy-worker.js`. Puis **Deploy**.
4. Onglet **Settings** → **Variables and Secrets** :
   - Ajouter un **secret** nommé `ANTHROPIC_API_KEY` = votre clé `sk-ant-...`
   - (Recommandé en production) Ajouter une **variable** `ALLOWED_ORIGIN` =
     `https://tvanhoye.github.io` (l'origine exacte où tourne Keystone).
   - **Deploy** pour appliquer.
5. Copier l'URL du Worker, de la forme
   `https://keystone-ai-proxy.<votre-sous-domaine>.workers.dev`.

## Option B — Déploiement via Wrangler (CLI)

```bash
npm install -g wrangler
wrangler login
# Depuis la racine du dépôt :
wrangler deploy ai-proxy-worker.js --name keystone-ai-proxy
wrangler secret put ANTHROPIC_API_KEY     # collez la clé sk-ant-... à l'invite
# (optionnel, recommandé)
wrangler secret put ALLOWED_ORIGIN        # ou définissez-la comme var dans wrangler.toml
```

Wrangler affiche l'URL `*.workers.dev` à la fin du déploiement.

---

## Brancher le proxy dans Keystone

1. Ouvrir Keystone, aller dans **Assistant IA**.
2. Le bandeau **« ⚙️ Assistant IA — configuration requise »** est affiché.
3. Y coller l'URL du Worker (`https://....workers.dev`) → **Enregistrer**.

L'URL est stockée en `localStorage` (clé `ks_ai_proxy`) — **par navigateur**.
Chaque appareil/navigateur doit donc être configuré une fois. Pas besoin de
re-déployer ni de modifier le code de l'application.

---

## Vérification

Dans l'Assistant IA, poser une question simple (« Quel est mon taux
d'occupation ? »). Une réponse signifie que le proxy fonctionne.

Test rapide en ligne de commande :

```bash
curl -X POST https://keystone-ai-proxy.<sous-domaine>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":50,"messages":[{"role":"user","content":"dis bonjour"}]}'
```

---

## Sécurité

- La clé API reste **côté serveur** (secret du Worker) — jamais dans le navigateur.
- **`ALLOWED_ORIGIN`** : tant qu'il vaut `*`, n'importe quel site peut appeler
  votre proxy et donc consommer votre crédit Anthropic. En production, fixez-le
  à l'origine exacte de Keystone.
- Surveillez votre consommation sur la console Anthropic ; au besoin, plafonnez
  le budget côté compte Anthropic.
- Le Worker transmet la requête **telle quelle** : il ne logge ni ne stocke les
  données du portefeuille.
