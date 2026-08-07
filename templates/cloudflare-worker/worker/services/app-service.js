import { createAppRepository } from '../repositories/app-repository.js';

export function createAppService(env) {
  const repository = createAppRepository(env);

  return {
    async health() {
      return { ok: true, storage: await repository.storageStatus() };
    }
  };
}
