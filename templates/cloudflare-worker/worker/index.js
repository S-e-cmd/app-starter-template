import { handleApiRequest } from './routes/api.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }
    return new Response('Not Found', { status: 404 });
  }
};
