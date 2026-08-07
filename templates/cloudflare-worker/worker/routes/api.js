import { createAppService } from '../services/app-service.js';

export async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  const service = createAppService(env);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    return Response.json(await service.health());
  }

  return Response.json({ ok: false, error: 'Not Found' }, { status: 404 });
}
