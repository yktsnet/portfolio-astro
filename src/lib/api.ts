import { Hono } from 'hono';
type Bindings = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
};

export const app = new Hono<{ Bindings: Bindings }>();

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
