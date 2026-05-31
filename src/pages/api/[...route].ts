import { app } from '../../lib/api';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env ?? {};
  return app.fetch(request, env);
};

export const prerender = false;
