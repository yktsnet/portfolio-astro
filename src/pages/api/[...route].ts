import { Hono } from 'hono';

const app = new Hono();

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
    status: 'logical_efficiency_verified',
  });
});

app.post('/contact', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !phone) {
    return c.json({ error: 'name, email, phone are required' }, 400);
  }

  // Turnstile verification
  const token = String(body.cfToken || '');
  const tsSecret = (c.env as any).TURNSTILE_SECRET_KEY;
  if (tsSecret) {
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

  // Discord webhook
  const webhookUrl = (c.env as any).CONTACT_DISCORD_WEBHOOK_URL;
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

export const ALL = ({ request, locals }: { request: Request; locals: any }) => {
  // Pass Cloudflare env bindings to Hono context
  const env = locals?.runtime?.env ?? {};
  return app.fetch(request, env);
};
export const prerender = false;
