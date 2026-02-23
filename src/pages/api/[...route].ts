import { Hono } from 'hono';

const app = new Hono();

app.get('/hello', (c) => {
  return c.json({ 
    message: 'Hello from Hono!',
    status: 'logical_efficiency_verified'
  });
});

export const ALL = ({ request }) => app.fetch(request);
export const prerender = false;
