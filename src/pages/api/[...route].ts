import { env } from 'cloudflare:workers';
import { app } from '../../lib/api';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = ({ request }) => {
  return app.fetch(request, env as any);
};

export const prerender = false;
