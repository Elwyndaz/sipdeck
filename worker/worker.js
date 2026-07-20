// API för Sipdeck (sync, v1.1). Auth: Firebase ID-token (JWT, verifieras mot Googles JWKS).
// GET    /state    (Bearer) -> {state}
// PUT    /state    (Bearer) <- hela state-bloben {v,favorites,pantry,settings}
// DELETE /account  (Bearer) -> {ok}  raderar D1-raden (Firebase-usern raderas client-side)
const FIREBASE_PROJECT = 'sipdeck';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
const json = (d, s = 200) => Response.json(d, { status: s, headers: cors });

// ---- Firebase ID-token-verifiering (RS256 mot Googles publika JWKS, ingen SDK) ----
let jwksCache = null, jwksExpires = 0;
async function googleJwk(kid) {
  if (!jwksCache || Date.now() > jwksExpires) {
    const res = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
    if (!res.ok) return null;
    const m = /max-age=(\d+)/.exec(res.headers.get('Cache-Control') || '');
    jwksExpires = Date.now() + (m ? Number(m[1]) : 3600) * 1000;
    jwksCache = (await res.json()).keys;
  }
  return jwksCache.find(k => k.kid === kid) || null;
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  s += '='.repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

async function verifyFirebaseToken(token) {
  try {
    const [h, p, sig] = token.split('.');
    const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
    if (header.alg !== 'RS256') return null;
    const jwk = await googleJwk(header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(sig), new TextEncoder().encode(h + '.' + p));
    if (!ok) return null;
    const c = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
    const now = Date.now() / 1000;
    if (c.aud !== FIREBASE_PROJECT || c.iss !== 'https://securetoken.google.com/' + FIREBASE_PROJECT) return null;
    if (!(c.exp > now) || !c.sub) return null;
    return c;
  } catch (e) {
    return null;
  }
}

async function userFromRequest(req, env) {
  const t = (req.headers.get('Authorization') || '').replace(/^Bearer /, '');
  if (t.split('.').length !== 3) return null;
  const claims = await verifyFirebaseToken(t);
  if (!claims) return null;
  let u = await env.DB.prepare('SELECT * FROM users WHERE firebase_uid = ?').bind(claims.sub).first();
  if (!u) {
    await env.DB.prepare('INSERT INTO users (firebase_uid, state) VALUES (?, ?)').bind(claims.sub, '').run().catch(() => {});
    u = await env.DB.prepare('SELECT * FROM users WHERE firebase_uid = ?').bind(claims.sub).first();
  }
  return u;
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const path = new URL(req.url).pathname;
    try {
      if (path === '/state') {
        const u = await userFromRequest(req, env);
        if (!u) return json({ error: 'Inte inloggad.' }, 401);
        if (req.method === 'GET') return json({ state: u.state ? JSON.parse(u.state) : null });
        if (req.method === 'PUT') {
          const body = await req.text();
          if (body.length > 65536) return json({ error: 'För mycket data (max 64 kB).' }, 413);
          let s;
          try { s = JSON.parse(body); } catch (e) { return json({ error: 'Ogiltig data.' }, 400); }
          if (!s || typeof s !== 'object' || !Array.isArray(s.favorites) || !Array.isArray(s.pantry)) {
            return json({ error: 'Ogiltig data.' }, 400);
          }
          await env.DB.prepare('UPDATE users SET state = ? WHERE id = ?').bind(JSON.stringify(s), u.id).run();
          return json({ ok: true });
        }
      }

      // GDPR: raderar D1-raden. Firebase-användaren raderas client-side (user.delete()).
      if (path === '/account' && req.method === 'DELETE') {
        const u = await userFromRequest(req, env);
        if (!u) return json({ error: 'Inte inloggad.' }, 401);
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(u.id).run();
        return json({ ok: true });
      }
    } catch (e) {
      return json({ error: 'Serverfel.' }, 500);
    }
    return json({ error: 'Hittades inte.' }, 404);
  },
};
