import { describe, it, expect, vi, afterEach } from 'vitest';
import { app } from './api';

afterEach(() => {
  vi.restoreAllMocks();
});

const req = (path: string, init?: RequestInit) =>
  new Request(`http://localhost${path}`, init);

const jsonReq = (path: string, body: unknown) =>
  req(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

// --- /api/contact ---

const validBody = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '09012345678',
  message: 'Hello',
};

const envWithWebhook = {
  TELEGRAM_BOT_TOKEN: '123456:abcdef',
  TELEGRAM_CHAT_ID: '987654',
};

describe('POST /api/contact', () => {
  it('400 for invalid JSON', async () => {
    const res = await app.fetch(
      req('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      }),
      {}
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'invalid_json' });
  });

  it('400 when required fields missing', async () => {
    const res = await app.fetch(jsonReq('/api/contact', { name: 'Test' }), {});
    expect(res.status).toBe(400);
  });

  it('500 when Telegram config not configured', async () => {
    const res = await app.fetch(jsonReq('/api/contact', validBody), {});
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: 'server_config_error' });
  });

  it('200 on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    );
    const res = await app.fetch(jsonReq('/api/contact', validBody), envWithWebhook);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
  });

  it('502 when Telegram API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    );
    const res = await app.fetch(jsonReq('/api/contact', validBody), envWithWebhook);
    expect(res.status).toBe(502);
  });

  it('403 when Turnstile verification fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false }), { status: 200 })
      )
    );
    const res = await app.fetch(
      jsonReq('/api/contact', { ...validBody, cfToken: 'bad-token' }),
      { ...envWithWebhook, TURNSTILE_SECRET_KEY: 'test-secret' }
    );
    expect(res.status).toBe(403);
  });

  it('403 when secret is set but cfToken is empty, without calling siteverify', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await app.fetch(
      jsonReq('/api/contact', validBody),
      { ...envWithWebhook, TURNSTILE_SECRET_KEY: 'test-secret' }
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: 'turnstile_failed' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('200 when secret is not set, regardless of cfToken', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    );
    const res = await app.fetch(jsonReq('/api/contact', validBody), envWithWebhook);
    expect(res.status).toBe(200);
  });

  it('200 when secret is not set and cfToken is given, without calling siteverify', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await app.fetch(
      jsonReq('/api/contact', { ...validBody, cfToken: 'some-token' }),
      envWithWebhook
    );
    expect(res.status).toBe(200);
    const urls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(urls.some((u) => u.includes('siteverify'))).toBe(false);
  });
});
