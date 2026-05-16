/**
 * Keystone — Proxy IA (Cloudflare Worker)
 * ----------------------------------------
 * Relaie les requêtes de l'application Keystone vers l'API Anthropic,
 * en gardant la clé API côté serveur (jamais exposée dans le navigateur).
 *
 * L'application envoie un POST JSON { model, max_tokens, system, messages, tools }
 * que ce Worker transmet tel quel à https://api.anthropic.com/v1/messages.
 *
 * Variables d'environnement du Worker :
 *   ANTHROPIC_API_KEY  (secret, REQUIS)   — clé API Anthropic (sk-ant-...).
 *   ALLOWED_ORIGIN     (variable, optionnel) — origine autorisée à appeler le
 *                       proxy, ex. "https://tvanhoye.github.io".
 *                       Par défaut "*" (toute origine) — à restreindre en prod.
 *
 * Déploiement : voir DEPLOY-AI-PROXY.md
 */
export default {
  async fetch(request, env) {
    const allowOrigin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Préflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: { message: 'Méthode non autorisée — utilisez POST.' } }, 405, cors);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: { message: "ANTHROPIC_API_KEY n'est pas configurée sur le Worker." } }, 500, cors);
    }

    // Refuse les origines non autorisées si ALLOWED_ORIGIN est défini.
    if (env.ALLOWED_ORIGIN) {
      const origin = request.headers.get('Origin');
      if (origin && origin !== env.ALLOWED_ORIGIN) {
        return json({ error: { message: 'Origine non autorisée.' } }, 403, cors);
      }
    }

    let body;
    try {
      body = await request.text();
    } catch (e) {
      return json({ error: { message: 'Corps de requête illisible.' } }, 400, cors);
    }

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body,
      });
    } catch (e) {
      return json({ error: { message: 'Échec de contact avec l\'API Anthropic : ' + e.message } }, 502, cors);
    }

    // On renvoie la réponse Anthropic telle quelle (succès comme erreur),
    // en y ajoutant les en-têtes CORS.
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
