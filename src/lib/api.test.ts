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

// --- /api/hello ---

describe('GET /api/hello', () => {
  it('200 with fixed payload', async () => {
    const res = await app.fetch(req('/api/hello'), {});
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: 'Hello from Hono!',
      status: 'logical_efficiency_verified',
    });
  });
});

// --- /api/status ---

describe('GET /api/status', () => {
  it('500 when KV not bound', async () => {
    const res = await app.fetch(req('/api/status'), {});
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: 'kv_not_bound' });
  });

  it('404 when no data in KV', async () => {
    const res = await app.fetch(req('/api/status'), {
      ykts_status_metrics: { get: vi.fn().mockResolvedValue(null) },
    });
    expect(res.status).toBe(404);
  });

  it('200 with parsed KV data', async () => {
    const data = { equity: 100000, status: 'active' };
    const res = await app.fetch(req('/api/status'), {
      ykts_status_metrics: {
        get: vi.fn().mockResolvedValue(JSON.stringify(data)),
      },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(data);
  });
});

// --- /api/sv6-status ---

describe('GET /api/sv6-status', () => {
  it('500 when KV not bound', async () => {
    const res = await app.fetch(req('/api/sv6-status'), {});
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: 'kv_not_bound' });
  });

  it('404 when no data in KV', async () => {
    const res = await app.fetch(req('/api/sv6-status'), {
      ykts_status_metrics: { get: vi.fn().mockResolvedValue(null) },
    });
    expect(res.status).toBe(404);
  });

  it('200 with parsed KV data', async () => {
    const data = { equity: 200000, status: 'active' };
    const res = await app.fetch(req('/api/sv6-status'), {
      ykts_status_metrics: {
        get: vi.fn().mockResolvedValue(JSON.stringify(data)),
      },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(data);
  });
});

// --- /api/contact ---

const validBody = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '09012345678',
  category: 'general',
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

  it('Turnstile skipped when no token provided', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    );
    const res = await app.fetch(
      jsonReq('/api/contact', validBody),
      { ...envWithWebhook, TURNSTILE_SECRET_KEY: 'test-secret' }
    );
    expect(res.status).toBe(200);
  });
});

// --- /api/chat ---

describe('POST /api/chat', () => {
  it('500 when DB, GEMINI_API_KEY or ASSETS not bound', async () => {
    const res = await app.fetch(jsonReq('/api/chat', { message: 'hi' }), {});
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: 'server_config_error' });
  });
});
