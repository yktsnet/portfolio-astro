import { Hono } from 'hono';
import { cors } from 'hono/cors';

type KVNamespace = {
  get(key: string): Promise<string | null>;
};

type Bindings = {
  ykts_status_metrics?: KVNamespace;
  CONTACT_DISCORD_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
  SESSION?: KVNamespace;
};

export const app = new Hono<{ Bindings: Bindings }>();

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

app.post('/api/contact', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const category = String(body.category || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !phone || !category) {
    return c.json({ error: 'name, email, phone, category are required' }, 400);
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

  const webhookUrl = c.env?.CONTACT_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('CONTACT_DISCORD_WEBHOOK_URL not set');
    return c.json({ error: 'server_config_error' }, 500);
  }

  const embed = {
    embeds: [
      {
        title: '📩 Contact Form',
        color: 0x5de4c7,
        fields: [
          { name: 'Name', value: name, inline: true },
          { name: 'Email', value: email, inline: true },
          { name: 'Phone', value: phone, inline: true },
          { name: 'Category', value: category, inline: true },
          ...(message ? [{ name: 'Message', value: message.slice(0, 1024) }] : []),
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const discordRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(embed),
  });

  if (!discordRes.ok) {
    console.error('Discord webhook failed:', discordRes.status);
    return c.json({ error: 'notification_failed' }, 502);
  }

  return c.json({ ok: true });
});
