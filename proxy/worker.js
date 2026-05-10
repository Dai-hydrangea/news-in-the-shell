// ─────────────────────────────────────────────────────────────────────
// News In The Shell ─ CORS proxy (Cloudflare Worker)
// ─────────────────────────────────────────────────────────────────────
// 役割: ブラウザから RSS XML を CORS ヘッダ付きで取得できるようにする中継。
//       コンテンツには一切手を加えない (素通しのみ)。
//
// デプロイ方法 (5 分):
//   1. Cloudflare アカウント作成 (無料)
//   2. Workers & Pages → Create application → Hello World テンプレ
//   3. このファイル全体を貼り付け → Save & Deploy
//   4. 払い出された URL (例: https://your-name.workers.dev/) を
//      News In The Shell の SETTINGS → "CORS PROXY URL" に貼る
//      末尾は `?url=` または `/?` を付ける (?url= 推奨)
//
// セキュリティ:
//   - レート制限: IP あたり 60 req/min
//   - 取得対象: http(s) スキームのみ
//   - 最大サイズ: 5MB
//   - User-Agent: NewsInTheShell-Proxy/1.0
// ─────────────────────────────────────────────────────────────────────

const RATE_LIMIT_PER_MIN = 60;
const MAX_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;

const ALLOW_ORIGIN = '*';   // 自前ドメインに絞りたい場合は 'https://your-domain.example' に

// メモリ内のシンプルなレート制限 (workers のメモリは持続しないが、
//   1 分以内の連打抑止には十分。 厳密にやるなら Workers KV / Durable Objects)。
const rateMap = new Map();

function checkRate(ip) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const key = `${ip}:${minute}`;
  const c = (rateMap.get(key) || 0) + 1;
  rateMap.set(key, c);
  // GC: 古い分のキーを掃除 (確率的)
  if (Math.random() < 0.01) {
    for (const k of rateMap.keys()) {
      if (!k.endsWith(`:${minute}`)) rateMap.delete(k);
    }
  }
  return c <= RATE_LIMIT_PER_MIN;
}

export default {
  async fetch(request) {
    // ─── CORS preflight ───
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin':  ALLOW_ORIGIN,
          'access-control-allow-methods': 'GET, OPTIONS',
          'access-control-allow-headers': 'Content-Type',
          'access-control-max-age':       '86400',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);

    // ─── ルート: 簡易ヘルプ ───
    if (!url.search) {
      return new Response(
        '# News In The Shell ─ CORS proxy\n\n' +
        'Usage: GET /?url=<encoded-rss-url>\n' +
        'Or:    GET /<encoded-rss-url>\n\n' +
        'See https://github.com/Dai-hydrangea/news-in-the-shell\n',
        { headers: { 'content-type': 'text/plain; charset=utf-8' } },
      );
    }

    // ─── ターゲット URL の抽出 ───
    let target = url.searchParams.get('url');
    if (!target) {
      // /https%3A%2F%2F... 形式もサポート
      const path = decodeURIComponent(url.pathname.slice(1));
      if (/^https?:\/\//i.test(path)) target = path;
    }
    if (!target || !/^https?:\/\//i.test(target)) {
      return new Response('Bad target URL', {
        status: 400,
        headers: { 'access-control-allow-origin': ALLOW_ORIGIN },
      });
    }

    // ─── レート制限 ───
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    if (!checkRate(ip)) {
      return new Response('Rate limit exceeded (60/min)', {
        status: 429,
        headers: { 'access-control-allow-origin': ALLOW_ORIGIN },
      });
    }

    // ─── 実フェッチ ───
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let upstream;
    try {
      upstream = await fetch(target, {
        signal: ctrl.signal,
        headers: { 'user-agent': 'NewsInTheShell-Proxy/1.0' },
        redirect: 'follow',
      });
    } catch (e) {
      clearTimeout(timer);
      return new Response(`Fetch failed: ${e.message}`, {
        status: 502,
        headers: { 'access-control-allow-origin': ALLOW_ORIGIN },
      });
    }
    clearTimeout(timer);

    // ─── サイズチェック (Content-Length ベース、 streaming は省略) ───
    const cl = parseInt(upstream.headers.get('content-length') || '0', 10);
    if (cl && cl > MAX_BYTES) {
      return new Response('Response too large', {
        status: 413,
        headers: { 'access-control-allow-origin': ALLOW_ORIGIN },
      });
    }

    const body = await upstream.text();
    if (body.length > MAX_BYTES) {
      return new Response('Response too large', {
        status: 413,
        headers: { 'access-control-allow-origin': ALLOW_ORIGIN },
      });
    }

    // ─── レスポンス組立 ───
    const ct = upstream.headers.get('content-type') || 'application/xml; charset=utf-8';
    return new Response(body, {
      status: upstream.status,
      headers: {
        'content-type':                ct,
        'cache-control':               'public, max-age=300',  // 5 分キャッシュ
        'access-control-allow-origin': ALLOW_ORIGIN,
        'x-proxied-by':                'NewsInTheShell-Proxy',
      },
    });
  },
};
