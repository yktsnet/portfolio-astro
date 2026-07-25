import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createChatHandler, createGeminiGenerator } from '@folio-agent/handler';
import type { KnowledgeDocument } from '@folio-agent/handler';

type KVNamespace = {
  get(key: string): Promise<string | null>;
};

// Cloudflare バインディングの境界。D1Database の型は @folio-agent/handler から導出し、
// このリポには存在しない @cloudflare/workers-types を追加しない。
type ChatDb = Parameters<typeof createChatHandler>[0]['db'];

type Fetcher = {
  fetch(input: string): Promise<Response>;
};

type Bindings = {
  ykts_status_metrics?: KVNamespace;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
  SESSION?: KVNamespace;
  DB?: ChatDb;
  GEMINI_API_KEY?: string;
  ASSETS?: Fetcher;
};

export const app = new Hono<{ Bindings: Bindings }>();

const CONTACT_URL = 'https://ykts.net/contact/';

// knowledge.json は astro build 後に dist へ静的アセットとして配置される（package.json の build スクリプト参照）。
// Worker バンドル時点ではまだ存在しないため import できず、初回リクエストで ASSETS 経由で読み、
// Worker インスタンスの生存中（モジュールスコープ）だけキャッシュする。
let knowledgePromise: Promise<string> | null = null;

async function loadKnowledge(assets: Fetcher, origin: string): Promise<string> {
  if (!knowledgePromise) {
    knowledgePromise = (async () => {
      const res = await assets.fetch(`${origin}/knowledge.json`);
      if (!res.ok) {
        throw new Error(`failed to fetch knowledge.json: ${res.status}`);
      }
      const doc = (await res.json()) as KnowledgeDocument;
      return doc.pages.map((p) => `# ${p.url}\n\n${p.text}`).join('\n\n');
    })().catch((err) => {
      knowledgePromise = null;
      throw err;
    });
  }
  return knowledgePromise;
}

app.use('/api/status', cors());
app.use('/api/sv6-status', cors());

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
    status: 'logical_efficiency_verified',
  });
});

app.get('/api/status', async (c) => {
  const kv = c.env?.ykts_status_metrics;
  if (!kv) {
    return c.json({ error: 'kv_not_bound' }, 500);
  }
  const raw = await kv.get('status:latest');
  if (!raw) {
    return c.json({ error: 'no_data' }, 404);
  }
  const data = JSON.parse(raw);
  return c.json(data);
});

app.get('/api/sv6-status', async (c) => {
  const kv = c.env?.ykts_status_metrics;
  if (!kv) {
    return c.json({ error: 'kv_not_bound' }, 500);
  }
  const raw = await kv.get('status:sv6');
  if (!raw) {
    return c.json({ error: 'no_data' }, 404);
  }
  const data = JSON.parse(raw);
  return c.json(data);
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.post('/api/contact', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !phone) {
    return c.json({ error: 'name, email, phone are required' }, 400);
  }

  const token = String(body.cfToken || '');
  const tsSecret = c.env?.TURNSTILE_SECRET_KEY;
  if (tsSecret && token) {
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: tsSecret, response: token }),
    });
    const tsData = (await tsRes.json()) as { success: boolean };
    if (!tsData.success) {
      return c.json({ error: 'turnstile_failed' }, 403);
    }
  }

  const botToken = c.env?.TELEGRAM_BOT_TOKEN;
  const chatId = c.env?.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    return c.json({ error: 'server_config_error' }, 500);
  }

  const text = [
    `📩 <b>Contact Form</b>`,
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    `<b>Phone:</b> ${escapeHtml(phone)}`,
    message ? `\n<b>Message:</b>\n${escapeHtml(message)}` : '',
  ].filter(Boolean).join('\n');

  const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!telegramRes.ok) {
    console.error('Telegram API failed:', telegramRes.status);
    return c.json({ error: 'notification_failed' }, 502);
  }

  return c.json({ ok: true });
});

app.post('/api/chat', async (c) => {
  const db = c.env?.DB;
  const apiKey = c.env?.GEMINI_API_KEY;
  const assets = c.env?.ASSETS;

  if (!db || !apiKey || !assets) {
    console.error('folio-agent chat: DB, GEMINI_API_KEY or ASSETS not bound');
    return c.json({ error: 'server_config_error' }, 500);
  }

  let knowledge: string;
  try {
    const origin = new URL(c.req.url).origin;
    knowledge = await loadKnowledge(assets, origin);
  } catch (err) {
    console.error('folio-agent chat: failed to load knowledge.json:', err);
    return c.json({ error: 'knowledge_unavailable' }, 500);
  }

  const handler = createChatHandler({
    db,
    generateAnswer: createGeminiGenerator({ apiKey, knowledge, contactUrl: CONTACT_URL }),
  });

  return handler(c.req.raw);
});
