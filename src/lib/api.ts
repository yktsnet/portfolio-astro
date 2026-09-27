import { Hono } from 'hono';
import { collectAnswerLinks, createChatHandler, createGeminiGenerator, formatKnowledge } from '@folio-agent/handler';
import type { AnswerLink, KnowledgeDocument } from '@folio-agent/handler';

// Cloudflare バインディングの境界。D1Database の型は @folio-agent/handler から導出し、
// このリポには存在しない @cloudflare/workers-types を追加しない。
type ChatDb = Parameters<typeof createChatHandler>[0]['db'];

type Fetcher = {
  fetch(input: string): Promise<Response>;
};

type Bindings = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
  DB?: ChatDb;
  GEMINI_API_KEY?: string;
  ASSETS?: Fetcher;
};

export const app = new Hono<{ Bindings: Bindings }>();

const CONTACT_URL = 'https://ykts.net/contact/';

// knowledge.json は astro build 後に dist へ静的アセットとして配置される（package.json の build スクリプト参照）。
// Worker バンドル時点ではまだ存在しないため import できず、初回リクエストで ASSETS 経由で読み、
// Worker インスタンスの生存中（モジュールスコープ）だけキャッシュする。
type LoadedKnowledge = { knowledge: string; answerLinks: AnswerLink[] };

let knowledgePromise: Promise<LoadedKnowledge> | null = null;

async function loadKnowledge(assets: Fetcher, origin: string): Promise<LoadedKnowledge> {
  if (!knowledgePromise) {
    knowledgePromise = (async () => {
      const res = await assets.fetch(`${origin}/knowledge.json`);
      if (!res.ok) {
        throw new Error(`failed to fetch knowledge.json: ${res.status}`);
      }
      const doc = (await res.json()) as KnowledgeDocument;
      return { knowledge: formatKnowledge(doc), answerLinks: collectAnswerLinks(doc, CONTACT_URL) };
    })().catch((err) => {
      knowledgePromise = null;
      throw err;
    });
  }
  return knowledgePromise;
}

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
  if (tsSecret) {
    if (!token) {
      return c.json({ error: 'turnstile_failed' }, 403);
    }
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: tsSecret, response: token }),
    });
    const tsData = (await tsRes.json()) as { success: boolean; 'error-codes'?: string[] };
    if (!tsData.success) {
      console.warn('Turnstile verification failed:', tsData['error-codes']);
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

  let loaded: LoadedKnowledge;
  try {
    const origin = new URL(c.req.url).origin;
    loaded = await loadKnowledge(assets, origin);
  } catch (err) {
    console.error('folio-agent chat: failed to load knowledge.json:', err);
    return c.json({ error: 'knowledge_unavailable' }, 500);
  }

  const handler = createChatHandler({
    db,
    answerLinks: loaded.answerLinks,
    generateAnswer: createGeminiGenerator({ apiKey, knowledge: loaded.knowledge, contactUrl: CONTACT_URL }),
  });

  return handler(c.req.raw);
});
